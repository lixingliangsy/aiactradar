import Head from 'next/head'

export default function Page() {
  const NAME = "AIActRadar";
  return (
    <>
      <Head>
        <title>{NAME} — Blog</title>
        <meta name="description" content={NAME + " — Definitional and how-to posts."} />
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
          <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
          <p className="mt-3 text-slate-600">Definitional and how-to posts that help search engines and humans understand AIActRadar.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">What is AIActRadar — and when to use it</h3>
            <p className="mt-2 text-sm text-slate-600">Define AIActRadar in plain terms, the problem it solves, and the 3 signs you need it.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">How to run a compliance status in 10 minutes</h3>
            <p className="mt-2 text-sm text-slate-600">A step-by-step for a first compliance status pass using AIActRadar.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">Common compliance status mistakes (and how to avoid them)</h3>
            <p className="mt-2 text-sm text-slate-600">5 recurring errors teams make in compliance status, with fixes.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">AIActRadar vs. doing it manually</h3>
            <p className="mt-2 text-sm text-slate-600">Trade-offs: speed, cost, and where human review still wins.</p>
          </article>
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
