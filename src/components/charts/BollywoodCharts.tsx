import { useState } from 'react';
import { Music, TrendingUp, TrendingDown, Minus, Disc3, Film } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BOLLYWOOD_TOP_20, TOP_ALBUMS, MOVIE_SOUNDTRACKS } from '@/data/musicCharts';

type SubTab = 'top20' | 'albums' | 'soundtracks';

const ChangeIcon = ({ change }: { change: number }) => {
  if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
  if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground">{payload[0]?.payload?.movie}</p>
      <p className="text-muted-foreground">Score: <span className="font-mono font-bold text-foreground">{payload[0]?.value}</span></p>
    </div>
  );
};

export function BollywoodCharts() {
  const [subTab, setSubTab] = useState<SubTab>('top20');

  const tabs: { key: SubTab; label: string; icon: any }[] = [
    { key: 'top20', label: 'Top 20', icon: Music },
    { key: 'albums', label: 'Albums', icon: Disc3 },
    { key: 'soundtracks', label: 'Soundtracks', icon: Film },
  ];

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <Music className="w-5 h-5 text-crimson" />
        <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
          Bollywood Songs
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Top Hindi songs, albums & movie soundtracks</p>

      <div className="flex gap-2 mb-4">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              subTab === key
                ? 'bg-crimson text-white border-crimson shadow-lg'
                : 'border-border/60 text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.7rem', letterSpacing: '0.08em' }}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {subTab === 'top20' && (
        <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
          {BOLLYWOOD_TOP_20.map((song) => (
            <div key={song.rank} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="text-xs font-mono font-bold text-muted-foreground w-5 text-right">{song.rank}</span>
              <ChangeIcon change={song.change} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{song.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{song.artist}{song.movie ? ` • ${song.movie}` : ''}</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{song.streams}</span>
            </div>
          ))}
        </div>
      )}

      {subTab === 'albums' && (
        <div className="space-y-2">
          {TOP_ALBUMS.map((album) => (
            <div key={album.rank} className="flex items-center gap-3 py-2.5 px-3 rounded-xl border border-border/30 bg-muted/10">
              <span className="text-lg font-bold text-gold font-mono w-6 text-center">{album.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{album.title}</p>
                <p className="text-[10px] text-muted-foreground">{album.artist} • {album.weeks} weeks on chart</p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{album.streams}</span>
            </div>
          ))}
        </div>
      )}

      {subTab === 'soundtracks' && (
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOVIE_SOUNDTRACKS} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="movie" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={24}>
                {MOVIE_SOUNDTRACKS.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? 'hsl(var(--crimson))' : i === 1 ? 'hsl(var(--gold))' : 'hsl(var(--neon-cyan))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {MOVIE_SOUNDTRACKS.map((st) => (
              <div key={st.movie} className="flex items-center justify-between text-xs px-1">
                <span className="text-foreground font-medium">{st.movie}</span>
                <span className="text-muted-foreground">{st.songs} songs • Top: <span className="text-gold">{st.topSong}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
