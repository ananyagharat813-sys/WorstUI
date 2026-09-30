import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Brain, Wand2, BarChart3, Zap } from 'lucide-react';
import { AlgorithmEngine } from '../engines';

interface AlgorithmPageProps {
  onBack: () => void;
}

export default function AlgorithmPage({ onBack }: AlgorithmPageProps) {
  const content = AlgorithmEngine.getAlgorithmPageContent();

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h3 className="font-display font-semibold text-white">THE ALGORITHM™</h3>
      </div>

      <div className="px-6 pt-8 pb-24">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-2xl shadow-purple-500/30"
          >
            <Brain size={36} className="text-white" />
          </motion.div>

          <h1 className="text-4xl font-display font-black gradient-text mb-3">
            {content.title}
          </h1>
          <p className="text-lg text-slate-400 font-display italic">
            {content.subtitle}
          </p>
        </div>

        {/* Description */}
        <div className="glass-card p-6 mb-8">
          <p className="text-slate-300 leading-relaxed text-center">
            {content.description}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          {content.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-5"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className="font-display font-semibold text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="glass-card p-6 mb-8">
          <h4 className="text-sm font-semibold text-white mb-4 text-center">
            Algorithm Performance Metrics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Profiles Analyzed', value: '847K', icon: <BarChart3 size={14} /> },
              { label: 'Matches Made', value: '12', icon: <Sparkles size={14} /> },
              { label: 'Success Rate', value: '73%*', icon: <Zap size={14} /> },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center text-pink-400 mb-1">{stat.icon}</div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-700 text-center mt-3">
            *We define "success" loosely.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-xs text-slate-600 italic">
            THE ALGORITHM™ is a fictional construct. Any resemblance to actual algorithms, living or dead, is purely coincidental and frankly concerning.
          </p>
        </div>
      </div>
    </div>
  );
}
