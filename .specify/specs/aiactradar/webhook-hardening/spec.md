# spec.md — webhook-hardening（§10 Spec Kit · Constitution → Specify）

- **product**：aiactradar
- **spec**：webhook-hardening
- **类型**：bug-fix / hardening（小 spec，走 §10 轻量 spec 路径，非新功能）
- **目标端**：`pages/api/waffo-webhook.ts`（live，营收事件 → Umami analytics 转发器）
- **溯源**：§11.8 ima KB1 `7354338238295398` / KB2 `7389943097721763`（标题 + KB ID 级）

---

## 0. Constitution 来源（已读 `OPC_Migration_Kit/agent.md`）

| 条款 | 行号 | 关键约束 |
|---|---|---|
| §2 Waffo pattern | 41–48 | 验签失败返回 401；hub-only receiver；持久化幂等（event.id + orderId 双去重，落 `.data/fulfilled-orders.jsonl`）；Waffo 是 source of truth |
| §6 验收门 | 84–88 | 中枢独立复验 Waffo 幂等（event.id + orderId 去重，记录落 `.data/fulfilled-orders.jsonl`） |
| §10 Spec Kit 门禁 | 143–170 | 所有改动（含修 bug）须走 Spec Kit 0→6，产物落 `.specify/...`；Ship 用 `vercel deploy --prod --yes` |
| §11.8 ima 溯源 | 201–205 | 战术动作须可溯源到 ima 订阅库（KB1 / KB2） |

---

## 1. 问题陈述

live webhook 接收端 `pages/api/waffo-webhook.ts` 已生产上线（2026-07-13），实际职责是「营收事件 → Umami analytics 转发器」，**不铸许可证**。它偏离 §2 三条硬约束。合规参考实现 `pages/api/webhook.ts`（用 SDK `verifyWebhook` 做 RSA-SHA256、bad sig → 401、持久化 `.data/fulfilled-orders.jsonl`）**存在但未被注册 / 未运行**。

本 spec 仅硬化 `waffo-webhook.ts` 使其满足 §2 的「验签 + 持久化幂等」，同时**保留其 Umami 转发职责**，不把它变成许可证铸造端。

---

## 2. §2 偏离项（核验后，非假设）

| # | §2 要求 | live 现状（文件:行，已 Read 确认） | 严重度 | 后果 |
|---|---|---|---|---|
| D1 | 验签失败返回 401 | `waffo-webhook.ts:213-228` 仅 `console.error` + **仍转发 UNVERIFIED**；`:267` 恒返回 200 | 致命 | 伪造 / 重放事件被静默接受 |
| D2 | 持久化幂等（event.id + orderId，落 `.data/fulfilled-orders.jsonl`） | `waffo-webhook.ts:153-161` 用**模块级内存 `seen` Set**；Vercel 冷启动即重置 | 致命 | 分析重复计数（双计营收） |
| D3 | 密钥经 env 注入 | `.env.local`（已 Read）仅含 `WAFFO_MERCHANT_ID` / `WAFFO_PRIVATE_KEY` / `WAFFO_BASE_URL`；**未配** `WAFFO_WEBHOOK_SECRET` / `WAFFO_WEBHOOK_PUBLIC_KEY` | 部署缺口 | 当前无密钥 → 验签形同虚设 |

**补充观察（非本 spec 范围，记录给中枢）**：§2 设想的 receiver 是 `pages/api/webhook.ts`（铸许可证 + 401 + 持久化），但该端未注册；生产实际跑的是 `waffo-webhook.ts`（仅 Umami 转发）。两者职责不一致，属更大范围议题。本 spec 只硬化 `waffo-webhook.ts`，不替运营决定是否切到 `webhook.ts`。

---

## 3. 目标（本 spec 范围）

硬化 `pages/api/waffo-webhook.ts`，满足 §2 验签 + 幂等，**保留 Umami 转发**：

- **G1 验签 fail-closed**：验签失败 / 缺签名头 → 返回 401（对齐 §2，消除「转发 UNVERIFIED」）。
- **G2 持久化幂等**：去重从内存 `seen` Set 改为文件持久化（event.id + orderId 双键），防冷启动双计。
- **G3 密钥注入**：密钥经 env 注入（`WAFFO_WEBHOOK_SECRET` 或 `WAFFO_WEBHOOK_PUBLIC_KEY`），运营据 Waffo 实际签名方案选填；本 spec 不替运营决定取值。

