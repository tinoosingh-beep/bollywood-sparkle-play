import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { FashionFaceoff } from '@/data/fashionContent';

interface Props {
  faceoff: FashionFaceoff;
}

export function FashionFaceoffCard({ faceoff }: Props) {
  const [voted, setVoted] = useState<'A' | 'B' | null>(null);
  // Simulate slight randomness on the seed
  const [voteA] = useState(() => faceoff.seedVoteA + Math.round((Math.random() - 0.5) * 6));
  const pctA = voted ? voteA : 50;
  const pctB = voted ? 100 - voteA : 50;

  const handleVote = (option: 'A' | 'B') => {
    if (voted) return;
    setVoted(option);
  };

  return (
    <article className="rounded-2xl overflow-hidden border border-border/60 bg-card/80 backdrop-blur-lg animate-slide-up relative">
      {/* Trend Alert badge */}
      {faceoff.isTrending && (
        <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
          style={{
            background: 'linear-gradient(135deg, hsl(45, 100%, 50%), hsl(30, 100%, 55%))',
            color: 'hsl(0, 0%, 5%)',
            boxShadow: '0 2px 12px hsla(45, 100%, 50%, 0.4)',
          }}>
          <TrendingUp className="w-3 h-3" />
          Trend Alert
        </div>
      )}

      {/* Title */}
      <div className="px-5 pt-5 pb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Fashion Face-off</span>
        <h3 className="font-display text-lg font-bold leading-tight text-foreground mt-1">{faceoff.title}</h3>
      </div>

      {/* Side-by-side images */}
      <div className="grid grid-cols-2 gap-1 px-3">
        <button
          onClick={() => handleVote('A')}
          className={`relative rounded-xl overflow-hidden aspect-[3/4] group transition-all duration-300 ${voted === 'A' ? 'ring-2 ring-gold scale-[1.02]' : voted === 'B' ? 'opacity-70' : 'hover:scale-[1.02]'}`}
        >
          <img src={faceoff.optionA.image} alt={faceoff.optionA.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 text-white text-sm font-bold drop-shadow-lg">{faceoff.optionA.label}</span>
          {!voted && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'hsl(var(--gold))', color: 'hsl(0,0%,5%)' }}>This</span>
            </div>
          )}
          {voted === 'A' && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: 'hsl(var(--gold))', color: 'hsl(0,0%,5%)' }}>
              ✓ Your Pick
            </div>
          )}
        </button>

        <button
          onClick={() => handleVote('B')}
          className={`relative rounded-xl overflow-hidden aspect-[3/4] group transition-all duration-300 ${voted === 'B' ? 'ring-2 ring-gold scale-[1.02]' : voted === 'A' ? 'opacity-70' : 'hover:scale-[1.02]'}`}
        >
          <img src={faceoff.optionB.image} alt={faceoff.optionB.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 text-white text-sm font-bold drop-shadow-lg">{faceoff.optionB.label}</span>
          {!voted && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'hsl(var(--gold))', color: 'hsl(0,0%,5%)' }}>That</span>
            </div>
          )}
          {voted === 'B' && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: 'hsl(var(--gold))', color: 'hsl(0,0%,5%)' }}>
              ✓ Your Pick
            </div>
          )}
        </button>
      </div>

      {/* Vote buttons or results */}
      <div className="px-5 py-4 space-y-3">
        {!voted ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleVote('A')}
              className="py-3 rounded-xl text-sm font-bold uppercase tracking-wider border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.1em' }}
            >
              ← This
            </button>
            <button
              onClick={() => handleVote('B')}
              className="py-3 rounded-xl text-sm font-bold uppercase tracking-wider border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.1em' }}
            >
              That →
            </button>
          </div>
        ) : (
          <div className="space-y-2 animate-slide-up">
            {/* Option A bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground w-24 truncate">{faceoff.optionA.label}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pctA}%`,
                    background: 'linear-gradient(90deg, hsl(45, 100%, 50%), hsl(35, 95%, 55%))',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-gold w-10 text-right">{pctA}%</span>
            </div>
            {/* Option B bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground w-24 truncate">{faceoff.optionB.label}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pctB}%`,
                    background: 'linear-gradient(90deg, hsl(var(--crimson)), hsl(0, 70%, 50%))',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-crimson w-10 text-right">{pctB}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center pt-1">
              {Math.round(200 + Math.random() * 800)} fashion fans voted
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
