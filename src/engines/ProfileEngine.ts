// ═══════════════════════════════════════════════════════════════
// MAYBE™ Profile Engine
// Generates fictional demo dating profiles with personality
// ═══════════════════════════════════════════════════════════════

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  bio: string;
  interests: string[];
  prompts: { question: string; answer: string }[];
  compatibility: number;
  compatibilityReasons: string[];
  compatibilityRoast: string;
  imageUrl: string;
  imageGradient: string;
  isAlmostMatch?: boolean;
  almostReason?: string;
  isFinalBoss?: boolean;
  personalityDetail: string;
  easterEggClue?: string;
}

const firstNames = [
  'Alex', 'Jordan', 'Casey', 'Morgan', 'Riley',
  'Avery', 'Quinn', 'Sage', 'Harper', 'Rowan',
  'Skyler', 'Taylor', 'Jamie', 'Dakota', 'Emerson',
  'Finley', 'Hayden', 'Kendall', 'Logan', 'Parker',
  'Reese', 'Blake', 'Cameron', 'Drew', 'Elliot',
];

const locations = [
  'Brooklyn, NY', 'Silver Lake, LA', 'Capitol Hill, Seattle',
  'Wicker Park, Chicago', 'South End, Boston', 'Midtown, Atlanta',
  'Pearl District, Portland', 'Nob Hill, SF', 'East Nashville, TN',
  'Deep Ellum, Dallas', 'Wynwood, Miami', 'RiNo, Denver',
];

const professions = [
  'UX Designer', 'Software Engineer', 'Creative Director', 'Data Scientist',
  'Photographer', 'Product Manager', 'Architect', 'Musician',
  'Freelance Writer', 'Marketing Strategist', 'Startup Founder', 'Therapist',
  'Graphic Designer', 'Film Editor', 'Yoga Instructor', 'Chef',
  'Environmental Consultant', 'Podcast Host', 'Art Director', 'Researcher',
];

const interestPools = [
  '☕ Coffee', '📚 Reading', '🎵 Live music', '🧘 Yoga', '🏔️ Hiking',
  '✈️ Travel', '🍷 Wine tasting', '🎨 Art galleries', '🐶 Dogs', '🎧 Vinyl records',
  '🏄 Surfing', '📷 Photography', '🎬 Indie films', '🍜 Ramen hunting', '🏋️ Gym',
  '🎸 Guitar', '🌱 Plant parent', '🎭 Theater', '🏊 Swimming', '🎮 Gaming',
  '🍳 Cooking', '📖 Poetry', '🚴 Cycling', '🎪 Festivals', '🧗 Rock climbing',
  '🎻 Classical music', '🌮 Tacos', '🛹 Skateboarding', '🎤 Karaoke',
];

const promptQuestions = [
  "A perfect Sunday looks like...",
  "My most controversial opinion is...",
  "I'm weirdly attracted to...",
  "The way to my heart is...",
  "I'll know it's love when...",
  "My love language is...",
  "The last thing that made me laugh was...",
  "I'm looking for someone who...",
  "Two truths and a lie...",
  "My greatest flex is...",
];

const promptAnswers: Record<string, string[]> = {
  "A perfect Sunday looks like...": [
    "Farmers market → coffee → reading in the park → pretending I'll cook dinner but ordering Thai",
    "Waking up with no alarm, making pour-over coffee, and aggressively doing nothing productive",
    "Brunch that turns into an afternoon that turns into 'wait, it's 8 PM already?'",
  ],
  "My most controversial opinion is...": [
    "Breakfast for dinner is superior to actual breakfast",
    "The Oxford comma is non-negotiable",
    "Movie theaters are better alone",
    "Reply-all should be a criminal offense",
  ],
  "I'm weirdly attracted to...": [
    "People who have strong opinions about fonts",
    "Someone who can parallel park on the first try",
    "Confidence in restaurant ordering",
    "People who return their shopping carts",
  ],
  "The way to my heart is...": [
    "Through very specific coffee orders and remembering them",
    "Sending articles you think I'd like",
    "Comfortable silence on road trips",
    "Showing up with snacks unannounced",
  ],
  "I'll know it's love when...": [
    "We can share uncomfortable silence without it being weird",
    "I let you control the aux cord",
    "I stop pretending to like your taste in movies",
    "We argue about where to eat and both enjoy the process",
  ],
  "My love language is...": [
    "Acts of service (specifically: making coffee before I ask)",
    "Quality time (but also quality alone time, let's balance this)",
    "Words of affirmation wrapped in sarcasm",
  ],
  "The last thing that made me laugh was...": [
    "My own text to a friend that I'm still thinking about 3 days later",
    "A podcast episode that made me laugh on the train and now everyone thinks I'm unhinged",
    "My attempt at cooking from a recipe that said 'easy'",
  ],
  "I'm looking for someone who...": [
    "Doesn't take themselves too seriously but takes their coffee very seriously",
    "Can hold a conversation about literally anything",
    "Understands that 'five more minutes' is a flexible concept",
    "Will join me on spontaneous adventures but also cancel plans guilt-free",
  ],
  "Two truths and a lie...": [
    "I've been skydiving, I speak three languages, I've never had a cavity",
    "I can cook a full Italian dinner, I've met a celebrity, I wake up before 7 AM voluntarily",
  ],
  "My greatest flex is...": [
    "I can fall asleep anywhere in under 5 minutes",
    "I've kept a plant alive for 3 years (don't ask about the others)",
    "My Spotify Wrapped is genuinely diverse",
    "I own zero items from IKEA that I assembled incorrectly",
  ],
};

