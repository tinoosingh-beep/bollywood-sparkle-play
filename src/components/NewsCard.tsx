import { useState } from 'react';
import { CheckCircle, Zap } from 'lucide-react';
import { useBalance } from '@/contexts/BalanceContext';
import { Button } from '@/components/ui/button';
import { PredictionDrawer } from '@/components/PredictionDrawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NewsCardProps {
  title: string;
  image: string;
  category: string;
  shortTitle: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export function NewsCard({ title, image, category, shortTitle, quiz }: NewsCardProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { addPoints, triggerFloatingPoints } = useBalance();

  const handleOptionSelect = (index: number, event: React.MouseEvent) => {
    setSelectedOption(index);
    setShowResult(true);
    
    if (index === quiz.correctIndex) {
      const rect = event.currentTarget.getBoundingClientRect();
      addPoints(50);
      triggerFloatingPoints(50, rect.left + rect.width / 2, rect.top);
      
      setTimeout(() => {
        setVerified(true);
        setShowQuiz(false);
      }, 1500);
    }
  };

  return (
    <>
      <article className="glass-card-gold overflow-hidden animate-slide-up">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
            {category}
          </span>
        </div>
        
        <div className="p-4 space-y-4">
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {title}
          </h3>
          
          <div className="flex gap-3">
            {verified ? (
              <div className="flex items-center gap-2 text-gold flex-1">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Verified • +50 MP</span>
              </div>
            ) : (
              <Button
                onClick={() => setShowQuiz(true)}
                variant="outline"
                className="flex-1 btn-glass rounded-xl py-5 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Verify
              </Button>
            )}
            
            <Button
              onClick={() => setShowPrediction(true)}
              className="flex-1 btn-gold rounded-xl py-5 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Predict
            </Button>
          </div>
        </div>
      </article>

      {/* Quiz Modal */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="glass-card border-gold/40 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-gold">
              Quick Quiz
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <p className="text-foreground font-medium">{quiz.question}</p>
            
            <div className="space-y-3">
              {quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={(e) => !showResult && handleOptionSelect(index, e)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    showResult
                      ? index === quiz.correctIndex
                        ? 'bg-green-500/20 border-green-500'
                        : selectedOption === index
                        ? 'bg-red-500/20 border-red-500'
                        : 'bg-muted/50 border-muted'
                      : 'bg-muted/50 border-muted hover:border-primary/60 hover:bg-muted'
                  } border`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {showResult && selectedOption !== quiz.correctIndex && (
              <p className="text-secondary text-center font-medium">
                Incorrect! Try another article.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Prediction Bottom Sheet */}
      <PredictionDrawer
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        title={title}
        shortTitle={shortTitle}
      />
    </>
  );
}
