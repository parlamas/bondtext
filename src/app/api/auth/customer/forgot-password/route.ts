//src/app/api/auth/customer/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateToken } from '@/lib/customer-auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      // Don't reveal whether email exists
      return NextResponse.json({
        message: 'If an account with that email exists, you will receive password reset instructions.',
      });
    }

    // Generate reset token
    const resetToken = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store reset token using identifier (email)
    await prisma.passwordResetToken.upsert({
      where: { 
        identifier_token: {
          identifier: customer.email,
          token: resetToken,
        }
      },
      update: {
        token: resetToken,
        expires,
      },
      create: {
        token: resetToken,
        expires,
        identifier: customer.email,
      },
    });

    // Send reset email
    await sendPasswordResetEmail(customer.email, resetToken, 'customer');

    return NextResponse.json({
      message: 'Password reset instructions sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

