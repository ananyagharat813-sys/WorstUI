import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, ArrowLeft, Smile,
} from 'lucide-react';
import {
  MatchEngine, Match, ChatMessage, AttemptEngine,
  ResponseEngine, SoundEngine, RageEngine, NotificationEngine,
  ProfileEngine,
} from '../engines';

interface ChatViewProps {
  matchId: string;
  onBack: () => void;
}

export default function ChatView({ matchId, onBack }: ChatViewProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [message, setMessage] = useState('');
  const [sendAttempts, setSendAttempts] = useState(0);
  const [sendButtonText, setSendButtonText] = useState('SEND');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [shaking, setShaking] = useState(false);
  const [showOpenerComment, setShowOpenerComment] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = MatchEngine.getMatch(matchId);
    if (m) setMatch(m);
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [match?.messages.length]);

  const handleSendMessage = async () => {
    if (!message.trim() || !match) return;

    SoundEngine.init();
    RageEngine.addInteraction('message', false);

    const attemptKey = `send-msg-${matchId}-${message.substring(0, 10)}`;
    const isFreebie = AttemptEngine.shouldBeFreebie('send_message');

    if (isFreebie && sendAttempts === 0) {
      actuallySend();
      return;
    }

    const newAttempts = sendAttempts + 1;
    setSendAttempts(newAttempts);

    if (newAttempts === 1) {
      // First click - shake
      setShaking(true);
      SoundEngine.play('click');
      NotificationEngine.info('You sure?');
      setTimeout(() => setShaking(false), 500);
      return;
    }

    if (newAttempts === 2) {
      // Second click - change button text
      setSendButtonText('REALLY SEND');
      SoundEngine.play('bonk');
      RageEngine.addInteraction('message', true);
      return;
    }

    // Third+ click - actually send
    NotificationEngine.info('Okay.');
    actuallySend();
  };

  const actuallySend = async () => {
    if (!message.trim() || !match) return;

    const text = message;
    setMessage('');
    setSendAttempts(0);
    setSendButtonText('SEND');
    setShowSuggestions(false);

    // Add user message
    MatchEngine.addMessage(matchId, text, 'user');
    SoundEngine.play('ding');

    // Update match
    const updated = MatchEngine.getMatch(matchId);
    if (updated) setMatch({ ...updated });

    // Simulate typing & auto-reply
    await delay(1500 + Math.random() * 2000);

    const reply = MatchEngine.getAutoReply();
    MatchEngine.addMessage(matchId, reply, 'match');
    SoundEngine.play('pop');

    const final = MatchEngine.getMatch(matchId);
    if (final) setMatch({ ...final });
  };

  const handleSuggestion = (text: string) => {
    setMessage(text);
    setShowOpenerComment('Bold.');
    SoundEngine.play('click');
    setTimeout(() => {
      setShowOpenerComment(null);
    }, 1500);
  };

  if (!match) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Match not found. The algorithm works in mysterious ways.</p>
      </div>
    );
  }

  const suggestions = MatchEngine.getSuggestedOpeners();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass px-4 py-3 flex items-center gap-3 border-b border-slate-800/50">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${match.profile.imageGradient} flex items-center justify-center text-sm font-bold text-white/40`}
        >
          {ProfileEngine.getInitials(match.profile.name)}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-white text-sm">
            {match.profile.name}
          </h3>
          <p className="text-xs text-slate-500">
            Matched {new Date(match.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {match.messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm mb-2">No messages yet.</p>
            <p className="text-slate-600 text-xs italic">
              Somebody has to go first. It's probably you.
            </p>
          </div>
        )}

        {match.messages.map((msg: ChatMessage) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-md'
                  : 'bg-slate-800 text-slate-200 rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested openers */}
      <AnimatePresence>
        {showSuggestions && match.messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pb-2"
          >
            <p className="text-xs text-slate-500 mb-2">Suggested openers:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/50"
                >
                  {s}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {showOpenerComment && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-pink-400 mt-1 italic"
                >
                  {showOpenerComment}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className={`flex items-center gap-2 glass rounded-2xl px-4 py-2 ${
          shaking ? 'animate-shake' : ''
        }`}>
          <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <Smile size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="flex items-center gap-1.5 text-sm font-semibold text-pink-400 hover:text-pink-300 disabled:text-slate-600 transition-colors"
          >
            <span>{sendButtonText}</span>
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
