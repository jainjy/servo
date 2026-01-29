import { useState, useEffect, useCallback } from 'react';
import { useAdvertisement } from '@/components/AdvertisementProvider';

interface AdvertisementManagerOptions {
  position: string;
  maxAdsPerSession?: number;
  cooldownMinutes?: number;
  enableRotation?: boolean;
}

export const useAdvertisementManager = (options: AdvertisementManagerOptions) => {
  const { position, maxAdsPerSession = 5, cooldownMinutes = 30, enableRotation = true } = options;
  
  const { getNextAdForPosition, markAsShown, getAdsForPosition } = useAdvertisement();
  const [currentAd, setCurrentAd] = useState(getNextAdForPosition(position));
  const [isVisible, setIsVisible] = useState(false);
  const [sessionAdCount, setSessionAdCount] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState<NodeJS.Timeout | null>(null);

  const ads = getAdsForPosition(position);

  // Vérifier les limites de session
  useEffect(() => {
    if (sessionAdCount >= maxAdsPerSession) {
      startCooldown();
    }
  }, [sessionAdCount, maxAdsPerSession]);

  // Démarrer le cooldown
  const startCooldown = useCallback(() => {
    setIsInCooldown(true);
    setIsVisible(false);
    
    const timer = setTimeout(() => {
      setIsInCooldown(false);
      setSessionAdCount(0);
      setCurrentAd(getNextAdForPosition(position));
    }, cooldownMinutes * 60 * 1000);
    
    setCooldownTimer(timer);
  }, [cooldownMinutes, getNextAdForPosition, position]);

  // Afficher une pub
  const showAd = useCallback((adId?: string) => {
    if (isInCooldown) return;
    
    let adToShow = currentAd;
    
    if (adId) {
      const specificAd = ads.find(ad => ad.id === adId);
      if (specificAd) {
        adToShow = specificAd;
      }
    }
    
    if (adToShow) {
      setCurrentAd(adToShow);
      setIsVisible(true);
      markAsShown(adToShow.id);
      setSessionAdCount(prev => prev + 1);
    }
  }, [currentAd, ads, markAsShown, isInCooldown]);

  // Fermer la pub courante
  const closeAd = useCallback(() => {
    setIsVisible(false);
    
    if (enableRotation && sessionAdCount < maxAdsPerSession) {
      // Trouver la prochaine pub
      const nextAd = getNextAdForPosition(position);
      if (nextAd && nextAd.id !== currentAd?.id) {
        setTimeout(() => {
          setCurrentAd(nextAd);
          showAd(nextAd.id);
        }, 5000); // 5 secondes entre les pubs
      }
    }
  }, [enableRotation, sessionAdCount, maxAdsPerSession, getNextAdForPosition, position, currentAd, showAd]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  }, [cooldownTimer]);

  return {
    currentAd,
    isVisible,
    showAd,
    closeAd,
    sessionAdCount,
    maxAdsPerSession,
    isInCooldown,
    cooldownMinutes,
    adsCount: ads.length,
    canShowMore: sessionAdCount < maxAdsPerSession && !isInCooldown
  };
};