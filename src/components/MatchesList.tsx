import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart } from 'lucide-react';
import { MatchEngine, Match, ProfileEngine } from '../engines';

interface MatchesListProps {
  onOpenChat: (matchId: string) => void;
}

export default function MatchesList({ onOpenChat }: MatchesListProps) {
  const [matches] = useState<Match[]>(MatchEngine.getMatches());

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
          <Heart size={32} className="text-slate-600" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">No matches yet.</h3>
        <p className="text-slate-500 text-sm mb-2">Keep swiping. Or don't. We're not your therapist.</p>
        <p className="text-slate-600 text-xs italic">
          (Although at this rate, you might need one.)
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pt-6 pb-3">
        <h2 className="text-2xl font-display font-bold text-white">Matches</h2>
        <p className="text-sm text-slate-500 mt-1">
          {matches.length} {matches.length === 1 ? 'person' : 'people'} tolerate you so far.
        </p>
      </div>

      <div className="px-4 space-y-3 pb-6">
        <AnimatePresence>
          {matches.map((match, i) => (
            <motion.button
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onOpenChat(match.id)}
              className="w-full glass-card p-4 flex items-center gap-4 hover:bg-slate-800/40 transition-colors text-left"
            >
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${match.profile.imageGradient} flex items-center justify-center text-lg font-display font-bold text-white/40 flex-shrink-0`}
              >
                {ProfileEngine.getInitials(match.profile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-white text-sm">
                  {match.profile.name}, {match.profile.age}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {match.messages.length > 0
                    ? match.messages[match.messages.length - 1].text
                    : 'No messages yet. Awkward.'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <MessageCircle size={16} />
                {match.messages.length > 0 && (
                  <span className="text-xs">{match.messages.length}</span>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
