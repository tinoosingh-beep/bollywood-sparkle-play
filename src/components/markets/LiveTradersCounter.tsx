import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function LiveTradersCounter() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 7 - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: 'hsla(142, 60%, 45%, 0.1)',
        border: '1px solid hsla(142, 60%, 45%, 0.3)',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="relative">
        <Users className="w-3.5 h-3.5 text-market-green" />
        <div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
          style={{ background: 'hsl(142, 100%, 45%)' }}
        />
      </div>
      <span className="text-xs font-mono font-bold text-market-green">
        {(count / 1000).toFixed(1)}k
      </span>
      <span className="text-[10px] text-muted-foreground">fans trading</span>
    </motion.div>
  );
}
