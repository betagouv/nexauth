import { Nexauth, PrismaAdapter } from 'nexauth'

import prisma from '../../../libs/prisma'

export default Nexauth({
  adapter: new PrismaAdapter({
    prismaInstance: prisma,
  }),
})
