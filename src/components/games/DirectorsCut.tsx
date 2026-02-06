import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBalance } from '@/contexts/BalanceContext';

interface DirectorsCutProps {
  onClose: () => void;
}

const prizes = [
  { label: '10 MP', value: 10, color: 'hsl(270, 40%, 25%)' },
  { label: '25 MP', value: 25, color: 'hsl(350, 82%, 34%)' },
  { label: '50 MP', value: 50, color: 'hsl(270, 40%, 20%)' },
  { label: '2x Boost', value: 0, color: 'hsl(43, 56%, 45%)' },
  { label: '100 MP', value: 100, color: 'hsl(180, 60%, 35%)' },
  { label: '5 MP', value: 5, color: 'hsl(320, 70%, 45%)' },
];

export function DirectorsCut({ onClose }: DirectorsCutProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const handleSpin = () => {
    if (isSpinning || hasSpunToday) return;
    
    if (!deductPoints(5)) {
      setResult('Not enough MP!');
      return;
    }

    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 5;
    const segmentAngle = 360 / prizes.length;
    const randomSegment = Math.floor(Math.random() * prizes.length);
    const finalRotation = rotation + (spins * 360) + (randomSegment * segmentAngle) + (segmentAngle / 2);

    setRotation(finalRotation);

    setTimeout(() => {
      const prize = prizes[randomSegment];
      setIsSpinning(false);
      setHasSpunToday(true);
      
      if (prize.value > 0) {
        addPoints(prize.value);
        if (gameRef.current) {
          const rect = gameRef.current.getBoundingClientRect();
          triggerFloatingPoints(prize.value, rect.left + rect.width / 2, rect.top);
        }
        setResult(`You won ${prize.label}!`);
      } else {
        setResult('You got a 2x Multiplier Boost!');
      }
    }, 4000);
  };

  return (
    <div ref={gameRef} className="space-y-4">
      <div className="relative w-56 h-56 mx-auto">
        {/* Wheel */}
        <div
          className="w-full h-full rounded-full overflow-hidden border-4 border-neon-pink shadow-neon-pink transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {prizes.map((prize, index) => {
              const angle = 360 / prizes.length;
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
                    fill={prize.color}
                    stroke="hsla(320, 70%, 50%, 0.5)"
                    strokeWidth="0.5"
                  />
                  <text
                    x="50"
                    y="20"
                    fill="white"
                    fontSize="4.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${startAngle + angle / 2 + 90}, 50, 50)`}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Center pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-neon-pink z-10" />
        
        {/* Center button */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-neon-pink to-crimson flex items-center justify-center shadow-neon-pink"
          animate={isSpinning ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: isSpinning ? Infinity : 0, ease: 'linear' }}
        >
          <Film className="w-7 h-7 text-white" />
        </motion.div>
      </div>

      {result && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-gold font-bold">{result}</span>
          </div>
        </motion.div>
      )}

      <Button
        onClick={handleSpin}
        disabled={isSpinning || hasSpunToday}
        className="w-full btn-neon-pink py-4"
      >
        {isSpinning ? 'Spinning...' : hasSpunToday ? 'Come back tomorrow!' : 'Spin (5 MP)'}
      </Button>

      <Button onClick={onClose} variant="outline" className="w-full">
        Exit
      </Button>
    </div>
  );
}
