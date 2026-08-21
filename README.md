# AIActRadar

> Turn EU AI Act chaos into a clear compliance roadmap.
>
> AIActRadar maps your AI systems to their EU AI Act obligations, auto-generates risk registers and technical documentation, and keeps you ahead of every phased compliance deadline.

AI-powered micro-SaaS — part of the OPC product factory. Web-first (Next.js 14),
deployable to Vercel, subscription-ready.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY for real AI
npm run dev                  # http://localhost:3000
```

Without an API key the app runs in **Mock mode** (returns a demo output).

## Build & deploy (Vercel)

```bash
npm run build
# Vercel: import repo, set framework = Next.js, root = 12_Micro_SaaS出海/aiactradar
```

## Payments (subscription)

Wire Stripe or Waffo in `pages/api/checkout` (template not included — add per product).
Web-first checkout keeps fees at 2–5% and avoids the 30% app-store cut.

## Config

All product-specific text lives in `lib/product.ts` (name, inputs, system prompt,
pricing, mock). To clone a new product, copy this folder and edit `lib/product.ts`.
