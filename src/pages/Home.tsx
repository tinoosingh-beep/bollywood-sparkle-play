import { HubHeader } from '@/components/home/HubHeader';
import { ScriptSlots } from '@/components/home/ScriptSlots';
import { NewsCard } from '@/components/NewsCard';
import { ReviewCard } from '@/components/ReviewCard';
import { VideoPreviewCard } from '@/components/VideoPreviewCard';
import { FashionFaceoffCard } from '@/components/fashion/FashionFaceoffCard';
import { newsContent } from '@/data/newsContent';
import { reviewContent } from '@/data/reviewContent';
import { videoContent } from '@/data/videoContent';
import { fashionFaceoffs, type FashionCategory } from '@/data/fashionContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const FASHION_FILTERS: ('All' | FashionCategory)[] = ['All', 'Red Carpet', 'Airport Style', 'Ethnic Fusion'];

export function Home() {
  const [trophies] = useState(420);
  const { t } = useLanguage();
  const [fashionFilter, setFashionFilter] = useState<'All' | FashionCategory>('All');

  const filteredFashion = useMemo(() =>
    fashionFilter === 'All' ? fashionFaceoffs : fashionFaceoffs.filter(f => f.category === fashionFilter),
    [fashionFilter]
  );

  // Sort: vibe items by vibeScore (desc), bet items by expiry urgency (soonest first), then interleave
  const feedItems = useMemo(() => {
    const sorted = [...newsContent].sort((a, b) => {
      // Vibe items with higher scores go first
      if (a.type === 'vibe' && b.type === 'vibe') return (b.vibeScore || 0) - (a.vibeScore || 0);
      if (a.type === 'vibe' && b.type !== 'vibe') return -1;
      if (a.type !== 'vibe' && b.type === 'vibe') return 1;
      // Bet items: sooner expiry = higher urgency
      const aExp = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
      const bExp = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
      return aExp - bExp;
    });
    const items: { type: 'news' | 'review' | 'video'; data: any; key: string }[] = [];
    let reviewIndex = 0;
    let videoIndex = 0;
    sorted.forEach((story, i) => {
      items.push({ type: 'news', data: story, key: `news-${story.id}` });
      if ((i + 1) % 5 === 0 && reviewIndex < reviewContent.length) {
        items.push({ type: 'review', data: reviewContent[reviewIndex], key: `review-${reviewContent[reviewIndex].id}` });
        reviewIndex++;
      }
      if ((i + 1) % 8 === 0 && videoIndex < videoContent.length) {
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
        <h2 className="font-display-serif text-xl font-bold mb-3" style={{ color: 'hsl(var(--crimson))' }}>{t('home.todaysNews')}</h2>
        <div className="space-y-4">
          {feedItems.map((item, index) => (
            <div key={item.key} style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
              {item.type === 'news' ? (
                <NewsCard story={item.data} />
              ) : item.type === 'review' ? (
                <ReviewCard review={item.data} />
              ) : (
                <VideoPreviewCard video={item.data} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fashion Spotlight Section */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2
            className="text-2xl font-bold uppercase tracking-[0.12em]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              background: 'linear-gradient(135deg, hsl(45, 100%, 50%), hsl(30, 90%, 55%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fashion Spotlight
          </h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Pick your side in Bollywood's hottest style showdowns — pure social polls, no bets.
        </p>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
          {FASHION_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFashionFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                fashionFilter === f
                  ? 'bg-gold text-background border-gold shadow-lg shadow-gold/30'
                  : 'border-border/60 text-muted-foreground hover:border-gold/40 hover:text-foreground'
              }`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em' }}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">{filteredFashion.length} face-offs</p>
        <div className="space-y-5">
          {filteredFashion.map((faceoff) => (
            <FashionFaceoffCard key={faceoff.id} faceoff={faceoff} />
          ))}
        </div>
      </div>
    </div>
  );
}
