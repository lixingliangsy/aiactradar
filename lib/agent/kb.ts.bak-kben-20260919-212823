/**
 * lib/agent/kb.ts —— AIActRadar 产品知识库（AI 客服智能体检索源）
 *
 * 同样采用「关键词 + 中文二元组」轻量检索（与 GStack 同型，便于跨产品对照）。
 *
 * 红线（沿用 AIActRadar M11）：
 * - 客服应答必须引用 KB 出处；合规类条目须打 tag，由 guardrails 在答案上附加「仅供参考」声明。
 * - EU AI Act 时点 / 章节引用须标日期与条文号；与官方文本不一致时让用户回查 EUR-Lex。
 */

import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "overview",
    title: "AIActRadar 是什么",
    keywords: ["是什么", "介绍", "aiactradar", "ai act", "做什么", "产品", "雷达"],
    body:
      "AIActRadar 把欧盟 AI 法案（Regulation 2024/1689）的合规义务拆给你看：你输入 AI 系统描述、目标用户与部署场景，工具按风险等级（不可接受 / 高风险 / 有限风险 / 最小风险）分类，列出适用义务、关键时点与行动清单。规则引擎先跑、LLM 辅助解释，结果可复核。",
    source: "产品文档 / 官网",
    tags: ["compliance"],
  },
  {
    id: "risk-tiers",
    title: "AI 系统的四种风险等级",
    keywords: ["风险", "等级", "分级", "unacceptable", "high", "limited", "minimal", "annex iii", "类别"],
    body:
      "欧盟 AI 法案分四级：① 不可接受风险（Art. 5）——社交评分、操纵性 AI 等全面禁止；② 高风险（Art. 6 + Annex III）——招聘、关键基础设施、教育评分、执法、移民等八大场景；③ 有限风险（Art. 50）——聊天机器人、深伪需披露；④ 最小风险——其余多数应用，自愿守则即可。",
    source: "Regulation 2024/1689 Art. 5/6/50, Annex III",
    tags: ["compliance"],
  },
  {
    id: "high-risk-obligations",
    title: "高风险 AI 系统的核心义务",
    keywords: ["高风险", "义务", "obligation", "art. 9", "art. 11", "art. 14", "annex iv", "技术文档", "合格评定", "人为监督"],
    body:
      "高风险系统须满足：① 风险管理体系（Art. 9，全生命周期）；② 数据治理（Art. 10）；③ 技术文档（Art. 11，Annex IV 模板）；④ 记录（Art. 12，自动日志）；⑤ 提供给部署者的使用说明（Art. 13）；⑥ 人为监督（Art. 14）；⑦ 准确性 / 稳健性 / 网络安全（Art. 15）；⑧ 合格评定（Art. 43，CE 标识）。",
    source: "Regulation 2024/1689 Chapter III §2",
    tags: ["compliance"],
  },
  {
    id: "key-dates",
    title: "EU AI Act 关键时点（2026 视角）",
    keywords: ["时点", "deadline", "日期", "生效", "过渡期", "grace", "什么时候", "截止", "2026", "2027", "2028"],
    body:
      "关键时点：法案 2024-08-01 生效；禁止类（Art. 5）2025-02-02 起适用；通用 AI 模型（GPAI）义务 2025-08-02 起；高风险（Annex III）原定 2026-08-02 适用，根据 Digital Omnibus 提案（2025-11）可能延至 2027-12-02；嵌入产品类高风险 2027-08-02；公共部门高风险 2028-08-02。涉及具体时点请回查法案条文与委员会解释。",
    source: "Regulation 2024/1689 Art. 113; Commission Digital Omnibus proposal",
    tags: ["compliance"],
  },
  {
    id: "pricing",
    title: "AIActRadar 定价：Free / Pro / Enterprise / Agent",
    keywords: ["定价", "价格", "多少钱", "收费", "免费", "pro", "enterprise", "agent", "套餐", "档位"],
    body:
      "四档：Free（$0，每天 1 次流程运行，导出带水印）；Pro（$59/月 或 $590/年，每月 300 次运行，审计日志与无水印导出）；Enterprise（按需，SSO/BYOK/更高配额/共享规则集）；Agent（$99/月，独立治理 Agent，多步可引证分析）；Agent Suite 三 Agent 打包 $199/月。",
    source: "官网定价页",
    tags: [],
  },
  {
    id: "compliance-disclaimer",
    title: "合规答复的免责声明",
    keywords: ["法律", "意见", "保证", "合规认证", "免责", "顾问", "责任"],
    body:
      "关于 GDPR / EU AI Act / 各类合规话题，AIActRadar 提供的是决策辅助与信息梳理，不构成法律、税务或专业意见，也不构成「合规认证」。正式出海前请结合 EUR-Lex 原文并咨询合格律师。",
    source: "产品文档 / 免责声明",
    tags: ["compliance"],
  },
  {
    id: "ai-support-scope",
    title: "AI 客服能做什么 / 不能做什么",
    keywords: ["客服", "机器人", "ai 客服", "智能体", "能回答", "边界", "限制"],
    body:
      "我是 AIActRadar 的 AI 客服助手，基于产品知识库回答关于风险分类、义务清单、关键时点、定价、账户与工具的常见问题，并在需要时为你转接人工。我无法替代法律 / 税务 / 专业顾问意见，合规类答复仅供参考；我也不会修改你的账户、处理退款或访问支付凭证。",
    source: "产品文档 / AI 客服",
    tags: [],
  },
  {
    id: "account-login",
    title: "登录 / 账户问题",
    keywords: ["登录", "登入", "账号", "账户", "注册", "密码", "忘记密码", "无法登录"],
    body:
      "账户使用邮箱登录，签发 JWT 会话；忘记密码或无法登录请在「联系我们 / 转人工」入口提交，团队会协助核实身份后处理。出于安全考虑，我们不会在聊天中直接索要或重置密码。",
    source: "产品文档 / 账户",
    tags: [],
  },
  {
    id: "checklist",
    title: "首次跑通 EU AI Act 合规建议流程",
    keywords: ["流程", "checklist", "怎么做", "步骤", "清单", "方法", "起步"],
    body:
      "建议路径：① 用工具跑一次风险分类（< 5 分钟）；② 看适用义务清单，按 Annex IV 整理技术文档；③ 接到合规审计或客户问询时，导出 PDF 留底；④ 进入持续监测（高风险条款变化时主动告警）。",
    source: "产品文档 / 上手指南",
    tags: ["compliance"],
  },
  {
    id: "contact-human",
    title: "联系我们 / 转人工",
    keywords: ["联系", "人工", "转人工", "投诉", "退款", "维权", "销售", "真人", "客服电话", "找人"],
    body:
      "需要人工协助（账户异常、退款、商务合作或政策咨询）请告诉我「转人工」并留下邮箱；也可在反馈页提交详细诉求。",
    source: "产品文档 / 支持",
    tags: [],
  },
];

// --- 轻量检索：与 GStack 一致的实现，便于跨产品复用 ---
function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  for (const w of toWords(s)) {
    if (/[\u4e00-\u9fff]/.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let score = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) score += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) score += 2;
  }
  const idx = normalize((entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400)));
  for (const g of qGrams) if (idx.includes(g)) score += 0.5;
  return score;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries.map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
