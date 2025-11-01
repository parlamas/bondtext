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

  // Load customer from localStorage on initial load
  useEffect(() => {
    const loadCustomerFromStorage = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedCustomer = localStorage.getItem('bondtext_customer');
          if (storedCustomer) {
            const customerData = JSON.parse(storedCustomer);
            setCustomer(customerData);
            console.log('✅ Loaded customer from localStorage:', customerData.username);
          }
        }
      } catch (error) {
        console.error('Error loading customer from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomerFromStorage();
  }, []);

  const login = (customerData: Customer) => {
    try {
      if (typeof window !== 'undefined') {
        // Store in localStorage for persistence
        localStorage.setItem('bondtext_customer', JSON.stringify(customerData));
        setCustomer(customerData);
        console.log('✅ Customer logged in and stored:', customerData.username);
      }
    } catch (error) {
      console.error('Error storing customer in localStorage:', error);
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bondtext_customer');
        setCustomer(null);
        console.log('✅ Customer logged out');
      }
    } catch (error) {
      console.error('Error removing customer from localStorage:', error);
    }
  };

  return (
    <CustomerAuthContext.Provider value={{ 
      customer, 
      isLoading, 
      login, 
      logout
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