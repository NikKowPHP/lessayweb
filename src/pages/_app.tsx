import type { AppProps } from 'next/app'
import ReduxProvider from '@/store/provider'
import '@/styles/globals.css'
import Layout from '@/components/layout/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ReduxProvider>
  )
} 