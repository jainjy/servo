import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetUrl?: string;
  position: string; // CHANGÉ: string au lieu de string[] (car l'API renvoie une seule position)
  priority: number;
  displayCount?: number;
  maxDisplayCount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  // Ajout de champs potentiels depuis l'API
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdvertisementContextType {
  advertisements: Map<string, Advertisement[]>; // position → ads[]
  shownAdIds: Set<string>;
  registerAd: (ad: Advertisement) => void;
  unregisterAd: (adId: string) => void;
  markAsShown: (adId: string) => void;
  markAsClicked: (adId: string) => void;
  getAdsForPosition: (position: string) => Advertisement[];
  getNextAdForPosition: (position: string) => Advertisement | null;
  resetShownAds: (position?: string) => void;
  isAdShown: (adId: string) => boolean;
  refreshAds: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AdvertisementContext = createContext<AdvertisementContextType | undefined>(undefined);

interface AdvertisementProviderProps {
  children: ReactNode;
  refreshInterval?: number; // en minutes
  apiBaseUrl?: string;
}

export const AdvertisementProvider: React.FC<AdvertisementProviderProps> = ({
  children,
  refreshInterval = 5,
  apiBaseUrl = '/api'
}) => {
  const [advertisements, setAdvertisements] = useState<Map<string, Advertisement[]>>(new Map());
  const [shownAdIds, setShownAdIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les IDs déjà affichés depuis le localStorage
  useEffect(() => {
    const savedShownIds = localStorage.getItem('ad_shown_ids');
    if (savedShownIds) {
      try {
        const ids = JSON.parse(savedShownIds);
        setShownAdIds(new Set(ids));
      } catch (error) {
        console.error('Erreur lors du chargement des IDs des pubs:', error);
      }
    }
  }, []);

  // Sauvegarder les IDs affichés dans le localStorage
  useEffect(() => {
    if (shownAdIds.size > 0) {
      localStorage.setItem('ad_shown_ids', JSON.stringify(Array.from(shownAdIds)));
    }
  }, [shownAdIds]);

  // Fonction pour normaliser les données de l'API
  const normalizeAdvertisement = (ad: any): Advertisement => {
    return {
      id: ad.id || '',
      title: ad.title || '',
      description: ad.description || '',
      content: ad.content || ad.description || '', // Utiliser description comme fallback pour content
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      position: ad.position || 'general', // CHANGÉ: string directe
      priority: ad.priority || 5,
      displayCount: ad.displayCount || 0,
      maxDisplayCount: ad.maxDisplayCount,
      startDate: ad.startDate,
      endDate: ad.endDate,
      isActive: ad.isActive !== undefined ? ad.isActive : true,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt
    };
  };

  // Fonction pour récupérer les pubs depuis l'API
  const fetchAllAdvertisements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}/advertisements/active`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.advertisements && Array.isArray(data.advertisements)) {
        // Organiser les pubs par position
        const adsByPosition = new Map<string, Advertisement[]>();
        
        data.advertisements.forEach((ad: any) => {
          try {
            const normalizedAd = normalizeAdvertisement(ad);
            
            // Vérifier si la pub est active et dans sa période de validité
            if (!normalizedAd.isActive) return;
            
            const now = new Date();
            if (normalizedAd.startDate && new Date(normalizedAd.startDate) > now) return;
            if (normalizedAd.endDate && new Date(normalizedAd.endDate) < now) return;
            if (normalizedAd.maxDisplayCount && 
                (normalizedAd.displayCount || 0) >= normalizedAd.maxDisplayCount) return;
            
            // Utiliser la position comme clé (string unique)
            const position = normalizedAd.position;
            
            if (!adsByPosition.has(position)) {
              adsByPosition.set(position, []);
            }
            
            const positionAds = adsByPosition.get(position)!;
            
            // Vérifier si la pub n'est pas déjà dans la liste
            if (!positionAds.some(existingAd => existingAd.id === normalizedAd.id)) {
              positionAds.push(normalizedAd);
            }
          } catch (adError) {
            console.error('Erreur lors du traitement d\'une publicité:', adError, ad);
          }
        });
        
        // Trier les pubs par priorité pour chaque position
        adsByPosition.forEach((ads, position) => {
          ads.sort((a, b) => {
            // Priorité d'abord (plus petit = plus haute priorité)
            if (a.priority !== b.priority) {
              return a.priority - b.priority;
            }
            // Ensuite par date de création (plus récent d'abord)
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
          });
        });
        
        setAdvertisements(adsByPosition);
        console.log(`Publicités chargées: ${data.advertisements.length} pubs pour ${adsByPosition.size} positions`);
      } else {
        console.warn('Format de réponse API inattendu:', data);
        setError('Format de données invalide');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des publicités:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  // Chargement initial
  useEffect(() => {
    fetchAllAdvertisements();
  }, [fetchAllAdvertisements]);

  // Refresh périodique
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllAdvertisements();
    }, refreshInterval * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchAllAdvertisements, refreshInterval]);

  // Enregistrer une pub manuellement (pour pubs statiques/fallback)
  const registerAd = useCallback((ad: Advertisement) => {
    setAdvertisements(prev => {
      const newMap = new Map(prev);
      const position = ad.position;
      
      if (!newMap.has(position)) {
        newMap.set(position, []);
      }
      
      const positionAds = newMap.get(position)!;
      
      // Vérifier si la pub n'existe pas déjà
      if (!positionAds.some(existingAd => existingAd.id === ad.id)) {
        const updatedAds = [...positionAds, ad];
        updatedAds.sort((a, b) => a.priority - b.priority);
        newMap.set(position, updatedAds);
      }
      
      return newMap;
    });
  }, []);

  // Supprimer une pub
  const unregisterAd = useCallback((adId: string) => {
    setAdvertisements(prev => {
      const newMap = new Map();
      
      prev.forEach((ads, position) => {
        const filteredAds = ads.filter(ad => ad.id !== adId);
        if (filteredAds.length > 0) {
          newMap.set(position, filteredAds);
        }
      });
      
      return newMap;
    });
  }, []);

  // Marquer une pub comme affichée
  const markAsShown = useCallback((adId: string) => {
    setShownAdIds(prev => {
      const newSet = new Set(prev);
      newSet.add(adId);
      
      // Mettre à jour le compteur d'affichage dans l'API
      fetch(`${apiBaseUrl}/advertisements/${adId}/impression`, {
        method: 'POST'
      }).catch(error => 
        console.error('Erreur lors du tracking d\'impression:', error)
      );
      
      return newSet;
    });
  }, [apiBaseUrl]);

  // Marquer un clic sur une pub
  const markAsClicked = useCallback((adId: string) => {
    fetch(`${apiBaseUrl}/advertisements/${adId}/click`, {
      method: 'POST'
    }).catch(error => 
      console.error('Erreur lors du tracking de clic:', error)
    );
  }, [apiBaseUrl]);

  // Obtenir les pubs pour une position donnée
  const getAdsForPosition = useCallback((position: string): Advertisement[] => {
    return advertisements.get(position) || [];
  }, [advertisements]);

  // Obtenir la prochaine pub à afficher pour une position
  const getNextAdForPosition = useCallback((position: string): Advertisement | null => {
    const positionAds = advertisements.get(position);
    if (!positionAds || positionAds.length === 0) {
      return null;
    }

    // Filtrer les pubs non encore affichées
    const unshownAds = positionAds.filter(ad => !shownAdIds.has(ad.id));
    
    if (unshownAds.length > 0) {
      // Prendre celle avec la priorité la plus haute
      return unshownAds[0];
    }
    
    // Toutes les pubs ont été affichées, on peut choisir de recommencer
    // Option 1: Retourner null (ne rien afficher)
    // return null;
    
    // Option 2: Réinitialiser et reprendre la première
    // Cette logique pourrait être déplacée dans le composant d'affichage
    return positionAds[0];
  }, [advertisements, shownAdIds]);

  // Réinitialiser les pubs affichées
  const resetShownAds = useCallback((position?: string) => {
    if (position) {
      // Réinitialiser seulement les pubs de cette position
      const positionAds = advertisements.get(position) || [];
      setShownAdIds(prev => {
        const newSet = new Set(prev);
        positionAds.forEach(ad => newSet.delete(ad.id));
        return newSet;
      });
    } else {
      // Réinitialiser toutes les pubs
      setShownAdIds(new Set());
      localStorage.removeItem('ad_shown_ids');
    }
  }, [advertisements]);

  // Vérifier si une pub a déjà été affichée
  const isAdShown = useCallback((adId: string): boolean => {
    return shownAdIds.has(adId);
  }, [shownAdIds]);

  const contextValue: AdvertisementContextType = {
    advertisements,
    shownAdIds,
    registerAd,
    unregisterAd,
    markAsShown,
    markAsClicked,
    getAdsForPosition,
    getNextAdForPosition,
    resetShownAds,
    isAdShown,
    refreshAds: fetchAllAdvertisements,
    isLoading,
    error
  };

  return (
    <AdvertisementContext.Provider value={contextValue}>
      {children}
    </AdvertisementContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAdvertisement = (): AdvertisementContextType => {
  const context = useContext(AdvertisementContext);
  if (context === undefined) {
    throw new Error('useAdvertisement must be used within an AdvertisementProvider');
  }
  return context;
};

// Hook spécifique pour une position
export const useAdvertisementForPosition = (position: string) => {
  const { 
    getAdsForPosition, 
    getNextAdForPosition, 
    markAsShown, 
    markAsClicked,
    isAdShown,
    resetShownAds 
  } = useAdvertisement();
  
  const ads = getAdsForPosition(position);
  const nextAd = getNextAdForPosition(position);
  
  const markPositionAdAsShown = useCallback((adId: string) => {
    markAsShown(adId);
  }, [markAsShown]);
  
  const markPositionAdAsClicked = useCallback((adId: string) => {
    markAsClicked(adId);
  }, [markAsClicked]);
  
  const resetPositionShownAds = useCallback(() => {
    resetShownAds(position);
  }, [resetShownAds, position]);
  
  return {
    ads,
    nextAd,
    markAsShown: markPositionAdAsShown,
    markAsClicked: markPositionAdAsClicked,
    isAdShown: (adId: string) => isAdShown(adId),
    resetShownAds: resetPositionShownAds,
    hasAds: ads.length > 0,
    adsCount: ads.length
  };
};