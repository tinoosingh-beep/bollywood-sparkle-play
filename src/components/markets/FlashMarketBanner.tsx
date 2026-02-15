import { useState, useEffect } from 'react';
import { Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FlashMarketBanner() {
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    // FDFS window: simulate flash market appearing for 60 minutes
    // In production, this would check against real FDFS times
    const now = new Date();
    const hour = now.getHours();
    // Flash active between 9–10 AM (typical FDFS) or demo: always show for first 60 min
    const isFlashHour = hour >= 9 && hour < 10;
    // For demo purposes, show it always with a simulated countdown
    const demoEnd = Date.now() + 55 * 60 * 1000; // 55 min remaining

    setVisible(true);
    setRemaining(demoEnd - Date.now());

    const interval = setInterval(() => {
      const r = demoEnd - Date.now();
      if (r <= 0) {
        setVisible(false);
        clearInterval(interval);
      } else {
        setRemaining(r);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(328 100% 54%), hsl(45 100% 50%), hsl(328 100% 54%))',
            backgroundSize: '300% 100%',
            animation: 'flash-gradient 3s linear infinite',
            boxShadow: '0 4px 24px hsla(328, 100%, 54%, 0.4), 0 0 40px hsla(45, 100%, 50%, 0.2)',
          }}
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: 'hsla(0, 0%, 0%, 0.3)', backdropFilter: 'blur(8px)' }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  ⚡ Flash Market — First Day First Show
                </p>
                <p className="text-[10px] text-white/80">
                  Limited-time high-stakes predictions • 2x MP multiplier active
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'hsla(0, 0%, 0%, 0.35)', backdropFilter: 'blur(8px)' }}
            >
              <Clock className="w-3 h-3 text-white" />
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
