import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Flame, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from '@/components/Confetti';

interface MassMovieRallyCardProps {
  filmName: string;
  target: string; // e.g. "100cr"
  deadline: string; // e.g. "Monday 9 AM"
  yesPrice: number;
  noPrice: number;
  liveTraders: number;
  endTime: number;
  onBuy: (side: 'yes' | 'no') => void;
}

export function MassMovieRallyCard({
  filmName, target, deadline, yesPrice, noPrice, liveTraders, endTime, onBuy,
}: MassMovieRallyCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [remaining, setRemaining] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => setRemaining(endTime - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const isClosingSoon = remaining < 15 * 60 * 1000;
  const isUrgent = remaining < 2 * 3600000;

  const hours = Math.max(0, Math.floor(remaining / 3600000));
  const minutes = Math.max(0, Math.floor((remaining % 3600000) / 60000));
  const seconds = Math.max(0, Math.floor((remaining % 60000) / 1000));

  // Volatility sparkline data - more volatile looking
  const sparklineData = useMemo(() => {
    const data: number[] = [20];
    for (let i = 1; i < 30; i++) {
      data.push(Math.max(5, Math.min(45, data[i - 1] + (Math.random() - 0.48) * 10)));
    }
    return data;
  }, []);

  const isPositive = sparklineData[sparklineData.length - 1] > sparklineData[0];

  const handleStake = (side: 'yes' | 'no') => {
    setShowConfetti(true);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    onBuy(side);
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, x: shaking ? [0, -4, 4, -2, 2, 0] : 0 }}
        transition={shaking ? { duration: 0.4 } : { duration: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsla(0, 0%, 100%, 0.97), hsla(340, 20%, 97%, 0.95))',
          border: isUrgent
            ? '2px solid hsla(45, 100%, 50%, 0.7)'
            : '2px solid hsla(340, 85%, 55%, 0.4)',
          boxShadow: isUrgent
            ? '0 4px 24px hsla(45, 100%, 50%, 0.2), inset 0 1px 0 hsla(0,0%,100%,0.5)'
            : '0 4px 20px hsla(340, 80%, 50%, 0.1), inset 0 1px 0 hsla(0,0%,100%,0.5)',
          animation: isUrgent ? 'pulse-border-gold 2s ease-in-out infinite' : undefined,
        }}
      >
        {/* Closing Soon Badge */}
        <AnimatePresence>
          {isClosingSoon && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute top-0 left-0 z-10 flex items-center gap-1.5 px-3 py-1 rounded-br-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(328 100% 54%), hsl(0 80% 55%))',
                boxShadow: '0 2px 12px hsla(328, 100%, 54%, 0.5)',
              }}
            >
              <AlertTriangle className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Closing Soon</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded" style={{ background: 'hsla(340, 85%, 55%, 0.1)', color: 'hsl(340, 85%, 55%)' }}>
            <Flame className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Mass Rally</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Users className="w-3 h-3" />
              <span className="font-mono font-medium">{liveTraders >= 1000 ? `${(liveTraders / 1000).toFixed(1)}k` : liveTraders}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className={`w-3 h-3 ${isUrgent ? 'text-market-red' : 'text-muted-foreground'}`} />
              <span className={`font-mono text-xs font-bold tracking-wider ${isClosingSoon ? 'text-market-red animate-pulse' : isUrgent ? 'text-market-red' : 'text-muted-foreground'}`}>
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold leading-snug" style={{ color: 'hsl(var(--foreground))' }}>
            Will <span className="font-bold text-crimson">"{filmName}"</span> break the {target} barrier by {deadline}?
          </h3>
        </div>

        {/* Volatility Sparkline */}
        <div className="mx-4 p-3 rounded-xl mb-2" style={{ background: 'hsla(220, 15%, 95%, 0.8)', border: '1px solid hsla(220, 20%, 88%, 0.8)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Volatility Sparkline</span>
            <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${isPositive ? 'text-market-green' : 'text-market-red'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              Price Movement
            </div>
          </div>
          <div className="h-10">
            <svg viewBox="0 0 120 50" className="w-full h-full">
              <defs>
                <linearGradient id="rallyGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#rallyGrad)"
                points={`0,50 ${sparklineData.map((y, i) => `${i * 4},${50 - y}`).join(' ')} ${(sparklineData.length - 1) * 4},50`}
              />
              <polyline
                fill="none"
                stroke={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklineData.map((y, i) => `${i * 4},${50 - y}`).join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Probability + Price */}
        <div className="px-4 pb-2">
          <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: 'hsla(220, 20%, 90%, 0.8)' }}>
            <div style={{ width: `${yesPrice * 100}%`, background: 'hsl(142, 100%, 39%)' }} className="transition-all" />
            <div style={{ width: `${noPrice * 100}%`, background: 'hsl(17, 100%, 50%)' }} className="transition-all" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] font-mono font-bold text-market-green">{(yesPrice * 100).toFixed(0)}%</span>
            <span className="text-[9px] font-mono font-bold text-market-red">{(noPrice * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Stake Buttons */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={() => handleStake('yes')}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, hsla(142, 100%, 39%, 0.15), hsla(142, 100%, 39%, 0.05))',
              border: '1.5px solid hsla(142, 100%, 39%, 0.5)',
              color: 'hsl(142, 80%, 32%)',
            }}
          >
            <span className="text-[9px] font-medium opacity-70">Stake Yes</span>
            <span className="font-mono font-bold text-sm">{yesPrice.toFixed(2)}</span>
          </button>
          <button
            onClick={() => handleStake('no')}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, hsla(17, 100%, 50%, 0.15), hsla(17, 100%, 50%, 0.05))',
              border: '1.5px solid hsla(17, 100%, 50%, 0.5)',
              color: 'hsl(17, 90%, 42%)',
            }}
          >
            <span className="text-[9px] font-medium opacity-70">Stake No</span>
            <span className="font-mono font-bold text-sm">{noPrice.toFixed(2)}</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
