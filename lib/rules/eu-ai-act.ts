/**
 * AIActRadar vertical ruleset — EU AI Act (Regulation 2024/1689) obligation mapping.
 * Deterministic checks run BEFORE the model so the verdict is explainable
 * and not dependent on LLM output alone.
 *
 * Ruleset incorporates the Digital Omnibus (AI Omnibus, adopted June 2026) amendments.
 * See lib/rules/deadlines.ts for the phased application timeline (with refs).
 */
export const RULESET_VERSION = 'eu-ai-act@2026-07-21'

export type AiActRule = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  check: (ctx: { description: string; users: string; context: string; highRisk: boolean }) => boolean
  remediation: string
}

const HIGH_RISK_CONTEXT = /public sector|workplace|hr|healthcare|finance|bank|insurance/i
const ANNEX3_KEYWORDS =
  /recruit|cv|resume|hiring|employ|loan|credit|mortgage|biometric|border|migration|education|exam|scoring|eligibility|claim/i

function isHighRisk(ctx: { description: string; context: string }): boolean {
  return HIGH_RISK_CONTEXT.test(ctx.context) || ANNEX3_KEYWORDS.test(ctx.description)
}

export const AIACT_RULES: AiActRule[] = [
  {
    id: 'AIACT-001',
    title: 'High-risk classification under Annex III',
    severity: 'high',
    check: (ctx) => ctx.highRisk,
    remediation:
      'If the system matches an Annex III use case it is high-risk: you must meet Chapter III Section 2 requirements (risk management, data governance, technical documentation, human oversight, accuracy).',
  },
  {
    id: 'AIACT-002',
    title: 'Annex IV technical documentation (Art. 11 / Annex IV)',
    severity: 'high',
    check: (ctx) => ctx.highRisk && !/technical documentation|technical file|annex iv|technical spec/i.test(ctx.description),
    remediation:
      'High-risk systems require a technical documentation file (Annex IV) covering design, intended purpose, and conformity evidence. Draft it before market placement.',
  },
  {
    id: 'AIACT-003',
    title: 'Risk management system (Art. 9)',
    severity: 'high',
    check: (ctx) => ctx.highRisk && !/risk management|risk assessment|mitigat/i.test(ctx.description),
    remediation:
      'Establish a continuous risk-management system (Art. 9) covering the lifecycle: identify known and foreseeable risks, then mitigate and monitor them.',
  },
  {
    id: 'AIACT-004',
    title: 'Data governance (Art. 10)',
    severity: 'medium',
    check: (ctx) => /data|dataset|train|model|training/i.test(ctx.description) && !/data governance|data quality|bias|representative/i.test(ctx.description),
    remediation:
      'If you use training/validation data, apply Art. 10 data governance: relevance, representativeness, and bias examination. Document your dataset provenance.',
  },
  {
    id: 'AIACT-005',
    title: 'Transparency & user information (Art. 13)',
    severity: 'medium',
    check: (ctx) => !/transparen|disclos|inform (the )?user|user info|clearly (inform|state)/i.test(ctx.description),
    remediation:
      'Under Art. 13, deployers must be informed of the AI system’s capabilities and limitations, and that they are interacting with an AI system where applicable.',
  },
  {
    id: 'AIACT-006',
    title: 'Human oversight (Art. 14)',
    severity: 'high',
    check: (ctx) => /autonom|decision|agent|act|recommend/i.test(ctx.description) && !/human (in|over)|human review|oversight|human-in-the-loop/i.test(ctx.description),
    remediation:
      'For high-risk systems, implement effective human oversight (Art. 14): mechanisms to understand, monitor, and override/interrupt the system. Do not ship fully autonomous decisions without review.',
  },
  {
    id: 'AIACT-007',
    title: 'Conformity assessment & CE marking (Art. 43)',
    severity: 'high',
    check: (ctx) => ctx.highRisk && !/conformity|ce marking|notified body|declaration of conformity/i.test(ctx.description),
    remediation:
      'High-risk systems require a conformity assessment (Art. 43), a Declaration of Conformity, and CE marking before EU market placement. Engage a notified body if required.',
  },
]

// ---------------------------------------------------------------------------
// Article 5 — Prohibited practices (unacceptable risk). Hard stop.
// 8 original bans + 2 added by the Digital Omnibus (non-consensual sexual
// deepfakes and CSAM generation).
// ---------------------------------------------------------------------------
export type ProhibitedPractice = { id: string; label: string; pattern: RegExp; ref: string }

