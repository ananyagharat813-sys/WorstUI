import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RageEngine } from '../engines';
import { Flame } from 'lucide-react';

export default function RageMeter() {
  const [level, setLevel] = useState(RageEngine.getLevel());
  const [revealed, setRevealed] = useState(RageEngine.isRevealed());
  const [showMax, setShowMax] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(RageEngine.getLevel());
      setRevealed(RageEngine.isRevealed());
      if (RageEngine.isMaxReached() && !showMax) {
        setShowMax(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [showMax]);

  if (!revealed) return null;

  const getColor = () => {
    if (level < 30) return 'from-yellow-500 to-orange-500';
    if (level < 50) return 'from-orange-500 to-red-500';
    if (level < 70) return 'from-red-500 to-red-600';
    if (level < 85) return 'from-red-600 to-red-700';
    return 'from-red-700 to-red-900';
  };

  const getMessage = () => {
    if (level < 30) return '';
    if (level < 50) return "You're getting annoyed.";
    if (level < 70) return 'We can tell.';
    if (level < 85) return 'You could stop.';
    if (level < 95) return "You won't.";
    return 'MAXIMUM RAGE ACHIEVED.';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <div
          className={`glass-card px-4 py-3 w-48 ${
            level >= 85 ? 'rage-glow' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame
              size={16}
              className={`${
                level >= 70
                  ? 'text-red-400 animate-pulse'
                  : 'text-orange-400'
              }`}
            />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Rage Level
            </span>
          </div>

          <div className="relative h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${level}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>

          <div className="flex justify-between items-center mt-1.5">
            <span className="text-xs font-bold text-slate-400">
              {level}%
            </span>
            {getMessage() && (
              <motion.span
                key={getMessage()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-slate-500 italic"
              >
                {getMessage()}
              </motion.span>
            )}
          </div>
        </div>

        {/* Max rage celebration */}
        <AnimatePresence>
          {showMax && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-2 glass-card px-4 py-3 text-center"
            >
              <p className="text-xs font-bold text-red-400">🔥 CONGRATULATIONS 🔥</p>
              <p className="text-[10px] text-slate-400 mt-1">
                You've been successfully ragebaited by a dating app.
              </p>
              <button
                onClick={() => setShowMax(false)}
                className="mt-2 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                I'm proud of myself
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
