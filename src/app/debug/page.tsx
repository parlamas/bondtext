//src/app/debug/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const response = await fetch('/api/auth/customer/debug-session');
    const data = await response.json();
    setSessionInfo(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <pre className="bg-gray-800 p-4 rounded">
        {JSON.stringify(sessionInfo, null, 2)}
      </pre>
      <button 
        onClick={checkSession}
        className="mt-4 bg-blue-600 px-4 py-2 rounded"
      >
        Refresh
      </button>
    </div>
  );
}