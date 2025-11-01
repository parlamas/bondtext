//src/app/api/auth/customer/debug-session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('customer_session')?.value;
  
  console.log('=== DEBUG SESSION ===');
  console.log('Cookie exists:', !!sessionToken);
  console.log('Cookie value:', sessionToken);
  
  if (sessionToken) {
    try {
      const decoded = Buffer.from(sessionToken, 'base64').toString();
      console.log('Decoded session:', decoded);
      const [customerId, timestamp] = decoded.split(':');
      console.log('Customer ID:', customerId);
      console.log('Timestamp:', timestamp);
    } catch (error) {
      console.log('Decoding error:', error);
    }
  }
  
  return NextResponse.json({ 
    cookieExists: !!sessionToken,
    cookieValue: sessionToken 
  });
}