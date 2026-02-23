import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, Star, Zap, TrendingUp, Users, X } from 'lucide-react';
import { generatePredictionCalendar, CATEGORY_LABELS, type DayPredictions, type PredictionSlot, type SlotCategory } from '@/data/PredictionMarketData';
import { TradingDrawer } from './TradingDrawer';

const CATEGORY_COLORS: Record<SlotCategory, string> = {
  BoxOffice: 'hsla(45, 100%, 50%, 0.15)',
  SocialMedia: 'hsla(210, 100%, 50%, 0.15)',
  Paparazzi: 'hsla(320, 100%, 55%, 0.15)',
  Casting: 'hsla(280, 100%, 55%, 0.15)',
  Music: 'hsla(142, 100%, 39%, 0.15)',
  Trailer: 'hsla(17, 100%, 50%, 0.15)',
  IMDb: 'hsla(50, 100%, 50%, 0.15)',
  Fashion: 'hsla(340, 85%, 50%, 0.15)',
  Clash: 'hsla(0, 80%, 50%, 0.15)',
  Wildcard: 'hsla(180, 100%, 45%, 0.15)',
};

const CATEGORY_BORDER: Record<SlotCategory, string> = {
  BoxOffice: 'hsla(45, 100%, 50%, 0.4)',
  SocialMedia: 'hsla(210, 100%, 50%, 0.4)',
  Paparazzi: 'hsla(320, 100%, 55%, 0.4)',
  Casting: 'hsla(280, 100%, 55%, 0.4)',
  Music: 'hsla(142, 100%, 39%, 0.4)',
  Trailer: 'hsla(17, 100%, 50%, 0.4)',
  IMDb: 'hsla(50, 100%, 50%, 0.4)',
  Fashion: 'hsla(340, 85%, 50%, 0.4)',
  Clash: 'hsla(0, 80%, 50%, 0.4)',
  Wildcard: 'hsla(180, 100%, 45%, 0.4)',
};

export function PredictionCalendar() {
  const calendar = useMemo(() => generatePredictionCalendar(), []);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<{ name: string; side: 'yes' | 'no'; price: number } | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startDate = new Date(2026, 2, 1);
  const currentMonth = new Date(startDate);
  currentMonth.setMonth(currentMonth.getMonth() + monthOffset);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get days for current month view
  const monthDays = useMemo(() => {
    return calendar.filter(d => {
      return d.date.getMonth() === currentMonth.getMonth() && d.date.getFullYear() === currentMonth.getFullYear();
    });
  }, [calendar, monthOffset]);

  const selectedDay = calendar[selectedDayIndex];

  const handleBet = (slot: PredictionSlot, side: 'yes' | 'no') => {
    setSelectedBet({
      name: slot.question,
      side,
      price: side === 'yes' ? slot.yesPrice : slot.noPrice,
    });
    setDrawerOpen(true);
  };

  const handleDayClick = (day: DayPredictions) => {
    const idx = calendar.findIndex(d => d.date.getTime() === day.date.getTime());
    setSelectedDayIndex(idx);
    setExpandedDay(idx);
  };

  const totalEvents = calendar.length * 11; // 1 featured + 10 slots

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'hsla(45, 100%, 50%, 0.15)', border: '1px solid hsla(45, 100%, 50%, 0.3)' }}>
              <CalendarDays className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Prediction Calendar</h3>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                {totalEvents.toLocaleString()} events · 365 days
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'hsla(142, 100%, 39%, 0.1)', border: '1px solid hsla(142, 100%, 39%, 0.3)' }}>
            <Users className="w-3 h-3 text-market-green" />
            <span className="text-[10px] font-mono font-bold text-market-green">LIVE</span>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
            disabled={monthOffset === 0}
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ background: 'hsla(0, 0%, 0%, 0.05)' }}
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <span className="font-display font-bold text-foreground">{monthName}</span>
          <button
            onClick={() => setMonthOffset(Math.min(11, monthOffset + 1))}
            disabled={monthOffset >= 11}
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ background: 'hsla(0, 0%, 0%, 0.05)' }}
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-mono text-muted-foreground font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: monthDays.length > 0 ? monthDays[0].date.getDay() : 0 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {monthDays.map((day) => {
            const idx = calendar.findIndex(d => d.date.getTime() === day.date.getTime());
            const isSelected = idx === selectedDayIndex;
            const isToday = day.date.getDate() === new Date().getDate() && day.date.getMonth() === new Date().getMonth();
            return (
              <button
                key={day.date.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all relative ${
                  isSelected
                    ? 'text-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{
                  background: isSelected ? 'hsla(45, 100%, 50%, 0.25)' : 'hsla(0, 0%, 0%, 0.03)',
                  border: isSelected ? '1.5px solid hsla(45, 100%, 50%, 0.6)' : '1px solid transparent',
                  boxShadow: isSelected ? '0 0 12px hsla(45, 100%, 50%, 0.3)' : 'none',
                }}
              >
                <span className="font-mono text-[11px]">{day.date.getDate()}</span>
                <div className="flex gap-[2px] mt-0.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(45, 100%, 50%)' }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(210, 100%, 50%)' }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(320, 100%, 55%)' }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key={selectedDayIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Date Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-foreground">{selectedDay.dateStr}</h4>
              <span className="text-[10px] font-mono text-muted-foreground px-2 py-1 rounded-md" style={{ background: 'hsla(0, 0%, 0%, 0.05)' }}>
                11 markets
              </span>
            </div>

            {/* Featured Market */}
            <div className="glass-card-gold p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold">Featured Market</span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug">{selectedDay.featured.question}</p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                <span>Vol: {(selectedDay.featured.volume / 1000).toFixed(0)}K MP</span>
                <span>·</span>
                <span>{selectedDay.featured.liveTraders} traders</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleBet(selectedDay.featured, 'yes')} className="market-btn-yes flex-1 py-3 rounded-xl text-sm font-bold">
                  Yes {selectedDay.featured.yesPrice.toFixed(2)}
                </button>
                <button onClick={() => handleBet(selectedDay.featured, 'no')} className="market-btn-no flex-1 py-3 rounded-xl text-sm font-bold">
                  No {selectedDay.featured.noPrice.toFixed(2)}
                </button>
              </div>
            </div>

            {/* Prediction Slots */}
            <div className="space-y-2">
              {selectedDay.slots.map((slot) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl p-3 transition-all"
                  style={{
                    background: CATEGORY_COLORS[slot.category],
                    border: `1px solid ${CATEGORY_BORDER[slot.category]}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        {CATEGORY_LABELS[slot.category]}
                      </span>
                      <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">{slot.question}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] text-muted-foreground font-mono">
                        <span>{(slot.volume / 1000).toFixed(0)}K MP</span>
                        <span>·</span>
                        <span>{slot.liveTraders} live</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => handleBet(slot, 'yes')}
                        className="market-btn-yes px-3 py-1.5 rounded-lg text-[11px] font-bold"
                      >
                        Y {slot.yesPrice.toFixed(2)}
                      </button>
                      <button
                        onClick={() => handleBet(slot, 'no')}
                        className="market-btn-no px-3 py-1.5 rounded-lg text-[11px] font-bold"
                      >
                        N {slot.noPrice.toFixed(2)}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trading Drawer */}
      {selectedBet && (
        <TradingDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          marketName={selectedBet.name}
          side={selectedBet.side}
          price={selectedBet.price}
        />
      )}
    </div>
  );
}
