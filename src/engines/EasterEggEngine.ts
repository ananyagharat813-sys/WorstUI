// ═══════════════════════════════════════════════════════════════
// MAYBE™ Easter Egg Engine
// Tracks and triggers hidden easter eggs throughout the app.
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'maybe_eggs';

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  discovered: boolean;
  triggerCount: number;
  requiredCount: number;
}

const easterEggDefinitions: Omit<EasterEgg, 'discovered' | 'triggerCount'>[] = [
  { id: 'logo_clicks', name: '🥚 Logo Enthusiast', description: 'Clicked the logo 7 times', requiredCount: 7 },
  { id: 'rapid_clicks', name: '⚡ Speed Demon', description: 'Clicked something 10 times in 3 seconds', requiredCount: 10 },
  { id: 'profile_stalker', name: '👀 Profile Enthusiast', description: 'Viewed the same profile 5 times', requiredCount: 5 },
  { id: 'idle_champion', name: '🧘 Zen Master', description: 'Stayed idle for 60 seconds', requiredCount: 1 },
  { id: 'settings_addict', name: '⚙️ Settings Enjoyer', description: 'Opened settings 5 times', requiredCount: 5 },
  { id: 'compat_tapper', name: '🔢 Number Cruncher', description: 'Clicked a compatibility percentage 3 times', requiredCount: 3 },
  { id: 'konami', name: '🎮 Old School', description: 'Entered the Konami Code', requiredCount: 1 },
  { id: 'pref_indecisive', name: '🔄 Indecisive', description: 'Changed preferences 8 times', requiredCount: 8 },
  { id: 'speed_passer', name: '💨 Speed Dater', description: 'Passed 5 profiles in 10 seconds', requiredCount: 5 },
  { id: 'like_spree', name: '💕 Love Bomber', description: 'Liked 10 profiles', requiredCount: 10 },
  { id: 'convo_opener', name: '💬 Conversation Starter', description: 'Opened the same conversation 3 times', requiredCount: 3 },
  { id: 'footer_click', name: '👣 Footer Explorer', description: 'Clicked the footer', requiredCount: 1 },
  { id: 'hidden_button', name: '🔍 Eagle Eye', description: 'Found the hidden button', requiredCount: 1 },
  { id: 'algorithm_page', name: '🧠 Algorithm Whisperer', description: 'Discovered THE ALGORITHM™ page', requiredCount: 1 },
  { id: 'touch_grass', name: '🌿 Touch Grass', description: 'Reached 100 total interactions', requiredCount: 100 },
  { id: 'rage_max', name: '🔥 Maximum Rage', description: 'Reached 100% rage level', requiredCount: 1 },
];

function loadEggs(): EasterEgg[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return easterEggDefinitions.map((def) => ({
    ...def,
    discovered: false,
    triggerCount: 0,
  }));
}

let eggs = loadEggs();

function saveEggs() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eggs));
  } catch {}
}

// Rapid click tracking
let rapidClicks: number[] = [];

export const EasterEggEngine = {
  trigger(eggId: string): { discovered: boolean; egg: EasterEgg | null } {
    const egg = eggs.find((e) => e.id === eggId);
    if (!egg) return { discovered: false, egg: null };

    if (egg.discovered) return { discovered: false, egg };

    egg.triggerCount++;

    if (egg.triggerCount >= egg.requiredCount) {
      egg.discovered = true;
      saveEggs();
      return { discovered: true, egg };
    }

    saveEggs();
    return { discovered: false, egg };
  },

  trackRapidClick(): boolean {
    const now = Date.now();
    rapidClicks.push(now);
    rapidClicks = rapidClicks.filter((t) => now - t < 3000);

    if (rapidClicks.length >= 10) {
      const result = this.trigger('rapid_clicks');
      if (result.discovered) {
        rapidClicks = [];
        return true;
      }
    }
    return false;
  },

  getDiscovered(): EasterEgg[] {
    return eggs.filter((e) => e.discovered);
  },

  getAll(): EasterEgg[] {
    return eggs;
  },

  getDiscoveredCount(): number {
    return eggs.filter((e) => e.discovered).length;
  },

  getTotalCount(): number {
    return eggs.length;
  },

  isDiscovered(eggId: string): boolean {
    const egg = eggs.find((e) => e.id === eggId);
    return egg?.discovered || false;
  },

  reset() {
    eggs = easterEggDefinitions.map((def) => ({
      ...def,
      discovered: false,
      triggerCount: 0,
    }));
    saveEggs();
  },
};
