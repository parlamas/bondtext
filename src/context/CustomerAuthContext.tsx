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
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCustomerSession();
  }, []);

  const checkCustomerSession = async () => {
    try {
      const response = await fetch('/api/auth/customer/session');
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer);
      }
    } catch (error) {
      console.error('Error checking customer session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (customerData: Customer) => {
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
    <CustomerAuthContext.Provider value={{ customer, isLoading, login, logout }}>
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