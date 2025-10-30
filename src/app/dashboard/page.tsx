//src/app/dashboard/page.tsx

'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
  console.log('Session status:', status);
  console.log('Session data:', session);
}, [status, session]);

  if (status === 'loading') {
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
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold">BondText</div>
        <div className="flex items-center space-x-6">
          <span className="text-gray-300">{session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {session.user?.name || session.user?.email}</p>
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p><strong>Role:</strong> {session.user?.role}</p>
            <p><strong>User ID:</strong> {session.user?.id}</p>
          </div>
        </div>

        {/* Restaurant Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Menu Management */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Menu Management</h3>
            <p className="text-gray-400 mb-4">Create and manage your restaurant menu</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
              Manage Menu
            </button>
          </div>

          {/* Orders */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Orders</h3>
            <p className="text-gray-400 mb-4">View and process customer orders</p>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors">
              View Orders
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Analytics</h3>
            <p className="text-gray-400 mb-4">Track your restaurant performance</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

