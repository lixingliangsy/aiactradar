import { WaffoPancake } from '@waffo/pancake-ts';
import fs from 'fs';

const ENV_PATH = 'E:/AgentCPM/07_一人公司出海项目/12_Micro_SaaS出海/aiactradar/.env.local';

function loadEnvLocal() {
  let raw = fs.readFileSync(ENV_PATH, 'utf8');
  raw = raw.replace(/^\uFEFF/, ''); // strip BOM
  const out = {};
  for (const line of raw.split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#') || !s.includes('=')) continue;
    const i = s.indexOf('=');
    out[s.slice(0, i).trim()] = s.slice(i + 1).trim();
  }
  return out;
}

const env = loadEnvLocal();
const merchantId = env.WAFFO_MERCHANT_ID;
const privateKey = env.WAFFO_PRIVATE_KEY; // raw base64; SDK normalizes to PEM
if (!merchantId || !privateKey) {
  console.error('FATAL: WAFFO_MERCHANT_ID / WAFFO_PRIVATE_KEY missing from .env.local');
  process.exit(1);
}

const client = new WaffoPancake({ merchantId, privateKey });

const STORE = 'STO_6p1cnwJDlk6gzVNUCQdWqN';
const WH = [
  { slug: 'aiactradar',   url: 'https://aiactradar.vercel.app/api/waffo-webhook' },
  { slug: 'agentredteam', url: 'https://agentredteam-coral.vercel.app/api/waffo-webhook' },
  { slug: 'privacyscan',  url: 'https://privacyscan-ten.vercel.app/api/waffo-webhook' },
];
const EVENTS = [
  'order.completed',
  'subscription.activated',
  'subscription.payment_succeeded',
  'refund.succeeded',
  'refund.failed',
];

for (const w of WH) {
  try {
    const res = await client.webhooks.add({
      storeId: STORE,
      channel: 'http',
      url: w.url,
      events: EVENTS,
      testMode: false,
    });
    console.log('OK', w.slug, JSON.stringify(res));
  } catch (e) {
    console.error('ERR', w.slug, e?.message || String(e));
  }
}
