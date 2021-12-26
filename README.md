# nextauth

[![License][img-license]][lnk-license]
[![CI Status][img-github]][lnk-github]
[![Code Coverage][img-codecov]][lnk-codecov]
[![NPM Version][img-npm]][lnk-npm]

Strongly opinionated but dead simple and safe JWT-based authentication for Next.js framework.

_🗒️ Work and documentation in progress!_

---

- [Tokens](#tokens)
  - [ID Token](#id-token)
  - [Access Token](#access-token)
  - [Refresh Tokens](#refresh-tokens)
- [Lifecycle](#lifecycle)
- [Alternatives](#alternatives)
- [References](#references)

---

## Tokens

All tokens are signed (JWS) but **not** encrypted (JWE) JWTs.

Why? Because JWEs are only required when storing sensitive private information over non-secure connections,
which is something you should **never** do anyway [[1]][lnk-jwt-rfc-privacy].

They are signed (and verified) via a generated RSA key pair
which can be automatically generated and git-ignored by running:

```sh
node ./node_modules/nexauth/dist/scripts/generateKeyPairFiles.js
```

at the root of your Next.js project.

### ID Token

- **Brief:** Carries custom user information used by the front-end client (email, name, role, scopes, etc).
- **Representation:** `JWS`
- **Lifetime:** `36000` (= 10 hours in seconds) [[2][lnk-signing-algorithms]]
- **Algorithm:** `RS256`

### Access Token

- **Brief:** ...
- **Representation:** `JWS`

### Refresh Tokens

- **Brief:** ...
- **Representation:** `JWS`

## Lifecycle

## Alternatives

**nextauth** is very opinionated for the sake of simplifying authentication covering SSR-generated, SPAs and
API-based split applications. It's not intented to compete with more largely used authentication libraries as:

- [NextAuth.js](https://next-auth.js.org/)
- [Passport.js](https://www.passportjs.org/)
- [auth0](https://auth0.com/)
- [iron-session](https://github.com/vvo/iron-session)

Don't hesitate to use these libraries instead of **nextauth** if they're a better fit for your use-case.

## References

- [What Are Refresh Tokens and How to Use Them Securely](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
- [How to select a JOSE / JWT cryptographic algorithm for your application](https://connect2id.com/products/nimbus-jose-jwt/algorithm-selection-guide)
- [JWTs: Which Signing Algorithm Should I Use?](https://www.scottbrady91.com/jose/jwts-which-signing-algorithm-should-i-use)
- [Cipher Suites Demystified](https://joehonton.medium.com/cipher-suites-demystified-ada2e97be9c9)

---

[img-codecov]: https://img.shields.io/codecov/c/github/betagouv/nexauth/main?style=flat-square
[img-github]: https://img.shields.io/github/workflow/status/betagouv/nexauth/Check/main?style=flat-square
[img-license]: https://img.shields.io/github/license/betagouv/nexauth?style=flat-square
[img-npm]: https://img.shields.io/npm/v/nexauth?style=flat-square
[lnk-codecov]: https://codecov.io/gh/betagouv/nexauth/branch/main
[lnk-github]: https://github.com/betagouv/nexauth/actions?query=branch%3Amain++
[lnk-license]: https://github.com/betagouv/nexauth/blob/main/LICENSE
[lnk-npm]: https://www.npmjs.com/package/nexauth

[lnk-jwt-rfc-privacy]: https://www.rfc-editor.org/rfc/rfc7519#section-11.2
[lnk-signing-algorithms]: https://auth0.com/docs/best-practices/token-best-practices#signing-algorithms-
