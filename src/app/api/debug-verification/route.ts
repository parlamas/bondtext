// src/app/api/debug-verification/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check recent verification tokens in database
    const recentTokens = await prisma.verificationToken.findMany({
      orderBy: { expires: 'desc' },
      take: 5
    });

    // Check recent users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, email: true, createdAt: true }
    });

    return Response.json({
      database: {
        verificationTokens: recentTokens,
        recentUsers: recentUsers,
        tokenCount: recentTokens.length
      },
      signInAttempts: 'Check Vercel logs for sendVerificationRequest messages'
    });
  } catch (error: any) {
    return Response.json({ 
      error: error.message,
      suggestion: 'Database might not be accessible' 
    });
  }
}