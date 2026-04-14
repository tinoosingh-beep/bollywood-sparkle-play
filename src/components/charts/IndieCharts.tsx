import { useState } from 'react';
import { Guitar, Users, Disc } from 'lucide-react';
import { INDIE_ARTISTS, INDIE_SINGLES } from '@/data/musicCharts';

type SubTab = 'artists' | 'singles';

export function IndieCharts() {
  const [subTab, setSubTab] = useState<SubTab>('artists');

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <Guitar className="w-5 h-5" style={{ color: 'hsl(280, 70%, 60%)' }} />
        <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
          Independent / Non-Film
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">India's indie music scene — artists & singles</p>

      <div className="flex gap-2 mb-4">
        {[
          { key: 'artists' as SubTab, label: 'Artists', icon: Users },
          { key: 'singles' as SubTab, label: 'Singles', icon: Disc },
        ].map(({ key, label, icon: Icon }) => (
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
              ...(subTab === key ? { background: 'hsl(280, 70%, 60%)', borderColor: 'hsl(280, 70%, 60%)' } : {}),
            }}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {subTab === 'artists' && (
        <div className="space-y-1 max-h-[350px] overflow-y-auto scrollbar-hide">
          {INDIE_ARTISTS.map((a) => (
            <div key={a.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="text-xs font-mono font-bold text-muted-foreground w-5 text-right">{a.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{a.artist}</p>
                  {a.trending && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-green-500/20 text-green-400">🔥</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{a.genre}</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{a.streams}</span>
            </div>
          ))}
        </div>
      )}

      {subTab === 'singles' && (
        <div className="space-y-2">
          {INDIE_SINGLES.map((s) => (
            <div key={s.rank} className="flex items-center gap-3 py-2.5 px-3 rounded-xl border border-border/30 bg-muted/10">
              <span className="text-lg font-bold font-mono w-6 text-center" style={{ color: 'hsl(280, 70%, 60%)' }}>{s.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{s.title}</p>
                <p className="text-[10px] text-muted-foreground">{s.artist}</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{s.streams}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
