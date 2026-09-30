// ═══════════════════════════════════════════════════════════════
// MAYBE™ Match Engine
// Handles match logic, fake-out matches, and the final boss.
// ═══════════════════════════════════════════════════════════════

import { Profile, ProfileEngine } from './ProfileEngine';

export interface Match {
  id: string;
  profile: Profile;
  timestamp: number;
  conversationStarted: boolean;
  messages: ChatMessage[];
  isFakeout: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'match';
  timestamp: number;
}

const STORAGE_KEY = 'maybe_matches';

const suggestedOpeners = [
  "So, how's your week going?",
  "Important question: coffee or chai?",
  "I have a theory about your profile.",
  "The algorithm clearly knows something we don't.",
  "Okay, I'll go first.",
  "On a scale of 1-10, how suspicious are you of this app?",
  "I'm told we're compatible. Thoughts?",
  "Quick survey: what's your controversial food opinion?",
];

const matchResponses = [
  "haha honestly I was thinking the same thing 😄",
  "okay that's actually a great opener",
  "the algorithm might be onto something 👀",
  "finally someone interesting on here",
  "this app is... something else, right?",
  "I appreciate the directness",
  "love this energy ngl",
  "you had me at the profile pic of [imaginary dog]",
];

function loadMatches(): Match[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

let matches = loadMatches();
let likedProfiles: Set<string> = new Set();

function saveMatches() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  } catch {}
}

export const MatchEngine = {
  /**
   * Attempt to match with a profile.
   * Returns match result with possible fakeout.
   */
  tryMatch(profile: Profile): {
    matched: boolean;
    isFakeout: boolean;
    match?: Match;
    isAlmostMatch: boolean;
    almostReason?: string;
  } {
    // Check for "almost match"
    if (profile.isAlmostMatch) {
      return {
        matched: false,
        isFakeout: false,
        isAlmostMatch: true,
        almostReason: profile.almostReason,
      };
    }

    // 15% chance of fakeout match
    const isFakeout = Math.random() < 0.15;
    if (isFakeout) {
      return {
        matched: false,
        isFakeout: true,
        isAlmostMatch: false,
      };
    }

    // 60% chance of actual match
    const matched = Math.random() < 0.6;
    if (matched) {
      const match: Match = {
        id: `match-${Date.now()}`,
        profile,
        timestamp: Date.now(),
        conversationStarted: false,
        messages: [],
        isFakeout: false,
      };
      matches.push(match);
      saveMatches();
      return {
        matched: true,
        isFakeout: false,
        match,
        isAlmostMatch: false,
      };
    }

    return {
      matched: false,
      isFakeout: false,
      isAlmostMatch: false,
    };
  },

  likeProfile(profileId: string) {
    likedProfiles.add(profileId);
  },

  isLiked(profileId: string): boolean {
    return likedProfiles.has(profileId);
  },

  getMatches(): Match[] {
    return matches;
  },

  getMatch(matchId: string): Match | undefined {
    return matches.find((m) => m.id === matchId);
  },

  addMessage(matchId: string, text: string, sender: 'user' | 'match'): ChatMessage {
    const match = matches.find((m) => m.id === matchId);
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      text,
      sender,
      timestamp: Date.now(),
    };
    if (match) {
      match.messages.push(msg);
      match.conversationStarted = true;
      saveMatches();
    }
    return msg;
  },

  getAutoReply(): string {
    return matchResponses[Math.floor(Math.random() * matchResponses.length)];
  },

  getSuggestedOpeners(): string[] {
    return suggestedOpeners.sort(() => Math.random() - 0.5).slice(0, 4);
  },

  getMatchCount(): number {
    return matches.filter((m) => !m.isFakeout).length;
  },

  reset() {
    matches = [];
    likedProfiles.clear();
    localStorage.removeItem(STORAGE_KEY);
  },
};
