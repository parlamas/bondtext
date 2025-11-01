//src/app/customer/verify-email/page.tsx

'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerVerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
      const response = await fetch(`/api/auth/customer/verify-email?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully! You can now sign in.');
        
        // Auto-redirect to signin after 3 seconds
        setTimeout(() => {
          router.push('/customer/signin');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  const resendVerification = async () => {
    setStatus('loading');
    setMessage('Sending new verification email...');
    
    try {
      const response = await fetch('/api/auth/customer/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('New verification email sent! Check your inbox.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to resend verification email.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold">Verify Your Email</h2>
          <p className="text-gray-400 mt-2">Customer Account Verification</p>
        </div>

        <div className="space-y-6">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <p className="text-blue-400 text-lg">{message || 'Verifying your email...'}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-400 text-lg font-semibold">Success!</p>
              </div>
              <p className="text-green-300 mb-4">{message}</p>
              <p className="text-green-200 text-sm">Redirecting to sign in...</p>
              <div className="mt-4">
                <Link
                  href="/customer/signin"
                  className="inline-block bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white transition-colors"
                >
                  Sign In Now
                </Link>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-400 text-lg font-semibold">Verification Failed</p>
              </div>
              <p className="text-red-300 mb-4">{message}</p>
              
              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white transition-colors"
                >
                  Resend Verification Email
                </button>
                
                <Link
                  href="/customer/signup"
                  className="block w-full bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-white transition-colors"
                >
                  Try Signing Up Again
                </Link>
                
                <Link
                  href="/customer/signin"
                  className="block text-blue-400 hover:text-blue-300 text-sm"
                >
                  Already verified? Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-gray-400 text-sm">
          <p>Having trouble? Contact support for assistance.</p>
        </div>
      </div>
    </div>
  );
}