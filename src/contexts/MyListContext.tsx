import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';

export interface MyListItem {
  id: string;
  title: string;
  type: 'movie' | 'show' | 'game' | 'news';
  thumbnail?: string;
  addedAt: number;
}

interface MyListContextType {
  items: MyListItem[];
  addItem: (item: Omit<MyListItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  isInList: (id: string) => boolean;
  toggleItem: (item: Omit<MyListItem, 'addedAt'>) => void;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MyListItem[]>(() => {
    try {
      const stored = localStorage.getItem('bollybet-mylist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((newItems: MyListItem[]) => {
    setItems(newItems);
    try { localStorage.setItem('bollybet-mylist', JSON.stringify(newItems)); } catch {}
  }, []);

  const addItem = useCallback((item: Omit<MyListItem, 'addedAt'>) => {
    persist(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev;
      const updated = [...prev, { ...item, addedAt: Date.now() }];
      try { localStorage.setItem('bollybet-mylist', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      const updated = [...prev, { ...item, addedAt: Date.now() }];
      try { localStorage.setItem('bollybet-mylist', JSON.stringify(updated)); } catch {}
      return updated;
    });
    toast.success(`Added "${item.title}" to My List 🎬`);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      try { localStorage.setItem('bollybet-mylist', JSON.stringify(updated)); } catch {}
      return updated;
    });
    toast.success('Removed from My List');
  }, []);

  const isInList = useCallback((id: string) => items.some(i => i.id === id), [items]);

  const toggleItem = useCallback((item: Omit<MyListItem, 'addedAt'>) => {
    if (items.some(i => i.id === item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  }, [items, addItem, removeItem]);

  return (
    <MyListContext.Provider value={{ items, addItem, removeItem, isInList, toggleItem }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) throw new Error('useMyList must be used within MyListProvider');
  return context;
}
