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
    secure: isProduction, // true in production, false in development
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    domain: domain, // Set domain for production
  });

  console.log('SESSION CREATED - Customer ID:', customerId);
  console.log('SESSION CREATED - Domain:', domain);

  return sessionToken;
}

export async function getCustomerSession() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('customer_session')?.value;

    if (!sessionToken) {
      console.log('No customer_session cookie found');
      return null;
    }

    const decoded = Buffer.from(sessionToken, 'base64').toString();
    const [customerId] = decoded.split(':');

    if (!customerId) {
      console.log('Invalid session token - no customer ID');
      return null;
    }

    console.log('SESSION FOUND - Customer ID:', customerId);
    return { customerId };
  } catch (error) {
    console.error('Error getting customer session:', error);
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