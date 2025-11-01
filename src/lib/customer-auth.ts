//src/lib/customer-auth.ts

import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function createCustomerSession(customerId: string) {
  const cookieStore = cookies();

  const sessionToken = Buffer.from(`${customerId}:${Date.now()}`).toString('base64');

  // More permissive cookie settings for testing
  cookieStore.set('customer_session', sessionToken, {
    httpOnly: true,
    secure: false, // Set to false for testing, true in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  console.log('SESSION CREATED - Customer ID:', customerId);
  console.log('SESSION CREATED - Cookie set with maxAge:', 60 * 60 * 24 * 7);

  return sessionToken;
}

export async function getCustomerSession() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('customer_session')?.value;

    if (!sessionToken) {
      return null;
    }

    const decoded = Buffer.from(sessionToken, 'base64').toString();
    const [customerId] = decoded.split(':');

    if (!customerId) {
      return null;
    }

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