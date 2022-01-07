import prisma from '../../libs/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function RefreshTokensController(req: NextApiRequest, res: NextApiResponse) {
  const refreshTokens = await prisma.refreshToken.findMany()

  res.status(200).json({
    data: refreshTokens,
  })
}
