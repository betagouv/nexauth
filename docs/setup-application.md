# Setup application

Create or edit your `pages/_app.tsx` (or `.ts`, `.jsx`, `.js`) page:

```tsx
import { AuthProvider } from 'nexauth'

import Header from 'path/to/your/Header/component'
import Loader from 'path/to/your/Loader/component'
import SignInDialog from 'path/to/your/SignInDialog/component'

// To force authentication on all /admin & /admin/**/* pages:
const PRIVATE_PATHS = [/^\/admin($|\/)/]

export default function MetiersNumeriquesApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider
        Loader={Loader}
        privatePaths={PRIVATE_PATHS}
        SignInDialog={SignInDialog}
      >
        <Header />

        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
```

You can see a full example of `<Header />`, `<Loader />` & `<SignInDialog />` components [there][lnk-example].

---

[![License][img-prev]](/setup-api)
[![License][img-next]](/access-authenticated-user)

[img-prev]: https://img.shields.io/badge/«%20Previous%20step%20:%20Setup%20API-fff.svg?style=for-the-badge&color=21304d&labelColor=000
[img-next]: https://img.shields.io/badge/Next%20step%20:%20Access%20Authenticated%20User%20»-fff.svg?style=for-the-badge&color=21304d&labelColor=000
[lnk-example]: https://github.com/betagouv/nexauth/tree/main/examples/with-prisma/pages/_app.tsx
