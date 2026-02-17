import { Home, TrendingUp, Gamepad2, ShoppingBag, Users, Presentation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'shop', labelKey: 'nav.games', icon: Gamepad2, badge: 3 },
    { id: 'collection', labelKey: 'nav.collection', icon: TrendingUp, badge: 0 },
    { id: 'home', labelKey: 'nav.home', icon: Home, badge: 0 },
    { id: 'topstories', labelKey: 'nav.topStories', icon: TrendingUp, badge: 0 },
    { id: 'pitch', labelKey: 'nav.pitch', icon: Presentation, badge: 0 },
    { id: 'social', labelKey: 'nav.social', icon: Users, badge: 5 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <div
        className="px-1 py-1.5 flex justify-around rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, hsl(250 30% 18%), hsl(250 35% 12%))',
          boxShadow: '0 -4px 24px hsla(250, 30%, 5%, 0.5), inset 0 1px 2px hsla(250, 20%, 30%, 0.3)',
          border: '1px solid hsla(45, 100%, 50%, 0.15)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors duration-200 flex-1 max-w-16"
              style={isActive ? { background: 'hsla(45, 100%, 55%, 0.2)' } : {}}
              whileTap={{ scale: 1.25 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {item.badge > 0 && (
                <span
                  className="absolute -top-0.5 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white z-10"
                  style={{
                    background: 'hsl(0, 80%, 55%)',
                    boxShadow: '0 2px 6px hsla(0, 80%, 50%, 0.5)',
                  }}
                >
                  {item.badge}
                </span>
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-white/50'}`} />
              <span className={`text-[10px] ${isActive ? 'text-gold font-semibold' : 'text-white/50'}`}>
                {t(item.labelKey)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
