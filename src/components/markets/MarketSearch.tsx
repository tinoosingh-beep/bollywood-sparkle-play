import { Search } from 'lucide-react';

interface MarketSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarketSearch({ value, onChange }: MarketSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search markets..."
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-muted/50 focus:border-market-blue outline-none text-foreground placeholder:text-muted-foreground font-sans text-sm transition-colors"
      />
    </div>
  );
}
