// app/payment/page.tsx

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  
  const isAnnual = selectedPlan === 'annual';
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
          plan: selectedPlan,
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Unlock Restaurant Management
          </h1>
          <p className="text-gray-300">
            Choose your plan to get started
          </p>
        </div>

        {/* Two Green Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Monthly Plan */}
          <div 
            className={`p-6 rounded-lg cursor-pointer transition-all border-2 ${
              selectedPlan === 'monthly' 
                ? 'bg-green-600 border-green-400 transform scale-105' 
                : 'bg-green-700 border-green-600 hover:border-green-400'
            }`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <h3 className="text-xl font-bold text-white mb-3">Monthly Plan</h3>
            <div className="flex items-baseline mb-3">
              <span className="text-3xl font-bold text-white">$120</span>
              <span className="text-green-200 ml-2">/month</span>
            </div>
            <ul className="text-green-100 mb-4 space-y-1 text-sm">
              <li>✓ Full restaurant management</li>
              <li>✓ Menu customization</li>
              <li>✓ Order management</li>
              <li>✓ Customer analytics</li>
              <li>✓ 24/7 support</li>
            </ul>
            <div className="text-center py-2 rounded text-sm font-bold bg-white text-green-600">
              {selectedPlan === 'monthly' ? 'Selected' : 'Select'}
            </div>
          </div>

          {/* Annual Plan */}
          <div 
            className={`p-6 rounded-lg cursor-pointer transition-all border-2 relative ${
              selectedPlan === 'annual' 
                ? 'bg-green-600 border-green-400 transform scale-105' 
                : 'bg-green-700 border-green-600 hover:border-green-400'
            }`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                BEST VALUE
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Annual Plan</h3>
            <div className="flex items-baseline mb-1">
              <span className="text-3xl font-bold text-white">$1200</span>
              <span className="text-green-200 ml-2">/year</span>
            </div>
            <p className="text-yellow-300 font-semibold mb-3 text-sm">Save $240</p>
            <ul className="text-green-100 mb-4 space-y-1 text-sm">
              <li>✓ Everything in Monthly</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Custom features</li>
              <li>✓ Early access to new tools</li>
            </ul>
            <div className="text-center py-2 rounded text-sm font-bold bg-white text-green-600">
              {selectedPlan === 'annual' ? 'Selected' : 'Select'}
            </div>
          </div>
        </div>

        {/* Single Subscribe Button */}
        <div className="text-center">
          {error && (
            <div className="bg-red-600 border border-red-500 text-white p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full max-w-md bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg mx-auto"
          >
            {loading ? 'Redirecting to Payment...' : `Subscribe Now - $${amount}`}
          </button>
          
          <p className="text-gray-400 text-sm mt-3">
            Secure payment processed by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}