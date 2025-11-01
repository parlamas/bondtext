//src/app/components/NavBar.tsx

'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useState } from 'react';

export default function NavBar() {
  const { data: session } = useSession();
  const { customer, logout } = useCustomerAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCustomerLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleRestaurantLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LEFT Section - Logo, Home, and CUSTOMER info */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              BondText
            </Link>
            
            <Link href="/" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* CUSTOMER INFO - Shows on LEFT side when signed in */}
            {customer && (
              <div className="hidden md:flex items-center space-x-2 ml-4">
                <span className="text-green-400 text-sm font-medium bg-green-900/30 px-3 py-1 rounded">
                  👤 {customer.username}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              // Signed in restaurant owner
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  🏪 {session.user?.username || session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleRestaurantLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : customer ? (
              // Signed in customer
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCustomerLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              // Not signed in
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu - Show/hide based on menu state */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700">
              
              {/* Customer info in mobile menu */}
              {customer && (
                <div className="px-3 py-2 text-green-400 text-sm font-medium border-b border-gray-700 mb-2">
                  👤 Customer: {customer.username}
                </div>
              )}

              {/* Restaurant info in mobile menu */}
              {session && (
                <div className="px-3 py-2 text-gray-300 text-sm border-b border-gray-700 mb-2">
                  🏪 Restaurant: {session.user?.username || session.user?.name || session.user?.email}
                </div>
              )}

              {/* Auth links for mobile */}
              {!session && !customer && (
                <>
                  <Link
                    href="/customer/signin"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Customer Sign In
                  </Link>
                  <Link
                    href="/customer/signup"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Customer Sign Up
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Restaurant Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Restaurant Sign Up
                  </Link>
                </>
              )}

              {/* Logout buttons for mobile */}
              {(session || customer) && (
                <button
                  onClick={() => {
                    if (session) handleRestaurantLogout();
                    if (customer) handleCustomerLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-400 hover:text-white hover:bg-red-700 rounded-md text-base font-medium"
                >
                  Sign Out
                </button>
              )}

              {/* Home link for mobile */}
              <Link
                href="/"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}