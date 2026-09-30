import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import {
  AlgorithmEngine, RageEngine, SoundEngine, NotificationEngine,
  AttemptEngine, ResponseEngine,
} from '../engines';

interface YourTypeProps {
  onBack: () => void;
}

export default function YourType({ onBack }: YourTypeProps) {
  const [showAttempts, setShowAttempts] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = RageEngine.getStats();
  const analysis = AlgorithmEngine.getUserTypeAnalysis(stats);

  const handleShowType = async () => {
    SoundEngine.init();
    const newAttempts = showAttempts + 1;
    setShowAttempts(newAttempts);
    RageEngine.addInteraction('show_type', true);

    if (newAttempts === 1) {
      setLoading(true);
      setShowMessage("Analyzing your behavior...");
      SoundEngine.play('click');
      await delay(1500);
      setShowMessage("Unfortunately, it's unavailable.");
      setLoading(false);
      return;
    }

    if (newAttempts === 2) {
      setLoading(true);
      setShowMessage("We're still compiling the data.");
      SoundEngine.play('bonk');
      await delay(1000);
      setShowMessage("Try again.");
      setLoading(false);
      return;
    }

    if (newAttempts === 3) {
      setShowMessage("Your type is... complex.");
      SoundEngine.play('error');
      return;
    }

    if (newAttempts >= 4) {
      setLoading(true);
      setShowMessage("Fine. Computing...");
      SoundEngine.play('dramatic');
      await delay(2000);
      setShowMessage(null);
      setLoading(false);
      setRevealed(true);
      SoundEngine.play('ding');
      return;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h3 className="font-display font-semibold text-white">Your Type</h3>
      </div>

      <div className="px-6 pt-8 pb-24">
        {/* Hero */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-6 shadow-2xl shadow-amber-500/20"
          >
            <Eye size={28} className="text-white" />
          </motion.div>

          <h2 className="text-2xl font-display font-bold text-white mb-2">
            WE HAVE NOTICED A PATTERN.
          </h2>
          <p className="text-slate-400 text-sm">
            Based on your activity, we've identified your type.
          </p>
        </div>

        {/* Detected traits */}
        <div className="glass-card p-5 mb-6">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Apparently you like:
          </h4>
          <div className="space-y-2">
            {analysis.traits.map((trait, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm text-slate-300"
              >
                {trait}
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-slate-500 italic mt-4">You have a type.</p>
        </div>

        {/* Show type button */}
        {!revealed ? (
          <div className="text-center">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleShowType}
              className="btn-primary w-full mb-4"
            >
              {showAttempts === 0
                ? 'Show me my type'
                : showAttempts < 3
                ? 'Try again'
                : 'Show me already'}
            </motion.button>

            <AnimatePresence>
              {showMessage && (
                <motion.div
                  key={showMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-4"
                >
                  {loading && (
                    <div className="flex justify-center mb-2">
                      <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <p className="text-sm text-slate-300 text-center italic">
                    {showMessage}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center"
          >
            <div className="mb-4">
              <p className="text-lg font-display font-bold text-white mb-4">
                Your type is:
              </p>
              <p className="text-xl text-pink-400 font-display italic leading-relaxed">
                "{analysis.roast}"
              </p>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              This analysis was generated by THE ALGORITHM™ and should not be taken personally. Or should it.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
