import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { useBalance } from '@/contexts/BalanceContext';
import { Slider } from '@/components/ui/slider';

interface PredictionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shortTitle: string;
}

export function PredictionDrawer({ isOpen, onClose, title, shortTitle }: PredictionDrawerProps) {
  const [selectedOption, setSelectedOption] = useState<'superhit' | 'flop' | null>(null);
  const [stake, setStake] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const { balance, deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const potentialPayout = Math.round(stake * 1.85);

  // Trigger pulse animation when stake changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [stake]);

  const handleConfirm = (event: React.MouseEvent) => {
    if (!selectedOption || hasConfirmed) return;
    
    if (deductPoints(stake)) {
      setHasConfirmed(true);
      const rect = event.currentTarget.getBoundingClientRect();
      
      // Simulate win (demo - 50% chance)
      setTimeout(() => {
        if (Math.random() > 0.5) {
          addPoints(potentialPayout);
          triggerFloatingPoints(potentialPayout, rect.left + rect.width / 2, rect.top - 100);
        }
        setTimeout(() => {
          onClose();
          // Reset state after close
          setTimeout(() => {
            setSelectedOption(null);
            setStake(50);
            setHasConfirmed(false);
          }, 300);
        }, 1500);
      }, 1000);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state after close
      setTimeout(() => {
        setSelectedOption(null);
        setStake(50);
        setHasConfirmed(false);
      }, 300);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="prediction-drawer h-[60vh] border-t-2 border-gold bg-transparent">
        <div className="prediction-drawer-inner h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{shortTitle}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{title}</p>
              </div>
            </div>
            <DrawerClose asChild>
              <button className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </DrawerClose>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 space-y-6 overflow-y-auto">
            {/* Segmented Control */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-medium">Your Prediction</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedOption('superhit')}
                  disabled={hasConfirmed}
                  className={`prediction-option-btn ${
                    selectedOption === 'superhit' 
                      ? 'prediction-option-superhit-active' 
                      : 'prediction-option-inactive'
                  }`}
                >
                  <TrendingUp className={`w-5 h-5 ${selectedOption === 'superhit' ? 'text-primary-foreground' : 'text-accent'}`} />
                  <span className="font-bold">SUPERHIT</span>
                </button>

                <button
                  onClick={() => setSelectedOption('flop')}
                  disabled={hasConfirmed}
                  className={`prediction-option-btn ${
                    selectedOption === 'flop' 
                      ? 'prediction-option-flop-active' 
                      : 'prediction-option-inactive'
                  }`}
                >
                  <TrendingDown className={`w-5 h-5 ${selectedOption === 'flop' ? 'text-secondary-foreground' : 'text-secondary'}`} />
                  <span className="font-bold">FLOP</span>
                </button>
              </div>
            </div>

            {/* Trading Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground font-medium">Stake Amount</p>
                <div className={`transition-all duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
                  <span className={`text-2xl font-bold text-gold ${isAnimating ? 'animate-pulse' : ''}`}>
                    {stake}
                  </span>
                  <span className="text-gold font-medium ml-1">MP</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Slider
                  value={[stake]}
                  onValueChange={(value) => setStake(value[0])}
                  min={10}
                  max={Math.min(500, balance)}
                  step={10}
                  disabled={hasConfirmed}
                  className="prediction-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 MP</span>
                  <span>Balance: {balance} MP</span>
                  <span>{Math.min(500, balance)} MP</span>
                </div>
              </div>
            </div>

            {/* Live Payout Calculation */}
            <div className="payout-box p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Potential Payout</p>
                  <p className="text-xs text-muted-foreground/70">1.85x multiplier</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-display font-bold text-gold transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                    {potentialPayout}
                  </p>
                  <p className="text-xs text-gold/70">Masala Points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 border-t border-primary/20">
            {hasConfirmed ? (
              <div className="confirm-btn-success py-4 rounded-xl text-center">
                <p className="font-bold text-primary-foreground">Prediction Confirmed! 🎬</p>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!selectedOption || stake > balance}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  selectedOption && stake <= balance
                    ? 'confirm-btn-active'
                    : 'confirm-btn-disabled'
                }`}
              >
                {stake > balance ? 'Insufficient Balance' : 'Confirm Prediction'}
              </button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
