import { useState } from 'react';
import { RotateCcw, Sparkles, Coins } from 'lucide-react';
import { useBalance } from '@/contexts/BalanceContext';
import { Button } from '@/components/ui/button';

const wheelSegments = [
  { label: '10 MP', value: 10, color: 'hsl(270 40% 25%)' },
  { label: '25 MP', value: 25, color: 'hsl(350 82% 34%)' },
  { label: '50 MP', value: 50, color: 'hsl(270 40% 20%)' },
  { label: '2x Boost', value: 0, color: 'hsl(43 56% 45%)' },
  { label: '100 MP', value: 100, color: 'hsl(270 40% 15%)' },
  { label: '5 MP', value: 5, color: 'hsl(350 60% 40%)' },
];

export function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const handleSpin = (event: React.MouseEvent) => {
    if (isSpinning || hasSpunToday) return;
    
    if (!deductPoints(10)) {
      setResult('Not enough MP!');
      return;
    }

    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 5;
    const segmentAngle = 360 / wheelSegments.length;
    const randomSegment = Math.floor(Math.random() * wheelSegments.length);
    const finalRotation = rotation + (spins * 360) + (randomSegment * segmentAngle) + (segmentAngle / 2);

    setRotation(finalRotation);

    setTimeout(() => {
      const segment = wheelSegments[randomSegment];
      setIsSpinning(false);
      setHasSpunToday(true);
      
      if (segment.value > 0) {
        addPoints(segment.value);
        const rect = event.currentTarget.getBoundingClientRect();
        triggerFloatingPoints(segment.value, rect.left + rect.width / 2, rect.top);
        setResult(`You won ${segment.label}!`);
      } else {
        setResult('You got a 2x Multiplier Boost!');
      }
    }, 4000);
  };

  return (
    <div className="glass-card-gold p-6 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gold/20">
          <RotateCcw className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">Director's Cut</h3>
          <p className="text-muted-foreground text-sm">Spin once daily • 10 MP</p>
        </div>
      </div>

      <div className="relative w-64 h-64 mx-auto">
        {/* Wheel */}
        <div
          className="w-full h-full rounded-full overflow-hidden border-4 border-gold shadow-gold transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {wheelSegments.map((segment, index) => {
              const angle = 360 / wheelSegments.length;
              const startAngle = index * angle - 90;
              const endAngle = startAngle + angle;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              
              const largeArc = angle > 180 ? 1 : 0;

              return (
                <g key={index}>
                  <path
                    d={`M50,50 L${x1},${y1} A50,50 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={segment.color}
                    stroke="hsla(43, 56%, 52%, 0.3)"
                    strokeWidth="0.5"
                  />
                  <text
                    x="50"
                    y="20"
                    fill="white"
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${startAngle + angle / 2 + 90}, 50, 50)`}
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Center pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-gold z-10" />
        
        {/* Center button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
          <Sparkles className="w-8 h-8 text-background" />
        </div>
      </div>

      {result && (
        <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-5 h-5 text-gold" />
            <span className="text-gold font-bold">{result}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleSpin}
        disabled={isSpinning || hasSpunToday}
        className="w-full btn-gold rounded-xl py-5 font-bold"
      >
        {isSpinning ? 'Spinning...' : hasSpunToday ? 'Come back tomorrow!' : 'Spin the Wheel'}
      </Button>
    </div>
  );
}
