import { useState } from 'react';
import { Bot, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useBalance } from '@/contexts/BalanceContext';
import { Confetti } from '@/components/Confetti';
import { toast } from 'sonner';

interface NaishaMetricCardProps {
  filmName: string;
  currentAIRatio: number;
  liveTraders: number;
  onStake: () => void;
}

export function NaishaMetricCard({ filmName, currentAIRatio, liveTraders, onStake }: NaishaMetricCardProps) {
  const [range, setRange] = useState([30, 70]);
  const [staked, setStaked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const handleStake = (e: React.MouseEvent) => {
    if (staked) return;
    if (deductPoints(25)) {
      setStaked(true);
      setShowConfetti(true);
      onStake();
      const rect = e.currentTarget.getBoundingClientRect();
      setTimeout(() => {
        if (Math.random() > 0.5) {
          addPoints(46);
          triggerFloatingPoints(46, rect.left + rect.width / 2, rect.top);
        }
      }, 1000);
      toast.success('Naisha Metric prediction placed! 🤖✨');
    }
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsla(280, 30%, 98%, 0.97), hsla(260, 25%, 96%, 0.95))',
          border: '2px solid hsla(280, 80%, 60%, 0.5)',
          boxShadow: '0 4px 24px hsla(280, 80%, 55%, 0.15), inset 0 1px 0 hsla(0,0%,100%,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded" style={{ background: 'hsla(280, 80%, 60%, 0.12)', color: 'hsl(280, 80%, 55%)' }}>
            <Bot className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Naisha Metric</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="font-mono">{liveTraders >= 1000 ? `${(liveTraders / 1000).toFixed(1)}k` : liveTraders}</span>
          </div>
        </div>

        {/* Question */}
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold leading-snug" style={{ color: 'hsl(var(--foreground))' }}>
            Predict the AI-to-Human VFX ratio for <span className="text-neon-pink font-bold">"{filmName}"</span>
          </h3>
        </div>

        {/* Current Metric Display */}
        <div className="mx-4 p-3 rounded-xl mb-3" style={{ background: 'hsla(280, 40%, 55%, 0.08)', border: '1px solid hsla(280, 60%, 55%, 0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-medium">Current Market Consensus</span>
            <span className="font-mono text-xs font-bold" style={{ color: 'hsl(280, 80%, 55%)' }}>
              {currentAIRatio}% AI : {100 - currentAIRatio}% Human
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'hsla(220, 20%, 90%, 0.8)' }}>
            <div style={{ width: `${currentAIRatio}%`, background: 'linear-gradient(90deg, hsl(280, 80%, 55%), hsl(300, 70%, 60%))' }} className="transition-all" />
            <div style={{ width: `${100 - currentAIRatio}%`, background: 'linear-gradient(90deg, hsl(45, 100%, 50%), hsl(40, 90%, 55%))' }} className="transition-all" />
          </div>
          <div className="flex justify-between mt-1 text-[9px] font-mono">
            <span style={{ color: 'hsl(280, 80%, 55%)' }}>🤖 AI VFX</span>
            <span className="text-gold">👨‍🎨 Human VFX</span>
          </div>
        </div>

        {/* Dual Range Slider */}
        <div className="px-4 pb-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-medium text-muted-foreground">Your Prediction Range</span>
            <span className="font-mono text-xs font-bold" style={{ color: 'hsl(280, 80%, 55%)' }}>
              {range[0]}% – {range[1]}%
            </span>
          </div>
          <Slider
            value={range}
            onValueChange={setRange}
            min={0}
            max={100}
            step={5}
            disabled={staked}
            className="naisha-slider"
          />
          <p className="text-[9px] text-muted-foreground text-center">
            You predict AI will handle {range[0]}%-{range[1]}% of VFX
          </p>
        </div>

        {/* Stake Button */}
        <div className="px-4 pb-4 pt-2">
          {staked ? (
            <div className="w-full py-3 rounded-xl text-center" style={{ background: 'hsla(280, 70%, 55%, 0.15)', border: '1px solid hsla(280, 60%, 55%, 0.3)' }}>
              <span className="text-sm font-bold" style={{ color: 'hsl(280, 70%, 55%)' }}>
                <Sparkles className="w-4 h-4 inline mr-1" />Prediction Locked! 🔮
              </span>
            </div>
          ) : (
            <button
              onClick={handleStake}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, hsl(280 80% 55%), hsl(300 70% 50%))',
                color: 'white',
                boxShadow: '0 4px 20px hsla(280, 80%, 55%, 0.4)',
              }}
            >
              Stake 25 MP on Naisha Metric
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
