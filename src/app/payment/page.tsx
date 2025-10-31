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
  
  const plan = searchParams.get('plan') || 'annual';
  const isAnnual = plan === 'annual';
  const amount = isAnnual ? 1200 : 120;

  const handlePayment = async () => {
    if (!session) return;
    
    setLoading(true);
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
      alert('Failed to process payment. Please try again.');
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
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Premium Subscription
          </h1>
          <p className="text-xl text-gray-300">
            Unlock restaurant management features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 p-8 rounded-lg border-2 border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Monthly Plan</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-bold text-white">$120</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>✓ Full restaurant management</li>
              <li>✓ Menu customization</li>
              <li>✓ Order management</li>
              <li>✓ Customer analytics</li>
              <li>✓ 24/7 support</li>
            </ul>
            <button
              onClick={() => router.push('/payment?plan=monthly')}
              className={`w-full px-6 py-3 rounded transition-colors ${
                plan === 'monthly' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {plan === 'monthly' ? 'Selected' : 'Select Monthly'}
            </button>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg border-2 border-green-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Annual Plan</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-4xl font-bold text-white">$1200</span>
              <span className="text-gray-400 ml-2">/year</span>
            </div>
            <p className="text-green-400 font-semibold mb-4">Save $240 compared to monthly</p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>✓ Everything in Monthly</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Custom features</li>
              <li>✓ Early access to new tools</li>
            </ul>
            <button
              onClick={() => router.push('/payment?plan=annual')}
              className={`w-full px-6 py-3 rounded transition-colors ${
                plan === 'annual' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {plan === 'annual' ? 'Selected' : 'Select Annual'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Complete Your Subscription
          </h2>
          
          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{isAnnual ? 'Annual Plan' : 'Monthly Plan'}</span>
              <span className="text-2xl font-bold text-white">${amount}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            {loading ? 'Processing...' : `Subscribe Now - $${amount}`}
          </button>
          
          <p className="text-gray-400 text-sm mt-4 text-center">
            You'll be redirected to Stripe to complete your payment securely
          </p>
        </div>
      </div>
    </div>
  );
}