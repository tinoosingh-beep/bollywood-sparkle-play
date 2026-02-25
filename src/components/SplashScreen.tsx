import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 2500;
    const interval = 30;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 200);
          return 100;
        }
        return Math.min(prev + step + Math.random() * 0.5, 100);
      });
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(145deg, hsl(270 25% 8%), hsl(280 30% 12%), hsl(260 20% 6%))' }}
        >
          {/* Pulsing glow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 220,
              height: 220,
              background: 'radial-gradient(circle, hsla(250, 80%, 65%, 0.35) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center gap-5"
          >
            <motion.div
              className="p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, hsla(250, 70%, 60%, 0.2), hsla(280, 60%, 50%, 0.1))',
                border: '1px solid hsla(250, 70%, 65%, 0.25)',
                boxShadow: '0 0 50px hsla(250, 80%, 60%, 0.2)',
              }}
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles
                size={40}
                style={{
                  color: 'hsl(250, 80%, 75%)',
                  filter: 'drop-shadow(0 0 12px hsla(250, 80%, 65%, 0.6))',
                }}
              />
            </motion.div>

            <div className="text-center">
              <h1
                className="font-display-serif text-3xl tracking-widest"
                style={{ color: 'hsla(0, 0%, 100%, 0.92)' }}
              >
                BOLLYBET
              </h1>
              <p
                className="text-xs tracking-[0.3em] mt-1 font-medium"
                style={{ color: 'hsla(250, 60%, 75%, 0.7)' }}
              >
                PREDICT • PLAY • WIN
              </p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-16 w-48"
          >
            <div
              className="h-[2px] w-full rounded-full overflow-hidden"
              style={{ background: 'hsla(250, 40%, 40%, 0.3)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, hsl(250, 70%, 65%), hsl(280, 70%, 70%))',
                  boxShadow: '0 0 10px hsla(250, 80%, 65%, 0.5)',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
