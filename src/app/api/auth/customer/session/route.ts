//src/app/api/auth/customer/session/route.ts

import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getCustomerSession();
    
    if (!session?.customerId) {
      return NextResponse.json({ customer: null });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.customerId },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
      }
    });

    if (!customer) {
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ customer: null });
  }
}