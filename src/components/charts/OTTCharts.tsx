import { useState } from 'react';
import { Tv, TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  NETFLIX_MOVIES, NETFLIX_SERIES, PRIME_VIDEO, HOTSTAR_TRENDING,
  COMBINED_OTT, LANGUAGE_BREAKDOWN,
} from '@/data/ottCharts';

type Tab = 'netflix-movies' | 'netflix-series' | 'prime' | 'hotstar' | 'combined' | 'languages';

const TABS: { key: Tab; label: string }[] = [
  { key: 'netflix-movies', label: 'Netflix Movies' },
  { key: 'netflix-series', label: 'Netflix Series' },
  { key: 'prime', label: 'Prime Video' },
  { key: 'hotstar', label: 'Hotstar' },
  { key: 'combined', label: 'Combined' },
  { key: 'languages', label: 'Languages' },
];

const PLATFORM_COLORS: Record<string, string> = {
  Netflix: 'hsl(0, 75%, 50%)',
  'Prime Video': 'hsl(200, 90%, 50%)',
  Hotstar: 'hsl(210, 80%, 55%)',
};

const LANG_COLORS = [
  'hsl(var(--crimson))',
  'hsl(var(--gold))',
  'hsl(var(--neon-cyan))',
  'hsl(210, 80%, 55%)',
  'hsl(280, 70%, 60%)',
  'hsl(170, 70%, 50%)',
];

const ChangeIcon = ({ change }: { change: number }) => {
  if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
  if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <span className="font-mono font-bold">{p.value}%</span>
        </p>
      ))}
    </div>
  );
};

function RankList({ data }: { data: { rank: number; title: string; language: string; weeks: number; change: number }[] }) {
  return (
    <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
      {data.map((item) => (
        <div key={item.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
          <span className="text-xs font-mono font-bold text-muted-foreground w-5 text-right">
            {item.rank <= 3 ? <Crown className="w-3.5 h-3.5 inline" style={{ color: item.rank === 1 ? 'hsl(var(--gold))' : item.rank === 2 ? '#C0C0C0' : '#CD7F32' }} /> : item.rank}
          </span>
          <ChangeIcon change={item.change} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
            <p className="text-[10px] text-muted-foreground">{item.language} • Week {item.weeks}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CombinedList() {
  return (
    <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
      {COMBINED_OTT.map((item) => (
        <div key={item.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
          <span className="text-xs font-mono font-bold text-muted-foreground w-5 text-right">{item.rank}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
            <p className="text-[10px] text-muted-foreground">
              <span style={{ color: PLATFORM_COLORS[item.platform] || 'inherit' }}>{item.platform}</span> • {item.language}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-gold">{item.score}</span>
            <p className="text-[9px] text-muted-foreground">score</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LanguageBreakdown() {
  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={LANGUAGE_BREAKDOWN} margin={{ left: 0, right: 16 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 60]} />
          <YAxis type="category" dataKey="language" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={75} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="percentage" name="Share" radius={[0, 6, 6, 0]} barSize={18}>
            {LANGUAGE_BREAKDOWN.map((_, i) => (
              <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="space-y-1 mt-3">
        {LANGUAGE_BREAKDOWN.map((item, i) => (
          <div key={item.language} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
            <span className="text-muted-foreground flex-1">{item.language}</span>
            <span className="font-mono text-foreground">{item.count} titles</span>
            <span className="font-mono text-muted-foreground">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OTTCharts() {
  const [tab, setTab] = useState<Tab>('netflix-movies');

  const renderContent = () => {
    switch (tab) {
      case 'netflix-movies': return <RankList data={NETFLIX_MOVIES} />;
      case 'netflix-series': return <RankList data={NETFLIX_SERIES} />;
      case 'prime': return <RankList data={PRIME_VIDEO} />;
      case 'hotstar': return <RankList data={HOTSTAR_TRENDING} />;
      case 'combined': return <CombinedList />;
      case 'languages': return <LanguageBreakdown />;
    }
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <Tv className="w-5 h-5 text-crimson" />
        <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
          OTT Weekly Top 10
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Netflix, Prime Video & Hotstar trending this week</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              tab === key
                ? 'bg-crimson text-white border-transparent shadow-lg'
                : 'border-border/60 text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.7rem', letterSpacing: '0.08em' }}
          >
            {label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
