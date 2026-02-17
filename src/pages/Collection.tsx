import { HubHeader } from '@/components/home/HubHeader';
import { FashionFaceoffCard } from '@/components/fashion/FashionFaceoffCard';
import { fashionFaceoffs, type FashionCategory } from '@/data/fashionContent';
import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const FILTERS: ('All' | FashionCategory)[] = ['All', 'Red Carpet', 'Airport Style', 'Ethnic Fusion'];

export function Collection() {
  const [trophies] = useState(420);
  const [activeFilter, setActiveFilter] = useState<'All' | FashionCategory>('All');

  const filtered = useMemo(() =>
    activeFilter === 'All' ? fashionFaceoffs : fashionFaceoffs.filter(f => f.category === activeFilter),
    [activeFilter]
  );

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <HubHeader trophies={trophies} />

      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
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

        <p className="text-xs text-muted-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Pick your side in Bollywood's hottest style showdowns — pure social polls, no bets.
        </p>

        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                activeFilter === f
                  ? 'bg-gold text-background border-gold shadow-lg shadow-gold/30'
                  : 'border-border/60 text-muted-foreground hover:border-gold/40 hover:text-foreground'
              }`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground mb-4">{filtered.length} face-offs</p>

        <div className="space-y-5">
          {filtered.map((faceoff) => (
            <FashionFaceoffCard key={faceoff.id} faceoff={faceoff} />
          ))}
        </div>
      </div>
    </div>
  );
}
