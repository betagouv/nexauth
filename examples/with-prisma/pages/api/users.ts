import prisma from '../../libs/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function RefreshTokensController(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany()

  res.status(200).json({
    data: users,
  })
}
