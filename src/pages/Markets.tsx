import { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { MarketRow, TradingDrawer, MarketSearch, CategoryTabs } from '@/components/markets';
import { newsContent } from '@/data/newsContent';

const categories = ['All', 'Box Office', 'Awards', 'Casting', 'Personal Life'];

// Generate market data from news content
const generateMarketData = () => {
  const categoryMap: Record<number, string> = {};
  newsContent.forEach((story, index) => {
    const cats = ['Box Office', 'Awards', 'Casting', 'Personal Life'];
    categoryMap[story.id] = cats[index % cats.length];
  });

  return newsContent.slice(0, 20).map((story) => ({
    id: story.id,
    name: story.predictionMarketQuestion,
    category: categoryMap[story.id],
    yesPrice: story.initialYesPrice,
    noPrice: parseFloat((1 - story.initialYesPrice).toFixed(2)),
    change24h: (Math.random() * 20 - 10),
    volume: Math.floor(Math.random() * 490000 + 10000),
  }));
};

export function Markets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<{
    name: string;
    side: 'yes' | 'no';
    price: number;
  } | null>(null);

  const markets = useMemo(() => generateMarketData(), []);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const matchesSearch = market.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || market.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [markets, searchQuery, activeCategory]);

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
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-market-blue" />
        <h2 className="font-display text-xl font-bold text-foreground">Markets</h2>
      </div>

      {/* Search */}
      <MarketSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Categories */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Table Header */}
      <div className="flex items-center px-3 py-2 text-xs text-muted-foreground font-medium">
        <div className="flex-1">Market</div>
        <div className="w-16 text-right">24h</div>
        <div className="w-16 text-right hidden sm:block">Volume</div>
        <div className="w-16 hidden sm:block"></div>
        <div className="w-[140px] text-center ml-3">Trade</div>
      </div>

      {/* Market List */}
      <div className="space-y-2">
        {filteredMarkets.map((market, index) => (
          <MarketRow
            key={market.id}
            {...market}
            onBuy={(side) => handleBuy(market, side)}
          />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No markets found matching your search.
        </div>
      )}

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
