import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Star, Coffee, Paperclip, PenTool, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useBalance } from '@/contexts/BalanceContext';

interface ScriptDoctorProps {
  onClose: () => void;
}

interface ScriptLine {
  id: number;
  character: string;
  dialogue: string;
  isWeak: boolean;
  weakReason: string;
  isRedlined: boolean;
  fixOptions?: string[];
  selectedFix?: number;
}

interface ScriptScenario {
  title: string;
  genre: string;
  scene: string;
  lines: Omit<ScriptLine, 'isRedlined' | 'selectedFix'>[];
  budgetImpact: Record<number, number>; // line id -> budget change when fixed
  receptionImpact: Record<number, number>; // line id -> reception change when fixed
}

const scenarios: ScriptScenario[] = [
  {
    title: 'JAWAN 2: THE RETURN',
    genre: 'Action Thriller',
    scene: 'INT. ABANDONED FACTORY - NIGHT',
    lines: [
      { id: 1, character: 'VIKRAM', dialogue: 'I told you once before... I never forgive.', isWeak: false, weakReason: '', fixOptions: [] },
      { id: 2, character: 'NAINA', dialogue: 'Oh no, the villain is here! What do we do now?!', isWeak: true, weakReason: 'Expository & on-the-nose — audience can see the villain', fixOptions: ['We need to move. Now.', 'He found us. Cover the exits.', 'Stay behind me. Don\'t make a sound.'] },
      { id: 3, character: 'VIKRAM', dialogue: 'I will fight him with my special power that I got from the training.', isWeak: true, weakReason: 'Tells instead of shows — clunky exposition dump', fixOptions: ['(cracks knuckles, no dialogue — just a look)', 'Remember what the Colonel taught us.', 'I didn\'t survive that hell for nothing.'] },
      { id: 4, character: 'VILLAIN', dialogue: 'You cannot defeat me, Vikram! I am too powerful!', isWeak: true, weakReason: 'Generic villain dialogue — no menace or personality', fixOptions: ['You look tired, Vikram. Like your father did... at the end.', 'Every hero I\'ve buried thought they were special.', '(laughs softly) You brought a conscience to a war.'] },
      { id: 5, character: 'NAINA', dialogue: '(whispers) Be careful...', isWeak: false, weakReason: '', fixOptions: [] },
      { id: 6, character: 'VIKRAM', dialogue: 'I am the hero and I always win in the end!', isWeak: true, weakReason: 'Breaks tension — too meta and self-aware', fixOptions: ['Not today. Not for you.', '(silence — charges forward)', 'This ends when I say it ends.'] },
    ],
    budgetImpact: { 2: -5, 3: 10, 4: 0, 6: -8 },
    receptionImpact: { 2: 12, 3: 15, 4: 18, 6: 14 },
  },
  {
    title: 'DILWALE DULHANIA LE JAYENGE... AGAIN',
    genre: 'Romantic Comedy',
    scene: 'EXT. MUSTARD FIELDS, PUNJAB - GOLDEN HOUR',
    lines: [
      { id: 1, character: 'RAJ', dialogue: 'Simran... I\'ve come a long way.', isWeak: false, weakReason: '', fixOptions: [] },
      { id: 2, character: 'SIMRAN', dialogue: 'I am feeling very emotional right now because you came here!', isWeak: true, weakReason: 'Over-explains emotion — let the moment breathe', fixOptions: ['(tears welling) You actually came...', 'I thought... I thought you\'d forgotten.', '(laughs through tears) You\'re late.'] },
      { id: 3, character: 'RAJ', dialogue: 'I love you and I want to marry you and live happily ever after!', isWeak: true, weakReason: 'Rushing through beats — each deserves its own moment', fixOptions: ['Come home with me.', 'I\'m not leaving without you. Not this time.', '(extends hand) Ja Simran, ja... mere saath.'] },
      { id: 4, character: 'BAUJI', dialogue: 'Who is this boy and why is he in my field?!', isWeak: true, weakReason: 'Misses comedic & dramatic potential for the father', fixOptions: ['(long pause, stares at Raj) ...You have your father\'s stubbornness.', 'Palat. If he turns around, he\'s worthy.', '(to Simran) Is this the one? The one you cry about at night?'] },
      { id: 5, character: 'SIMRAN', dialogue: 'Papa, please listen to me...', isWeak: false, weakReason: '', fixOptions: [] },
      { id: 6, character: 'RAJ', dialogue: 'Sir, I am a good person and I deserve your daughter!', isWeak: true, weakReason: 'Entitled tone — should earn respect, not demand it', fixOptions: ['I won\'t take her, sir. She\'ll choose. And I\'ll wait.', '(touches Bauji\'s feet silently)', 'I know I\'m not enough. But I\'ll spend my life trying to be.'] },
    ],
    budgetImpact: { 2: -3, 3: -5, 4: 15, 6: 0 },
    receptionImpact: { 2: 10, 3: 16, 4: 20, 6: 12 },
  },
  {
    title: 'SPIRIT OF MUMBAI',
    genre: 'Drama',
    scene: 'INT. CRAMPED CHAWL APARTMENT - DAWN',
    lines: [
      { id: 1, character: 'ARJUN', dialogue: '(stares at rejection letter, hands trembling)', isWeak: false, weakReason: '', fixOptions: [] },
      { id: 2, character: 'MA', dialogue: 'Beta, you failed again! This is very bad for our family!', isWeak: true, weakReason: 'Too blunt — a mother would mask her pain', fixOptions: ['(quietly folds the letter, places it aside) Chai?', 'Your father got rejected seven times before his first yes.', '(hums a lullaby while cooking, pretending she didn\'t see)'] },
      { id: 3, character: 'ARJUN', dialogue: 'I am sad because my dream is failing and nobody believes in me.', isWeak: true, weakReason: 'Telling emotions directly — show through action', fixOptions: ['(crumples letter, stares out at the city waking up)', 'I had one shot, Ma. One. And I blew it.', '(picks up his bag) I\'m going for a walk.'] },
      { id: 4, character: 'MA', dialogue: 'Don\'t give up, son. You can do it!', isWeak: true, weakReason: 'Generic motivational — needs specificity and weight', fixOptions: ['When your father built this house, the walls fell three times.', 'The city doesn\'t care who you are. Make it care.', '(hands him tiffin) Eat first. Revolution starts after breakfast.'] },
      { id: 5, character: 'ARJUN', dialogue: '(looks at his father\'s photo on the wall)', isWeak: false, weakReason: '', fixOptions: [] },
      { id: 6, character: 'ARJUN', dialogue: 'OK Ma, I will try again because you told me to!', isWeak: true, weakReason: 'Passive motivation — hero should find inner drive', fixOptions: ['(puts on shoes, eyes hard) Same time tomorrow. I\'ll be there.', '(touches father\'s photo, then walks out without a word)', 'One more time. But this time, my way.'] },
    ],
    budgetImpact: { 2: -2, 3: 0, 4: -3, 6: 5 },
    receptionImpact: { 2: 14, 3: 18, 4: 13, 6: 16 },
  },
];

