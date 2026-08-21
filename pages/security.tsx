import Head from 'next/head'

export default function Page() {
  const NAME = "AIActRadar";
  return (
    <>
      <Head>
        <title>{NAME} — Security & Compliance</title>
        <meta name="description" content={NAME + " — How AIActRadar handles your data and the compliance posture it maintains."} />
      </Head>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-slate-900">AIActRadar</a>
            <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-500">
              <a href="/use-cases" className="hover:text-slate-900">Use cases</a>
              <a href="/integrations" className="hover:text-slate-900">Integrations</a>
              <a href="/how-it-works" className="hover:text-slate-900">How it works</a>
              <a href="/security" className="hover:text-slate-900">Security</a>
              <a href="/blog" className="hover:text-slate-900">Blog</a>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-bold text-slate-900">Security &amp; Compliance</h1>
          <p className="mt-3 text-slate-600">AIActRadar maps your AI systems to their EU AI Act obligations, auto-generates risk registers and technical documentation, and keeps you ahead of every phased compliance deadline.</p>
          <h2 className="mt-8 text-xl font-semibold text-slate-900">What we handle</h2>
          <p className="mt-2 text-slate-600">AIActRadar processes the text or configuration you submit to produce its output. We do not train public models on your submissions without explicit consent.</p>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Data handling commitments</h2>
          <ul className="mt-2 list-disc pl-6 text-slate-600">
            <li>Inputs are used only to produce your result; not published or indexed by us.</li>
            <li>Payments processed by Waffo Pancake (merchant of record) — we do not store card data.</li>
            <li>Exports contain only your own run data.</li>
          <li><strong>EU AI Act mapping</strong> — high-risk actions are logged and mapped to obligation articles where applicable. <a className="text-brand" href="https://artificialintelligenceact.eu/">ref: EU AI Act</a></li>
          </ul>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Compliance posture</h2>
          <ul className="mt-2 list-disc pl-6 text-slate-600">
            <li>GDPR-aligned practices (lawful basis, data minimization, access on request). <a className="text-brand" href="https://gdpr.eu/">ref: GDPR</a></li>
            <li>OWASP guidance for web app and LLM prompt-injection hygiene. <a className="text-brand" href="https://owasp.org/">ref: OWASP</a></li>
            <li>We do NOT claim certification (no SOC 2 / ISO 27001 badge unless earned).</li>
          </ul>
          <div className="my-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
            <p className="font-bold text-amber-900 mb-1">⚠️ We do NOT guarantee</p>
            <ul className="list-disc pl-6 text-amber-900 text-sm space-y-1">
              <li>We do <strong>NOT guarantee</strong> compliance with any regulation.</li>
              <li>We do <strong>NOT claim 100%</strong> security or uptime.</li>
              <li>We do <strong>NOT promise</strong> the tool will &quot;never miss&quot; an issue — coverage is fixed at the named checks.</li>
            </ul>
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-slate-500 flex flex-wrap gap-6">
            <a href="/security" className="hover:text-slate-900">Security</a>
            <a href="/use-cases" className="hover:text-slate-900">Use cases</a>
            <a href="/integrations" className="hover:text-slate-900">Integrations</a>
            <a href="/how-it-works" className="hover:text-slate-900">How it works</a>
            <a href="/blog" className="hover:text-slate-900">Blog</a>
          </div>
        </footer>
      </div>
    </>
  )
}
