import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Timer, Zap, Share2, CheckCircle, ExternalLink, Ticket, CalendarDays, Clapperboard } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { PredictionDrawer } from '@/components/PredictionDrawer';
import { useBalance } from '@/contexts/BalanceContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoItem } from '@/data/videoContent';

interface TrailerPreviewCardProps {
  video: VideoItem;
}

export function TrailerPreviewCard({ video }: TrailerPreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollVote, setPollVote] = useState<number | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [predictedOption, setPredictedOption] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addPoints, triggerFloatingPoints } = useBalance();
  const { lang, t } = useLanguage();

  const REWARD_THRESHOLD = 30;
  const remainingForReward = Math.max(0, REWARD_THRESHOLD - watchTime);

  const releaseLabel = video.releaseDate
    ? new Date(video.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

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
        setWatchTime(prev => {
          const next = prev + 1;
          if (next >= video.duration - 10 && !pollVote) setShowPoll(true);
          return next;
        });
        setProgress(prev => Math.min(prev + (100 / video.duration), 100));
      }, 1000);
    } else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, video.duration, pollVote]);

  useEffect(() => {
    if (watchTime >= REWARD_THRESHOLD && !rewardClaimed) {
      setRewardClaimed(true);
      addPoints(50);
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) triggerFloatingPoints(50, rect.left + rect.width / 2, rect.top);
      toast.success('+50 MP earned for watching! 🎬');
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
    setShowPoll(false);
    toast.success(`Voted: ${video.pollOptions[index]}`);
  };

  const handleShare = () => {
    const text = `🎬 Check out the ${video.title} for ${video.movieName}!`;
    if (navigator.share) navigator.share({ title: video.movieName, text, url: window.location.href }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
  };

  return (
    <>
      <article
        ref={cardRef}
        className="overflow-hidden rounded-2xl relative"
        style={{
          border: '2px solid hsl(var(--crimson))',
          boxShadow: '0 0 24px hsla(340, 85%, 50%, 0.25), 0 8px 32px hsla(0, 0%, 0%, 0.5)',
          background: 'linear-gradient(180deg, hsl(340, 30%, 8%) 0%, hsl(270, 25%, 6%) 100%)',
        }}
        onClick={resetControlsTimeout}
      >
        {/* Cinematic film-strip top edge */}
        <div className="flex items-center justify-between px-4 py-3" style={{ background: 'linear-gradient(135deg, hsl(340, 85%, 15%), hsl(340, 60%, 8%))' }}>
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4" style={{ color: 'hsl(var(--crimson))' }} />
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{
                color: 'hsl(var(--crimson))',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '0.2em',
                textShadow: '0 0 12px hsla(340, 85%, 50%, 0.4)',
              }}
            >
              Trailer Drop
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          </div>
          {releaseLabel && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'hsla(340, 85%, 50%, 0.15)', border: '1px solid hsla(340, 85%, 50%, 0.3)' }}>
              <CalendarDays className="w-3 h-3" style={{ color: 'hsl(var(--crimson-glow))' }} />
              <span className="text-[10px] font-bold" style={{ color: 'hsl(var(--crimson-glow))' }}>{releaseLabel}</span>
            </div>
          )}
        </div>

        {/* Video area — tall 9:16 */}
        <div className="relative">
          <AspectRatio ratio={9 / 16} className="bg-black">
            <img src={video.thumbnail} alt={`${video.movieName} trailer`} className="w-full h-full object-cover" style={{ filter: isPlaying ? 'brightness(0.85)' : 'brightness(0.5)' }} />
            <AnimatePresence>
              {showControls && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col justify-between p-4" style={{ background: 'linear-gradient(0deg, hsla(340,30%,5%,0.85) 0%, transparent 35%, transparent 65%, hsla(0,0%,0%,0.5) 100%)' }}>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'hsla(0,0%,0%,0.6)', border: '1px solid hsla(340,85%,50%,0.3)' }}>
                      <Timer className="w-3.5 h-3.5" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))' }} />
                      <span className="text-xs font-bold" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))', fontFamily: "'Roboto Mono', monospace" }}>
                        {rewardClaimed ? '✓ +50 MP' : `${remainingForReward}s → +50 MP`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button onClick={(e) => { e.stopPropagation(); setIsPlaying(p => !p); resetControlsTimeout(); }} className="w-18 h-18 rounded-full flex items-center justify-center" style={{ width: '72px', height: '72px', background: 'hsla(340, 85%, 50%, 0.25)', border: '2px solid hsla(340, 85%, 50%, 0.5)', backdropFilter: 'blur(8px)' }}>
                      {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                    </button>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-black text-white uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif", textShadow: '0 2px 12px hsla(340,85%,50%,0.5), 0 4px 16px hsla(0,0%,0%,0.8)' }}>{video.movieName}</p>
                      <p className="text-sm text-white/80 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{video.title}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setIsMuted(m => !m); }} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'hsla(340,85%,50%,0.2)', border: '1px solid hsla(340,85%,50%,0.3)' }}>
                      {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Poll overlay */}
            <AnimatePresence>
              {showPoll && pollVote === null && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-20 left-4 right-4 p-4 rounded-2xl" style={{ background: 'hsla(340,30%,5%,0.85)', border: '1px solid hsla(340,85%,50%,0.3)', backdropFilter: 'blur(12px)' }}>
                  <p className="text-sm font-bold text-center mb-3" style={{ color: 'hsl(var(--crimson))' }}>{video.pollQuestion}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {video.pollOptions.map((opt, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); handlePollVote(i); }} className="py-3 rounded-xl text-sm font-bold" style={{ background: i === 0 ? 'linear-gradient(135deg, hsl(var(--crimson)), hsl(var(--crimson-glow)))' : 'hsla(0,0%,100%,0.08)', color: 'white', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', border: i === 1 ? '1px solid hsla(340,85%,50%,0.3)' : 'none' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AspectRatio>
          {/* Crimson progress bar */}
          <div className="h-1 relative" style={{ background: 'hsla(340,85%,50%,0.15)' }}>
            <div className="h-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(var(--crimson)), hsl(var(--crimson-glow)))' }} />
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-2.5 p-4" style={{ background: 'linear-gradient(180deg, hsl(340, 30%, 8%), hsl(270, 25%, 6%))' }}>
          <div className="flex items-center gap-2">
            {video.watchLink && (
              <a href={video.watchLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:brightness-110" style={{ background: 'hsla(340, 85%, 50%, 0.1)', border: '1px solid hsla(340,85%,50%,0.4)', color: 'hsl(var(--crimson-glow))', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
                <ExternalLink className="w-3.5 h-3.5" /> Watch Trailer
              </a>
            )}
            {video.ticketLink && (
              <a href={video.ticketLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, hsl(var(--crimson)), hsl(var(--crimson-glow)))', color: 'white', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', boxShadow: '0 4px 16px hsla(340,85%,50%,0.3)' }}>
                <Ticket className="w-3.5 h-3.5" /> Buy Tickets
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPrediction(true)} className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all" style={{ background: hasPredicted ? 'hsla(340,85%,50%,0.1)' : 'linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-glow)))', color: hasPredicted ? 'hsl(var(--crimson-glow))' : 'hsl(var(--primary-foreground))', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.06em', border: hasPredicted ? '1px solid hsla(340,85%,50%,0.3)' : 'none', boxShadow: hasPredicted ? 'none' : '0 4px 16px hsla(45,100%,50%,0.3)' }}>
              {hasPredicted ? <><CheckCircle className="w-4 h-4" /> Predicted {predictedOption}</> : <><Zap className="w-4 h-4" /> Predict Opening</>}
            </button>
            <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsla(340,85%,50%,0.1)', border: '1px solid hsla(340,85%,50%,0.3)' }}>
              <Share2 className="w-4 h-4" style={{ color: 'hsl(var(--crimson-glow))' }} />
            </button>
          </div>
        </div>
      </article>

      <PredictionDrawer isOpen={showPrediction} onClose={() => setShowPrediction(false)} title={video.predictionMarketQuestion} shortTitle={video.movieName} options={video.predictionMarketOptions} initialPrice={video.initialYesPrice} onPredictionConfirmed={(option) => { setHasPredicted(true); setPredictedOption(option); }} />
    </>
  );
}
