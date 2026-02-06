import { useState, useEffect, useCallback } from 'react';
import { Timer, Trophy, RotateCcw } from 'lucide-react';
import { useBalance } from '@/contexts/BalanceContext';
import { Button } from '@/components/ui/button';

const celebrities = [
  { id: 1, name: 'SRK', emoji: '👑' },
  { id: 2, name: 'Deepika', emoji: '💫' },
  { id: 3, name: 'Alia', emoji: '🌟' },
  { id: 4, name: 'Ranveer', emoji: '🎭' },
  { id: 5, name: 'Priyanka', emoji: '✨' },
  { id: 6, name: 'Ranbir', emoji: '🎬' },
];

interface Card {
  id: number;
  celebId: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const { addPoints, triggerFloatingPoints } = useBalance();

  const initializeGame = useCallback(() => {
    const selectedCelebs = celebrities.slice(0, 3);
    const gameCards: Card[] = [];
    
    selectedCelebs.forEach((celeb, index) => {
      gameCards.push({ id: index * 2, celebId: celeb.id, emoji: celeb.emoji, isFlipped: false, isMatched: false });
      gameCards.push({ id: index * 2 + 1, celebId: celeb.id, emoji: celeb.emoji, isFlipped: false, isMatched: false });
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setTimeLeft(20);
    setGameOver(false);
    setWon(false);
  }, []);

  const startGame = () => {
    initializeGame();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft, gameOver]);

  useEffect(() => {
    if (matchedPairs === 3 && isPlaying) {
      setWon(true);
      setGameOver(true);
      setIsPlaying(false);
    }
  }, [matchedPairs, isPlaying]);

  const handleCardClick = (cardId: number, event: React.MouseEvent) => {
    if (!isPlaying || flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      const firstCard = cards.find((c) => c.id === flippedCards[0]);
      const secondCard = cards.find((c) => c.id === cardId);

      if (firstCard && secondCard && firstCard.celebId === secondCard.celebId) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.celebId === firstCard.celebId ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          
          const rect = event.currentTarget.getBoundingClientRect();
          addPoints(7);
          triggerFloatingPoints(7, rect.left + rect.width / 2, rect.top);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
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

  return (
    <div className="glass-card-gold p-6 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-crimson/20">
            <Trophy className="w-5 h-5 text-crimson" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Casting Couch Shuffle
            </h3>
            <p className="text-muted-foreground text-sm">Match 3 pairs in 20s • +20 MP</p>
          </div>
        </div>
        
        {isPlaying && (
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
            <Timer className="w-4 h-4 text-gold" />
            <span className={`font-bold ${timeLeft <= 5 ? 'text-crimson' : 'text-gold'}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {!isPlaying && !gameOver && (
        <Button onClick={startGame} className="w-full btn-crimson rounded-xl py-5 font-bold">
          Start Game
        </Button>
      )}

      {isPlaying && (
        <div className="grid grid-cols-3 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={(e) => handleCardClick(card.id, e)}
              className={`aspect-square rounded-xl transition-all duration-300 ${
                card.isMatched
                  ? 'bg-gold/30 border-gold scale-95'
                  : card.isFlipped
                  ? 'bg-crimson/30 border-crimson'
                  : 'bg-muted/50 border-muted hover:border-gold/50'
              } border-2 flex items-center justify-center text-4xl`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-4">
          {won ? (
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/30">
              <Trophy className="w-12 h-12 text-gold mx-auto mb-2" />
              <p className="text-gold font-bold text-xl">You Won!</p>
              <p className="text-muted-foreground">+20 MP earned</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-crimson/10 border border-crimson/30">
              <p className="text-crimson font-bold text-xl">Time's Up!</p>
              <p className="text-muted-foreground">
                Matched {matchedPairs}/3 pairs
              </p>
            </div>
          )}
          <Button
            onClick={startGame}
            className="w-full btn-glass rounded-xl py-4 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
