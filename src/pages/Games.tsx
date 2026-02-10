import { useState } from 'react';
import { motion } from 'framer-motion';
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
  {
    id: 'paparazzi' as const,
    title: 'Paparazzi Chase',
    description: 'Dodge cameras as a star!',
    icon: Camera,
    cost: 5,
    reward: '20-100 MP',
    category: 'action' as const,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'casting' as const,
    title: 'Casting Shuffle',
    description: 'Match celebrity pairs',
    icon: Shuffle,
    cost: 5,
    reward: '20-100 MP',
    category: 'puzzle' as const,
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dialogue' as const,
    title: 'Dialogue Dash',
    description: 'Unscramble famous lines',
    icon: MessageSquare,
    cost: 5,
    reward: '50 MP',
    category: 'puzzle' as const,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'boxoffice' as const,
    title: 'Box Office Tycoon',
    description: 'Tap to sell tickets!',
    icon: Ticket,
    cost: 5,
    reward: '10-100 MP',
    category: 'action' as const,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'mystery' as const,
    title: 'Mystery Trailer',
    description: 'Guess the blurred movie',
    icon: Eye,
    cost: 5,
    reward: '10-100 MP',
    category: 'puzzle' as const,
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'heardle' as const,
    title: 'Bolly-Heardle',
    description: 'Name that tune!',
    icon: Music,
    cost: 5,
    reward: '20-100 MP',
    category: 'puzzle' as const,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'redcarpet' as const,
    title: 'Red Carpet Ranker',
    description: 'Vote on best looks',
    icon: Crown,
    cost: 5,
    reward: '20-100 MP',
    category: 'rewards' as const,
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'signature' as const,
    title: 'Signature Step',
    description: 'Hit the Gold Zone!',
    icon: Target,
    cost: 5,
    reward: '15-90 MP',
    category: 'rewards' as const,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'script' as const,
    title: 'Script Doctor',
    description: 'Make superhit choices',
    icon: FileText,
    cost: 5,
    reward: '25-100 MP',
    category: 'rewards' as const,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'directors' as const,
    title: "Director's Cut",
    description: 'Spin for prizes!',
    icon: Film,
    cost: 5,
    reward: '5-100 MP',
    category: 'rewards' as const,
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&auto=format&fit=crop&q=80',
  },
];

export function Games() {
  const [activeGame, setActiveGame] = useState<GameType>(null);

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
    return game?.title || '';
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
        <h2 className="font-display text-3xl font-bold text-gradient-gold">Game Zone</h2>
        <p className="text-muted-foreground mt-2">Retro Cinema • Modern Neon</p>
        <p className="text-xs text-neon-pink mt-1">10 games • 5 MP to play</p>
      </div>

      {/* 2-Column Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <GameCard
              title={game.title}
              description={game.description}
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
