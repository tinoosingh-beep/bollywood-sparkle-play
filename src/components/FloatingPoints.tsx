import { useBalance } from '@/contexts/BalanceContext';
import { Coins } from 'lucide-react';

export function FloatingPoints() {
  const { floatingPoints } = useBalance();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {floatingPoints.map((point) => (
        <div
          key={point.id}
          className="absolute flex items-center gap-1 animate-float-up"
          style={{ left: point.x, top: point.y }}
        >
          <Coins className="w-5 h-5 text-gold" />
          <span className="text-gold font-bold text-lg">
            +{point.amount} MP
          </span>
        </div>
      ))}
    </div>
  );
}
