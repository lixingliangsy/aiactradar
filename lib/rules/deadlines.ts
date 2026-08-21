/**
 * AIActRadar — EU AI Act (Regulation 2024/1689) phased application deadlines.
 *
 * Authoritative timeline, INCLUDING the Digital Omnibus (AI Omnibus) amendment
 * adopted June 2026 that moved the Annex III high-risk applicability from
 * 2 Aug 2026 to 2 Dec 2027 (and product-embedded Annex I to 2 Aug 2028).
 *
 * All dates carry an official `ref`. This module is PURELY DETERMINISTIC —
 * it never calls an LLM and never invents a date.
 *
 * Sources (web-research gate, 2026-07-21):
 *  - https://artificialintelligenceact.eu/implementation-timeline
 *  - https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
 *  - https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act
 *  - https://simpleact.eu/ai-act-deadlines
 *  - https://chinawto.mofcom.gov.cn/article/jsbl/dtxx/202607/20260703634488.shtml (Omnibus)
 */

export type ComputeProfile = {
  prohibited: boolean
  highRisk: boolean
  gpai: boolean
  productIntegrated?: boolean
  role: 'provider' | 'deployer' | 'both'
}

export type DeadlineRule = {
  id: string
  obligation: string
  date: string // 'YYYY-MM-DD'
  ref: string
  appliesWhen: (p: ComputeProfile) => boolean
}

/** Baseline rules that apply to every in-scope operator. */
export const DEADLINE_RULES: DeadlineRule[] = [
  {
    id: 'AIACT-DL-01',
    obligation: 'Entry into force of the AI Act (no obligations yet — transition clock starts)',
    date: '2024-08-01',
    ref: 'https://artificialintelligenceact.eu/implementation-timeline',
    appliesWhen: () => true,
  },
  {
    id: 'AIACT-DL-02',
    obligation:
      'Prohibitions on unacceptable-risk AI (Art. 5) + AI literacy (Art. 4) apply',
    date: '2025-02-02',
    ref: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    appliesWhen: () => true,
  },
  {
    id: 'AIACT-DL-03',
    obligation:
      'GPAI model rules (Chapter V) + EU governance structure (Chapter VII) apply',
    date: '2025-08-02',
    ref: 'https://artificialintelligenceact.eu/implementation-timeline',
    appliesWhen: (p) => p.gpai,
  },
  {
    id: 'AIACT-DL-04',
    obligation:
      'Majority of rules apply: Art. 50 transparency, Art. 6(1) classification, Art. 43 conformity assessment, Art. 71 governance',
    date: '2026-08-02',
    ref: 'https://simpleact.eu/ai-act-deadlines',
    appliesWhen: (p) => p.gpai || p.highRisk || p.prohibited,
  },
  {
    id: 'AIACT-DL-05',
    obligation:
      'New prohibitions (non-consensual sexual deepfakes, CSAM) + Art. 50(2) synthetic-content transition apply',
    date: '2026-12-02',
    ref: 'https://simpleact.eu/ai-act-deadlines',
    appliesWhen: (p) => p.prohibited || p.gpai,
  },
  {
    id: 'AIACT-DL-06',
    obligation:
      'High-risk AI systems under Annex III apply (postponed from 2 Aug 2026 by Digital Omnibus)',
    date: '2027-12-02',
    ref: 'https://simpleact.eu/ai-act-deadlines',
    appliesWhen: (p) => p.highRisk,
  },
  {
    id: 'AIACT-DL-07',
    obligation:
      'High-risk AI embedded in regulated products (Annex I) applies (Digital Omnibus)',
    date: '2028-08-02',
    ref: 'https://simpleact.eu/ai-act-deadlines',
    appliesWhen: (p) => !!p.productIntegrated,
  },
]

function daysBetween(dateISO: string, nowMs: number): number {
  const target = new Date(dateISO + 'T00:00:00Z').getTime()
  return Math.round((target - nowMs) / 86_400_000)
}

/**
 * Compute the applicable phased deadlines for a system profile.
 * `now` is injectable for deterministic unit tests (defaults to Date.now()).
 */
export function computeDeadlines(
  profile: ComputeProfile,
  now: number = Date.now()
): Array<{ id: string; obligation: string; date: string; ref: string; daysLeft: number }> {
  return DEADLINE_RULES.filter((r) => r.appliesWhen(profile))
    .map((r) => ({
      id: r.id,
      obligation: r.obligation,
      date: r.date,
      ref: r.ref,
      daysLeft: daysBetween(r.date, now),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
