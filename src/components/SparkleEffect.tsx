import { motion } from 'framer-motion';
import { ReactNode, useMemo } from 'react';

interface Sparkle {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
}

interface SparkleEffectProps {
  children: ReactNode;
  count?: number;
  color?: string;
  className?: string;
}

export function SparkleEffect({ children, count = 6, color = 'hsla(45, 100%, 65%, 0.9)', className = '' }: SparkleEffectProps) {
  const sparkles = useMemo<Sparkle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 1.5 + 1.5,
    })), [count]
  );

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <span className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            className="absolute rounded-full will-change-transform"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              background: color,
              boxShadow: `0 0 ${s.size * 2}px ${color}`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </span>
    </span>
  );
}
