// components/Loading/ContentSkeleton.tsx

import { motion } from 'framer-motion';

interface SkeletonProps {
  type?: 'card' | 'list' | 'text' | 'image';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ type = 'card', count = 1, className = '' }: SkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const SkeletonCard = () => (
    <motion.div
      className="bg-gray-200 rounded-lg p-4 space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: Math.random() * 0.5 }}
    >
      <div className="flex space-x-3">
        <div className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
          <div className="h-3 bg-gray-300 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );

  const SkeletonList = () => (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {skeletons.map((i) => (
        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-100 rounded">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
            <div className="h-3 bg-gray-300 rounded w-24 animate-pulse" />
          </div>
        </div>
      ))}
    </motion.div>
  );

  const SkeletonText = () => (
    <div className="space-y-2">
      {skeletons.map((i) => (
        <motion.div
          key={i}
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
        </motion.div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return skeletons.map((i) => <SkeletonCard key={i} />);
      case 'list':
        return <SkeletonList />;
      case 'text':
        return <SkeletonText />;
      default:
        return skeletons.map((i) => <SkeletonCard key={i} />);
    }
  };

  return <div className={`animate-pulse ${className}`}>{renderSkeleton()}</div>;
}