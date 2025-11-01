//src/app/api/auth/customer/resend-verification/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { generateToken } from '@/lib/customer-auth';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find the existing verification token
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { customer: true },
    });

    if (!existingToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Generate new token
    const newToken = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update the verification token
    await prisma.verificationToken.update({
      where: { token },
      data: {
        token: newToken,
        expires,
      },
    });

    // Send new verification email
    await sendVerificationEmail(existingToken.customer.email, newToken, 'customer');

    return NextResponse.json({
      message: 'New verification email sent! Check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}