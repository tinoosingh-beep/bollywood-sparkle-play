import { useState } from 'react';
import { HubHeader } from '@/components/home/HubHeader';
import { ArenaDisplay } from '@/components/home/ArenaDisplay';
import { PredictButton } from '@/components/home/PredictButton';
import { ScriptSlots } from '@/components/home/ScriptSlots';

export function Home() {
  const [trophies] = useState(420);

  const handlePredict = () => {
    // Navigate to markets or open prediction flow
    // For now this is a placeholder
  };

  return (
    <div className="flex flex-col gap-4 animate-slide-up min-h-[calc(100vh-10rem)]">
      <HubHeader trophies={trophies} />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <ArenaDisplay trophies={trophies} />
      </div>

      <PredictButton onPress={handlePredict} />
      
      <ScriptSlots />
    </div>
  );
}
