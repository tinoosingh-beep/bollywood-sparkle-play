import { motion } from 'framer-motion';
import { Shield, Star } from 'lucide-react';

const arenas = [
  { name: 'Dharma Studios Arena', rank: 1, minTrophies: 0 },
  { name: 'YRF Palace Arena', rank: 2, minTrophies: 500 },
  { name: 'Filmistan Grand Arena', rank: 3, minTrophies: 1500 },
];

interface ArenaDisplayProps {
  trophies: number;
}

export function ArenaDisplay({ trophies }: ArenaDisplayProps) {
  const currentArena = [...arenas].reverse().find(a => trophies >= a.minTrophies) || arenas[0];
  const nextArena = arenas.find(a => a.minTrophies > trophies);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="relative flex flex-col items-center py-4"
    >
      {/* Arena Badge - 3D style */}
      <div className="relative">
        <div
          className="w-44 h-44 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, hsl(45 100% 60%), hsl(35 90% 45%))',
            boxShadow: '0 8px 30px hsla(45, 100%, 50%, 0.5), inset 0 -4px 12px hsla(35, 90%, 30%, 0.4), inset 0 4px 8px hsla(50, 100%, 70%, 0.6)',
          }}
        >
          <div
            className="w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, hsl(250 30% 18%), hsl(250 35% 12%))',
              boxShadow: 'inset 0 4px 16px hsla(250, 30%, 5%, 0.8), inset 0 -2px 8px hsla(45, 100%, 50%, 0.15)',
            }}
          >
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto text-gold mb-1" style={{ filter: 'drop-shadow(0 0 8px hsla(45, 100%, 55%, 0.6))' }} />
              <p className="text-gold font-display text-xs font-bold tracking-wider">ARENA {currentArena.rank}</p>
            </div>
          </div>
        </div>

        {/* Floating stars */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: i === 0 ? '-4px' : i === 1 ? '10%' : '10%',
              left: i === 1 ? '-8px' : 'auto',
              right: i === 2 ? '-8px' : 'auto',
              ...(i === 0 ? { left: '50%', transform: 'translateX(-50%)' } : {}),
            }}
            animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Star className="w-5 h-5 fill-gold text-gold" style={{ filter: 'drop-shadow(0 0 4px hsla(45, 100%, 55%, 0.8))' }} />
          </motion.div>
        ))}
      </div>

      {/* Arena name */}
      <motion.h2
        className="font-display text-lg font-bold text-gradient-gold mt-3"
        animate={{ textShadow: ['0 0 10px hsla(45,100%,55%,0.3)', '0 0 20px hsla(45,100%,55%,0.5)', '0 0 10px hsla(45,100%,55%,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {currentArena.name}
      </motion.h2>

      {nextArena && (
        <p className="text-xs text-muted-foreground mt-1">
          {nextArena.minTrophies - trophies} 🏆 to {nextArena.name}
        </p>
      )}
    </motion.div>
  );
}
