import { HubHeader } from '@/components/home/HubHeader';
import { ScriptSlots } from '@/components/home/ScriptSlots';
import { NewsCard } from '@/components/NewsCard';
import { ReviewCard } from '@/components/ReviewCard';
import { newsContent } from '@/data/newsContent';
import { reviewContent } from '@/data/reviewContent';
import { useState, useMemo } from 'react';

export function Home() {
  const [trophies] = useState(420);

  // Interleave review cards every 3-4 news stories
  const feedItems = useMemo(() => {
    const items: { type: 'news' | 'review'; data: any; key: string }[] = [];
    let reviewIndex = 0;
    newsContent.forEach((story, i) => {
      items.push({ type: 'news', data: story, key: `news-${story.id}` });
      // Insert a review card after every 3rd story (indices 2, 5, 8, ...)
      if ((i + 1) % 3 === 0 && reviewIndex < reviewContent.length) {
        items.push({ type: 'review', data: reviewContent[reviewIndex], key: `review-${reviewContent[reviewIndex].id}` });
        reviewIndex++;
      }
    });
    return items;
  }, []);

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <HubHeader trophies={trophies} />
      
      <ScriptSlots onNavigateToNews={() => {
        const feed = document.getElementById('news-feed');
        feed?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <div id="news-feed">
        <h2 className="font-display text-xl font-bold text-gradient-gold mb-3">Today's Gossip</h2>
        <div className="space-y-4">
          {feedItems.map((item, index) => (
            <div key={item.key} style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
              {item.type === 'news' ? (
                <NewsCard story={item.data} />
              ) : (
                <ReviewCard review={item.data} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
