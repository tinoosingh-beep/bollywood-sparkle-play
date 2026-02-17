import { HubHeader } from '@/components/home/HubHeader';
import { FashionFaceoffCard } from '@/components/fashion/FashionFaceoffCard';
import { fashionFaceoffs } from '@/data/fashionContent';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export function Collection() {
  const [trophies] = useState(420);

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <HubHeader trophies={trophies} />

      <div>
        {/* Section header — magazine style */}
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2
            className="text-2xl font-bold uppercase tracking-[0.12em]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              background: 'linear-gradient(135deg, hsl(45, 100%, 50%), hsl(30, 90%, 55%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fashion Spotlight
          </h2>
        </div>

        <p className="text-xs text-muted-foreground mb-4 -mt-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Pick your side in Bollywood's hottest style showdowns — pure social polls, no bets.
        </p>

        <div className="space-y-5">
          {fashionFaceoffs.map((faceoff) => (
            <FashionFaceoffCard key={faceoff.id} faceoff={faceoff} />
          ))}
        </div>
      </div>
    </div>
  );
}
