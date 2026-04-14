// Mock data for Indian music charts

export const BOLLYWOOD_TOP_20 = [
  { rank: 1, title: 'Tauba Tauba', artist: 'Karan Aujla', streams: '48.2M', change: 0, movie: 'Bad Newz' },
  { rank: 2, title: 'Aaj Ki Raat', artist: 'Arijit Singh', streams: '42.1M', change: 1, movie: 'Stree 2' },
  { rank: 3, title: 'Sajni', artist: 'Arijit Singh', streams: '38.7M', change: -1, movie: 'Laapataa Ladies' },
  { rank: 4, title: 'Heeriye', artist: 'Jasleen Royal ft. Arijit Singh', streams: '35.4M', change: 2 },
  { rank: 5, title: 'Tere Vaaste', artist: 'Varun Jain', streams: '33.9M', change: 0, movie: 'Zara Hatke Zara Bachke' },
  { rank: 6, title: 'Chaleya', artist: 'Arijit Singh, Shilpa Rao', streams: '31.2M', change: -2, movie: 'Jawan' },
  { rank: 7, title: 'Akhiyaan Gulaab', artist: 'Mitraz', streams: '29.8M', change: 3, movie: 'Teri Baaton Mein Aisa Uljha Jiya' },
  { rank: 8, title: 'Tum Se Hi', artist: 'Mohit Chauhan', streams: '27.5M', change: 1 },
  { rank: 9, title: 'Naina', artist: 'Diljit Dosanjh', streams: '25.3M', change: -1, movie: 'Crew' },
  { rank: 10, title: 'Phir Aur Kya Chahiye', artist: 'Arijit Singh', streams: '24.1M', change: 0, movie: 'Zara Hatke Zara Bachke' },
  { rank: 11, title: 'Maan Meri Jaan', artist: 'King', streams: '22.8M', change: 2 },
  { rank: 12, title: 'O Maahi', artist: 'Arijit Singh', streams: '21.4M', change: -1, movie: 'Dunki' },
  { rank: 13, title: 'Apna Bana Le', artist: 'Arijit Singh', streams: '20.9M', change: 0, movie: 'Bhediya' },
  { rank: 14, title: 'Kesariya', artist: 'Arijit Singh', streams: '19.7M', change: -3, movie: 'Brahmastra' },
  { rank: 15, title: 'Tum Kya Mile', artist: 'Arijit Singh, Shreya Ghoshal', streams: '18.3M', change: 1, movie: 'Rocky Aur Rani Kii Prem Kahaani' },
  { rank: 16, title: 'Baarish Mein Tum', artist: 'Neha Kakkar, Rohanpreet', streams: '17.1M', change: 4 },
  { rank: 17, title: 'Ve Kamleya', artist: 'Arijit Singh, Shreya Ghoshal', streams: '16.5M', change: -1, movie: 'Rocky Aur Rani Kii Prem Kahaani' },
  { rank: 18, title: 'Jhoome Jo Pathaan', artist: 'Arijit Singh', streams: '15.9M', change: 0, movie: 'Pathaan' },
  { rank: 19, title: 'Zinda Band', artist: 'Siddharth Mahadevan', streams: '14.2M', change: 2, movie: 'Jawan' },
  { rank: 20, title: 'Dil Jhoom', artist: 'Vishal Mishra', streams: '13.8M', change: -2, movie: 'Gadar 2' },
];

export const TOP_ALBUMS = [
  { rank: 1, title: 'Stree 2 (OST)', artist: 'Various Artists', streams: '120M', weeks: 8 },
  { rank: 2, title: 'Bad Newz (OST)', artist: 'Various Artists', streams: '98M', weeks: 6 },
  { rank: 3, title: 'Aashiqui 3 (OST)', artist: 'Pritam', streams: '85M', weeks: 4 },
  { rank: 4, title: 'Ishq Vishk Rebound', artist: 'Various Artists', streams: '72M', weeks: 10 },
  { rank: 5, title: 'Khel Khel Mein', artist: 'Pritam', streams: '65M', weeks: 3 },
];

