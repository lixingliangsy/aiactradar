export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "AIActRadar",
  slug: "aiactradar",
  priceMonthly: 59,
  productId: "PROD_4Qdv30KSxXjIWa5pdWPzUL",

  yearlyProductId: "PROD_1CpnG5fZOej0iaHeM8rVlE",
  priceYearly: 590,

  // R11 Agent-tier upsell (upgrade plan §7.2): vertical AI governance Agent.
  agentProductId: "PROD_1kT9HLkqic6DN8ZvnQKBrI",
  agentPriceMonthly: 99,
  // R11 Agent Suite (all three agents, bundle).
  suiteProductId: "PROD_5OQNwcO7sQBI6AKI5U94YM",
  suitePriceMonthly: 199,

  checkoutUrl: "/api/checkout",
  pipelineId: "aiactradar-obligation-v1",
  rulesetId: "eu-ai-act@2026-07-19",
  rulesetVersion: "eu-ai-act@2026-07-19",
  tagline: "Turn EU AI Act chaos into a clear compliance roadmap.",
  description: "AIActRadar maps your AI systems to their EU AI Act obligations, auto-generates risk registers and technical documentation, and keeps you ahead of every phased compliance deadline.",
  toolTitle: "EU AI Act Tracker",
  resultLabel: "Compliance Status",
  ctaLabel: "Run Check",
  definitionLead: "AIActRadar maps AI systems to EU AI Act risk tiers and phased obligations, producing a decision-support compliance roadmap with rule-based checks — not a legal certificate.",
  geoFaq: [
    { q: "What is the EU AI Act risk taxonomy?", a: "The Act classifies systems as prohibited, high-risk, limited-risk (transparency), or minimal risk. Official text: Regulation (EU) 2024/1689." },
    { q: "Does AIActRadar issue a certificate?", a: "No. It is decision-support documentation aid. Legal conformity assessment remains with you and qualified counsel." },
    { q: "Which obligations does it track?", a: "Risk classification, technical documentation outlines, and phased deadline awareness mapped to publicly published timelines." },
    { q: "Is live AI required?", a: "Demo mode works without a key. Live narrative needs a configured platform or enterprise BYOK key under fair use." },
    { q: "Who is it for?", a: "Product and compliance teams shipping AI features to the EU who need an obligation checklist, not a law firm substitute." },
    { q: "Where are primary sources?", a: "EUR-Lex Regulation (EU) 2024/1689 and European Commission AI Act guidance pages." },
  ],
  features: [
  "Classify your AI system's risk tier under the EU AI Act",
  "Map the obligations and deadlines that apply to you",
  "Highlight high-risk requirements you must satisfy",
  "Get a clear compliance action checklist"
],
  inputs: [
  {
    "key": "system_description",
    "label": "Describe Your AI System",
    "type": "textarea",
    "placeholder": "e.g. An AI tool that screens job applicants' CVs"
  },
  {
    "key": "intended_users",
    "label": "Intended Users",
    "type": "input",
    "placeholder": "e.g. HR teams, recruiters"
  },
  {
    "key": "risk_context",
    "label": "Deployment Context",
    "type": "select",
    "options": [
      "Public sector",
      "Workplace / HR",
      "Healthcare",
      "Finance",
      "General consumer",
      "Not sure"
    ]
  }
] as InputField[],
  systemPrompt: "You are EU AI Act Radar, a compliance advisor specialized in the EU AI Act (Regulation 2024/1689). Given a description of an AI system, its intended users, and deployment context, classify the system into the correct risk tier (unacceptable, high, limited, or minimal) and list the concrete obligations, key compliance deadlines, and required actions. Always structure your response as: (1) risk tier with one-line rationale, (2) applicable obligations, (3) key deadlines, (4) required actions checklist. In demo (mock) mode, return a realistic sample assessment following exactly this structure.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "1 workflow run / day · watermarked export"
  },
  {
    "tier": "Pro",
    "price": "$59/mo",
    "desc": "300 workflow runs / mo · audit log · export"
  },
  {
    "tier": "Enterprise",
    "price": "Custom",
    "desc": "SSO-ready · BYOK · higher caps · shared rulesets"
  },
  {
    "tier": "Agent",
    "price": "$99/mo",
    "desc": "Vertical AI governance agent — multi-step, cited analysis"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const desc = (inputs['system_description'] || '').trim()
  const users = (inputs['intended_users'] || '').trim()
  const ctx = inputs['risk_context'] || 'Not sure'
  if (!desc) return 'Describe your AI system to classify its EU AI Act risk tier.'
  let out = 'EU AI ACT RISK ASSESSMENT\n\n'
  out += 'Risk tier: HIGH-RISK\n'
  out += 'Rationale: A system used in ' + ctx + ' context with ' + (users || 'broad users') + ' typically falls under Annex III high-risk categories.\n\n'
  out += 'Applicable obligations:\n'
  out += '  - Conformity assessment (Art. 43)\n'
  out += '  - Technical documentation (Art. 11)\n'
  out += '  - Human oversight (Art. 14)\n'
  out += '  - Risk management system (Art. 9)\n\n'
  out += 'Key deadlines:\n'
  out += '  - High-risk (Annex III) obligations apply from 2 Dec 2027 (post Digital Omnibus)\n\n'
  out += 'Required actions checklist:\n'
  out += '  - [ ] Map system to Annex III use case\n'
  out += '  - [ ] Draft Art. 11 technical file\n'
  out += '  - [ ] Implement human-in-the-loop review\n'
  out += '\n--- (Mock demo. Pro unlocks continuous monitoring + deadline tracking.)'
  return out
}
}
