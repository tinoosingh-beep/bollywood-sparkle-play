import { HubHeader } from '@/components/home/HubHeader';
import { ScriptSlots } from '@/components/home/ScriptSlots';
import { NewsCard } from '@/components/NewsCard';
import { ReviewCard } from '@/components/ReviewCard';
import { VideoPreviewCard } from '@/components/VideoPreviewCard';
import { newsContent } from '@/data/newsContent';
import { reviewContent } from '@/data/reviewContent';
import { videoContent } from '@/data/videoContent';
import { useState, useMemo } from 'react';

export function Home() {
  const [trophies] = useState(420);

  // Interleave review cards every 3 stories, video cards every 5 stories
  const feedItems = useMemo(() => {
    const items: { type: 'news' | 'review' | 'video'; data: any; key: string }[] = [];
    let reviewIndex = 0;
    let videoIndex = 0;
    newsContent.forEach((story, i) => {
      items.push({ type: 'news', data: story, key: `news-${story.id}` });
      // Insert a review card after every 3rd story
      if ((i + 1) % 3 === 0 && reviewIndex < reviewContent.length) {
        items.push({ type: 'review', data: reviewContent[reviewIndex], key: `review-${reviewContent[reviewIndex].id}` });
        reviewIndex++;
      }
      // Insert a video card after every 5th story
      if ((i + 1) % 5 === 0 && videoIndex < videoContent.length) {
        items.push({ type: 'video', data: videoContent[videoIndex], key: `video-${videoContent[videoIndex].id}` });
        videoIndex++;
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
