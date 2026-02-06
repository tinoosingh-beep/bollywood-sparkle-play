import { NewsCard } from '@/components/NewsCard';
import { newsContent } from '@/data/newsContent';

export function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-gradient-gold">Today's Gossip</h2>
        <p className="text-muted-foreground mt-2">Verify stories & predict outcomes</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{newsContent.length} stories</p>
      </div>

      <div className="space-y-5">
        {newsContent.map((story, index) => (
          <div key={story.id} style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
            <NewsCard story={story} />
          </div>
        ))}
      </div>
    </div>
  );
}
