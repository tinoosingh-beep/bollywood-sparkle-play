import { SpinWheel } from '@/components/SpinWheel';
import { MemoryGame } from '@/components/MemoryGame';
import { Gamepad2 } from 'lucide-react';

export function Games() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gamepad2 className="w-8 h-8 text-crimson" />
        </div>
        <h2 className="font-display text-3xl font-bold text-gradient-gold">Game Zone</h2>
        <p className="text-muted-foreground mt-2">Play to earn bonus MP</p>
      </div>

      <div className="space-y-6">
        <SpinWheel />
        <MemoryGame />
      </div>
    </div>
  );
}
