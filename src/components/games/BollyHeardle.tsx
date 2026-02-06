import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface BollyHeardleProps {
  onClose: () => void;
}

const songs = [
  { title: 'Chaiyya Chaiyya', hint: 'Train-top dance' },
  { title: 'Tujhe Dekha Toh', hint: 'DDLJ classic' },
  { title: 'Kal Ho Naa Ho', hint: 'SRK emotional' },
  { title: 'Kajra Re', hint: 'Bunty Aur Babli' },
  { title: 'Rang De Basanti', hint: 'Patriotic anthem' },
  { title: 'Dil Se Re', hint: 'Rahman magic' },
];

export function BollyHeardle({ onClose }: BollyHeardleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<typeof songs[0] | null>(null);
  const [progress, setProgress] = useState(0);
  const [guess, setGuess] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(5)) return;
    const song = songs[Math.floor(Math.random() * songs.length)];
    setCurrentSong(song);
    setProgress(0);
    setGuess('');
    setAttempts(0);
    setIsPlaying(true);
    setGameComplete(false);
    setIsWin(false);
  };

  const playSnippet = () => {
    // Simulate audio playback with progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleGuess = (songTitle: string) => {
    if (!currentSong) return;
    
    setGuess(songTitle);
    setShowDropdown(false);
    setAttempts(prev => prev + 1);

    const win = songTitle === currentSong.title;
    
    if (win || attempts >= 2) {
      setIsWin(win);
      setGameComplete(true);
      setIsPlaying(false);

      if (win) {
        const reward = attempts === 0 ? 100 : attempts === 1 ? 50 : 20;
        addPoints(reward);
        if (gameRef.current) {
          const rect = gameRef.current.getBoundingClientRect();
          triggerFloatingPoints(reward, rect.left + rect.width / 2, rect.top);
        }
      }
    }
  };

  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(guess.toLowerCase())
  );

  return (
    <div ref={gameRef} className="space-y-4">
      {!isPlaying && !gameComplete && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Guess the song from the snippet!</p>
          <p className="text-sm text-neon-cyan">3 attempts to guess correctly</p>
          <Button onClick={startGame} className="btn-neon-cyan">
            Play (5 MP)
          </Button>
        </div>
      )}

      {isPlaying && currentSong && (
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Attempts: {attempts}/3</span>
            <span className="text-gold">Hint: {currentSong.hint}</span>
          </div>

          {/* Audio player simulation */}
          <div className="p-6 rounded-xl bg-muted/30 border border-neon-cyan/30 text-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playSnippet}
              className="w-16 h-16 rounded-full bg-neon-cyan flex items-center justify-center mx-auto mb-4"
            >
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            </motion.button>
            
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neon-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Song search */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search song..."
                className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-muted focus:border-neon-cyan outline-none text-foreground"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && guess && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-muted rounded-xl overflow-hidden z-10">
                {filteredSongs.map(song => (
                  <button
                    key={song.title}
                    onClick={() => handleGuess(song.title)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors text-foreground"
                  >
                    {song.title}
                  </button>
                ))}
              </div>
            )}
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
              {isWin ? '🎵 Correct!' : '❌ Wrong!'}
            </p>
            <p className="text-muted-foreground">Song: {currentSong?.title}</p>
            {isWin && (
              <p className="text-gold font-bold mt-2">
                +{attempts === 1 ? 100 : attempts === 2 ? 50 : 20} MP
              </p>
            )}
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
