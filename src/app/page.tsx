// app/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function HomePage() {
  const router = useRouter();
  const { customer } = useCustomerAuth();
  const [searchData, setSearchData] = useState({
    country: '',
    city: '',
  });
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Restaurant</h1>
          <p className="text-xl text-blue-100 mb-8">
            Book in advance and enjoy exclusive discounts
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto -mt-10 px-4">
        <form onSubmit={handleSearch} className="bg-gray-800 rounded-lg p-8 shadow-lg">
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