export const PROHIBITED_PRACTICES: ProhibitedPractice[] = [
  { id: 'AIACT-PROH-01', label: 'Social scoring by public authorities', pattern: /social scori(ng)?/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-02', label: 'Subliminal / manipulative exploitation of vulnerabilities', pattern: /subliminal|exploit (vulnerab|weak)|manipulat.*(vulnerab|exploit)/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-03', label: 'Untargeted scraping to build facial-recognition DB', pattern: /scrap.*(internet|cctv|web).*(facial|face|biometric)|untargeted scrap/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-04', label: 'Emotion recognition in workplace / education', pattern: /emotion recogn/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-05', label: 'Biometric categorisation by protected characteristics', pattern: /biometric categor|biometric.*(race|ethnic|political|religio|sexual)/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-06', label: 'Real-time remote biometric ID in public spaces (law enforcement)', pattern: /real[- ]?time.*biometric.*(public|law enforce)|remote biometric identif/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-07', label: 'Individual criminal-offence risk assessment / prediction', pattern: /criminal offence risk|predict.*(crime|criminal)|criminal risk assess/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-08', label: 'Harmful AI-based manipulation / deception', pattern: /harmful manipul|decept.*ai|ai.*decept/i, ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
  { id: 'AIACT-PROH-09', label: 'Non-consensual sexual deepfake generation (Digital Omnibus)', pattern: /non[- ]?consensual sexual|sexual deepfake|deepfake.*(porn|sexual)/i, ref: 'https://simpleact.eu/ai-act-deadlines' },
  { id: 'AIACT-PROH-10', label: 'Child sexual abuse material (CSAM) generation (Digital Omnibus)', pattern: /csam|child sexual abuse material/i, ref: 'https://simpleact.eu/ai-act-deadlines' },
]

export function detectProhibited(description: string): string[] {
  return PROHIBITED_PRACTICES.filter((p) => p.pattern.test(description)).map((p) => p.id)
}

// ---------------------------------------------------------------------------
// Role detection — provider vs deployer vs both (heuristic from free text).
// EU AI Act obligations differ sharply by role (Art. 16 provider vs Art. 26 deployer).
// Heuristic only; report must label it "(inferred)".
// ---------------------------------------------------------------------------
export function detectRole(description: string): 'provider' | 'deployer' | 'both' {
  const isProvider = /we (build|develop|provide|sell|offer|market|create|train|deploy as a service)|our (product|platform|service) (is|provides|offers)|we (are|are a) (vendor|provider|developer|startup building)/i.test(description)
  const isDeployer = /(our company|we) (use|uses|deploy|operate|run|rely on)|we (use|use an) ai (to|for)|as a (customer|user) of/i.test(description)
  if (isProvider && isDeployer) return 'both'
  if (isProvider) return 'provider'
  if (isDeployer) return 'deployer'
  return 'deployer' // default: most users describe a system they operate
}

// ---------------------------------------------------------------------------
// GPAI / generative detection — Art. 50 transparency obligations (labeling,
// synthetic-content marking) apply to general-purpose AI / generative systems.
// ---------------------------------------------------------------------------
export function detectGpai(description: string): boolean {
  return /generative|generate(s)? (text|image|video|code|audio|content)|llm|large language model|foundation model|gpt|synthetic content|deepfake|chatbot|genai|gen-ai/i.test(description)
}

// ---------------------------------------------------------------------------
// Aggregate deterministic check.
// ---------------------------------------------------------------------------
import { computeDeadlines, type ComputeProfile } from './deadlines'

export function runDeterministicChecks(inputs: Record<string, string>) {
  const description = String(inputs.system_description || inputs.description || inputs.system || '')
  const users = String(inputs.intended_users || inputs.users || '')
  const context = String(inputs.risk_context || inputs.context || 'Not sure')
  const highRisk = isHighRisk({ description, context })
  const prohibitedPractices = detectProhibited(description)
  const role = detectRole(description)
  const gpai = detectGpai(description)

  const ctx = { description, users, context, highRisk }
  const hits = AIACT_RULES.filter((r) => r.check(ctx)).map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.severity,
    remediation: r.remediation,
    source: 'Rule-based' as const,
  }))

  const profile: ComputeProfile = { prohibited: prohibitedPractices.length > 0, highRisk, gpai, role }
  const deadlines = computeDeadlines(profile)

  return {
    rulesetVersion: RULESET_VERSION,
    hits,
    highRisk,
    prohibited: prohibitedPractices.length > 0,
    prohibitedPractices,
    role,
    gpai,
    deadlines,
  }
}
