import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Users, Gamepad2, TrendingUp, Target, Rocket, BarChart3, Zap, Download } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';

const GOLD = 'D4A017';
const DARK = '1E1B2E';
const MUTED = '6B6580';
const BG = 'F5ECD7';
const WHITE_CARD = 'FFFFFF';

function exportToPptx() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'BollyBet';
  pptx.title = 'BollyBet Pitch Deck';

  const addBg = (slide: PptxGenJS.Slide) => {
    slide.background = { color: BG };
  };

  // Slide 1: Title
  const s1 = pptx.addSlide();
  addBg(s1);
  s1.addText('✨', { x: 5.5, y: 1.5, w: 2, fontSize: 48, align: 'center' });
  s1.addText('BOLLYBET', { x: 2, y: 2.5, w: 9, fontSize: 60, bold: true, color: GOLD, align: 'center', fontFace: 'Arial' });
  s1.addText('Predict · Play · Win', { x: 2, y: 3.6, w: 9, fontSize: 24, color: DARK, align: 'center' });
  s1.addText("India's first gamified Bollywood prediction & entertainment platform", { x: 2.5, y: 4.3, w: 8, fontSize: 14, color: MUTED, align: 'center' });
  s1.addText('Seed Round  •  2026', { x: 4, y: 6, w: 5, fontSize: 11, color: MUTED, align: 'center', fontFace: 'Courier New' });

  // Slide 2: Problem
  const s2 = pptx.addSlide();
  addBg(s2);
  s2.addText('THE PROBLEM', { x: 0.8, y: 0.6, w: 5, fontSize: 11, color: 'CC3366', fontFace: 'Courier New', bold: true });
  s2.addText('Bollywood fans have no skin in the game.', { x: 0.8, y: 1.2, w: 10, fontSize: 36, bold: true, color: DARK });
  const problems = [
    { stat: '1.4B+', text: 'Indians consume entertainment daily, but engagement is passive — scroll, watch, forget.' },
    { stat: '₹0', text: 'Revenue generated from fan opinions. Predictions, debates, and hot takes stay on Twitter.' },
    { stat: '90%', text: 'of Gen-Z wants interactive entertainment, not just consumption.' },
  ];
  problems.forEach((p, i) => {
    const y = 2.8 + i * 1.2;
    s2.addShape(pptx.ShapeType.roundRect, { x: 0.8, y, w: 11, h: 1, fill: { color: WHITE_CARD }, rectRadius: 0.15, line: { color: 'E0D8C0', width: 1 } });
    s2.addText(p.stat, { x: 1, y: y + 0.15, w: 1.5, fontSize: 22, bold: true, color: GOLD });
    s2.addText(p.text, { x: 2.6, y: y + 0.2, w: 8.5, fontSize: 12, color: MUTED });
  });

  // Slide 3: Solution
  const s3 = pptx.addSlide();
  addBg(s3);
  s3.addText('THE SOLUTION', { x: 0.8, y: 0.6, w: 5, fontSize: 11, color: '00B3B3', fontFace: 'Courier New', bold: true });
  s3.addText('Turn every fan into a player.', { x: 0.8, y: 1.2, w: 10, fontSize: 36, bold: true, color: DARK });
  const solutions = [
    { title: 'Prediction Markets', desc: 'Bet virtual currency on box office results, awards, casting rumors.' },
    { title: '10+ Mini-Games', desc: 'Script Doctor, Paparazzi Chase, Bolly-Heardle — earn while you play.' },
    { title: 'Social Leaderboard', desc: 'Compete for bragging rights. Top predictors earn exclusive rewards.' },
  ];
  solutions.forEach((s, i) => {
    const x = 0.8 + i * 3.8;
    s3.addShape(pptx.ShapeType.roundRect, { x, y: 2.8, w: 3.4, h: 3, fill: { color: WHITE_CARD }, rectRadius: 0.15, line: { color: 'E0D8C0', width: 1 } });
    s3.addText(s.title, { x, y: 3.4, w: 3.4, fontSize: 16, bold: true, color: DARK, align: 'center' });
    s3.addText(s.desc, { x: x + 0.3, y: 4.1, w: 2.8, fontSize: 11, color: MUTED, align: 'center' });
  });

  // Slide 4: Market
  const s4 = pptx.addSlide();
  addBg(s4);
  s4.addText('MARKET OPPORTUNITY', { x: 0.8, y: 0.6, w: 5, fontSize: 11, color: GOLD, fontFace: 'Courier New', bold: true });
  s4.addText('A $28B opportunity.', { x: 0.8, y: 1.2, w: 10, fontSize: 36, bold: true, color: DARK });
  const markets = [
    { value: '$28B', label: 'Indian gaming market by 2028' },
    { value: '500M+', label: 'Mobile gamers in India' },
    { value: '₹19K Cr', label: 'Bollywood box office (2025)' },
    { value: '45min', label: 'Avg. daily entertainment time' },
  ];
  markets.forEach((m, i) => {
    const x = 0.8 + (i % 2) * 5.5;
    const y = 2.8 + Math.floor(i / 2) * 2;
    s4.addShape(pptx.ShapeType.roundRect, { x, y, w: 5, h: 1.6, fill: { color: WHITE_CARD }, rectRadius: 0.15, line: { color: 'E0D8C0', width: 1 } });
    s4.addText(m.value, { x, y: y + 0.2, w: 5, fontSize: 28, bold: true, color: GOLD, align: 'center' });
    s4.addText(m.label, { x, y: y + 0.95, w: 5, fontSize: 11, color: MUTED, align: 'center' });
  });

  // Slide 5: Business Model
  const s5 = pptx.addSlide();
  addBg(s5);
  s5.addText('BUSINESS MODEL', { x: 0.8, y: 0.6, w: 5, fontSize: 11, color: 'CC3366', fontFace: 'Courier New', bold: true });
  s5.addText('Multiple revenue streams.', { x: 0.8, y: 1.2, w: 10, fontSize: 36, bold: true, color: DARK });
  const revenue = [
    { pct: '40%', title: 'In-App Purchases', desc: 'Power-ups, premium spins, exclusive game modes' },
    { pct: '30%', title: 'Brand Partnerships', desc: 'Movie studios sponsor prediction markets' },
    { pct: '20%', title: 'Premium Subscription', desc: 'Ad-free, early access, exclusive leaderboards' },
    { pct: '10%', title: 'Data Licensing', desc: 'Anonymized fan sentiment data for studios' },
  ];
  revenue.forEach((r, i) => {
    const y = 2.6 + i * 1.15;
    s5.addShape(pptx.ShapeType.roundRect, { x: 0.8, y, w: 11, h: 0.95, fill: { color: WHITE_CARD }, rectRadius: 0.12, line: { color: 'E0D8C0', width: 1 } });
    s5.addText(r.pct, { x: 1, y: y + 0.15, w: 1.2, fontSize: 18, bold: true, color: GOLD, align: 'right' });
    s5.addText(r.title, { x: 2.5, y: y + 0.05, w: 8, fontSize: 14, bold: true, color: DARK });
    s5.addText(r.desc, { x: 2.5, y: y + 0.45, w: 8, fontSize: 11, color: MUTED });
  });

  // Slide 6: Traction
  const s6 = pptx.addSlide();
  addBg(s6);
  s6.addText('TRACTION & ROADMAP', { x: 0.8, y: 0.6, w: 5, fontSize: 11, color: '00B3B3', fontFace: 'Courier New', bold: true });
  s6.addText('Built fast. Moving faster.', { x: 0.8, y: 1.2, w: 10, fontSize: 36, bold: true, color: DARK });
  const phases = [
    { phase: 'NOW', title: 'MVP Live', items: '10 mini-games · Prediction markets · Leaderboards · News feed' },
    { phase: 'Q3 2026', title: 'Growth', items: 'User auth & profiles · Real currency markets · Studio partnerships' },
    { phase: 'Q1 2027', title: 'Scale', items: 'AI-powered predictions · Social features · Regional languages' },
  ];
  phases.forEach((p, i) => {
    const y = 2.8 + i * 1.5;
    s6.addShape(pptx.ShapeType.roundRect, { x: 0.8, y, w: 11, h: 1.2, fill: { color: i === 0 ? 'FDF6E3' : WHITE_CARD }, rectRadius: 0.12, line: { color: i === 0 ? GOLD : 'E0D8C0', width: 1 } });
    s6.addText(p.phase, { x: 1, y: y + 0.15, w: 1.5, fontSize: 11, bold: true, color: i === 0 ? GOLD : MUTED, fontFace: 'Courier New' });
    s6.addText(p.title, { x: 2.8, y: y + 0.1, w: 8, fontSize: 16, bold: true, color: DARK });
    s6.addText(p.items, { x: 2.8, y: y + 0.6, w: 8, fontSize: 11, color: MUTED });
  });

  // Slide 7: The Ask
  const s7 = pptx.addSlide();
  addBg(s7);
  s7.addText('🚀', { x: 5.5, y: 1, w: 2, fontSize: 40, align: 'center' });
  s7.addText('The Ask', { x: 3, y: 2, w: 7, fontSize: 44, bold: true, color: DARK, align: 'center' });
  s7.addShape(pptx.ShapeType.roundRect, { x: 4, y: 3.2, w: 5, h: 1.5, fill: { color: WHITE_CARD }, rectRadius: 0.2, line: { color: GOLD, width: 1.5 } });
  s7.addText('$500K', { x: 4, y: 3.3, w: 5, fontSize: 40, bold: true, color: GOLD, align: 'center' });
  s7.addText('Seed Round', { x: 4, y: 4.1, w: 5, fontSize: 14, color: MUTED, align: 'center' });
  const alloc = [
    { pct: '40%', label: 'Product & Eng' },
    { pct: '35%', label: 'Marketing' },
    { pct: '25%', label: 'Operations' },
  ];
  alloc.forEach((a, i) => {
    const x = 2.5 + i * 3;
    s7.addShape(pptx.ShapeType.roundRect, { x, y: 5.2, w: 2.5, h: 1.2, fill: { color: WHITE_CARD }, rectRadius: 0.12, line: { color: 'E0D8C0', width: 1 } });
    s7.addText(a.pct, { x, y: 5.3, w: 2.5, fontSize: 20, bold: true, color: GOLD, align: 'center' });
    s7.addText(a.label, { x, y: 5.8, w: 2.5, fontSize: 10, color: MUTED, align: 'center' });
  });
  s7.addText('hello@bollybet.app', { x: 3.5, y: 6.6, w: 6, fontSize: 13, color: DARK, align: 'center' });

  pptx.writeFile({ fileName: 'BollyBet_PitchDeck.pptx' });
}

