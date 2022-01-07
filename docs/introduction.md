# Introduction

All tokens are signed (JWS) but **not** encrypted (JWE) JWTs.

Why? Because JWEs are only required when storing sensitive private information over non-secure connections,
which is something you should **never** do anyway [<sup>[1]</sup>][lnk-jwt-rfc-privacy].

The signing algorithm uses EdDSA elliptic curve in its Ed448 variant [<sup>[2]</sup>][lnk-curve448]
[<sup>[3]</sup>][lnk-ed25517-vs-ed448].

The EdDSA key pair is consumed through environment variables, namely:

- `EDDSA_PRIVATE_KEY`: Only available within back-end applications.
- `NEXT_PUBLIC_EDDSA_PUBLIC_KEY`: Available within both back-end and front-end applications.

---

[lnk-curve448]: https://en.wikipedia.org/wiki/Curve448 ':target=_blank'
[lnk-ed25517-vs-ed448]: https://crypto.stackexchange.com/a/67468/52638 ':target=_blank'
[lnk-jwt-rfc-privacy]: https://www.rfc-editor.org/rfc/rfc7519#section-11.2 ':target=_blank'
