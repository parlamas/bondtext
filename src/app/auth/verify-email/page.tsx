//src/app/auth/verify-email/page.tsx

'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold">Email Verification</h2>
        </div>

        <div className="space-y-4">
          {status === 'loading' && (
            <div className="text-blue-400">
              <p>Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-green-400">
              <p className="text-xl">✅ {message}</p>
              <div className="mt-6">
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition-colors"
                >
                  Sign In Now
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-red-400">
              <p className="text-xl">❌ {message}</p>
              <div className="mt-6 space-y-2">
                <p>Please try signing up again.</p>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition-colors"
                >
                  Go to Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



