//src/app/api/auth/customer/signout/route.ts

import { NextResponse } from 'next/server';
import { deleteCustomerSession } from '@/lib/customer-auth';

export async function POST() {
  try {
    await deleteCustomerSession();
    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}