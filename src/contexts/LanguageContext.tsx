import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// UI translations
const translations: Record<string, Record<Language, string>> = {
  // App / Splash
  'app.tagline': { en: 'PREDICT • PLAY • WIN', hi: 'भविष्यवाणी • खेलो • जीतो' },
  
  // Nav
  'nav.games': { en: 'Games', hi: 'खेल' },
  'nav.collection': { en: 'Fashion', hi: 'फैशन' },
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.markets': { en: 'Markets', hi: 'बाज़ार' },
  'nav.calendar': { en: 'Calendar', hi: 'कैलेंडर' },
  'nav.charts': { en: 'Charts', hi: 'चार्ट्स' },
  'nav.social': { en: 'Leaders', hi: 'लीडर्स' },

  // Home
  'home.todaysNews': { en: "Today's News", hi: 'आज की खबरें' },
  'home.dailyRewards': { en: 'Daily Rewards', hi: 'दैनिक पुरस्कार' },
  'home.earnScript': { en: 'Earn Script', hi: 'स्क्रिप्ट कमाओ' },
  'home.readStoryToEarn': { en: 'Read a story to earn a Script!', hi: 'स्क्रिप्ट कमाने के लिए कहानी पढ़ो!' },

  // News Card
  'news.readStory': { en: 'READ THE STORY', hi: 'कहानी पढ़ो' },
  'news.minRead': { en: '2 min read', hi: '2 मिनट पढ़ें' },
  'news.spotlightQuiz': { en: 'Spotlight Quiz • +50 MP', hi: 'स्पॉटलाइट क्विज़ • +50 MP' },
  'news.selectAnswer': { en: 'Select your answer...', hi: 'अपना जवाब चुनो...' },
  'news.quizCorrect': { en: '+50 MP earned!', hi: '+50 MP अर्जित!' },
  'news.predictNow': { en: 'Predict Now', hi: 'अभी भविष्यवाणी करो' },
  'news.predicted': { en: 'Predicted:', hi: 'भविष्यवाणी:' },

  // Review Card
  'review.criticCorner': { en: "🎬 Critic's Corner", hi: '🎬 समीक्षक की नज़र' },
  'review.rateThis': { en: 'RATE THIS (+25 MP)', hi: 'रेटिंग दो (+25 MP)' },
  'review.verdictSubmitted': { en: 'Verdict Submitted', hi: 'फैसला दर्ज' },
  'review.rate': { en: 'Rate', hi: 'रेटिंग दो' },
  'review.submitVerdict': { en: 'SUBMIT VERDICT (+25 MP)', hi: 'फैसला दर्ज करो (+25 MP)' },
  'review.community': { en: 'Community', hi: 'समुदाय' },
  'review.action': { en: '🎬 Action', hi: '🎬 एक्शन' },
  'review.drama': { en: '🎭 Drama', hi: '🎭 ड्रामा' },
  'review.paisaVasool': { en: '💰 Paisa Vasool', hi: '💰 पैसा वसूल' },

  // Video Card
  'video.trailerDrop': { en: '🎬 Trailer Drop', hi: '🎬 ट्रेलर लॉन्च' },
  'video.watchTrailer': { en: 'Watch Trailer', hi: 'ट्रेलर देखो' },
  'video.buyTickets': { en: 'Buy Tickets', hi: 'टिकट खरीदो' },
  'video.predictOpening': { en: 'Predict Opening Day', hi: 'ओपनिंग डे की भविष्यवाणी' },

  // Prediction Drawer
  'predict.marketPrice': { en: 'Market Price', hi: 'बाज़ार मूल्य' },
  'predict.yourPrediction': { en: 'Your Prediction', hi: 'आपकी भविष्यवाणी' },
  'predict.stakeAmount': { en: 'Stake Amount', hi: 'दांव राशि' },
  'predict.potentialPayout': { en: 'Potential Payout', hi: 'संभावित भुगतान' },
  'predict.multiplier': { en: '1.85x multiplier', hi: '1.85x गुणक' },
  'predict.masalaPoints': { en: 'Masala Points', hi: 'मसाला पॉइंट्स' },
  'predict.confirm': { en: 'Confirm Prediction', hi: 'भविष्यवाणी पक्की करो' },
  'predict.confirmed': { en: 'Prediction Confirmed! 🎬', hi: 'भविष्यवाणी पक्की! 🎬' },
  'predict.insufficientBalance': { en: 'Insufficient Balance', hi: 'अपर्याप्त बैलेंस' },
  'predict.balance': { en: 'Balance:', hi: 'बैलेंस:' },

  // Games
  'games.title': { en: 'Game Zone', hi: 'गेम ज़ोन' },
  'games.subtitle': { en: 'Retro Cinema • Modern Neon', hi: 'रेट्रो सिनेमा • मॉडर्न नियॉन' },
  'games.count': { en: '10 games • 5 MP to play', hi: '10 खेल • 5 MP खेलने के लिए' },

  // Game names
  'game.paparazzi': { en: 'Paparazzi Chase', hi: 'पापाराज़ी चेज़' },
  'game.paparazzi.desc': { en: 'Dodge cameras as a star!', hi: 'कैमरों से बचो स्टार बनकर!' },
  'game.casting': { en: 'Casting Shuffle', hi: 'कास्टिंग शफ़ल' },
  'game.casting.desc': { en: 'Match celebrity pairs', hi: 'सेलेब्रिटी जोड़ी मिलाओ' },
  'game.dialogue': { en: 'Dialogue Dash', hi: 'डायलॉग डैश' },
  'game.dialogue.desc': { en: 'Unscramble famous lines', hi: 'मशहूर डायलॉग सुलझाओ' },
  'game.boxoffice': { en: 'Box Office Tycoon', hi: 'बॉक्स ऑफिस टाइकून' },
  'game.boxoffice.desc': { en: 'Tap to sell tickets!', hi: 'टिकट बेचने के लिए टैप करो!' },
  'game.mystery': { en: 'Mystery Trailer', hi: 'रहस्यमय ट्रेलर' },
  'game.mystery.desc': { en: 'Guess the blurred movie', hi: 'धुंधली फिल्म पहचानो' },
  'game.heardle': { en: 'Bolly-Heardle', hi: 'बॉली-हर्डल' },
  'game.heardle.desc': { en: 'Name that tune!', hi: 'गाना पहचानो!' },
  'game.redcarpet': { en: 'Red Carpet Ranker', hi: 'रेड कार्पेट रैंकर' },
  'game.redcarpet.desc': { en: 'Vote on best looks', hi: 'बेस्ट लुक पर वोट करो' },
  'game.signature': { en: 'Signature Step', hi: 'सिग्नेचर स्टेप' },
  'game.signature.desc': { en: 'Hit the Gold Zone!', hi: 'गोल्ड ज़ोन में निशाना लगाओ!' },
  'game.script': { en: 'Script Doctor', hi: 'स्क्रिप्ट डॉक्टर' },
  'game.script.desc': { en: 'Make superhit choices', hi: 'सुपरहिट चुनाव करो' },
  'game.directors': { en: "Director's Cut", hi: 'डायरेक्टर्स कट' },
  'game.directors.desc': { en: 'Spin for prizes!', hi: 'इनाम के लिए स्पिन करो!' },

  // Markets
  'markets.title': { en: 'Markets', hi: 'बाज़ार' },
  'markets.search': { en: 'Search markets...', hi: 'बाज़ार खोजें...' },
  'markets.market': { en: 'Market', hi: 'बाज़ार' },
  'markets.24h': { en: '24h', hi: '24घंटे' },
  'markets.volume': { en: 'Volume', hi: 'वॉल्यूम' },
  'markets.trade': { en: 'Trade', hi: 'ट्रेड' },
  'markets.noResults': { en: 'No markets found matching your search.', hi: 'आपकी खोज से मेल खाने वाला कोई बाज़ार नहीं मिला।' },
  'markets.all': { en: 'All', hi: 'सभी' },
  'markets.boxOffice': { en: 'Box Office', hi: 'बॉक्स ऑफ़िस' },
  'markets.awards': { en: 'Awards', hi: 'पुरस्कार' },
  'markets.casting': { en: 'Casting', hi: 'कास्टिंग' },
  'markets.personalLife': { en: 'Personal Life', hi: 'निजी ज़िन्दगी' },

  // Leaderboard
  'leaderboard.title': { en: 'Leaderboards', hi: 'लीडरबोर्ड' },
  'leaderboard.subtitle': { en: "See who's on top", hi: 'देखो कौन है सबसे ऊपर' },
  'leaderboard.yourRank': { en: 'Your Rank', hi: 'आपकी रैंक' },
  'leaderboard.topVisitors': { en: 'Top Visitors', hi: 'टॉप विज़िटर्स' },
  'leaderboard.pointLegends': { en: 'Point Legends', hi: 'पॉइंट लेजेंड्स' },
  'leaderboard.predictionKings': { en: 'Prediction Kings', hi: 'प्रेडिक्शन किंग्स' },
  'leaderboard.superActive': { en: 'Super Active', hi: 'सुपर एक्टिव' },

  // Collection
  'collection.title': { en: 'Your Collection', hi: 'आपका संग्रह' },
  'collection.powerUps': { en: 'Your Power-Ups', hi: 'आपके पावर-अप्स' },
  'collection.noPowerUps': { en: 'No power-ups yet', hi: 'अभी कोई पावर-अप नहीं' },
  'collection.openReels': { en: 'Open Film Reels from Script Slots to earn power-ups!', hi: 'पावर-अप्स कमाने के लिए स्क्रिप्ट स्लॉट से फिल्म रील खोलो!' },
  'collection.items': { en: 'items', hi: 'आइटम' },
  'collection.uses': { en: 'uses', hi: 'उपयोग' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      <div style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', 'DM Sans', sans-serif" : "'DM Sans', sans-serif" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
