import { useState } from 'react';
import { Globe2, Music, Youtube } from 'lucide-react';
import { GLOBAL_SPOTIFY_INDIAN, GLOBAL_YOUTUBE_INDIAN } from '@/data/musicCharts';

type SubTab = 'spotify' | 'youtube';

export function GlobalImpactCharts() {
  const [subTab, setSubTab] = useState<SubTab>('spotify');

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <Globe2 className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
          Global Impact
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Indian entries on global music charts</p>

      <div className="flex gap-2 mb-4">
        {[
          { key: 'spotify' as SubTab, label: 'Spotify Global 200', icon: Music, color: 'hsl(141, 73%, 42%)' },
          { key: 'youtube' as SubTab, label: 'YouTube Global', icon: Youtube, color: 'hsl(0, 80%, 55%)' },
        ].map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              subTab === key
                ? 'text-white border-transparent shadow-lg'
                : 'border-border/60 text-muted-foreground hover:text-foreground'
            }`}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              ...(subTab === key ? { background: color, borderColor: color } : {}),
            }}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {subTab === 'spotify' && (
        <div className="space-y-2">
          {GLOBAL_SPOTIFY_INDIAN.map((entry) => (
            <div key={entry.rank} className="flex items-center gap-3 py-2.5 px-3 rounded-xl border border-border/30 bg-muted/10">
              <div className="text-center min-w-[36px]">
                <span className="text-lg font-bold font-mono" style={{ color: 'hsl(141, 73%, 42%)' }}>#{entry.rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{entry.title}</p>
                <p className="text-[10px] text-muted-foreground">{entry.artist} • Peak: #{entry.peakRank}</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{entry.globalStreams}</span>
            </div>
          ))}
        </div>
      )}

      {subTab === 'youtube' && (
        <div className="space-y-2">
          {GLOBAL_YOUTUBE_INDIAN.map((entry) => (
            <div key={entry.rank} className="flex items-center gap-3 py-2.5 px-3 rounded-xl border border-border/30 bg-muted/10">
              <div className="text-center min-w-[36px]">
                <span className="text-lg font-bold font-mono" style={{ color: 'hsl(0, 80%, 55%)' }}>#{entry.rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{entry.title}</p>
                <p className="text-[10px] text-muted-foreground">{entry.artist} • {entry.daysOnChart}d on chart</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{entry.views}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
