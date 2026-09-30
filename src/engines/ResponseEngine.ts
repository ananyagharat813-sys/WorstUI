// ═══════════════════════════════════════════════════════════════
// MAYBE™ Response Engine
// Generates contextual, funny responses based on attempt count
// and action context. The heart of MAYBE's personality.
// ═══════════════════════════════════════════════════════════════

type ActionContext =
  | 'like'
  | 'pass'
  | 'match'
  | 'message'
  | 'yes'
  | 'no'
  | 'settings'
  | 'profile_view'
  | 'preference_change'
  | 'refresh'
  | 'compatibility'
  | 'generic'
  | 'send_message'
  | 'edit_profile'
  | 'why_this_person'
  | 'show_type';

const baseResponses: Record<number, string> = {
  1: 'Okay.',
  2: 'Again?',
  3: 'You seem committed.',
  4: 'We both know where this is going.',
  5: 'Fine.',
  6: 'You win.',
};

const contextResponses: Record<ActionContext, string[]> = {
  like: [
    "You are fighting for this Like harder than the actual relationship.",
    "You have expensive taste.",
    "The heart wants what the heart wants. Unfortunately it needs to click 5 times.",
    "This Like has been through more emotional processing than most relationships.",
    "Your thumb is doing more work than Cupid at this point.",
    "At this point I'm legally required to let you like them.",
    "The Like button is starting to develop feelings for YOU.",
    "We've never seen this level of commitment in a Like before.",
  ],
  pass: [
    "Still searching?",
    "Okay, so we're looking for perfection.",
    "You are surprisingly difficult to impress.",
    "At this rate, you'll be single by choice AND by algorithm.",
    "We heard you the first four times.",
    "The pass button is getting a workout.",
    "Your standards just called. Even they're confused.",
    "We're running out of people who meet your non-existent criteria.",
  ],
  match: [
    "We know.",
    "Patience is a virtue you're currently failing.",
    "The match system is not a vending machine.",
    "We understand what you're trying to do.",
    "This match has been approved by committee.",
    "Your persistence is noted in the algorithm.",
  ],
  message: [
    "This message has gone through more emotional processing than most relationships.",
    "Just say hi. It's not a TED talk.",
    "The algorithm already told them you're overthinking this.",
    "Your message is being reviewed by our panel of relationship experts. Just kidding. Or are we?",
    "That message was fine the first time you tried to send it.",
  ],
  yes: [
    "YES has never been this difficult.",
    "The YES button has trust issues now.",
    "Your commitment to YES is... noted.",
    "We understand. You want YES. Revolutionary concept.",
    "In the time you've spent clicking YES, you could have gone on an actual date.",
    "The YES button is considering filing a restraining order.",
  ],
  no: [
    "We heard you the first four times.",
    "NO is a complete sentence. But apparently not a complete click.",
    "The NO button feels rejected. Ironic.",
    "You're saying no more aggressively than most people say yes.",
    "We get it. The answer is no. The NO button, however, disagrees.",
  ],
  settings: [
    "You're avoiding the dating part.",
    "We meet again.",
    "Settings won't fix your love life. But go ahead.",
    "The settings page feels more loved than the profiles do.",
    "Still looking for the 'make dating easy' toggle? It doesn't exist.",
  ],
  profile_view: [
    "You could just like them.",
    "Back again?",
    "Just send the Like.",
    "We've noticed you keep coming back to this profile.",
    "At this point, just DM them on Instagram.",
    "The profile is the same as it was 30 seconds ago.",
  ],
  preference_change: [
    "At this point even YOU don't know your type.",
    "Your type has officially become 'someone.'",
    "We're keeping track of how many times you've changed this.",
    "The algorithm just sighed.",
    "Your preferences change more often than your actual dates.",
  ],
  refresh: [
    "Refreshing won't create a soulmate.",
    "Still refreshing?",
    "New profiles don't appear because you pressed refresh harder.",
    "The algorithm is doing its best. Give it a moment.",
    "You've refreshed more times than you've actually looked at profiles.",
  ],
  compatibility: [
    "The number is the same. Stop checking.",
    "Compatibility doesn't change just because you stare at it.",
    "It's still 84%. It was 84% last time too.",
    "We have already done the math. You're welcome.",
  ],
  generic: [
    "Your persistence is concerning.",
    "Okay bro.",
    "The algorithm has surrendered.",
    "This is between you and the button now.",
    "I respect the dedication.",
    "You could have simply accepted the first answer.",
    "At this point I'm legally required to let you.",
    "We admire your energy.",
    "The button did nothing to deserve this.",
    "You built this situation.",
  ],
  send_message: [
    "That message was fine the first time.",
    "The send button doesn't have commitment issues. You do.",
    "Just send it. The worst they can do is not reply. Forever.",
    "Your message has been emotionally vetted. It's fine.",
    "We've seen worse opening lines. Much worse.",
  ],
  edit_profile: [
    "Your bio won't write itself. Oh wait, that's what we're here for.",
    "How many times can one person rethink their personality?",
    "The edit button is starting to take this personally.",
  ],
  why_this_person: [
    "Excellent question.",
    "We're checking.",
    "Still checking.",
    "We have decided not to disclose that.",
    "Stop asking.",
    "Fine. You remind us of a particularly stubborn golden retriever. In a good way.",
  ],
  show_type: [
    "Unfortunately, it's unavailable.",
    "We're still compiling the data.",
    "Your type is... complex.",
    "The results are in. They're devastating.",
  ],
};

const selfAwareResponses = [
  "We're both still doing this?",
  "We have questions.",
  "This is getting personal.",
  "You built this situation.",
  "Respect.",
  "The app is starting to feel things.",
  "We've been through a lot together.",
  "At this point, we're basically in a relationship.",
  "You're the most persistent user we've ever had. That's not a compliment.",
  "The algorithm has started therapy because of you.",
];

export const ResponseEngine = {
  getResponse(attemptCount: number, context: ActionContext = 'generic'): string {
    // Base responses for low attempt counts
    if (attemptCount <= 6 && baseResponses[attemptCount]) {
      return baseResponses[attemptCount];
    }

    // Context-specific responses for higher counts
    const contextPool = contextResponses[context] || contextResponses.generic;
    const index = (attemptCount - 7) % contextPool.length;
    return contextPool[index];
  },

  getSelfAwareResponse(totalInteractions: number): string | null {
    if (totalInteractions < 15) return null;
    if (totalInteractions < 25) return selfAwareResponses[0];
    if (totalInteractions < 35) return selfAwareResponses[1];
    if (totalInteractions < 50) return selfAwareResponses[2];
    if (totalInteractions < 70) return selfAwareResponses[3];
    if (totalInteractions < 90) return selfAwareResponses[4];
    const idx = Math.floor((totalInteractions - 90) / 20) % selfAwareResponses.length;
    return selfAwareResponses[idx];
  },

  getContextual(context: ActionContext): string {
    const pool = contextResponses[context] || contextResponses.generic;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  getRageComment(rageLevel: number): string {
    if (rageLevel < 30) return '';
    if (rageLevel < 50) return "You're getting annoyed.";
    if (rageLevel < 70) return "We can tell.";
    if (rageLevel < 85) return "You could stop.";
    if (rageLevel < 95) return "You won't.";
    return "MAXIMUM RAGE ACHIEVED.";
  },
};
