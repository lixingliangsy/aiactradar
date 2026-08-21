import Head from 'next/head'

export default function Page() {
  const NAME = "AIActRadar";
  return (
    <>
      <Head>
        <title>{NAME} — Integrations</title>
        <meta name="description" content={NAME + " — Export targets, API, and webhooks."} />
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
          <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
          <p className="mt-3 text-slate-600">AIActRadar fits into your stack via export and API.</p>
          <ul className="mt-6 list-disc pl-6 text-slate-600 space-y-2">
            <li><strong>Export targets:</strong> JSON download, copy-to-clipboard.</li>
            <li><strong>API + webhooks:</strong> available on Pro/Enterprise for pipeline embedding.</li>
            <li><strong>Incoming:</strong> works from any tool that can POST the supported input fields.</li>
          </ul>
          <p className="mt-6 text-sm text-slate-500">Honesty note: connectors marked &quot;planned&quot; are not yet shipped. Mark each as Planned until live.</p>
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
