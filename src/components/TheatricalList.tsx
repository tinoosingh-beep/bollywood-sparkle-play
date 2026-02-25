import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TheatricalListProps {
  children: ReactNode[];
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    rotateX: -15,
    scale: 0.92,
  } as const,
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

export function TheatricalList({ children, className = '' }: TheatricalListProps) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ perspective: 800 }}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={item} style={{ transformOrigin: 'center bottom' }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
