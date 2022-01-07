# Access authenticated user

## Server

**nexauth** provides a helper to access the authenticated user info (= Access Token public payload):

`getUser()` returns `undefined` when not authenticated.

```ts
import { getUser } from 'nexauth'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function MyApiController(req: NextApiRequest, res: NextApiResponse) {
  const user = getUser(req)

  if (user === undefined) {
    res.json({
      isAuthenticated: false
    })

    return
  }

  res.json({
    isAuthenticated: true,
    user,
  })
}
```

## Application

### React Hook

**nexauth** provides a hook to access authentication helpers as well as authenticated user info (from the Access Token
public payload):

`useAuth().user` is `undefined` when not authenticated.

```tsx
import { useAuth } from 'nexauth'

export default function MyPageOrComponent() {
  const auth = useAuth()

  if (!auth.state.isAuthenticated) {
    return <p>Not authenticated.</p>
  }

  return <p>{`Authenticated as ${auth.user.email}.`}</p>
}
```

---

<div style="display: flex; justify-content: space-between;">
  <a href="/#/setup-application">
    <img src="https://img.shields.io/badge/«%20Previous%20step%20:%20Setup%20Application-fff.svg?style=for-the-badge&color=21304d&labelColor=000" />
  </a>

  <span></span>
</div>
