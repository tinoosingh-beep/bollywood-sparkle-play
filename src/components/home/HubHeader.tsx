import { useBalance } from '@/contexts/BalanceContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Coins, Sparkles, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

interface HubHeaderProps {
  trophies: number;
}

export function HubHeader({ trophies }: HubHeaderProps) {
  const { balance } = useBalance();
  const { lang, toggleLanguage } = useLanguage();
  const capsuleStyle = {
    background: 'linear-gradient(145deg, hsla(var(--glass), 0.96), hsla(var(--deep-purple), 0.88))',
    boxShadow: '0 10px 26px hsla(var(--deep-purple), 0.3), 0 0 14px hsla(var(--gold), 0.08), inset 0 1px 0 hsla(var(--gold-glow), 0.16)',
  } as const;

  return (
    <div className="flex items-center justify-between px-1">
      {/* Left: BollyPass badge */}
      <div className="flex items-center gap-2">
        <motion.button
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--royal-purple)), hsl(var(--crimson)) 52%, hsl(var(--gold-glow)) 100%)',
            backgroundSize: '200% 200%',
            boxShadow: '0 10px 28px hsla(var(--crimson), 0.36), 0 0 18px hsla(var(--gold), 0.2)',
            border: '1px solid hsla(var(--gold-glow), 0.34)',
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-4 h-4 text-primary-foreground drop-shadow-[0_0_10px_hsla(var(--gold-glow),0.55)]" />
          <span className="text-xs font-extrabold tracking-wide text-primary-foreground drop-shadow-[0_2px_8px_hsla(var(--deep-purple),0.45)]">BollyBet</span>
          <span
            className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground"
            style={{ background: 'hsla(var(--foreground), 0.18)', boxShadow: 'inset 0 1px 2px hsla(var(--deep-purple), 0.3)' }}
          >
            7
          </span>
        </motion.button>

        {/* Language Toggle */}
        <motion.button
          onClick={toggleLanguage}
          className="flex items-center gap-1 rounded-full border px-2.5 py-1.5"
          style={{
            ...capsuleStyle,
            borderColor: 'hsla(var(--gold), 0.18)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <Languages className="w-3.5 h-3.5 text-primary" />
          <span
            className="text-[10px] font-bold text-primary"
            style={lang === 'hi' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </span>
        </motion.button>
      </div>

      {/* Right: Trophies + MP */}
      <div className="flex items-center gap-2">
        <div
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
          style={{
              ...capsuleStyle,
              borderColor: 'hsla(var(--gold), 0.28)',
          }}
        >
          <Trophy className="w-4 h-4 text-gold" />
          <span className="text-sm font-bold text-gold font-mono">{trophies}</span>
        </div>

        <div
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5"
          style={{
              ...capsuleStyle,
              borderColor: 'hsla(var(--crimson), 0.3)',
          }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Coins className="w-4 h-4 text-crimson" />
          </motion.div>
          <span className="text-sm font-bold text-crimson font-mono">{balance}</span>
        </div>
      </div>
    </div>
  );
}