保留项：Umami `purchase` 转发职责、双模式（HMAC secret / RSA public key）、营收 / 退款事件分类逻辑。

---

## 4. 验收标准（§6 中枢复验口径）

- **AC1**：向 `waffo-webhook.ts` 发送错误 / 缺失签名的 POST，HTTP 状态 = **401**（grep 确认无「仍转发 UNVERIFIED」分支残留）。
- **AC2**：同一 `event.id` 重复投递（**含冷启动后**），仅向 Umami 转发一次（去重记录落 `.data/` 持久文件，非内存 Set）。
- **AC3**：同一 `orderId` 的重复营收事件，不重复计 Umami `purchase`。
- **AC4**：注入正确 `WAFFO_WEBHOOK_PUBLIC_KEY`（RSA）后，合法签名事件 → 200 且正常转发。
- **AC5**：无密钥注入时，端点启动记录 ERROR 并对**所有** POST 返回 401（fail-closed，不静默转发）。
- **AC6**：不引入许可证铸造逻辑（保持与 `webhook.ts` 职责分离，§2 hub-only 精神）。

---

## 5. 范围边界（明确不含）

- ❌ 不改动 `setup_waffo_webhooks.mjs`（注册脚本 / 3 产品同 URL / vercel.app 域名问题另议）。
- ❌ 不改 URL 域名。`vercel.app → Cloudflare` 替换列为**后续部署任务**，引用 `aiactradar-vercel-runbook.md` 缺口 #3 —— 注：本会话在仓库内 Glob / ls 均未定位到该 runbook 文件，运营须确认其真实路径后再挂接；本 spec 不臆造其内容。
- ❌ 不激活 / 注册 `pages/api/webhook.ts`（铸许可证参考实现）；是否切到该端是更大的 spec。
- ❌ 不新增功能（无新事件类型、无新转发目标、无新分析维度）。
- ❌ 不动 `.env.local`（仅列部署期注入任务；密钥属机密，绝不落仓库）。

---

## 6. §11.8 ima 溯源

本硬化战术动作（Waffo webhook 验签 + 持久化幂等）溯源至 ima 订阅库真实文档：

- **KB1 `7354338238295398`**「AI编程出海独立开发资源库」
- **KB2 `7389943097721763`**「AI出海精选知识库」

标题 + KB ID 级溯源满足 §11.8 要求（如需 media_id 级字节精度，须重连 ima-mcp 后 `get_knowledge_list` + `search_knowledge`）。

---

## 7. 风险与注意（诚实标注，不伪造）

- **Vercel 运行时 FS 只读**：Vercel serverless 运行时 `process.cwd()` 只读，仅 `/tmp` 可写且冷启动即失。因此 cwd 下 `.data/fulfilled-orders.jsonl` 类写入在生产**不会真正跨冷启动持久**（参考实现 `webhook.ts` 同样有此局限，其 `try/catch` 使写入静默失败）。本 spec 落盘到 `.data/`（对齐 §2 与 `webhook.ts` 参考），但若需**真正跨冷启动幂等**，部署须升级到 **Vercel KV / Upstash Redis**（列为后续任务 T6）。因本端仅做 Umami 转发（blast radius = 分析重复计数，非丢单 / 重铸许可），文件级去重可接受为最小硬化；缺失时最坏后果为重复 `purchase` 事件。
- **RSA 验签优先走 SDK `verifyWebhook`**（RSA-SHA256，含 built-in key 兜底与 `WAFFO_WEBHOOK_{TEST,PROD}_PUBLIC_KEY` 解析链，见 `@waffo/pancake-ts/dist/index.d.ts` L1934–1961），与 `webhook.ts` 一致；HMAC 路径保留既有 `hmacVerify`（L67–106）。dual-mode 由注入密钥决定。
- 运营已持有 Waffo dashboard 下发的 RSA public key（见 `waffo-webhook.ts:21-23` 注释），故 fail-closed（无密钥即 401）在生产注入公钥后不影响合法投递。
