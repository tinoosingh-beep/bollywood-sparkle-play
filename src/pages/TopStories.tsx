import { NewsCard } from '@/components/NewsCard';
import { newsContent } from '@/data/newsContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMemo } from 'react';

export function TopStories() {
  const { t } = useLanguage();

  const stories = useMemo(() => {
    return [...newsContent]
      .sort((a, b) => {
        if (a.type === 'vibe' && b.type === 'vibe') return (b.vibeScore || 0) - (a.vibeScore || 0);
        if (a.type === 'vibe') return -1;
        if (b.type === 'vibe') return 1;
        return b.id - a.id;
      })
      .slice(0, 30);
  }, []);

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div>
        <h1 className="headline-display text-2xl font-bold" style={{ color: 'hsl(var(--gold))' }}>
          {t('nav.topStories')}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Trending entertainment stories</p>
      </div>
      <div className="space-y-4">
        {stories.map((story) => (
          <NewsCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
