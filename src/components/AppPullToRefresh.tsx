import React, { ReactNode, useRef, useState, useEffect } from 'react';
import './AppPullToRefresh.css';

interface AppPullToRefreshProps {
  children: ReactNode;
}

const AppPullToRefresh: React.FC<AppPullToRefreshProps> = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const maxPullDistance = 100;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isRefreshing) return;
    
    const scrollElement = containerRef.current;
    const isAtTop = !scrollElement || scrollElement.scrollTop === 0;
    
    if (isAtTop) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isRefreshing || startYRef.current === 0) return;

    const scrollElement = containerRef.current;
    const isAtTop = !scrollElement || scrollElement.scrollTop === 0;
    
    if (!isAtTop) {
      startYRef.current = 0;
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = currentY - startYRef.current;

    if (distance > 0) {
      // Reduce resistance as you pull
      const resistance = 0.6;
      const pullDist = Math.min(distance * resistance, maxPullDistance);
      setPullDistance(pullDist);
      
      // Prevent default scroll
      if (pullDist > 0) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      // Threshold to trigger refresh
      setIsRefreshing(true);
      setPullDistance(maxPullDistance);
      startYRef.current = 0;

      try {
        // Simulate refresh
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            window.location.reload();
            resolve();
          }, 1500);
        });
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Reset if pull wasn't enough
      setPullDistance(0);
      startYRef.current = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      className="app-pull-to-refresh"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Pull indicator */}
      {pullDistance > 0 && !isRefreshing && (
        <div
          className="pull-indicator"
          style={{
            transform: `translateY(${pullDistance}px)`,
            opacity: Math.min(pullDistance / maxPullDistance, 1),
          }}
        >
          <div className="pull-icon">
            {pullDistance > 60 ? '↻' : '↓'}
          </div>
        </div>
      )}

      {/* Refreshing state */}
      {isRefreshing && (
        <div className="refresh-header">
          <div className="refresh-spinner"></div>
          <span>Actualisation en cours...</span>
        </div>
      )}

      <div className="pull-to-refresh-wrapper">
        {children}
      </div>
    </div>
  );
};

export default AppPullToRefresh;
