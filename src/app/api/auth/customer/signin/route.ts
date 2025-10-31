//src/app/api/auth/customer/signin/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createCustomerSession } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
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
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create customer session
    await createCustomerSession(customer.id);

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