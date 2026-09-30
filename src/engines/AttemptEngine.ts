// ═══════════════════════════════════════════════════════════════
// MAYBE™ Attempt Engine
// Tracks attempt counts per action and determines when
// the user has "earned" their action.
// ═══════════════════════════════════════════════════════════════

interface AttemptState {
  count: number;
  maxRequired: number;
  lastAttemptTime: number;
  completed: boolean;
}

const attempts: Map<string, AttemptState> = new Map();

// How many attempts are required for each action type
const requiredAttempts: Record<string, [number, number]> = {
  like: [3, 5],
  pass: [1, 2],
  match_confirm: [2, 4],
  send_message: [2, 3],
  yes_button: [2, 4],
  no_button: [1, 2],
  edit_profile: [1, 2],
  change_preference: [2, 3],
  view_compatibility: [1, 2],
  why_this_person: [3, 5],
  show_type: [2, 4],
  send_like: [2, 4],
};

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const AttemptEngine = {
  /**
   * Register an attempt for a given action key.
   * Returns { allowed, count, maxRequired, response }
   */
  attempt(actionKey: string, actionType: string = 'generic'): {
    allowed: boolean;
    count: number;
    maxRequired: number;
    isNew: boolean;
  } {
    let state = attempts.get(actionKey);

    if (!state) {
      const range = requiredAttempts[actionType] || [2, 4];
      state = {
        count: 0,
        maxRequired: getRandomInRange(range[0], range[1]),
        lastAttemptTime: Date.now(),
        completed: false,
      };
      attempts.set(actionKey, state);
    }

    if (state.completed) {
      return { allowed: true, count: state.count, maxRequired: state.maxRequired, isNew: false };
    }

    state.count++;
    state.lastAttemptTime = Date.now();

    if (state.count >= state.maxRequired) {
      state.completed = true;
      return { allowed: true, count: state.count, maxRequired: state.maxRequired, isNew: true };
    }

    return { allowed: false, count: state.count, maxRequired: state.maxRequired, isNew: true };
  },

  /**
   * Get current attempt state without incrementing
   */
  getState(actionKey: string): AttemptState | null {
    return attempts.get(actionKey) || null;
  },

  /**
   * Reset an action's attempt counter
   */
  reset(actionKey: string) {
    attempts.delete(actionKey);
  },

  /**
   * Reset all attempts
   */
  resetAll() {
    attempts.clear();
  },

  /**
   * Check if an action should be a "freebie" (no attempts required).
   * Creates rhythm: not every action should be difficult.
   * Returns true about 30% of the time for regular actions.
   */
  shouldBeFreebie(actionType: string): boolean {
    // Pass is usually easy
    if (actionType === 'pass') return Math.random() < 0.7;
    // Liking has rhythm: sometimes easy, sometimes not
    if (actionType === 'like') return Math.random() < 0.25;
    // Generic actions
    return Math.random() < 0.3;
  },

  /**
   * Get total unique actions attempted
   */
  getTotalAttempts(): number {
    let total = 0;
    attempts.forEach((state) => {
      total += state.count;
    });
    return total;
  },
};
