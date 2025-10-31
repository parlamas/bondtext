// app/payment/page.tsx

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const plan = searchParams.get('plan') || 'annual';
  const isAnnual = plan === 'annual';
  const amount = isAnnual ? 1200 : 120;

  const handlePayment = async () => {
    if (!session) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Please sign in to access payment.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Premium Subscription
          </h1>
          <p className="text-gray-300">
            Unlock restaurant management features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Monthly Plan</h3>
            <div className="flex items-baseline mb-3">
              <span className="text-3xl font-bold text-white">$120</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <ul className="text-gray-300 mb-4 space-y-1 text-sm">
              <li>✓ Full restaurant management</li>
              <li>✓ Menu customization</li>
              <li>✓ Order management</li>
              <li>✓ Customer analytics</li>
              <li>✓ 24/7 support</li>
            </ul>
            <button
              onClick={() => router.push('/payment?plan=monthly')}
              className={`w-full px-4 py-2 rounded transition-colors text-sm ${
                plan === 'monthly' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {plan === 'monthly' ? 'Selected' : 'Select Monthly'}
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border-2 border-green-500 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                BEST VALUE
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Annual Plan</h3>
            <div className="flex items-baseline mb-1">
              <span className="text-3xl font-bold text-white">$1200</span>
              <span className="text-gray-400 ml-2">/year</span>
            </div>
            <p className="text-green-400 font-semibold mb-3 text-sm">Save $240</p>
            <ul className="text-gray-300 mb-4 space-y-1 text-sm">
              <li>✓ Everything in Monthly</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Custom features</li>
              <li>✓ Early access to new tools</li>
            </ul>
            <button
              onClick={() => router.push('/payment?plan=annual')}
              className={`w-full px-4 py-2 rounded transition-colors text-sm ${
                plan === 'annual' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {plan === 'annual' ? 'Selected' : 'Select Annual'}
            </button>
          </div>
        </div>

        {/* Compact Payment Section */}
        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            Complete Subscription
          </h2>
          
          {/* Order Summary - More Compact */}
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <h3 className="text-md font-semibold text-white mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">{isAnnual ? 'Annual Plan' : 'Monthly Plan'}</span>
              <span className="text-xl font-bold text-white">${amount}</span>
            </div>
          </div>

          {/* Inline Error Alert */}
          {error && (
            <div className="bg-red-600 border border-red-500 text-white p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            {loading ? 'Processing...' : `Subscribe Now - $${amount}`}
          </button>
          
          <p className="text-gray-400 text-xs mt-3 text-center">
            You'll be redirected to Stripe to complete your payment securely
          </p>
        </div>
      </div>
    </div>
  );
}