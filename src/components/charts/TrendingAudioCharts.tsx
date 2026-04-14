import { useState } from 'react';
import { Zap, Instagram, Youtube, Music2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TRENDING_REELS, TRENDING_SHORTS, VIRAL_SOUNDS } from '@/data/musicCharts';

type SubTab = 'reels' | 'shorts' | 'viral';

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

export function TrendingAudioCharts() {
  const [subTab, setSubTab] = useState<SubTab>('reels');

  const tabs: { key: SubTab; label: string; icon: any; color: string }[] = [
    { key: 'reels', label: 'Reels', icon: Instagram, color: 'hsl(330, 80%, 60%)' },
    { key: 'shorts', label: 'Shorts', icon: Youtube, color: 'hsl(0, 80%, 55%)' },
    { key: 'viral', label: 'Viral Sounds', icon: Music2, color: 'hsl(var(--neon-cyan))' },
  ];

  const activeColor = tabs.find(t => t.key === subTab)!.color;

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-5 h-5" style={{ color: 'hsl(330, 80%, 60%)' }} />
        <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
          Trending Audio
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Instagram Reels, YouTube Shorts & viral sounds</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {tabs.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
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

      {subTab === 'reels' && (
        <div className="space-y-1">
          {TRENDING_REELS.map((item) => (
            <div key={item.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="text-xs font-mono font-bold text-muted-foreground w-5 text-right">{item.rank}</span>
              <TrendIcon trend={item.trend} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.platform}</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{item.uses} uses</span>
            </div>
          ))}
        </div>
      )}

      {subTab === 'shorts' && (
        <div className="space-y-1">
          {TRENDING_SHORTS.map((item) => (
            <div key={item.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="text-xs font-mono font-bold text-muted-foreground w-5 text-right">{item.rank}</span>
              <TrendIcon trend={item.trend} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{item.views} views</span>
            </div>
          ))}
        </div>
      )}

      {subTab === 'viral' && (
        <div className="space-y-2">
          {VIRAL_SOUNDS.map((item) => (
            <div key={item.rank} className="flex items-center gap-3 py-2.5 px-3 rounded-xl border border-border/30 bg-muted/10">
              <span className="text-lg font-bold font-mono w-6 text-center" style={{ color: 'hsl(var(--neon-cyan))' }}>{item.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.origin} • {item.daysViral}d viral</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{item.uses} uses</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
