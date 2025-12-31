import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  Hammer, 
  Star, 
  Trees, 
  Mountain, 
  Drill, 
  EggFried, 
  Palette,
  PencilRuler,
  Users,
  MapPin,
  Award,
  Phone,
  Briefcase,
  Eye,
  Search,
  AlertCircle,
  RefreshCw,
  ImageIcon,
  ChevronRight,
  Filter
} from 'lucide-react';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface Professional {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  rating: number;
  reviewCount: number;
  avatar?: string;
  verified: boolean;
  bio?: string;
  services: Array<{
    id: string;
    title: string;
    description: string;
    price?: number;
    image?: string;
  }>;
  metiers: Array<{
    id: number;
    name: string;
  }>;
  createdAt: string;
  isAvailable?: boolean;
  companyName?: string;
  commercialName?: string;
  address?: string;
  zipCode?: string;
  email?: string;
  phone?: string;
}

interface SculpturePageProps {
  onContactClick: (subject: string, recipientName?: string) => void;
}

const SculpturePage: React.FC<SculpturePageProps> = ({ onContactClick }) => {
  const [loading, setLoading] = useState(true);
  const [sculptors, setSculptors] = useState<Professional[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  
  const navigate = useNavigate();

  // Types de sculpture
  const sculptureTypes = [
    { 
      name: 'Sculpture sur bois', 
      icon: <Trees size={24} className="text-[#8B4513]" />, 
      slug: 'bois',
      keywords: ['bois', 'wood', 'chêne', 'noyer', 'ébène', 'bois']
    },
    { 
      name: 'Sculpture sur pierre', 
      icon: <Mountain size={24} className="text-[#8B4513]" />, 
      slug: 'pierre',
      keywords: ['pierre', 'stone', 'marbre', 'granit', 'calcaire', 'pierre']
    },
    { 
      name: 'Sculpture métal', 
      icon: <Drill size={24} className="text-[#8B4513]" />, 
      slug: 'metal',
      keywords: ['métal', 'metal', 'fer', 'acier', 'bronze', 'cuivre']
    },
    { 
      name: 'Sculpture terre cuite', 
      icon: <EggFried size={24} className="text-[#8B4513]" />, 
      slug: 'terre-cuite',
      keywords: ['terre', 'argile', 'céramique', 'poterie', 'terre-cuite', 'terre']
    },
    { 
      name: 'Sculpture contemporaine', 
      icon: <Palette size={24} className="text-[#8B4513]" />, 
      slug: 'contemporain',
      keywords: ['contemporain', 'moderne', 'abstrait', 'contemporary', 'actuel']
    },
    { 
      name: 'Commandes sur mesure', 
      icon: <PencilRuler size={24} className="text-[#8B4513]" />, 
      slug: 'sur-mesure',
      keywords: ['sur-mesure', 'commande', 'personnalisé', 'custom', 'personnalisée']
    },
  ];

  // Fonction pour récupérer les sculpteurs
  const fetchSculptors = useCallback(async () => {
    console.log('📡 Fetching sculptors...');
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        limit: 50,
        page: 1
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (cityFilter) {
        params.location = cityFilter;
      }
      
      const response = await api.get('/art-creation/sculpture/products', { params });
      
      if (response.data.success) {
        setSculptors(response.data.data || []);
      } else {
        setError(response.data.message || 'Erreur lors du chargement des sculpteurs');
      }
    } catch (err: any) {
      console.error('❌ Error fetching sculptors:', err);
      setError('Erreur de connexion au serveur');
      setSculptors([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cityFilter]);

  // Filtrer les sculpteurs par catégorie
  const filterSculptorsByCategory = useCallback((categorySlug: string): Professional[] => {
    if (categorySlug === 'all') return sculptors;
    
    const category = sculptureTypes.find(cat => cat.slug === categorySlug);
    if (!category) return sculptors;
    
    return sculptors.filter(sculptor => {
      const hasMatchingMetier = sculptor.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const hasMatchingSpecialty = sculptor.specialty && 
        category.keywords.some(keyword => 
          sculptor.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty;
    });
  }, [sculptors]);

  // Compter les sculpteurs par catégorie
  const countSculptorsByCategory = useCallback((categorySlug: string): number => {
    if (categorySlug === 'all') return sculptors.length;
    
    const category = sculptureTypes.find(cat => cat.slug === categorySlug);
    if (!category) return 0;
    
    return sculptors.filter(sculptor => {
      const hasMatchingMetier = sculptor.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const hasMatchingSpecialty = sculptor.specialty && 
        category.keywords.some(keyword => 
          sculptor.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty;
    }).length;
  }, [sculptors]);

  // Recharger les données
  const handleRetry = useCallback(() => {
    setError(null);
    fetchSculptors();
  }, [fetchSculptors]);

  // Gestion du clic sur une catégorie — afficher les pros en place (pas de navigation)
  const handleCategoryClick = useCallback((categorySlug: string) => {
    console.log('🎯 Category clicked (in-place):', categorySlug);

    // Définir la catégorie sélectionnée et afficher la vue catégorie
    setSelectedCategory(categorySlug);
    setIsCategoryPage(true);

    // Si les sculpteurs sont déjà chargés, filtrer directement
    if (sculptors.length > 0) {
      // Filtrage se fera automatiquement dans le useEffect
      console.log(`🔍 Filtering ${sculptors.length} sculptors for category: ${categorySlug}`);
    } else {
      fetchSculptors();
    }
  }, [sculptors, fetchSculptors]);

  // Gestion du clic "Retour à tous les sculpteurs" — réinitialiser l'affichage en place
  const handleViewAll = useCallback(() => {
    console.log('🔙 Back to all sculptors (in-place)');
    setSelectedCategory(null);
    setIsCategoryPage(false);
    // On montre tous les sculpteurs (non filtrés)
  }, []);

  // Voir tous les sculpteurs (sans filtres)
  const handleViewAllSculptors = useCallback(() => {
    setSelectedCategory('all');
    setIsCategoryPage(true);
  }, []);

  // Voir le profil (clic sur la carte)
  const handleViewProfile = useCallback((sculptor: Professional) => {
    navigate(`/professional/${sculptor.id}`, {
      state: {
        professional: sculptor,
        name: sculptor.name,
        specialty: sculptor.specialty,
        city: sculptor.city,
        rating: sculptor.rating,
        avatar: sculptor.avatar,
        metiers: sculptor.metiers,
        bio: sculptor.bio
      },
    });
  }, [navigate]);

  // Voir les œuvres
  const handleViewArtworks = useCallback((sculptor: Professional) => {
    navigate(`/oeuvres/${sculptor.id}`, {
      state: {
        professionalName: sculptor.name,
      },
    });
  }, [navigate]);

  // Appel initial
  useEffect(() => {
    fetchSculptors();
  }, [fetchSculptors]);

  // Effet pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSculptors();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, cityFilter, fetchSculptors]);

  // Déterminer quelle liste de sculpteurs afficher
  const sculptorsToDisplay = isCategoryPage 
    ? (selectedCategory === 'all' ? sculptors : filterSculptorsByCategory(selectedCategory || ''))
    : sculptors.slice(0, 6); // Affiche seulement 6 sculpteurs initialement

  // Déterminer le titre
  const displayTitle = isCategoryPage 
    ? (selectedCategory === 'all' 
        ? 'Tous les sculpteurs' 
        : `Sculpteurs ${sculptureTypes.find(c => c.slug === selectedCategory)?.name.toLowerCase()}`)
    : 'Nos Sculpteurs';

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2 flex items-center">
            <Hammer className="mr-3" size={28} />
            Sculpture
          </h1>
          <div className="h-1 w-20 bg-[#8B4513] rounded-full"></div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 p-4 rounded-md border border-red-300 bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="mr-2 text-red-600" />
              <p className="text-red-600 flex-1">{error}</p>
              <button 
                onClick={handleRetry}
                className="ml-4 flex items-center px-3 py-2 rounded-md text-sm bg-[#8B4513] text-white hover:bg-[#7a3b0f] transition-colors"
              >
                <RefreshCw size={14} className="mr-1" />
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Types de sculpture - TOUJOURS affichés */}
        {!isCategoryPage && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Hammer size={24} className="mr-2 text-[#8B4513]" />
              <h2 className="text-2xl font-bold text-[#8B4513]">
                Types de sculpture
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sculptureTypes.map((type, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-[#D3D3D3] cursor-pointer transition-all duration-200 group hover:border-[#556B2F] hover:shadow-lg bg-white"
                  onClick={() => handleCategoryClick(type.slug)}
                >
                  <div className="flex items-center mb-3">
                    <div className="mr-3">
                      {type.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{type.name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm">
                      {countSculptorsByCategory(type.slug)} artistes disponibles
                    </p>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-[#8B4513] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recherche et filtres */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={isCategoryPage 
                    ? `Rechercher dans ${selectedCategory === 'all' ? 'tous les sculpteurs' : sculptureTypes.find(c => c.slug === selectedCategory)?.name}...`
                    : "Rechercher un sculpteur..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#D3D3D3] focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Ville, code postal..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#D3D3D3] focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bouton retour si on est sur une page de catégorie */}
        {isCategoryPage && (
          <div className="mb-6">
            <button
              onClick={handleViewAll}
              className="flex items-center px-4 py-2 rounded-md border border-[#556B2F] text-[#556B2F] font-medium hover:bg-gray-50 transition-colors"
            >
              <Users size={18} className="mr-2" />
              Voir tous les sculpteurs
            </button>
          </div>
        )}

        {/* Sculpteurs */}
        <div className="mb-12" id="sculptors-section">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {!isCategoryPage && (
                <>
                  <Award size={24} className="mr-2 text-[#8B4513]" />
                  <h2 className="text-2xl font-bold text-[#8B4513]">
                    {displayTitle}
                  </h2>
                </>
              )}
              {loading && (
                <div className="ml-4 flex items-center text-gray-500">
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  <span className="text-sm">Chargement...</span>
                </div>
              )}
            </div>
            {!loading && sculptorsToDisplay.length > 0 && (
              <div className="text-sm text-gray-600">
                {sculptorsToDisplay.length} sculpteur{sculptorsToDisplay.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : sculptorsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sculptorsToDisplay.map((sculptor) => (
                <div
                  key={sculptor.id}
                  className="group relative rounded-lg border border-[#D3D3D3] overflow-hidden hover:border-[#556B2F] hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
                  onClick={() => handleViewProfile(sculptor)}
                >
                  {/* Effet de hover sur toute la carte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Avatar */}
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    {sculptor.avatar ? (
                      <img 
                        src={sculptor.avatar} 
                        alt={sculptor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-[#8B4513] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                            <Hammer size={40} className="text-[#8B4513]" />
                          </div>
                          <span className="text-gray-600 text-sm">Aucune photo</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay sur l'image au hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    
                    {/* Badge vérifié */}
                    {sculptor.verified && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          ✓ Vérifié
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 relative z-10 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#8B4513] transition-colors truncate">
                          {sculptor.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Briefcase size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm truncate">
                            {sculptor.specialty || 'Sculpteur'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="flex items-center mb-3">
                      <MapPin size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm truncate">
                        {sculptor.city || 'Non spécifié'}
                      </span>
                    </div>

                    {/* Métiers */}
                    {sculptor.metiers && sculptor.metiers.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {sculptor.metiers.slice(0, 2).map((metier) => (
                          <span
                            key={metier.id}
                            className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {metier.name}
                          </span>
                        ))}
                        {sculptor.metiers.length > 2 && (
                          <span className="text-gray-500 text-xs">
                            +{sculptor.metiers.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Note discrète */}
                    <div className="text-center mb-2">
                      <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Cliquez pour voir le profil
                      </p>
                    </div>

                    {/* Bouton "Voir les œuvres" */}
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewArtworks(sculptor);
                        }}
                        className="w-full py-2.5 rounded-md font-medium text-center bg-[#8B4513] text-white hover:bg-[#7a3b0f] transition-colors flex items-center justify-center group/btn"
                      >
                        <ImageIcon size={16} className="mr-2 group-hover/btn:animate-pulse" />
                        Voir les œuvres
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-[#D3D3D3] rounded-lg bg-white">
              <Hammer size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isCategoryPage 
                  ? `Aucun sculpteur trouvé dans la catégorie "${selectedCategory === 'all' ? 'tous les sculpteurs' : sculptureTypes.find(c => c.slug === selectedCategory)?.name}"`
                  : 'Aucun sculpteur disponible pour le moment'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {isCategoryPage 
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Veuillez réessayer ultérieurement.'
                }
              </p>
              <button
                onClick={isCategoryPage ? handleViewAll : handleRetry}
                className="px-4 py-2 rounded-md border border-[#556B2F] text-[#556B2F] font-medium hover:bg-gray-50 transition-colors"
              >
                {isCategoryPage ? 'Voir tous les sculpteurs' : 'Réessayer'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Styles inline pour les effets */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .group-hover\\/btn\\:animate-pulse:hover {
          animation: pulse-slow 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default SculpturePage;