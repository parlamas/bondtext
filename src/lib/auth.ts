// src/lib/auth.ts

// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"; // Add this import

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Keep your Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add Email provider for email verification
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
      // Or if using Resend:
      // server: process.env.EMAIL_SERVER,
      // from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
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
    verifyRequest: '/auth/verify-request', // Add this for email verification page
  },
};

