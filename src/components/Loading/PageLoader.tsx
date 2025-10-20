// components/Loading/PageLoader.tsx


import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProgressLoader } from './ProgressLoader';
import ParticleLoader from './ParticleLoader';
import LoadingSpinner from './LoadingSpinner';
import LogoLoader from './LogoLoader';

interface PageLoaderProps {
  isLoading: boolean;
  type?: 'spinner' | 'particles' | 'progress' | 'logo';
  children: React.ReactNode;
}

export default function PageLoader({ 
  isLoading, 
  type = 'spinner',
  children 
}: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowLoader(false), 500);
      return () => clearTimeout(timer);
    }
    setShowLoader(true);
  }, [isLoading]);

  const renderLoader = () => {
    switch (type) {
      case 'particles':
        return <ParticleLoader />;
      case 'progress':
        return (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <ProgressLoader />
          </div>
        );
      case 'logo':
        return <LogoLoader />;
      default:
        return <LoadingSpinner fullScreen text="Chargement de SERVO..." />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50"
          >
            {renderLoader()}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
