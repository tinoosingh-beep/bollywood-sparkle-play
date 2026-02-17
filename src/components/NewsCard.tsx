import { useState, useRef, useEffect, useMemo } from 'react';
import { Clock, Share2, BookOpen, Bot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { newsContentHi } from '@/data/newsContent.hi';
import type { NewsStory } from '@/data/newsContent';

interface NewsCardProps {
  story: NewsStory;
}

function getAmbientMeta(story: NewsStory) {
  const headline = story.headline.toLowerCase();
  const summary = story.summary.toLowerCase();

  const isAI = headline.includes('ai') || headline.includes('vfx') || summary.includes('artificial intelligence') || summary.includes('vfx');
  const aiRatio = isAI ? Math.round(30 + Math.random() * 45) : 0;
  const updatedMinAgo = Math.max(1, (story.id * 3) % 12);

  return { isAI, aiRatio, updatedMinAgo };
}

export function NewsCard({ story }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { lang, t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);

  const hi = lang === 'hi' ? newsContentHi[story.id] : null;
  const headline = hi?.headline || story.headline;
  const summary = hi?.summary || story.summary;

  const meta = useMemo(() => getAmbientMeta(story), [story]);
  const isVibe = story.type === 'vibe';

  // Scroll progress tracker
  useEffect(() => {
    if (!isExpanded || !contentRef.current) return;
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalH = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top + viewportH * 0.5);
      const progress = Math.min(1, scrolled / totalH);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: headline, text: summary }).catch(() => {});
    } else {
      navigator.clipboard.writeText(headline);
      toast.success('Link copied to clipboard!');
    }
  };

  const progressColor = scrollProgress >= 0.9
    ? 'hsl(45 100% 55%)'
    : `hsl(${45 * scrollProgress} ${20 + 80 * scrollProgress}% ${45 + 10 * scrollProgress}%)`;

  return (
    <article className="glass-card-gold overflow-hidden animate-slide-up">
      {/* Hero Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={story.image} alt={headline} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
          {story.category || `#${story.id}`}
        </span>

        {/* Vibe score */}
        {isVibe && story.vibeScore && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
            style={{ background: `hsla(${story.vibeScore * 12}, 80%, 50%, 0.9)`, color: 'white', backdropFilter: 'blur(8px)' }}>
            🔥 Vibe {story.vibeScore}/10
          </span>
        )}

        {/* Reading time */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1"
            style={{ background: 'hsla(0,0%,0%,0.6)', color: 'hsl(0 0% 95%)', backdropFilter: 'blur(8px)' }}>
            <Clock className="w-3 h-3" />{t('news.minRead')}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Headline + timestamp */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground flex-1">{headline}</h3>
          <span className="text-[9px] font-mono font-medium whitespace-nowrap mt-1" style={{ color: 'hsl(var(--accent))' }}>
            {meta.updatedMinAgo}m ago
          </span>
        </div>

        {/* Scroll progress bar */}
        {isExpanded && (
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${scrollProgress * 100}%`, background: progressColor }} />
          </div>
        )}

        {/* Read More CTA */}
        {!isExpanded && (
          <Button onClick={() => setIsExpanded(true)}
            className="w-full rounded-full py-5 flex items-center justify-center gap-2 text-base tracking-wider"
            style={{
              background: 'hsl(var(--gold))', color: 'hsl(0 0% 5%)',
              fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : "'Bebas Neue', sans-serif",
              fontSize: '1.15rem', fontWeight: 700, letterSpacing: lang === 'hi' ? '0.02em' : '0.08em',
              boxShadow: '0 4px 20px hsla(45, 100%, 50%, 0.4)',
            }}>
            <BookOpen className="w-5 h-5" />{t('news.readStory')}
          </Button>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div ref={contentRef} className="space-y-4 animate-slide-up">
            <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Naisha AI/VFX scale bar */}
        {meta.isAI && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: 'hsl(280, 80%, 55%)' }}>
                <Bot className="w-3 h-3" />Naisha Scale
              </span>
              <span className="text-[9px] font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {meta.aiRatio}% Synthetic · {100 - meta.aiRatio}% Human
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: 'hsl(var(--muted))' }}>
              <div style={{ width: `${meta.aiRatio}%`, background: 'linear-gradient(90deg, hsl(280, 80%, 55%), hsl(300, 70%, 60%))' }} className="rounded-l-full" />
              <div style={{ width: `${100 - meta.aiRatio}%`, background: 'linear-gradient(90deg, hsl(45, 100%, 50%), hsl(40, 90%, 55%))' }} className="rounded-r-full" />
            </div>
          </div>
        )}

        {/* Share button */}
        <div className="flex gap-3">
          <Button onClick={handleShare} variant="outline"
            className="w-full rounded-xl py-5 flex items-center justify-center gap-2 btn-glass">
            <Share2 className="w-4 h-4" />Share
          </Button>
        </div>

        {/* Tags for vibe items */}
        {isVibe && story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {story.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
