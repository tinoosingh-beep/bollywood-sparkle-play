import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Share2, Coins, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/Confetti';
import type { ReelReward, ReelRarity } from '@/contexts/ScriptSlotsContext';

interface ReelOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  reward: ReelReward | null;
}

const RARITY_LABELS: Record<ReelRarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
};

const RARITY_STYLES: Record<ReelRarity, { gradient: string; glow: string; text: string }> = {
  common: {
    gradient: 'linear-gradient(135deg, hsl(45 100% 55%), hsl(40 100% 50%))',
    glow: '0 0 40px hsla(45, 100%, 55%, 0.6)',
    text: 'hsl(45, 100%, 50%)',
  },
  rare: {
    gradient: 'linear-gradient(135deg, hsl(210 100% 60%), hsl(220 100% 55%))',
    glow: '0 0 40px hsla(210, 100%, 60%, 0.6)',
    text: 'hsl(210, 100%, 60%)',
  },
  epic: {
    gradient: 'linear-gradient(135deg, hsl(280 100% 60%), hsl(300 100% 55%))',
    glow: '0 0 60px hsla(280, 100%, 60%, 0.7)',
    text: 'hsl(280, 100%, 60%)',
  },
};

export function ReelOpeningModal({ isOpen, onClose, onClaim, reward }: ReelOpeningModalProps) {
  const [phase, setPhase] = useState<'projector' | 'reveal'>('projector');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase('projector');
      const timer = setTimeout(() => {
        setPhase('reveal');
        setShowConfetti(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!reward) return null;

  const style = RARITY_STYLES[reward.rarity];

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50"
              style={{ background: 'hsla(250, 30%, 5%, 0.9)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, hsl(250 25% 18%), hsl(250 30% 12%))',
                border: '2px solid hsla(45, 100%, 55%, 0.4)',
                boxShadow: style.glow,
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full"
                style={{ background: 'hsla(0, 0%, 100%, 0.1)' }}
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              {phase === 'projector' ? (
                <ProjectorAnimation />
              ) : (
                <RewardReveal reward={reward} style={style} onClaim={onClaim} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectorAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <motion.div
        className="text-6xl mb-4"
        animate={{
          opacity: [1, 0.3, 1, 0.2, 1, 0.5, 1],
          scale: [1, 1.05, 1, 0.98, 1],
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        🎬
      </motion.div>
      <motion.div
        className="flex gap-1"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-8 h-1 rounded-full"
            style={{ background: 'hsla(45, 100%, 55%, 0.6)' }}
          />
        ))}
      </motion.div>
      <p className="text-sm font-medium mt-4" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>
        Rolling the reel...
      </p>
    </div>
  );
}

function RewardReveal({
  reward,
  style,
  onClaim,
}: {
  reward: ReelReward;
  style: { gradient: string; glow: string; text: string };
  onClaim: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-8 px-6 gap-4"
    >
      {/* Rarity badge */}
      <motion.div
        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{ background: style.gradient, color: 'white', boxShadow: style.glow }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.6 }}
      >
        {RARITY_LABELS[reward.rarity]} Reel
      </motion.div>

      {/* Rewards */}
      <div className="flex items-center gap-6 mt-2">
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Coins className="w-8 h-8" style={{ color: 'hsl(45, 100%, 55%)' }} />
          </motion.div>
          <span className="text-xl font-bold font-mono" style={{ color: 'hsl(45, 100%, 55%)' }}>
            +{reward.mp}
          </span>
          <span className="text-[10px]" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>MP</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Trophy className="w-8 h-8" style={{ color: 'hsl(45, 100%, 55%)' }} />
          <span className="text-xl font-bold font-mono" style={{ color: 'hsl(45, 100%, 55%)' }}>
            +{reward.trophies}
          </span>
          <span className="text-[10px]" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>Trophies</span>
        </div>
      </div>

      {/* Power-up if earned */}
      {reward.powerUp && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-full p-3 rounded-xl flex items-center gap-3"
          style={{
            background: 'hsla(280, 100%, 60%, 0.15)',
            border: '1px solid hsla(280, 100%, 60%, 0.4)',
          }}
        >
          <span className="text-2xl">{reward.powerUp.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'hsl(280, 100%, 70%)' }}>
              {reward.powerUp.name}
            </p>
            <p className="text-[11px]" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>
              {reward.powerUp.description}
            </p>
          </div>
          <Sparkles className="w-4 h-4" style={{ color: 'hsl(280, 100%, 60%)' }} />
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 w-full mt-2">
        <Button onClick={onClaim} className="flex-1 btn-gold rounded-xl py-5 text-base font-bold">
          <Gift className="w-5 h-5 mr-2" />
          Claim
        </Button>
        <Button
          variant="outline"
          className="rounded-xl py-5 px-4"
          style={{
            borderColor: 'hsla(0, 0%, 100%, 0.2)',
            color: 'hsla(0, 0%, 100%, 0.7)',
            background: 'hsla(0, 0%, 100%, 0.05)',
          }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'BollyBet Reward!',
                text: `I just opened a ${RARITY_LABELS[reward.rarity]} Film Reel and won ${reward.mp} MP!`,
              });
            }
          }}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
