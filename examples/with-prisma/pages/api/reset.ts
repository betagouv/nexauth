import prisma from '../../libs/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function ResetController(req: NextApiRequest, res: NextApiResponse) {
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()

  res.status(204).end()
}
