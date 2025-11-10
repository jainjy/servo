import React, { useState, useEffect } from 'react';
import { getUserRecommendations, trackUserActivity } from '@/lib/suggestionApi';
import { Recommendation } from '@/types/suggestionTypes';
import { useTracking } from '@/hooks/UserTracking';

const RecommendationsSection: React.FC<{ 
  title?: string; 
  limit?: number;
  showOnlyIfAuthenticated?: boolean;
}> = ({ 
  title = "🔍 Suggestions pour vous", 
  limit = 4, // Changé de 8 à 4 par défaut
  showOnlyIfAuthenticated = true
}) => {
  const { trackProductInteraction } = useTracking();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated || !showOnlyIfAuthenticated) {
      loadRecommendations();
    }
  }, [limit, isAuthenticated, showOnlyIfAuthenticated]);

  const checkAuthentication = () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem("token") || 
                  localStorage.getItem("auth-token");
    setIsAuthenticated(!!token);
  };

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si non authentifié et on veut seulement montrer aux utilisateurs connectés
      if (showOnlyIfAuthenticated && !isAuthenticated) {
        setLoading(false);
        return;
      }

      // Récupérer plus de recommandations pour pouvoir filtrer
      const allRecs = await getUserRecommendations(12); // Récupérer plus d'éléments
      
      // Trier et limiter à 4 recommandations
      const filteredRecs = filterAndSortRecommendations(allRecs).slice(0, limit);
      
      setRecommendations(filteredRecs);
    } catch (err) {
      console.error('Erreur chargement recommandations:', err);
      
      if (err.message?.includes("Token") || err.message?.includes("401")) {
        setError("Veuillez vous connecter pour voir vos recommandations personnalisées");
        setIsAuthenticated(false);
      } else {
        setError('Erreur lors du chargement des suggestions');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour filtrer et trier les recommandations
  const filterAndSortRecommendations = (recs: Recommendation[]): Recommendation[] => {
    return recs
      .sort((a, b) => {
        // Priorité 1: Score de personnalisation (si disponible)
        if (a.personalizationScore !== undefined && b.personalizationScore !== undefined) {
          return b.personalizationScore - a.personalizationScore;
        }
        
        // Priorité 2: Popularité (score de popularité)
        if (a.popularityScore !== undefined && b.popularityScore !== undefined) {
          return b.popularityScore - a.popularityScore;
        }
        
        // Priorité 3: Nombre de vues/clics
        if (a.viewCount !== undefined && b.viewCount !== undefined) {
          return b.viewCount - a.viewCount;
        }
        
        // Priorité 4: Produits avec prix (trier par prix décroissant)
        if (a.price !== undefined && b.price !== undefined) {
          return b.price - a.price;
        }
        
        // Par défaut: ordre aléatoire mais consistant
        return a.name.localeCompare(b.name);
      })
      .slice(0, limit); // Garder seulement le nombre demandé
  };

  const handleRecommendationClick = async (recommendation: Recommendation) => {
    try {
      if (isAuthenticated) {
        await trackProductInteraction(
          recommendation.id, 
          "click", 
          recommendation.name, 
          recommendation.category
        );
      }
      
      // Navigation vers le détail du produit
      window.location.href = `/products/${recommendation.id}`;
    } catch (error) {
      console.error('Erreur tracking click:', error);
      window.location.href = `/products/${recommendation.id}`;
    }
  };

  // Fonction pour générer les initiales à partir du nom
  const getInitials = (name: string): string => {
    if (!name) return "?";
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Fonction pour générer une couleur basée sur le nom
  const getColorFromName = (name: string): string => {
    const colors = [
      'from-blue-100 to-blue-200 text-blue-600',
      'from-purple-100 to-purple-200 text-purple-600',
      'from-green-100 to-green-200 text-green-600',
      'from-red-100 to-red-200 text-red-600',
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Ne rien afficher si non authentifié et showOnlyIfAuthenticated=true
  if (showOnlyIfAuthenticated && !isAuthenticated && !loading) {
    return null;
  }

  // Squelette de chargement
  if (loading) {
    return (
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => ( // Changé pour 4 éléments
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-yellow-800 mb-4">{error}</p>
            {error.includes("connecter") && (
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return (
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Découvrez nos suggestions</h3>
            <p className="text-blue-700 mb-4">
              {isAuthenticated 
                ? "Interagissez avec notre site pour recevoir des recommandations personnalisées" 
                : "Connectez-vous pour voir vos recommandations personnalisées"
              }
            </p>
            {!isAuthenticated && (
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos 4 meilleures sélections basées sur vos préférences
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendations.map((rec, index) => {
            const hasImage = rec.images && rec.images.length > 0;
            const initials = getInitials(rec.name);
            const colorClass = getColorFromName(rec.name);
            
            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => handleRecommendationClick(rec)}
              >
                {/* Badge "Populaire" ou "Recommandé" pour les premiers éléments */}
                {index < 2 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      index === 0 
                        ? '' 
                        : ''
                    }`}>
                      {index === 0 ? '' : ''}
                    </span>
                  </div>
                )}
                
                <div className="relative overflow-hidden rounded-t-2xl">
                  {hasImage ? (
                    <img
                      src={rec.images[0]}
                      alt={rec.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.image-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback pour les images manquantes */}
                  <div 
                    className={`image-fallback w-full h-48 bg-gradient-to-br ${colorClass} flex items-center justify-center ${hasImage ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-4xl font-bold">{initials}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {rec.name}
                    </h3>
                  </div>

                  {rec.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                      {rec.category}
                    </span>
                  )}

                  {rec.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {rec.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {rec.price ? (
                      <span className="text-2xl font-bold text-green-600">
                        €{rec.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Prix sur demande</span>
                    )}
                    
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors group-hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecommendationClick(rec);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={loadRecommendations}
            className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg transition-all duration-300 font-semibold inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Voir plus de suggestions
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;