export function ScriptDoctor({ onClose }: ScriptDoctorProps) {
  const [phase, setPhase] = useState<'intro' | 'reading' | 'editing' | 'results'>('intro');
  const [scenario, setScenario] = useState<ScriptScenario | null>(null);
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  const [budget, setBudget] = useState(50);
  const [reception, setReception] = useState(30);
  const [fixesApplied, setFixesApplied] = useState(0);
  const [wrongRedlines, setWrongRedlines] = useState(0);
  const [totalWeakLines, setTotalWeakLines] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const { deductPoints, addPoints, triggerFloatingPoints } = useBalance();

  const startGame = () => {
    if (!deductPoints(10)) return;
    const s = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenario(s);
    setLines(s.lines.map(l => ({ ...l, isRedlined: false, selectedFix: undefined })));
    setTotalWeakLines(s.lines.filter(l => l.isWeak).length);
    setBudget(50);
    setReception(30);
    setFixesApplied(0);
    setWrongRedlines(0);
    setSelectedLineId(null);
    setPhase('reading');
  };

  const handleRedline = useCallback((lineId: number) => {
    if (phase !== 'reading') return;
    const line = lines.find(l => l.id === lineId);
    if (!line || line.isRedlined) return;

    if (!line.isWeak) {
      setWrongRedlines(prev => prev + 1);
      setBudget(prev => Math.max(0, prev - 8));
      setReception(prev => Math.max(0, prev - 5));
    }

    setLines(prev => prev.map(l => l.id === lineId ? { ...l, isRedlined: true } : l));
  }, [phase, lines]);

  const proceedToEditing = () => {
    setPhase('editing');
    const firstWeak = lines.find(l => l.isWeak && l.isRedlined);
    if (firstWeak) setSelectedLineId(firstWeak.id);
  };

  const applyFix = (lineId: number, fixIndex: number) => {
    if (!scenario) return;
    setLines(prev => prev.map(l => l.id === lineId ? { ...l, selectedFix: fixIndex } : l));
    setBudget(prev => Math.min(100, Math.max(0, prev + (scenario.budgetImpact[lineId] || 0))));
    setReception(prev => Math.min(100, Math.max(0, prev + (scenario.receptionImpact[lineId] || 0))));
    setFixesApplied(prev => prev + 1);

    // Auto-advance to next unfixed weak redlined line
    const remaining = lines.filter(l => l.isWeak && l.isRedlined && l.id !== lineId && l.selectedFix === undefined);
    if (remaining.length > 0) {
      setSelectedLineId(remaining[0].id);
    } else {
      setSelectedLineId(null);
    }
  };

  const finishScript = () => {
    setPhase('results');
  };

  const correctRedlines = lines.filter(l => l.isWeak && l.isRedlined).length;
  const allWeakRedlined = correctRedlines === totalWeakLines;
  const allFixed = lines.filter(l => l.isWeak && l.isRedlined && l.selectedFix !== undefined).length === correctRedlines;

  useEffect(() => {
    if (phase === 'results') {
      const accuracyBonus = Math.round((correctRedlines / Math.max(1, totalWeakLines)) * 50);
      const penaltyForWrong = wrongRedlines * 10;
      const receptionBonus = Math.round(reception * 0.8);
      const total = Math.max(0, accuracyBonus + receptionBonus - penaltyForWrong);
      if (total > 0) {
        addPoints(total);
        if (gameRef.current) {
          const rect = gameRef.current.getBoundingClientRect();
          triggerFloatingPoints(total, rect.left + rect.width / 2, rect.top);
        }
      }
    }
  }, [phase]);

  const selectedLine = lines.find(l => l.id === selectedLineId);

  return (
    <div ref={gameRef} className="space-y-3 font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace" }}>
      {/* === INTRO === */}
      {phase === 'intro' && (
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(35 30% 85%), hsl(40 25% 78%))' }}>
            <PenTool className="w-10 h-10" style={{ color: 'hsl(25 60% 35%)' }} />
            <Paperclip className="w-5 h-5 absolute -top-2 -right-2 rotate-45" style={{ color: 'hsl(0 0% 60%)' }} />
          </div>
          <h3 className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>The Writer's Room</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Read the script. <span className="text-destructive font-semibold">Redline</span> weak dialogue.
            Then rewrite it. Watch the stakes shift in real-time.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Budget</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Reception</span>
          </div>
          <Button onClick={startGame} className="btn-neon-pink">
            Open Script (10 MP)
          </Button>
        </div>
      )}

      {/* === READING PHASE === */}
      {phase === 'reading' && scenario && (
        <div className="space-y-3">
          {/* Header bar */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{scenario.genre}</p>
              <p className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{scenario.title}</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'hsla(25, 60%, 35%, 0.1)' }}>
              <Coffee className="w-3 h-3" style={{ color: 'hsl(25 60% 35%)' }} />
              <span className="text-xs font-medium" style={{ color: 'hsl(25 60% 35%)' }}>Draft 1</span>
            </div>
          </div>

          {/* Stakes meters */}
          <StakesMeter budget={budget} reception={reception} />

          {/* Scene heading */}
          <div className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
            style={{ background: 'hsla(40, 25%, 80%, 0.4)', color: 'hsl(25 40% 30%)' }}>
            {scenario.scene}
          </div>

          {/* Script lines */}
          <div className="space-y-1 rounded-xl p-3 border"
            style={{
              background: 'linear-gradient(180deg, hsl(40 30% 95%), hsl(38 25% 92%))',
              borderColor: 'hsla(40, 30%, 75%, 0.6)',
              boxShadow: 'inset 0 2px 8px hsla(40, 20%, 70%, 0.3)',
            }}>
            {lines.map(line => (
              <motion.div
                key={line.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleRedline(line.id)}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                  line.isRedlined
                    ? line.isWeak
                      ? 'border-destructive/50'
                      : 'border-orange-400/50'
                    : 'border-transparent hover:border-muted-foreground/20'
                }`}
                style={{
                  background: line.isRedlined
                    ? line.isWeak
                      ? 'hsla(0, 80%, 50%, 0.08)'
                      : 'hsla(30, 80%, 50%, 0.08)'
                    : 'transparent',
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-xs uppercase shrink-0 mt-0.5"
                    style={{ color: 'hsl(25 60% 40%)', minWidth: 70 }}>
                    {line.character}
                  </span>
                  <span className={`text-xs leading-relaxed ${line.isRedlined && line.isWeak ? 'line-through opacity-60' : ''}`}
                    style={{ color: 'hsl(25 20% 20%)' }}>
                    {line.dialogue}
                  </span>
                  {line.isRedlined && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      {line.isWeak ? (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-destructive" />
                      ) : (
                        <span className="text-[10px] text-orange-500 font-bold shrink-0">GOOD LINE!</span>
                      )}
                    </motion.div>
                  )}
                </div>
                {line.isRedlined && line.isWeak && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[10px] text-destructive/80 mt-1 ml-[78px] italic"
                  >
                    ⚠ {line.weakReason}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>

          <p className="text-[10px] text-center text-muted-foreground">
            Tap lines to redline weak dialogue ({correctRedlines}/{totalWeakLines} found)
          </p>

          <Button onClick={proceedToEditing} className="w-full btn-neon-pink" disabled={correctRedlines === 0}>
            <PenTool className="w-4 h-4 mr-1" />
            Rewrite Redlines ({correctRedlines})
          </Button>
        </div>
      )}

      {/* === EDITING PHASE === */}
      {phase === 'editing' && scenario && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{scenario.title}</p>
            <span className="text-xs text-muted-foreground">Rewriting...</span>
          </div>

          <StakesMeter budget={budget} reception={reception} />

          {/* Script with fixes inline */}
          <div className="space-y-1 rounded-xl p-3 border"
            style={{
              background: 'linear-gradient(180deg, hsl(40 30% 95%), hsl(38 25% 92%))',
              borderColor: 'hsla(40, 30%, 75%, 0.6)',
            }}>
            {lines.map(line => (
              <div key={line.id} className="px-3 py-1.5">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-xs uppercase shrink-0 mt-0.5"
                    style={{ color: 'hsl(25 60% 40%)', minWidth: 70 }}>
                    {line.character}
                  </span>
                  {line.isWeak && line.isRedlined ? (
                    <div className="flex-1">
                      <span className="text-xs line-through opacity-40" style={{ color: 'hsl(25 20% 20%)' }}>
                        {line.dialogue}
                      </span>
                      {line.selectedFix !== undefined && line.fixOptions && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs font-medium mt-0.5"
                          style={{ color: 'hsl(150 60% 30%)' }}
                        >
                          {line.fixOptions[line.selectedFix]}
                        </motion.p>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs leading-relaxed" style={{ color: 'hsl(25 20% 20%)' }}>
                      {line.dialogue}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fix selector */}
          {selectedLine && selectedLine.fixOptions && selectedLine.selectedFix === undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl border space-y-2"
              style={{
                background: 'hsla(0, 0%, 100%, 0.9)',
                borderColor: 'hsla(320, 100%, 60%, 0.3)',
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-pink" />
                <span className="text-xs font-bold">Rewrite: <span className="text-muted-foreground font-normal">{selectedLine.character}'s line</span></span>
              </div>
              <div className="space-y-1.5">
                {selectedLine.fixOptions.map((fix, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyFix(selectedLine.id, i)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs border transition-all hover:border-neon-pink/40"
                    style={{
                      background: 'hsla(40, 20%, 96%, 0.8)',
                      borderColor: 'hsla(40, 20%, 80%, 0.5)',
                      color: 'hsl(25 20% 20%)',
                    }}
                  >
                    "{fix}"
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* No more lines to fix */}
          {!selectedLine && (
            <Button onClick={finishScript} className="w-full btn-gold">
              <FileText className="w-4 h-4 mr-1" /> Submit Final Draft
            </Button>
          )}
        </div>
      )}

      {/* === RESULTS === */}
      {phase === 'results' && scenario && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <ResultsCard
            scenario={scenario}
            budget={budget}
            reception={reception}
            correctRedlines={correctRedlines}
            totalWeakLines={totalWeakLines}
            wrongRedlines={wrongRedlines}
            fixesApplied={fixesApplied}
          />
          <div className="flex gap-2 justify-center">
            <Button onClick={startGame} className="btn-neon-pink text-xs">
              <RotateCcw className="w-3 h-3 mr-1" /> New Script
            </Button>
            <Button onClick={onClose} variant="outline" className="text-xs">Exit</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StakesMeter({ budget, reception }: { budget: number; reception: number }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2 rounded-lg border" style={{ background: 'hsla(40, 25%, 93%, 0.8)', borderColor: 'hsla(40, 30%, 80%, 0.5)' }}>
        <div className="flex items-center gap-1 mb-1">
          <DollarSign className="w-3 h-3" style={{ color: 'hsl(150 60% 35%)' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Budget</span>
          <span className="ml-auto text-xs font-bold" style={{ color: budget > 60 ? 'hsl(150 60% 35%)' : budget > 30 ? 'hsl(45 90% 45%)' : 'hsl(0 70% 50%)' }}>{budget}%</span>
        </div>
        <Progress value={budget} className="h-1.5" />
      </div>
      <div className="p-2 rounded-lg border" style={{ background: 'hsla(40, 25%, 93%, 0.8)', borderColor: 'hsla(40, 30%, 80%, 0.5)' }}>
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3 h-3" style={{ color: 'hsl(45 100% 50%)' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reception</span>
          <span className="ml-auto text-xs font-bold" style={{ color: reception > 60 ? 'hsl(150 60% 35%)' : reception > 30 ? 'hsl(45 90% 45%)' : 'hsl(0 70% 50%)' }}>{reception}%</span>
        </div>
        <Progress value={reception} className="h-1.5" />
      </div>
    </div>
  );
}

function ResultsCard({ scenario, budget, reception, correctRedlines, totalWeakLines, wrongRedlines, fixesApplied }: {
  scenario: ScriptScenario;
  budget: number;
  reception: number;
  correctRedlines: number;
  totalWeakLines: number;
  wrongRedlines: number;
  fixesApplied: number;
}) {
  const accuracyBonus = Math.round((correctRedlines / Math.max(1, totalWeakLines)) * 50);
  const penaltyForWrong = wrongRedlines * 10;
  const receptionBonus = Math.round(reception * 0.8);
  const total = Math.max(0, accuracyBonus + receptionBonus - penaltyForWrong);

  const verdict = reception >= 70 ? 'BLOCKBUSTER' : reception >= 50 ? 'SLEEPER HIT' : reception >= 30 ? 'AVERAGE' : 'FLOP';
  const verdictColor = reception >= 70 ? 'hsl(45 100% 50%)' : reception >= 50 ? 'hsl(150 60% 40%)' : reception >= 30 ? 'hsl(25 60% 50%)' : 'hsl(0 70% 50%)';

  return (
    <div className="p-4 rounded-xl border space-y-3"
      style={{
        background: 'linear-gradient(180deg, hsl(40 30% 95%), hsl(38 25% 90%))',
        borderColor: 'hsla(40, 30%, 70%, 0.5)',
      }}>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{scenario.title}</p>
        <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: verdictColor }}>{verdict}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded-lg" style={{ background: 'hsla(0, 0%, 100%, 0.6)' }}>
          <p className="text-[10px] text-muted-foreground">Redline Accuracy</p>
          <p className="font-bold text-sm">{correctRedlines}/{totalWeakLines}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'hsla(0, 0%, 100%, 0.6)' }}>
          <p className="text-[10px] text-muted-foreground">Fixes Applied</p>
          <p className="font-bold text-sm">{fixesApplied}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'hsla(0, 0%, 100%, 0.6)' }}>
          <p className="text-[10px] text-muted-foreground">False Redlines</p>
          <p className="font-bold text-sm text-destructive">{wrongRedlines}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'hsla(0, 0%, 100%, 0.6)' }}>
          <p className="text-[10px] text-muted-foreground">Final Reception</p>
          <p className="font-bold text-sm">{reception}%</p>
        </div>
      </div>

      <div className="text-center pt-2 border-t" style={{ borderColor: 'hsla(40, 30%, 80%, 0.5)' }}>
        <p className="text-gold font-bold text-xl">+{total} MP</p>
        <p className="text-[10px] text-muted-foreground">Accuracy {accuracyBonus} + Reception {receptionBonus} − Penalties {penaltyForWrong}</p>
      </div>
    </div>
  );
}
