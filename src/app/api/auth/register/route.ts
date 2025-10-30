// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // ULTIMATE DEBUG: Check ALL environment variables and configurations
    console.log('🚨 ULTIMATE DEBUG - CHECKING EVERYTHING:');
    console.log('🔧 DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('🔧 EMAIL_SERVER_HOST:', process.env.EMAIL_SERVER_HOST || '❌ MISSING');
    console.log('🔧 EMAIL_SERVER_USER:', process.env.EMAIL_SERVER_USER || '❌ MISSING');
    console.log('🔧 EMAIL_SERVER_PORT:', process.env.EMAIL_SERVER_PORT || '❌ MISSING');
    console.log('🔧 EMAIL_SERVER_PASSWORD:', process.env.EMAIL_SERVER_PASSWORD ? '✅ SET' : '❌ MISSING');
    console.log('🔧 EMAIL_FROM:', process.env.EMAIL_FROM || '❌ MISSING');
    console.log('🔧 NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ MISSING');
    console.log('🔧 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ SET' : '❌ MISSING');

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection: SUCCESS');
    } catch (dbError) {
      console.log('❌ Database connection: FAILED', dbError);
    }

    const body = await request.json();
    const { 
      username, 
      email, 
      password, 
      name,
      companyName,
      address,
      country,
      phone,
      website,
      employees,
      outlets,
      taxNumber
    } = body;

    console.log('📝 Registration attempt:', { username, email });

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, username and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        name: name || '',
        password: hashedPassword,
        emailVerified: null,
      }
    });

    console.log('✅ User created successfully:', user.id);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store verification token in database
    try {
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: verificationToken,
          expires,
        }
      });
      console.log('✅ Verification token stored in database');
    } catch (tokenError) {
      console.error('❌ Failed to store verification token:', tokenError);
    }

    // Send verification email with COMPLETE error handling
    console.log('📧 Attempting to send verification email...');
    try {
      await sendVerificationEmail(email, verificationToken);
      console.log('✅ Verification email sent successfully');
    } catch (emailError) {
      console.error('❌ FAILED to send verification email:', emailError);
      const err = emailError as Error;
      console.error('🔧 Email error details:', {
        name: err.name,
        message: err.message,
        code: (err as any).code,
        stack: err.stack
      });
    }

    return NextResponse.json({
      message: 'User created successfully. Please check your email for verification.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    console.error('💥 REGISTRATION FAILED:', error);
    const err = error as Error;
    console.error('🔧 Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { error: 'Internal server error: ' + err.message },
      { status: 500 }
    );
  }
}