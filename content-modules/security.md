# AIActRadar — Security & compliance

## What we handle
AIActRadar processes the text or configuration you submit to produce its output. We do not train public models on your submissions without explicit consent.

## Data handling commitments
- Inputs are used only to produce your result; not published or indexed by us.
- Payments processed by Waffo Pancake (merchant of record) — we do not store card data.
- Exports contain only your own run data.

## Compliance posture
- EU AI Act mapping and high-risk obligation logging where applicable. [ref: EU AI Act](https://artificialintelligenceact.eu/)
- GDPR-aligned data handling (lawful basis, minimization, access on request). [ref: GDPR](https://gdpr.eu/)
- OWASP guidance for web app security and LLM prompt-injection hygiene. [ref: OWASP](https://owasp.org/)

## ⚠️ We do NOT guarantee
- We do **NOT guarantee** compliance with any regulation.
- We do **NOT claim 100%** security or uptime.
- We do **NOT promise** the tool will "never miss" an issue — coverage is fixed at the named checks.

## Subprocessors
| Subprocessor | Purpose | Region |
|---|---|---|
| Waffo Pancake | Payments (merchant of record) | [region] |
| NVIDIA NIM | LLM inference (platform key) | [region] |
| Vercel | App hosting | Global edge |
