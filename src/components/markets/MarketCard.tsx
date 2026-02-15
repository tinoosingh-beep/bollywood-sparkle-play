import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from '@/components/Confetti';

interface MarketCardProps {
  id: number;
  name: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  change24h: number;
  volume: number;
  endTime: number; // timestamp
  liveTraders: number;
  onBuy: (side: 'yes' | 'no') => void;
  onClick: () => void;
}

function CountdownTimer({ endTime }: { endTime: number }) {
  const [remaining, setRemaining] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(endTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (remaining <= 0) return <span className="font-mono text-xs text-market-red font-bold">EXPIRED</span>;

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  const isUrgent = hours < 2;
  const isClosingSoon = remaining < 15 * 60 * 1000;

  return (
    <div className="flex items-center gap-1.5">
      <Clock className={`w-3 h-3 ${isUrgent ? 'text-market-red' : 'text-muted-foreground'}`} />
      <span className={`font-mono text-xs font-bold tracking-wider ${
        isClosingSoon ? 'text-market-red animate-pulse' : isUrgent ? 'text-market-red' : 'text-muted-foreground'
      }`}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

function VolatilitySparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const points = data.map((y, i) => `${i * (80 / (data.length - 1))},${40 - (y * 0.8)}`).join(' ');
  const fillPoints = `0,40 ${points} 80,40`;
  const gradientId = `spark-${Math.random().toString(36).slice(2)}`;

  return (
    <svg viewBox="0 0 80 40" className="w-full h-full">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'} stopOpacity="0.4" />
          <stop offset="100%" stopColor={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${gradientId})`} points={fillPoints} />
      <polyline
        fill="none"
        stroke={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function MarketCard({
  id, name, category, yesPrice, noPrice, change24h, volume, endTime, liveTraders, onBuy, onClick,
}: MarketCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [shaking, setShaking] = useState(false);
  const isPositive = change24h >= 0;
  const remaining = endTime - Date.now();
  const isUrgent = remaining < 2 * 3600000;
  const isClosingSoon = remaining < 15 * 60 * 1000;

  const sparklineData = useMemo(() =>
    Array.from({ length: 20 }, () => 10 + Math.random() * 30), [id]);

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

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
        animate={{
          opacity: 1,
          y: 0,
          x: shaking ? [0, -3, 3, -2, 2, 0] : 0,
        }}
        transition={shaking ? { duration: 0.4 } : { duration: 0.3 }}
        className="pulse-card-container"
      >
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
          style={{
            background: 'linear-gradient(145deg, hsla(0, 0%, 100%, 0.97), hsla(220, 20%, 97%, 0.95))',
            backdropFilter: 'blur(20px)',
            border: isUrgent
              ? '2px solid hsla(328, 100%, 54%, 0.6)'
              : '1px solid hsla(220, 30%, 85%, 0.7)',
            boxShadow: isUrgent
              ? '0 4px 24px hsla(328, 100%, 54%, 0.2), inset 0 1px 0 hsla(0,0%,100%,0.5)'
              : '0 4px 20px hsla(220, 30%, 50%, 0.08), inset 0 1px 0 hsla(0,0%,100%,0.5)',
            animation: isUrgent ? 'pulse-border 2s ease-in-out infinite' : undefined,
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
                  background: 'linear-gradient(135deg, hsl(328 100% 54%), hsl(340 90% 50%))',
                  boxShadow: '0 2px 12px hsla(328, 100%, 54%, 0.5)',
                }}
              >
                <AlertTriangle className="w-3 h-3 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Closing Soon</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Row: Category + Timer + Traders */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded"
              style={{
                background: 'hsla(210, 100%, 50%, 0.1)',
                color: 'hsl(210, 100%, 50%)',
              }}
            >
              {category}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Users className="w-3 h-3" />
                <span className="font-mono font-medium">{liveTraders >= 1000 ? `${(liveTraders / 1000).toFixed(1)}k` : liveTraders}</span>
              </div>
              <CountdownTimer endTime={endTime} />
            </div>
          </div>

          {/* Market Name */}
          <button onClick={onClick} className="w-full text-left px-4 py-2">
            <h3
              className="text-sm font-semibold leading-snug transition-colors hover:text-market-blue"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {name}
            </h3>
          </button>

          {/* Sparkline + Change + Volume Row */}
          <div className="flex items-center gap-3 px-4 pb-2">
            <div className="w-20 h-8">
              <VolatilitySparkline data={sparklineData} isPositive={isPositive} />
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              isPositive ? 'bg-market-green/10 text-market-green' : 'bg-market-red/10 text-market-red'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{change24h.toFixed(1)}%
            </div>
            <span className="text-[10px] font-mono text-muted-foreground ml-auto">
              Vol: {formatVolume(volume)} MP
            </span>
          </div>

          {/* Probability Bar */}
          <div className="px-4 pb-2">
            <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: 'hsla(220, 20%, 90%, 0.8)' }}>
              <div className="transition-all duration-700" style={{ width: `${yesPrice * 100}%`, background: 'hsl(142, 100%, 39%)' }} />
              <div className="transition-all duration-700" style={{ width: `${noPrice * 100}%`, background: 'hsl(17, 100%, 50%)' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] font-mono font-bold text-market-green">{(yesPrice * 100).toFixed(0)}% Yes</span>
              <span className="text-[9px] font-mono font-bold text-market-red">{(noPrice * 100).toFixed(0)}% No</span>
            </div>
          </div>

          {/* Stake Buttons */}
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={(e) => { e.stopPropagation(); handleStake('yes'); }}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, hsla(142, 100%, 39%, 0.12), hsla(142, 100%, 39%, 0.06))',
                border: '1.5px solid hsla(142, 100%, 39%, 0.4)',
                color: 'hsl(142, 80%, 32%)',
              }}
            >
              <span className="text-[9px] font-medium opacity-70">Stake Yes</span>
              <span className="font-mono font-bold text-sm">{yesPrice.toFixed(2)}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleStake('no'); }}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, hsla(17, 100%, 50%, 0.12), hsla(17, 100%, 50%, 0.06))',
                border: '1.5px solid hsla(17, 100%, 50%, 0.4)',
                color: 'hsl(17, 90%, 42%)',
              }}
            >
              <span className="text-[9px] font-medium opacity-70">Stake No</span>
              <span className="font-mono font-bold text-sm">{noPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
