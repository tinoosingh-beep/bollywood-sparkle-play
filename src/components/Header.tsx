import { useBalance } from '@/contexts/BalanceContext';
import { Coins, Sparkles } from 'lucide-react';

export function Header() {
  const { balance } = useBalance();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3">
      <div className="glass-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-gold" />
          <h1 className="font-display text-2xl font-bold text-gradient-gold">
            BollyBet
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 border border-gold/30">
          <Coins className="w-5 h-5 text-gold" />
          <span className="font-semibold text-gold">{balance} MP</span>
        </div>
      </div>
    </header>
  );
}
