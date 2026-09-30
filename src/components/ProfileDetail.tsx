import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Briefcase, Sparkles, HelpCircle,
} from 'lucide-react';
import {
  Profile, ProfileEngine, AlgorithmEngine,
  SoundEngine, RageEngine, NotificationEngine,
  EasterEggEngine,
} from '../engines';

interface ProfileDetailProps {
  profile: Profile;
  onBack: () => void;
}

export default function ProfileDetail({ profile, onBack }: ProfileDetailProps) {
  const [whyAttempts, setWhyAttempts] = useState(0);
  const [whyResponse, setWhyResponse] = useState<string | null>(null);
  const [whyLoading, setWhyLoading] = useState(false);
  const [compatClicks, setCompatClicks] = useState(0);

  const handleWhyClick = async () => {
    SoundEngine.init();
    RageEngine.addInteraction('why_this_person', true);

    const newAttempts = whyAttempts + 1;
    setWhyAttempts(newAttempts);

    setWhyLoading(true);
    const response = AlgorithmEngine.getWhyResponse(newAttempts);

    if (newAttempts <= 3) {
      // Show loading sequence
      setWhyResponse(AlgorithmEngine.getWhyResponse(1));
      await delay(1000);
      if (newAttempts >= 2) {
        setWhyResponse(AlgorithmEngine.getWhyResponse(2));
        await delay(1000);
      }
      if (newAttempts >= 3) {
        setWhyResponse(AlgorithmEngine.getWhyResponse(3));
        await delay(1000);
      }
    }

    setWhyLoading(false);
    setWhyResponse(response);
    SoundEngine.play(newAttempts <= 4 ? 'bonk' : 'ding');
  };

  const handleCompatClick = () => {
    const newClicks = compatClicks + 1;
    setCompatClicks(newClicks);
    SoundEngine.play('click');

    if (newClicks >= 3) {
      const egg = EasterEggEngine.trigger('compat_tapper');
      if (egg.discovered) {
        NotificationEngine.easterEgg('🔢 NUMBER CRUNCHER: Clicked compatibility 3 times!');
        SoundEngine.play('success');
      }
    }

    if (newClicks === 2) {
      NotificationEngine.info("The number is the same. Stop checking.");
    } else if (newClicks === 4) {
      NotificationEngine.info("It's not going to change.");
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h3 className="font-display font-semibold text-white">Profile</h3>
      </div>

      {/* Profile Image */}
      <div className={`h-72 bg-gradient-to-br ${profile.imageGradient} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10rem] font-display font-black text-white/15 select-none">
            {ProfileEngine.getInitials(profile.name)}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        {/* Compatibility */}
        <motion.button
          onClick={handleCompatClick}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 glass rounded-full px-4 py-2 flex items-center gap-2"
        >
          <Sparkles size={16} className="text-pink-400" />
          <span className="text-lg font-bold text-white">{profile.compatibility}%</span>
          <span className="text-xs text-slate-400">compatible</span>
        </motion.button>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-8 relative z-10">
        <h2 className="text-3xl font-display font-bold text-white mb-1">
          {profile.name}
          {profile.age > 0 && (
            <span className="text-2xl font-normal text-white/60 ml-2">{profile.age}</span>
          )}
        </h2>

        <div className="flex items-center gap-4 text-slate-400 mb-6">
          <span className="flex items-center gap-1 text-sm">
            <MapPin size={14} />
            {profile.location}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <Briefcase size={14} />
            {profile.profession}
          </span>
        </div>

        <p className="text-slate-300 leading-relaxed mb-6">{profile.bio}</p>

        {/* Interests */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Interests
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-slate-800/80 text-sm text-slate-300 border border-slate-700/50"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Prompts */}
        {profile.prompts.map((prompt, i) => (
          <div key={i} className="glass-card p-5 mb-4">
            <p className="text-xs text-slate-500 mb-2">{prompt.question}</p>
            <p className="text-slate-200 leading-relaxed">{prompt.answer}</p>
          </div>
        ))}

        {/* Personality detail */}
        <p className="text-sm text-slate-500 italic mb-6">{profile.personalityDetail}</p>

        {/* Compatibility breakdown */}
        <div className="glass-card p-5 mb-4">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-pink-400" />
            Compatibility Breakdown
          </h4>
          <ul className="space-y-2">
            {profile.compatibilityReasons.map((reason, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-slate-600 mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
          <p className="text-xs text-pink-400/60 italic mt-3">{profile.compatibilityRoast}</p>
        </div>

        {/* Why This Person button */}
        <div className="mb-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleWhyClick}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <HelpCircle size={16} />
            {whyAttempts === 0
              ? 'WHY THIS PERSON?'
              : whyAttempts < 4
              ? 'Try Again'
              : 'Keep Asking'}
          </motion.button>

          {whyResponse && (
            <motion.div
              key={whyResponse}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 glass-card p-4"
            >
              {whyLoading && (
                <div className="flex justify-center mb-2">
                  <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <p className="text-sm text-slate-300 text-center italic">
                "{whyResponse}"
              </p>
            </motion.div>
          )}
        </div>

        {/* Easter egg clue */}
        {profile.easterEggClue && (
          <p className="text-[10px] text-slate-700 text-center mb-4 hover:text-slate-500 transition-colors cursor-default">
            {profile.easterEggClue}
          </p>
        )}
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
