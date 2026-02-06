import { useState } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useBalance } from '@/contexts/BalanceContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PredictionMarketProps {
  title: string;
  optionA: string;
  optionB: string;
  oddsA: number;
  oddsB: number;
}

export function PredictionMarket({ title, optionA, optionB, oddsA, oddsB }: PredictionMarketProps) {
  const [stake, setStake] = useState(10);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [hasPlaced, setHasPlaced] = useState(false);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const potentialReturnA = Math.round(stake * oddsA);
  const potentialReturnB = Math.round(stake * oddsB);

  const handlePlaceBet = (event: React.MouseEvent) => {
    if (!selectedOption || hasPlaced) return;
    
    if (deductPoints(stake)) {
      setHasPlaced(true);
      const rect = event.currentTarget.getBoundingClientRect();
      
      // Simulate a win for demo purposes (50% chance)
      if (Math.random() > 0.5) {
        const winAmount = selectedOption === 'A' ? potentialReturnA : potentialReturnB;
        setTimeout(() => {
          addPoints(winAmount);
          triggerFloatingPoints(winAmount, rect.left + rect.width / 2, rect.top);
        }, 1000);
      }
    }
  };

  return (
    <div className="glass-card-gold p-5 space-y-5 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <Zap className="w-5 h-5 text-gold" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground flex-1">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSelectedOption('A')}
          disabled={hasPlaced}
          className={`p-4 rounded-xl border transition-all duration-300 ${
            selectedOption === 'A'
              ? 'border-gold bg-primary/20 glow-gold'
              : 'border-muted bg-muted/30 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-accent font-semibold">{oddsA}x</span>
          </div>
          <p className="text-foreground font-medium text-sm">{optionA}</p>
        </button>

        <button
          onClick={() => setSelectedOption('B')}
          disabled={hasPlaced}
          className={`p-4 rounded-xl border transition-all duration-300 ${
            selectedOption === 'B'
              ? 'border-secondary bg-secondary/20 glow-crimson'
              : 'border-muted bg-muted/30 hover:border-secondary/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold">{oddsB}x</span>
          </div>
          <p className="text-foreground font-medium text-sm">{optionB}</p>
        </button>
      </div>

      {!hasPlaced && (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Stake Amount</span>
              <span className="text-gold font-bold">{stake} MP</span>
            </div>
            <Slider
              value={[stake]}
              onValueChange={(value) => setStake(value[0])}
              min={10}
              max={200}
              step={10}
              className="w-full"
            />
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Potential Return</span>
              <span className="text-gold font-bold text-xl">
                {selectedOption === 'A' 
                  ? potentialReturnA 
                  : selectedOption === 'B' 
                  ? potentialReturnB 
                  : '—'} MP
              </span>
            </div>
          </div>

          <Button
            onClick={handlePlaceBet}
            disabled={!selectedOption}
            className="w-full btn-gold rounded-xl py-5 font-bold"
          >
            Place Prediction
          </Button>
        </>
      )}

      {hasPlaced && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
          <p className="text-gold font-medium">Prediction Placed!</p>
          <p className="text-muted-foreground text-sm mt-1">
            Waiting for result...
          </p>
        </div>
      )}
    </div>
  );
}
