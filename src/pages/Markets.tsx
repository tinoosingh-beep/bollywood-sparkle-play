import { PredictionMarket } from '@/components/PredictionMarket';
import { TrendingUp } from 'lucide-react';

const markets = [
  {
    id: 1,
    title: "Will 'Tiger 4' break the 50-crore opening day record?",
    optionA: "Superhit",
    optionB: "Flop",
    oddsA: 1.8,
    oddsB: 2.2,
  },
  {
    id: 2,
    title: "Will Alia Bhatt attend the Met Gala this year?",
    optionA: "Confirmed",
    optionB: "Rumor",
    oddsA: 2.5,
    oddsB: 1.6,
  },
];

export function Markets() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-8 h-8 text-gold" />
        </div>
        <h2 className="font-display text-3xl font-bold text-gradient-gold">The Box Office</h2>
        <p className="text-muted-foreground mt-2">Predict Bollywood's next big move</p>
      </div>

      <div className="space-y-5">
        {markets.map((market, index) => (
          <div key={market.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <PredictionMarket
              title={market.title}
              optionA={market.optionA}
              optionB={market.optionB}
              oddsA={market.oddsA}
              oddsB={market.oddsB}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
