import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Timer, Share2, Star, Tv, Quote } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
      <Star key={i} className="w-4 h-4" fill={i < Math.floor(rating) ? 'hsl(45, 100%, 50%)' : i < rating ? 'hsl(45, 100%, 50%)' : 'transparent'} stroke={i < rating ? 'hsl(45, 100%, 50%)' : 'hsl(var(--muted-foreground))'} />
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
    <article
      ref={cardRef}
      className="overflow-hidden rounded-2xl relative"
      style={{
        border: '2px solid hsl(var(--gold))',
        boxShadow: '0 0 20px hsla(45, 100%, 50%, 0.15), 0 8px 32px hsla(0, 0%, 0%, 0.5)',
        background: 'linear-gradient(180deg, hsl(35, 25%, 8%) 0%, hsl(30, 20%, 5%) 100%)',
      }}
      onClick={resetControlsTimeout}
    >
      {/* Reviewer header — warm editorial feel */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, hsl(35, 30%, 10%), hsl(30, 25%, 6%))', borderBottom: '1px solid hsla(45, 100%, 50%, 0.15)' }}>
        {video.reviewerAvatar && (
          <img src={video.reviewerAvatar} alt={video.reviewerName} className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid hsl(var(--gold))', boxShadow: '0 0 8px hsla(45,100%,50%,0.3)' }} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: 'hsl(var(--gold))', fontFamily: "'DM Sans', sans-serif" }}>{video.reviewerName}</span>
          </div>
          <span className="text-[11px] uppercase tracking-widest" style={{ color: 'hsla(45, 100%, 70%, 0.6)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>
            Video Review · {durationLabel}
          </span>
        </div>
        {video.rating && (
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-0.5">{renderStars(video.rating)}</div>
            <span className="text-xs font-bold" style={{ color: 'hsl(var(--gold))', fontFamily: "'Roboto Mono', monospace" }}>{video.rating}/5</span>
          </div>
        )}
      </div>

      {/* Video area — 16:9 */}
      <div className="relative">
        <AspectRatio ratio={16 / 9} className="bg-black">
          <img src={video.thumbnail} alt={`${video.movieName} review`} className="w-full h-full object-cover" style={{ filter: isPlaying ? 'brightness(0.85) sepia(0.1)' : 'brightness(0.4) sepia(0.15)' }} />
          <AnimatePresence>
            {showControls && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col justify-between p-4" style={{ background: 'linear-gradient(0deg, hsla(35,25%,5%,0.9) 0%, transparent 35%, transparent 75%, hsla(0,0%,0%,0.4) 100%)' }}>
                <div className="flex justify-between items-start">
                  <div className="px-3 py-1 rounded-full" style={{ background: 'hsla(45,100%,50%,0.15)', border: '1px solid hsla(45,100%,50%,0.3)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'hsl(var(--gold))', fontFamily: "'Bebas Neue', sans-serif" }}>Review</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'hsla(0,0%,0%,0.6)', border: '1px solid hsla(45,100%,50%,0.2)' }}>
                    <Timer className="w-3.5 h-3.5" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))' }} />
                    <span className="text-xs font-bold" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))', fontFamily: "'Roboto Mono', monospace" }}>
                      {rewardClaimed ? '✓ +75 MP' : `${remainingForReward}s → +75 MP`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={(e) => { e.stopPropagation(); setIsPlaying(p => !p); resetControlsTimeout(); }} className="rounded-full flex items-center justify-center" style={{ width: '64px', height: '64px', background: 'hsla(45, 100%, 50%, 0.15)', border: '2px solid hsla(45, 100%, 50%, 0.4)', backdropFilter: 'blur(8px)' }}>
                    {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-0.5" />}
                  </button>
                </div>
                <div>
                  <p className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 8px hsla(0,0%,0%,0.8)' }}>{video.movieName}</p>
                  <p className="text-xs text-white/70 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{video.title}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AspectRatio>
        {/* Gold progress bar */}
        <div className="h-1 relative" style={{ background: 'hsla(45,100%,50%,0.1)' }}>
          <div className="h-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(var(--gold)), hsl(var(--gold-glow)))' }} />
        </div>
      </div>

      {/* Review content area */}
      <div className="p-4 space-y-3" style={{ background: 'linear-gradient(180deg, hsl(35, 25%, 8%), hsl(30, 20%, 5%))' }}>
        {/* Review snippet with quote styling */}
        {video.reviewSnippet && (
          <div className="relative pl-4" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
            <Quote className="absolute -left-1 -top-1 w-5 h-5" style={{ color: 'hsla(45,100%,50%,0.3)' }} />
            <p className="text-sm leading-relaxed italic" style={{ color: 'hsla(45, 100%, 90%, 0.8)', fontFamily: "'Playfair Display', serif" }}>
              "{video.reviewSnippet}"
            </p>
          </div>
        )}

        {/* Inline poll */}
        {pollVote === null ? (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold text-center uppercase tracking-wider" style={{ color: 'hsl(var(--gold))', fontFamily: "'Bebas Neue', sans-serif" }}>{video.pollQuestion}</p>
            <div className="grid grid-cols-2 gap-2">
              {video.pollOptions.map((opt, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); handlePollVote(i); }} className="py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110" style={{ background: i === 0 ? 'hsla(45,100%,50%,0.1)' : 'hsla(0,0%,100%,0.05)', color: i === 0 ? 'hsl(var(--gold))' : 'hsl(var(--foreground))', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: '0.05em', border: `1px solid ${i === 0 ? 'hsla(45,100%,50%,0.3)' : 'hsla(0,0%,100%,0.1)'}` }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-center py-1" style={{ color: 'hsla(45,100%,70%,0.6)' }}>Voted: {video.pollOptions[pollVote]}</p>
        )}

        {/* Bottom actions */}
        <div className="flex items-center gap-2 pt-1">
          {video.streamingLink && (
            <a href={video.streamingLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:brightness-110" style={{ background: 'hsla(45,100%,50%,0.08)', border: '1px solid hsla(45,100%,50%,0.25)', color: 'hsl(var(--gold))', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
              <Tv className="w-3.5 h-3.5" /> Watch on {video.streamingService}
            </a>
          )}
          <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsla(45,100%,50%,0.08)', border: '1px solid hsla(45,100%,50%,0.25)' }}>
            <Share2 className="w-4 h-4" style={{ color: 'hsl(var(--gold))' }} />
          </button>
        </div>
      </div>
    </article>
  );
}
