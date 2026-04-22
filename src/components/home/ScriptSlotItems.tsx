import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Gift, Plus, Zap } from 'lucide-react';
import { type ReelRarity } from '@/contexts/ScriptSlotsContext';

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const RARITY_BORDER: Record<ReelRarity, string> = {
  common: 'hsla(45, 100%, 55%, 0.5)',
  rare: 'hsla(210, 100%, 60%, 0.5)',
  epic: 'hsla(280, 100%, 60%, 0.5)',
};

const RARITY_GLOW: Record<ReelRarity, string> = {
  common: 'hsla(45, 100%, 55%, 0.4)',
  rare: 'hsla(210, 100%, 60%, 0.4)',
  epic: 'hsla(280, 100%, 60%, 0.5)',
};

export function ReadySlot({ rarity, onOpen }: { rarity?: ReelRarity; onOpen: () => void }) {
  const r = rarity || 'common';

  return (
    <motion.button
      onClick={onOpen}
      className="relative flex aspect-square w-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-full"
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: [
          `0 0 12px ${RARITY_GLOW[r]}`,
          `0 0 22px ${RARITY_GLOW[r]}`,
          `0 0 12px ${RARITY_GLOW[r]}`,
        ],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        background: r === 'rare'
          ? 'linear-gradient(135deg, hsl(210 100% 65%), hsl(220 100% 58%))'
          : r === 'epic'
            ? 'linear-gradient(135deg, hsl(280 100% 65%), hsl(300 100% 58%))'
            : 'linear-gradient(135deg, hsl(45 100% 55%), hsl(35 90% 50%))',
      }}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 30%, hsla(0,0%,100%,0.35) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
      />
      <Gift className="relative z-10 h-5 w-5 text-foreground drop-shadow-[0_0_4px_hsla(0,0%,100%,0.6)]" />
      <span className="relative z-10 text-[10px] font-bold text-foreground">OPEN</span>
    </motion.button>
  );
}

export function LockedSlot({
  time,
  rarity,
  cost,
  onSpeedUp,
}: {
  time: number;
  rarity: ReelRarity;
  cost: number;
  onSpeedUp: () => void;
}) {
  return (
    <motion.button
      onClick={onSpeedUp}
      className="flex aspect-square w-full flex-col items-center justify-center gap-0 rounded-full bg-muted/80"
      style={{
        boxShadow: '0 2px 8px hsla(250, 20%, 50%, 0.2)',
        border: `2px solid ${RARITY_BORDER[rarity]}`,
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-[10px] font-mono font-bold text-foreground leading-tight">
        {formatTime(time)}
      </span>
      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-primary">
        <Zap className="h-2.5 w-2.5" />
        {cost}
      </span>
    </motion.button>
  );
}

export function EmptySlot({ onTap }: { onTap?: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
    onTap?.();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        className="flex aspect-square w-full flex-col items-center justify-center gap-0.5 rounded-full border-2 border-dashed border-border bg-background/40"
        whileTap={{ scale: 0.9 }}
        whileHover={{ borderColor: 'hsl(var(--primary))' }}
      >
        <Plus className="h-4 w-4 text-muted-foreground" />
        <span className="text-[10px] font-semibold leading-tight text-muted-foreground text-center">
          Earn
        </span>
      </motion.button>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary px-2.5 py-1 text-[9px] font-semibold text-primary-foreground shadow-gold"
        >
          Read a story to earn a Script!
        </motion.div>
      )}
    </div>
  );
}