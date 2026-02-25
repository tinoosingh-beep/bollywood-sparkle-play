import { useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleEffect } from '@/components/SparkleEffect';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Gamepad2, 
  Camera, 
  Shuffle, 
  MessageSquare, 
  Ticket, 
  Eye, 
  Music, 
  Crown, 
  Target, 
  FileText, 
  Film 
} from 'lucide-react';
import {
  GameCard,
  GameModal,
  PaparazziChase,
  CastingShuffle,
  DialogueDash,
  BoxOfficeTycoon,
  MysteryTrailer,
  BollyHeardle,
  RedCarpetRanker,
  SignatureStep,
  ScriptDoctor,
  DirectorsCut,
} from '@/components/games';

type GameType = 
  | 'paparazzi' 
  | 'casting' 
  | 'dialogue' 
  | 'boxoffice' 
  | 'mystery' 
  | 'heardle' 
  | 'redcarpet' 
  | 'signature' 
  | 'script' 
  | 'directors' 
  | null;

const games = [
  { id: 'paparazzi' as const, titleKey: 'game.paparazzi', descKey: 'game.paparazzi.desc', icon: Camera, cost: 5, reward: '20-100 MP', category: 'action' as const, image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&auto=format&fit=crop&q=80' },
  { id: 'casting' as const, titleKey: 'game.casting', descKey: 'game.casting.desc', icon: Shuffle, cost: 5, reward: '20-100 MP', category: 'puzzle' as const, image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&auto=format&fit=crop&q=80' },
  { id: 'dialogue' as const, titleKey: 'game.dialogue', descKey: 'game.dialogue.desc', icon: MessageSquare, cost: 5, reward: '50 MP', category: 'puzzle' as const, image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&auto=format&fit=crop&q=80' },
  { id: 'boxoffice' as const, titleKey: 'game.boxoffice', descKey: 'game.boxoffice.desc', icon: Ticket, cost: 5, reward: '10-100 MP', category: 'action' as const, image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80' },
  { id: 'mystery' as const, titleKey: 'game.mystery', descKey: 'game.mystery.desc', icon: Eye, cost: 5, reward: '10-100 MP', category: 'puzzle' as const, image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&auto=format&fit=crop&q=80' },
  { id: 'heardle' as const, titleKey: 'game.heardle', descKey: 'game.heardle.desc', icon: Music, cost: 5, reward: '20-100 MP', category: 'puzzle' as const, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80' },
  { id: 'redcarpet' as const, titleKey: 'game.redcarpet', descKey: 'game.redcarpet.desc', icon: Crown, cost: 5, reward: '20-100 MP', category: 'rewards' as const, image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=80' },
  { id: 'signature' as const, titleKey: 'game.signature', descKey: 'game.signature.desc', icon: Target, cost: 5, reward: '15-90 MP', category: 'rewards' as const, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&auto=format&fit=crop&q=80' },
  { id: 'script' as const, titleKey: 'game.script', descKey: 'game.script.desc', icon: FileText, cost: 5, reward: '25-100 MP', category: 'rewards' as const, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80' },
  { id: 'directors' as const, titleKey: 'game.directors', descKey: 'game.directors.desc', icon: Film, cost: 5, reward: '5-100 MP', category: 'rewards' as const, image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&auto=format&fit=crop&q=80' },
];

export function Games() {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const { t } = useLanguage();

  const renderGame = () => {
    switch (activeGame) {
      case 'paparazzi':
        return <PaparazziChase onClose={() => setActiveGame(null)} />;
      case 'casting':
        return <CastingShuffle onClose={() => setActiveGame(null)} />;
      case 'dialogue':
        return <DialogueDash onClose={() => setActiveGame(null)} />;
      case 'boxoffice':
        return <BoxOfficeTycoon onClose={() => setActiveGame(null)} />;
      case 'mystery':
        return <MysteryTrailer onClose={() => setActiveGame(null)} />;
      case 'heardle':
        return <BollyHeardle onClose={() => setActiveGame(null)} />;
      case 'redcarpet':
        return <RedCarpetRanker onClose={() => setActiveGame(null)} />;
      case 'signature':
        return <SignatureStep onClose={() => setActiveGame(null)} />;
      case 'script':
        return <ScriptDoctor onClose={() => setActiveGame(null)} />;
      case 'directors':
        return <DirectorsCut onClose={() => setActiveGame(null)} />;
      default:
        return null;
    }
  };

  const getGameTitle = () => {
    const game = games.find(g => g.id === activeGame);
    return game ? t(game.titleKey) : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div 
          className="flex items-center justify-center gap-2 mb-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="icon-3d">
            <Gamepad2 className="w-8 h-8" />
          </div>
        </motion.div>
        <SparkleEffect count={5}>
          <h2 className="font-display-serif text-3xl font-bold text-gradient-gold">{t('games.title')}</h2>
        </SparkleEffect>
        <p className="text-muted-foreground mt-2">{t('games.subtitle')}</p>
        <p className="text-xs text-neon-pink mt-1">{t('games.count')}</p>
      </div>

      {/* 2-Column Grid with theatrical fan-out */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
        style={{ perspective: 800 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07, delayChildren: 0.15 }
          }
        }}
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            variants={{
              hidden: { opacity: 0, y: 40, rotateX: -12, scale: 0.9 },
              visible: { 
                opacity: 1, y: 0, rotateX: 0, scale: 1,
                transition: { type: 'spring' as const, stiffness: 260, damping: 20 }
              }
            }}
            style={{ transformOrigin: 'center bottom' }}
          >
            <GameCard
              title={t(game.titleKey)}
              description={t(game.descKey)}
              icon={game.icon}
              cost={game.cost}
              reward={game.reward}
              category={game.category}
              image={game.image}
              onClick={() => setActiveGame(game.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Game Modal */}
      <GameModal
        isOpen={activeGame !== null}
        onClose={() => setActiveGame(null)}
        title={getGameTitle()}
      >
        {renderGame()}
      </GameModal>
    </div>
  );
}
