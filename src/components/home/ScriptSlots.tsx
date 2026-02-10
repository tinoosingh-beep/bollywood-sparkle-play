import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Lock, Gift, Plus, Zap, Film } from 'lucide-react';
import { useScriptSlots, type ReelRarity, type ReelReward } from '@/contexts/ScriptSlotsContext';
import { useBalance } from '@/contexts/BalanceContext';
import { ReelOpeningModal } from './ReelOpeningModal';
import { toast } from 'sonner';

interface ScriptSlotsProps {
  onNavigateToNews?: () => void;
}

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

export function ScriptSlots({ onNavigateToNews }: ScriptSlotsProps) {
  const { slots, openSlot, speedUpSlot, getSpeedUpCost } = useScriptSlots();
  const { addPoints, deductPoints, triggerFloatingPoints } = useBalance();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<ReelReward | null>(null);

  const handleOpen = (slotId: number) => {
    const reward = openSlot(slotId);
    if (reward) {
      setCurrentReward(reward);
      setModalOpen(true);
    }
  };

  const handleClaim = () => {
    if (currentReward) {
      addPoints(currentReward.mp);
      triggerFloatingPoints(currentReward.mp, window.innerWidth / 2, window.innerHeight / 3);
      toast.success(`Claimed ${currentReward.mp} MP${currentReward.powerUp ? ` + ${currentReward.powerUp.name}` : ''}! 🎉`);
    }
    setModalOpen(false);
    setCurrentReward(null);
  };

  const handleSpeedUp = (slotId: number) => {
    const cost = getSpeedUpCost(slotId);
    if (deductPoints(cost)) {
      speedUpSlot(slotId);
      toast.success(`Spent ${cost} MP to unlock the reel! ⚡`);
    } else {
      toast.error(`Not enough MP! Need ${cost} MP to speed up.`);
    }
  };

  return (
    <>
      <div
        className="px-3 py-3 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, hsla(250, 25%, 18%, 0.95), hsla(250, 30%, 14%, 0.9))',
          border: '1px solid hsla(45, 100%, 55%, 0.25)',
          boxShadow: '0 6px 24px hsla(250, 30%, 8%, 0.5), inset 0 1px 2px hsla(250, 20%, 30%, 0.2)',
        }}
      >
        <p className="text-xs font-display font-semibold uppercase tracking-wider text-center mb-3" style={{ color: 'hsla(45, 100%, 70%, 0.85)' }}>
          Daily Rewards
        </p>
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot, i) => (
            <motion.div
              key={slot.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {slot.type === 'ready' ? (
                <ReadySlot rarity={slot.rarity} onOpen={() => handleOpen(slot.id)} />
              ) : slot.type === 'locked' ? (
                <LockedSlot
                  time={slot.unlockTime!}
                  rarity={slot.rarity!}
                  cost={getSpeedUpCost(slot.id)}
                  onSpeedUp={() => handleSpeedUp(slot.id)}
                />
              ) : (
                <EmptySlot onTap={onNavigateToNews} />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <ReelOpeningModal
        isOpen={modalOpen}
        onClose={handleClaim}
        onClaim={handleClaim}
        reward={currentReward}
      />
    </>
  );
}

function ReadySlot({ rarity, onOpen }: { rarity?: ReelRarity; onOpen: () => void }) {
  const r = rarity || 'common';
  return (
    <motion.button
      onClick={onOpen}
      className="w-full aspect-[1.4/1] rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden btn-gold"
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          `0 0 20px ${RARITY_GLOW[r]}`,
          `0 0 35px ${RARITY_GLOW[r]}`,
          `0 0 20px ${RARITY_GLOW[r]}`,
        ],
        scale: [1, 1.03, 1],
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={r !== 'common' ? {
        background: r === 'rare'
          ? 'linear-gradient(135deg, hsl(210 100% 60%), hsl(220 100% 55%))'
          : 'linear-gradient(135deg, hsl(280 100% 60%), hsl(300 100% 55%))',
      } : undefined}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 30%, hsla(0,0%,100%,0.4) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
      />
      <Gift className="w-4.5 h-4.5 text-primary-foreground relative z-10 drop-shadow-[0_0_6px_hsla(45,100%,80%,0.8)]" />
      <span className="text-[9px] font-bold text-primary-foreground relative z-10 drop-shadow-[0_0_4px_hsla(45,100%,80%,0.6)]">OPEN</span>
    </motion.button>
  );
}

function LockedSlot({
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
      className="w-full aspect-[1.4/1] rounded-2xl flex flex-col items-center justify-center gap-0.5"
      style={{
        background: 'linear-gradient(145deg, hsl(250 25% 22%), hsl(250 30% 16%))',
        boxShadow: `0 4px 16px hsla(250, 30%, 8%, 0.6), inset 0 1px 4px hsla(250, 20%, 30%, 0.3)`,
        border: `1px solid ${RARITY_BORDER[rarity]}`,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Lock className="w-3.5 h-3.5 text-muted-foreground drop-shadow-[0_0_4px_hsla(250,60%,70%,0.5)]" />
      <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(0 0% 95%)' }}>
        {formatTime(time)}
      </span>
      <span className="flex items-center gap-0.5 text-[8px] font-semibold" style={{ color: 'hsl(45, 100%, 55%)' }}>
        <Zap className="w-2.5 h-2.5" />
        {cost} MP
      </span>
    </motion.button>
  );
}

function EmptySlot({ onTap }: { onTap?: () => void }) {
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
        className="w-full aspect-[1.4/1] rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-dashed"
        style={{ borderColor: 'hsla(45, 100%, 55%, 0.35)' }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ borderColor: 'hsla(45, 100%, 55%, 0.7)' }}
      >
        <Film className="w-4 h-4 text-gold/60 drop-shadow-[0_0_5px_hsla(45,100%,55%,0.4)]" />
        <span className="text-[8px] font-semibold text-gold/50 leading-tight text-center">
          Earn Script
        </span>
      </motion.button>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg text-[9px] font-semibold z-50"
          style={{
            background: 'hsl(var(--gold))',
            color: 'hsl(var(--primary-foreground))',
            boxShadow: '0 4px 12px hsla(45, 100%, 50%, 0.3)',
          }}
        >
          Read a story to earn a Script!
        </motion.div>
      )}
    </div>
  );
}
