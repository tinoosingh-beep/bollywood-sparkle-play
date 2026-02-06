import { useState } from 'react';
import { CheckCircle, Zap, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useBalance } from '@/contexts/BalanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const { addPoints, triggerFloatingPoints } = useBalance();

  const handleQuizSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const isCorrect = quizAnswer.toLowerCase().trim() === story.correctAnswer.toLowerCase().trim();
    
    if (isCorrect) {
      setShowConfetti(true);
      setVerified(true);
      
      // Get position for floating points
      const form = event.target as HTMLFormElement;
      const rect = form.getBoundingClientRect();
      addPoints(50);
      triggerFloatingPoints(50, rect.left + rect.width / 2, rect.top);
      
      toast.success('Correct! +50 MP earned! 🎉', {
        className: 'bg-gold/20 border-gold text-gold',
      });
    } else {
      toast.error('Try again! That\'s not quite right.', {
        className: 'bg-crimson/20 border-crimson text-crimson',
      });
    }
  };

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
        </div>
        
        <div className="p-4 space-y-4">
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {story.headline}
          </h3>
          
          {/* Expand/Collapse Button */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-gold"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Read Full Story
              </>
            )}
          </Button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 animate-slide-up">
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
                  <form onSubmit={handleQuizSubmit} className="flex gap-2">
                    <Input
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="flex-1 bg-muted/50 border-muted focus:border-gold"
                    />
                    <Button type="submit" className="btn-gold px-4">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
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

      {/* Prediction Bottom Sheet */}
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
