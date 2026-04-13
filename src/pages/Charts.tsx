import { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { TrendingUp, Target, MessageCircle, Sparkles } from 'lucide-react';

const PREDICTION_MARKET_DATA = [
  { name: 'Box Office', value: 35, fill: 'hsl(var(--crimson))' },
  { name: 'Reviews & Ratings', value: 20, fill: 'hsl(var(--gold))' },
  { name: 'Release Clashes', value: 18, fill: 'hsl(var(--neon-cyan))' },
  { name: 'Award Predictions', value: 15, fill: 'hsl(210, 80%, 55%)' },
  { name: 'Casting Updates', value: 12, fill: 'hsl(280, 70%, 60%)' },
];

const SOCIAL_FEED_DATA = [
  { name: 'Celebrity Gossip', value: 28, fill: 'hsl(330, 80%, 60%)' },
  { name: 'Fashion & Style', value: 22, fill: 'hsl(var(--gold))' },
  { name: 'Controversies', value: 18, fill: 'hsl(var(--crimson))' },
  { name: 'BTS Content', value: 12, fill: 'hsl(var(--neon-cyan))' },
  { name: 'Personal Life', value: 10, fill: 'hsl(170, 70%, 50%)' },
  { name: 'TV Updates', value: 6, fill: 'hsl(210, 80%, 55%)' },
  { name: 'Lifestyle', value: 4, fill: 'hsl(280, 70%, 60%)' },
];

const ENGAGEMENT_RADAR = [
  { metric: 'Shareability', prediction: 70, social: 95 },
  { metric: 'Bet Volume', prediction: 95, social: 20 },
  { metric: 'Comments', prediction: 60, social: 90 },
  { metric: 'Time Spent', prediction: 85, social: 65 },
  { metric: 'Virality', prediction: 50, social: 88 },
  { metric: 'Repeat Visits', prediction: 80, social: 55 },
];

const CROSSOVER_DATA = [
  { category: 'Franchise News', market: 85, social: 90 },
  { category: 'Star Collabs', market: 75, social: 95 },
  { category: 'Remakes/Sequels', market: 80, social: 85 },
  { category: 'OTT vs Theatre', market: 90, social: 70 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground mb-1">{label || payload[0]?.name}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name || p.dataKey}: <span className="font-mono font-bold">{p.value}%</span>
        </p>
      ))}
    </div>
  );
};

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
          {title}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function Charts() {
  const pieLabel = ({ name, value }: any) => `${value}%`;

  return (
    <div className="flex flex-col gap-8 animate-slide-up pb-4">
      {/* Page Header */}
      <div>
        <h1
          className="text-3xl font-bold uppercase tracking-wider"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            background: 'linear-gradient(135deg, hsl(var(--gold)), hsl(var(--crimson)))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Content Intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Story type distribution across prediction markets &amp; social feeds
        </p>
      </div>

      {/* 1. Prediction Market Pie */}
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
        <SectionHeader icon={Target} title="Prediction Market Stories" subtitle="Quantifiable outcomes that drive betting volume" />
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={PREDICTION_MARKET_DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              label={pieLabel}
              labelLine={false}
            >
              {PREDICTION_MARKET_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {PREDICTION_MARKET_DATA.map((d) => (
            <span key={d.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Social Feed Bar Chart */}
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
        <SectionHeader icon={MessageCircle} title="Social Feed Distribution" subtitle="Emotional engagement drivers for the general news feed" />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={SOCIAL_FEED_DATA} layout="vertical" margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
              {SOCIAL_FEED_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Engagement Radar */}
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
        <SectionHeader icon={Sparkles} title="Engagement Radar" subtitle="Prediction markets vs social feed engagement patterns" />
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={ENGAGEMENT_RADAR}>
            <PolarGrid stroke="hsl(var(--border))" opacity={0.3} />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Prediction" dataKey="prediction" stroke="hsl(var(--crimson))" fill="hsl(var(--crimson))" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Social" dataKey="social" stroke="hsl(var(--neon-cyan))" fill="hsl(var(--neon-cyan))" fillOpacity={0.2} strokeWidth={2} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-1 rounded-full" style={{ background: 'hsl(var(--crimson))' }} /> Prediction
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-1 rounded-full" style={{ background: 'hsl(var(--neon-cyan))' }} /> Social
          </span>
        </div>
      </div>

      {/* 4. Crossover Stories */}
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
        <SectionHeader icon={TrendingUp} title="Crossover Stories" subtitle="High-value stories that work for both feeds" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CROSSOVER_DATA} margin={{ left: 0, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="category" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="market" name="Market" fill="hsl(var(--crimson))" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="social" name="Social" fill="hsl(var(--neon-cyan))" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(var(--crimson))' }} /> Market
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(var(--neon-cyan))' }} /> Social
          </span>
        </div>
      </div>

      {/* Key Insight */}
      <div
        className="rounded-2xl p-4 text-center"
        style={{
          background: 'linear-gradient(135deg, hsla(var(--crimson), 0.1), hsla(var(--gold), 0.1))',
          border: '1px solid hsla(var(--gold), 0.3)',
        }}
      >
        <p className="text-xs text-muted-foreground mb-1">Key Insight</p>
        <p className="text-sm font-semibold text-foreground">
          Prediction markets need <span className="text-crimson">quantifiable outcomes</span> (box office, ratings, awards),
          while social feeds thrive on <span className="text-neon-cyan">emotional engagement</span> (gossip, style, drama).
        </p>
      </div>
    </div>
  );
}
