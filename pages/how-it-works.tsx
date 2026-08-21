import Head from 'next/head'

export default function Page() {
  const NAME = "AIActRadar";
  return (
    <>
      <Head>
        <title>{NAME} — How it works</title>
        <meta name="description" content={NAME + " — Three steps from input to result."} />
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
          <h1 className="text-3xl font-bold text-slate-900">How it works</h1>
          <p className="mt-3 text-slate-600">Get a structured compliance status in three steps.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-semibold text-slate-900">1 · Paste input</h3><p className="mt-2 text-sm text-slate-600">The prompt, config, or text AIActRadar needs.</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-semibold text-slate-900">2 · Run AIActRadar</h3><p className="mt-2 text-sm text-slate-600">The engine produces a structured compliance status.</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-semibold text-slate-900">3 · Export &amp; act</h3><p className="mt-2 text-sm text-slate-600">Download JSON / copy the result and apply it.</p></div>
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
