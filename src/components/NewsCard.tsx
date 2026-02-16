import { useState, useRef, useEffect, useMemo } from 'react';
import { CheckCircle, Zap, Clock, Swords, TrendingUp, TrendingDown, Bot, Radio, ShieldCheck } from 'lucide-react';
import { useBalance } from '@/contexts/BalanceContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScriptSlots, STORY_TIME_REDUCTION } from '@/contexts/ScriptSlotsContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PredictionDrawer } from '@/components/PredictionDrawer';
import { Confetti } from '@/components/Confetti';
import { toast } from 'sonner';
import { newsContentHi } from '@/data/newsContent.hi';
import type { NewsStory } from '@/data/newsContent';

interface NewsCardProps {
  story: NewsStory;
}

// Derive ambient metadata from story properties
function getAmbientMeta(story: NewsStory) {
  const headline = story.headline.toLowerCase();
  const summary = story.summary.toLowerCase();

  const isTrending = story.initialYesPrice >= 0.6;
  const trendingGlow = isTrending ? (story.initialYesPrice >= 0.7 ? 'gold' : 'indigo') : null;
  const isMarketActive = true; // all stories have markets
  const yesPrice = Math.round(story.initialYesPrice * 100);
  const isAI = headline.includes('ai') || headline.includes('vfx') || summary.includes('artificial intelligence') || summary.includes('vfx');
  const aiRatio = isAI ? Math.round(30 + Math.random() * 45) : 0;
  const isLiveInside = story.id % 7 === 0;
  const isVerified = story.id % 4 === 0;
  // Sentiment: derive from yes price
  const sentimentRising = story.initialYesPrice > 0.5;
  const sentimentPercent = Math.round(story.initialYesPrice * 100);
  // "Updated X min ago"
  const updatedMinAgo = Math.max(1, (story.id * 3) % 12);

  return { isTrending, trendingGlow, isMarketActive, yesPrice, isAI, aiRatio, isLiveInside, isVerified, sentimentRising, sentimentPercent, updatedMinAgo };
}

