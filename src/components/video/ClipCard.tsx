import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Timer, Share2, Tv, Film } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { useBalance } from '@/contexts/BalanceContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoItem } from '@/data/videoContent';

interface ClipCardProps {
  video: VideoItem;
}

export function ClipCard({ video }: ClipCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addPoints, triggerFloatingPoints } = useBalance();

  const REWARD_THRESHOLD = 30;
  const remainingForReward = Math.max(0, REWARD_THRESHOLD - watchTime);

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
      addPoints(30);
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) triggerFloatingPoints(30, rect.left + rect.width / 2, rect.top);
      toast.success('+30 MP earned for watching clip! 🎞️');
    }
  }, [watchTime, rewardClaimed, addPoints, triggerFloatingPoints]);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setIsPlaying(current => { if (current) setShowControls(false); return current; });
    }, 3000);
  }, []);

  const handleShare = () => {
    const text = `🎞️ ${video.title} from ${video.movieName} — watch this scene!`;
    if (navigator.share) navigator.share({ title: video.movieName, text, url: window.location.href }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
  };

  return (
    <article ref={cardRef} className="overflow-hidden rounded-2xl" style={{ background: 'hsl(var(--card))' }} onClick={resetControlsTimeout}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'linear-gradient(135deg, hsl(var(--deep-purple)), hsla(0,0%,0%,0.9))' }}>
        <Film className="w-3.5 h-3.5" style={{ color: 'hsl(var(--accent))' }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(var(--accent))', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>
          🎞️ Clip
        </span>
        {video.episodeInfo && (
          <span className="ml-auto text-[10px] text-muted-foreground">{video.episodeInfo}</span>
        )}
      </div>

      {/* Video area — 16:9 for clips */}
      <div className="relative">
        <AspectRatio ratio={16 / 9} className="bg-black">
          <img src={video.thumbnail} alt={`${video.movieName} clip`} className="w-full h-full object-cover" style={{ filter: isPlaying ? 'brightness(0.85)' : 'brightness(0.55)' }} />
          <AnimatePresence>
            {showControls && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col justify-between p-4" style={{ background: 'linear-gradient(0deg, hsla(0,0%,0%,0.7) 0%, transparent 50%, hsla(0,0%,0%,0.4) 100%)' }}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'hsla(0,0%,0%,0.5)' }}>
                    <Timer className="w-3.5 h-3.5" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))' }} />
                    <span className="text-xs font-bold" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))', fontFamily: "'Roboto Mono', monospace" }}>
                      {rewardClaimed ? '✓ +30 MP' : `${remainingForReward}s → +30 MP`}
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
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-bold text-base text-white" style={{ textShadow: '0 2px 8px hsla(0,0%,0%,0.8)' }}>{video.movieName}</p>
                    <p className="text-xs text-white/70">{video.title}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsMuted(m => !m); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'hsla(0,0%,0%,0.4)' }}>
                    {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AspectRatio>
        <Progress value={progress} className="h-1 rounded-none" style={{ background: 'hsla(0,0%,100%,0.2)' }} />
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 p-3" style={{ background: 'hsla(0,0%,0%,0.9)' }}>
        {video.streamingLink && (
          <a href={video.streamingLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(280, 60%, 45%))', color: 'white', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.08em' }}>
            <Tv className="w-4 h-4" /> Watch on {video.streamingService}
          </a>
        )}
        <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--muted))' }}>
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </article>
  );
}
