
//src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { customer } = useCustomerAuth();
  const [searchData, setSearchData] = useState({
    country: '',
    city: '',
  });
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const countries = [
    'Greece', 'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/restaurants/search?country=${searchData.country}&city=${searchData.city}`);
      const data = await response.json();
      
      if (response.ok) {
        setRestaurants(data.restaurants);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = (restaurantCode: string) => {
    if (!customer) {
      router.push('/customer/signin');
      return;
    }
    router.push(`/book/${restaurantCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">BondText</h1>
          <p className="text-xl text-blue-100 mb-8">
            Book in advance and enjoy exclusive discounts
          </p>
        </div>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="max-w-2xl mx-auto -mt-10 px-4 relative">
          <form onSubmit={handleSearch} className="bg-gray-800 rounded-lg p-8 shadow-lg relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Find Restaurants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={searchData.country}
                  onChange={(e) => setSearchData({...searchData, country: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={searchData.city}
                  onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                  placeholder="Enter your city"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              {loading ? 'Searching...' : 'Find Restaurants'}
            </button>
          </form>
        </div>
      )}

      {/* Signup Forms Section - Shows when search is closed */}
      {!showSearch && (
        <div className="max-w-6xl mx-auto mt-12 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Join BondText</h2>
            <p className="text-gray-400">Choose your account type to get started</p>
            <button
              onClick={() => setShowSearch(true)}
              className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to restaurant search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Sign Up */}
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Customer Sign Up</h3>
                <p className="text-gray-400">Pre-book, pre-order, and save at your favorite restaurants</p>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-300 space-y-2">
                  <p>✓ Pre-order from restaurant menus</p>
                  <p>✓ Enjoy exclusive discounts</p>
                  <p>✓ Secure prepayment</p>
                  <p>✓ Easy booking process</p>
                </div>
                
                <Link
                  href="/customer/signup"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-4 rounded transition-colors"
                >
                  Sign Up as Customer
                </Link>
                
                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link href="/customer/signin" className="text-blue-400 hover:text-blue-300">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Restaurant Sign Up */}
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Restaurant Sign Up</h3>
                <p className="text-gray-400">Attract more customers with pre-orders and flexible discounts</p>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-300 space-y-2">
                  <p>✓ Manage your menu online</p>
                  <p>✓ Set your own discount criteria</p>
                  <p>✓ Receive prepayments</p>
                  <p>✓ Reduce food waste</p>
                </div>
                
                <Link
                  href="/auth/signup"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3 px-4 rounded transition-colors"
                >
                  Sign Up as Restaurant
                </Link>
                
                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-green-400 hover:text-green-300">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {restaurants.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12 px-4">
          <h2 className="text-2xl font-bold mb-6">Restaurants in {searchData.city}, {searchData.country}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-mono">
                    {restaurant.restaurantCode}
                  </span>
                </div>
                
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>📍 {restaurant.address}</p>
                  <p>📞 {restaurant.phone}</p>
                  <p>✉️ {restaurant.email}</p>
                </div>

                <button
                  onClick={() => handleRestaurantSelect(restaurant.restaurantCode)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Book This Restaurant
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {restaurants.length === 0 && searchData.country && searchData.city && !loading && (
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-gray-400">No restaurants found in {searchData.city}, {searchData.country}</p>
        </div>
      )}
    </div>
  );
}