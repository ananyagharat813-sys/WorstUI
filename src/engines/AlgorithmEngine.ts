// ═══════════════════════════════════════════════════════════════
// MAYBE™ Algorithm Engine
// THE ALGORITHM™ — generates compatibility using legitimate
// criteria mixed with ridiculous factors.
// ═══════════════════════════════════════════════════════════════

export interface AlgorithmResult {
  score: number;
  legitimateReasons: string[];
  absurdReasons: string[];
  roast: string;
  verdict: string;
}

const legitimateFactors = [
  "Both like coffee",
  "Similar music taste",
  "Both enjoy travel",
  "Compatible communication styles",
  "Shared interest in outdoor activities",
  "Both value quality time",
  "Similar sense of humor",
  "Compatible lifestyle preferences",
  "Both enjoy cooking",
  "Shared creative interests",
  "Similar reading habits",
  "Both appreciate art",
];

const absurdFactors = [
  "Both opened the app at night",
  "Both probably overthink texts",
  "Similar screenshot habits",
  "Both have commitment to scrolling",
  "You both paused on this page",
  "Similar Wi-Fi connection quality",
  "Both prefer the left side of the bed (probably)",
  "You both read bios (rare)",
  "Both have phones with less than 30% battery at least once a week",
  "Similar app-opening frequency",
  "Both have questionable alarm-snoozing habits",
  "You both took a suspiciously long time on this profile",
  "Compatible astrology signs (we didn't actually check)",
  "Both breathe oxygen (strong foundation)",
  "Similar emotional baggage weight class",
];

const verdicts = [
  "Cautiously optimistic.",
  "The math checks out. We think.",
  "Higher than average. Lower than you'd hope.",
  "Not terrible.",
  "Statistically significant. Emotionally questionable.",
  "The algorithm approves. Reluctantly.",
  "Compatible enough to try. Not enough to guarantee anything.",
  "We'd bet on it. With someone else's money.",
  "The vibes are there. Allegedly.",
  "Promising. But we've been wrong before.",
];

const roasts = [
  "That last one carried.",
  "Don't let the number go to your head.",
  "We're not saying it's fate. We're also not not saying it.",
  "Higher compatibility than most. Make of that what you will.",
  "The algorithm is cautiously optimistic.",
  "This is either destiny or a statistical anomaly.",
  "We ran the calculations twice. Same result. Suspicious.",
  "Better than a coin flip. That's our guarantee.",
];

const whyThisPersonSequence = [
  "Excellent question.",
  "We're checking.",
  "Still checking.",
  "We have decided not to disclose that.",
  "Stop asking.",
  "Fine. It's because the algorithm said so. That's literally it.",
  "Okay, honestly? You both seem like the type to overthink a restaurant menu. That's love.",
  "The algorithm detected mutual 'I'll have whatever you're having' energy. That's rare.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export const AlgorithmEngine = {
  calculateCompatibility(): AlgorithmResult {
    const score = 60 + Math.floor(Math.random() * 35);
    return {
      score,
      legitimateReasons: pickN(legitimateFactors, 3),
      absurdReasons: pickN(absurdFactors, 2),
      roast: pick(roasts),
      verdict: pick(verdicts),
    };
  },

  getWhyResponse(attemptCount: number): string {
    if (attemptCount <= whyThisPersonSequence.length) {
      return whyThisPersonSequence[attemptCount - 1];
    }
    return pick([
      "You're still asking?",
      "The algorithm has spoken. Accept it.",
      "Because we said so.",
      "Fine. You both have impeccable taste. In everything except dating apps, apparently.",
    ]);
  },

  getUserTypeAnalysis(stats: {
    likeCount: number;
    passCount: number;
    prefChanges: number;
  }): { traits: string[]; roast: string } {
    const traits: string[] = [];

    if (stats.likeCount > 5) traits.push("☕ Coffee people");
    if (stats.likeCount > 3) traits.push("✈️ Travel people");
    traits.push("🐶 Dog people");
    if (stats.likeCount > 7) traits.push("🎧 People who say 'my music taste is elite'");
    if (stats.passCount > stats.likeCount) traits.push("🚫 Nobody, apparently");
    if (stats.prefChanges > 2) traits.push("🔄 You don't actually know");

    const roastOptions = [
      "You like people who look emotionally unavailable in good lighting.",
      "Your type is 'anyone with a dog in their first photo.'",
      "You're attracted to bios that are 30% sarcasm and 70% false confidence.",
      "Your type is 'seems chill but will absolutely double-text.'",
      "You like people who describe themselves as 'fluent in sarcasm.' So, everyone.",
      "Your type is main character energy with side character commitment levels.",
    ];

    return {
      traits,
      roast: pick(roastOptions),
    };
  },

  getAlgorithmPageContent(): {
    title: string;
    subtitle: string;
    description: string;
    features: { icon: string; title: string; description: string }[];
  } {
    return {
      title: "THE ALGORITHM™",
      subtitle: "Patent Pending. Probably.",
      description:
        "Our proprietary matching technology uses advanced computational methods that we definitely understand and are not at all making up as we go.",
      features: [
        {
          icon: "🧠",
          title: "Neural Compatibility Engine",
          description:
            "We analyze 847 data points per profile. At least 3 of them are relevant.",
        },
        {
          icon: "💫",
          title: "Vibes Analysis™",
          description:
            "Our patented Vibes Analysis™ technology detects compatibility based on entirely subjective criteria we refuse to explain.",
        },
        {
          icon: "🔮",
          title: "Predictive Matching",
          description:
            "We predict relationship outcomes with 73% accuracy. The other 27% is Mercury retrograde.",
        },
        {
          icon: "📊",
          title: "Emotional IQ Scoring",
          description:
            "We score your emotional intelligence on a scale we invented. You scored 'interesting.'",
        },
      ],
    };
  },
};
