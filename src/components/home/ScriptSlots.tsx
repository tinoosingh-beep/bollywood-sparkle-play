import { useState } from 'react';
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
      <div className="px-2">
        <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider text-center mb-3">
          Script Slots
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
      className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden btn-gold"
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
      <Gift className="w-6 h-6 text-primary-foreground relative z-10" />
      <span className="text-[10px] font-bold text-primary-foreground relative z-10">OPEN</span>
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
      className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5"
      style={{
        background: 'linear-gradient(145deg, hsl(250 25% 22%), hsl(250 30% 16%))',
        boxShadow: `0 4px 16px hsla(250, 30%, 8%, 0.6), inset 0 1px 4px hsla(250, 20%, 30%, 0.3)`,
        border: `1px solid ${RARITY_BORDER[rarity]}`,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Lock className="w-4 h-4 text-muted-foreground" />
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
  return (
    <motion.button
      onClick={onTap}
      className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-dashed"
      style={{ borderColor: 'hsla(250, 15%, 40%, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ borderColor: 'hsla(45, 100%, 55%, 0.6)' }}
    >
      <Plus className="w-5 h-5 text-gold" />
      <span className="text-[8px] font-semibold text-muted-foreground leading-tight text-center">
        Earn Script
      </span>
    </motion.button>
  );
}
