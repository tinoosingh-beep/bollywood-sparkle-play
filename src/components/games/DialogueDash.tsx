import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface DialogueDashProps {
  onClose: () => void;
}

const dialogues = [
  'KUTTE KAMINE',
  'MOGAMBO KHUSH HUA',
  'DON KO PAKADNA',
  'AAJ MERE PAAS',
  'KITNE AADMI THE',
  'PUSHPA I HATE TEARS',
  'THAPPAD SE DARR',
  'JAI HO',
];

export function DialogueDash({ onClose }: DialogueDashProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userArrangement, setUserArrangement] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(5)) return;
    const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    setCurrentDialogue(dialogue);
    
    const letters = dialogue.split('');
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
    setUserArrangement([]);
    setIsPlaying(true);
    setGameComplete(false);
    setIsWin(false);
  };

  const handleLetterClick = (letter: string, index: number) => {
    setUserArrangement(prev => [...prev, letter]);
    setScrambledLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index: number) => {
    const letter = userArrangement[index];
    setScrambledLetters(prev => [...prev, letter]);
    setUserArrangement(prev => prev.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const answer = userArrangement.join('');
    const win = answer === currentDialogue;
    setIsWin(win);
    setGameComplete(true);
    setIsPlaying(false);

    if (win) {
      addPoints(50);
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        triggerFloatingPoints(50, rect.left + rect.width / 2, rect.top);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && scrambledLetters.length === 0 && userArrangement.length > 0) {
      checkAnswer();
    }
  }, [scrambledLetters, userArrangement, isPlaying]);

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Unscramble the famous dialogue!</p>
          <p className="text-sm text-gold">Drag letters to form the correct phrase</p>
          <Button onClick={startGame} className="btn-gold">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && (
        <>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">Arrange the letters:</p>
          </div>

          {/* User arrangement area */}
          <div className="min-h-16 p-3 rounded-xl bg-muted/30 border-2 border-dashed border-gold/50 flex flex-wrap gap-1 justify-center">
            {userArrangement.map((letter, index) => (
              <motion.button
                key={`user-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => handleRemoveLetter(index)}
                className="w-8 h-10 rounded-lg bg-gold text-primary-foreground font-bold text-sm flex items-center justify-center"
              >
                {letter}
              </motion.button>
            ))}
          </div>

          {/* Scrambled letters */}
          <div className="flex flex-wrap gap-1 justify-center">
            {scrambledLetters.map((letter, index) => (
              <motion.button
                key={`scramble-${index}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLetterClick(letter, index)}
                className="w-8 h-10 rounded-lg bg-muted border border-muted-foreground/30 text-foreground font-bold text-sm flex items-center justify-center hover:border-gold transition-colors"
              >
                {letter}
              </motion.button>
            ))}
          </div>
        </>
      )}

      {gameComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className={`p-6 rounded-xl ${isWin ? 'bg-gold/10 border border-gold/30' : 'bg-neon-pink/10 border border-neon-pink/30'}`}>
            <p className="text-2xl font-display font-bold mb-2">
              {isWin ? '🎬 Superhit!' : '💔 Flop!'}
            </p>
            <p className="text-muted-foreground text-sm">"{currentDialogue}"</p>
            {isWin && <p className="text-gold font-bold mt-2">+50 MP</p>}
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
