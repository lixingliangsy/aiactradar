import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID
const UMAMI_URL = (process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is').replace(/\/$/, '')

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{SUPPORT.productName} · EU AI Act compliance radar</title>
              <meta property="og:type" content="website" />
        <meta property="og:title" content="AIActRadar" />
        <meta property="og:description" content="AIActRadar maps your AI systems to their EU AI Act obligations, auto-generates risk registers and technical documentation, and keeps you ahead of every phased compliance deadline." />
        <meta property="og:url" content="https://aiactradar.lxsaihub.com/" />
        <meta property="og:image" content="https://aiactradar.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIActRadar" />
        <meta name="twitter:description" content="AIActRadar maps your AI systems to their EU AI Act obligations, auto-generates risk registers and technical documentation, and keeps you ahead of every phased compliance deadline." />
        <meta name="twitter:image" content="https://aiactradar.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"AIActRadar","url":"https://aiactradar.lxsaihub.com/","description":"AIActRadar maps your AI systems to their EU AI Act obligations, auto-generates risk registers and technical documentation, and keeps you ahead of every phased compliance deadline.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      {UMAMI_ID && (
        <Script
          async
          src={`${UMAMI_URL}/script.js`}
          data-website-id={UMAMI_ID}
          strategy="afterInteractive"
        />
      )}
      <Component {...pageProps} />
      <ChatWidget
        productName={SUPPORT.productName}
        brandColor={SUPPORT.brandColor}
        sessionKeyPrefix={SUPPORT.productSlug}
      />
    </>
  )
}
