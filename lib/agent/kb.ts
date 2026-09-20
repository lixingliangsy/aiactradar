import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "overview",
    title: "What AIActRadar does",
    keywords: ["aiactradar", "ai act", ],
    body:
      "AIActRadar breaks the EU AI Act (Regulation 2024/1689) obligations down for you. Enter a description of your AI system, its users and its deployment context and the tool classifies the risk tier (unacceptable / high / limited / minimal), then lists the applicable obligations, the key dates and an action list. The rule engine runs first and the LLM only helps explain, so the result stays reviewable.",
    source: "Product documentation / website",
    tags: ["compliance"],
  },
  {
    id: "risk-tiers",
    title: "The four risk tiers for AI systems",
    keywords: ["unacceptable", "high", "limited", "minimal", "annex iii", ],
    body:
      "The EU AI Act defines four tiers: (1) unacceptable risk (Art. 5) - social scoring and manipulative AI are banned outright; (2) high risk (Art. 6 plus Annex III) - eight areas including recruitment, critical infrastructure, education scoring, law enforcement and migration; (3) limited risk (Art. 50) - chatbots and deepfakes must disclose; (4) minimal risk - most other applications, where a voluntary code of conduct is enough.",
    source: "Regulation 2024/1689 Art. 5/6/50, Annex III",
    tags: ["compliance"],
  },
  {
    id: "high-risk-obligations",
    title: "Core obligations for high-risk AI systems",
    keywords: ["obligation", "art. 9", "art. 11", "art. 14", "annex iv", ],
    body:
      "A high-risk system must have: (1) a risk-management system (Art. 9, across the whole lifecycle); (2) data governance (Art. 10); (3) technical documentation (Art. 11, Annex IV template); (4) record-keeping (Art. 12, automatic logs); (5) instructions for deployers (Art. 13); (6) human oversight (Art. 14); (7) accuracy, robustness and cybersecurity (Art. 15); (8) conformity assessment (Art. 43, CE marking).",
    source: "Regulation 2024/1689 Chapter III section 2",
    tags: ["compliance"],
  },
  {
    id: "key-dates",
    title: "Key EU AI Act dates (2026 view)",
    keywords: ["deadline", "grace", "2026", "2027", "2028"],
    body:
      "Key dates: the Act entered into force on 2024-08-01; the prohibitions (Art. 5) apply from 2025-02-02; general-purpose AI model (GPAI) obligations from 2025-08-02; high-risk Annex III obligations were due from 2026-08-02 but the Digital Omnibus proposal (2025-11) may push them to 2027-12-02; high-risk embedded in products 2027-08-02; high-risk public-sector use 2028-08-02. For any specific date, go back to the regulation text and the Commission explanations.",
    source: "Regulation 2024/1689 Art. 113; Commission Digital Omnibus proposal",
    tags: ["compliance"],
  },
  {
    id: "pricing",
    title: "AIActRadar pricing: Free / Pro / Enterprise / Agent",
    keywords: ["pro", "enterprise", "agent", ],
    body:
      "Four tiers: Free ($0, one run per day, watermarked export); Pro ($59/month or $590/year, 300 runs per month, audit log and watermark-free export); Enterprise (custom, SSO / BYOK / higher quota / shared rule sets); Agent ($99/month, a standalone governance agent with multi-step, citable analysis). The Agent Suite bundle of three agents is $199/month.",
    source: "Pricing page",
    tags: [],
  },
  {
    id: "compliance-disclaimer",
    title: "Disclaimer for compliance answers",
    keywords: [],
    body:
      "On GDPR or EU AI Act questions, AIActRadar provides decision support and an information summary. That is not legal, tax or professional advice, and it is not a compliance certification. Before you launch abroad, check the EUR-Lex text and consult a qualified lawyer.",
    source: "Product documentation / disclaimer",
    tags: ["compliance"],
  },
  {
    id: "ai-support-scope",
    title: "What the AI assistant can and cannot do",
    keywords: [],
    body:
      "I am the AI support assistant for AIActRadar. I answer common questions about risk classification, the obligation list, key dates, pricing, accounts and how to use the tool, and I hand off to a human when needed. I cannot replace legal, tax or professional advice and compliance answers are for reference only; I also cannot change your account, process a refund or access payment credentials.",
    source: "Product documentation / AI support",
    tags: [],
  },
  {
    id: "account-login",
    title: "Sign-in and account questions",
    keywords: [],
    body:
      "Accounts sign in with an email address and receive a JWT session. To reset a password or if you cannot sign in, use the Contact us / talk to a human entry point and the team will verify your identity first. For security reasons we never ask for or reset a password inside the chat.",
    source: "Product documentation / account",
    tags: [],
  },
  {
    id: "checklist",
    title: "A first pass through EU AI Act compliance",
    keywords: ["checklist", ],
    body:
      "Suggested path: (1) run the risk classification once (under 5 minutes); (2) read the applicable obligation list and prepare the technical documentation along the Annex IV template; (3) when a compliance audit or customer question arrives, export the PDF as evidence; (4) move to continuous monitoring so you are alerted when high-risk articles change.",
    source: "Product documentation / getting started",
    tags: ["compliance"],
  },
  {
    id: "contact-human",
    title: "Contact us / talk to a human",
    keywords: [],
    body:
      "For human help (account issues, refunds, partnerships or policy questions) just say talk to a human and leave your email, or send the details from the feedback page.",
    source: "Product documentation / support",
    tags: [],
  },
];

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  const han = /[\u4e00-\u9fff]/;
  for (const w of toWords(s)) {
    if (han.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let s = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) s += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) s += 2;
  }
  const idx = normalize(entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400));
  for (const g of qGrams) if (idx.includes(g)) s += 0.5;
  return s;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries
    .map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
