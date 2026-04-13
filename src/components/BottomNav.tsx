import { Home, Gamepad2, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_COLORS: Record<string, string> = {
  shop: '#8B5CF6',
  home: '#00BFFF',
  markets: '#00C853',
  charts: '#FF8C00',
  social: '#FFD700',
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
          background: 'hsla(270, 20%, 10%, 0.9)',
          borderTop: '1px solid hsla(270, 30%, 25%, 0.5)',
          boxShadow: '0 -4px 30px hsla(270, 40%, 5%, 0.5), 0 0 40px hsla(280, 60%, 40%, 0.08)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const color = NAV_COLORS[item.id] || '#00BFFF';

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
                  className="absolute -top-0.5 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white z-10"
                  style={{
                    background: '#FF3B30',
                    boxShadow: '0 2px 6px rgba(255, 59, 48, 0.5)',
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
                  style={{ color: isActive ? color : 'hsla(270, 10%, 60%, 1)' }}
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
                style={{ color: isActive ? color : 'hsla(270, 10%, 55%, 1)' }}
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
