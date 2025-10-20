// components/Loading/LoadingSpinner.tsx


import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gradient';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'gradient',
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gradient: 'border-gradient-to-r from-purple-500 to-pink-500'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner animé */}
      <motion.div
        className={`
          ${sizeClasses[size]} 
          rounded-full border-4
          ${color === 'gradient' 
            ? 'border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500' 
            : colorClasses[color]
          }
        `}
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={
          color === 'gradient' ? {
            background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #3b82f6, #8b5cf6)',
            mask: 'radial-gradient(transparent 55%, black 56%)'
          } : {}
        }
      />

      {/* Texte de chargement */}
      {text && (
        <motion.div
          className="flex items-center space-x-1 text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>{text}</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {dots}
          </motion.span>
        </motion.div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {spinner}
        </motion.div>
      </div>
    );
  }

  return spinner;
}