import { NewsCard } from '@/components/NewsCard';

const newsItems = [
  {
    id: 1,
    title: "The Return of the Don? Shah Rukh Khan spotted with a mysterious script.",
    shortTitle: "SRK: Don Returns?",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
    category: "Exclusive",
    quiz: {
      question: "What was Shah Rukh Khan's first Don movie released?",
      options: ["Don (2006)", "Don 2 (2011)", "Don 3 (2023)", "Don: The Chase Begins (2005)"],
      correctIndex: 0,
    },
  },
  {
    id: 2,
    title: "Box Office Shock: Small-budget indie film 'Chai & Chaos' beats the blockbusters.",
    shortTitle: "Chai & Chaos: Blockbuster?",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&auto=format&fit=crop&q=80",
    category: "Box Office",
    quiz: {
      question: "Which city is famous for its film industry called 'Bollywood'?",
      options: ["Delhi", "Kolkata", "Mumbai", "Chennai"],
      correctIndex: 2,
    },
  },
  {
    id: 3,
    title: "Deepika's New Global Brand Deal: A look inside the Parisian photoshoot.",
    shortTitle: "Deepika: Global Icon?",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    category: "Fashion",
    quiz: {
      question: "Deepika Padukone made her Hollywood debut in which film?",
      options: ["Fast & Furious 7", "xXx: Return of Xander Cage", "Jurassic World", "Mission Impossible"],
      correctIndex: 1,
    },
  },
];

export function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-gradient-gold">Today's Gossip</h2>
        <p className="text-muted-foreground mt-2">Verify stories & predict outcomes</p>
      </div>

      <div className="space-y-5">
        {newsItems.map((item, index) => (
          <div key={item.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <NewsCard
              title={item.title}
              shortTitle={item.shortTitle}
              image={item.image}
              category={item.category}
              quiz={item.quiz}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
