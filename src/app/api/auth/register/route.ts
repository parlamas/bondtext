// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      username, 
      email, 
      password, 
      name,
      // Accept but ignore restaurant fields for now
      companyName,
      address,
      country,
      phone,
      website,
      employees,
      outlets,
      taxNumber
    } = body;

    console.log('Registration attempt:', { username, email });

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

    // Create user (ignore restaurant fields for now)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        name: name || '',
        password: hashedPassword,
        emailVerified: null,
      }
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Send verification email with error handling
try {
  await sendVerificationEmail(email, verificationToken);
  console.log('Verification email sent successfully');
} catch (emailError) {
  console.error('Failed to send verification email:', emailError);
  // Don't fail the registration - user can request resend later
}

    console.log('User created successfully:', user.id);

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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