const slides = [
  {
    id: 'title',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 40%, hsla(45, 100%, 55%, 0.4), transparent 60%)',
          }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, hsla(45, 100%, 55%, 0.2), hsla(340, 85%, 55%, 0.1))', border: '1px solid hsla(45, 100%, 55%, 0.3)' }}>
              <Sparkles className="w-10 h-10" style={{ color: 'hsl(45, 100%, 55%)' }} />
            </div>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-gradient-gold">
            BOLLYBET
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            Predict · Play · Win
          </p>
          <p className="text-base max-w-md mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
            India's first gamified Bollywood prediction & entertainment platform
          </p>
          <div className="mt-10 flex items-center gap-2 justify-center text-xs font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <span>Seed Round</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'problem',
    render: () => (
      <div className="flex flex-col justify-center h-full px-8 md:px-16">
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--crimson))' }}>The Problem</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-8" style={{ color: 'hsl(var(--foreground))' }}>
            Bollywood fans have <span className="text-gradient-gold">no skin in the game.</span>
          </h2>
          <div className="space-y-5">
            {[
              { stat: '1.4B+', label: 'Indians consume entertainment daily, but engagement is passive — scroll, watch, forget.' },
              { stat: '₹0', label: 'Revenue generated from fan opinions. Predictions, debates, and hot takes stay on Twitter.' },
              { stat: '90%', label: 'of Gen-Z wants interactive entertainment, not just consumption.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: 'hsla(0, 0%, 100%, 0.6)', border: '1px solid hsla(45, 30%, 85%, 0.8)' }}
              >
                <span className="font-display text-2xl font-bold text-gradient-gold whitespace-nowrap">{item.stat}</span>
                <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'solution',
    render: () => (
      <div className="flex flex-col justify-center h-full px-8 md:px-16">
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'hsl(180, 100%, 45%)' }}>The Solution</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-8" style={{ color: 'hsl(var(--foreground))' }}>
            Turn every fan into a <span className="text-gradient-gold">player.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, title: 'Prediction Markets', desc: 'Bet virtual currency on box office results, awards, casting rumors.' },
              { icon: Gamepad2, title: '10+ Mini-Games', desc: 'Script Doctor, Paparazzi Chase, Bolly-Heardle — earn while you play.' },
              { icon: Users, title: 'Social Leaderboard', desc: 'Compete for bragging rights. Top predictors earn exclusive rewards.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="p-5 rounded-xl text-center"
                style={{ background: 'hsla(0, 0%, 100%, 0.7)', border: '1px solid hsla(45, 30%, 85%, 0.8)' }}
              >
                <div className="inline-flex p-3 rounded-xl mb-3" style={{ background: 'linear-gradient(135deg, hsla(45, 100%, 55%, 0.15), hsla(180, 100%, 45%, 0.1))' }}>
                  <item.icon className="w-6 h-6" style={{ color: 'hsl(45, 100%, 50%)' }} />
                </div>
                <h3 className="font-display font-bold text-base mb-1" style={{ color: 'hsl(var(--foreground))' }}>{item.title}</h3>
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'market',
    render: () => (
      <div className="flex flex-col justify-center h-full px-8 md:px-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'hsl(45, 100%, 50%)' }}>Market Opportunity</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-8" style={{ color: 'hsl(var(--foreground))' }}>
            A <span className="text-gradient-gold">$28B</span> opportunity.
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { value: '$28B', label: 'Indian gaming market by 2028', icon: BarChart3 },
              { value: '500M+', label: 'Mobile gamers in India', icon: Users },
              { value: '₹19K Cr', label: 'Bollywood box office (2025)', icon: TrendingUp },
              { value: '45min', label: 'Avg. daily entertainment time', icon: Target },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="p-4 rounded-xl text-center"
                style={{ background: 'hsla(0, 0%, 100%, 0.7)', border: '1px solid hsla(45, 30%, 85%, 0.8)' }}
              >
                <item.icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'hsl(45, 100%, 50%)' }} />
                <p className="font-display text-2xl font-bold text-gradient-gold">{item.value}</p>
                <p className="text-[10px] mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'model',
    render: () => (
      <div className="flex flex-col justify-center h-full px-8 md:px-16">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--crimson))' }}>Business Model</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8" style={{ color: 'hsl(var(--foreground))' }}>
            Multiple <span className="text-gradient-gold">revenue streams.</span>
          </h2>
          <div className="space-y-3">
            {[
              { title: 'In-App Purchases', desc: 'Power-ups, premium spins, exclusive game modes', pct: '40%' },
              { title: 'Brand Partnerships', desc: 'Movie studios sponsor prediction markets for upcoming releases', pct: '30%' },
              { title: 'Premium Subscription', desc: 'Ad-free, early access, exclusive leaderboards', pct: '20%' },
              { title: 'Data Licensing', desc: 'Anonymized fan sentiment data for studios & distributors', pct: '10%' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'hsla(0, 0%, 100%, 0.6)', border: '1px solid hsla(45, 30%, 85%, 0.8)' }}
              >
                <span className="font-display text-xl font-bold text-gradient-gold w-12 text-right">{item.pct}</span>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-sm" style={{ color: 'hsl(var(--foreground))' }}>{item.title}</h3>
                  <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'traction',
    render: () => (
      <div className="flex flex-col justify-center h-full px-8 md:px-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'hsl(180, 100%, 45%)' }}>Traction & Roadmap</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8" style={{ color: 'hsl(var(--foreground))' }}>
            Built fast. <span className="text-gradient-gold">Moving faster.</span>
          </h2>
          <div className="space-y-4">
            {[
              { phase: 'NOW', title: 'MVP Live', items: ['10 mini-games', 'Prediction markets', 'Leaderboards', 'News feed'], done: true },
              { phase: 'Q3 2026', title: 'Growth', items: ['User auth & profiles', 'Real currency markets', 'Studio partnerships'], done: false },
              { phase: 'Q1 2027', title: 'Scale', items: ['AI-powered predictions', 'Social features', 'Regional language support'], done: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex gap-4 p-4 rounded-xl"
                style={{
                  background: item.done ? 'hsla(45, 100%, 55%, 0.08)' : 'hsla(0, 0%, 100%, 0.6)',
                  border: item.done ? '1px solid hsla(45, 100%, 55%, 0.3)' : '1px solid hsla(45, 30%, 85%, 0.8)',
                }}
              >
                <div className="text-center min-w-[60px]">
                  <p className="font-mono text-[10px] font-bold" style={{ color: item.done ? 'hsl(45, 100%, 50%)' : 'hsl(var(--muted-foreground))' }}>{item.phase}</p>
                  {item.done && <Zap className="w-4 h-4 mx-auto mt-1" style={{ color: 'hsl(45, 100%, 50%)' }} />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm mb-1" style={{ color: 'hsl(var(--foreground))' }}>{item.title}</h3>
                  <div className="flex flex-wrap gap-1">
                    {item.items.map((t, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'hsla(45, 30%, 90%, 0.8)', color: 'hsl(var(--muted-foreground))' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'ask',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(circle at 50% 50%, hsla(45, 100%, 55%, 0.4), transparent 60%)',
          }}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Rocket className="w-10 h-10 mx-auto mb-6" style={{ color: 'hsl(45, 100%, 55%)' }} />
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
            The <span className="text-gradient-gold">Ask</span>
          </h2>
          <div className="p-6 rounded-2xl mb-6 max-w-sm mx-auto" style={{ background: 'hsla(0, 0%, 100%, 0.7)', border: '1px solid hsla(45, 100%, 55%, 0.3)' }}>
            <p className="font-display text-4xl font-bold text-gradient-gold mb-1">$500K</p>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Seed Round</p>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
            {[
              { pct: '40%', label: 'Product & Eng' },
              { pct: '35%', label: 'Marketing' },
              { pct: '25%', label: 'Operations' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: 'hsla(0, 0%, 100%, 0.6)', border: '1px solid hsla(45, 30%, 85%, 0.8)' }}>
                <p className="font-display text-lg font-bold text-gradient-gold">{item.pct}</p>
                <p className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
            hello@bollybet.app
          </p>
        </motion.div>
      </div>
    ),
  },
];

export function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: 'linear-gradient(180deg, hsl(40, 75%, 92%), hsl(35, 60%, 87%))' }}>
      {/* Slide */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {slides[current].render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4" style={{ background: 'hsla(0, 0%, 100%, 0.5)', borderTop: '1px solid hsla(45, 30%, 85%, 0.8)' }}>
        <button onClick={prev} disabled={current === 0} className="p-2 rounded-full transition-opacity disabled:opacity-20" style={{ color: 'hsl(var(--foreground))' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === current ? 'hsl(45, 100%, 50%)' : 'hsla(45, 30%, 70%, 0.4)',
                transform: i === current ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToPptx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, hsl(45, 100%, 55%), hsl(40, 100%, 50%))', color: 'hsl(250, 30%, 12%)' }}
          >
            <Download className="w-3.5 h-3.5" />
            .pptx
          </button>
          <button onClick={next} disabled={current === total - 1} className="p-2 rounded-full transition-opacity disabled:opacity-20" style={{ color: 'hsl(var(--foreground))' }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
