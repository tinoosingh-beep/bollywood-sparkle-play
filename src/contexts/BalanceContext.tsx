import React, { createContext, useContext, useState, useCallback } from 'react';

interface BalanceContextType {
  balance: number;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => boolean;
  floatingPoints: { id: number; amount: number; x: number; y: number }[];
  triggerFloatingPoints: (amount: number, x: number, y: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(500);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; amount: number; x: number; y: number }[]>([]);

  const addPoints = useCallback((points: number) => {
    setBalance((prev) => prev + points);
  }, []);

  const deductPoints = useCallback((points: number): boolean => {
    if (balance >= points) {
      setBalance((prev) => prev - points);
      return true;
    }
    return false;
  }, [balance]);

  const triggerFloatingPoints = useCallback((amount: number, x: number, y: number) => {
    const id = Date.now();
    setFloatingPoints((prev) => [...prev, { id, amount, x, y }]);
    
    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== id));
    }, 1200);
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, addPoints, deductPoints, floatingPoints, triggerFloatingPoints }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
