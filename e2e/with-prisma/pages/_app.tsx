import AuthProvider from 'nexauth/AuthProvider'

import Loader from '../components/Loader'
import LoginModal from '../components/LoginModal'

export default function MetiersNumeriquesApp({ Component, pageProps }) {
  return (
    <AuthProvider Loader={Loader} LoginModal={LoginModal} privatePaths={[]}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
