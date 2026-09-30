import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, X, Star, MapPin, Briefcase, ChevronDown, Sparkles,
} from 'lucide-react';
import {
  Profile, ProfileEngine, AttemptEngine, RageEngine,
  ResponseEngine, SoundEngine, MatchEngine, NotificationEngine,
  EasterEggEngine,
} from '../engines';
import Confetti from './Confetti';

interface DiscoveryProps {
  onMatch: (matchId: string) => void;
  onViewProfile: (profile: Profile) => void;
}

export default function Discovery({ onMatch, onViewProfile }: DiscoveryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [likeMessage, setLikeMessage] = useState<string | null>(null);
  const [showLikeLoading, setShowLikeLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [showFakeout, setShowFakeout] = useState(false);
  const [showAlmost, setShowAlmost] = useState(false);
  const [almostReason, setAlmostReason] = useState('');
  const [expandedBio, setExpandedBio] = useState(false);
  const [showFinalBoss, setShowFinalBoss] = useState(false);
  const [finalBossStage, setFinalBossStage] = useState(0);
  const [likeAttemptKey, setLikeAttemptKey] = useState('');
  const [passStreak, setPassStreak] = useState(0);
  const [passTimestamps, setPassTimestamps] = useState<number[]>([]);

  useEffect(() => {
    // Check if we should show the final boss
    const interactions = RageEngine.getTotalInteractions();
    if (ProfileEngine.shouldShowFinalBoss(interactions) && !showFinalBoss && currentIndex >= 15) {
      const boss = ProfileEngine.getFinalBoss();
      setCurrentProfile(boss);
      setShowFinalBoss(true);
      return;
    }

    const profile = ProfileEngine.getNextProfile(currentIndex);
    if (profile) {
      setCurrentProfile(profile);
      setLikeAttemptKey(`like-${profile.id}`);
    }
  }, [currentIndex]);

  const advanceProfile = useCallback(() => {
    setIsAnimating(false);
    setSwipeDirection(null);
    setLikeMessage(null);
    setExpandedBio(false);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleLike = useCallback(async () => {
    if (!currentProfile || isAnimating) return;

    SoundEngine.init();
    RageEngine.addInteraction('like', false);
    EasterEggEngine.trackRapidClick();

    // Track like count for easter egg
    const stats = RageEngine.getStats();
    if (stats.likeCount === 10) {
      const egg = EasterEggEngine.trigger('like_spree');
      if (egg.discovered) {
        NotificationEngine.easterEgg('🏆 LOVE BOMBER: Liked 10 profiles!');
        SoundEngine.play('success');
      }
    }

    // Final boss handling
    if (currentProfile.isFinalBoss) {
      handleFinalBossLike();
      return;
    }

    // Check if this should be a freebie
    const isFreebie = AttemptEngine.shouldBeFreebie('like');
    if (isFreebie && !AttemptEngine.getState(likeAttemptKey)) {
      // Instant like - no frustration
      performLike();
      return;
    }

    // Attempt engine
    const result = AttemptEngine.attempt(likeAttemptKey, 'like');

    if (!result.allowed) {
      // Not yet allowed - show frustration response
      RageEngine.addInteraction('like', true);
      const response = ResponseEngine.getResponse(result.count, 'like');
      setLikeMessage(response);

      if (result.count === 1) {
        setShowLikeLoading(true);
        SoundEngine.play('click');
        await delay(800);
        setShowLikeLoading(false);
        setLikeMessage('Wait.');
        await delay(600);
        setLikeMessage(response);
      } else if (result.count === 2) {
        SoundEngine.play('bonk');
      } else if (result.count >= 3) {
        SoundEngine.play('error');
      }

      // Clear message after a moment
      setTimeout(() => {
        if (result.count < result.maxRequired) {
          setLikeMessage(null);
        }
      }, 2000);
      return;
    }

    // Allowed!
    performLike();
  }, [currentProfile, isAnimating, likeAttemptKey]);

  const performLike = useCallback(async () => {
    if (!currentProfile) return;

    setIsAnimating(true);
    SoundEngine.play('ding');
    setLikeMessage('❤️ LIKED');
    setSwipeDirection('right');

    // Check for match
    const matchResult = MatchEngine.tryMatch(currentProfile);

    if (matchResult.isFakeout) {
      // Fakeout match!
      await delay(600);
      setShowConfetti(true);
      SoundEngine.play('match');
      setMatchProfile(currentProfile);
      setShowFakeout(true);
      await delay(2000);
      setShowConfetti(false);
      return;
    }

    if (matchResult.isAlmostMatch) {
      // Almost match
      await delay(600);
      setAlmostReason(matchResult.almostReason || 'Undisclosed reasons.');
      setShowAlmost(true);
      return;
    }

    if (matchResult.matched && matchResult.match) {
      // Real match!
      await delay(600);
      setShowConfetti(true);
      SoundEngine.play('match');
      setMatchProfile(currentProfile);
      setShowMatch(true);
      return;
    }

    // No match, just advance
    const state = AttemptEngine.getState(likeAttemptKey);
    if (state && state.count > 1) {
      setLikeMessage(`That took you ${state.count} attempts.`);
      await delay(1500);
    } else {
      await delay(600);
    }

    MatchEngine.likeProfile(currentProfile.id);
    advanceProfile();
  }, [currentProfile, likeAttemptKey, advanceProfile]);

  const handlePass = useCallback(() => {
    if (!currentProfile || isAnimating) return;

    SoundEngine.init();
    SoundEngine.play('whoosh');
    RageEngine.addInteraction('pass', false);

    // Track speed passing
    const now = Date.now();
    const recentPasses = [...passTimestamps, now].filter((t) => now - t < 10000);
    setPassTimestamps(recentPasses);

    if (recentPasses.length >= 5) {
      const egg = EasterEggEngine.trigger('speed_passer');
      if (egg.discovered) {
        NotificationEngine.easterEgg('💨 SPEED DATER: Passed 5 profiles in 10 seconds!');
        SoundEngine.play('success');
      }
    }

    const newStreak = passStreak + 1;
    setPassStreak(newStreak);

    if (newStreak >= 5 && newStreak % 5 === 0) {
      NotificationEngine.info(ResponseEngine.getContextual('pass'));
    }

    setSwipeDirection('left');
    setIsAnimating(true);

    setTimeout(() => {
      advanceProfile();
      setPassStreak(newStreak);
    }, 400);
  }, [currentProfile, isAnimating, passStreak, passTimestamps, advanceProfile]);

  const handleFinalBossLike = useCallback(async () => {
    setIsAnimating(true);
    setFinalBossStage(1);
    SoundEngine.play('dramatic');

    // Loading countdown
    setLikeMessage('Processing...');
    await delay(1500);

    for (let i = 99; i >= 0; i -= (i > 50 ? 5 : 2)) {
      setLikeMessage(`${i}%`);
      await delay(80);
    }

    setLikeMessage('100%');
    await delay(500);

    setShowConfetti(true);
    SoundEngine.play('match');
    setFinalBossStage(2);
    setLikeMessage("IT'S A MATCH.");
    await delay(2500);

    setFinalBossStage(3);
    setLikeMessage('Wait.');
    await delay(1500);

    setFinalBossStage(4);
    setLikeMessage('You matched with...');
    await delay(2000);

    setFinalBossStage(5);
    setLikeMessage('YOURSELF.');
    SoundEngine.play('impact');
    await delay(2500);

    setFinalBossStage(6);
    setLikeMessage('Character development.');
    await delay(2000);

    setShowConfetti(false);
    setFinalBossStage(7);
  }, []);

  const handleProfileClick = useCallback(() => {
    if (!currentProfile) return;
    RageEngine.trackProfileView(currentProfile.id);
    RageEngine.addInteraction('profile_view', false);

    const viewCount = RageEngine.getProfileViewCount(currentProfile.id);
    if (viewCount >= 5) {
      EasterEggEngine.trigger('profile_stalker');
    }
    if (viewCount > 2) {
      NotificationEngine.info(ResponseEngine.getContextual('profile_view'));
    }

    onViewProfile(currentProfile);
  }, [currentProfile, onViewProfile]);

  const dismissMatch = useCallback(() => {
    setShowMatch(false);
    setShowConfetti(false);
    setMatchProfile(null);
    advanceProfile();
  }, [advanceProfile]);

  const goToChat = useCallback(() => {
    const matches = MatchEngine.getMatches();
    const lastMatch = matches[matches.length - 1];
    if (lastMatch) {
      setShowMatch(false);
      setShowConfetti(false);
      setMatchProfile(null);
      onMatch(lastMatch.id);
    }
  }, [onMatch]);

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Searching for profiles...</p>
          <p className="text-slate-600 text-sm mt-1">THE ALGORITHM™ is working.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <Confetti active={showConfetti} />

      {/* Profile Card */}
      <div className="flex-1 relative px-4 pt-2 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: swipeDirection === 'left' ? -400 : swipeDirection === 'right' ? 400 : 0,
              rotate: swipeDirection === 'left' ? -15 : swipeDirection === 'right' ? 15 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full rounded-3xl overflow-hidden relative cursor-pointer"
            onClick={handleProfileClick}
          >
            {/* Profile Image / Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentProfile.imageGradient}`}
            >
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-black/10 blur-3xl" />
              </div>

              {/* Large initial */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[12rem] font-display font-black text-white/15 select-none">
                  {ProfileEngine.getInitials(currentProfile.name)}
                </span>
              </div>
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Compatibility badge */}
            <motion.div
              className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={14} className="text-pink-400" />
              <span className="text-sm font-bold text-white">
                {currentProfile.compatibility}%
              </span>
            </motion.div>

            {/* Final Boss Badge */}
            {currentProfile.isFinalBoss && (
              <motion.div
                className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full px-3 py-1.5"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="text-sm font-bold text-white">
                  ⚡ PERFECT MATCH
                </span>
              </motion.div>
            )}

            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mb-3">
                <h2 className="text-3xl font-display font-bold text-white">
                  {currentProfile.name}
                  {currentProfile.age > 0 && (
                    <span className="text-2xl font-normal text-white/70 ml-2">
                      {currentProfile.age}
                    </span>
                  )}
                </h2>

                <div className="flex items-center gap-4 mt-2 text-white/60">
                  <span className="flex items-center gap-1 text-sm">
                    <MapPin size={14} />
                    {currentProfile.location}
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Briefcase size={14} />
                    {currentProfile.profession}
                  </span>
                </div>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-3">
                {currentProfile.bio}
              </p>

              {/* Interests */}
              <div className="flex flex-wrap gap-2 mb-2">
                {currentProfile.interests.slice(0, 4).map((interest, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm"
                  >
                    {interest}
                  </span>
                ))}
                {currentProfile.interests.length > 4 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/50">
                    +{currentProfile.interests.length - 4}
                  </span>
                )}
              </div>

              {expandedBio && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  {currentProfile.prompts.map((prompt, i) => (
                    <div key={i} className="mb-3">
                      <p className="text-xs text-white/40 mb-1">{prompt.question}</p>
                      <p className="text-sm text-white/80">{prompt.answer}</p>
                    </div>
                  ))}
                  <p className="text-xs text-white/30 italic mt-2">
                    {currentProfile.personalityDetail}
                  </p>
                </motion.div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedBio(!expandedBio);
                }}
                className="text-white/40 hover:text-white/60 transition-colors mt-1"
              >
                <ChevronDown
                  size={20}
                  className={`transform transition-transform ${expandedBio ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Like message overlay */}
        <AnimatePresence>
          {likeMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-4 bottom-28 z-10"
            >
              <div className="glass-card px-6 py-4 text-center">
                {showLikeLoading && (
                  <div className="flex justify-center mb-2">
                    <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <p className={`font-display font-semibold ${
                  finalBossStage >= 5
                    ? 'text-2xl gradient-text'
                    : likeMessage === '❤️ LIKED'
                    ? 'text-xl text-pink-400'
                    : 'text-base text-slate-300'
                }`}>
                  {likeMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {finalBossStage < 7 && (
        <div className="px-4 pb-6 flex items-center justify-center gap-6">
          {/* Pass Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePass}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all disabled:opacity-50 shadow-lg"
          >
            <X size={28} strokeWidth={2.5} />
          </motion.button>

          {/* Super Like (decorative) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              SoundEngine.play('bonk');
              NotificationEngine.info("Super Like requires MAYBE Premium™. Starting at $49.99/thought.");
            }}
            className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-all shadow-lg"
          >
            <Star size={20} />
          </motion.button>

          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            animate={
              likeMessage && !showLikeLoading && likeMessage !== '❤️ LIKED'
                ? { x: [0, -3, 3, -3, 3, 0] }
                : {}
            }
            onClick={handleLike}
            disabled={isAnimating && !currentProfile?.isFinalBoss}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all disabled:opacity-50"
          >
            <Heart size={28} fill="white" />
          </motion.button>
        </div>
      )}

      {/* Final Boss Continue Button */}
      {finalBossStage === 7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pb-6 text-center"
        >
          <button
            onClick={() => {
              NotificationEngine.info('Good choice.');
              setShowFinalBoss(false);
              setFinalBossStage(0);
              setIsAnimating(false);
              setLikeMessage(null);
              advanceProfile();
            }}
            className="btn-primary text-lg"
          >
            Continue Dating
          </button>
        </motion.div>
      )}

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-center px-8 max-w-sm"
            >
              {/* Match animation */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <motion.div
                  initial={{ x: -60 }}
                  animate={{ x: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${matchProfile.imageGradient} flex items-center justify-center text-3xl font-display font-bold text-white/40 border-4 border-white/20 shadow-2xl`}
                >
                  {ProfileEngine.getInitials(matchProfile.name)}
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                >
                  <Heart size={32} className="text-pink-500" fill="#ec4899" />
                </motion.div>
                <motion.div
                  initial={{ x: 60 }}
                  animate={{ x: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-3xl font-display font-bold text-white/40 border-4 border-white/20 shadow-2xl"
                >
                  ?
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-display font-black gradient-text mb-3"
              >
                IT'S A MATCH.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-slate-400 mb-8"
              >
                Now somebody has to say something.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="flex flex-col gap-3"
              >
                <button onClick={goToChat} className="btn-primary w-full">
                  MESSAGE THEM
                </button>
                <button
                  onClick={() => {
                    NotificationEngine.info('Understandable.');
                    dismissMatch();
                  }}
                  className="btn-secondary w-full"
                >
                  PANIC
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fakeout Match Modal */}
      <AnimatePresence>
        {showFakeout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-center px-8 max-w-sm"
            >
              <motion.h2
                className="text-4xl font-display font-black gradient-text mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: 2, duration: 0.3 }}
              >
                IT'S A MATCH! ❤️
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="text-xl text-slate-300 mb-2">Relax.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                <p className="text-slate-400 mb-2">We got excited.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
              >
                <p className="text-slate-500 text-sm mb-6">This was a demo event.</p>
                <button
                  onClick={() => {
                    setShowFakeout(false);
                    setShowConfetti(false);
                    SoundEngine.play('bonk');
                    advanceProfile();
                  }}
                  className="btn-secondary"
                >
                  I trusted you.
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Almost Match Modal */}
      <AnimatePresence>
        {showAlmost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-center px-8 max-w-sm"
            >
              <h2 className="text-5xl font-display font-black text-amber-400 mb-4">
                ALMOST
              </h2>

              <p className="text-slate-300 mb-2">
                You and {currentProfile?.name} were{' '}
                <span className="text-pink-400 font-bold">
                  {currentProfile?.compatibility}% compatible
                </span>
                .
              </p>

              <p className="text-slate-400 mb-6">{almostReason}</p>

              <p className="text-slate-500 text-sm italic mb-6">
                We made an executive decision.
              </p>

              <button
                onClick={() => {
                  setShowAlmost(false);
                  SoundEngine.play('slide');
                  advanceProfile();
                }}
                className="btn-secondary"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
