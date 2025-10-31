// src/app/payment/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/app/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const plans = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 120,
    interval: 'month',
    description: 'Perfect for getting started',
    save: null,
  },
  {
    id: 'annual',
    name: 'Annual Plan',
    price: 1200,
    interval: 'year',
    description: 'Best value - save $240',
    save: 240,
  },
];

export default function PaymentPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  if (!session) {
    return <div>Please sign in to access payment.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Premium Subscription
          </h1>
          <p className="text-xl text-gray-300">
            Unlock restaurant management features with our premium plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-800 rounded-lg p-8 cursor-pointer transition-all border-2 ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-gray-750'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
              onClick={() => setSelectedPlan(plan.id as 'monthly' | 'annual')}
            >
              {plan.save && (
                <div className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  Save ${plan.save}
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-2">/{plan.interval}</span>
              </div>
              <p className="text-gray-300 mb-6">{plan.description}</p>
              <div className="text-green-400 font-semibold">
                {selectedPlan === plan.id ? '✓ Selected' : 'Select Plan'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm selectedPlan={selectedPlan} />
          </Elements>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>Secure payment powered by Stripe. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}