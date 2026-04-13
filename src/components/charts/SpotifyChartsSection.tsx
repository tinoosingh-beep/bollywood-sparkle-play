import { Music, ExternalLink } from 'lucide-react';
import { SPOTIFY_INDIA_PLAYLISTS } from '@/hooks/useSpotifyCharts';
import { useState } from 'react';

const PLAYLISTS = [
  { id: SPOTIFY_INDIA_PLAYLISTS.top50, label: 'Top 50 India', color: 'hsl(141, 73%, 42%)' },
  { id: SPOTIFY_INDIA_PLAYLISTS.viral50, label: 'Viral 50 India', color: 'hsl(280, 70%, 60%)' },
  { id: SPOTIFY_INDIA_PLAYLISTS.bollywoodHits, label: 'Bollywood Hits', color: 'hsl(var(--crimson))' },
  { id: SPOTIFY_INDIA_PLAYLISTS.bollywoodButter, label: 'Bollywood Butter', color: 'hsl(var(--gold))' },
];

export function SpotifyChartsSection() {
  const [activePlaylist, setActivePlaylist] = useState(PLAYLISTS[0]);

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Music className="w-5 h-5" style={{ color: 'hsl(141, 73%, 42%)' }} />
        <h3
          className="text-lg font-bold uppercase tracking-wider"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, hsl(141, 73%, 42%), hsl(141, 73%, 55%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Spotify Charts — India
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Live charts from Spotify's official Indian playlists
      </p>

      {/* Playlist tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
        {PLAYLISTS.map((pl) => (
          <button
            key={pl.id}
            onClick={() => setActivePlaylist(pl)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              activePlaylist.id === pl.id
                ? 'text-background shadow-lg'
                : 'border-border/60 text-muted-foreground hover:text-foreground'
            }`}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              ...(activePlaylist.id === pl.id
                ? { background: pl.color, borderColor: pl.color, boxShadow: `0 4px 12px ${pl.color}40` }
                : {}),
            }}
          >
            {pl.label}
          </button>
        ))}
      </div>

      {/* Spotify Embed */}
      <div className="rounded-xl overflow-hidden">
        <iframe
          key={activePlaylist.id}
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/playlist/${activePlaylist.id}?utm_source=oembed&theme=0`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={activePlaylist.label}
        />
      </div>

      {/* Open in Spotify link */}
      <a
        href={`https://open.spotify.com/playlist/${activePlaylist.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110"
        style={{
          background: 'hsl(141, 73%, 42%)',
          color: 'white',
          fontFamily: "'Bebas Neue', sans-serif",
          letterSpacing: '0.1em',
          boxShadow: '0 4px 16px hsla(141, 73%, 42%, 0.25)',
        }}
      >
        <ExternalLink className="w-4 h-4" />
        Open in Spotify
      </a>
    </div>
  );
}
