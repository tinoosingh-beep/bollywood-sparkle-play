import { Home, Gamepad2, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_COLORS: Record<string, string> = {
  shop: 'hsl(var(--neon-purple))',
  home: 'hsl(var(--gold))',
  markets: 'hsl(var(--neon-cyan))',
  charts: 'hsl(var(--accent))',
  social: 'hsl(var(--crimson))',
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'shop', labelKey: 'nav.games', icon: Gamepad2, badge: 3 },
    { id: 'home', labelKey: 'nav.home', icon: Home, badge: 0 },
    { id: 'markets', labelKey: 'nav.markets', icon: Gamepad2, badge: 1 },
    { id: 'charts', labelKey: 'nav.charts', icon: BarChart3, badge: 0 },
    { id: 'social', labelKey: 'nav.social', icon: Users, badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <div
        className="px-1 py-1.5 flex justify-around rounded-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(180deg, hsla(var(--deep-purple), 0.84), hsla(var(--glass), 0.98))',
          border: '1px solid hsla(var(--glass-border), 0.78)',
          boxShadow: '0 -10px 36px hsla(var(--deep-purple), 0.4), 0 0 18px hsla(var(--crimson), 0.08), inset 0 1px 0 hsla(var(--gold-glow), 0.18)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const color = NAV_COLORS[item.id] || 'hsl(var(--gold))';

          return (
            <motion.button
              key={item.id}
              onClick={() => { onTabChange(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors duration-200 flex-1 max-w-16"
              whileTap={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {item.badge > 0 && (
                <span
                  className="absolute -top-0.5 right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-primary-foreground"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--gold-glow)), hsl(var(--accent)))',
                    boxShadow: '0 4px 12px hsla(var(--accent), 0.35)',
                  }}
                >
                  {item.badge}
                </span>
              )}
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? color : 'hsl(var(--muted-foreground))' }}
                />
              </motion.div>
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="w-1 h-1 rounded-full"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? color : 'hsl(var(--muted-foreground))' }}
              >
                {t(item.labelKey)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
