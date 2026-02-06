import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketRowProps {
  id: number;
  name: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  change24h: number;
  volume: number;
  onBuy: (side: 'yes' | 'no') => void;
}

export function MarketRow({
  name,
  category,
  yesPrice,
  noPrice,
  change24h,
  volume,
  onBuy,
}: MarketRowProps) {
  const isPositive = change24h >= 0;

  // Generate sparkline data points
  const sparklineData = Array.from({ length: 20 }, () => 
    30 + Math.random() * 40
  );

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(0)}K`;
    return vol.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="market-row group"
    >
      {/* Market Info */}
      <div className="flex-1 min-w-0 pr-3">
        <span className="market-category">{category}</span>
        <p className="market-name">{name}</p>
      </div>

      {/* 24h Change */}
      <div className="w-16 text-right">
        <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-market-green' : 'text-market-red'}`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span className="font-mono text-xs font-medium">
            {isPositive ? '+' : ''}{change24h.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-16 text-right hidden sm:block">
        <span className="font-mono text-xs text-muted-foreground">
          {formatVolume(volume)} MP
        </span>
      </div>

      {/* Sparkline */}
      <div className="w-16 h-8 hidden sm:block">
        <svg viewBox="0 0 80 32" className="w-full h-full">
          <polyline
            fill="none"
            stroke={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={sparklineData.map((y, i) => `${i * 4},${32 - (y * 0.8)}`).join(' ')}
          />
        </svg>
      </div>

      {/* Trading Buttons */}
      <div className="flex gap-2 ml-3">
        <button
          onClick={() => onBuy('yes')}
          className="market-btn-yes"
        >
          <span className="text-[10px] opacity-70">Yes</span>
          <span className="font-mono font-bold">{yesPrice.toFixed(2)}</span>
        </button>
        <button
          onClick={() => onBuy('no')}
          className="market-btn-no"
        >
          <span className="text-[10px] opacity-70">No</span>
          <span className="font-mono font-bold">{noPrice.toFixed(2)}</span>
        </button>
      </div>
    </motion.div>
  );
}
