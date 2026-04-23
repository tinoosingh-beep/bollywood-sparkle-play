import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { ChevronDown, Film } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScriptSlots, type ReelRarity, type ReelReward } from '@/contexts/ScriptSlotsContext';
import { useBalance } from '@/contexts/BalanceContext';
import { ReelOpeningModal } from './ReelOpeningModal';
import { EmptySlot, LockedSlot, ReadySlot } from './ScriptSlotItems';
import { toast } from 'sonner';

interface ScriptSlotsProps {
  onNavigateToNews?: () => void;
}

export function ScriptSlots({ onNavigateToNews }: ScriptSlotsProps) {
  const { slots, openSlot, speedUpSlot, getSpeedUpCost } = useScriptSlots();
  const { addPoints, deductPoints, triggerFloatingPoints } = useBalance();
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentReward, setCurrentReward] = useState<ReelReward | null>(null);
  const { t } = useLanguage();
  const readyCount = useMemo(() => slots.filter((slot) => slot.type === 'ready').length, [slots]);

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

  const handleSwipe = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x > 44) {
      setIsExpanded(true);
      return;
    }

    if (info.offset.x < -44) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      <div className="relative self-start">
        <motion.button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={handleSwipe}
          whileTap={{ scale: 0.96 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 shadow-card backdrop-blur-sm"
          style={{
            background: 'linear-gradient(145deg, hsla(var(--glass), 0.96), hsla(var(--deep-purple), 0.94))',
            boxShadow: '0 12px 30px hsla(var(--deep-purple), 0.42), 0 0 22px hsla(var(--crimson), 0.12), inset 0 1px 0 hsla(var(--gold-glow), 0.16)',
          }}
          aria-label={t('home.dailyRewards')}
        >
          <Film className="h-6 w-6 text-primary" />
          {readyCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {readyCount}
            </span>
          )}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute -bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background"
          >
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-primary/20 p-3 shadow-card backdrop-blur-xl"
              style={{
                background: 'linear-gradient(155deg, hsla(var(--gold), 0.08), transparent 22%), linear-gradient(145deg, hsla(var(--glass), 0.97), hsla(var(--deep-purple), 0.94))',
                boxShadow: '0 20px 42px hsla(var(--deep-purple), 0.5), inset 0 1px 0 hsla(var(--gold-glow), 0.15)',
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-display font-bold uppercase tracking-wider text-primary">
                  {t('home.dailyRewards')}
                </p>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {readyCount} ready
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {slots.map((slot, i) => (
                  <motion.div
                    key={slot.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {slot.type === 'ready' ? (
                      <ReadySlot rarity={slot.rarity as ReelRarity | undefined} onOpen={() => handleOpen(slot.id)} />
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
            </motion.div>
          )}
        </AnimatePresence>
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
