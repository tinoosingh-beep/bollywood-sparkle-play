import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Lock, Gift, Plus, Zap, Film } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();

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
        className="px-2.5 py-2 rounded-xl"
        style={{
          background: 'linear-gradient(145deg, hsla(250, 20%, 92%, 0.95), hsla(250, 15%, 88%, 0.9))',
          border: '1px solid hsla(45, 80%, 65%, 0.3)',
          boxShadow: '0 2px 10px hsla(250, 20%, 60%, 0.15)',
        }}
      >
        <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-center mb-2" style={{ color: 'hsla(250, 30%, 40%, 0.85)' }}>
          {t('home.dailyRewards')}
        </p>
        <div className="grid grid-cols-4 gap-1.5">
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
      className="w-full aspect-square rounded-full flex flex-col items-center justify-center gap-0.5 relative overflow-hidden"
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
      <Gift className="w-4 h-4 text-white relative z-10 drop-shadow-[0_0_4px_hsla(0,0%,100%,0.6)]" />
      <span className="text-[7px] font-bold text-white relative z-10">OPEN</span>
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
      className="w-full aspect-square rounded-full flex flex-col items-center justify-center gap-0"
      style={{
        background: 'linear-gradient(145deg, hsla(250, 20%, 85%, 0.9), hsla(250, 15%, 78%, 0.9))',
        boxShadow: `0 2px 8px hsla(250, 20%, 50%, 0.2)`,
        border: `2px solid ${RARITY_BORDER[rarity]}`,
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Lock className="w-3 h-3 text-muted-foreground" />
      <span className="text-[7px] font-mono font-bold text-foreground leading-tight">
        {formatTime(time)}
      </span>
      <span className="flex items-center gap-0.5 text-[7px] font-semibold" style={{ color: 'hsl(45, 90%, 45%)' }}>
        <Zap className="w-2 h-2" />
        {cost}
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
        className="w-full aspect-square rounded-full flex flex-col items-center justify-center gap-0.5 border-2 border-dashed"
        style={{ borderColor: 'hsla(250, 20%, 70%, 0.4)' }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ borderColor: 'hsla(45, 80%, 55%, 0.6)' }}
      >
        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[7px] font-semibold text-muted-foreground leading-tight text-center">
          Earn
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