export const MOVIE_SOUNDTRACKS = [
  { movie: 'Stree 2', score: 92, songs: 6, topSong: 'Aaj Ki Raat' },
  { movie: 'Bad Newz', score: 88, songs: 5, topSong: 'Tauba Tauba' },
  { movie: 'Crew', score: 85, songs: 4, topSong: 'Naina' },
  { movie: 'Jawan', score: 82, songs: 5, topSong: 'Chaleya' },
  { movie: 'Dunki', score: 78, songs: 4, topSong: 'O Maahi' },
];

export const INDIE_ARTISTS = [
  { rank: 1, artist: 'Prateek Kuhad', streams: '15.2M', genre: 'Indie Pop', trending: true },
  { rank: 2, artist: 'When Chai Met Toast', streams: '12.8M', genre: 'Indie Folk', trending: true },
  { rank: 3, artist: 'The Local Train', streams: '11.4M', genre: 'Indie Rock', trending: false },
  { rank: 4, artist: 'Anuv Jain', streams: '10.9M', genre: 'Indie Pop', trending: true },
  { rank: 5, artist: 'Taba Chake', streams: '8.7M', genre: 'Indie Folk', trending: false },
  { rank: 6, artist: 'Seedhe Maut', streams: '8.2M', genre: 'Hip-Hop', trending: true },
  { rank: 7, artist: 'Ritviz', streams: '7.5M', genre: 'Electronic', trending: false },
  { rank: 8, artist: 'Mali', streams: '6.8M', genre: 'Indie Pop', trending: true },
  { rank: 9, artist: 'Hanumankind', streams: '6.1M', genre: 'Hip-Hop', trending: true },
  { rank: 10, artist: 'Bloodywood', streams: '5.4M', genre: 'Metal', trending: false },
];

export const INDIE_SINGLES = [
  { rank: 1, title: 'Kasoor', artist: 'Prateek Kuhad', streams: '8.5M' },
  { rank: 2, title: 'Khoj', artist: 'When Chai Met Toast', streams: '7.2M' },
  { rank: 3, title: 'Husn', artist: 'Anuv Jain', streams: '6.9M' },
  { rank: 4, title: 'Nahi Milta', artist: 'Seedhe Maut', streams: '6.1M' },
  { rank: 5, title: 'Udd Gaye', artist: 'Ritviz', streams: '5.8M' },
];

export const REGIONAL_PUNJABI = [
  { rank: 1, title: 'Softly', artist: 'Karan Aujla', streams: '52.1M', change: 0 },
  { rank: 2, title: 'Lover', artist: 'Diljit Dosanjh', streams: '45.3M', change: 1 },
  { rank: 3, title: 'Naina', artist: 'Diljit Dosanjh', streams: '38.7M', change: -1 },
  { rank: 4, title: 'GOAT', artist: 'Diljit Dosanjh', streams: '35.2M', change: 2 },
  { rank: 5, title: '295', artist: 'Sidhu Moose Wala', streams: '32.8M', change: 0 },
  { rank: 6, title: 'Mahi Mera', artist: 'AP Dhillon', streams: '30.1M', change: 3 },
  { rank: 7, title: 'Brown Munde', artist: 'AP Dhillon', streams: '28.4M', change: -2 },
  { rank: 8, title: 'No Love', artist: 'Shubh', streams: '26.7M', change: 0 },
];

export const REGIONAL_MARATHI = [
  { rank: 1, title: 'Zingaat', artist: 'Ajay-Atul', streams: '18.2M' },
  { rank: 2, title: 'Apsara Aali', artist: 'Bela Shende', streams: '14.5M' },
  { rank: 3, title: 'Deva Tujhya Gabharyala', artist: 'Shankar Mahadevan', streams: '12.1M' },
  { rank: 4, title: 'Wajle Ki Bara', artist: 'Shreya Ghoshal', streams: '10.8M' },
  { rank: 5, title: 'Kombdi Palali', artist: 'Vaishali Samant', streams: '9.4M' },
];

