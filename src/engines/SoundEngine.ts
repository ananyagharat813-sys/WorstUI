// ═══════════════════════════════════════════════════════════════
// MAYBE™ Sound Engine
// Web Audio API-based sound system for all interaction sounds
// ═══════════════════════════════════════════════════════════════

type SoundType =
  | 'bonk'
  | 'ding'
  | 'chime'
  | 'impact'
  | 'click'
  | 'whoosh'
  | 'pop'
  | 'error'
  | 'success'
  | 'match'
  | 'confetti'
  | 'dramatic'
  | 'typing'
  | 'slide';

let audioContext: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function createOscillator(
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  duration: number,
  volume: number = 0.15,
  detune: number = 0
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.detune.setValueAtTime(detune, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function createNoise(ctx: AudioContext, duration: number, volume: number = 0.03) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * volume;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

const soundMap: Record<SoundType, () => void> = {
  bonk: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'sine', 200, 0.15, 0.2);
    createOscillator(ctx, 'sine', 120, 0.2, 0.15);
    createNoise(ctx, 0.08, 0.05);
  },
  ding: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'sine', 880, 0.4, 0.12);
    createOscillator(ctx, 'sine', 1320, 0.3, 0.06);
  },
  chime: () => {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        createOscillator(ctx, 'sine', freq, 0.6, 0.1);
        createOscillator(ctx, 'triangle', freq * 2, 0.3, 0.03);
      }, i * 120);
    });
  },
  impact: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'sine', 60, 0.4, 0.25);
    createOscillator(ctx, 'square', 40, 0.2, 0.08);
    createNoise(ctx, 0.15, 0.08);
  },
  click: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'sine', 600, 0.06, 0.08);
    createNoise(ctx, 0.03, 0.02);
  },
  whoosh: () => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    createNoise(ctx, 0.2, 0.04);
  },
  pop: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'sine', 400, 0.1, 0.15);
    createOscillator(ctx, 'sine', 600, 0.08, 0.08);
  },
  error: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'square', 200, 0.15, 0.08);
    createOscillator(ctx, 'square', 150, 0.2, 0.06);
  },
  success: () => {
    const ctx = getAudioContext();
    setTimeout(() => createOscillator(ctx, 'sine', 523, 0.2, 0.1), 0);
    setTimeout(() => createOscillator(ctx, 'sine', 659, 0.2, 0.1), 100);
    setTimeout(() => createOscillator(ctx, 'sine', 784, 0.3, 0.12), 200);
  },
  match: () => {
    const ctx = getAudioContext();
    const notes = [392, 523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        createOscillator(ctx, 'sine', freq, 0.8, 0.1);
        createOscillator(ctx, 'triangle', freq * 1.5, 0.4, 0.04);
      }, i * 150);
    });
  },
  confetti: () => {
    const ctx = getAudioContext();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createOscillator(ctx, 'sine', 800 + Math.random() * 800, 0.15, 0.05);
      }, i * 50);
    }
  },
  dramatic: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'sine', 100, 1.5, 0.15);
    createOscillator(ctx, 'sine', 150, 1.2, 0.1);
    setTimeout(() => {
      createOscillator(ctx, 'sine', 200, 0.8, 0.12);
      createOscillator(ctx, 'triangle', 400, 0.6, 0.06);
    }, 800);
    setTimeout(() => {
      createOscillator(ctx, 'sine', 523, 1.0, 0.15);
      createOscillator(ctx, 'sine', 659, 0.8, 0.1);
      createOscillator(ctx, 'sine', 784, 0.6, 0.08);
    }, 1500);
  },
  typing: () => {
    const ctx = getAudioContext();
    createOscillator(ctx, 'sine', 800 + Math.random() * 200, 0.03, 0.04);
  },
  slide: () => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  },
};

export const SoundEngine = {
  play(sound: SoundType) {
    if (!soundEnabled) return;
    try {
      soundMap[sound]();
    } catch {
      // Audio context not ready
    }
  },

  toggle(): boolean {
    soundEnabled = !soundEnabled;
    return soundEnabled;
  },

  isEnabled(): boolean {
    return soundEnabled;
  },

  setEnabled(enabled: boolean) {
    soundEnabled = enabled;
  },

  init() {
    // Call on first user interaction to unlock audio context
    getAudioContext();
  },
};