const bios = [
  "I take my coffee seriously and my dating life ironically.",
  "Looking for someone who appreciates the perfect playlist.",
  "6'0\" in my bio because apparently that matters.",
  "Emotionally available. Shocked? Me too.",
  "My therapist says I'm ready for this. She might be wrong.",
  "I have a 97% chance of stealing your fries.",
  "Fluent in sarcasm and emotional availability (working on both).",
  "Warning: will send you podcast recommendations unprovoked.",
  "Professional overthinker. Amateur chef. Full-time good vibes.",
  "Yes, that IS my dog in every photo. No, I won't apologize.",
  "I promise I'm funnier in person. The bar is on the floor.",
  "Currently accepting applications for someone to argue about restaurants with.",
  "Not here for a long time or a good time. Just here.",
  "I've been told my personality is 'a lot.' Take that as you will.",
  "Looking for my plus-one to events I haven't been invited to yet.",
];

const personalityDetails = [
  "Adds hot sauce to everything. Everything.",
  "Has a playlist for every emotion including 'confused but optimistic.'",
  "Takes 47 photos of food before eating. No shame.",
  "Their bookshelf is organized by color. Don't start.",
  "Convinced their sourdough starter has a personality.",
  "Owns more tote bags than any human should.",
  "Has a 'going out' playlist and a 'staying in' playlist. They're the same playlist.",
  "Texts back immediately or in 3 business days. No in between.",
  "Their apartment has exactly one chair and twelve plants.",
  "Claims to be a morning person. Has never proven it.",
];

const compatibilityRoasts = [
  "That last one carried.",
  "We're not saying it's fate. We're also not not saying it.",
  "The algorithm is cautiously optimistic.",
  "This is either destiny or a statistical anomaly.",
  "Don't get too excited. Or do. We're not your parent.",
  "Higher than average. Lower than you'd like.",
  "The numbers don't lie. They do, however, exaggerate.",
  "We ran the calculations twice. Same result. Suspicious.",
];

const almostReasons = [
  "Unfortunately, they like pineapple on pizza.",
  "They think The Office is overrated.",
  "Their Spotify Wrapped was exclusively country music.",
  "They unironically use 'LOL' in serious conversations.",
  "They reply to emails with 'Thanks!'",
  "They think cereal is a valid dinner.",
  "They put milk before cereal.",
  "They think 'let's circle back' is acceptable vocabulary.",
  "They double-text with no remorse.",
  "They pronounce 'GIF' with a hard G.",
];

const imageGradients = [
  'from-purple-600 via-pink-500 to-orange-400',
  'from-blue-600 via-cyan-500 to-teal-400',
  'from-rose-600 via-pink-500 to-fuchsia-400',
  'from-amber-600 via-orange-500 to-red-400',
  'from-emerald-600 via-green-500 to-lime-400',
  'from-indigo-600 via-purple-500 to-pink-400',
  'from-sky-600 via-blue-500 to-indigo-400',
  'from-violet-600 via-purple-500 to-fuchsia-400',
];

