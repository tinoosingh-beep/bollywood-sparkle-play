import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useBalance } from '@/contexts/BalanceContext';

interface MysteryTrailerProps {
  onClose: () => void;
}

const movies = [
  { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format', title: 'Pathaan' },
  { image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format', title: 'Animal' },
  { image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&auto=format', title: 'Jawan' },
  { image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format', title: 'Dunki' },
];

export function MysteryTrailer({ onClose }: MysteryTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<typeof movies[0] | null>(null);
  const [blur, setBlur] = useState(20);
  const [guess, setGuess] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(5)) return;
    const movie = movies[Math.floor(Math.random() * movies.length)];
    setCurrentMovie(movie);
    setBlur(20);
    setGuess('');
    setIsPlaying(true);
    setGameComplete(false);
    setIsWin(false);
    setScore(100);
  };

  const handleBlurChange = (value: number[]) => {
    setBlur(value[0]);
    // Score decreases as blur decreases
    setScore(Math.max(10, Math.floor(value[0] * 5)));
  };

  const handleGuess = () => {
    if (!currentMovie) return;
    
    const win = guess.toLowerCase().trim() === currentMovie.title.toLowerCase();
    setIsWin(win);
    setGameComplete(true);
    setIsPlaying(false);

    if (win) {
      addPoints(score);
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        triggerFloatingPoints(score, rect.left + rect.width / 2, rect.top);
      }
    }
  };

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Guess the movie with minimal reveals!</p>
          <p className="text-sm text-neon-pink">Less blur = less points!</p>
          <Button onClick={startGame} className="btn-neon-pink">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && currentMovie && (
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-gold font-bold">Potential: {score} MP</span>
          </div>

          {/* Blurred image */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={currentMovie.image}
              alt="Mystery movie"
              className="w-full aspect-video object-cover"
              style={{ filter: `blur(${blur}px)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className="w-12 h-12 text-white/50" />
            </div>
          </div>

          {/* Blur slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reveal</span>
              <span className="text-neon-pink">{Math.round((1 - blur / 20) * 100)}%</span>
            </div>
            <Slider
              value={[blur]}
              onValueChange={handleBlurChange}
              min={0}
              max={20}
              step={1}
              className="mystery-slider"
            />
          </div>

          {/* Guess input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter movie name..."
              className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-muted focus:border-neon-pink outline-none text-foreground"
            />
            <Button onClick={handleGuess} className="btn-neon-pink px-6">
              Guess
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
          <div className={`p-6 rounded-xl ${isWin ? 'bg-gold/10 border border-gold/30' : 'bg-neon-pink/10 border border-neon-pink/30'}`}>
            <p className="text-2xl font-display font-bold mb-2">
              {isWin ? '🎬 Correct!' : '❌ Wrong!'}
            </p>
            <p className="text-muted-foreground">It was: {currentMovie?.title}</p>
            {isWin && <p className="text-gold font-bold mt-2">+{score} MP</p>}
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
