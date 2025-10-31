// src/app/dashboard/page.tsx
'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Check premium status when session loads
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/check-premium-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.user.id }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setIsPremium(data.isPremium);
          }
        } catch (error) {
          console.error('Error checking premium status:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session) {
      checkPremiumStatus();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Show payment prompt if user is not premium
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header - REMOVED THE EXTRA SIGN OUT BUTTON HERE */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {session.user?.name || session.user?.email}</p>
          </div>

          {/* Payment Required Banner */}
          <div className="bg-yellow-600 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">
                  Premium Subscription Required
                </h3>
                <div className="mt-2 text-yellow-100">
                  <p>
                    Access to restaurant management features requires a premium subscription.
                    Choose the plan that works best for you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors"
              >
                Subscribe Monthly
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors"
              >
                Subscribe Annually
              </button>
            </div>
          </div>

          <div className="text-center mt-8 text-gray-400">
            <p>No long-term commitment. Cancel anytime. 30-day money-back guarantee.</p>
          </div>
        </div>
      </div>
    );
  }

  // Premium user dashboard
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - Only one Sign Out button here */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
              <p className="text-gray-400">Welcome back, {session.user?.name || session.user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                PREMIUM
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Today's Orders</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Pending Orders</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Monthly Revenue</h3>
            <p className="text-2xl font-bold">$2,847</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Menu Items</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
        </div>

        {/* Restaurant Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Menu Management */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Menu Management</h3>
            </div>
            <p className="text-gray-400 mb-4">Create and manage your restaurant menu items, categories, and pricing.</p>
            <button 
              onClick={() => router.push('/restaurant/menu')}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors w-full"
            >
              Manage Menu
            </button>
          </div>

          {/* Orders */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Orders</h3>
            </div>
            <p className="text-gray-400 mb-4">View, process, and track customer orders in real-time.</p>
            <button 
              onClick={() => router.push('/restaurant/orders')}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors w-full"
            >
              View Orders
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Analytics</h3>
            </div>
            <p className="text-gray-400 mb-4">Track your restaurant performance, sales, and customer insights.</p>
            <button 
              onClick={() => router.push('/restaurant/analytics')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors w-full"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}