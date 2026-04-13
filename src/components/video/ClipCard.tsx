import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Timer, Share2, Tv, Scissors, Sparkles } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
    <article
      ref={cardRef}
      className="overflow-hidden rounded-2xl relative"
      style={{
        border: '2px solid hsl(var(--neon-cyan))',
        boxShadow: '0 0 20px hsla(180, 100%, 45%, 0.2), 0 8px 32px hsla(0, 0%, 0%, 0.5)',
        background: 'linear-gradient(180deg, hsl(190, 40%, 6%) 0%, hsl(200, 30%, 4%) 100%)',
      }}
      onClick={resetControlsTimeout}
    >
      {/* Header — cyan/teal accent */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'linear-gradient(135deg, hsl(180, 50%, 8%), hsl(190, 40%, 5%))' }}>
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4" style={{ color: 'hsl(var(--neon-cyan))' }} />
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: 'hsl(var(--neon-cyan))',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.2em',
              textShadow: '0 0 12px hsla(180, 100%, 45%, 0.4)',
            }}
          >
            Scene Clip
          </span>
        </div>
        <div className="flex items-center gap-2">
          {video.episodeInfo && (
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: 'hsl(var(--neon-cyan))', background: 'hsla(180,100%,45%,0.1)', border: '1px solid hsla(180,100%,45%,0.2)' }}>
              {video.episodeInfo}
            </span>
          )}
          <span className="text-[10px] font-mono" style={{ color: 'hsla(180, 100%, 80%, 0.6)' }}>
            {Math.floor(watchTime / 60)}:{String(watchTime % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Video area — wide 16:9 for clips */}
      <div className="relative">
        <AspectRatio ratio={16 / 9} className="bg-black">
          <img src={video.thumbnail} alt={`${video.movieName} clip`} className="w-full h-full object-cover" style={{ filter: isPlaying ? 'brightness(0.9)' : 'brightness(0.45)' }} />
          <AnimatePresence>
            {showControls && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col justify-between p-4" style={{ background: 'linear-gradient(0deg, hsla(190,40%,4%,0.85) 0%, transparent 40%, transparent 70%, hsla(0,0%,0%,0.4) 100%)' }}>
                <div className="flex justify-end">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'hsla(0,0%,0%,0.6)', border: '1px solid hsla(180,100%,45%,0.3)' }}>
                    <Timer className="w-3.5 h-3.5" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--neon-cyan))' }} />
                    <span className="text-xs font-bold" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--neon-cyan))', fontFamily: "'Roboto Mono', monospace" }}>
                      {rewardClaimed ? '✓ +30 MP' : `${remainingForReward}s → +30 MP`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={(e) => { e.stopPropagation(); setIsPlaying(p => !p); resetControlsTimeout(); }} className="rounded-full flex items-center justify-center" style={{ width: '64px', height: '64px', background: 'hsla(180, 100%, 45%, 0.15)', border: '2px solid hsla(180, 100%, 45%, 0.4)', backdropFilter: 'blur(8px)' }}>
                    {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-0.5" />}
                  </button>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 2px 8px hsla(0,0%,0%,0.8)' }}>{video.movieName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'hsla(180, 100%, 80%, 0.7)', fontFamily: "'DM Sans', sans-serif" }}>{video.title}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsMuted(m => !m); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'hsla(180,100%,45%,0.15)', border: '1px solid hsla(180,100%,45%,0.3)' }}>
                    {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AspectRatio>
        {/* Cyan progress bar */}
        <div className="h-1 relative" style={{ background: 'hsla(180,100%,45%,0.1)' }}>
          <div className="h-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(180, 80%, 60%))' }} />
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 p-4" style={{ background: 'linear-gradient(180deg, hsl(190, 40%, 6%), hsl(200, 30%, 4%))' }}>
        {video.streamingLink && (
          <a href={video.streamingLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(180, 80%, 35%))', color: 'hsl(200, 40%, 5%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.1em', boxShadow: '0 4px 16px hsla(180,100%,45%,0.25)' }}>
            <Tv className="w-4 h-4" /> Watch on {video.streamingService}
          </a>
        )}
        <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsla(180,100%,45%,0.1)', border: '1px solid hsla(180,100%,45%,0.3)' }}>
          <Share2 className="w-4 h-4" style={{ color: 'hsl(var(--neon-cyan))' }} />
        </button>
      </div>
    </article>
  );
}
