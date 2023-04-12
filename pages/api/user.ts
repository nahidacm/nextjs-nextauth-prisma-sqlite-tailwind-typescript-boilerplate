// pages/api/user.ts
import { NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { token } = req.cookies

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
      const decodedToken = jwt.verify(token, 'secret')
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
      })

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      return res.status(200).json(user)
    } catch {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

export default handler
