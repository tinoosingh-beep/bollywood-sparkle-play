import { Play, Eye, ThumbsUp, MessageCircle, ExternalLink, TrendingUp } from 'lucide-react';
import { AddToListButton } from '@/components/AddToListButton';
import { motion } from 'framer-motion';

export interface YouTubeTrendingVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  tags?: string[];
}

function formatCount(count: string | number): string {
  const n = typeof count === 'string' ? parseInt(count, 10) : count;
  if (isNaN(n)) return '0';
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const h = match[1] ? `${match[1]}:` : '';
  const m = match[2] || '0';
  const s = (match[3] || '0').padStart(2, '0');
  return `${h}${h ? m.padStart(2, '0') : m}:${s}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface Props {
  video: YouTubeTrendingVideo;
  rank?: number;
}

export function YouTubeTrendingCard({ video, rank }: Props) {
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl relative"
      style={{
        border: '2px solid hsl(0, 80%, 50%)',
        boxShadow: '0 0 20px hsla(0, 80%, 50%, 0.15), 0 8px 32px hsla(0, 0%, 0%, 0.5)',
        background: 'linear-gradient(180deg, hsl(0, 20%, 7%) 0%, hsl(0, 15%, 4%) 100%)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(135deg, hsl(0, 30%, 10%), hsl(0, 20%, 6%))' }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: 'hsl(0, 80%, 55%)' }} />
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: 'hsl(0, 80%, 55%)',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.2em',
              textShadow: '0 0 12px hsla(0, 80%, 55%, 0.4)',
            }}
          >
            Trending
          </span>
          {rank && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{
                background: 'hsla(0, 80%, 55%, 0.15)',
                color: 'hsl(0, 80%, 65%)',
                border: '1px solid hsla(0, 80%, 55%, 0.3)',
              }}
            >
              #{rank}
            </span>
          )}
        </div>
        <span className="text-[10px]" style={{ color: 'hsla(0, 60%, 80%, 0.5)' }}>
          {timeAgo(video.publishedAt)}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative group">
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: '64px',
                height: '64px',
                background: 'hsla(0, 80%, 50%, 0.8)',
              }}
            >
              <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
            </div>
          </div>
          {video.duration && (
            <span
              className="absolute bottom-2 right-2 text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: 'hsla(0,0%,0%,0.8)', color: 'white' }}
            >
              {parseDuration(video.duration)}
            </span>
          )}
        </a>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3
          className="font-bold text-sm leading-snug line-clamp-2 text-foreground"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {video.channelTitle}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {formatCount(video.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" /> {formatCount(video.likeCount)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" /> {formatCount(video.commentCount)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <AddToListButton
            item={{ id: `yt-${video.id}`, title: video.title, type: 'movie', thumbnail: video.thumbnail }}
            variant="crimson"
            className="flex-shrink-0"
          />
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, hsl(0, 80%, 50%), hsl(0, 70%, 40%))',
              color: 'white',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1rem',
              letterSpacing: '0.1em',
              boxShadow: '0 4px 16px hsla(0, 80%, 50%, 0.25)',
            }}
          >
            <ExternalLink className="w-4 h-4" /> Watch on YouTube
          </a>
        </div>
      </div>
    </motion.article>
  );
}
