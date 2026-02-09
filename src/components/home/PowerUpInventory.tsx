import { motion } from 'framer-motion';
import { Package, Sparkles } from 'lucide-react';
import { useScriptSlots, type PowerUp } from '@/contexts/ScriptSlotsContext';

export function PowerUpInventory() {
  const { powerUps } = useScriptSlots();

  if (powerUps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Package className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No power-ups yet</p>
        <p className="text-xs text-muted-foreground/60 text-center max-w-[240px]">
          Open Film Reels from Script Slots to earn power-ups!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-gold" />
        <h3 className="font-display text-sm font-bold text-foreground">Your Power-Ups</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground">{powerUps.length} items</span>
      </div>

      {powerUps.map((pu, i) => (
        <PowerUpCard key={pu.id} powerUp={pu} index={i} />
      ))}
    </div>
  );
}

function PowerUpCard({ powerUp, index }: { powerUp: PowerUp; index: number }) {
  const rarityColor =
    powerUp.type === 'publicist'
      ? 'hsla(45, 100%, 55%, 0.15)'
      : powerUp.type === 'directors_cut'
      ? 'hsla(210, 100%, 60%, 0.15)'
      : 'hsla(280, 100%, 60%, 0.15)';

  const borderColor =
    powerUp.type === 'publicist'
      ? 'hsla(45, 100%, 55%, 0.4)'
      : powerUp.type === 'directors_cut'
      ? 'hsla(210, 100%, 60%, 0.4)'
      : 'hsla(280, 100%, 60%, 0.4)';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="p-3 rounded-xl flex items-center gap-3"
      style={{ background: rarityColor, border: `1px solid ${borderColor}` }}
    >
      <span className="text-2xl">{powerUp.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">{powerUp.name}</p>
        <p className="text-[11px] text-muted-foreground leading-tight">{powerUp.description}</p>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold font-mono text-foreground">{powerUp.usesLeft}</span>
        <span className="text-[9px] text-muted-foreground">uses</span>
      </div>
    </motion.div>
  );
}
