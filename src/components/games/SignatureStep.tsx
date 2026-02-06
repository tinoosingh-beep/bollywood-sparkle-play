import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface SignatureStepProps {
  onClose: () => void;
}

export function SignatureStep({ onClose }: SignatureStepProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [strikerPosition, setStrikerPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [result, setResult] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(5)) return;
    setIsPlaying(true);
    setGameComplete(false);
    setScore(0);
    setRound(1);
    startRound();
  };

  const startRound = () => {
    setStrikerPosition(0);
    setIsMoving(true);
    setResult(null);
  };

  useEffect(() => {
    if (!isMoving) return;

    let direction = 1;
    let position = 0;

    const interval = setInterval(() => {
      position += direction * 2;
      
      if (position >= 100) {
        direction = -1;
      } else if (position <= 0) {
        direction = 1;
      }
      
      setStrikerPosition(position);
    }, 20);

    return () => clearInterval(interval);
  }, [isMoving]);

  const handleStop = () => {
    setIsMoving(false);

    // Gold zone is 45-55 (middle 10%)
    const inGoldZone = strikerPosition >= 45 && strikerPosition <= 55;
    const inGoodZone = strikerPosition >= 35 && strikerPosition <= 65;

    let roundScore = 0;
    if (inGoldZone) {
      setResult('perfect');
      roundScore = 30;
    } else if (inGoodZone) {
      setResult('good');
      roundScore = 15;
    } else {
      setResult('miss');
      roundScore = 0;
    }

    setScore(prev => prev + roundScore);

    // Next round after delay
    setTimeout(() => {
      if (round >= 3) {
        setIsPlaying(false);
        setGameComplete(true);
      } else {
        setRound(prev => prev + 1);
        startRound();
      }
    }, 1500);
  };

  useEffect(() => {
    if (gameComplete && score > 0) {
      addPoints(score);
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        triggerFloatingPoints(score, rect.left + rect.width / 2, rect.top);
      }
    }
  }, [gameComplete, score, addPoints, triggerFloatingPoints]);

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Stop in the Gold Zone for max points!</p>
          <p className="text-sm text-gold">3 attempts • Timing is everything</p>
          <Button onClick={startGame} className="btn-gold">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && (
        <div className="space-y-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Round {round}/3</span>
            <span className="text-gold font-bold">Score: {score} MP</span>
          </div>

          {/* Strike bar */}
          <div className="relative h-16 rounded-xl overflow-hidden bg-muted/30 border border-muted">
            {/* Zones */}
            <div className="absolute inset-y-0 left-0 right-0 flex">
              <div className="flex-1 bg-neon-pink/20" />
              <div className="w-[10%] bg-gold/20" /> {/* 35-45 */}
              <div className="w-[10%] bg-gold/50" /> {/* 45-55 Gold Zone */}
              <div className="w-[10%] bg-gold/20" /> {/* 55-65 */}
              <div className="flex-1 bg-neon-pink/20" />
            </div>

            {/* Gold zone indicator */}
            <div 
              className="absolute top-0 bottom-0 w-[10%] left-[45%] border-2 border-gold border-dashed flex items-center justify-center"
            >
              <span className="text-gold text-xs font-bold">GOLD</span>
            </div>

            {/* Striker */}
            <motion.div
              className="absolute top-1 bottom-1 w-2 bg-white rounded-full shadow-lg"
              style={{ left: `calc(${strikerPosition}% - 4px)` }}
            />
          </div>

          {/* Stop button */}
          {isMoving && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="w-full py-6 rounded-xl bg-gradient-to-br from-neon-pink to-crimson text-white font-bold text-xl"
            >
              <Target className="w-8 h-8 mx-auto mb-1" />
              STOP!
            </motion.button>
          )}

          {/* Result display */}
          {result && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-center p-4 rounded-xl ${
                result === 'perfect' ? 'bg-gold/20 text-gold' :
                result === 'good' ? 'bg-neon-cyan/20 text-neon-cyan' :
                'bg-neon-pink/20 text-neon-pink'
              }`}
            >
              <p className="font-bold text-xl">
                {result === 'perfect' ? '🌟 PERFECT! +30' :
                 result === 'good' ? '👍 Good! +15' :
                 '❌ Missed!'}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {gameComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className={`p-6 rounded-xl ${score > 50 ? 'bg-gold/10 border border-gold/30' : 'bg-muted/30 border border-muted'}`}>
            <Target className="w-12 h-12 text-gold mx-auto mb-2" />
            <p className="text-2xl font-display font-bold mb-2">
              {score >= 60 ? 'Dance Master!' : score >= 30 ? 'Nice Moves!' : 'Keep Practicing!'}
            </p>
            <p className="text-gold font-bold text-xl">+{score} MP</p>
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
