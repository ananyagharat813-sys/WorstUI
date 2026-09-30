// ═══════════════════════════════════════════════════════════════
// MAYBE™ Rage Engine
// Tracks user frustration levels and triggers milestones.
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'maybe_rage';

interface RageState {
  level: number;
  totalInteractions: number;
  milestones: number[];
  revealed: boolean;
  maxReached: boolean;
  likeCount: number;
  passCount: number;
  settingsOpened: number;
  profileViewCount: number;
  prefChanges: number;
  refreshCount: number;
  messageAttempts: number;
  yesClicks: number;
  noClicks: number;
  sameProfileViews: Record<string, number>;
  lastAction: string;
  consecutiveSameAction: number;
}

function loadState(): RageState {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    level: 0,
    totalInteractions: 0,
    milestones: [],
    revealed: false,
    maxReached: false,
    likeCount: 0,
    passCount: 0,
    settingsOpened: 0,
    profileViewCount: 0,
    prefChanges: 0,
    refreshCount: 0,
    messageAttempts: 0,
    yesClicks: 0,
    noClicks: 0,
    sameProfileViews: {},
    lastAction: '',
    consecutiveSameAction: 0,
  };
}

let state = loadState();

function saveState() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const RageEngine = {
  addInteraction(actionType: string, failed: boolean = false) {
    state.totalInteractions++;

    // Track consecutive same actions
    if (state.lastAction === actionType) {
      state.consecutiveSameAction++;
    } else {
      state.consecutiveSameAction = 1;
      state.lastAction = actionType;
    }

    // Track specific actions
    switch (actionType) {
      case 'like': state.likeCount++; break;
      case 'pass': state.passCount++; break;
      case 'settings': state.settingsOpened++; break;
      case 'profile_view': state.profileViewCount++; break;
      case 'preference_change': state.prefChanges++; break;
      case 'refresh': state.refreshCount++; break;
      case 'message': state.messageAttempts++; break;
      case 'yes': state.yesClicks++; break;
      case 'no': state.noClicks++; break;
    }

    // Increase rage based on failed attempts
    if (failed) {
      state.level = Math.min(100, state.level + 3);
    } else {
      // Successful actions reduce rage slightly
      state.level = Math.max(0, state.level - 1);
    }

    // Rage increases from consecutive same actions
    if (state.consecutiveSameAction > 3) {
      state.level = Math.min(100, state.level + 1);
    }

    // Reveal rage meter after enough interactions
    if (state.totalInteractions >= 8 && !state.revealed) {
      state.revealed = true;
    }

    // Check milestones
    const milestoneThresholds = [30, 50, 70, 85, 95, 100];
    milestoneThresholds.forEach((threshold) => {
      if (state.level >= threshold && !state.milestones.includes(threshold)) {
        state.milestones.push(threshold);
      }
    });

    if (state.level >= 100 && !state.maxReached) {
      state.maxReached = true;
    }

    saveState();
  },

  trackProfileView(profileId: string) {
    if (!state.sameProfileViews[profileId]) {
      state.sameProfileViews[profileId] = 0;
    }
    state.sameProfileViews[profileId]++;
    saveState();
  },

  getProfileViewCount(profileId: string): number {
    return state.sameProfileViews[profileId] || 0;
  },

  getLevel(): number {
    return state.level;
  },

  getTotalInteractions(): number {
    return state.totalInteractions;
  },

  isRevealed(): boolean {
    return state.revealed;
  },

  isMaxReached(): boolean {
    return state.maxReached;
  },

  getMilestones(): number[] {
    return state.milestones;
  },

  hasNewMilestone(threshold: number): boolean {
    return state.milestones.includes(threshold);
  },

  getStats() {
    return {
      likeCount: state.likeCount,
      passCount: state.passCount,
      settingsOpened: state.settingsOpened,
      profileViewCount: state.profileViewCount,
      prefChanges: state.prefChanges,
      refreshCount: state.refreshCount,
      messageAttempts: state.messageAttempts,
      yesClicks: state.yesClicks,
      noClicks: state.noClicks,
      totalInteractions: state.totalInteractions,
      consecutiveSameAction: state.consecutiveSameAction,
      lastAction: state.lastAction,
    };
  },

  // Get a contextual observation about user behavior
  getObservation(): string | null {
    const stats = state;
    if (stats.likeCount > 8) return "Still liking everyone?";
    if (stats.passCount > 10) return "Still searching?";
    if (stats.settingsOpened > 3) return "You're avoiding the dating part.";
    if (stats.prefChanges > 3) return "At this point even YOU don't know your type.";
    if (stats.refreshCount > 3) return "Refreshing won't create a soulmate.";
    if (stats.consecutiveSameAction > 5) return "We've noticed a pattern.";
    return null;
  },

  reset() {
    state = loadState();
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
