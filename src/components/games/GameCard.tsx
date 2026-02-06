import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  cost: number;
  reward: string;
  onClick: () => void;
  glowColor?: 'pink' | 'gold' | 'cyan';
}

export function GameCard({ 
  title, 
  description, 
  icon: Icon, 
  cost, 
  reward, 
  onClick,
  glowColor = 'pink' 
}: GameCardProps) {
  const glowClasses = {
    pink: 'neon-border-pink',
    gold: 'neon-border-gold',
    cyan: 'neon-border-cyan',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`game-card ${glowClasses[glowColor]} p-4 rounded-2xl text-left w-full`}
    >
      <div className="icon-3d mb-3">
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="font-display font-bold text-foreground text-sm mb-1 line-clamp-1">
        {title}
      </h3>
      
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-neon-pink font-medium">{cost} MP</span>
        <span className="text-gold font-medium">{reward}</span>
      </div>
    </motion.button>
  );
}
