# Setup API

By default, **nexauth** expect 4 routes to exist:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/signup`

`Nexauth` automatically provide those routes and their internal logic.

This internal logic can be customized via the `config` option.

The **adapter** is used to connect to the database and handle the users and refresh tokens tables.

## Using Prisma Adapter

Create a `pages/api/auth/[...nexauth].ts` (or `.js` by removing typings) page.

Here is an example of a fully-con:

```ts
import { PrismaClient } from '@prisma/client'
import { Nexauth, PrismaAdapter } from 'nexauth'

import type { User } from '@prisma/client'

export default Nexauth<User>({
  adapter: new PrismaAdapter({
    // Don't initialize Prisma like that: it would open too many connections.
    // This is simplified for the sake of this example.
    prismaInstance: new PrismaClient(),
  }),
  config: {
    // What user properties will the Access Token payload contain?
    // This payload is signed BUT public, don't put anything sensitive there.
    accessTokenPublicUserProps: ['id', 'role', 'scopes', 'username'],

    // These property values will be used for the first user signup
    // if there are no user in the database:
    firstUserDefaultProps: {
      isActive: true,
      role: 'ADMINISTRATOR',
    },

    // Additional conditions allowing the user (in the database) to log in:
    // By default, nexauth only checks the email & password.
    logInConditions: [user => user.isActive],
    
    // List of user fields than can be set via the body payload to sign up:
    newUserAllowedProps: ['email', 'password', 'username'],
  },
})
```

### Required Prisma Tables & Rows

```graphql
model RefreshToken {
  id        String   @id
  familyId  String
  ip        String
  value     String   @unique
  expiredAt DateTime

  user   User   @relation(fields: [userId], references: [id])
  userId String
}

model User {
  id       String @id
  email    String @unique
  password String

  refreshTokens RefreshToken[]
}
```

---

<div style="display: flex; justify-content: space-between;">
  <a href="/#/initialize">
    <img src="https://img.shields.io/badge/«%20Previous%20step%20:%20Initialize-fff.svg?style=for-the-badge&color=21304d&labelColor=000" />
  </a>

  <a href="/#/setup-application">
    <img src="https://img.shields.io/badge/Next%20step%20:%20Setup%20Application%20»-fff.svg?style=for-the-badge&color=21304d&labelColor=000" />
  </a>
</div>

## Using a custom Adapter

?> _TODO_ Document this part.

---

<div style="display: flex; justify-content: space-between;">
  <a href="/#/initialize">
    <img src="https://img.shields.io/badge/«%20Previous%20step%20:%20Initialize-fff.svg?style=for-the-badge&color=21304d&labelColor=000" />
  </a>

  <a href="/#/setup-application">
    <img src="https://img.shields.io/badge/Next%20step%20:%20Setup%20Application%20»-fff.svg?style=for-the-badge&color=21304d&labelColor=000" />
  </a>
</div>
