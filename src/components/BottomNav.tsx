import { Home, Sparkles, Gamepad2, Users, Presentation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_COLORS: Record<string, string> = {
  shop: '#8B5CF6',
  collection: '#FF1493',
  home: '#00BFFF',
  markets: '#00C853',
  pitch: '#FF8C00',
  social: '#FFD700',
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'shop', labelKey: 'nav.games', icon: Gamepad2, badge: 3 },
    { id: 'collection', labelKey: 'nav.collection', icon: Sparkles, badge: 0 },
    { id: 'home', labelKey: 'nav.home', icon: Home, badge: 0 },
    { id: 'markets', labelKey: 'nav.markets', icon: Gamepad2, badge: 1 },
    { id: 'pitch', labelKey: 'nav.pitch', icon: Presentation, badge: 0 },
    { id: 'social', labelKey: 'nav.social', icon: Users, badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <div
        className="px-1 py-1.5 flex justify-around rounded-2xl backdrop-blur-md"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.06), 0 2px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const color = NAV_COLORS[item.id] || '#00BFFF';

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
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
                  style={{ color: isActive ? color : '#9CA3AF' }}
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
                style={{ color: isActive ? color : '#6B7280' }}
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
