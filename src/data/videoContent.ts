export type VideoCardType = 'trailer' | 'clip' | 'review';

export interface VideoItem {
  id: string;
  cardType: VideoCardType;
  title: string;
  movieName: string;
  thumbnail: string;
  videoUrl: string;
  duration: number; // seconds
  // Trailer-specific
  watchLink?: string;
  ticketLink?: string;
  releaseDate?: string;
  // Clip-specific
  streamingService?: string;
  streamingLink?: string;
  episodeInfo?: string;
  // Review-specific
  reviewerName?: string;
  reviewerAvatar?: string;
  rating?: number; // out of 5
  reviewSnippet?: string;
  // Shared prediction/poll
  predictionMarketQuestion: string;
  predictionMarketOptions: string[];
  initialYesPrice: number;
  pollQuestion: string;
  pollOptions: string[];
}

export const videoContent: VideoItem[] = [
  // === TRAILER CARDS ===
  {
    id: 'v1',
    cardType: 'trailer',
    title: 'Official Teaser',
    movieName: "Pathaan 2",
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 45,
    releaseDate: '2026-08-15',
    watchLink: 'https://www.youtube.com/results?search_query=Pathaan+2+trailer',
    ticketLink: 'https://in.bookmyshow.com/',
    predictionMarketQuestion: "Will Pathaan 2 cross 500 Cr opening weekend?",
    predictionMarketOptions: ['SUPERHIT', 'FLOP'],
    initialYesPrice: 0.72,
    pollQuestion: "Hit or Flop?",
    pollOptions: ['🔥 HIT', '💀 FLOP'],
  },
  {
    id: 'v2',
    cardType: 'trailer',
    title: 'First Look Trailer',
    movieName: "Krrish 4",
    thumbnail: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 60,
    releaseDate: '2026-12-25',
    watchLink: 'https://www.youtube.com/results?search_query=Krrish+4+trailer',
    ticketLink: 'https://in.bookmyshow.com/',
    predictionMarketQuestion: "Will Krrish 4 revive the superhero genre in Bollywood?",
    predictionMarketOptions: ['Yes', 'No'],
    initialYesPrice: 0.55,
    pollQuestion: "Hit or Flop?",
    pollOptions: ['🔥 HIT', '💀 FLOP'],
  },

  // === CLIP CARDS ===
  {
    id: 'v3',
    cardType: 'clip',
    title: 'The Courtroom Confrontation',
    movieName: "Animal Park",
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 90,
    streamingService: 'Netflix',
    streamingLink: 'https://www.netflix.com/',
    episodeInfo: 'Scene from Act 2',
    predictionMarketQuestion: "Will Animal Park cross 1000 Cr worldwide?",
    predictionMarketOptions: ['SUPERHIT', 'FLOP'],
    initialYesPrice: 0.65,
    pollQuestion: "Hit or Flop?",
    pollOptions: ['🔥 HIT', '💀 FLOP'],
  },
  {
    id: 'v4',
    cardType: 'clip',
    title: 'Interval Block — Chase Sequence',
    movieName: "War 2",
    thumbnail: 'https://images.unsplash.com/photo-1518676590747-1e3dcf5a10e4?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 120,
    streamingService: 'JioCinema',
    streamingLink: 'https://www.jiocinema.com/',
    episodeInfo: 'Act 1 Finale',
    predictionMarketQuestion: "Will War 2 beat War 1 lifetime?",
    predictionMarketOptions: ['Yes', 'No'],
    initialYesPrice: 0.48,
    pollQuestion: "Better than War 1?",
    pollOptions: ['🔥 BETTER', '💀 WORSE'],
  },

  // === VIDEO REVIEW CARDS ===
  {
    id: 'v5',
    cardType: 'review',
    title: 'Honest Review — Was It Worth The Hype?',
    movieName: "Singham Again",
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 480,
    reviewerName: 'FilmyStar',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 3.5,
    reviewSnippet: 'The action is top-tier but the writing needed another draft. Rohit Shetty delivers spectacle over substance.',
    predictionMarketQuestion: "Will Singham Again enter 300 Cr club?",
    predictionMarketOptions: ['Yes', 'No'],
    initialYesPrice: 0.60,
    pollQuestion: "Agree with this review?",
    pollOptions: ['👍 AGREE', '👎 DISAGREE'],
  },
  {
    id: 'v6',
    cardType: 'review',
    title: 'Deep Dive — Cinematography Breakdown',
    movieName: "Dune: Prophecy S2",
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80',
    videoUrl: '',
    duration: 600,
    reviewerName: 'CinemaScope',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewSnippet: 'A visual masterpiece that pushes streaming cinematography to new heights. Every frame is a painting.',
    streamingService: 'JioCinema',
    streamingLink: 'https://www.jiocinema.com/',
    predictionMarketQuestion: "Will Dune Prophecy S2 win an Emmy?",
    predictionMarketOptions: ['Yes', 'No'],
    initialYesPrice: 0.70,
    pollQuestion: "Emmy-worthy?",
    pollOptions: ['🏆 YES', '❌ NO'],
  },
];
