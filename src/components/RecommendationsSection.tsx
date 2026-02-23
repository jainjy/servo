import React, { useState, useEffect } from 'react';
import { getUserRecommendations } from '@/lib/suggestionApi';
import { Recommendation } from '@/types/suggestionTypes';
import { useTracking } from '@/hooks/UserTracking';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Calendar, FileText, Eye, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '@/components/contexts/CartContext';
import { toast } from 'sonner';
import { DevisModal } from "@/components/TravauxSection";
import { ModalDemandeVisite } from "@/components/ModalDemandeVisite";

// Ajouter le type pour la source
interface EnhancedRecommendation extends Recommendation {
  sourceType?: string;
  title?: string;
  recommendationSource?: string;
  entityType?: string;
  city?: string;
  address?: string;
  surface?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
}

const RecommendationsSection: React.FC<{
  title?: string;
  limit?: number;
  showOnlyIfAuthenticated?: boolean;
  onDataLoaded?: (data: EnhancedRecommendation[]) => void;
  hideIfEmpty?: boolean;
}> = ({
  title = "🔍 Suggestions pour vous",
  limit = 4,
  showOnlyIfAuthenticated = true,
  onDataLoaded,
  hideIfEmpty = false
}) => {
    const { trackProductInteraction } = useTracking();
    const { addToCart } = useCart();

    const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    // États pour les modales
    const [devisModal, setDevisModal] = useState({
      isOpen: false,
      prestation: null as any
    });

    const [visiteModal, setVisiteModal] = useState({
      isOpen: false,
      property: null as any
    });

    // État pour suivre les demandes déjà envoyées
    const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

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

        if (showOnlyIfAuthenticated && !isAuthenticated) {
          setLoading(false);
          return;
        }

        const allRecs = await getUserRecommendations(12) as EnhancedRecommendation[];

        // Notifier le parent des données chargées
        if (onDataLoaded) {
          onDataLoaded(allRecs);
        }

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

    // Fonction pour obtenir la couleur du badge selon le type
    const getBadgeColor = (sourceType: string = "Produit") => {
      const colors = {
        "Produit": "bg-blue-100 text-blue-800 border-blue-200",
        "Service": "bg-green-100 text-green-800 border-green-200",
        "Métier": "bg-purple-100 text-purple-800 border-purple-200",
        "Immobilier": "bg-orange-100 text-orange-800 border-orange-200",
        "Autre": "bg-gray-100 text-gray-800 border-gray-200"
      };

      return colors[sourceType] || colors["Autre"];
    };

    const filterAndSortRecommendations = (recs: EnhancedRecommendation[]): EnhancedRecommendation[] => {
      return recs
        .sort((a, b) => {
          if (a.personalizationScore !== undefined && b.personalizationScore !== undefined) {
            return b.personalizationScore - a.personalizationScore;
          }

          if (a.popularityScore !== undefined && b.popularityScore !== undefined) {
            return b.popularityScore - a.popularityScore;
          }

          if (a.viewCount !== undefined && b.viewCount !== undefined) {
            return b.viewCount - a.viewCount;
          }

          if (a.price !== undefined && b.price !== undefined) {
            return b.price - a.price;
          }

          return a.name.localeCompare(b.name);
        })
        .slice(0, limit);
    };

    // Fonction pour gérer le clic sur une carte
    const handleCardClick = (recId: string) => {
      setExpandedCard(expandedCard === recId ? null : recId);
    };

    // NOUVELLES FONCTIONS POUR LES ACTIONS AVEC VÉRIFICATION AUTH
    const handleDevis = (item: EnhancedRecommendation, e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Veuillez vous connecter pour effectuer cette action");
        return;
      }

      // Préparer les données pour la modale devis
      const prestationData = {
        id: item.id,
        libelle: item.name || item.title,
        description: item.description || "Description non disponible",
        images: item.images || []
      };

      setDevisModal({
        isOpen: true,
        prestation: prestationData
      });
    };

    const handleVisite = (item: EnhancedRecommendation, e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Veuillez vous connecter pour effectuer cette action");
        return;
      }

      // CORRECTION : Préparer les données spécifiquement pour l'immobilier
      const propertyData = {
        id: item.id,
        title: item.name || item.title,
        city: item.city,
        address: item.address,
        price: item.price,
        type: item.type || 'Immobilier', // Utiliser le type spécifique
        status: 'for_sale', // Statut par défaut pour l'immobilier
        surface: item.surface,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        features: item.features || []
      };

      setVisiteModal({
        isOpen: true,
        property: propertyData
      });
    };

    const handleAddToCart = async (item: EnhancedRecommendation, e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Veuillez vous connecter pour effectuer cette action");
        return;
      }

      try {
        // Préparer les données pour le panier
        const cartItem = {
          id: item.id,
          name: item.name || item.title,
          price: item.price || 0,
          quantity: 1,
          images: item.images || []
        };

        // Utiliser la fonction addToCart du contexte
        await addToCart(cartItem);
        toast.success("Produit ajouté au panier avec succès");

      } catch (error) {
        console.error("Erreur ajout au panier:", error);
        toast.error("Erreur lors de l'ajout au panier");
      }
    };

    // Fonctions pour fermer les modales
    const closeDevisModal = () => {
      setDevisModal({ isOpen: false, prestation: null });
    };

    const closeVisiteModal = () => {
      setVisiteModal({ isOpen: false, property: null });
    };

    // Fonction pour gérer le succès d'une demande de visite
    const handleVisiteSuccess = (propertyId: string) => {
      setSentRequests(prev => ({ ...prev, [propertyId]: true }));
      toast.success("Votre demande de visite a été envoyée avec succès");
    };

    const handleRecommendationClick = async (recommendation: EnhancedRecommendation, e: React.MouseEvent) => {
      const entityType = recommendation.entityType || recommendation.type?.toLowerCase();

      // CORRECTION : Uniquement pour l'immobilier
      if (entityType === 'property' || recommendation.sourceType === 'Immobilier') {
        handleVisite(recommendation, e);
      }

      // Tracking si authentifié
      if (isAuthenticated) {
        try {
          await trackProductInteraction(
            recommendation.id,
            "click",
            recommendation.name,
            recommendation.category
          );
        } catch (error) {
          console.error('Erreur tracking click:', error);
        }
      }
    };

    const getInitials = (name: string): string => {
      if (!name) return "?";

      const words = name.trim().split(/\s+/);
      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
      }

      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

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

    // Fonction utilitaire pour formater le prix
    const formatPrice = (price: number | undefined): string => {
      if (!price) return "Prix sur demande";
      return `${price.toLocaleString('fr-FR')} €`;
    };

    // Ne rien afficher si hideIfEmpty est true et pas de recommandations
    if (hideIfEmpty && recommendations.length === 0 && !loading) {
      return null;
    }

    // Ne rien afficher si non authentifié et showOnlyIfAuthenticated=true
    if (showOnlyIfAuthenticated && !isAuthenticated && !loading) {
      return null;
    }

    // Squelette de chargement
    if (loading) {
      return (
        <section className="w-full pt-9 bg-white">
          <div className="pl-6 pr-5 ">
            <div className="mb-3">
              <h2 className="ext-xl font-medium text-[#222222] tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-[#717171]">
                Notre sélection rien que pour vous
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={loadRecommendations}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </section>
      );
    }

    if (recommendations.length === 0) {
      return (
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-500">Aucune recommandation disponible pour le moment.</p>
          </div>
        </section>
      );
    }

    return (
      <section className="w-full pt-9 bg-white">
        <div className="pl-6 pr-5 ">
          <div className="text-start mb-3">
            <div>
              <h2 className="ext-xl font-medium text-[#222222] tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-[#717171]">
                Notre sélection rien que pour vous
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((rec, index) => {
              const hasImage = rec.images && rec.images.length > 0;
              const initials = getInitials(rec.name);
              const colorClass = getColorFromName(rec.name);
              const sourceType = rec.sourceType || "Produit";
              const badgeColor = getBadgeColor(sourceType);
              const entityType = rec.entityType || rec.type?.toLowerCase();
              const isExpanded = expandedCard === rec.id;

              // CORRECTION : Identifier correctement l'immobilier
              const isProperty = entityType === 'property' || sourceType === 'Immobilier';
              const isAlreadySent = isProperty ? !!sentRequests[rec.id] : false;

              // Déterminer si la carte a du contenu supplémentaire à afficher
              const hasAdditionalContent = rec.description || isProperty;

              return (
                <div
                  key={rec.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform cursor-pointer group relative overflow-hidden flex flex-col ${isProperty ? 'border-2 border-orange-200' : ''
                    } ${isExpanded ? 'ring-2 ring-blue-500' : ''
                    } ${
                    // Hauteur adaptative : réduite par défaut, s'adapte au contenu quand expandée
                    isExpanded && hasAdditionalContent
                      ? 'h-auto min-h-[400px]'
                      : 'h-[380px]'
                    }`}
                  onClick={() => handleCardClick(rec.id)}
                >
                  {/* Badge de type en haut à droite */}

                  {/* Indicateur d'expansion */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`p-1 rounded-full bg-white/80 backdrop-blur-sm ${isExpanded ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Section image fixe */}
                  <div className="relative overflow-hidden rounded-t-2xl h-48 flex-shrink-0">
                    {hasImage ? (
                      <img
                        src={rec.images[0]}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                      className={`image-fallback w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center ${hasImage ? 'hidden' : 'flex'
                        }`}
                    >
                      <span className="text-4xl font-bold text-white">{initials}</span>
                    </div>
                  </div>

                  {/* Contenu principal */}
                  <div className={`p-6 flex flex-col ${isExpanded && hasAdditionalContent ? 'flex-1' : 'flex-none'
                    }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                        {rec.name}
                      </h3>
                    </div>

                    {rec.category && (
                      <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm mb-3 whitespace-nowrap">
                        {rec.category}
                      </span>
                    )}

                    {/* CONTENU ADDITIONNEL - AFFICHÉ SEULEMENT QUAND EXPANDÉ */}
                    {isExpanded && hasAdditionalContent && (
                      <div className="space-y-3 animate-in fade-in duration-300">
                        {/* Description */}
                        {rec.description && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {rec.description}
                            </p>
                          </div>
                        )}

                        {/* Localisation pour l'immobilier */}
                        {isProperty && (rec.city || rec.address) && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{rec.city || rec.address}</span>
                          </div>
                        )}

                        {/* Caractéristiques pour l'immobilier */}
                        {isProperty && (
                          <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                            {rec.surface && (
                              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                <span>{rec.surface} m²</span>
                              </div>
                            )}
                            {rec.bedrooms && (
                              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                <span>{rec.bedrooms} ch.</span>
                              </div>
                            )}
                            {rec.bathrooms && (
                              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                <span>{rec.bathrooms} sdb</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section prix fixe en bas */}
                    <div className="flex items-center justify-between mb-3 pt-4 border-t border-gray-100 mt-3">
                      {rec.price ? (
                        <span className="text-xl font-bold text-green-600">
                          <span className='underline text-gray-600'>Prix :</span> {formatPrice(rec.price)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Prix sur demande</span>
                      )}
                    </div>

                    {/* BOUTONS D'ACTION - AFFICHÉS UNIQUEMENT QUAND LA CARTE EST EXPANDÉE */}
                    {isExpanded && (
                      <div className="space-y-2 animate-in fade-in duration-300">
                        {isProperty ? (
                          <Button
                            size="sm"
                            className={`w-full ${isAlreadySent ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-900 hover:bg-slate-700'
                              } text-white`}
                            onClick={(e) => handleVisite(rec, e)}
                            disabled={isAlreadySent}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            {isAlreadySent ? 'Demande envoyée' : 'Demander visite'}
                          </Button>
                        ) : entityType === 'service' || entityType === 'metier' || sourceType === 'Service' || sourceType === 'Métier' ? (
                          <Button
                            size="sm"
                            className="w-full bg-slate-900 hover:bg-slate-700 text-white"
                            onClick={(e) => handleDevis(rec, e)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Faire un devis
                          </Button>
                        ) : entityType === 'product' || sourceType === 'Produit' ? (
                          <Button
                            size="sm"
                            className="w-full bg-slate-900 hover:bg-slate-700 text-white"
                            onClick={(e) => handleAddToCart(rec, e)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Ajouter au panier
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full bg-slate-900 hover:bg-slate-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info("Fonctionnalité en développement");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Indicateur pour montrer qu'on peut cliquer */}
                    {!isExpanded && (
                      <div className="text-center pt-2">
                        <span className="text-xs text-gray-500 inline-flex items-center gap-1">
                          <ChevronDown className="h-3 w-3" />
                          {hasAdditionalContent ? 'Cliquer pour voir les détails' : 'Cliquer pour les actions'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={loadRecommendations}
              className="bg-white text-slate-800 border border-slate-700 hover:bg-slate-900 hover:text-white px-8 py-3 rounded-lg transition-all duration-300 font-semibold inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Voir d'autres suggestions
            </button>
          </div>
        </div>

        {/* MODALES */}
        {devisModal.isOpen && (
          <DevisModal
            isOpen={devisModal.isOpen}
            onClose={closeDevisModal}
            prestation={devisModal.prestation}
          />
        )}

        {/* CORRECTION : ModalDemandeVisite spécifique pour l'immobilier */}
        {visiteModal.isOpen && (
          <ModalDemandeVisite
            open={visiteModal.isOpen}
            onClose={closeVisiteModal}
            property={visiteModal.property}
            onSuccess={handleVisiteSuccess}
            isAlreadySent={visiteModal.property ? !!sentRequests[visiteModal.property.id] : false}
          />
        )}
      </section>
    );
  };

export default RecommendationsSection;