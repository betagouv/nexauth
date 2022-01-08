# Initialize

You first need to generate the EdDSA key pair in order to sign and verify JWTs.

## Development

At the root of your project, run:

```sh
npx nexauth init
```

which will generate and inject both `EDDSA_PRIVATE_KEY` & `NEXT_PUBLIC_EDDSA_PUBLIC_KEY` environment variables
within your `.env` file.

## Production

You'll need the same enviroment variables in production but **DON'T USE YOUR LOCAL VALUES IN PRODUCTION**.

Generate a new EdDSA key pair for that, by running:

```sh
npx nexauth generate
```

---
 
[![License][img-prev]](/install)
[![License][img-next]](/setup-api)

[img-prev]: https://img.shields.io/badge/«%20Previous%20step%20:%20Install-fff.svg?style=for-the-badge&color=21304d&labelColor=000
[img-next]: https://img.shields.io/badge/Next%20step%20:%20Setup%20API%20»-fff.svg?style=for-the-badge&color=21304d&labelColor=000
