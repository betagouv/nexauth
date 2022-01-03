import { AuthProvider } from 'nexauth'
import Head from 'next/head'

import Header from '../components/Header'
import Loader from '../components/Loader'
import SignInModal from '../components/SignInModal'

const PRIVATE_PATHS = [/^\/admin($|\/)/]

export default function MetiersNumeriquesApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          rel="stylesheet"
        />
      </Head>

      <AuthProvider Loader={Loader} privatePaths={PRIVATE_PATHS} SignInModal={SignInModal}>
        <Header />

        <main className="container">
          <Component {...pageProps} />
        </main>
      </AuthProvider>
    </>
  )
}
