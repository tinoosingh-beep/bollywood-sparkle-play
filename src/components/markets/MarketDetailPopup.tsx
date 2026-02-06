import { X, TrendingUp, TrendingDown, Users, Clock, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  market: {
    name: string;
    category: string;
    yesPrice: number;
    noPrice: number;
    change24h: number;
    volume: number;
  } | null;
  onBuy: (side: 'yes' | 'no') => void;
}

export function MarketDetailPopup({ isOpen, onClose, market, onBuy }: MarketDetailPopupProps) {
  if (!market) return null;

  const isPositive = market.change24h >= 0;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(0)}K`;
    return vol.toString();
  };

  // Generate mock chart data
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i,
    price: 0.4 + Math.random() * 0.3,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 top-20 bottom-28 z-50 bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b border-border">
              <div className="flex-1 pr-4">
                <span className="text-xs text-market-blue font-medium uppercase tracking-wider">
                  {market.category}
                </span>
                <h2 className="font-display font-bold text-lg text-foreground mt-1 leading-tight">
                  {market.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Price Display */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-3xl font-mono font-bold text-foreground">
                    {(market.yesPrice * 100).toFixed(0)}¢
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                  isPositive ? 'bg-market-green/10 text-market-green' : 'bg-market-red/10 text-market-red'
                }`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-mono font-bold">
                    {isPositive ? '+' : ''}{market.change24h.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-40 bg-muted/30 rounded-xl p-3 border border-border">
                <svg viewBox="0 0 300 120" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 40, 80, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="300"
                      y2={y}
                      stroke="hsl(var(--muted))"
                      strokeWidth="0.5"
                      strokeDasharray="4"
                    />
                  ))}
                  {/* Price line */}
                  <polyline
                    fill="none"
                    stroke={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.map((d, i) => `${i * 10},${120 - d.price * 150}`).join(' ')}
                  />
                  {/* Area fill */}
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isPositive ? 'hsl(142, 100%, 39%)' : 'hsl(17, 100%, 50%)'} stopOpacity="0" />
                  </linearGradient>
                  <polygon
                    fill="url(#chartGradient)"
                    points={`0,120 ${chartData.map((d, i) => `${i * 10},${120 - d.price * 150}`).join(' ')} 290,120`}
                  />
                </svg>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/30 rounded-xl p-3 border border-border text-center">
                  <BarChart3 className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="font-mono font-bold text-foreground">{formatVolume(market.volume)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 border border-border text-center">
                  <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Traders</p>
                  <p className="font-mono font-bold text-foreground">{Math.floor(market.volume / 500)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 border border-border text-center">
                  <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Ends</p>
                  <p className="font-mono font-bold text-foreground">7d</p>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Market Sentiment</p>
                <div className="h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-market-green transition-all duration-500"
                    style={{ width: `${market.yesPrice * 100}%` }}
                  />
                  <div 
                    className="bg-market-red transition-all duration-500"
                    style={{ width: `${market.noPrice * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-market-green">{(market.yesPrice * 100).toFixed(0)}% Yes</span>
                  <span className="text-market-red">{(market.noPrice * 100).toFixed(0)}% No</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onBuy('yes');
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl bg-market-green text-white font-bold text-center transition-all hover:opacity-90"
                >
                  Buy Yes @ {market.yesPrice.toFixed(2)}
                </button>
                <button
                  onClick={() => {
                    onBuy('no');
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl bg-market-red text-white font-bold text-center transition-all hover:opacity-90"
                >
                  Buy No @ {market.noPrice.toFixed(2)}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
