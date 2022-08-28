import type { AppProps } from 'next/app'
import '../styles/globals.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'

import { CookiesProvider } from 'react-cookie'

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <QueryClientProvider client={queryClient}>
         <CookiesProvider>
            <Component {...pageProps} />
         </CookiesProvider>
      </QueryClientProvider>
   )
}

export default MyApp
