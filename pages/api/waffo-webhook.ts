import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { verifyWebhook } from '@waffo/pancake-ts'

export const config = { api: { bodyParser: false } }

// Per-app slug — used as the Umami `hostname` / `item_id` fallback. The Waffo
// Pancake webhook payload carries NO product slug, so revenue is attributed to
// the app itself.
const APP_SLUG = 'aiactradar'

const UMAMI_URL = (process.env.NEXT_PUBLIC_UMAMI_URL || '').replace(/\/$/, '')
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID

// --- Dual-mode webhook verification (§2 Waffo pattern: fail-closed) ---
//   (A) HMAC-SHA256 shared secret  -> set WAFFO_WEBHOOK_SECRET
//   (B) RSA-SHA256 (SDK verifyWebhook) -> set BOTH Waffo public keys:
//         WAFFO_WEBHOOK_PROD_PUBLIC_KEY (PEM, production)
//         WAFFO_WEBHOOK_TEST_PUBLIC_KEY (PEM, test mode)
//       Calling verifyWebhook(raw, sig) WITHOUT a per-call publicKey override
//       makes the SDK auto-resolve both env keys and try them (prod first),
//       so a single receiver validates events from either Waffo environment.
// If NO key is configured we reject every POST (401). We never forward
// UNVERIFIED events: a forged / replayed event would poison the analytics
// board, and the operator can spot the gap via the 401s in the function logs.
const WAFFO_WEBHOOK_SECRET = process.env.WAFFO_WEBHOOK_SECRET
const WAFFO_WEBHOOK_PROD_PUBLIC_KEY = process.env.WAFFO_WEBHOOK_PROD_PUBLIC_KEY
const WAFFO_WEBHOOK_TEST_PUBLIC_KEY = process.env.WAFFO_WEBHOOK_TEST_PUBLIC_KEY

// Revenue events that must be forwarded to Umami as a `purchase`.
const PURCHASE_EVENTS = new Set([
  'order.completed',
  'subscription.activated',
  'subscription.payment_succeeded',
  // Defensive: SDK WebhookEventType enum spellings, in case Waffo emits them.
  'OrderCompleted',
  'SubscriptionActivated',
  'SubscriptionPaymentSucceeded',
])

// Refund events: log only, never forward revenue to Umami.
const REFUND_EVENTS = new Set([
  'refund.succeeded',
  'refund.failed',
  'RefundSucceeded',
  'RefundFailed',
])

// Read the raw body (Pages Router requires bodyParser:false so we can verify
// the exact bytes against the signature).
function readRaw(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function getSignature(req: NextApiRequest): string | null {
  return (
    (req.headers['x-waffo-signature'] as string) ||
    (req.headers['waffo-signature'] as string) ||
    null
  )
}

// HMAC-SHA256 verification, per docs.waffo.ai/zh/features/integrations.
// The Waffo signature header may be raw hex, `t=<ts>,v1=<sig>`, or `sha256=<sig>`.
function hmacVerify(payload: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) return false

  // Extract the signature portion (strip t= / v1= / sha256= prefixes).
  let sig = signatureHeader.trim()
  const v1 = /(?:^|,)v1=([^,\s]+)/i.exec(sig)
  if (v1) sig = v1[1].trim()
  else {
    const sha = /sha256=([^,\s]+)/i.exec(sig)
    if (sha) sig = sha[1].trim()
    else sig = sig.replace(/^t=\d+,?/i, '').trim()
  }
  if (!sig) return false

  const expectedHex = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  const expectedB64 = crypto.createHmac('sha256', secret).update(payload).digest('base64')

  for (const expected of [expectedHex, expectedB64]) {
    try {
      if (
        sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
      ) {
        return true
      }
    } catch {
      /* try next encoding */
    }
    try {
      const sb = Buffer.from(sig, 'base64')
      const eb = Buffer.from(expected, 'base64')
      if (sb.length && eb.length && sb.length === eb.length && crypto.timingSafeEqual(sb, eb)) {
        return true
      }
    } catch {
      /* try next encoding */
    }
  }
  return false
}

// --- Persistent delivery dedup (event.id + orderId) ---
// Replaces the old in-memory `seen` Set, which Vercel cold-starts wiped on
// every restart (causing double-counted revenue in Umami). Writes one JSON
// line per delivery to .data/waffo-deliveries.jsonl. NOTE: Vercel's serverless
// FS is read-only except /tmp, so this file does NOT truly survive cold starts
// in production — it is the minimum hardening; true cross-cold-start idempotency
// needs Vercel KV / Upstash Redis (see spec T6). Blast radius here is analytics
// double-counting only, not lost or double-charged orders.
const DELIVERY_LOG = path.join(process.cwd(), '.data/waffo-deliveries.jsonl')

function loadDeliveryKeys(): Set<string> {
  try {
    const lines = fs.existsSync(DELIVERY_LOG)
      ? fs.readFileSync(DELIVERY_LOG, 'utf-8').split('\n')
      : []
    const s = new Set<string>()
    for (const l of lines) {
      if (!l.trim()) continue
      try {
        const r = JSON.parse(l)
        if (r.eventId) s.add(r.eventId)
        if (r.orderId) s.add('order:' + r.orderId)
      } catch {
        /* skip malformed line */
      }
    }
    return s
  } catch {
    return new Set()
  }
}