export const REGIONAL_OTHER = [
  { rank: 1, title: 'Arabic Kuthu', artist: 'Anirudh', streams: '42.1M', language: 'Tamil' },
  { rank: 2, title: 'Naatu Naatu', artist: 'Rahul Sipligunj', streams: '38.9M', language: 'Telugu' },
  { rank: 3, title: 'Butta Bomma', artist: 'Armaan Malik', streams: '35.2M', language: 'Telugu' },
  { rank: 4, title: 'Hukum', artist: 'Anirudh', streams: '31.7M', language: 'Tamil' },
  { rank: 5, title: 'Illuminati', artist: 'Dabzee, Sushin Shyam', streams: '28.3M', language: 'Malayalam' },
];

export const TRENDING_REELS = [
  { rank: 1, title: 'Tauba Tauba Hook', uses: '2.8M', trend: 'up', platform: 'Instagram' },
  { rank: 2, title: 'Aaj Ki Raat Remix', uses: '2.1M', trend: 'up', platform: 'Instagram' },
  { rank: 3, title: 'Maan Meri Jaan Slowed', uses: '1.9M', trend: 'stable', platform: 'Instagram' },
  { rank: 4, title: 'Softly Challenge', uses: '1.7M', trend: 'up', platform: 'Instagram' },
  { rank: 5, title: 'Husn Edit Audio', uses: '1.5M', trend: 'down', platform: 'Instagram' },
];

export const TRENDING_SHORTS = [
  { rank: 1, title: 'Tauba Tauba Dance', views: '45M', trend: 'up' },
  { rank: 2, title: 'Stree 2 BGM', views: '38M', trend: 'up' },
  { rank: 3, title: 'Diljit Live Mashup', views: '32M', trend: 'stable' },
  { rank: 4, title: 'Indie Medley Cover', views: '28M', trend: 'up' },
  { rank: 5, title: 'Bollywood 90s Remix', views: '24M', trend: 'down' },
];

export const VIRAL_SOUNDS = [
  { rank: 1, title: 'Tauba Tauba Sped Up', uses: '5.2M', origin: 'Bollywood', daysViral: 14 },
  { rank: 2, title: 'Just Chill Chill', uses: '4.1M', origin: 'Meme', daysViral: 21 },
  { rank: 3, title: 'Husn Lofi', uses: '3.8M', origin: 'Indie', daysViral: 30 },
  { rank: 4, title: 'Naatu Naatu Beat', uses: '3.2M', origin: 'Regional', daysViral: 45 },
  { rank: 5, title: 'Brown Munde Bass', uses: '2.9M', origin: 'Punjabi', daysViral: 60 },
];

export const GLOBAL_SPOTIFY_INDIAN = [
  { rank: 42, title: 'Tauba Tauba', artist: 'Karan Aujla', globalStreams: '12.1M', peakRank: 38 },
  { rank: 67, title: 'Softly', artist: 'Karan Aujla', globalStreams: '8.4M', peakRank: 55 },
  { rank: 89, title: 'Lover', artist: 'Diljit Dosanjh', globalStreams: '6.2M', peakRank: 72 },
  { rank: 112, title: 'Aaj Ki Raat', artist: 'Arijit Singh', globalStreams: '5.1M', peakRank: 98 },
  { rank: 145, title: 'Maan Meri Jaan', artist: 'King', globalStreams: '4.3M', peakRank: 120 },
];

export const GLOBAL_YOUTUBE_INDIAN = [
  { rank: 8, title: 'Tauba Tauba (Official Video)', artist: 'Karan Aujla', views: '180M', daysOnChart: 28 },
  { rank: 15, title: 'Aaj Ki Raat - Stree 2', artist: 'Arijit Singh', views: '145M', daysOnChart: 21 },
  { rank: 23, title: 'Softly', artist: 'Karan Aujla', views: '120M', daysOnChart: 35 },
  { rank: 31, title: 'GOAT', artist: 'Diljit Dosanjh', views: '98M', daysOnChart: 42 },
  { rank: 48, title: 'Naina - Crew', artist: 'Diljit Dosanjh', views: '75M', daysOnChart: 18 },
];
