import { useState } from 'react';
import { Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { REGIONAL_PUNJABI, REGIONAL_MARATHI, REGIONAL_OTHER } from '@/data/musicCharts';

type Region = 'punjabi' | 'marathi' | 'other';

const ChangeIcon = ({ change }: { change?: number }) => {
  if (!change && change !== 0) return null;
  if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
  if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const REGION_COLORS: Record<Region, string> = {
  punjabi: 'hsl(30, 90%, 55%)',
  marathi: 'hsl(170, 70%, 50%)',
  other: 'hsl(210, 80%, 55%)',
};

export function RegionalCharts() {
  const [region, setRegion] = useState<Region>('punjabi');

  const regions: { key: Region; label: string }[] = [
    { key: 'punjabi', label: 'Punjabi' },
    { key: 'marathi', label: 'Marathi' },
    { key: 'other', label: 'Other Regional' },
  ];

  const data = region === 'punjabi' ? REGIONAL_PUNJABI : region === 'marathi' ? REGIONAL_MARATHI : REGIONAL_OTHER;

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <Globe className="w-5 h-5" style={{ color: REGION_COLORS[region] }} />
        <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
          Regional Charts
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Punjabi, Marathi & other regional language hits</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {regions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setRegion(key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              region === key
                ? 'text-white border-transparent shadow-lg'
                : 'border-border/60 text-muted-foreground hover:text-foreground'
            }`}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              ...(region === key ? { background: REGION_COLORS[key], borderColor: REGION_COLORS[key] } : {}),
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-1 max-h-[300px] overflow-y-auto scrollbar-hide">
        {data.map((song: any) => (
          <div key={song.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
            <span className="text-xs font-mono font-bold text-muted-foreground w-5 text-right">{song.rank}</span>
            {'change' in song && <ChangeIcon change={song.change} />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{song.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {song.artist}
                {'language' in song ? ` • ${song.language}` : ''}
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{song.streams}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
