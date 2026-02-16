export interface NewsStory {
  id: number;
  headline: string;
  summary: string;
  image: string;
  category: string;
  type: 'bet' | 'vibe';
  vibeScore?: number;
  tags?: string[];
  expiryDate?: string;
  quizQuestion: string;
  correctAnswer: string;
  quizOptions?: string[];
  predictionMarketQuestion: string;
  predictionMarketOptions: string[];
  initialYesPrice: number;
}

import { titanClashStories } from './news/titanClash';
import { sequelSurgeStories } from './news/sequelSurge';
import { rumorMillStories } from './news/rumorMill';
import { ottVsTheatreStories } from './news/ottVsTheatre';
import { revivalVibeStories } from './news/revivalVibe';
import { realityTVStories } from './news/realityTV';
import { fashionStyleStories } from './news/fashionStyle';

export const newsContent: NewsStory[] = [
  ...titanClashStories,
  ...sequelSurgeStories,
  ...rumorMillStories,
  ...ottVsTheatreStories,
  ...revivalVibeStories,
  ...realityTVStories,
  ...fashionStyleStories,
];
