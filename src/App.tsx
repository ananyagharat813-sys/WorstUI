import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Compass, Heart, MessageCircle, Settings, Sparkles,
} from 'lucide-react';
import {
  SoundEngine, RageEngine, EasterEggEngine,
  NotificationEngine, ResponseEngine, ProfileEngine,
} from './engines';
import type { Profile } from './engines';
import Discovery from './components/Discovery';
import MatchesList from './components/MatchesList';
import ChatView from './components/ChatView';
import ProfileDetail from './components/ProfileDetail';
import SettingsView from './components/SettingsView';
import AlgorithmPage from './components/AlgorithmPage';
import YourType from './components/YourType';
import RageMeter from './components/RageMeter';
import ToastContainer from './components/ToastContainer';
import Confetti from './components/Confetti';

type View = 'splash' | 'discover' | 'matches' | 'chat' | 'profile' | 'settings' | 'algorithm' | 'your_type';

// Konami code tracker
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function App() {
  const [view, setView] = useState<View>('splash');
  const [chatMatchId, setChatMatchId] = useState<string | null>(null);
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [logoClicks, setLogoClicks] = useState(0);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [showTouchGrass, setShowTouchGrass] = useState(false);
  const [idleTimer, setIdleTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');

  // Splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setView('discover');
      SoundEngine.init();
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIndex]) {
        const next = konamiIndex + 1;
        setKonamiIndex(next);
        if (next === KONAMI.length) {
          const egg = EasterEggEngine.trigger('konami');
          if (egg.discovered) {
            NotificationEngine.easterEgg('🎮 OLD SCHOOL: Konami Code activated! +100 compatibility with everyone.');
            SoundEngine.play('success');
          }
          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  // Idle detection
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      const timer = setTimeout(() => {
        const egg = EasterEggEngine.trigger('idle_champion');
        if (egg.discovered) {
          NotificationEngine.easterEgg('🧘 ZEN MASTER: Stayed idle for 60 seconds. Impressive restraint.');
          SoundEngine.play('chime');
        }
      }, 60000);
      setIdleTimer(timer);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('click', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('click', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  // Touch grass achievement
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const total = RageEngine.getTotalInteractions();
      if (total >= 100 && !EasterEggEngine.isDiscovered('touch_grass')) {
        const egg = EasterEggEngine.trigger('touch_grass');
        if (egg.discovered) {
          setAchievementText("TOUCH GRASS");
          setShowAchievement(true);
          SoundEngine.play('dramatic');
        }
      }
    }, 2000);
    return () => clearInterval(checkInterval);
  }, []);

  // Self-aware messages
  useEffect(() => {
    const interval = setInterval(() => {
      const total = RageEngine.getTotalInteractions();
      const msg = ResponseEngine.getSelfAwareResponse(total);
      // Show self-aware message occasionally
      if (msg && total > 0 && total % 20 === 0) {
        NotificationEngine.info(msg);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = useCallback(() => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    SoundEngine.play('click');
    EasterEggEngine.trackRapidClick();

    if (newCount >= 7) {
      const egg = EasterEggEngine.trigger('logo_clicks');
      if (egg.discovered) {
        NotificationEngine.easterEgg('🥚 LOGO ENTHUSIAST: You clicked the logo 7 times! Why?');
        SoundEngine.play('success');
      }
      setLogoClicks(0);
    }
  }, [logoClicks]);

  const navigateTo = useCallback((newView: View) => {
    SoundEngine.play('slide');
    setView(newView);
    setDetailProfile(null);
    setChatMatchId(null);
  }, []);

  // Splash Screen
  if (view === 'splash') {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-display font-black gradient-text mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          >
            MAYBE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-slate-500 text-sm tracking-[0.3em] uppercase"
          >
            Because YES was too easy
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8"
          >
            <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col max-w-lg mx-auto">
      {/* Top Bar */}
      <header className="glass px-4 py-3 flex items-center justify-between border-b border-slate-800/50 relative z-20">
        <button onClick={handleLogoClick} className="select-none">
          <h1 className="text-xl font-display font-black gradient-text tracking-tight">
            MAYBE
          </h1>
        </button>

        <div className="flex items-center gap-2">
          {/* Hidden button easter egg */}
          <button
            onClick={() => {
              const egg = EasterEggEngine.trigger('hidden_button');
              if (egg.discovered) {
                NotificationEngine.easterEgg('🔍 EAGLE EYE: You found the hidden button!');
                SoundEngine.play('success');
              } else {
                // Show nothing visible
              }
            }}
            className="w-6 h-6 rounded opacity-0 hover:opacity-5"
            aria-label="Hidden button"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              SoundEngine.play('bonk');
              NotificationEngine.info("MAYBE Premium™ — Coming never. Probably.");
            }}
            className="relative"
          >
            <Sparkles size={20} className="text-amber-400/60 hover:text-amber-400 transition-colors" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {view === 'discover' && !detailProfile && (
            <motion.div
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <Discovery
                onMatch={(matchId) => {
                  setChatMatchId(matchId);
                  setView('chat');
                }}
                onViewProfile={(profile) => setDetailProfile(profile)}
              />
            </motion.div>
          )}

          {view === 'discover' && detailProfile && (
            <motion.div
              key="profile-detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full"
            >
              <ProfileDetail
                profile={detailProfile}
                onBack={() => setDetailProfile(null)}
              />
            </motion.div>
          )}

          {view === 'matches' && !chatMatchId && (
            <motion.div
              key="matches"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <MatchesList
                onOpenChat={(matchId) => {
                  setChatMatchId(matchId);
                  setView('chat');
                }}
              />
            </motion.div>
          )}

          {view === 'chat' && chatMatchId && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full"
            >
              <ChatView
                matchId={chatMatchId}
                onBack={() => {
                  setChatMatchId(null);
                  setView('matches');
                }}
              />
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <SettingsView
                onShowAlgorithm={() => setView('algorithm')}
                onShowType={() => setView('your_type')}
              />
            </motion.div>
          )}

          {view === 'algorithm' && (
            <motion.div
              key="algorithm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full"
            >
              <AlgorithmPage onBack={() => setView('settings')} />
            </motion.div>
          )}

          {view === 'your_type' && (
            <motion.div
              key="your_type"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full"
            >
              <YourType onBack={() => setView('settings')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="glass border-t border-slate-800/50 px-6 py-2 relative z-20">
        <div className="flex items-center justify-around">
          {[
            { icon: Compass, label: 'Discover', viewId: 'discover' as View },
            { icon: Heart, label: 'Matches', viewId: 'matches' as View },
            { icon: MessageCircle, label: 'Chat', viewId: 'matches' as View },
            { icon: Settings, label: 'Settings', viewId: 'settings' as View },
          ].map(({ icon: Icon, label, viewId }) => {
            const isActive = view === viewId || (viewId === 'matches' && view === 'chat');
            return (
              <button
                key={label}
                onClick={() => navigateTo(viewId)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-pink-400'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Overlays */}
      <RageMeter />
      <ToastContainer />

      {/* Touch Grass Achievement */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={() => setShowAchievement(false)}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center px-8"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ repeat: 3, duration: 0.4 }}
                className="text-7xl mb-6"
              >
                🏆
              </motion.div>
              <h2 className="text-3xl font-display font-black text-amber-400 mb-2">
                ACHIEVEMENT UNLOCKED
              </h2>
              <h3 className="text-4xl font-display font-black text-white mb-4">
                {achievementText}
              </h3>
              <p className="text-slate-400 mb-8">
                You've spent enough time dating pixels.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button
                  onClick={() => {
                    NotificationEngine.info('Respect.');
                    setShowAchievement(false);
                  }}
                  className="btn-primary"
                >
                  Keep Going
                </button>
                <button
                  onClick={() => {
                    NotificationEngine.info("We both know you're staying.");
                    setShowAchievement(false);
                  }}
                  className="btn-secondary"
                >
                  Pretend I Have a Life
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
