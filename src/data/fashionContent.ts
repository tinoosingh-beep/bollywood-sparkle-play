export interface FashionFaceoff {
  id: number;
  title: string;
  optionA: { label: string; image: string };
  optionB: { label: string; image: string };
  isTrending: boolean;
  /** Pre-seeded vote percentage for option A (0-100) */
  seedVoteA: number;
}

export const fashionFaceoffs: FashionFaceoff[] = [
  {
    id: 1,
    title: "Janhvi Kapoor's Cannes Glam vs. Airport Chic",
    optionA: {
      label: 'Cannes Glam',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop',
    },
    optionB: {
      label: 'Airport Chic',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop',
    },
    isTrending: true,
    seedVoteA: 62,
  },
  {
    id: 2,
    title: "Alia Bhatt's Sabyasachi Saree vs. Western Couture",
    optionA: {
      label: 'Sabyasachi Saree',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop',
    },
    optionB: {
      label: 'Western Couture',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=500&fit=crop',
    },
    isTrending: true,
    seedVoteA: 55,
  },
  {
    id: 3,
    title: "Ananya Panday's Streetwear vs. Traditional Lehengas",
    optionA: {
      label: 'Streetwear',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    },
    optionB: {
      label: 'Traditional Lehengas',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
    },
    isTrending: false,
    seedVoteA: 41,
  },
];
