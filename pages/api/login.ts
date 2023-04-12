import { NextApiHandler } from 'next'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1d' })

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400,
        path: '/',
      })
    )

    return res.status(200).json({ message: 'Login successful', token })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

export default handler
