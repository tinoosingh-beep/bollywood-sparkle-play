import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Timer, Share2, Star, Tv, MessageSquare } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { useBalance } from '@/contexts/BalanceContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoItem } from '@/data/videoContent';

interface VideoReviewCardProps {
  video: VideoItem;
}

export function VideoReviewCard({ video }: VideoReviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [pollVote, setPollVote] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addPoints, triggerFloatingPoints } = useBalance();

  const REWARD_THRESHOLD = 60;
  const remainingForReward = Math.max(0, REWARD_THRESHOLD - watchTime);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="w-3.5 h-3.5" fill={i < Math.floor(rating) ? 'hsl(45, 100%, 50%)' : i < rating ? 'hsl(45, 100%, 50%)' : 'transparent'} stroke={i < rating ? 'hsl(45, 100%, 50%)' : 'hsl(var(--muted-foreground))'} />
    ));
  };

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { entry.intersectionRatio >= 0.8 ? setIsPlaying(true) : setIsPlaying(false); },
      { threshold: [0, 0.8] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setWatchTime(prev => prev + 1);
        setProgress(prev => Math.min(prev + (100 / video.duration), 100));
      }, 1000);
    } else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, video.duration]);

  useEffect(() => {
    if (watchTime >= REWARD_THRESHOLD && !rewardClaimed) {
      setRewardClaimed(true);
      addPoints(75);
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) triggerFloatingPoints(75, rect.left + rect.width / 2, rect.top);
      toast.success('+75 MP earned for watching review! 🎬');
    }
  }, [watchTime, rewardClaimed, addPoints, triggerFloatingPoints]);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setIsPlaying(current => { if (current) setShowControls(false); return current; });
    }, 3000);
  }, []);

  const handlePollVote = (index: number) => {
    setPollVote(index);
    toast.success(`Voted: ${video.pollOptions[index]}`);
  };

  const handleShare = () => {
    const text = `🎬 ${video.reviewerName}'s take on ${video.movieName} — ${video.title}`;
    if (navigator.share) navigator.share({ title: video.movieName, text, url: window.location.href }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
  };

  const durationLabel = video.duration >= 60 ? `${Math.floor(video.duration / 60)} min` : `${video.duration}s`;

  return (
    <article ref={cardRef} className="overflow-hidden rounded-2xl" style={{ background: 'hsl(var(--card))' }} onClick={resetControlsTimeout}>
      {/* Header with reviewer info */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, hsl(var(--deep-purple)), hsla(0,0%,0%,0.9))' }}>
        {video.reviewerAvatar && (
          <img src={video.reviewerAvatar} alt={video.reviewerName} className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: 'hsl(var(--gold))' }} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{video.reviewerName}</span>
            <MessageSquare className="w-3 h-3 text-muted-foreground" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Video Review · {durationLabel}
          </span>
        </div>
        {video.rating && (
          <div className="flex items-center gap-0.5">
            {renderStars(video.rating)}
          </div>
        )}
      </div>

      {/* Video area — 16:9 */}
      <div className="relative">
        <AspectRatio ratio={16 / 9} className="bg-black">
          <img src={video.thumbnail} alt={`${video.movieName} review`} className="w-full h-full object-cover" style={{ filter: isPlaying ? 'brightness(0.85)' : 'brightness(0.5)' }} />
          <AnimatePresence>
            {showControls && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col justify-between p-4" style={{ background: 'linear-gradient(0deg, hsla(0,0%,0%,0.8) 0%, transparent 40%, transparent 70%, hsla(0,0%,0%,0.4) 100%)' }}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'hsla(0,0%,0%,0.5)' }}>
                    <Timer className="w-3.5 h-3.5" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))' }} />
                    <span className="text-xs font-bold" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))', fontFamily: "'Roboto Mono', monospace" }}>
                      {rewardClaimed ? '✓ +75 MP' : `${remainingForReward}s → +75 MP`}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">
                    {Math.floor(watchTime / 60)}:{String(watchTime % 60).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={(e) => { e.stopPropagation(); setIsPlaying(p => !p); resetControlsTimeout(); }} className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'hsla(0,0%,100%,0.15)', backdropFilter: 'blur(8px)' }}>
                    {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-0.5" />}
                  </button>
                </div>
                <div>
                  <p className="font-bold text-lg text-white" style={{ textShadow: '0 2px 8px hsla(0,0%,0%,0.8)' }}>{video.movieName}</p>
                  <p className="text-xs text-white/70">{video.title}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AspectRatio>
        <Progress value={progress} className="h-1 rounded-none" style={{ background: 'hsla(0,0%,100%,0.2)' }} />
      </div>

      {/* Review snippet + poll + actions */}
      <div className="p-3 space-y-3" style={{ background: 'hsla(0,0%,0%,0.9)' }}>
        {video.reviewSnippet && (
          <p className="text-xs text-muted-foreground leading-relaxed italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            "{video.reviewSnippet}"
          </p>
        )}

        {/* Inline poll */}
        {pollVote === null ? (
          <div className="space-y-2">
            <p className="text-xs font-bold text-center" style={{ color: 'hsl(var(--gold))' }}>{video.pollQuestion}</p>
            <div className="grid grid-cols-2 gap-2">
              {video.pollOptions.map((opt, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); handlePollVote(i); }} className="py-2.5 rounded-xl text-xs font-bold border transition-all hover:scale-[1.02]" style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-center text-muted-foreground">Voted: {video.pollOptions[pollVote]}</p>
        )}

        <div className="flex items-center gap-2">
          {video.streamingLink && (
            <a href={video.streamingLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em', border: '1px solid hsl(var(--border))' }}>
              <Tv className="w-3.5 h-3.5" /> Watch on {video.streamingService}
            </a>
          )}
          <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--muted))' }}>
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </article>
  );
}
