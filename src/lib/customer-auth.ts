//src/lib/customer-auth.ts

import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function createCustomerSession(customerId: string) {
  const cookieStore = cookies();

  const sessionToken = Buffer.from(`${customerId}:${Date.now()}`).toString('base64');

  cookieStore.set('customer_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return sessionToken;
}

export async function getCustomerSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('customer_session')?.value;

  if (!sessionToken) return null;

  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString();
    const [customerId] = decoded.split(':');

    return { customerId };
  } catch (error) {
    return null;
  }
}

export async function deleteCustomerSession() {
  const cookieStore = cookies();
  cookieStore.delete('customer_session');
}

// Add missing function for generating tokens
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