export function recordDelivery(r: {
  eventId?: string
  orderId?: string
  type?: string
  amount?: string
  currency?: string
}) {
  try {
    const row = { eventId: r.eventId, orderId: r.orderId, type: r.type, amount: r.amount, currency: r.currency, ts: Date.now() }
    fs.appendFileSync(DELIVERY_LOG, JSON.stringify(row) + '\n')
  } catch (e) {
    console.error('[waffo-webhook] delivery log write failed', e)
  }
}

/** Returns true if this eventId / orderId was already delivered (persistent). */
export function isDuplicate(eventId?: string, orderId?: string): boolean {
  if (!eventId && !orderId) return false
  const seen = loadDeliveryKeys()
  if (eventId && seen.has(eventId)) return true
  if (orderId && seen.has('order:' + orderId)) return true
  return false
}

/**
 * Verify a raw body + signature. Returns true only when a key is configured AND
 * the signature checks out. Any throw (bad/missing sig, wrong key) is treated as
 * false — the caller maps false -> 401 (fail-closed).
 */
export function verifyWebhookSignature(raw: string, sig: string | null): boolean {
  if (!sig) return false
  if (WAFFO_WEBHOOK_PROD_PUBLIC_KEY || WAFFO_WEBHOOK_TEST_PUBLIC_KEY) {
    try {
      // RSA-SHA256 via SDK. Call WITHOUT a per-call publicKey override so the
      // SDK auto-resolves WAFFO_WEBHOOK_PROD_PUBLIC_KEY + WAFFO_WEBHOOK_TEST_PUBLIC_KEY
      // from env and tries both (prod first). This verifies events from either
      // Waffo environment with the correct matching key.
      verifyWebhook(raw, sig)
      return true
    } catch {
      return false
    }
  }
  if (WAFFO_WEBHOOK_SECRET) {
    return hmacVerify(raw, sig, WAFFO_WEBHOOK_SECRET)
  }
  return false
}

async function forwardToUmami(p: {
  currency: string
  value: string
  transaction_id: string
  item_id: string
  item_name: string
}) {
  if (!UMAMI_ID || !UMAMI_URL) {
    console.warn('[waffo-webhook] UMAMI env not set; skipping purchase forward (no crash)')
    return
  }
  const body = {
    payload: {
      website: UMAMI_ID,
      name: 'purchase',
      data: {
        currency: p.currency,
        value: p.value,
        transaction_id: p.transaction_id,
        item_id: p.item_id,
        item_name: p.item_name,
      },
      url: '/waffo-webhook',
      hostname: APP_SLUG,
    },
  }
  try {
    const res = await fetch(`${UMAMI_URL}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error(`[waffo-webhook] Umami send failed: ${res.status}`)
    }
  } catch (e) {
    console.error('[waffo-webhook] Umami send error', e)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const raw = (await readRaw(req)).toString('utf8')

  // Fail-closed: no key configured at all -> reject. (§2 Waffo pattern)
  if (!WAFFO_WEBHOOK_SECRET && !WAFFO_WEBHOOK_PROD_PUBLIC_KEY && !WAFFO_WEBHOOK_TEST_PUBLIC_KEY) {
    console.error('[waffo-webhook] no webhook key configured; failing closed (401).')
    return res.status(401).end('Webhook verification not configured')
  }

  const sig = getSignature(req)
  if (!sig) return res.status(401).end('Missing signature')

  const verified = verifyWebhookSignature(raw, sig)
  if (!verified) {
    // Bad signature -> reject. Do NOT forward UNVERIFIED.
    return res.status(401).end('Invalid signature')
  }

  // --- Parse payload ---
  let event: any
  try {
    event = JSON.parse(raw)
  } catch (e) {
    return res.status(200).json({ received: true, verified })
  }

  const eventType: string = event?.eventType || event?.type || ''
  const data: any = event?.data || {}

  // Refunds: log only, never forward revenue.
  if (REFUND_EVENTS.has(eventType)) {
    console.log(`[waffo-webhook] refund event (not forwarded): ${eventType}`, {
      orderId: data.orderId,
      eventId: event?.eventId,
    })
    return res.status(200).json({ received: true, verified, kind: 'refund' })
  }

  // Revenue events -> forward a `purchase` event to Umami (with persistent dedup).
  if (PURCHASE_EVENTS.has(eventType)) {
    const eventId = event?.id || event?.eventId
    const orderId = data?.orderId
    if (isDuplicate(eventId, orderId)) {
      console.log('[waffo-webhook] duplicate delivery; skipping')
      return res.status(200).json({ received: true, verified, dup: true })
    }
    const currency = String(data?.currency || 'USD').toUpperCase()
    const value = String(data?.amount ?? 0) // amount is a NUMBER per spec -> coerce to string
    const transaction_id = orderId || eventId || `waffo_${Date.now()}`
    const item_name = data?.productName || APP_SLUG
    const item_id = APP_SLUG // no product slug in the payload
    recordDelivery({ eventId, orderId, type: eventType, amount: value, currency })
    await forwardToUmami({ currency, value, transaction_id, item_id, item_name })
  }

  // Always 200 so Waffo does not retry-loop (verification already happened above).
  return res.status(200).json({ received: true, verified })
}
