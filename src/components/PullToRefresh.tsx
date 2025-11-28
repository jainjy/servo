import React, { useRef, useState, useEffect, ReactNode } from 'react';
import './PullToRefresh.css';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const maxPullDistance = 80;

  const handleTouchStart = (e: TouchEvent) => {
    if (isRefreshing) return;
    
    const scrollElement = containerRef.current?.scrollTop || 0;
    
    // Only start pull-to-refresh if we're at the top of the page
    if (scrollElement === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isRefreshing || startYRef.current === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startYRef.current;

    if (distance > 0) {
      // Reduce resistance as you pull
      const resistance = 0.55;
      const pullDist = Math.min(distance * resistance, maxPullDistance);
      setPullDistance(pullDist);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 50) {
      // Threshold to trigger refresh
      setIsRefreshing(true);
      setPullDistance(0);
      startYRef.current = 0;

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      // Reset if pull wasn't enough
      setPullDistance(0);
      startYRef.current = 0;
    }
  };

  useEffect(() => {
    const element = document.documentElement;
    element.addEventListener('touchstart', handleTouchStart as EventListener);
    element.addEventListener('touchmove', handleTouchMove as EventListener, {
      passive: true,
    });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart as EventListener);
      element.removeEventListener('touchmove', handleTouchMove as EventListener);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRefreshing, pullDistance]);

  return (
    <div ref={containerRef} className="pull-to-refresh-container">
      <div 
        className="pull-to-refresh-indicator"
        style={{
          transform: `translateY(${pullDistance}px)`,
          opacity: pullDistance / maxPullDistance,
        }}
      >
        <div className="spinner">
          <div className="spinner-circle"></div>
        </div>
      </div>
      
      <div 
        className="pull-to-refresh-content"
        style={{
          transform: `translateY(${isRefreshing ? maxPullDistance : pullDistance}px)`,
        }}
      >
        {children}
      </div>

      {isRefreshing && (
        <div className="pull-to-refresh-loader">
          <div className="loader-spinner"></div>
          <p>Actualisation...</p>
        </div>
      )}
    </div>
  );
};

export default PullToRefresh;
