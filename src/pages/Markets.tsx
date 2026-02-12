import { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { MarketRow, TradingDrawer, MarketSearch, CategoryTabs } from '@/components/markets';
import { newsContent } from '@/data/newsContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsContentHi } from '@/data/newsContent.hi';

export function Markets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<{
    name: string;
    side: 'yes' | 'no';
    price: number;
  } | null>(null);
  const { lang, t } = useLanguage();

  const categoryKeys = [
    { key: 'markets.all', en: 'All' },
    { key: 'markets.boxOffice', en: 'Box Office' },
    { key: 'markets.awards', en: 'Awards' },
    { key: 'markets.casting', en: 'Casting' },
    { key: 'markets.personalLife', en: 'Personal Life' },
  ];

  const categories = categoryKeys.map(c => t(c.key));
  const activeCategoryEn = categoryKeys.find(c => t(c.key) === activeCategory)?.en || 'All';

  const markets = useMemo(() => {
    const cats = ['Box Office', 'Awards', 'Casting', 'Personal Life'];
    return newsContent.slice(0, 20).map((story, index) => {
      const hi = lang === 'hi' ? newsContentHi[story.id] : null;
      return {
        id: story.id,
        name: hi?.predictionMarketQuestion || story.predictionMarketQuestion,
        category: cats[index % cats.length],
        yesPrice: story.initialYesPrice,
        noPrice: parseFloat((1 - story.initialYesPrice).toFixed(2)),
        change24h: (Math.random() * 20 - 10),
        volume: Math.floor(Math.random() * 490000 + 10000),
      };
    });
  }, [lang]);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const matchesSearch = market.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategoryEn === 'All' || market.category === activeCategoryEn;
      return matchesSearch && matchesCategory;
    });
  }, [markets, searchQuery, activeCategoryEn]);

  const handleBuy = (market: typeof markets[0], side: 'yes' | 'no') => {
    setSelectedMarket({
      name: market.name,
      side,
      price: side === 'yes' ? market.yesPrice : market.noPrice,
    });
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4 -mx-4 px-4">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-market-blue" />
        <h2 className="font-display text-xl font-bold text-foreground">{t('markets.title')}</h2>
      </div>

      <MarketSearch value={searchQuery} onChange={setSearchQuery} placeholder={t('markets.search')} />

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="flex items-center px-3 py-2 text-xs text-muted-foreground font-medium">
        <div className="flex-1">{t('markets.market')}</div>
        <div className="w-16 text-right">{t('markets.24h')}</div>
        <div className="w-16 text-right hidden sm:block">{t('markets.volume')}</div>
        <div className="w-16 hidden sm:block"></div>
        <div className="w-[140px] text-center ml-3">{t('markets.trade')}</div>
      </div>

      <div className="space-y-2">
        {filteredMarkets.map((market) => (
          <MarketRow
            key={market.id}
            {...market}
            onBuy={(side) => handleBuy(market, side)}
          />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('markets.noResults')}
        </div>
      )}

      {selectedMarket && (
        <TradingDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          marketName={selectedMarket.name}
          side={selectedMarket.side}
          price={selectedMarket.price}
        />
      )}
    </div>
  );
}
