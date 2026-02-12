import { Crown, Medal, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const leaderboardData = [
  { rank: 1, name: 'MumbaiMaven', points: 12450, streak: 15 },
  { rank: 2, name: 'BollywoodBuff', points: 11200, streak: 12 },
  { rank: 3, name: 'FilmiFanatic', points: 10890, streak: 10 },
  { rank: 4, name: 'StargazerSam', points: 9750, streak: 8 },
  { rank: 5, name: 'CinemaChamp', points: 8900, streak: 7 },
  { rank: 6, name: 'You', points: 500, streak: 0, isUser: true },
];

export function Leaderboard() {
  const { t } = useLanguage();
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-secondary" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-gradient-gold">{t('leaderboard.title')}</h2>
        <p className="text-muted-foreground mt-2">{t('leaderboard.subtitle')}</p>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((player) => (
          <div
            key={player.rank}
            className={`glass-card p-4 flex items-center gap-4 ${
              player.isUser ? 'border-gold glow-gold' : ''
            }`}
          >
            <div className="flex-shrink-0">
              {getRankIcon(player.rank)}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${player.isUser ? 'text-gold' : 'text-foreground'}`}>
                {player.name}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>{player.streak} {t('leaderboard.dayStreak')}</span>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-bold ${player.rank <= 3 ? 'text-gold' : 'text-foreground'}`}>
                {player.points.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">MP</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card-gold p-5 text-center">
        <p className="text-muted-foreground text-sm mb-2">{t('leaderboard.yourRank')}</p>
        <p className="text-4xl font-display font-bold text-gold">#6</p>
        <p className="text-muted-foreground text-sm mt-2">
          8,400 {t('leaderboard.toReach')} #5
        </p>
      </div>
    </div>
  );
}
