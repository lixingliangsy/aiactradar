import crypto from 'crypto'
import { verifyWebhook } from '@waffo/pancake-ts'

// 1) Generate a local RSA keypair to stand in for the Waffo test key.
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
const pubPem = publicKey.export({ type: 'spki', format: 'pem' })
// 2) Simulate the deployed config: only the TEST public key is set (prod unset).
process.env.WAFFO_WEBHOOK_TEST_PUBLIC_KEY = pubPem

const payload = JSON.stringify({
  eventType: 'order.completed',
  id: 'evt_roundtrip_1',
  data: { orderId: 'o_1', amount: '59', currency: 'USD' },
})

// 3) Replicate Waffo's signing: signatureInput = `${t}.${payload}`, RSA-SHA256, base64.
const t = String(Date.now())
const signatureInput = `${t}.${payload}`
const v1 = crypto.createSign('RSA-SHA256').update(signatureInput).sign(privateKey, 'base64')
const header = `t=${t},v1=${v1}`

// 4) Call exactly like the deployed handler (no per-call override -> SDK auto-tries prod+test).
try {
  const r = verifyWebhook(payload, header)
  console.log('ROUND-TRIP OK -> eventType:', r.eventType, '| id:', r.id)
} catch (e) {
  console.log('ROUND-TRIP FAILED ->', e.message)
}

// 5) A tampered/garbage signature must be rejected.
try {
  verifyWebhook(payload, `t=${t},v1=AAAAAAAAAAAAAAAA`)
  console.log('GARBAGE-SIG: UNEXPECTEDLY ACCEPTED (BUG)')
} catch (e) {
  console.log('GARBAGE-SIG correctly rejected ->', e.message)
}

// 6) A missing header must throw (handler maps to 401).
try {
  verifyWebhook(payload, '')
  console.log('MISSING-SIG: UNEXPECTEDLY ACCEPTED (BUG)')
} catch (e) {
  console.log('MISSING-SIG correctly rejected ->', e.message)
}
