/**
 * lib/support.config.ts —— AIActRadar 的 SupportConfig 实例
 *
 * 与 GStack 共享同一份 support-kit（含 lib/agent/* / lib/feedback* / components/ChatWidget /
 * pages/api/chat / pages/embed/chat / public/widget.js），差异仅在产品级参数与 KB。
 *
 * 接入清单 §4：
 * 1. KB：lib/agent/kb.ts（领域知识）
 * 2. config：lib/support.config.ts（本文件）
 * 3. /api/chat 传入 config: SUPPORT
 * 4. /api/feedback / /feedback 页面如使用，自动从 SUPPORT 派生主题前缀
 * 5. _app.tsx 与 /embed/chat 传入 SUPPORT.productName / brandColor / productSlug
 */

import { KB } from "./agent/kb";
import type { SupportConfig } from "./support-kit/types";

export const SUPPORT: SupportConfig = {
  productSlug: "aiactradar",
  productName: "AIActRadar",
  feedbackEmail: process.env.FEEDBACK_TO_EMAIL || "lixingliangsy@163.com",
  kb: KB,
  chatHost: process.env.APP_URL || "https://aiactradar.example.com",
  brandColor: "#0F766E", // teal-700 — 与 GStack 蓝色形成产品视觉差异
  complianceDisclaimer: "本助手提供决策辅助，不构成法律或专业意见；EU AI Act 时点以 EUR-Lex 官方文本为准。",
};
