import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Timer, Zap, Share2, CheckCircle, ExternalLink, Ticket } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { PredictionDrawer } from '@/components/PredictionDrawer';
import { useBalance } from '@/contexts/BalanceContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoItem } from '@/data/videoContent';

interface VideoPreviewCardProps {
  video: VideoItem;
}

export function VideoPreviewCard({ video }: VideoPreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [cinematicMode, setCinematicMode] = useState(false);
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

  const REWARD_THRESHOLD = 30;
  const remainingForReward = Math.max(0, REWARD_THRESHOLD - watchTime);

  // IntersectionObserver for autoplay at 80%
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.8) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.8] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Simulate playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setWatchTime(prev => {
          const next = prev + 1;
          // Show poll in last 10 seconds
          if (next >= video.duration - 10 && !pollVote) {
            setShowPoll(true);
          }
          return next;
        });
        setProgress(prev => {
          const next = prev + (100 / video.duration);
          return Math.min(next, 100);
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, video.duration, pollVote]);

  // Reward when threshold reached
  useEffect(() => {
    if (watchTime >= REWARD_THRESHOLD && !rewardClaimed) {
      setRewardClaimed(true);
      addPoints(50);
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        triggerFloatingPoints(50, rect.left + rect.width / 2, rect.top);
      }
      toast.success('+50 MP earned for watching! 🎬', {
        className: 'bg-gold/20 border-gold text-gold',
      });
    }
  }, [watchTime, rewardClaimed, addPoints, triggerFloatingPoints]);

  const togglePlay = useCallback(() => {
    setIsPlaying(p => !p);
    resetControlsTimeout();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(m => !m);
    resetControlsTimeout();
  }, []);

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handlePollVote = (index: number) => {
    setPollVote(index);
    setShowPoll(false);
    toast.success(`Voted: ${video.pollOptions[index]}`, {
      className: 'bg-gold/20 border-gold text-gold',
    });
  };

  const handleShare = () => {
    const text = `🎬 Check out the ${video.title} for ${video.movieName}! What's your prediction?`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: video.movieName, text, url }).catch(() => {});
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <>
      <article
        ref={cardRef}
        className={`video-preview-card overflow-hidden animate-slide-up ${cinematicMode ? 'video-cinematic-mode' : ''}`}
        onClick={resetControlsTimeout}
      >
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'hsla(0,0%,0%,0.85)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(var(--gold))', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>
            🎬 Trailer Drop
          </span>
          <span className="ml-auto text-[10px] font-mono" style={{ color: 'hsla(0,0%,100%,0.6)' }}>
            {Math.floor(watchTime / 60)}:{String(watchTime % 60).padStart(2, '0')} / {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
          </span>
        </div>

        {/* Video Area */}
        <div className="relative">
          <AspectRatio ratio={9 / 16} className="bg-black">
            <img
              src={video.thumbnail}
              alt={`${video.movieName} trailer thumbnail`}
              className="w-full h-full object-cover"
              style={{ filter: isPlaying ? 'brightness(0.85)' : 'brightness(0.6)' }}
            />

            {/* Overlay Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col justify-between p-4"
                  style={{ background: 'linear-gradient(0deg, hsla(0,0%,0%,0.7) 0%, transparent 40%, transparent 60%, hsla(0,0%,0%,0.5) 100%)' }}
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start">
                    {/* Reward Timer */}
                    <div className="video-reward-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full">
                      <Timer className="w-3.5 h-3.5" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))' }} />
                      <span className="text-xs font-bold" style={{ color: rewardClaimed ? 'hsl(150, 70%, 50%)' : 'hsl(var(--gold))', fontFamily: "'Roboto Mono', monospace" }}>
                        {rewardClaimed ? '✓ +50 MP' : `${remainingForReward}s → +50 MP`}
                      </span>
                    </div>

                    {/* Cinematic Toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setCinematicMode(c => !c); }}
                      className="video-control-btn"
                    >
                      {cinematicMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Center Play/Pause */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="video-play-btn"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </button>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-display text-lg font-bold leading-tight" style={{ color: 'white', textShadow: '0 2px 8px hsla(0,0%,0%,0.8)' }}>
                        {video.movieName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'hsla(0,0%,100%,0.7)' }}>
                        {video.title}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                      className="video-control-btn"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Poll Overlay */}
            <AnimatePresence>
              {showPoll && !pollVote && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-20 left-4 right-4 p-4 rounded-2xl"
                  style={{ background: 'hsla(0,0%,0%,0.75)', backdropFilter: 'blur(12px)' }}
                >
                  <p className="text-sm font-bold text-center mb-3" style={{ color: 'hsl(var(--gold))' }}>
                    {video.pollQuestion}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {video.pollOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); handlePollVote(i); }}
                        className="py-3 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: i === 0
                            ? 'linear-gradient(135deg, hsl(45 100% 55%), hsl(40 100% 50%))'
                            : 'linear-gradient(135deg, hsl(340 85% 55%), hsl(350 80% 60%))',
                          color: i === 0 ? 'hsl(0 0% 5%)' : 'white',
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '1.1rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AspectRatio>

          {/* Progress Bar */}
          <Progress
            value={progress}
            className="h-1 rounded-none"
            style={{ background: 'hsla(0,0%,100%,0.2)' }}
          />
        </div>

        {/* Action Bar */}
        {!cinematicMode && (
          <div className="flex flex-col gap-2 p-3" style={{ background: 'hsla(0,0%,0%,0.9)' }}>
            {/* Watch & Tickets row */}
            <div className="flex items-center gap-2">
              <a
                href={video.watchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 0% 20%), hsl(0 0% 15%))',
                  color: 'white',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  border: '1px solid hsla(0,0%,100%,0.15)',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Watch Trailer
              </a>
              <a
                href={video.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                style={{
                  background: 'linear-gradient(135deg, hsl(340 85% 55%), hsl(350 80% 50%))',
                  color: 'white',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                }}
              >
                <Ticket className="w-3.5 h-3.5" />
                Buy Tickets
              </a>
            </div>
            {/* Predict & Share row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrediction(true)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  hasPredicted ? 'video-btn-predicted' : 'btn-gold'
                }`}
                style={!hasPredicted ? { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.06em' } : { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem' }}
              >
                {hasPredicted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Predicted: {predictedOption}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Predict Opening Day
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="video-control-btn p-3"
                aria-label="Share to WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </article>

      <PredictionDrawer
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        title={video.predictionMarketQuestion}
        shortTitle={video.movieName}
        options={video.predictionMarketOptions}
        initialPrice={video.initialYesPrice}
        onPredictionConfirmed={(option) => {
          setHasPredicted(true);
          setPredictedOption(option);
        }}
      />
    </>
  );
}
