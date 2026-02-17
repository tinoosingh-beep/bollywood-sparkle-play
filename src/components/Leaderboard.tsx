import { useState } from 'react';
import { Crown, Medal, Award, TrendingUp, Eye, Zap, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type LeaderboardCategory = 'visitors' | 'points' | 'predictions' | 'active';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  isUser?: boolean;
}

const categoryConfig: Record<LeaderboardCategory, { labelKey: string; icon: typeof Eye; unit: string; color: string }> = {
  visitors: { labelKey: 'leaderboard.topVisitors', icon: Eye, unit: 'visits', color: 'hsl(195, 100%, 50%)' },
  points: { labelKey: 'leaderboard.pointLegends', icon: Zap, unit: 'MP', color: 'hsl(45, 100%, 50%)' },
  predictions: { labelKey: 'leaderboard.predictionKings', icon: Target, unit: 'wins', color: 'hsl(150, 70%, 45%)' },
  active: { labelKey: 'leaderboard.superActive', icon: Activity, unit: 'score', color: 'hsl(320, 100%, 55%)' },
};

const mockData: Record<LeaderboardCategory, LeaderboardUser[]> = {
  visitors: [
    { rank: 1, name: 'MumbaiMaven', avatar: 'MM', score: 312 },
    { rank: 2, name: 'BollywoodBuff', avatar: 'BB', score: 287 },
    { rank: 3, name: 'FilmiFanatic', avatar: 'FF', score: 264 },
    { rank: 4, name: 'CineStar99', avatar: 'CS', score: 241 },
    { rank: 5, name: 'ReelQueen', avatar: 'RQ', score: 219 },
    { rank: 6, name: 'DramaKing', avatar: 'DK', score: 198 },
    { rank: 7, name: 'ScreenAddict', avatar: 'SA', score: 175 },
    { rank: 8, name: 'PopcornPro', avatar: 'PP', score: 162 },
    { rank: 9, name: 'StarWatcher', avatar: 'SW', score: 144 },
    { rank: 10, name: 'CinephileX', avatar: 'CX', score: 130 },
    { rank: 42, name: 'You', avatar: 'YO', score: 18, isUser: true },
  ],
  points: [
    { rank: 1, name: 'MasalaKing', avatar: 'MK', score: 24500 },
    { rank: 2, name: 'BollywoodBuff', avatar: 'BB', score: 21200 },
    { rank: 3, name: 'GoldenPredictor', avatar: 'GP', score: 19890 },
    { rank: 4, name: 'StargazerSam', avatar: 'SS', score: 17650 },
    { rank: 5, name: 'CinemaChamp', avatar: 'CC', score: 15900 },
    { rank: 6, name: 'FilmiFanatic', avatar: 'FF', score: 14200 },
    { rank: 7, name: 'ReelQueen', avatar: 'RQ', score: 12800 },
    { rank: 8, name: 'DramaKing', avatar: 'DK', score: 11500 },
    { rank: 9, name: 'ScreenAddict', avatar: 'SA', score: 10100 },
    { rank: 10, name: 'PopcornPro', avatar: 'PP', score: 8900 },
    { rank: 87, name: 'You', avatar: 'YO', score: 500, isUser: true },
  ],
  predictions: [
    { rank: 1, name: 'OracleOfBolly', avatar: 'OB', score: 142 },
    { rank: 2, name: 'PredictorPrime', avatar: 'PP', score: 128 },
    { rank: 3, name: 'MumbaiMaven', avatar: 'MM', score: 115 },
    { rank: 4, name: 'HitMachine', avatar: 'HM', score: 103 },
    { rank: 5, name: 'BoxOfficeGuru', avatar: 'BG', score: 97 },
    { rank: 6, name: 'CineStar99', avatar: 'CS', score: 89 },
    { rank: 7, name: 'FilmiFanatic', avatar: 'FF', score: 82 },
    { rank: 8, name: 'GoldenPredictor', avatar: 'GP', score: 76 },
    { rank: 9, name: 'StarWatcher', avatar: 'SW', score: 68 },
    { rank: 10, name: 'ReelQueen', avatar: 'RQ', score: 61 },
    { rank: 156, name: 'You', avatar: 'YO', score: 3, isUser: true },
  ],
  active: [
    { rank: 1, name: 'BollywoodBuff', avatar: 'BB', score: 4820 },
    { rank: 2, name: 'FilmiFanatic', avatar: 'FF', score: 4350 },
    { rank: 3, name: 'DramaKing', avatar: 'DK', score: 3980 },
    { rank: 4, name: 'ReelQueen', avatar: 'RQ', score: 3650 },
    { rank: 5, name: 'MasalaKing', avatar: 'MK', score: 3200 },
    { rank: 6, name: 'CineStar99', avatar: 'CS', score: 2890 },
    { rank: 7, name: 'PopcornPro', avatar: 'PP', score: 2540 },
    { rank: 8, name: 'ScreenAddict', avatar: 'SA', score: 2210 },
    { rank: 9, name: 'StarWatcher', avatar: 'SW', score: 1870 },
    { rank: 10, name: 'CinephileX', avatar: 'CX', score: 1560 },
    { rank: 63, name: 'You', avatar: 'YO', score: 120, isUser: true },
  ],
};

