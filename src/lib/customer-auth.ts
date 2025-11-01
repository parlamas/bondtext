//src/lib/customer-auth.ts

import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function createCustomerSession(customerId: string) {
  const cookieStore = cookies();

  const sessionToken = Buffer.from(`${customerId}:${Date.now()}`).toString('base64');

  // Get the domain for production
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = isProduction ? '.bondtext.com' : undefined;

  cookieStore.set('customer_session', sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    domain: domain,
  });

  console.log('SESSION CREATED - Customer ID:', customerId);
  console.log('SESSION CREATED - Token:', sessionToken);

  return sessionToken;
}

export async function getCustomerSession() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('customer_session')?.value;

    console.log('GET SESSION - Raw cookie value:', sessionToken);

    if (!sessionToken) {
      console.log('GET SESSION - No cookie found');
      return null;
    }

    const decoded = Buffer.from(sessionToken, 'base64').toString();
    console.log('GET SESSION - Decoded:', decoded);
    
    const [customerId, timestamp] = decoded.split(':');
    console.log('GET SESSION - Customer ID:', customerId);
    console.log('GET SESSION - Timestamp:', timestamp);

    if (!customerId) {
      console.log('GET SESSION - No customer ID in token');
      return null;
    }

    // Validate that customerId is a valid Prisma ID format
    if (!customerId.startsWith('cmhg')) {
      console.log('GET SESSION - Invalid customer ID format:', customerId);
      return null;
    }

    console.log('GET SESSION - Valid session found for customer:', customerId);
    return { customerId };
  } catch (error) {
    console.error('GET SESSION - Error:', error);
    return null;
  }
}

export async function deleteCustomerSession() {
  const cookieStore = cookies();
  cookieStore.delete('customer_session');
}

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}