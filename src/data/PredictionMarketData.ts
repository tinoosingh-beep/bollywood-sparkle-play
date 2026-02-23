export type SlotCategory = 'BoxOffice' | 'SocialMedia' | 'Paparazzi' | 'Casting' | 'Music' | 'Trailer' | 'IMDb' | 'Fashion' | 'Clash' | 'Wildcard';

export interface PredictionSlot {
  id: string;
  category: SlotCategory;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  liveTraders: number;
}

export interface DayPredictions {
  date: Date;
  dateStr: string;
  featured: PredictionSlot;
  slots: PredictionSlot[];
}

const CATEGORIES: SlotCategory[] = ['BoxOffice', 'SocialMedia', 'Paparazzi', 'Casting', 'Music', 'Trailer', 'IMDb', 'Fashion', 'Clash', 'Wildcard'];

const CATEGORY_LABELS: Record<SlotCategory, string> = {
  BoxOffice: 'BO',
  SocialMedia: 'SOC',
  Paparazzi: 'PAP',
  Casting: 'CAST',
  Music: 'MUS',
  Trailer: 'TRA',
  IMDb: 'IMDB',
  Fashion: 'FAS',
  Clash: 'CLASH',
  Wildcard: 'WILD',
};

const ACTORS = ['Shah Rukh Khan', 'Alia Bhatt', 'Ranbir Kapoor', 'Deepika Padukone', 'Ranveer Singh', 'Kartik Aaryan', 'Vicky Kaushal', 'Kiara Advani', 'Hrithik Roshan', 'Tiger Shroff', 'Salman Khan', 'Akshay Kumar', 'Janhvi Kapoor', 'Sidharth Malhotra', 'Kriti Sanon'];
const MILESTONES_BO = ['cross 100Cr lifetime', 'beat Day 1 record', 'have 50%+ occupancy', 'enter 200Cr club', 'hold 40%+ in Week 2'];
const MILESTONES_SOC = ['gain 50k followers today', 'post get 1M+ likes', 'go viral on Twitter', 'trend #1 on Instagram', 'hit 10M reels views'];
const MILESTONES_PAP = ['be spotted at airport', 'attend a secret party', 'be seen at gym', 'arrive at awards show', 'be photographed with co-star'];
const MILESTONES_CAST = ['be cast in a YRF film', 'sign a 3-film deal', 'join a Marvel project', 'replace lead in sequel', 'debut as director'];
const MILESTONES_MUS = ['song hit #1 on Spotify', 'music video cross 10M views', 'title track trend on reels', 'collaborate with Arijit Singh', 'release surprise single'];
const MILESTONES_TRA = ['teaser cross 20M views in 24h', 'trailer break YouTube record', 'first look leak online', 'motion poster go viral', 'BTS clip trend'];
const MILESTONES_IMDB = ['film rated above 7.5', 'user reviews exceed 5K', 'enter Top 250 Indian films', 'rating drop below 5', 'get 8+ critic score'];
const MILESTONES_FAS = ['win best dressed at event', 'outfit go viral', 'launch fashion brand', 'appear on Vogue cover', 'set red carpet trend'];
const MILESTONES_CLASH = ['win the box office clash', 'dominate single screens', 'have higher screen count', 'lead in advance booking', 'win the Monday test'];
const MILESTONES_WILD = ['announce surprise project', 'break social media silence', 'confirm dating rumors', 'launch production house', 'appear on Koffee with Karan'];

