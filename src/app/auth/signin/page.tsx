//src/app/auth/signin/page.tsx

'use client';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center z-10 max-w-md w-full space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Welcome Back
            </h2>
            <p className="text-gray-300">
              Sign in to access your restaurant dashboard
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-lg text-gray-900 bg-white hover:bg-gray-100 transition-colors"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

