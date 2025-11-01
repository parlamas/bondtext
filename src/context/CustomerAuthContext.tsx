//src/context/CustomerAuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Customer {
  id: string;
  fullName: string;
  username: string;
  email: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  login: (customer: Customer) => void;
  logout: () => void;
  checkCustomerSession: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkCustomerSession = async () => {
    try {
      console.log('Checking customer session...');
      const response = await fetch('/api/auth/customer/session', {
        cache: 'no-store', // Prevent caching
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Session check successful:', data.customer);
        setCustomer(data.customer);
      } else {
        console.log('Session check failed:', response.status);
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error checking customer session:', error);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCustomerSession();
  }, []);

  const login = (customerData: Customer) => {
    console.log('Login called with:', customerData);
    setCustomer(customerData);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/customer/signout', { method: 'POST' });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setCustomer(null);
    }
  };

  return (
    <CustomerAuthContext.Provider value={{ 
      customer, 
      isLoading, 
      login, 
      logout,
      checkCustomerSession 
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}