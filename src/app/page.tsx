//src/app/page.tsx

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center z-10">
          <h1 className="text-6xl font-bold mb-6">
            BondText
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Elevate your restaurant's digital presence
          </p>
          <Link 
            href="/auth/signin" 
            className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Access Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
