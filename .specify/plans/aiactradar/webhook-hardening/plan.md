# plan.md — webhook-hardening（§10 Spec Kit · Plan）

设计原则：**对齐 `pages/api/webhook.ts` 的硬化逻辑，但保留 `pages/api/waffo-webhook.ts` 的 Umami 转发职责**。改动面仅限 `waffo-webhook.ts` 一个文件（加部署期 env 注入），属 surgical、non-breaking（§4 Do/Don't）。

---

## P0 预处理（§10 实务要点①）

- 备份源码 `pages/api/waffo-webhook.ts`（排除 `node_modules/`、`.next/`）。
- 确认 `.data/` 目录存在（仓库根已存在 `.data`，见 `ls -la`，2026-07-23 创建）。

---

## P1 验签硬化（对齐 §2 + `webhook.ts:137-148`）

**文件**：`pages/api/waffo-webhook.ts`

- **删除「验签失败仍转发 UNVERIFIED」分支**：现 L213–228 的 `if (verifyMode !== 'none' && !verified)` 块仅 `console.error` + 继续转发。改为验签失败时 `return res.status(401).end('Invalid signature')`。
- **缺失签名头 → 401**：参照 `webhook.ts:137-138`，当 `getSignature(req)` 为空 → `return res.status(401).end('Missing signature')`。
- **无密钥注入 = fail-closed**：当 `WAFFO_WEBHOOK_SECRET` 与 `WAFFO_WEBHOOK_PUBLIC_KEY` 均未注入时，启动期 `console.error('[waffo-webhook] no webhook key configured; failing closed')`；运行时对所有 POST 直接 `return res.status(401).end(...)`，**不静默转发**。
- **RSA 路径优先改用 SDK `verifyWebhook`**：`event = verifyWebhook(raw, sig)`（RSA-SHA256，自动 test/prod 解析，built-in key 兜底，见 d.ts L1934–1961）。保留既有 `hmacVerify`（L67–106）作 HMAC 分支。dual-mode 由注入密钥决定（与现状 L215–221 一致）。
- **保留**：`PURCHASE_EVENTS` / `REFUND_EVENTS` 分类（L28–44）、`forwardToUmami`（L163–201）、解析与转发主干。

---

## P2 持久化幂等（对齐 §2 + `webhook.ts:30-34, 53-81`）

**文件**：`pages/api/waffo-webhook.ts`

- **移除模块级内存 `seen` Set**（现 L153–161）。
- **引入持久去重**：
  - `const DELIVERY_LOG = path.join(process.cwd(), '.data/waffo-deliveries.jsonl')`（event.id 级，逐行追加；查重参考 `webhook.ts` `alreadySeen` / `markSeen` 的「load JSON / 写回」模式，或轻量「read + scan 是否含 eventId」）。
  - **orderId 级**：转发 Umami 前检查 `waffo-deliveries.jsonl` 是否已含该 `orderId`；已含则跳过并记录（类比 `webhook.ts:71-81` `alreadyFulfilled`）。
- **记录格式**（每行 JSON，兼作审计轨迹，类比 `webhook.ts` 的 fulfilled-orders.jsonl）：
  ```json
  {"eventId":"...","orderId":"...","type":"order.completed","amount":"29.00","currency":"USD","ts":1719...}
  ```
- **注意 Vercel FS 只读限制**（见 spec.md §7）：文件法为最小硬化；跨冷启动真幂等需 KV（后续任务 T6）。

---

## P3 密钥注入（部署任务，不由本 spec 决定取值）

- **Vercel env 注入项**：`WAFFO_WEBHOOK_PUBLIC_KEY`（RSA PEM，**推荐**）**或** `WAFFO_WEBHOOK_SECRET`（HMAC）。运营据 Waffo 实际签名方案二选一。
- 不写 `.env.local`、不落密钥到仓库（§4 ❌ 不提交机密）。

---

## P4 明确不改项

- ❌ 不改 `setup_waffo_webhooks.mjs`（注册脚本）。
- ❌ 不改 URL（vercel.app 域名替换列为后续部署任务）。
- ❌ 不激活 `webhook.ts`。
- ❌ 不改事件分类 / Umami 转发体。

---

## P5 验证（§10 步骤 5）与部署（§10 步骤 6）提示

- **Verify**：用 `tsx` 跑确定性自测（§10 实务②；项目 `tsconfig.json` 会干扰 `tsc` 直编不产出），断言：① bad sig → 401；② 重复 `event.id` → 仅一次转发；③ 无密钥 → 401。自测须在 **deploy 之前**（§9.8）。
- **Ship**：`vercel deploy --prod --yes`（§10 实务④，远程构建）。
- **硬化后须重新注册正确端点 URL**（见 spec.md §5 范围外注）。
