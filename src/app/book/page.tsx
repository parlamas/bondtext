// app/book/page.tsx

'use client';

import Link from 'next/link';

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Book Your Table & Save
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Pre-order and prepay for exclusive discounts. Book at least 24 hours in advance.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Create Account</h3>
              <p className="text-gray-400 text-sm">Sign up with your details</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Book & Prepay</h3>
              <p className="text-gray-400 text-sm">Choose date, time, and party size</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Enjoy Discount</h3>
              <p className="text-gray-400 text-sm">Get exclusive menu discounts</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">Important Notice</h3>
              <div className="mt-2 text-yellow-100">
                <p>All bookings require prepayment. No refunds, changes, or cancellations allowed. 
                Must be booked at least 24 hours in advance.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/book/signup"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-block"
          >
            Get Started - Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}