const MILESTONES: Record<SlotCategory, string[]> = {
  BoxOffice: MILESTONES_BO,
  SocialMedia: MILESTONES_SOC,
  Paparazzi: MILESTONES_PAP,
  Casting: MILESTONES_CAST,
  Music: MILESTONES_MUS,
  Trailer: MILESTONES_TRA,
  IMDb: MILESTONES_IMDB,
  Fashion: MILESTONES_FAS,
  Clash: MILESTONES_CLASH,
  Wildcard: MILESTONES_WILD,
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateSlot(category: SlotCategory, dayIndex: number, slotIndex: number, rand: () => number): PredictionSlot {
  const actor = pick(ACTORS, rand);
  const milestone = pick(MILESTONES[category], rand);
  const yesPrice = Math.round((0.15 + rand() * 0.7) * 100) / 100;
  return {
    id: `d${dayIndex}-s${slotIndex}`,
    category,
    question: `Will ${actor} ${milestone}?`,
    yesPrice,
    noPrice: Math.round((1 - yesPrice) * 100) / 100,
    volume: Math.floor(rand() * 400000 + 10000),
    liveTraders: Math.floor(rand() * 1500 + 100),
  };
}

// Specific March 2026 events
interface MarchEvent {
  day: number;
  featured: string;
  slots: string[];
}

const MARCH_EVENTS: MarchEvent[] = [
  { day: 1, featured: "SAG Awards: Will a Bollywood actor (Alia/Deepika) be seen in the front row?", slots: ["Will the top film collect > 5Cr today?", "Will Kartik Aaryan gain +20k followers?", "Will Malaika be spotted at the gym?", "Will a new casting announcement drop?", "Will any Holi song start trending?", "Will Subedaar teaser cross 5M views?", "Will any new film cross 7.5 on IMDb?", "Will a celeb set a fashion trend today?", "Which film will lead the box office clash?", "Will any celeb make a surprise announcement?"] },
  { day: 2, featured: "Tiger Shroff B-Day: Will he announce Baaghi 5 before 6 PM?", slots: ["Will Sunday box office jump > 20%?", "Will Tiger's birthday post cross 1M likes?", "Will Tiger be spotted celebrating?", "Will a Baaghi 5 co-star be revealed?", "Will 'Holi' songs dominate Spotify?", "Will any new trailer drop today?", "Will Tiger's films trend on IMDb?", "Will Tiger's party outfit go viral?", "Will any two big releases clash today?", "Will Tiger announce a new project?"] },
  { day: 3, featured: "Holika Dahan: Which major celeb party will post the first photo?", slots: ["Will box office stay flat on Holika Dahan?", "Will Janhvi Kapoor's IG story count exceed 5?", "Will Ranbir-Alia host a Holi party?", "Will any casting news leak today?", "Will Holi playlists dominate charts?", "Will Subedaar teaser 24hr views > 5M?", "Will any film see a rating jump?", "Will any celeb debut a Holi look?", "Will a box office clash be announced?", "Will any celeb break social media silence?"] },
  { day: 4, featured: "Holi Festival: Will T-Series release a surprise 'Holi 2026' anthem?", slots: ["Will Holi cause a dip in collections?", "Will Ranbir/Alia be spotted at home party?", "Will paparazzi catch a Holi celebration?", "Will a new casting call go viral?", "Will a surprise Holi anthem drop?", "Will any teaser release on Holi?", "Will any film's IMDb rating change?", "Will a celeb's Holi outfit trend?", "Will two films clash on Holi weekend?", "Will a celeb confirm dating rumors on Holi?"] },
  { day: 5, featured: "Subedaar Release: Will Anil Kapoor's Day 1 earn more than 10Cr?", slots: ["Will Subedaar cross 10Cr on Day 1?", "Will Radhika Madan see a follower surge?", "Will Anil Kapoor be spotted promoting?", "Will Subedaar cast reveal a sequel hint?", "Will Subedaar title track hit #1 on Spotify?", "Will Subedaar trailer views spike?", "Will Subedaar IMDb rating > 7.5?", "Will premiere fashion go viral?", "Will Subedaar win the release clash?", "Will a surprise cameo be revealed?"] },
  { day: 13, featured: "Gabru Release: Will Sunny Deol's opening exceed Gadar 2 Day 1?", slots: ["Will Subedaar Week 2 hold > 40%?", "Will Sunny Deol trend on social media?", "Will SRK be spotted at the airport?", "Will a War 2 cast update drop?", "Will Gabru songs trend on release day?", "Will a new trailer surprise-drop?", "Will Gabru get > 7 on IMDb?", "Will Sunny's premiere look trend?", "Will Gabru vs holdovers be a clash?", "Will a celeb launch a production house?"] },
  { day: 15, featured: "98th Oscars: Will an Indian film/song win an Academy Award tonight?", slots: ["Will Indian films see an Oscars bump?", "Will the winner see a global follower spike?", "Will Indian celebs be at the ceremony?", "Will an Oscar win trigger casting buzz?", "Will an Indian song be performed live?", "Will Oscar buzz boost Indian trailers?", "Will the winning film top IMDb charts?", "Will best dressed Indian celeb trend?", "Will any Indian films clash at Oscars?", "Will an Indian celeb present an award?"] },
  { day: 19, featured: "Spy Universe Day: Dhurandhar vs Toxic (The Mega Clash). Who wins Day 1?", slots: ["Will combined Day 1 total > 60Cr?", "Will fan frenzy trend on Twitter?", "Will Ranveer vs Yash photos dominate?", "Will a new spy film be announced?", "Will either film's BGM go viral?", "Will both trailers trend simultaneously?", "Will Ranveer or Yash get higher screen time?", "Will premiere fashion steal the show?", "Will the clash break records?", "Will a surprise cameo leak?"] },
  { day: 20, featured: "Love & War: Will Bhansali's teaser reach 20M views in 24 hours?", slots: ["Will the Spy Universe clash continue?", "Will Ranbir Kapoor post a rare IG update?", "Will Vicky Kaushal's look leak?", "Will Love & War casting buzz spike?", "Will Love & War BGM trend on socials?", "Will the teaser break YouTube records?", "Will Love & War anticipation boost IMDb?", "Will Bhansali's aesthetic set trends?", "Will Love & War clash with any release?", "Will a surprise trailer drop today?"] },
  { day: 21, featured: "Eid-ul-Fitr: Will Salman Khan announce his 2027 Eid movie today?", slots: ["Will holiday occupancy > 80%?", "Will celeb Eid greetings go viral?", "Will Salman be spotted celebrating?", "Will a new casting buzz emerge?", "Will an Eid special song release?", "Will any trailer launch on Eid?", "Will any film see an Eid IMDb bump?", "Will a celeb's Eid outfit trend?", "Will films clash over Eid weekend?", "Will a celeb make a surprise Eid announcement?"] },
  { day: 26, featured: "IPL 2026 Kickoff: Will SRK be at the stadium for the KKR opener?", slots: ["Will IPL impact box office collections?", "Will viral fan moments trend?", "Will Preity Zinta vs SRK screen time battle?", "Will a celeb announce an IPL cameo?", "Will an IPL anthem go viral?", "Will a trailer launch at the stadium?", "Will any film tie-in with IPL?", "Will celeb stadium fashion trend?", "Will films clash with IPL weekend?", "Will a celeb buy a new IPL team?"] },
];

function getMarchSlots(day: number, rand: () => number): { featured: PredictionSlot; slots: PredictionSlot[] } | null {
  const event = MARCH_EVENTS.find(e => e.day === day);
  if (!event) return null;

  const yesPrice = Math.round((0.3 + rand() * 0.4) * 100) / 100;
  const featured: PredictionSlot = {
    id: `mar${day}-featured`,
    category: 'Wildcard',
    question: event.featured,
    yesPrice,
    noPrice: Math.round((1 - yesPrice) * 100) / 100,
    volume: Math.floor(rand() * 500000 + 50000),
    liveTraders: Math.floor(rand() * 3000 + 500),
  };

  const slotCategories: SlotCategory[] = ['BoxOffice', 'SocialMedia', 'Paparazzi', 'Casting', 'Music', 'Trailer', 'IMDb', 'Fashion', 'Clash', 'Wildcard'];
  const slots: PredictionSlot[] = event.slots.map((q, i) => {
    const yp = Math.round((0.2 + rand() * 0.6) * 100) / 100;
    return {
      id: `mar${day}-s${i}`,
      category: slotCategories[i],
      question: q,
      yesPrice: yp,
      noPrice: Math.round((1 - yp) * 100) / 100,
      volume: Math.floor(rand() * 300000 + 5000),
      liveTraders: Math.floor(rand() * 1500 + 100),
    };
  });

  return { featured, slots };
}

export function generatePredictionCalendar(): DayPredictions[] {
  const startDate = new Date(2026, 2, 1); // March 1, 2026
  const days: DayPredictions[] = [];

  for (let dayIndex = 0; dayIndex < 365; dayIndex++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    const rand = seededRandom(dayIndex * 1000 + 42);

    const month = date.getMonth(); // 0-indexed, March = 2
    const dayOfMonth = date.getDate();

    let featured: PredictionSlot;
    let slots: PredictionSlot[];

    // Check if it's March 2026 with specific events
    if (month === 2 && dayIndex < 31) {
      const marchData = getMarchSlots(dayOfMonth, rand);
      if (marchData) {
        featured = marchData.featured;
        slots = marchData.slots;
      } else {
        // Generic March day
        featured = generateSlot(pick(CATEGORIES, rand), dayIndex, 99, rand);
        slots = CATEGORIES.map((cat, i) => generateSlot(cat, dayIndex, i, rand));
      }
    } else {
      featured = generateSlot(pick(CATEGORIES, rand), dayIndex, 99, rand);
      slots = CATEGORIES.map((cat, i) => generateSlot(cat, dayIndex, i, rand));
    }

    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    days.push({ date, dateStr, featured, slots });
  }

  return days;
}

export { CATEGORY_LABELS };
