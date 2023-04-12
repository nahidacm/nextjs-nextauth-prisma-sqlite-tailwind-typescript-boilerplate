// pages/api/register.ts
import { NextApiHandler } from 'next'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      return res.status(201).json(user)
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({ message: 'Email already exists' })
      }

      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

export default handler
