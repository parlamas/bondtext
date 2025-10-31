//src/app/book/[code]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function RestaurantBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { customer } = useCustomerAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    partySize: 2,
    childrenCount: 0,
    childrenAges: '',
    specialRequests: '',
  });

  const restaurantCode = params.code as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!customer) {
      router.push('/customer/signin');
    }
  }, [customer, router]);

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantCode}`);
        const data = await response.json();
        
        if (response.ok) {
          setRestaurant(data.restaurant);
        } else {
          console.error('Restaurant not found');
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantCode]);

  if (!customer || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Restaurant Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono">
              {restaurant.restaurantCode}
            </span>
          </div>
          <div className="space-y-2 text-gray-300">
            <p>📍 {restaurant.address}</p>
            <p>📞 {restaurant.phone}</p>
            <p>✉️ {restaurant.email}</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Make Your Booking</h2>
          {/* Add the booking form from previous implementation */}
          <p className="text-gray-400">Booking form will go here...</p>
        </div>
      </div>
    </div>
  );
}