export function NewsCard({ story }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [predictedOption, setPredictedOption] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [verified, setVerified] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { addPoints, triggerFloatingPoints } = useBalance();
  const { fillEmptySlot, slots, reduceSlotTime } = useScriptSlots();
  const { lang, t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);

  const hi = lang === 'hi' ? newsContentHi[story.id] : null;
  const headline = hi?.headline || story.headline;
  const summary = hi?.summary || story.summary;
  const quizQuestion = hi?.quizQuestion || story.quizQuestion;
  const predictionMarketQuestion = hi?.predictionMarketQuestion || story.predictionMarketQuestion;
  const quizOptions = story.quizOptions || [story.correctAnswer, 'Option A', 'Option B', 'Option C'];

  const meta = useMemo(() => getAmbientMeta(story), [story]);
  const isBet = story.type === 'bet';
  const isVibe = story.type === 'vibe';

  // Scroll progress tracker
  useEffect(() => {
    if (!isExpanded || !contentRef.current) return;
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalH = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top + viewportH * 0.5);
      const progress = Math.min(1, scrolled / totalH);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded]);

  const handleQuizSubmit = (selectedValue: string) => {
    setQuizAnswer(selectedValue);
    const isCorrect = selectedValue.toLowerCase().trim() === story.correctAnswer.toLowerCase().trim();
    if (isCorrect) {
      setShowConfetti(true);
      setVerified(true);
      addPoints(50);
      triggerFloatingPoints(50, window.innerWidth / 2, window.innerHeight / 2);
      const rarity = fillEmptySlot();
      if (rarity) {
        toast.success(`Correct! +50 MP & a ${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Film Reel earned! 🎬`, { className: 'bg-gold/20 border-gold text-gold' });
      } else {
        const lockedSlot = slots.find(s => s.type === 'locked');
        if (lockedSlot) {
          reduceSlotTime(lockedSlot.id, STORY_TIME_REDUCTION);
          toast.success('Correct! +50 MP & 30 min off your reel timer! ⏱️', { className: 'bg-gold/20 border-gold text-gold' });
        } else {
          toast.success('Correct! +50 MP earned! 🎉', { className: 'bg-gold/20 border-gold text-gold' });
        }
      }
    } else {
      toast.error("Try again! That's not quite right.", { className: 'bg-crimson/20 border-crimson text-crimson' });
      setQuizAnswer('');
    }
  };

  const progressColor = scrollProgress >= 0.9
    ? 'hsl(45 100% 55%)'
    : `hsl(${45 * scrollProgress} ${20 + 80 * scrollProgress}% ${45 + 10 * scrollProgress}%)`;

  const glowClass = meta.trendingGlow === 'gold' ? 'breathing-glow-gold' : meta.trendingGlow === 'indigo' ? 'breathing-glow-indigo' : '';

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <article className={`glass-card-gold overflow-hidden animate-slide-up ${glowClass}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img src={story.image} alt={headline} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
            {story.category || `#${story.id}`}
          </span>
          {isVibe && story.vibeScore && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
              style={{ background: `hsla(${story.vibeScore * 12}, 80%, 50%, 0.9)`, color: 'white', backdropFilter: 'blur(8px)' }}>
              🔥 Vibe {story.vibeScore}/10
            </span>
          )}
          {isBet && story.expiryDate && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1"
              style={{ background: 'hsla(0,0%,0%,0.7)', color: 'hsl(45, 100%, 55%)', backdropFilter: 'blur(8px)' }}>
              <Clock className="w-3 h-3" />Expires {new Date(story.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
          )}

          {/* Top-right badges cluster */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1"
              style={{ background: 'hsla(0,0%,0%,0.6)', color: 'hsl(0 0% 95%)', backdropFilter: 'blur(8px)' }}>
              <Clock className="w-3 h-3" />{t('news.minRead')}
            </span>

            {/* Market Active badge */}
            {meta.isMarketActive && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
                style={{ background: 'hsla(210, 100%, 55%, 0.85)', color: 'white', backdropFilter: 'blur(8px)' }}>
                <TrendingUp className="w-2.5 h-2.5" />
                Trade: ₹{meta.yesPrice}
              </span>
            )}

            {/* Live Inside badge */}
            {meta.isLiveInside && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
                style={{ background: 'hsla(0, 85%, 50%, 0.85)', color: 'white', backdropFilter: 'blur(8px)' }}>
                <Radio className="w-2.5 h-2.5" />Live Inside
              </span>
            )}

            {/* Verified badge */}
            {meta.isVerified && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shimmer-rotate"
                style={{ background: 'hsla(150, 70%, 40%, 0.85)', color: 'white', backdropFilter: 'blur(8px)' }}>
                <ShieldCheck className="w-2.5 h-2.5" />Verified
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Headline + live timestamp */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight text-foreground flex-1">{headline}</h3>
            <span className="text-[9px] font-mono font-medium whitespace-nowrap mt-1" style={{ color: 'hsl(var(--accent))' }}>
              {meta.updatedMinAgo}m ago
            </span>
          </div>

          {/* Scroll progress bar */}
          {isExpanded && (
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
              <div className="h-full rounded-full transition-all duration-200" style={{ width: `${scrollProgress * 100}%`, background: progressColor }} />
            </div>
          )}

          {!isExpanded && (
            <Button onClick={() => setIsExpanded(true)}
              className="w-full rounded-full py-5 flex items-center justify-center gap-2 text-base tracking-wider"
              style={{
                background: 'hsl(var(--gold))', color: 'hsl(0 0% 5%)',
                fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : "'Bebas Neue', sans-serif",
                fontSize: '1.15rem', fontWeight: 700, letterSpacing: lang === 'hi' ? '0.02em' : '0.08em',
                boxShadow: '0 4px 20px hsla(45, 100%, 50%, 0.4)',
              }}>
              <Swords className="w-5 h-5" />{t('news.readStory')}
            </Button>
          )}

          {isExpanded && (
            <div ref={contentRef} className="space-y-4 animate-slide-up">
              <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
              {!verified ? (
                <div className="p-4 rounded-xl bg-muted/30 border border-gold/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-gold">{t('news.spotlightQuiz')}</span>
                  </div>
                  <p className="text-foreground font-medium">{quizQuestion}</p>
                  <Select value={quizAnswer} onValueChange={handleQuizSubmit}>
                    <SelectTrigger className="w-full bg-card border-muted focus:border-gold">
                      <SelectValue placeholder={t('news.selectAnswer')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {quizOptions.map((option, index) => (
                        <SelectItem key={index} value={option} className="hover:bg-muted focus:bg-muted cursor-pointer">{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gold" />
                  <span className="text-gold font-medium">{t('news.verified')}</span>
                </div>
              )}
            </div>
          )}

          {/* Naisha AI/VFX scale bar */}
          {meta.isAI && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: 'hsl(280, 80%, 55%)' }}>
                  <Bot className="w-3 h-3" />Naisha Scale
                </span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {meta.aiRatio}% Synthetic · {100 - meta.aiRatio}% Human
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: 'hsl(var(--muted))' }}>
                <div style={{ width: `${meta.aiRatio}%`, background: 'linear-gradient(90deg, hsl(280, 80%, 55%), hsl(300, 70%, 60%))' }} className="rounded-l-full" />
                <div style={{ width: `${100 - meta.aiRatio}%`, background: 'linear-gradient(90deg, hsl(45, 100%, 50%), hsl(40, 90%, 55%))' }} className="rounded-r-full" />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {!verified && !isExpanded && (
              <Button onClick={() => setIsExpanded(true)} variant="outline"
                className="flex-1 btn-glass rounded-xl py-5 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />{t('news.verifyToEarn')}
              </Button>
            )}
            <Button onClick={() => setShowPrediction(true)}
              className={`${!verified && !isExpanded ? 'flex-1' : 'w-full'} rounded-xl py-5 flex items-center justify-center gap-2 ${hasPredicted ? 'bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30' : 'btn-gold'}`}>
              {hasPredicted ? (<><CheckCircle className="w-4 h-4" />{t('news.predicted')} {predictedOption}</>) : (<><Zap className="w-4 h-4" />{t('news.predictNow')}</>)}
            </Button>
          </div>

          {/* Sentiment Spark micro-widget */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>Sentiment</span>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${meta.sentimentPercent}%`,
                  background: meta.sentimentRising
                    ? 'linear-gradient(90deg, hsl(142, 80%, 45%), hsl(160, 70%, 50%))'
                    : 'linear-gradient(90deg, hsl(210, 70%, 50%), hsl(230, 60%, 55%))',
                }} />
            </div>
            {meta.sentimentRising
              ? <TrendingUp className="w-3 h-3" style={{ color: 'hsl(142, 80%, 45%)' }} />
              : <TrendingDown className="w-3 h-3" style={{ color: 'hsl(210, 70%, 50%)' }} />}
            <span className="text-[9px] font-mono font-bold"
              style={{ color: meta.sentimentRising ? 'hsl(142, 80%, 45%)' : 'hsl(210, 70%, 50%)' }}>
              {meta.sentimentRising ? 'Rising' : 'Cooling'}
            </span>
          </div>

          {/* Tags for vibe items */}
          {isVibe && story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {story.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                  style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          </div>
        </div>
      </article>

      <PredictionDrawer isOpen={showPrediction} onClose={() => setShowPrediction(false)}
        title={headline} shortTitle={predictionMarketQuestion} options={story.predictionMarketOptions}
        initialPrice={story.initialYesPrice}
        onPredictionConfirmed={(option) => { setHasPredicted(true); setPredictedOption(option); }} />
    </>
  );
}
