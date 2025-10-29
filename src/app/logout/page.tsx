//src/app/logout/page.tsx

'use client';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function Logout() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return <div>Signing out...</div>;
}