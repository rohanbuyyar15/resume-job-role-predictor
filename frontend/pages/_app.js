import '@/styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AI Resume Analyzer Pro</title>
        <meta name="description" content="Production-ready AI-powered Resume Analysis and Job Role Prediction System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
