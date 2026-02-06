import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface PaparazziChaseProps {
  onClose: () => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
}

export function PaparazziChase({ onClose }: PaparazziChaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(5)) return;
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setPlayerX(50);
    setObstacles([]);
  };

  const handleMove = useCallback((direction: 'left' | 'right') => {
    if (!isPlaying) return;
    setPlayerX(prev => {
      if (direction === 'left') return Math.max(10, prev - 15);
      return Math.min(90, prev + 15);
    });
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleMove('left');
      if (e.key === 'ArrowRight') handleMove('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, handleMove]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      setScore(prev => prev + 1);
      
      // Spawn obstacles
      if (Math.random() < 0.3) {
        setObstacles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 0
        }]);
      }

      // Move obstacles
      setObstacles(prev => {
        const updated = prev.map(obs => ({ ...obs, y: obs.y + 5 }))
          .filter(obs => obs.y < 100);
        
        // Check collision
        const collision = updated.some(obs => 
          obs.y > 75 && obs.y < 95 && 
          Math.abs(obs.x - playerX) < 15
        );

        if (collision) {
          setGameOver(true);
          setIsPlaying(false);
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [isPlaying, playerX]);

  useEffect(() => {
    if (gameOver && score > 50) {
      const reward = Math.min(100, Math.floor(score / 10) * 10);
      addPoints(reward);
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        triggerFloatingPoints(reward, rect.left + rect.width / 2, rect.top);
      }
    }
  }, [gameOver, score, addPoints, triggerFloatingPoints]);

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameOver && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Dodge the paparazzi cameras!</p>
          <p className="text-sm text-neon-pink">Use arrow keys or buttons to move</p>
          <Button onClick={startGame} className="btn-neon-pink">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && (
        <>
          <div className="text-center mb-2">
            <span className="text-gold font-bold text-xl">{score}m</span>
          </div>
          
          <div className="relative w-full h-64 bg-black/50 rounded-xl overflow-hidden border border-neon-pink/30">
            {/* Player */}
            <motion.div
              className="absolute bottom-4 w-8 h-8 flex items-center justify-center"
              style={{ left: `calc(${playerX}% - 16px)` }}
              animate={{ x: 0 }}
            >
              <Star className="w-8 h-8 text-gold fill-gold" />
            </motion.div>

            {/* Obstacles */}
            {obstacles.map(obs => (
              <div
                key={obs.id}
                className="absolute w-8 h-8 flex items-center justify-center"
                style={{ left: `calc(${obs.x}% - 16px)`, top: `${obs.y}%` }}
              >
                <Camera className="w-6 h-6 text-neon-pink" />
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              onPointerDown={() => handleMove('left')}
              className="btn-glass px-8"
            >
              ← Left
            </Button>
            <Button 
              onPointerDown={() => handleMove('right')}
              className="btn-glass px-8"
            >
              Right →
            </Button>
          </div>
        </>
      )}

      {gameOver && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className={`p-6 rounded-xl ${score > 50 ? 'bg-gold/10 border border-gold/30' : 'bg-neon-pink/10 border border-neon-pink/30'}`}>
            <p className="text-2xl font-display font-bold mb-2">
              {score > 50 ? '🌟 Star Escape!' : '📸 Caught!'}
            </p>
            <p className="text-muted-foreground">Distance: {score}m</p>
            {score > 50 && <p className="text-gold font-bold">+{Math.min(100, Math.floor(score / 10) * 10)} MP</p>}
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame} className="btn-neon-pink">Play Again</Button>
            <Button onClick={onClose} variant="outline">Exit</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
