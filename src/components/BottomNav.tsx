import { Home, TrendingUp, Gamepad2, Crown } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'markets', label: 'Markets', icon: TrendingUp },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'leaderboard', label: 'A-List', icon: Crown },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="glass-card px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`${isActive ? 'nav-item-active' : 'nav-item'} flex-1 max-w-20`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-muted-foreground'}`} />
              <span className={`text-xs ${isActive ? 'text-gold font-medium' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
