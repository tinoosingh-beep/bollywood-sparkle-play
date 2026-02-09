import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Lock, Gift } from 'lucide-react';

interface Slot {
  id: number;
  type: 'empty' | 'locked' | 'ready';
  unlockTime?: number; // seconds remaining
}

const initialSlots: Slot[] = [
  { id: 1, type: 'ready' },
  { id: 2, type: 'locked', unlockTime: 239 },
  { id: 3, type: 'locked', unlockTime: 7140 },
  { id: 4, type: 'empty' },
];

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ScriptSlots() {
  const [slots, setSlots] = useState(initialSlots);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlots(prev =>
        prev.map(slot => {
          if (slot.type === 'locked' && slot.unlockTime !== undefined) {
            const next = slot.unlockTime - 1;
            if (next <= 0) return { ...slot, type: 'ready' as const, unlockTime: undefined };
            return { ...slot, unlockTime: next };
          }
          return slot;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
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
              <ReadySlot />
            ) : slot.type === 'locked' ? (
              <LockedSlot time={slot.unlockTime!} />
            ) : (
              <EmptySlot />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReadySlot() {
  return (
    <motion.button
      className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, hsl(45 100% 60%), hsl(40 95% 50%))',
        boxShadow: '0 4px 20px hsla(45, 100%, 50%, 0.5), inset 0 2px 4px hsla(50, 100%, 70%, 0.5)',
      }}
      whileTap={{ scale: 0.95 }}
      animate={{ boxShadow: ['0 4px 20px hsla(45,100%,50%,0.4)', '0 4px 30px hsla(45,100%,50%,0.7)', '0 4px 20px hsla(45,100%,50%,0.4)'] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* Shimmer overlay */}
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

function LockedSlot({ time }: { time: number }) {
  return (
    <div
      className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1"
      style={{
        background: 'linear-gradient(145deg, hsl(250 25% 22%), hsl(250 30% 16%))',
        boxShadow: '0 4px 16px hsla(250, 30%, 8%, 0.6), inset 0 1px 4px hsla(250, 20%, 30%, 0.3)',
        border: '1px solid hsla(250, 20%, 30%, 0.5)',
      }}
    >
      <Lock className="w-5 h-5 text-muted-foreground" />
      <span className="text-[9px] font-mono text-muted-foreground font-medium">{formatTime(time)}</span>
    </div>
  );
}

function EmptySlot() {
  return (
    <div
      className="w-full aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed"
      style={{ borderColor: 'hsla(250, 15%, 40%, 0.4)' }}
    >
      <Film className="w-5 h-5 text-muted-foreground/40" />
    </div>
  );
}
