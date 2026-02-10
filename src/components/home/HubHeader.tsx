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
      {/* Left: BollyPass badge */}
      <motion.button
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, hsl(280 80% 55%), hsl(320 90% 50%), hsl(45 100% 55%))',
          backgroundSize: '200% 200%',
          boxShadow: '0 4px 20px hsla(300, 80%, 50%, 0.5), 0 0 10px hsla(45, 100%, 55%, 0.3)',
          border: '1px solid hsla(45, 100%, 70%, 0.4)',
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-4 h-4 text-white drop-shadow-[0_0_6px_hsla(45,100%,80%,0.8)]" />
        <span className="text-xs font-extrabold text-white tracking-wide drop-shadow-[0_0_4px_hsla(0,0%,0%,0.5)]">BollyPass</span>
        <span
          className="ml-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: 'hsla(0, 0%, 100%, 0.25)', boxShadow: 'inset 0 1px 2px hsla(0,0%,0%,0.2)' }}
        >
          7
        </span>
      </motion.button>

      {/* Right: Trophies + MP */}
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
          {/* Floating MP icon */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Coins className="w-4 h-4 text-neon-pink" />
          </motion.div>
          <span className="text-sm font-bold text-neon-pink font-mono">{balance}</span>
        </div>
      </div>
    </div>
  );
}
