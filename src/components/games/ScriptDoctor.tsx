import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';
  onClose: () => void;
}

const scenarios = [
  {
    prompt: 'The hero discovers the villain is...',
    options: ['His twin brother', 'A robot', 'His own future self'],
    correct: 0,
  },
  {
    prompt: 'For the climax song, the location should be...',
    options: ['Swiss Alps', 'Desert ruins', 'Mumbai streets'],
    correct: 2,
  },
  {
    prompt: 'The comic relief character should be a...',
    options: ['Bumbling detective', 'Sarcastic AI assistant', 'Wise-cracking sidekick'],
    correct: 2,
  },
  {
    prompt: 'The romantic interest enters the story by...',
    options: ['Saving the hero', 'Being rescued', 'A chance meeting'],
    correct: 0,
  },
  {
    prompt: 'The movie should end with...',
    options: ['A twist sequel setup', 'A happy wedding', 'An open-ended question'],
    correct: 1,
  },
];

export function ScriptDoctor({ onClose }: ScriptDoctorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<typeof scenarios[0] | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(5)) return;
    setIsPlaying(true);
    setGameComplete(false);
    setScore(0);
    setRound(1);
    setCurrentScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleSelect = (index: number) => {
    if (showResult) return;
    
    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = index === currentScenario?.correct;
    if (isCorrect) {
      setScore(prev => prev + 25);
    }

    setTimeout(() => {
      if (round >= 4) {
        setIsPlaying(false);
        setGameComplete(true);
      } else {
        setRound(prev => prev + 1);
        const usedIndices = new Set();
        let newScenario;
        do {
          newScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        } while (newScenario === currentScenario);
        setCurrentScenario(newScenario);
        setSelectedOption(null);
        setShowResult(false);
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
  }, [gameComplete, score]);

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Make the right story choices!</p>
          <p className="text-sm text-neon-pink">4 rounds • Pick the superhit option</p>
          <Button onClick={startGame} className="btn-neon-pink">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && currentScenario && (
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Round {round}/4</span>
            <span className="text-gold font-bold">Score: {score} MP</span>
          </div>

          {/* Story card */}
          <div className="p-5 rounded-xl bg-muted/30 border border-neon-pink/30">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-neon-pink" />
              <span className="text-neon-pink font-medium">Story Prompt</span>
            </div>
            <p className="text-foreground font-medium text-lg">{currentScenario.prompt}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentScenario.options.map((option, index) => {
              const isCorrect = index === currentScenario.correct;
              const isSelected = selectedOption === index;
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: showResult ? 1 : 1.02 }}
                  whileTap={{ scale: showResult ? 1 : 0.98 }}
                  onClick={() => handleSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    showResult
                      ? isCorrect
                        ? 'bg-gold/20 border-gold'
                        : isSelected
                        ? 'bg-neon-pink/20 border-neon-pink'
                        : 'bg-muted/30 border-muted'
                      : 'bg-muted/30 border-muted hover:border-neon-pink/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">{option}</span>
                    {showResult && isCorrect && (
                      <Sparkles className="w-5 h-5 text-gold" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className={`font-bold ${selectedOption === currentScenario.correct ? 'text-gold' : 'text-neon-pink'}`}>
                {selectedOption === currentScenario.correct ? '🎬 Superhit choice!' : '📉 Flop...'}
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
          <div className={`p-6 rounded-xl ${score >= 75 ? 'bg-gold/10 border border-gold/30' : 'bg-muted/30 border border-muted'}`}>
            <FileText className="w-12 h-12 text-gold mx-auto mb-2" />
            <p className="text-2xl font-display font-bold mb-2">
              {score >= 75 ? 'Script Genius!' : score >= 50 ? 'Good Writer!' : 'Keep Writing!'}
            </p>
            <p className="text-gold font-bold text-xl">+{score} MP</p>
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

// Add missing import
import { useEffect } from 'react';
