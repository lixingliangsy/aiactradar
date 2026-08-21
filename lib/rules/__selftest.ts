/* Deterministic self-test for the EU AI Act rules engine (no LLM). */
import { computeDeadlines } from './deadlines'
import { detectProhibited, detectRole, detectGpai, runDeterministicChecks } from './eu-ai-act'

const NOW = Date.parse('2026-07-21T00:00:00Z')
let pass = 0
let fail = 0
function assert(name: string, cond: boolean) {
  if (cond) {
    pass++
    console.log('  PASS ' + name)
  } else {
    fail++
    console.log('  FAIL ' + name)
  }
}

// AC-1: phased deadlines reflect Digital Omnibus
const hr = computeDeadlines({ prohibited: false, highRisk: true, gpai: false, role: 'deployer' }, NOW)
const hrDates = hr.map((d) => d.date)
assert('high-risk → 2027-12-02 (DL-06, Omnibus)', hrDates.includes('2027-12-02'))
assert('high-risk → also 2026-08-02 (DL-04)', hrDates.includes('2026-08-02'))

const gp = computeDeadlines({ prohibited: false, highRisk: false, gpai: true, role: 'provider' }, NOW)
const gpDates = gp.map((d) => d.date)
assert('gpai → 2025-08-02 (DL-03)', gpDates.includes('2025-08-02'))
assert('gpai → 2026-08-02 (DL-04)', gpDates.includes('2026-08-02'))

const pro = computeDeadlines({ prohibited: true, highRisk: false, gpai: false, role: 'deployer' }, NOW)
assert('prohibited → 2025-02-02 (DL-02)', pro.map((d) => d.date).includes('2025-02-02'))

// AC-2: prohibited detection
assert('detectProhibited social scoring', detectProhibited('a social scoring system by authorities').includes('AIACT-PROH-01'))
assert('detectProhibited deepfake (Omnibus)', detectProhibited('non-consensual sexual deepfake generator').includes('AIACT-PROH-09'))

// AC-3: role inference
assert('role provider', detectRole('we build and sell an AI recruitment tool') === 'provider')
assert('role deployer', detectRole('our company uses an AI to screen CVs') === 'deployer')

// AC-4: gpai
assert('gpai true', detectGpai('an LLM that generates text') === true)

// AC-2 (aggregate): runDeterministicChecks prohibited flag
const agg = runDeterministicChecks({ system_description: 'a social scoring system used by police', intended_users: 'gov', risk_context: 'Public sector' })
assert('aggregate prohibited=true', agg.prohibited === true && agg.prohibitedPractices.length > 0)
assert('aggregate highRisk=true (public sector)', agg.highRisk === true)
assert('aggregate carries deadlines', Array.isArray(agg.deadlines) && agg.deadlines.length > 0)
assert('aggregate backward-compat hits', Array.isArray(agg.hits) && agg.rulesetVersion === 'eu-ai-act@2026-07-21')

console.log(`\nSELFTEST ${fail === 0 ? 'ALL PASS' : 'HAS FAILURES'} — pass=${pass} fail=${fail}`)
if (fail > 0) process.exit(1)
