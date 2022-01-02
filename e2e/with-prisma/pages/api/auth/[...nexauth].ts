import { Nexauth } from 'nexauth'
import PrimaAdapter from 'nexauth/dist/adapters/PrismaAdapter'

import prisma from '../../../libs/prisma'

export default Nexauth({
  adapter: new PrimaAdapter({
    prismaInstance: prisma,
  }),
})
