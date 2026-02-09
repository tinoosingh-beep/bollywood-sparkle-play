import { HubHeader } from '@/components/home/HubHeader';
import { ScriptSlots } from '@/components/home/ScriptSlots';
import { NewsCard } from '@/components/NewsCard';
import { newsContent } from '@/data/newsContent';
import { useState } from 'react';

export function Home() {
  const [trophies] = useState(420);

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
          {newsContent.map((story, index) => (
            <div key={story.id} style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
              <NewsCard story={story} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
