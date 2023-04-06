import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session(session, token) {
      session.userId = token.userId;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
