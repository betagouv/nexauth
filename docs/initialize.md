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
