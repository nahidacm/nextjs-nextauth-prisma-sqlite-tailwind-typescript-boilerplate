import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  
    await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
        password: 'passwd',
        posts: {
          create: { title: 'Hello World', content: 'Hello temporary world' },
        },
      },
    });
  
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });

    res.json(allUsers);
}