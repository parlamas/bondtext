// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    // Email provider for email verification
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // Add CredentialsProvider for username/password login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.username },
              { username: credentials.username }
            ]
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        // Return simpler user object
        return {
          id: user.id,
          email: user.email,
          name: user.name || user.username,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true }
        });
        
        session.user.role = dbUser?.role || 'CUSTOMER';
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
};