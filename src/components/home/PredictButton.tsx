import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface PredictButtonProps {
  onPress: () => void;
}

export function PredictButton({ onPress }: PredictButtonProps) {
  return (
    <div className="flex justify-center py-2">
      <motion.button
        onClick={onPress}
        className="relative px-12 py-4 rounded-full font-display font-bold text-lg tracking-wide"
        style={{
          background: 'linear-gradient(145deg, hsl(45 100% 60%), hsl(40 95% 48%))',
          color: 'hsl(250, 35%, 12%)',
          boxShadow: '0 6px 24px hsla(45, 100%, 50%, 0.5), 0 2px 8px hsla(45, 100%, 40%, 0.3), inset 0 2px 4px hsla(50, 100%, 75%, 0.5), inset 0 -2px 4px hsla(40, 90%, 35%, 0.3)',
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 6px 24px hsla(45,100%,50%,0.4), 0 2px 8px hsla(45,100%,40%,0.3), inset 0 2px 4px hsla(50,100%,75%,0.5), inset 0 -2px 4px hsla(40,90%,35%,0.3)',
            '0 6px 40px hsla(45,100%,50%,0.7), 0 2px 8px hsla(45,100%,40%,0.3), inset 0 2px 4px hsla(50,100%,75%,0.5), inset 0 -2px 4px hsla(40,90%,35%,0.3)',
            '0 6px 24px hsla(45,100%,50%,0.4), 0 2px 8px hsla(45,100%,40%,0.3), inset 0 2px 4px hsla(50,100%,75%,0.5), inset 0 -2px 4px hsla(40,90%,35%,0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          PREDICT NOW
        </span>
      </motion.button>
    </div>
  );
}
