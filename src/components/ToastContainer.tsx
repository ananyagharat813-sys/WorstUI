import { useState, useEffect } from 'react';
import { NotificationEngine, Toast } from '../engines';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info, CheckCircle, AlertTriangle, Flame, Egg, Trophy, Heart,
} from 'lucide-react';

const iconMap: Record<Toast['type'], React.ReactNode> = {
  info: <Info size={18} />,
  success: <CheckCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  rage: <Flame size={18} />,
  easter_egg: <Egg size={18} />,
  achievement: <Trophy size={18} />,
  match: <Heart size={18} />,
};

const colorMap: Record<Toast['type'], string> = {
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  rage: 'border-red-500/30 bg-red-500/10 text-red-200',
  easter_egg: 'border-purple-500/30 bg-purple-500/10 text-purple-200',
  achievement: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200',
  match: 'border-pink-500/30 bg-pink-500/10 text-pink-200',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsub = NotificationEngine.subscribe(setToasts);
    return unsub;
  }, []);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`pointer-events-auto rounded-xl border backdrop-blur-xl px-4 py-3 flex items-center gap-3 shadow-2xl cursor-pointer ${colorMap[toast.type]}`}
            onClick={() => NotificationEngine.dismiss(toast.id)}
          >
            <span className="flex-shrink-0 opacity-80">{iconMap[toast.type]}</span>
            <p className="text-sm font-medium leading-snug">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
