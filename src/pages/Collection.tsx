import { HubHeader } from '@/components/home/HubHeader';
import { PowerUpInventory } from '@/components/home/PowerUpInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export function Collection() {
  const [trophies] = useState(420);
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <HubHeader trophies={trophies} />
      <div>
        <h2 className="font-display text-xl font-bold text-gradient-gold mb-4">{t('collection.title')}</h2>
        <PowerUpInventory />
      </div>
    </div>
  );
}
