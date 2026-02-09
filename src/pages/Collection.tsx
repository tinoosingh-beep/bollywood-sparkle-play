import { HubHeader } from '@/components/home/HubHeader';
import { PowerUpInventory } from '@/components/home/PowerUpInventory';
import { useState } from 'react';

export function Collection() {
  const [trophies] = useState(420);

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <HubHeader trophies={trophies} />
      <div>
        <h2 className="font-display text-xl font-bold text-gradient-gold mb-4">Your Collection</h2>
        <PowerUpInventory />
      </div>
    </div>
  );
}
