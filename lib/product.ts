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
  checkoutUrl: "https://pancake.waffo.ai/store/lixingliang-ai-tools-6cilbw8v/checkout/cs_b39faceb-eb1d-a82a-f6e0-8474e525cad9?utm_campaign=r11_launch&utm_content=aiactradar&utm_source=x&utm_medium=organic",
  tagline: "Turn EU AI Act chaos into a clear compliance roadmap.",
  description: "AIActRadar maps your AI systems to their EU AI Act obligations, auto-generates risk registers and technical documentation, and keeps you ahead of every phased compliance deadline.",
  toolTitle: "EU AI Act Tracker",
  resultLabel: "Compliance Status",
  ctaLabel: "Run Check",
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
    "type": "text",
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
    "desc": "Basic obligation checklist"
  },
  {
    "tier": "Pro",
    "price": "$59/mo",
    "desc": "Continuous monitoring + deadlines"
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
  out += '  - High-risk obligations apply from 2 Aug 2026\n\n'
  out += 'Required actions checklist:\n'
  out += '  - [ ] Map system to Annex III use case\n'
  out += '  - [ ] Draft Art. 11 technical file\n'
  out += '  - [ ] Implement human-in-the-loop review\n'
  out += '\n--- (Mock demo. Pro unlocks continuous monitoring + deadline tracking.)'
  return out
}
}
