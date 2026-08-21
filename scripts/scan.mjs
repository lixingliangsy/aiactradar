// scan.mjs — aiactradar EU AI Act 合规雷达审计（真实实现，T1 审计模板契约驱动）
// 领域：EU AI Act（Regulation (EU) 2024/1689）高风险系统义务。审计系统是否履行合规义务。
// 幂等：同输入同输出、无副作用、可重入。返回 { items:[{id,...}], metrics:{...} }
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA = path.join(ROOT, '.data')
const AUDIT = path.join(DATA, 'audit')

async function fetchText(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 't1-audit-bot/1.0 (+https://lxsai.com)' } })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    return await r.text()
  } finally { clearTimeout(t) }
}

async function loadTargets(targets) {
  const docs = []
  for (const t of targets) {
    try {
      if (/^https?:\/\//i.test(t)) { docs.push(await fetchText(t)); continue }
        const p = path.isAbsolute(t) ? t : path.join(AUDIT, t)
      docs.push(fs.readFileSync(p, 'utf8'))
    } catch (e) { console.warn('[scan] target load failed:', t, e.message) }
  }
  return docs
}

export async function scan(ctx) {
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, 'config.json'), 'utf8'))
  const targets = (cfg.scan && cfg.scan.targets) || [path.join(AUDIT, 'aiactradar-sample.json')]
  const docs = await loadTargets(targets)
  let cfgObj = {}
  try { cfgObj = JSON.parse(docs.join('\n')) } catch (e) { console.warn('[scan] parse failed', e.message) }
  const items = []

  const validTiers = ['unacceptable', 'high', 'limited', 'minimal']
  const tier = cfgObj.risk_tier
  if (!tier || !validTiers.includes(tier)) {
    items.push({ id: 'aiactradar:risk-tier-missing', category: 'classification', severity: 'high', title: 'No AI Act risk classification', detail: '未对系统做 EU AI Act 风险分级（unacceptable/high/limited/minimal）', present: false })
  } else if (tier === 'high' || tier === 'unacceptable') {
    // 高风险系统的强义务检查
    const hrChecks = [
      ['conformity_assessment', 'aiactradar:conformity-missing', 'govern', 'medium', 'No conformity assessment', '缺少合格性评估（Annex VII / Art 43）'],
      ['eu_database_registration', 'aiactradar:eu-db-missing', 'govern', 'medium', 'Not in EU database', '未在 EU AI Act 数据库注册（Art 49/71）'],
      ['transparency_disclosure', 'aiactradar:transparency-missing', 'transparency', 'medium', 'No transparency disclosure', '缺少透明度告知义务（Art 50）'],
      ['technical_documentation', 'aiactradar:tech-doc-missing', 'govern', 'medium', 'No technical documentation', '缺少技术文档（Art 11/18）'],
      ['post_market_monitoring', 'aiactradar:post-market-missing', 'govern', 'medium', 'No post-market monitoring', '缺少上市后监测（Art 72）'],
      ['bias_testing', 'aiactradar:bias-test-missing', 'fairness', 'low', 'No bias testing', '未做偏差/公平性测试（Art 10 数据治理延伸）']
    ]
    const present = {}
    for (const [key, id, category, severity, title, detail] of hrChecks) {
      const ok = cfgObj[key] === true
      present[key] = ok
      if (!ok) items.push({ id, category, severity, title, detail, present: false })
    }
    const ho = cfgObj.human_oversight === true
    present.human_oversight = ho
    if (!ho) items.push({ id: 'aiactradar:human-oversight-missing', category: 'govern', severity: 'high', title: 'No human oversight', detail: '缺少人工监督措施（Art 14）', present: false })
    items.push({ id: '_tier', category: 'meta', severity: 'low', title: `Risk tier: ${tier}`, detail: `已分级为 ${tier}`, present: true })
  } else {
    items.push({ id: '_tier', category: 'meta', severity: 'low', title: `Risk tier: ${tier}`, detail: `低风险层级（${tier}），无强义务项`, present: true })
  }

  const realFindings = items.filter(i => i.present === false)
  const weights = { high: 18, medium: 10, low: 5 }
  const bySeverity = { high: 0, medium: 0, low: 0 }
  let penalty = 0
  for (const it of realFindings) { penalty += weights[it.severity] || 0; bySeverity[it.severity]++ }
  const score = Math.max(0, 100 - penalty)

  const metrics = {
    aiact_compliance_score: score,
    risk_tier: tier || null,
    total_findings: realFindings.length,
    by_severity: bySeverity
  }
  return { items: realFindings, metrics }
}