const RANK_COLORS = [
  'linear-gradient(135deg, hsl(45, 100%, 55%), hsl(40, 100%, 45%))',
  'linear-gradient(135deg, hsl(0, 0%, 75%), hsl(0, 0%, 60%))',
  'linear-gradient(135deg, hsl(25, 70%, 50%), hsl(20, 65%, 40%))',
];

export function Leaderboard() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('visitors');

  const categories: LeaderboardCategory[] = ['visitors', 'points', 'predictions', 'active'];
  const config = categoryConfig[activeCategory];
  const data = mockData[activeCategory];
  const topUsers = data.filter(u => !u.isUser).slice(0, 10);
  const currentUser = data.find(u => u.isUser);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5" style={{ color: 'hsl(45, 100%, 50%)' }} />;
    if (rank === 2) return <Medal className="w-5 h-5" style={{ color: 'hsl(0, 0%, 70%)' }} />;
    if (rank === 3) return <Award className="w-5 h-5" style={{ color: 'hsl(25, 70%, 50%)' }} />;
    return <span className="w-5 text-center text-sm font-bold text-muted-foreground">{rank}</span>;
  };

  return (
    <div className="space-y-5 animate-slide-up pb-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">{t('leaderboard.title')}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t('leaderboard.subtitle')}</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => {
          const catConfig = categoryConfig[cat];
          const Icon = catConfig.icon;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border"
              style={isActive ? {
                background: `${catConfig.color}15`,
                borderColor: `${catConfig.color}50`,
                color: catConfig.color,
              } : {
                background: 'hsla(0, 0%, 100%, 0.6)',
                borderColor: 'hsla(0, 0%, 0%, 0.08)',
                color: 'hsl(0, 0%, 45%)',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(catConfig.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 pt-2">
        {[1, 0, 2].map((idx) => {
          const user = topUsers[idx];
          if (!user) return null;
          const isFirst = idx === 0;
          const size = isFirst ? 'w-16 h-16' : 'w-12 h-12';
          return (
            <motion.div
              key={user.rank}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="relative">
                <Avatar className={`${size} border-2`} style={{ borderColor: RANK_COLORS[user.rank - 1]?.replace('linear-gradient(135deg, ', '').split(',')[0] || 'transparent' }}>
                  <AvatarFallback className="text-xs font-bold" style={{ background: RANK_COLORS[user.rank - 1], color: 'white' }}>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: RANK_COLORS[user.rank - 1] }}>
                  {user.rank}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground truncate max-w-[80px]">{user.name}</p>
              <p className="text-[10px] font-medium" style={{ color: config.color }}>
                {user.score.toLocaleString()} {config.unit}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Full List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="glass-card divide-y divide-border/50"
        >
          {topUsers.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center gap-3 px-4 py-3 ${user.rank <= 3 ? 'bg-primary/5' : ''}`}
            >
              <div className="w-6 flex-shrink-0 flex justify-center">
                {getRankIcon(user.rank)}
              </div>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <p className="flex-1 text-sm font-medium text-foreground truncate">{user.name}</p>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: user.rank <= 3 ? config.color : 'hsl(var(--foreground))' }}>
                  {user.score.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">{config.unit}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Sticky Your Rank */}
      {currentUser && (
        <div
          className="sticky bottom-20 z-30 glass-card-gold p-4 flex items-center gap-3"
        >
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('leaderboard.yourRank')}</span>
          </div>
          <span className="text-xl font-display font-bold text-gold">#{currentUser.rank}</span>
          <div className="ml-auto text-right">
            <p className="text-sm font-bold text-foreground">{currentUser.score.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{config.unit}</p>
          </div>
        </div>
      )}
    </div>
  );
}
