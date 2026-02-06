import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface RedCarpetRankerProps {
  onClose: () => void;
}

const looks = [
  { id: 1, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format', name: 'Look A' },
  { id: 2, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format', name: 'Look B' },
  { id: 3, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format', name: 'Look C' },
  { id: 4, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format', name: 'Look D' },
];

export function RedCarpetRanker({ onClose }: RedCarpetRankerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPair, setCurrentPair] = useState<[typeof looks[0], typeof looks[0]] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [votes, setVotes] = useState({ left: 0, right: 0 });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const getRandomPair = () => {
    const shuffled = [...looks].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]] as [typeof looks[0], typeof looks[0]];
  };

  const startGame = () => {
    if (!deductPoints(5)) return;
    setCurrentPair(getRandomPair());
    setSelectedId(null);
    setShowResult(false);
    setRound(1);
    setScore(0);
    setIsPlaying(true);
  };

  const handleVote = (id: number, isLeft: boolean) => {
    setSelectedId(id);
    
    // Simulate community votes
    const leftVotes = Math.floor(Math.random() * 100);
    const rightVotes = 100 - leftVotes;
    setVotes({ left: leftVotes, right: rightVotes });
    
    setShowResult(true);

    // Check if user picked the majority
    const userPickedMajority = (isLeft && leftVotes > 50) || (!isLeft && rightVotes > 50);
    if (userPickedMajority) {
      setScore(prev => prev + 20);
    }
  };

  const nextRound = () => {
    if (round >= 5) {
      // Game complete
      setIsPlaying(false);
      addPoints(score);
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        triggerFloatingPoints(score, rect.left + rect.width / 2, rect.top);
      }
      return;
    }

    setCurrentPair(getRandomPair());
    setSelectedId(null);
    setShowResult(false);
    setRound(prev => prev + 1);
  };

  const gameComplete = !isPlaying && round >= 5;

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Vote with the majority to earn points!</p>
          <p className="text-sm text-gold">5 rounds • Match community taste</p>
          <Button onClick={startGame} className="btn-gold">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && currentPair && (
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Round {round}/5</span>
            <span className="text-gold font-bold">Score: {score} MP</span>
          </div>

          <p className="text-center text-foreground font-medium">Who wore it better?</p>

          {/* Two images side by side */}
          <div className="grid grid-cols-2 gap-3">
            {currentPair.map((look, index) => (
              <motion.button
                key={look.id}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => !showResult && handleVote(look.id, index === 0)}
                disabled={showResult}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  selectedId === look.id
                    ? 'border-gold'
                    : 'border-muted hover:border-gold/50'
                }`}
              >
                <img
                  src={look.image}
                  alt={look.name}
                  className="w-full aspect-[3/4] object-cover"
                />
                
                {/* Vote percentage overlay */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gold">
                        {index === 0 ? votes.left : votes.right}%
                      </p>
                      {selectedId === look.id && (
                        <Crown className="w-6 h-6 text-gold mx-auto mt-2" />
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {showResult && (
            <Button onClick={nextRound} className="w-full btn-gold">
              {round >= 5 ? 'See Results' : 'Next Round'}
            </Button>
          )}
        </div>
      )}

      {gameComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="p-6 rounded-xl bg-gold/10 border border-gold/30">
            <Crown className="w-12 h-12 text-gold mx-auto mb-2" />
            <p className="text-2xl font-display font-bold mb-2">Fashion Critic!</p>
            <p className="text-muted-foreground">Final Score</p>
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
