import { useState, useRef, useEffect } from 'react';
import { CheckCircle, Zap, Clock, Swords } from 'lucide-react';
import { useBalance } from '@/contexts/BalanceContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PredictionDrawer } from '@/components/PredictionDrawer';
import { Confetti } from '@/components/Confetti';
import { toast } from 'sonner';
import type { NewsStory } from '@/data/newsContent';

interface NewsCardProps {
  story: NewsStory;
}

export function NewsCard({ story }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [verified, setVerified] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { addPoints, triggerFloatingPoints } = useBalance();
  const contentRef = useRef<HTMLDivElement>(null);

  const quizOptions = story.quizOptions || [story.correctAnswer, 'Option A', 'Option B', 'Option C'];

  // Scroll progress tracker
  useEffect(() => {
    if (!isExpanded || !contentRef.current) return;

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalH = el.scrollHeight;
      // How much of the element has scrolled past the top of the viewport
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
      toast.success('Correct! +50 MP earned! 🎉', {
        className: 'bg-gold/20 border-gold text-gold',
      });
    } else {
      toast.error('Try again! That\'s not quite right.', {
        className: 'bg-crimson/20 border-crimson text-crimson',
      });
      setQuizAnswer('');
    }
  };

  const progressColor = scrollProgress >= 0.9
    ? 'hsl(45 100% 55%)'
    : `hsl(${45 * scrollProgress} ${20 + 80 * scrollProgress}% ${45 + 10 * scrollProgress}%)`;

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <article className="glass-card-gold overflow-hidden animate-slide-up">
        <div className="relative h-48 overflow-hidden">
          <img
            src={story.image}
            alt={story.headline}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
            #{story.id}
          </span>
          {/* Reading time badge */}
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1"
            style={{
              background: 'hsla(0, 0%, 0%, 0.6)',
              color: 'hsl(0 0% 95%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Clock className="w-3 h-3" />
            2 min read
          </span>
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {story.headline}
          </h3>

          {/* Scroll progress bar (visible when expanded) */}
          {isExpanded && (
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${scrollProgress * 100}%`,
                  background: progressColor,
                }}
              />
            </div>
          )}

          {/* ENTER THE STORY button */}
          {!isExpanded && (
            <Button
              onClick={() => setIsExpanded(true)}
              className="w-full btn-gold rounded-full py-5 flex items-center justify-center gap-2 text-base font-bold"
            >
              <Swords className="w-5 h-5" />
              ENTER THE STORY
            </Button>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div ref={contentRef} className="space-y-4 animate-slide-up">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {story.summary}
              </p>

              {/* Quiz Section */}
              {!verified ? (
                <div className="p-4 rounded-xl bg-muted/30 border border-gold/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-gold">Spotlight Quiz • +50 MP</span>
                  </div>
                  <p className="text-foreground font-medium">{story.quizQuestion}</p>
                  <Select 
                    value={quizAnswer} 
                    onValueChange={handleQuizSubmit}
                  >
                    <SelectTrigger className="w-full bg-card border-muted focus:border-gold">
                      <SelectValue placeholder="Select your answer..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {quizOptions.map((option, index) => (
                        <SelectItem 
                          key={index} 
                          value={option}
                          className="hover:bg-muted focus:bg-muted cursor-pointer"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gold" />
                  <span className="text-gold font-medium">Verified! +50 MP earned</span>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            {!verified && !isExpanded && (
              <Button
                onClick={() => setIsExpanded(true)}
                variant="outline"
                className="flex-1 btn-glass rounded-xl py-5 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Verify to Earn
              </Button>
            )}
            
            <Button
              onClick={() => setShowPrediction(true)}
              className={`${!verified && !isExpanded ? 'flex-1' : 'w-full'} btn-gold rounded-xl py-5 flex items-center justify-center gap-2`}
            >
              <Zap className="w-4 h-4" />
              Predict Now
            </Button>
          </div>
        </div>
      </article>

      <PredictionDrawer
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        title={story.headline}
        shortTitle={story.predictionMarketQuestion}
        options={story.predictionMarketOptions}
        initialPrice={story.initialYesPrice}
      />
    </>
  );
}
