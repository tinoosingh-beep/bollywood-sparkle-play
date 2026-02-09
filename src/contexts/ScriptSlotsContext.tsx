import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ReelRarity = 'common' | 'rare' | 'epic';
export type PowerUpType = 'directors_cut' | 'stunt_double' | 'publicist';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  usesLeft: number;
}

export interface ScriptSlot {
  id: number;
  type: 'empty' | 'locked' | 'ready';
  rarity?: ReelRarity;
  unlockTime?: number; // seconds remaining
}

export interface ReelReward {
  mp: number;
  trophies: number;
  powerUp?: PowerUp;
  rarity: ReelRarity;
}

const RARITY_TIMERS: Record<ReelRarity, number> = {
  common: 2 * 3600,   // 2 hours
  rare: 8 * 3600,     // 8 hours
  epic: 24 * 3600,    // 24 hours
};

const RARITY_COLORS: Record<ReelRarity, string> = {
  common: 'hsl(45, 100%, 50%)',
  rare: 'hsl(210, 100%, 60%)',
  epic: 'hsl(280, 100%, 60%)',
};

const SPEED_UP_COST_PER_HOUR = 10;
const STORY_TIME_REDUCTION = 30 * 60; // 30 minutes in seconds

const POWER_UP_DEFINITIONS: Record<PowerUpType, Omit<PowerUp, 'id' | 'usesLeft'>> = {
  directors_cut: {
    type: 'directors_cut',
    name: "Director's Cut",
    description: 'Reveals the current majority bet on a market before you place yours.',
    icon: '🎬',
  },
  stunt_double: {
    type: 'stunt_double',
    name: 'Stunt Double',
    description: 'Replaces a lost bet once, recovering your MP.',
    icon: '🦸',
  },
  publicist: {
    type: 'publicist',
    name: 'Publicist',
    description: 'Doubles the MP earned from the next 3 news stories.',
    icon: '📣',
  },
};

function rollRarity(): ReelRarity {
  const roll = Math.random();
  if (roll < 0.05) return 'epic';
  if (roll < 0.30) return 'rare';
  return 'common';
}

function generateReward(rarity: ReelRarity): ReelReward {
  const mpRewards: Record<ReelRarity, [number, number]> = {
    common: [20, 60],
    rare: [80, 150],
    epic: [200, 500],
  };
  const [min, max] = mpRewards[rarity];
  const mp = Math.floor(Math.random() * (max - min + 1)) + min;
  const trophies = rarity === 'epic' ? 50 : rarity === 'rare' ? 20 : 5;

  // 40% chance of a power-up for rare/epic, 10% for common
  const powerUpChance = rarity === 'common' ? 0.1 : 0.4;
  let powerUp: PowerUp | undefined;
  if (Math.random() < powerUpChance) {
    const types: PowerUpType[] = ['directors_cut', 'stunt_double', 'publicist'];
    const type = types[Math.floor(Math.random() * types.length)];
    const def = POWER_UP_DEFINITIONS[type];
    powerUp = {
      ...def,
      id: `${type}_${Date.now()}`,
      usesLeft: type === 'publicist' ? 3 : 1,
    };
  }

  return { mp, trophies, powerUp, rarity };
}

interface ScriptSlotsContextType {
  slots: ScriptSlot[];
  powerUps: PowerUp[];
  fillEmptySlot: () => ReelRarity | null;
  speedUpSlot: (slotId: number) => { cost: number; success: boolean };
  reduceSlotTime: (slotId: number, seconds: number) => void;
  openSlot: (slotId: number) => ReelReward | null;
  getSpeedUpCost: (slotId: number) => number;
  rarityColors: Record<ReelRarity, string>;
}

const ScriptSlotsContext = createContext<ScriptSlotsContextType | undefined>(undefined);

const initialSlots: ScriptSlot[] = [
  { id: 1, type: 'ready', rarity: 'common' },
  { id: 2, type: 'locked', rarity: 'rare', unlockTime: 239 },
  { id: 3, type: 'locked', rarity: 'common', unlockTime: 7140 },
  { id: 4, type: 'empty' },
];

export function ScriptSlotsProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<ScriptSlot[]>(initialSlots);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

  // Countdown timer
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

  const fillEmptySlot = useCallback((): ReelRarity | null => {
    const emptyIndex = slots.findIndex(s => s.type === 'empty');
    if (emptyIndex === -1) return null;
    const rarity = rollRarity();
    setSlots(prev =>
      prev.map((slot, i) =>
        i === emptyIndex
          ? { ...slot, type: 'locked' as const, rarity, unlockTime: RARITY_TIMERS[rarity] }
          : slot
      )
    );
    return rarity;
  }, [slots]);

  const getSpeedUpCost = useCallback((slotId: number): number => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || slot.type !== 'locked' || !slot.unlockTime) return 0;
    const hoursRemaining = Math.ceil(slot.unlockTime / 3600);
    return hoursRemaining * SPEED_UP_COST_PER_HOUR;
  }, [slots]);

  const speedUpSlot = useCallback((slotId: number): { cost: number; success: boolean } => {
    const cost = getSpeedUpCost(slotId);
    // Caller must check balance and deduct MP externally
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId && slot.type === 'locked'
          ? { ...slot, type: 'ready' as const, unlockTime: undefined }
          : slot
      )
    );
    return { cost, success: true };
  }, [getSpeedUpCost]);

  const reduceSlotTime = useCallback((slotId: number, seconds: number) => {
    setSlots(prev =>
      prev.map(slot => {
        if (slot.id === slotId && slot.type === 'locked' && slot.unlockTime) {
          const next = Math.max(0, slot.unlockTime - seconds);
          if (next <= 0) return { ...slot, type: 'ready' as const, unlockTime: undefined };
          return { ...slot, unlockTime: next };
        }
        return slot;
      })
    );
  }, []);

  const openSlot = useCallback((slotId: number): ReelReward | null => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || slot.type !== 'ready' || !slot.rarity) return null;
    const reward = generateReward(slot.rarity);
    if (reward.powerUp) {
      setPowerUps(prev => [...prev, reward.powerUp!]);
    }
    // Reset slot to empty
    setSlots(prev =>
      prev.map(s => (s.id === slotId ? { ...s, type: 'empty' as const, rarity: undefined, unlockTime: undefined } : s))
    );
    return reward;
  }, [slots]);

  return (
    <ScriptSlotsContext.Provider
      value={{ slots, powerUps, fillEmptySlot, speedUpSlot, reduceSlotTime, openSlot, getSpeedUpCost, rarityColors: RARITY_COLORS }}
    >
      {children}
    </ScriptSlotsContext.Provider>
  );
}

export function useScriptSlots() {
  const context = useContext(ScriptSlotsContext);
  if (!context) throw new Error('useScriptSlots must be used within ScriptSlotsProvider');
  return context;
}

export { STORY_TIME_REDUCTION };
