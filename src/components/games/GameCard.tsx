import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export type GameCategory = 'action' | 'puzzle' | 'rewards';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  cost: number;
  reward: string;
  onClick: () => void;
  glowColor?: 'pink' | 'gold' | 'cyan';
  category?: GameCategory;
  image?: string;
}

const categoryStyles: Record<GameCategory, {
  gradient: string;
  border: string;
  iconColor: string;
  hoverGlow: string;
}> = {
  action: {
    gradient: 'bg-gradient-to-br from-red-900 via-red-800 to-gray-900',
    border: 'border-red-500/60',
    iconColor: 'text-red-300',
    hoverGlow: '0 0 30px hsla(0, 80%, 50%, 0.5)',
  },
  puzzle: {
    gradient: 'bg-gradient-to-br from-teal-600 via-purple-700 to-indigo-800',
    border: 'border-purple-400/50',
    iconColor: 'text-teal-200',
    hoverGlow: '0 0 30px hsla(280, 70%, 55%, 0.5)',
  },
  rewards: {
    gradient: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600',
    border: 'border-yellow-300/70',
    iconColor: 'text-yellow-100',
    hoverGlow: '0 0 35px hsla(45, 100%, 55%, 0.6)',
  },
};

export function GameCard({
  title,
  description,
  icon: Icon,
  cost,
  reward,
  onClick,
  category = 'puzzle',
  image,
}: GameCardProps) {
  const style = categoryStyles[category];
  const isRewards = category === 'rewards';
  const isAction = category === 'action';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left rounded-2xl overflow-hidden glass-card group"
      style={{ padding: 0 }}
    >
      {/* Icon Tile */}
      <div className={`relative aspect-square ${style.border} border-2 overflow-hidden`}
        style={{ borderRadius: '1rem 1rem 0 0' }}
      >
        {/* Background image */}
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={`absolute inset-0 ${style.gradient}`} />
        )}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Shine animation for rewards */}
        {isRewards && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, hsla(45, 100%, 90%, 0.35) 45%, hsla(45, 100%, 95%, 0.5) 50%, hsla(45, 100%, 90%, 0.35) 55%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
          />
        )}

        {/* Action diagonal lines */}
        {isAction && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 8px, hsla(0,0%,100%,0.15) 8px, hsla(0,0%,100%,0.15) 9px)',
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon className={`w-10 h-10 ${style.iconColor} drop-shadow-lg`} strokeWidth={2.2} />
        </motion.div>

        {/* Glassmorphism bottom overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
          style={{
            background: 'hsla(0, 0%, 0%, 0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid hsla(0, 0%, 100%, 0.15)',
          }}
        >
          <p className="text-[10px] font-semibold text-white/90 tracking-wide uppercase truncate">
            {title}
          </p>
        </div>
      </div>

      {/* Info section */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neon-pink font-medium">{cost} MP</span>
          <span className="text-gold font-medium">{reward}</span>
        </div>
      </div>
    </motion.button>
  );
}
