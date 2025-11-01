//src/app/api/auth/customer/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { generateToken } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const { fullName, username, email, telephone, countryCode, ageRange, password } = await request.json();

    // Validate required fields
    if (!fullName || !username || !email || !telephone || !countryCode || !ageRange || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      );
    }

    const existingUsername = await prisma.customer.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create customer (without email verification)
    const customer = await prisma.customer.create({
      data: {
        fullName,
        username,
        email,
        telephone,
        countryCode,
        ageRange,
        password: hashedPassword,
        // REMOVED: emailVerified: new Date() - Don't auto-verify
      },
    });

    // Generate verification token
    const verificationToken = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: customer.email,
        token: verificationToken,
        expires,
      },
    });

    // Send verification email
    await sendVerificationEmail(customer.email, verificationToken, 'customer');

    return NextResponse.json({ 
      message: 'Registration successful! Please check your email for verification.',
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        username: customer.username,
        email: customer.email
      },
      requiresVerification: true
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}