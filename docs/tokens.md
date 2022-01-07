# Tokens

## Access Token

- **Brief:** Allow an application to access an API protected route
- **Usage:** Sent via the `Authorization` header within any API request requiring an authentication
- **Storage:** It should **NEVER** be stored anywhere
- **Representation:** `JWS`
- **Lifetime:** `1200` (= 20 minutes in seconds)
- **Payload:**

  ```ts
  {
    /** Expiration date */
    exp: number // Unix time (in seconds)
    /** Creation date */
    iat: number // Unix time (in seconds)
    /** Token CUID */
    jti: string
    /** User CUID */
    uid: string
    /** Custom non-sensitive user information, i.e.: */
    data: {
      email?: string
      firstName?: string
      lastName?: string
      role?: string
      scopes?: string[]
      // ...
    }
  }
  ```

## Refresh Tokens

- **Brief:** ...
- **Usage:** Sent to `/auth/refresh` within the body of a `POST` request each time the Access Token expires
- **Storage:** [LocalStorage][lnk-local-storage]
- **Representation:** `JWS`
- **Lifetime:** `1200` (= 20 minutes in seconds)
- **Payload:**

  ```ts
  {
    /** Expiration date */
    exp: number // Unix time (in seconds)
    /** Creation date */
    iat: number // Unix time (in seconds)
    /** Token CUID */
    jti: string
    /** User CUID */
    uid: string
    data: {
      /** Refresh Token Family CUID */
      familyId: string
    }
  }
  ```

---

[lnk-local-storage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
