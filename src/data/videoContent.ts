export interface VideoItem {
  id: string;
  title: string;
  movieName: string;
  thumbnail: string;
  videoUrl: string; // placeholder - real videos would go here
  duration: number; // seconds
  predictionMarketQuestion: string;
  predictionMarketOptions: string[];
  initialYesPrice: number;
  pollQuestion: string;
  pollOptions: string[];
}

export const videoContent: VideoItem[] = [
  {
    id: 'v1',
    title: 'Official Teaser',
    movieName: "Pathaan 2",
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 45,
    predictionMarketQuestion: "Will Pathaan 2 cross 500 Cr opening weekend?",
    predictionMarketOptions: ['SUPERHIT', 'FLOP'],
    initialYesPrice: 0.72,
    pollQuestion: "Hit or Flop?",
    pollOptions: ['🔥 HIT', '💀 FLOP'],
  },
  {
    id: 'v2',
    title: 'First Look Trailer',
    movieName: "Krrish 4",
    thumbnail: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 60,
    predictionMarketQuestion: "Will Krrish 4 revive the superhero genre in Bollywood?",
    predictionMarketOptions: ['Yes', 'No'],
    initialYesPrice: 0.55,
    pollQuestion: "Hit or Flop?",
    pollOptions: ['🔥 HIT', '💀 FLOP'],
  },
  {
    id: 'v3',
    title: 'Exclusive Trailer',
    movieName: "Animal Park",
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 50,
    predictionMarketQuestion: "Will Animal Park cross 1000 Cr worldwide?",
    predictionMarketOptions: ['SUPERHIT', 'FLOP'],
    initialYesPrice: 0.65,
    pollQuestion: "Hit or Flop?",
    pollOptions: ['🔥 HIT', '💀 FLOP'],
  },
];
