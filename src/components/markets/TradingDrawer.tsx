import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { useBalance } from '@/contexts/BalanceContext';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface TradingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  marketName: string;
  side: 'yes' | 'no';
  price: number;
}

export function TradingDrawer({
  isOpen,
  onClose,
  marketName,
  side,
  price,
}: TradingDrawerProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState(100);
  const [limitPrice, setLimitPrice] = useState(price);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const { balance, deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const effectivePrice = orderType === 'market' ? price : limitPrice;
  const shares = Math.floor(amount / effectivePrice);
  const potentialReturn = shares * 1;
  const roi = ((potentialReturn - amount) / amount * 100).toFixed(0);
  const yesProbability = Math.round(price * 100);
  const noProbability = 100 - yesProbability;

  useEffect(() => {
    setLimitPrice(price);
  }, [price]);

  const handleConfirm = (event: React.MouseEvent) => {
    if (hasConfirmed) return;

    if (deductPoints(amount)) {
      setHasConfirmed(true);
      const rect = event.currentTarget.getBoundingClientRect();

      setTimeout(() => {
        if (Math.random() > 0.5) {
          addPoints(potentialReturn);
          triggerFloatingPoints(potentialReturn, rect.left + rect.width / 2, rect.top - 100);
        }
        setTimeout(() => {
          onClose();
          setTimeout(() => {
            setAmount(100);
            setHasConfirmed(false);
            setOrderType('market');
          }, 300);
        }, 1500);
      }, 1000);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(() => {
        setAmount(100);
        setHasConfirmed(false);
        setOrderType('market');
      }, 300);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="trading-drawer border-t-2 border-market-blue bg-transparent">
        <div className="trading-drawer-inner flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-muted/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${side === 'yes' ? 'bg-market-green/20' : 'bg-market-red/20'}`}>
                {side === 'yes' ? (
                  <TrendingUp className="w-5 h-5 text-market-green" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-market-red" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm">
                  Buy {side.toUpperCase()}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{marketName}</p>
              </div>
            </div>
            <DrawerClose asChild>
              <button className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors flex-shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </DrawerClose>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-5 overflow-y-auto">
            {/* Order Type Toggle */}
            <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
              <button
                onClick={() => setOrderType('market')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  orderType === 'market'
                    ? 'bg-market-blue text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('limit')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  orderType === 'limit'
                    ? 'bg-market-blue text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Limit
              </button>
            </div>

            {/* Probability Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-market-green font-medium">Yes {yesProbability}%</span>
                <span className="text-market-red font-medium">No {noProbability}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <motion.div
                  className="bg-market-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${yesProbability}%` }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="bg-market-red"
                  initial={{ width: 0 }}
                  animate={{ width: `${noProbability}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Limit Price (only for limit orders) */}
            {orderType === 'limit' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Limit Price</span>
                  <span className="font-mono font-bold text-market-blue">${limitPrice.toFixed(2)}</span>
                </div>
                <Slider
                  value={[limitPrice * 100]}
                  onValueChange={(value) => setLimitPrice(value[0] / 100)}
                  min={1}
                  max={99}
                  step={1}
                  disabled={hasConfirmed}
                  className="market-slider"
                />
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-mono font-bold text-lg text-foreground">{amount} MP</span>
              </div>
              <Slider
                value={[amount]}
                onValueChange={(value) => setAmount(value[0])}
                min={10}
                max={Math.min(1000, balance)}
                step={10}
                disabled={hasConfirmed}
                className="market-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 MP</span>
                <span>Balance: {balance} MP</span>
              </div>
            </div>

            {/* Shares Calculator */}
            <div className="p-4 rounded-xl bg-muted/20 border border-muted/30 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Shares to receive</span>
                </div>
                <span className="font-mono font-bold text-xl text-foreground">{shares}</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {amount} MP ÷ ${effectivePrice.toFixed(2)} = {shares} shares
              </div>

              <div className="pt-3 border-t border-muted/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Potential Return</span>
                  <div className="text-right">
                    <p className="font-mono font-bold text-market-green text-lg">{potentialReturn} MP</p>
                    <p className="text-xs text-market-green">+{roi}% ROI if correct</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 border-t border-muted/30">
            {hasConfirmed ? (
              <div className="py-4 rounded-xl text-center bg-market-blue">
                <p className="font-bold text-white">Order Placed! 📈</p>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={amount > balance}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  side === 'yes'
                    ? 'bg-market-green hover:bg-market-green/90 text-white'
                    : 'bg-market-red hover:bg-market-red/90 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {amount > balance ? 'Insufficient Balance' : `Buy ${side.toUpperCase()} @ $${effectivePrice.toFixed(2)}`}
              </button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
