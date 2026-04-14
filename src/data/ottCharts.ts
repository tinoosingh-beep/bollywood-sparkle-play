export const NETFLIX_MOVIES = [
  { rank: 1, title: 'Singham Again', language: 'Hindi', weeks: 2, change: 0 },
  { rank: 2, title: 'Bhool Bhulaiyaa 3', language: 'Hindi', weeks: 3, change: 1 },
  { rank: 3, title: 'Amaran', language: 'Tamil', weeks: 4, change: -1 },
  { rank: 4, title: 'Lucky Bhaskar', language: 'Telugu', weeks: 2, change: 3 },
  { rank: 5, title: 'Vettaiyan', language: 'Tamil', weeks: 5, change: -1 },
  { rank: 6, title: 'Stree 2', language: 'Hindi', weeks: 8, change: 0 },
  { rank: 7, title: 'Devara Part 1', language: 'Telugu', weeks: 6, change: -2 },
  { rank: 8, title: 'Khel Khel Mein', language: 'Hindi', weeks: 3, change: 2 },
  { rank: 9, title: 'The Greatest Of All Time', language: 'Tamil', weeks: 7, change: -1 },
  { rank: 10, title: 'Auron Mein Kahan Dum Tha', language: 'Hindi', weeks: 4, change: 0 },
];

export const NETFLIX_SERIES = [
  { rank: 1, title: 'Black Warrant', language: 'Hindi', weeks: 1, change: 0 },
  { rank: 2, title: 'Kota Factory S3', language: 'Hindi', weeks: 3, change: 1 },
  { rank: 3, title: 'IC 814', language: 'Hindi', weeks: 5, change: -1 },
  { rank: 4, title: 'Maharaja', language: 'Tamil', weeks: 2, change: 2 },
  { rank: 5, title: 'Panchayat S3', language: 'Hindi', weeks: 6, change: -1 },
  { rank: 6, title: 'Mirzapur S3', language: 'Hindi', weeks: 4, change: 0 },
  { rank: 7, title: 'The Railway Men', language: 'Hindi', weeks: 8, change: -2 },
  { rank: 8, title: 'Guns & Gulaabs', language: 'Hindi', weeks: 7, change: 1 },
  { rank: 9, title: 'Rana Naidu', language: 'Telugu', weeks: 5, change: 0 },
  { rank: 10, title: 'Kohrra S2', language: 'Punjabi', weeks: 2, change: 3 },
];

export const PRIME_VIDEO = [
  { rank: 1, title: 'Citadel: Honey Bunny', language: 'Hindi', weeks: 2, change: 0 },
  { rank: 2, title: 'Mirzapur S3', language: 'Hindi', weeks: 4, change: 0 },
  { rank: 3, title: 'Panchayat S3', language: 'Hindi', weeks: 6, change: -1 },
  { rank: 4, title: 'Made In Heaven S2', language: 'Hindi', weeks: 8, change: 1 },
  { rank: 5, title: 'Farzi', language: 'Hindi', weeks: 10, change: -1 },
  { rank: 6, title: 'Jubilee', language: 'Hindi', weeks: 7, change: 2 },
  { rank: 7, title: 'Suzhal', language: 'Tamil', weeks: 5, change: 0 },
  { rank: 8, title: 'Modern Love Mumbai', language: 'Hindi', weeks: 9, change: -2 },
  { rank: 9, title: 'Bambai Meri Jaan', language: 'Hindi', weeks: 3, change: 1 },
  { rank: 10, title: 'Vadhandhi', language: 'Tamil', weeks: 6, change: 0 },
];

export const HOTSTAR_TRENDING = [
  { rank: 1, title: 'Lootere', language: 'Hindi', weeks: 1, change: 0 },
  { rank: 2, title: 'Karm Yuddh', language: 'Hindi', weeks: 3, change: 2 },
  { rank: 3, title: 'The Night Manager S2', language: 'Hindi', weeks: 2, change: -1 },
  { rank: 4, title: 'Grahan', language: 'Hindi', weeks: 5, change: 0 },
  { rank: 5, title: 'Criminal Justice S4', language: 'Hindi', weeks: 4, change: -1 },
  { rank: 6, title: 'Taaza Khabar S2', language: 'Hindi', weeks: 2, change: 3 },
  { rank: 7, title: 'Aar Ya Paar', language: 'Hindi', weeks: 6, change: -2 },
  { rank: 8, title: 'Star Wars: Skeleton Crew', language: 'English', weeks: 1, change: 0 },
  { rank: 9, title: 'Showtime', language: 'Hindi', weeks: 7, change: 0 },
  { rank: 10, title: 'Saas Bahu Aur Flamingo', language: 'Hindi', weeks: 9, change: -1 },
];

export const COMBINED_OTT: { rank: number; title: string; platform: string; language: string; score: number }[] = [
  { rank: 1, title: 'Black Warrant', platform: 'Netflix', language: 'Hindi', score: 98 },
  { rank: 2, title: 'Citadel: Honey Bunny', platform: 'Prime Video', language: 'Hindi', score: 95 },
  { rank: 3, title: 'Singham Again', platform: 'Netflix', language: 'Hindi', score: 92 },
  { rank: 4, title: 'Lootere', platform: 'Hotstar', language: 'Hindi', score: 89 },
  { rank: 5, title: 'Bhool Bhulaiyaa 3', platform: 'Netflix', language: 'Hindi', score: 87 },
  { rank: 6, title: 'Mirzapur S3', platform: 'Prime Video', language: 'Hindi', score: 85 },
  { rank: 7, title: 'Amaran', platform: 'Netflix', language: 'Tamil', score: 83 },
  { rank: 8, title: 'Kota Factory S3', platform: 'Netflix', language: 'Hindi', score: 80 },
  { rank: 9, title: 'Panchayat S3', platform: 'Prime Video', language: 'Hindi', score: 78 },
  { rank: 10, title: 'Lucky Bhaskar', platform: 'Netflix', language: 'Telugu', score: 75 },
];

export const LANGUAGE_BREAKDOWN = [
  { language: 'Hindi', count: 42, percentage: 52 },
  { language: 'Tamil', count: 15, percentage: 19 },
  { language: 'Telugu', count: 12, percentage: 15 },
  { language: 'Malayalam', count: 5, percentage: 6 },
  { language: 'Punjabi', count: 3, percentage: 4 },
  { language: 'English', count: 3, percentage: 4 },
];
