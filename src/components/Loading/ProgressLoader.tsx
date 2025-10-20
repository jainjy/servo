// components/Loading/ProgressLoader.tsx


import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressLoaderProps {
  duration?: number;
  onComplete?: () => void;
  message?: string;
}

export function ProgressLoader({ 
  duration = 3000, 
  onComplete,
  message = "Chargement en cours..." 
}: ProgressLoaderProps) {
  const progress = useMotionValue(0);
  const [isComplete, setIsComplete] = useState(false);
  const width = useTransform(progress, [0, 100], ['0%', '100%']);

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: duration / 1000,
      ease: "easeInOut",
      onComplete: () => {
        setIsComplete(true);
        onComplete?.();
      }
    });

    return controls.stop;
  }, [progress, duration, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
          style={{ width }}
        >
          {/* Effet de brillance */}
          <motion.div
            className="absolute inset-0 bg-white opacity-30"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Pourcentage et message */}
      <div className="flex justify-between items-center">
        <motion.span
          className="text-sm font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message}
        </motion.span>
        
        <motion.span
          className="text-sm font-bold text-gray-900"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {isComplete ? '100%' : `${Math.round(progress.get())}%`}
        </motion.span>
      </div>

      {/* Points animés */}
      <div className="flex justify-center space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}