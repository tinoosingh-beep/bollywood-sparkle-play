export interface NewsStory {
  id: number;
  headline: string;
  summary: string;
  image: string;
  quizQuestion: string;
  correctAnswer: string;
  predictionMarketQuestion: string;
  predictionMarketOptions: string[];
  initialYesPrice: number;
}

export const newsContent: NewsStory[] = [
  {
    id: 1,
    headline: "SRK's 'Pathaan 2' Confirmed? YRF Teases a Major Announcement!",
    summary: "Whispers from Yash Raj Films suggest a sequel to the blockbuster 'Pathaan' is in early development, with Shah Rukh Khan rumored to reprise his role. Fans are speculating if the official announcement will drop this month.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+1",
    quizQuestion: "Which studio is rumored to be producing 'Pathaan 2'?",
    correctAnswer: "YRF",
    predictionMarketQuestion: "Will 'Pathaan 2' officially be announced by the end of next month?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.50
  },
  {
    id: 2,
    headline: "Deepika Padukone Joins Hollywood: Major International Project on the Horizon?",
    summary: "After her successful appearance at the Cannes Film Festival, reports indicate Deepika Padukone is in talks for a significant role in an upcoming Hollywood production. Details are under wraps, but sources say it's a genre-bending action film.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+2",
    quizQuestion: "Which major international film festival did Deepika recently attend?",
    correctAnswer: "Cannes",
    predictionMarketQuestion: "Will Deepika's Hollywood project be officially confirmed before year-end?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.60
  },
  {
    id: 3,
    headline: "Ranveer Singh's Transformation for Don 3 Stuns Industry Insiders!",
    summary: "Behind-the-scenes photos from the Don 3 set reveal Ranveer Singh's dramatic physical transformation. The actor has reportedly undergone intense training for months to embody the iconic character previously played by Amitabh Bachchan and SRK.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+3",
    quizQuestion: "Which iconic character is Ranveer transforming for?",
    correctAnswer: "Don",
    predictionMarketQuestion: "Will Don 3 break the 100 crore opening weekend record?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.72
  },
  {
    id: 4,
    headline: "Alia Bhatt Signs Three-Film Deal with Major Hollywood Studio!",
    summary: "Fresh off her international debut in 'Heart of Stone', Alia Bhatt has reportedly signed a multi-film contract with a leading Hollywood studio. Industry insiders suggest the deal includes a superhero franchise.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+4",
    quizQuestion: "What was Alia's international debut film called?",
    correctAnswer: "Heart of Stone",
    predictionMarketQuestion: "Will Alia appear in a Marvel or DC film within 2 years?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.35
  },
  {
    id: 5,
    headline: "Salman Khan's 'Tiger 4' to Feature International Action Stars!",
    summary: "YRF's Tiger franchise is going global with reports suggesting A-list Hollywood action stars are being approached for significant roles. Filming locations span five countries including Thailand and Morocco.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+5",
    quizQuestion: "How many countries will Tiger 4 reportedly be filmed in?",
    correctAnswer: "5",
    predictionMarketQuestion: "Will Tiger 4 become the highest-grossing Hindi film ever?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.45
  },
  {
    id: 6,
    headline: "Katrina Kaif's Kay Beauty Valued at $200 Million After New Investment!",
    summary: "Celebrity beauty brand Kay Beauty has secured a major investment round, valuing Katrina Kaif's venture at a staggering $200 million. The brand is now eyeing international expansion across Europe and the Middle East.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+6",
    quizQuestion: "What is the name of Katrina's beauty brand?",
    correctAnswer: "Kay Beauty",
    predictionMarketQuestion: "Will Kay Beauty IPO within the next 18 months?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.40
  },
  {
    id: 7,
    headline: "Hrithik Roshan's Krrish 4 Finally Gets Green Light!",
    summary: "After years of speculation, Rakesh Roshan has confirmed that Krrish 4 is moving into production. The superhero franchise will see Hrithik don the iconic mask once again, with VFX work being handled by a top Hollywood studio.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+7",
    quizQuestion: "Who directs the Krrish franchise?",
    correctAnswer: "Rakesh Roshan",
    predictionMarketQuestion: "Will Krrish 4 release before 2026?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.55
  },
  {
    id: 8,
    headline: "Priyanka Chopra Returns to Bollywood with Jee Le Zaraa!",
    summary: "The long-delayed road trip film 'Jee Le Zaraa' starring Priyanka Chopra, Alia Bhatt, and Katrina Kaif is back on track. Farhan Akhtar has reportedly locked the final script and shooting begins next quarter.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+8",
    quizQuestion: "Who is directing Jee Le Zaraa?",
    correctAnswer: "Farhan Akhtar",
    predictionMarketQuestion: "Will Jee Le Zaraa actually release in 2025?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.38
  },
  {
    id: 9,
    headline: "Ranbir Kapoor's Animal Park Promises Even Darker Territory!",
    summary: "Director Sandeep Reddy Vanga reveals that 'Animal Park', the sequel to the controversial blockbuster, will push boundaries even further. The script is described as 'twice as intense' as the original.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+9",
    quizQuestion: "Who directed Animal?",
    correctAnswer: "Sandeep Reddy Vanga",
    predictionMarketQuestion: "Will Animal Park cross 1000 crores worldwide?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.58
  },
  {
    id: 10,
    headline: "Karan Johar Announces Dharma's Most Ambitious Multi-Starrer!",
    summary: "Dharma Productions is assembling an unprecedented ensemble cast for what KJo calls 'the biggest film of my career'. Rumors suggest the cast includes five A-list stars in lead roles.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+10",
    quizQuestion: "What is Karan Johar's production company called?",
    correctAnswer: "Dharma",
    predictionMarketQuestion: "Will this multi-starrer have more than 3 A-list heroes?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.75
  },
  {
    id: 11,
    headline: "Vicky Kaushal's Period Epic to Be Shot Entirely in Rajasthan!",
    summary: "Vicky Kaushal's upcoming historical drama will feature the grandeur of Rajasthan, with sets being constructed across multiple forts. The film's budget is rumored to exceed 300 crores.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+11",
    quizQuestion: "In which Indian state is Vicky's period epic being filmed?",
    correctAnswer: "Rajasthan",
    predictionMarketQuestion: "Will this be Vicky Kaushal's highest-grossing film?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.62
  },
  {
    id: 12,
    headline: "Kiara Advani Signs Pan-India Fantasy Trilogy!",
    summary: "Kiara Advani has been cast as the lead in an ambitious three-part fantasy saga inspired by Indian mythology. The project boasts a combined budget of 800 crores with international VFX teams.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+12",
    quizQuestion: "How many films are planned in this fantasy series?",
    correctAnswer: "3",
    predictionMarketQuestion: "Will all three films of the trilogy actually be made?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.42
  },
  {
    id: 13,
    headline: "Ajay Devgn's Singham Again Adds Surprise Cameo!",
    summary: "Rohit Shetty's cop universe film 'Singham Again' will feature an unexpected cameo that sources say will 'break the internet'. The mystery actor filmed for three days in Hyderabad.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+13",
    quizQuestion: "Which director created the Singham cop universe?",
    correctAnswer: "Rohit Shetty",
    predictionMarketQuestion: "Will the mystery cameo be a South Indian superstar?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.68
  },
  {
    id: 14,
    headline: "Kartik Aaryan Bags Lead in Imtiaz Ali's Next!",
    summary: "Kartik Aaryan has been confirmed as the lead in Imtiaz Ali's upcoming romantic drama. The film marks a departure from Ali's usual style, described as 'grounded yet magical'.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+14",
    quizQuestion: "Which director is Kartik working with on this romantic drama?",
    correctAnswer: "Imtiaz Ali",
    predictionMarketQuestion: "Will this film become Kartik's first 300 crore grosser?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.48
  },
  {
    id: 15,
    headline: "Janhvi Kapoor's Mr & Mrs Mahi Sequel Announced!",
    summary: "Following the success of 'Mr & Mrs Mahi', a sequel has been greenlit with Janhvi Kapoor and Rajkummar Rao returning. The cricket-themed rom-com will explore their characters' professional journey.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+15",
    quizQuestion: "Which sport is Mr & Mrs Mahi centered around?",
    correctAnswer: "Cricket",
    predictionMarketQuestion: "Will the sequel outperform the original at the box office?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.52
  },
  {
    id: 16,
    headline: "Tiger Shroff's Aerial Action Film to Feature Real Stunts!",
    summary: "Tiger Shroff's upcoming action spectacle will feature the actor performing all aerial stunts without CGI enhancement. The film includes a record-breaking skydiving sequence filmed in Dubai.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+16",
    quizQuestion: "In which city was the skydiving sequence filmed?",
    correctAnswer: "Dubai",
    predictionMarketQuestion: "Will Tiger's film break his personal box office record?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.45
  },
  {
    id: 17,
    headline: "Varun Dhawan Returns to Comedy with ABCD 4!",
    summary: "After a string of dramatic roles, Varun Dhawan reunites with Remo D'Souza for 'ABCD 4'. The dance film promises choreography that 'redefines what's possible on screen'.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+17",
    quizQuestion: "What does ABCD stand for in the film series?",
    correctAnswer: "Any Body Can Dance",
    predictionMarketQuestion: "Will ABCD 4 revive the dance film genre?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.55
  },
  {
    id: 18,
    headline: "Ananya Panday's OTT Series Gets Record-Breaking Budget!",
    summary: "Ananya Panday's upcoming streaming series has been allocated the highest budget ever for an Indian web production. The psychological thriller spans eight episodes with cinematic production values.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+18",
    quizQuestion: "What genre is Ananya's streaming series?",
    correctAnswer: "Thriller",
    predictionMarketQuestion: "Will this become the most-watched Indian series on its platform?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.58
  },
  {
    id: 19,
    headline: "Sidharth Malhotra's Biopic on Racing Legend Gets Green Light!",
    summary: "Sidharth Malhotra will portray a legendary Indian racing driver in an upcoming biopic. The actor has already begun training with professional racers at international circuits.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+19",
    quizQuestion: "What sport is Sidharth's biopic about?",
    correctAnswer: "Racing",
    predictionMarketQuestion: "Will this biopic match the success of Shershaah?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.48
  },
  {
    id: 20,
    headline: "Kriti Sanon Launches Film Production Company!",
    summary: "National Award winner Kriti Sanon has announced the launch of her production house, 'Blue Butterfly Films'. The first project is described as a female-centric thriller.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+20",
    quizQuestion: "What is the name of Kriti's production company?",
    correctAnswer: "Blue Butterfly Films",
    predictionMarketQuestion: "Will Kriti's first production be a critical success?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.52
  },
  {
    id: 21,
    headline: "Akshay Kumar Signs 5-Film Deal with Amazon Prime!",
    summary: "Akshay Kumar has entered an exclusive content partnership with Amazon Prime Video. The deal includes theatrical releases that will stream on the platform within weeks of cinema release.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+21",
    quizQuestion: "Which streaming platform did Akshay sign the deal with?",
    correctAnswer: "Amazon Prime",
    predictionMarketQuestion: "Will Akshay's streaming films outperform his theatrical releases?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.42
  },
  {
    id: 22,
    headline: "Shraddha Kapoor's Horror-Comedy Franchise Expands!",
    summary: "Following the massive success of 'Stree 2', producers have announced a cinematic universe expansion. Shraddha's character will appear in crossover films with other horror franchises.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+22",
    quizQuestion: "What was the name of Shraddha's blockbuster horror-comedy sequel?",
    correctAnswer: "Stree 2",
    predictionMarketQuestion: "Will the horror universe become Bollywood's biggest franchise?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.70
  },
  {
    id: 23,
    headline: "Rajkummar Rao's Gangster Drama to Premiere at Berlin!",
    summary: "Rajkummar Rao's intense gangster film has been selected for the Berlin Film Festival's competition section. The film marks his most physically demanding role to date.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+23",
    quizQuestion: "Which international film festival will premiere Rajkummar's film?",
    correctAnswer: "Berlin",
    predictionMarketQuestion: "Will Rajkummar win an international award for this role?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.35
  },
  {
    id: 24,
    headline: "Taapsee Pannu's Sports Biopic Gets Olympic Tie-In!",
    summary: "Taapsee Pannu's biopic on an Indian Olympic athlete will release strategically during the next Summer Olympics. The film chronicles an inspiring journey from village to podium.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+24",
    quizQuestion: "What global sporting event will the film release coincide with?",
    correctAnswer: "Olympics",
    predictionMarketQuestion: "Will the Olympic timing boost the film to 200 crores?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.55
  },
  {
    id: 25,
    headline: "Ayushmann Khurrana's Next Tackles AI and Technology!",
    summary: "Ayushmann Khurrana's upcoming social drama explores the impact of artificial intelligence on everyday lives. The film is being praised for its timely and thought-provoking subject matter.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+25",
    quizQuestion: "What technology is Ayushmann's new film about?",
    correctAnswer: "AI",
    predictionMarketQuestion: "Will this become Ayushmann's first 200 crore film?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.45
  },
  {
    id: 26,
    headline: "Bhumi Pednekar's International Co-Production Begins Filming!",
    summary: "Bhumi Pednekar starts filming on an India-UK co-production that will see her in dual roles. The thriller spans two continents and three decades.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+26",
    quizQuestion: "Which two countries are co-producing Bhumi's new film?",
    correctAnswer: "India-UK",
    predictionMarketQuestion: "Will this film get Bhumi her second National Award?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.40
  },
  {
    id: 27,
    headline: "Shahid Kapoor's Deva Promises High-Octane Action!",
    summary: "First look images from Shahid Kapoor's 'Deva' reveal intense action sequences. Director Rosshan Andrrews promises a departure from typical Bollywood action films.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+27",
    quizQuestion: "What is the title of Shahid's upcoming action film?",
    correctAnswer: "Deva",
    predictionMarketQuestion: "Will Deva collect over 150 crores domestically?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.55
  },
  {
    id: 28,
    headline: "Sara Ali Khan Signs On for Atrangi Re Sequel!",
    summary: "The musical drama 'Atrangi Re' is getting a sequel with Sara Ali Khan returning in the lead. Aanand L. Rai confirms the film will continue the magical realism style.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+28",
    quizQuestion: "Who directed the original Atrangi Re?",
    correctAnswer: "Aanand L. Rai",
    predictionMarketQuestion: "Will the Atrangi Re sequel feature both original male leads?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.32
  },
  {
    id: 29,
    headline: "Prabhas's Spirit Marks Sandeep Vanga's Biggest Budget Yet!",
    summary: "The much-anticipated 'Spirit' starring Prabhas has been confirmed with a 400 crore budget. Director Sandeep Reddy Vanga describes it as 'a raw, unfiltered cop drama'.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+29",
    quizQuestion: "What is the budget of Prabhas's Spirit?",
    correctAnswer: "400 crore",
    predictionMarketQuestion: "Will Spirit become Sandeep Vanga's highest-grossing film?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.62
  },
  {
    id: 30,
    headline: "Rashmika Mandanna Signs Fifth Hindi Film This Year!",
    summary: "Pan-India star Rashmika Mandanna continues her Bollywood dominance, signing her fifth Hindi production of the year. She's now the busiest actress across all Indian film industries.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+30",
    quizQuestion: "How many Hindi films has Rashmika signed this year?",
    correctAnswer: "5",
    predictionMarketQuestion: "Will Rashmika become the highest-paid actress in Bollywood?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.58
  },
  {
    id: 31,
    headline: "Vijay Deverakonda's Bollywood Comeback Generates Massive Buzz!",
    summary: "After a brief hiatus from Hindi cinema, Vijay Deverakonda signs a two-film deal with a major Bollywood banner. Both films are described as 'massy entertainers'.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+31",
    quizQuestion: "How many Bollywood films has Vijay Deverakonda signed?",
    correctAnswer: "2",
    predictionMarketQuestion: "Will VD's Bollywood comeback cross 200 crores?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.48
  },
  {
    id: 32,
    headline: "Disha Patani Joins International Action Franchise!",
    summary: "Disha Patani has been cast in a supporting role in a major Hollywood action franchise. She'll be training with stunt coordinators from the John Wick team.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+32",
    quizQuestion: "Which Hollywood action franchise's stunt team will train Disha?",
    correctAnswer: "John Wick",
    predictionMarketQuestion: "Will Disha's Hollywood role lead to more international offers?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.55
  },
  {
    id: 33,
    headline: "Nawazuddin Siddiqui's International Film Gets Oscar Buzz!",
    summary: "Nawazuddin's collaboration with a European auteur is generating early Oscar conversation. The film premiered to standing ovation at a major European festival.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+33",
    quizQuestion: "What major award is Nawaz's international film being discussed for?",
    correctAnswer: "Oscar",
    predictionMarketQuestion: "Will Nawazuddin's film receive an Oscar nomination?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.25
  },
  {
    id: 34,
    headline: "Nora Fatehi's Dance Film Sets Global Release Record!",
    summary: "Nora Fatehi's dance-centric film has secured distribution in 65 countries, the widest release for any Indian dance film. The choreography has already gone viral on social media.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+34",
    quizQuestion: "In how many countries will Nora's dance film release?",
    correctAnswer: "65",
    predictionMarketQuestion: "Will this film spark a dance film renaissance in Bollywood?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.42
  },
  {
    id: 35,
    headline: "Manoj Bajpayee's The Family Man Season 4 Begins Production!",
    summary: "Amazon Prime confirms 'The Family Man' Season 4 has entered production. Creators Raj & DK tease the 'most dangerous mission' yet for Srikant Tiwari.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+35",
    quizQuestion: "What is Manoj Bajpayee's character name in The Family Man?",
    correctAnswer: "Srikant Tiwari",
    predictionMarketQuestion: "Will Season 4 be the final season of The Family Man?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.35
  },
  {
    id: 36,
    headline: "John Abraham's Vedaa Sequel Fast-Tracked!",
    summary: "Following the success of 'Vedaa', a sequel has been announced with an even bigger scale. John Abraham and Sharvari will reprise their roles in the action drama.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+36",
    quizQuestion: "Who plays the female lead opposite John in Vedaa?",
    correctAnswer: "Sharvari",
    predictionMarketQuestion: "Will the Vedaa sequel double the original's box office?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.45
  },
  {
    id: 37,
    headline: "Mrunal Thakur's Telugu Debut Breaks Language Barriers!",
    summary: "Mrunal Thakur's Telugu film has performed exceptionally well across all regions, proving the actress's pan-India appeal. More South projects are reportedly in talks.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+37",
    quizQuestion: "Which South Indian language industry did Mrunal recently debut in?",
    correctAnswer: "Telugu",
    predictionMarketQuestion: "Will Mrunal become a permanent pan-India star?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.68
  },
  {
    id: 38,
    headline: "Arjun Kapoor's Villain Role Earns Critical Praise!",
    summary: "Arjun Kapoor's antagonist performance in 'Singham Again' is receiving widespread acclaim. Critics are calling it a career-defining turn for the actor.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+38",
    quizQuestion: "In which Rohit Shetty film does Arjun play the villain?",
    correctAnswer: "Singham Again",
    predictionMarketQuestion: "Will this villain role revive Arjun's career?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.55
  },
  {
    id: 39,
    headline: "Yami Gautam's Production Debut Explores Dark Territory!",
    summary: "Yami Gautam turns producer with a psychological thriller that she also stars in. The film explores trauma and recovery in ways 'rarely seen in Hindi cinema'.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+39",
    quizQuestion: "What new role is Yami taking on besides acting?",
    correctAnswer: "Producer",
    predictionMarketQuestion: "Will Yami's production win critical acclaim?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.52
  },
  {
    id: 40,
    headline: "Sanya Malhotra's Dance Film Gets Standing Ovation at Preview!",
    summary: "Sanya Malhotra's upcoming dance drama received a 10-minute standing ovation at a private preview. The actress trained for 8 months in classical dance forms.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+40",
    quizQuestion: "How many months did Sanya train in classical dance?",
    correctAnswer: "8",
    predictionMarketQuestion: "Will Sanya receive a National Award nomination for this role?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.48
  },
  {
    id: 41,
    headline: "Dulquer Salmaan's Hindi Film to Release in IMAX!",
    summary: "Dulquer Salmaan's upcoming Hindi thriller has been confirmed for IMAX release, a first for the Malayalam superstar in Bollywood. The film features breathtaking visuals.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+41",
    quizQuestion: "What premium format will Dulquer's Hindi film release in?",
    correctAnswer: "IMAX",
    predictionMarketQuestion: "Will this be Dulquer's biggest Hindi hit?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.60
  },
  {
    id: 42,
    headline: "Triptii Dimri's Brand Value Soars Post-Animal Success!",
    summary: "Triptii Dimri has become the most sought-after celebrity for brand endorsements, signing 15 new deals in just 3 months. Her brand value has reportedly increased 10x.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+42",
    quizQuestion: "How many brand deals has Triptii signed recently?",
    correctAnswer: "15",
    predictionMarketQuestion: "Will Triptii become Bollywood's highest-paid actress within 2 years?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.45
  },
  {
    id: 43,
    headline: "Ishaan Khatter's International Series Gets Season 2 Renewal!",
    summary: "Before the first season even airs, Ishaan Khatter's international streaming series has been renewed for a second season. The show is described as a 'spy thriller with heart'.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+43",
    quizQuestion: "What genre is Ishaan's international series?",
    correctAnswer: "Spy thriller",
    predictionMarketQuestion: "Will Ishaan's series become a global phenomenon?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.40
  },
  {
    id: 44,
    headline: "Pooja Hegde Signs Sanjay Leela Bhansali's Next!",
    summary: "Pooja Hegde has been cast in Sanjay Leela Bhansali's upcoming period drama. This marks her first collaboration with the legendary filmmaker known for visual grandeur.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+44",
    quizQuestion: "Which legendary director has Pooja signed with?",
    correctAnswer: "Sanjay Leela Bhansali",
    predictionMarketQuestion: "Will this become Pooja's career-defining film?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.72
  },
  {
    id: 45,
    headline: "Anil Kapoor's OTT Action Series Gets Unprecedented Budget!",
    summary: "Anil Kapoor's upcoming streaming action series has received a budget of 200 crores for the first season alone. The show promises Hollywood-level production values.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+45",
    quizQuestion: "What is the budget for Anil Kapoor's new series?",
    correctAnswer: "200 crores",
    predictionMarketQuestion: "Will this become India's most expensive streaming show ever?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.65
  },
  {
    id: 46,
    headline: "Sobhita Dhulipala's Hollywood Film Wraps Production!",
    summary: "Sobhita Dhulipala has completed filming on her Hollywood debut opposite a major international star. The film is a psychological drama set across two timelines.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+46",
    quizQuestion: "What genre is Sobhita's Hollywood debut?",
    correctAnswer: "Psychological drama",
    predictionMarketQuestion: "Will Sobhita's Hollywood debut receive festival recognition?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.48
  },
  {
    id: 47,
    headline: "Sunny Deol's Gadar 3 Confirmed for Republic Day Release!",
    summary: "Sunny Deol confirms 'Gadar 3' will release on Republic Day, continuing the patriotic blockbuster tradition. The film promises to be 'even more emotional' than the previous installments.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+47",
    quizQuestion: "On which national holiday will Gadar 3 release?",
    correctAnswer: "Republic Day",
    predictionMarketQuestion: "Will Gadar 3 beat Gadar 2's box office record?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.52
  },
  {
    id: 48,
    headline: "Parineeti Chopra's Comeback Film Generates Award Buzz!",
    summary: "Parineeti Chopra's performance in her upcoming drama is generating early award season buzz. Critics who attended early screenings call it 'a revelation'.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+48",
    quizQuestion: "What kind of buzz is Parineeti's comeback generating?",
    correctAnswer: "Award",
    predictionMarketQuestion: "Will Parineeti win a major award for this role?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.42
  },
  {
    id: 49,
    headline: "Bobby Deol's Villain Streak Continues with Major Signing!",
    summary: "Following his menacing turn in 'Animal', Bobby Deol signs on as the antagonist in another major production. The actor is cementing his status as Bollywood's favorite new villain.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+49",
    quizQuestion: "Which blockbuster film featured Bobby as a villain recently?",
    correctAnswer: "Animal",
    predictionMarketQuestion: "Will Bobby continue playing only villain roles?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.58
  },
  {
    id: 50,
    headline: "Bollywood's Biggest Crossover Event Film Announced!",
    summary: "Multiple studios have joined forces to create an unprecedented crossover event featuring characters from different franchises. This 'Bollywood Avengers' style project has the industry buzzing.",
    image: "https://via.placeholder.com/400x250?text=BollyBet+News+50",
    quizQuestion: "What Hollywood franchise concept is this crossover being compared to?",
    correctAnswer: "Avengers",
    predictionMarketQuestion: "Will this crossover event film actually happen?",
    predictionMarketOptions: ["Yes", "No"],
    initialYesPrice: 0.38
  }
];
