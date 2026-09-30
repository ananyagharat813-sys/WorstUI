import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, RefreshCw, Trash2, Eye, Sparkles, ChevronRight,
} from 'lucide-react';
import {
  SoundEngine, RageEngine, NotificationEngine,
  EasterEggEngine, ResponseEngine, AlgorithmEngine,
} from '../engines';

interface SettingsViewProps {
  onShowAlgorithm: () => void;
  onShowType: () => void;
}

export default function SettingsView({ onShowAlgorithm, onShowType }: SettingsViewProps) {
  const [soundOn, setSoundOn] = useState(SoundEngine.isEnabled());
  const [openCount, setOpenCount] = useState(0);
  const [showEggs, setShowEggs] = useState(false);
  const [prefAge, setPrefAge] = useState([22, 35]);
  const [prefDistance, setPrefDistance] = useState(25);
  const [prefChanges, setPrefChanges] = useState(0);

  // Track settings opens
  useState(() => {
    RageEngine.addInteraction('settings', false);
    EasterEggEngine.trigger('settings_addict');
    const stats = RageEngine.getStats();
    if (stats.settingsOpened > 3) {
      NotificationEngine.info(ResponseEngine.getContextual('settings'));
    }
  });

  const handleSoundToggle = () => {
    const newState = SoundEngine.toggle();
    setSoundOn(newState);
    if (newState) SoundEngine.play('ding');
  };

  const handlePrefChange = () => {
    const newCount = prefChanges + 1;
    setPrefChanges(newCount);
    RageEngine.addInteraction('preference_change', false);
    EasterEggEngine.trigger('pref_indecisive');

    if (newCount >= 3) {
      NotificationEngine.info(ResponseEngine.getContextual('preference_change'));
    }
    SoundEngine.play('click');
  };

  const discoveredEggs = EasterEggEngine.getDiscovered();
  const totalEggs = EasterEggEngine.getTotalCount();

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3">
        <h2 className="text-2xl font-display font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Adjusting settings won't fix your love life. But go ahead.
        </p>
      </div>

      <div className="px-4 space-y-4 pb-24">
        {/* Sound */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundOn ? (
                <Volume2 size={20} className="text-pink-400" />
              ) : (
                <VolumeX size={20} className="text-slate-500" />
              )}
              <div>
                <p className="text-sm font-semibold text-white">Sound Effects</p>
                <p className="text-xs text-slate-500">
                  {soundOn ? 'Currently judging you audibly' : 'Judging you silently'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`w-12 h-7 rounded-full transition-all ${
                soundOn ? 'bg-pink-500' : 'bg-slate-700'
              } relative`}
            >
              <motion.div
                animate={{ x: soundOn ? 20 : 2 }}
                className="w-5 h-5 rounded-full bg-white absolute top-1"
              />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold text-white mb-4">Dating Preferences</h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Age Range</span>
                <span className="text-slate-300">{prefAge[0]} - {prefAge[1]}</span>
              </div>
              <input
                type="range"
                min={18}
                max={50}
                value={prefAge[1]}
                onChange={(e) => {
                  setPrefAge([prefAge[0], parseInt(e.target.value)]);
                  handlePrefChange();
                }}
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Distance</span>
                <span className="text-slate-300">{prefDistance} mi</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={prefDistance}
                onChange={(e) => {
                  setPrefDistance(parseInt(e.target.value));
                  handlePrefChange();
                }}
                className="w-full accent-pink-500"
              />
            </div>
          </div>

          {prefChanges >= 5 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-pink-400/60 italic mt-3"
            >
              You've changed your preferences {prefChanges} times this session. Commitment issues?
            </motion.p>
          )}
        </div>

        {/* THE ALGORITHM™ */}
        <button
          onClick={() => {
            EasterEggEngine.trigger('algorithm_page');
            onShowAlgorithm();
          }}
          className="w-full glass-card p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-purple-400" />
            <div className="text-left">
              <p className="text-sm font-semibold text-white">THE ALGORITHM™</p>
              <p className="text-xs text-slate-500">Patent pending. Probably.</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        {/* Your Type */}
        <button
          onClick={onShowType}
          className="w-full glass-card p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-amber-400" />
            <div className="text-left">
              <p className="text-sm font-semibold text-white">YOUR TYPE</p>
              <p className="text-xs text-slate-500">We've been watching.</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        {/* Easter Eggs */}
        <button
          onClick={() => setShowEggs(!showEggs)}
          className="w-full glass-card p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🥚</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Easter Eggs</p>
              <p className="text-xs text-slate-500">
                {discoveredEggs.length}/{totalEggs} discovered
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className={`text-slate-600 transition-transform ${showEggs ? 'rotate-90' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showEggs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {EasterEggEngine.getAll().map((egg) => (
                <div
                  key={egg.id}
                  className={`glass-card p-3 flex items-center gap-3 ${
                    egg.discovered ? '' : 'opacity-40'
                  }`}
                >
                  <span className="text-lg">{egg.discovered ? egg.name.split(' ')[0] : '❓'}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {egg.discovered ? egg.name : '???'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {egg.discovered ? egg.description : 'Not yet discovered'}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rage Stats */}
        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Session Stats</h4>
          <div className="grid grid-cols-2 gap-3">
            {(() => {
              const stats = RageEngine.getStats();
              return [
                { label: 'Total Interactions', value: stats.totalInteractions },
                { label: 'Likes Given', value: stats.likeCount },
                { label: 'Profiles Passed', value: stats.passCount },
                { label: 'Messages Attempted', value: stats.messageAttempts },
                { label: 'Settings Opened', value: stats.settingsOpened },
                { label: 'Pref Changes', value: stats.prefChanges },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-bold text-pink-400">{stat.value}</p>
                  <p className="text-[10px] text-slate-500">{stat.label}</p>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Hidden footer button (easter egg) */}
        <div className="pt-8 pb-4 text-center">
          <p className="text-[10px] text-slate-700">MAYBE™ v1.0.0 — "Because YES was too easy."</p>
          <button
            onClick={() => {
              const egg = EasterEggEngine.trigger('footer_click');
              if (egg.discovered) {
                NotificationEngine.easterEgg('👣 FOOTER EXPLORER: You found it!');
                SoundEngine.play('success');
              } else {
                NotificationEngine.info("You clicked the footer. Bold move.");
              }
            }}
            className="text-[8px] text-slate-800 hover:text-slate-500 transition-colors mt-1"
          >
            © 2024 MAYBE Inc. All rights reserved. None of this is real.
          </button>
        </div>
      </div>
    </div>
  );
}
