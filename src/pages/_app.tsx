import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import { SessionProvider } from 'next-auth/react'
import { AppType } from 'next/dist/shared/lib/utils'
import type { AppRouter } from '../backend/router'
import Header from '../components/header'
import '../styles/globals.css'
import Footer from '../components/footer'

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  )
}
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
        }
      },
      url,
      transformer: superjson,

      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp)
