import { useState } from 'react';
import { Star, Bookmark, PenLine, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useBalance } from '@/contexts/BalanceContext';
import { Confetti } from '@/components/Confetti';
import { toast } from 'sonner';
import type { ReviewItem } from '@/data/reviewContent';

const PLATFORM_COLORS: Record<string, string> = {
  Netflix: 'hsl(0, 75%, 50%)',
  Prime: 'hsl(200, 100%, 45%)',
  Hotstar: 'hsl(210, 80%, 50%)',
  Jio: 'hsl(280, 70%, 55%)',
  Zee5: 'hsl(260, 60%, 50%)',
  Theatre: 'hsl(45, 100%, 50%)',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= rating ? 'hsl(45, 100%, 50%)' : 'transparent'}
          stroke={i <= rating ? 'hsl(45, 100%, 50%)' : 'hsl(var(--muted-foreground))'}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function SentimentBar({ label, percentage }: { label: string; percentage: number }) {
  const barColor = percentage >= 80 ? 'hsl(142, 70%, 45%)' : percentage >= 60 ? 'hsl(45, 100%, 50%)' : 'hsl(17, 100%, 50%)';
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-muted-foreground">Community</span>
        <span className="font-semibold" style={{ color: barColor }}>{percentage}% say "{label}"</span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ background: 'hsl(var(--muted))' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, background: barColor }} />
      </div>
    </div>
  );
}

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [saved, setSaved] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [actionScore, setActionScore] = useState([50]);
  const [dramaScore, setDramaScore] = useState([50]);
  const [paisaVasoolScore, setPaisaVasoolScore] = useState([50]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { addPoints, triggerFloatingPoints } = useBalance();

  const handleSubmitReview = () => {
    setShowConfetti(true);
    setHasReviewed(true);
    setShowReviewModal(false);
    addPoints(25);
    triggerFloatingPoints(25, window.innerWidth / 2, window.innerHeight / 2);
    toast.success('Verdict Confirmed! +25 MP earned! 🎬', {
      className: 'bg-gold/20 border-gold text-gold',
    });
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <article
        className="glass-card overflow-hidden animate-slide-up"
        style={{ borderColor: 'hsla(280, 60%, 50%, 0.4)', background: 'linear-gradient(135deg, hsla(280, 40%, 98%, 0.95), hsla(45, 20%, 98%, 0.9))' }}
      >
        {/* Header badge */}
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'hsla(280, 50%, 50%, 0.08)' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'hsl(280, 60%, 55%)' }}>
            🎬 Critic's Corner
          </span>
        </div>

        <div className="flex p-4 gap-3">
          {/* Portrait poster */}
          <div className="w-[100px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '2/3' }}>
            <img src={review.posterImage} alt={`${review.title} poster`} className="w-full h-full object-cover" />
          </div>

          {/* Info side */}
          <div className="flex-1 flex flex-col justify-between min-w-0 gap-2">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-bold leading-tight text-foreground truncate">{review.title}</h3>
                <button
                  onClick={() => setSaved(!saved)}
                  aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'}
                  className="flex-shrink-0 p-1 rounded-full transition-colors"
                >
                  <Bookmark
                    className="w-4 h-4 transition-colors"
                    fill={saved ? 'hsl(45, 100%, 50%)' : 'transparent'}
                    stroke={saved ? 'hsl(45, 100%, 50%)' : 'hsl(var(--muted-foreground))'}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded text-[9px] font-bold text-white"
                  style={{ background: PLATFORM_COLORS[review.platform] || 'hsl(var(--muted))' }}
                >
                  {review.platform}
                </span>
                <span className="text-[10px] text-muted-foreground">{review.genre} • {review.year}</span>
              </div>

              <div className="mt-1.5">
                <StarRating rating={review.starRating} />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">{review.logLine}</p>
            </div>

            <SentimentBar label={review.communitySentiment.label} percentage={review.communitySentiment.percentage} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 flex gap-2">
          {!hasReviewed ? (
            <Button
              onClick={() => setShowReviewModal(true)}
              className="flex-1 rounded-xl py-5 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, hsl(280 60% 55%), hsl(300 50% 50%))',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1rem',
                letterSpacing: '0.06em',
                boxShadow: '0 4px 20px hsla(280, 60%, 55%, 0.4)',
              }}
            >
              <PenLine className="w-4 h-4" />
              WRITE A REVIEW (+25 MP)
            </Button>
          ) : (
            <div className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2 bg-accent/20 border border-accent/40">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-accent font-medium text-sm">Verdict Submitted</span>
            </div>
          )}
        </div>
      </article>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden"
              style={{ background: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0.99), hsla(280, 15%, 97%, 0.99))', maxHeight: '80vh' }}
            >
              <div className="p-5 space-y-5">
                <div className="w-10 h-1 rounded-full bg-muted mx-auto" />
                <h3 className="font-display text-lg font-bold text-foreground text-center">
                  Rate "{review.title}"
                </h3>

                <SliderRow label="🎬 Action" value={actionScore} onChange={setActionScore} />
                <SliderRow label="🎭 Drama" value={dramaScore} onChange={setDramaScore} />
                <SliderRow label="💰 Paisa Vasool" value={paisaVasoolScore} onChange={setPaisaVasoolScore} />

                <Button
                  onClick={handleSubmitReview}
                  className="w-full rounded-xl py-5"
                  style={{
                    background: 'linear-gradient(135deg, hsl(280 60% 55%), hsl(300 50% 50%))',
                    color: 'white',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.1rem',
                    letterSpacing: '0.08em',
                    boxShadow: '0 4px 25px hsla(280, 60%, 55%, 0.5)',
                  }}
                >
                  SUBMIT VERDICT (+25 MP)
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SliderRow({ label, value, onChange }: { label: string; value: number[]; onChange: (v: number[]) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-mono font-semibold text-foreground">{value[0]}/100</span>
      </div>
      <Slider value={value} onValueChange={onChange} max={100} step={1} className="w-full" />
    </div>
  );
}
