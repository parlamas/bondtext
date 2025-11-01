//src/app/api/auth/customer/session/route.ts

import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('=== SESSION API CALLED ===');
    const session = await getCustomerSession();
    console.log('Session data from cookie:', session);

    if (!session?.customerId) {
      console.log('No valid session found');
      return NextResponse.json({ customer: null });
    }

    console.log('Looking for customer with ID:', session.customerId);
    
    const customer = await prisma.customer.findUnique({
      where: { id: session.customerId },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
      }
    });

    console.log('Customer found in database:', customer);

    if (!customer) {
      console.log('No customer found for session ID');
      return NextResponse.json({ customer: null });
    }

    console.log('Returning customer data:', customer);
    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ customer: null });
  }
}