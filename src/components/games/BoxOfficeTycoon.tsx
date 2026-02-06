import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Ticket, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface BoxOfficeTycoonProps {
  onClose: () => void;
}

export function BoxOfficeTycoon({ onClose }: BoxOfficeTycoonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sales, setSales] = useState(0);
  const [autoSellLevel, setAutoSellLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const { balance, deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(5)) return;
    setIsPlaying(true);
    setSales(0);
    setAutoSellLevel(0);
    setTimeLeft(30);
    setGameComplete(false);
  };

  const handleClick = () => {
    if (!isPlaying) return;
    setSales(prev => prev + 1);
  };

  const buyUpgrade = () => {
    if (sales >= 100) {
      setSales(prev => prev - 100);
      setAutoSellLevel(prev => prev + 1);
    }
  };

  // Auto-sell timer
  useEffect(() => {
    if (!isPlaying || autoSellLevel === 0) return;

    const interval = setInterval(() => {
      setSales(prev => prev + autoSellLevel);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, autoSellLevel]);

  // Game timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Calculate reward on game complete
  useEffect(() => {
    if (gameComplete) {
      const reward = Math.min(100, Math.floor(sales / 10));
      if (reward > 0) {
        addPoints(reward);
        if (gameRef.current) {
          const rect = gameRef.current.getBoundingClientRect();
          triggerFloatingPoints(reward, rect.left + rect.width / 2, rect.top);
        }
      }
    }
  }, [gameComplete, sales, addPoints, triggerFloatingPoints]);

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Sell tickets to maximize box office!</p>
          <p className="text-sm text-gold">Upgrade to auto-sell for passive income</p>
          <Button onClick={startGame} className="btn-gold">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Time: {timeLeft}s</span>
            <span className="text-gold font-bold">Sales: ₹{sales}Cr</span>
          </div>

          {/* Main clicker */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="w-full aspect-square max-w-48 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-glow flex flex-col items-center justify-center gap-2 shadow-gold"
          >
            <Ticket className="w-16 h-16 text-primary-foreground" />
            <span className="text-primary-foreground font-bold">TAP!</span>
          </motion.button>

          {/* Stats and upgrade */}
          <div className="flex gap-3">
            <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-muted text-center">
              <TrendingUp className="w-5 h-5 mx-auto text-neon-cyan mb-1" />
              <p className="text-xs text-muted-foreground">Auto-Sell</p>
              <p className="text-gold font-bold">+{autoSellLevel}/sec</p>
            </div>
            
            <Button
              onClick={buyUpgrade}
              disabled={sales < 100}
              className="flex-1 btn-neon-cyan flex-col h-auto py-3"
            >
              <Zap className="w-5 h-5 mb-1" />
              <span className="text-xs">Upgrade</span>
              <span className="text-xs opacity-70">100 Sales</span>
            </Button>
          </div>
        </div>
      )}

      {gameComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="p-6 rounded-xl bg-gold/10 border border-gold/30">
            <p className="text-2xl font-display font-bold mb-2">🎟️ Wrap!</p>
            <p className="text-muted-foreground">Total Sales: ₹{sales}Cr</p>
            <p className="text-gold font-bold">+{Math.min(100, Math.floor(sales / 10))} MP</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame} className="btn-gold">Play Again</Button>
            <Button onClick={onClose} variant="outline">Exit</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
