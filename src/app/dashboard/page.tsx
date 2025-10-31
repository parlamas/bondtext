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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handleFeatureClick = (feature: string) => {
    if (!isPremium) {
      setShowPaymentModal(true);
    } else {
      // Navigate to the actual feature
      router.push(`/restaurant/${feature}`);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Clean Header - No redundant welcome message */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
            <div className="flex items-center space-x-4">
              {isPremium && (
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  PREMIUM
                </div>
              )}
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
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {isPremium ? 'Manage Your Restaurant' : 'Get Your Restaurant Online'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isPremium 
              ? 'Everything you need to run your restaurant efficiently' 
              : 'Choose a feature below to get started'
            }
          </p>
        </div>

        {!isPremium && (
          <div className="bg-blue-600 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">
                  Unlock Full Access
                </h3>
                <div className="mt-2 text-blue-100">
                  <p>
                    Get started with our premium features to set up your restaurant, manage menus, 
                    process orders, and track your performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats for Premium Users */}
        {isPremium && (
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
        )}

        {/* Restaurant Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Menu Management */}
          <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Menu Management</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Create and manage your restaurant menu items, categories, pricing, and availability.
            </p>
            <button 
              onClick={() => handleFeatureClick('menu')}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors w-full"
            >
              {isPremium ? 'Manage Menu' : 'Set Up Menu'}
            </button>
          </div>

          {/* Orders */}
          <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Order Management</h3>
            </div>
            <p className="text-gray-400 mb-4">
              View, process, and track customer orders in real-time with notifications.
            </p>
            <button 
              onClick={() => handleFeatureClick('orders')}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors w-full"
            >
              {isPremium ? 'View Orders' : 'Manage Orders'}
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Business Analytics</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Track sales, customer behavior, and performance metrics with detailed reports.
            </p>
            <button 
              onClick={() => handleFeatureClick('analytics')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors w-full"
            >
              {isPremium ? 'View Analytics' : 'See Analytics'}
            </button>
          </div>

          {/* Restaurant Settings */}
          <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-600 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Restaurant Setup</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Configure your restaurant details, hours, location, and business information.
            </p>
            <button 
              onClick={() => handleFeatureClick('settings')}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded transition-colors w-full"
            >
              {isPremium ? 'Manage Settings' : 'Setup Restaurant'}
            </button>
          </div>
        </div>

        {/* Call to Action for Non-Premium Users */}
        {!isPremium && (
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Launch Your Restaurant?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of successful restaurants using our platform to manage their business, 
              increase sales, and delight customers.
            </p>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              Get Started Today
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Premium Subscription Required
              </h3>
              <p className="text-gray-400">
                Unlock full access to all restaurant management features
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Monthly Plan</h4>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">$120</span>
                  <span className="text-gray-400">per month</span>
                </div>
              </div>
              
              <div className="bg-green-900 border border-green-600 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">Annual Plan</h4>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">SAVE $240</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">$1200</span>
                  <span className="text-gray-400">per year</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => router.push('/payment')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}