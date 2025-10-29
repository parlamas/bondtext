//src/app/auth/signup/page.tsx

'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RestaurantSignUp() {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    country: '',
    phone: '',
    fullName: '',
    email: '',
    username: '',
    password: '',
    website: '',
    employees: '',
    outlets: '',
    taxNumber: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          companyName: formData.companyName,
          address: formData.address,
          country: formData.country,
          phone: formData.phone,
          website: formData.website,
          employees: parseInt(formData.employees) || 0,
          outlets: parseInt(formData.outlets) || 1,
          taxNumber: formData.taxNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please check your email for verification.');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Restaurant Owner Sign Up</h2>
          <p className="text-gray-400 mt-2">Create your restaurant account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Company Name *</label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your restaurant name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Full Address *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Street, City, State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Country *</label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 234 567 8900"
            />
          </div>

          {/* Additional Business Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Company Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-restaurant.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Number of Employees</label>
            <input
              type="number"
              name="employees"
              min="1"
              value={formData.employees}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Number of Outlets</label>
            <input
              type="number"
              name="outlets"
              min="1"
              value={formData.outlets}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Tax Identification Number *</label>
            <input
              type="text"
              name="taxNumber"
              required
              value={formData.taxNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your business tax ID"
            />
          </div>

          {/* Owner/Manager Information */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Owner/Manager full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="owner@your-restaurant.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Username *</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password *</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-md font-medium transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Create Restaurant Account'}
          </button>

          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}