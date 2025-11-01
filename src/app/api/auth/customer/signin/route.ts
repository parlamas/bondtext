//src/app/api/auth/customer/signin/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find customer by username
    const customer = await prisma.customer.findUnique({
      where: { username }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!customer.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before signing in' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Return customer data (frontend will handle storage in localStorage)
    return NextResponse.json({
      message: 'Sign in successful',
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        username: customer.username,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Customer signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}