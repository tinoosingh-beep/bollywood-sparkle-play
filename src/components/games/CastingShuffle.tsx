import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface CastingShuffleProps {
  onClose: () => void;
}

const celebrities = ['👑', '💫', '🌟', '🎭', '✨', '🎬', '🎪', '🎯'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function CastingShuffle({ onClose }: CastingShuffleProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const initializeGame = () => {
    const gameCards: Card[] = [];
    celebrities.forEach((emoji, index) => {
      gameCards.push({ id: index * 2, emoji, isFlipped: false, isMatched: false });
      gameCards.push({ id: index * 2 + 1, emoji, isFlipped: false, isMatched: false });
    });

    // Shuffle
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
  };

  const startGame = () => {
    if (!deductPoints(5)) return;
    initializeGame();
    setIsPlaying(true);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = cards.find(c => c.id === cardId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.emoji === firstCard.emoji ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              flippedCards.includes(c.id) || c.id === cardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === 8 && isPlaying) {
      setIsPlaying(false);
      const reward = moves <= 12 ? 100 : moves <= 16 ? 50 : 20;
      addPoints(reward);
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        triggerFloatingPoints(reward, rect.left + rect.width / 2, rect.top);
      }
    }
  }, [matchedPairs, isPlaying, moves, addPoints, triggerFloatingPoints]);

  const gameComplete = matchedPairs === 8;

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Match all 8 pairs!</p>
          <p className="text-sm text-neon-cyan">Fewer moves = bigger reward</p>
          <Button onClick={startGame} className="btn-neon-cyan">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && (
        <>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Pairs: {matchedPairs}/8</span>
            <span className="text-gold font-bold">Moves: {moves}</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {cards.map(card => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-xl transition-all duration-300 text-2xl flex items-center justify-center ${
                  card.isMatched
                    ? 'bg-gold/30 border-2 border-gold'
                    : card.isFlipped
                    ? 'bg-neon-cyan/30 border-2 border-neon-cyan'
                    : 'bg-muted/50 border-2 border-muted hover:border-neon-cyan/50'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
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
          <div className="p-6 rounded-xl bg-gold/10 border border-gold/30">
            <p className="text-2xl font-display font-bold mb-2">🎬 Cast Complete!</p>
            <p className="text-muted-foreground">Moves: {moves}</p>
            <p className="text-gold font-bold">+{moves <= 12 ? 100 : moves <= 16 ? 50 : 20} MP</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame} className="btn-neon-cyan">Play Again</Button>
            <Button onClick={onClose} variant="outline">Exit</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
