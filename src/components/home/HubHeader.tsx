import { useBalance } from '@/contexts/BalanceContext';
import { Trophy, Coins, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HubHeaderProps {
  trophies: number;
}

export function HubHeader({ trophies }: HubHeaderProps) {
  const { balance } = useBalance();

  return (
    <div className="flex items-center justify-between px-1">
      {/* Left: Trophies + MP */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsl(250 30% 18%), hsl(250 35% 14%))',
            boxShadow: '0 4px 12px hsla(250, 30%, 8%, 0.5), inset 0 1px 2px hsla(250, 20%, 30%, 0.3)',
            border: '1px solid hsla(45, 100%, 50%, 0.3)',
          }}
        >
          <Trophy className="w-4 h-4 text-gold" />
          <span className="text-sm font-bold text-gold font-mono">{trophies}</span>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsl(250 30% 18%), hsl(250 35% 14%))',
            boxShadow: '0 4px 12px hsla(250, 30%, 8%, 0.5), inset 0 1px 2px hsla(250, 20%, 30%, 0.3)',
            border: '1px solid hsla(320, 100%, 55%, 0.3)',
          }}
        >
          <Coins className="w-4 h-4 text-neon-pink" />
          <span className="text-sm font-bold text-neon-pink font-mono">{balance}</span>
        </div>
      </div>

      {/* Right: BollyPass badge */}
      <motion.button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{
          background: 'linear-gradient(135deg, hsl(280 80% 55%), hsl(320 90% 50%))',
          boxShadow: '0 4px 16px hsla(300, 80%, 50%, 0.4)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span className="text-xs font-bold text-white">BollyPass</span>
        <span
          className="ml-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white"
        >
          7
        </span>
      </motion.button>
    </div>
  );
}
