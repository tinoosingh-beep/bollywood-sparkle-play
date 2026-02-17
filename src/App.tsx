import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BalanceProvider } from '@/contexts/BalanceContext';
import { ScriptSlotsProvider } from '@/contexts/ScriptSlotsContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BottomNav } from '@/components/BottomNav';
import { FloatingPoints } from '@/components/FloatingPoints';
import { Home } from '@/pages/Home';
import { Markets } from '@/pages/Markets';
import { Games } from '@/pages/Games';
import { Leaderboard } from '@/components/Leaderboard';
import { Collection } from '@/pages/Collection';
import { SplashScreen } from '@/components/SplashScreen';
import { PitchDeck } from '@/pages/PitchDeck';

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [splashDone, setSplashDone] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'markets':
        return <Markets />;
      case 'collection':
        return <Collection />;
      case 'games':
      case 'shop':
        return <Games />;
      case 'leaderboard':
      case 'social':
        return <Leaderboard />;
      case 'pitch':
        return <PitchDeck />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <div className="min-h-screen pb-20 pt-4">
        <FloatingPoints />
        
        <main className="px-4 py-2 max-w-lg mx-auto">
          {renderContent()}
        </main>
        
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BalanceProvider>
          <ScriptSlotsProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </ScriptSlotsProvider>
        </BalanceProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
