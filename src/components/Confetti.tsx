import { useCallback } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
}

const colors = [
  '#ec4899', '#f472b6', '#fb923c', '#a78bfa',
  '#34d399', '#60a5fa', '#fbbf24', '#f87171',
];

export default function Confetti({ active }: ConfettiProps) {
  const pieces = useCallback(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
      duration: 1 + Math.random() * 1.5,
    }));
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {pieces().map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: '-5vh',
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation,
            opacity: [1, 1, 0],
            scale: [1, 1, 0.5],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
