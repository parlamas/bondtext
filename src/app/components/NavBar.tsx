//src/app/components/NavBar.tsx

'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function NavBar() {
  const { data: session } = useSession();
  const { customer, logout } = useCustomerAuth(); // Changed from logoutCustomer to logout

  const handleCustomerLogout = () => {
    logout(); // Changed from logoutCustomer()
    window.location.href = '/';
  };

  const handleRestaurantLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo and Home */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              BondText
            </Link>
            
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>

          {/* Right Section - Auth Links */}
          <div className="flex items-center space-x-4">
            {session ? (
              // Signed in restaurant owner
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  Restaurant: {session.user?.username || session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleRestaurantLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Restaurant Sign Out
                </button>
              </div>
            ) : customer ? (
              // Signed in customer
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  Customer: {customer.username || customer.email}
                </span>
                <button
                  onClick={handleCustomerLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Customer Sign Out
                </button>
              </div>
            ) : (
              // Not signed in - show all auth options
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Link
                    href="/customer/signin"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors border border-gray-600"
                  >
                    Customer Sign In
                  </Link>
                  <Link
                    href="/customer/signup"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Customer Sign Up
                  </Link>
                </div>
                
                <div className="h-6 border-l border-gray-600"></div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/signin"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors border border-gray-600"
                  >
                    Restaurant Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Restaurant Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}