const easterEggClues = [
  "My favorite number is 7.",
  "I always triple-check things.",
  "I believe patience is overrated.",
  "I collect vintage error messages.",
  undefined,
  undefined,
  undefined,
  undefined,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

let profileCounter = 0;

function generateProfile(overrides?: Partial<Profile>): Profile {
  profileCounter++;
  const name = pick(firstNames);
  const age = 23 + Math.floor(Math.random() * 12);
  const interests = pickN(interestPools, 4 + Math.floor(Math.random() * 3));
  const promptQ = pickN(promptQuestions, 2);
  const prompts = promptQ.map((q) => ({
    question: q,
    answer: pick(promptAnswers[q] || ["I'm thinking about it."]),
  }));

  const compatibility = 60 + Math.floor(Math.random() * 35);

  const legitimateReasons = [
    "Both like coffee",
    "Similar music taste",
    "Both enjoy travel",
    "Both like dogs",
    "Compatible communication styles",
    "Similar sense of humor",
    "Both enjoy outdoor activities",
  ];

  const absurdReasons = [
    "Both opened the app at night",
    "Both probably overthink texts",
    "Similar screenshot habits",
    "Both have commitment to scrolling",
    "You both paused on this page",
    "Similar Wi-Fi connection quality",
    "Both prefer the left side of the bed (probably)",
    "You both read bios (rare)",
  ];

  const reasons = [
    ...pickN(legitimateReasons, 3),
    ...pickN(absurdReasons, 2),
  ];

  const isAlmost = Math.random() < 0.15;

  return {
    id: `profile-${profileCounter}-${Date.now()}`,
    name,
    age,
    location: pick(locations),
    profession: pick(professions),
    bio: pick(bios),
    interests,
    prompts,
    compatibility,
    compatibilityReasons: reasons,
    compatibilityRoast: pick(compatibilityRoasts),
    imageUrl: '',
    imageGradient: pick(imageGradients),
    isAlmostMatch: isAlmost,
    almostReason: isAlmost ? pick(almostReasons) : undefined,
    personalityDetail: pick(personalityDetails),
    easterEggClue: pick(easterEggClues),
    ...overrides,
  };
}

function generateFinalBoss(): Profile {
  return generateProfile({
    id: 'final-boss',
    name: 'You',
    age: 0,
    location: 'Right here',
    profession: 'Professional Profile Swipper',
    bio: "Everything you've been looking for. Literally.",
    interests: ['☕ Coffee', '✈️ Travel', '🐶 Dogs', '🎧 Music', '📚 Reading', '🎨 Art'],
    compatibility: 100,
    compatibilityReasons: [
      "Exact same taste in everything",
      "Identical communication style",
      "Perfect personality match",
      "Same love language",
      "Both using this app right now",
    ],
    compatibilityRoast: "We ran out of red flags. That IS the red flag.",
    isAlmostMatch: false,
    isFinalBoss: true,
    personalityDetail: "Suspiciously perfect in every way.",
    imageGradient: 'from-yellow-500 via-pink-500 to-purple-600',
    prompts: [
      { question: "I'm looking for someone who...", answer: "is exactly like me. In every way. No exceptions." },
      { question: "My greatest flex is...", answer: "I'm 100% compatible with you. Literally. Check the math." },
    ],
  });
}

// Pre-generate a pool of profiles
let profilePool: Profile[] = [];

function initPool() {
  profilePool = [];
  for (let i = 0; i < 20; i++) {
    profilePool.push(generateProfile());
  }
}

initPool();

export const ProfileEngine = {
  getProfiles(): Profile[] {
    return profilePool;
  },

  getProfile(id: string): Profile | undefined {
    if (id === 'final-boss') return generateFinalBoss();
    return profilePool.find((p) => p.id === id);
  },

  getNextProfile(currentIndex: number): Profile | null {
    if (currentIndex < profilePool.length) {
      return profilePool[currentIndex];
    }
    // Generate more profiles
    const newProfile = generateProfile();
    profilePool.push(newProfile);
    return newProfile;
  },

  getFinalBoss(): Profile {
    return generateFinalBoss();
  },

  shouldShowFinalBoss(interactionCount: number): boolean {
    return interactionCount >= 40;
  },

  getTotalProfiles(): number {
    return profilePool.length;
  },

  generateNew(): Profile {
    const p = generateProfile();
    profilePool.push(p);
    return p;
  },

  getInitials(name: string): string {
    return generateInitials(name);
  },
};
