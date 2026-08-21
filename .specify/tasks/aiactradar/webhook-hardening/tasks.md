# tasks.md — webhook-hardening（§10 Spec Kit · Tasks）

可执行任务清单，每步含 **文件 + 改动点**。按 §10 0→6 顺序：T0 预处理 → T1 验签 → T2 幂等 → T3 注入 → T4 验证 → T5 部署 → T6 后续。

---

## T0 预处理（§10 实务①）
- **文件**：`（仓库整体）`
- **改动点**：备份源码 `pages/api/waffo-webhook.ts`，排除 `node_modules/`、`.next/`。
- **验收**：备份存在且可恢复；`.data/` 目录确认存在。

## T1 验签失败 → 401（核心，对齐 §2 + webhook.ts:137-148）
- **文件**：`pages/api/waffo-webhook.ts`
- **改动点**：
  - L213–228：将「仅 log + 转发 UNVERIFIED」改为验签失败时 `return res.status(401).end('Invalid signature')`；缺失签名头 `getSignature(req)` 为空 → `return res.status(401).end('Missing signature')`。
  - 新增无密钥注入时 fail-closed：启动 `console.error` + 运行时所有 POST 返回 401。
  - RSA 分支改用 SDK `verifyWebhook(raw, sig)`（RSA-SHA256，见 d.ts L1934–1961）；保留 `hmacVerify`（L67–106）作 HMAC 分支；dual-mode 由注入密钥决定。
- **验收**：错误 / 缺失签名 POST → 401；注入正确公钥后合法事件 → 200。

## T2 持久化幂等（对齐 §2 + webhook.ts:30-34,53-81）
- **文件**：`pages/api/waffo-webhook.ts`
- **改动点**：
  - 删除 L153–161 模块级 `seen` Set。
  - 新增 `.data/waffo-deliveries.jsonl` 持久去重（event.id + orderId 双键），参考 `webhook.ts` `alreadySeen`/`markSeen`/`alreadyFulfilled` 实现。
  - 转发 Umami 前先查重；命中则跳过并记录。
  - 每行记录 `{eventId, orderId, type, amount, currency, ts}`。
- **验收**：同 event.id / 同 orderId 重复投递（跨重启）仅转发一次。注意 Vercel FS 只读限制（spec.md §7）。

## T3 密钥注入（部署，非仓库文件）
- **文件**：`Vercel 项目环境变量`
- **改动点**：注入 `WAFFO_WEBHOOK_PUBLIC_KEY`（RSA PEM，推荐）或 `WAFFO_WEBHOOK_SECRET`（HMAC）；二选一，运营据 Waffo 方案决定。不落仓库。
- **验收**：端点启动日志显示已加载密钥；合法事件 → 200 且正常转发。

## T4 验证 Verify（§10 步骤 5，§9.8 须早于 deploy）
- **文件**：临时 `tsx` 自测脚本（如 `pages/api/__waffo-webhook-selftest.ts` 或 `lib/__selftest`）
- **改动点**：用 `tsx` 跑确定性断言：① bad sig → 401；② 重复 event.id → 仅一次转发；③ 无密钥 → 401。
- **验收**：全部断言通过（§10 实务②；不依赖 LLM）。

## T5 部署 Ship（§10 步骤 6）
- **文件**：`（部署动作）`
- **改动点**：`vercel deploy --prod --yes`（§10 实务④）。
- **验收**：生产端点对 bad sig 返回 401；Umami 无重复计。

## T6 后续（不在本 spec，仅登记）
- 跨冷启动真幂等：升级 Vercel KV / Upstash Redis（spec.md §7）。
- URL `vercel.app → Cloudflare` 替换（runbook 缺口 #3，路径待运营确认）。
- 硬化后重新注册正确端点 URL。
- 是否激活 `webhook.ts`（铸许可证）另开 spec。

---

## §11.8 溯源登记
- KB1 `7354338238295398`「AI编程出海独立开发资源库」
- KB2 `7389943097721763`「AI出海精选知识库」
（标题 + KB ID 级溯源，满足 §11.8）
