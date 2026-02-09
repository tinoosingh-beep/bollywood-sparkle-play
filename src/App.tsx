import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BalanceProvider } from '@/contexts/BalanceContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingPoints } from '@/components/FloatingPoints';
import { Home } from '@/pages/Home';
import { Markets } from '@/pages/Markets';
import { Games } from '@/pages/Games';
import { Leaderboard } from '@/components/Leaderboard';

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'markets':
      case 'collection':
        return <Markets />;
      case 'games':
      case 'shop':
        return <Games />;
      case 'leaderboard':
      case 'social':
        return <Leaderboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-4">
      <FloatingPoints />
      
      <main className="px-4 py-2 max-w-lg mx-auto">
        {renderContent()}
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BalanceProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </BalanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
