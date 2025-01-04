import type { AppProps } from 'next/app'
import ReduxProvider from '@/store/provider'
import Layout from '@/components/Layout'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ReduxProvider>
  )
} 