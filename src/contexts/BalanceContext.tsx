import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface BalanceContextType {
  balance: number;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => boolean;
  floatingPoints: { id: number; amount: number; x: number; y: number }[];
  triggerFloatingPoints: (amount: number, x: number, y: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

let floatingIdCounter = 0;

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(500);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; amount: number; x: number; y: number }[]>([]);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Cleanup all pending timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(id => clearTimeout(id));
      timeouts.clear();
    };
  }, []);

  const addPoints = useCallback((points: number) => {
    setBalance((prev) => prev + points);
  }, []);

  const deductPoints = useCallback((points: number): boolean => {
    let success = false;
    setBalance((prev) => {
      if (prev >= points) {
        success = true;
        return prev - points;
      }
      return prev;
    });
    return success;
  }, []);

  const triggerFloatingPoints = useCallback((amount: number, x: number, y: number) => {
    const id = ++floatingIdCounter;
    setFloatingPoints((prev) => [...prev, { id, amount, x, y }]);

    const timeoutId = setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== id));
      timeoutsRef.current.delete(timeoutId);
    }, 1200);
    timeoutsRef.current.add(timeoutId);
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
