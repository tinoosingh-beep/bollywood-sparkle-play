import { useState, useMemo } from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import { MarketCard } from '@/components/markets/MarketCard';
import { NaishaMetricCard } from '@/components/markets/NaishaMetricCard';
import { MassMovieRallyCard } from '@/components/markets/MassMovieRallyCard';
import { FlashMarketBanner } from '@/components/markets/FlashMarketBanner';
import { LiveTradersCounter } from '@/components/markets/LiveTradersCounter';
import { TradingDrawer, MarketSearch, CategoryTabs, MarketDetailPopup } from '@/components/markets';
import { newsContent } from '@/data/newsContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsContentHi } from '@/data/newsContent.hi';

export function Markets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedPopupMarket, setSelectedPopupMarket] = useState<any>(null);
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
    return newsContent.slice(0, 16).map((story, index) => {
      const hi = lang === 'hi' ? newsContentHi[story.id] : null;
      // Varied end times: some urgent, some not
      const hoursLeft = [0.2, 1.5, 4, 12, 24, 48, 72, 0.1, 3, 6, 18, 36, 8, 2, 0.5, 96][index];
      return {
        id: story.id,
        name: hi?.predictionMarketQuestion || story.predictionMarketQuestion,
        category: cats[index % cats.length],
        yesPrice: story.initialYesPrice,
        noPrice: parseFloat((1 - story.initialYesPrice).toFixed(2)),
        change24h: (Math.random() * 20 - 10),
        volume: Math.floor(Math.random() * 490000 + 10000),
        endTime: Date.now() + hoursLeft * 3600000,
        liveTraders: Math.floor(Math.random() * 2000 + 200),
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

  const handleCardClick = (market: typeof markets[0]) => {
    setSelectedPopupMarket(market);
    setPopupOpen(true);
  };

  return (
    <div className="space-y-4 -mx-4 px-4">
      {/* Flash Market Banner */}
      <FlashMarketBanner />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: 'hsla(210, 100%, 50%, 0.1)', border: '1px solid hsla(210, 100%, 50%, 0.2)' }}>
            <Activity className="w-5 h-5 text-market-blue" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {lang === 'hi' ? 'लाइव बॉलीवुड पल्स' : 'Live Bollywood Pulse'}
            </h2>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              Real-time prediction markets
            </p>
          </div>
        </div>
        <LiveTradersCounter />
      </div>

      <MarketSearch value={searchQuery} onChange={setSearchQuery} placeholder={t('markets.search')} />

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Naisha Metric Card (special) */}
      {activeCategoryEn === 'All' && !searchQuery && (
        <NaishaMetricCard
          filmName="Krrish 4"
          currentAIRatio={62}
          liveTraders={892}
          onStake={() => {}}
        />
      )}

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredMarkets.slice(0, 2).map((market) => (
          <MarketCard
            key={market.id}
            {...market}
            onBuy={(side) => handleBuy(market, side)}
            onClick={() => handleCardClick(market)}
          />
        ))}
      </div>

      {/* Mass Movie Rally (special) */}
      {activeCategoryEn === 'All' && !searchQuery && (
        <MassMovieRallyCard
          filmName="Pathaan 2"
          target="100cr"
          deadline="Monday 9 AM"
          yesPrice={0.72}
          noPrice={0.28}
          liveTraders={1847}
          endTime={Date.now() + 1.2 * 3600000}
          onBuy={(side) => setDrawerOpen(true)}
        />
      )}

      {/* Remaining Market Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredMarkets.slice(2).map((market) => (
          <MarketCard
            key={market.id}
            {...market}
            onBuy={(side) => handleBuy(market, side)}
            onClick={() => handleCardClick(market)}
          />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('markets.noResults')}
        </div>
      )}

      {/* Detail Popup */}
      <MarketDetailPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        market={selectedPopupMarket}
        onBuy={(side) => {
          if (selectedPopupMarket) {
            handleBuy(selectedPopupMarket, side);
            setPopupOpen(false);
          }
        }}
      />

      {/* Trading Drawer */}
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
