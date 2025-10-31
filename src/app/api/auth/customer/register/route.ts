//src/app/api/auth/customer/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

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

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        fullName,
        username,
        email,
        telephone,
        countryCode,
        ageRange,
        password: hashedPassword,
        emailVerified: new Date(), // Auto-verify for now
      },
    });

    return NextResponse.json({ 
      message: 'Customer created successfully',
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        username: customer.username,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}