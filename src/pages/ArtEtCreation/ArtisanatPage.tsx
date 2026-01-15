import React, { useState, useEffect, useCallback } from 'react';
import { 
  Target,
  EggFried,
  Scissors,
  Briefcase,
  Gem,
  Wine,
  ShoppingBasket,
  BaggageClaim,
  Users,
  Award,
  MapPin,
  Eye,
  Search,
  AlertCircle,
  RefreshCw,
  ImageIcon,
  ChevronRight,
  Star,
  Briefcase as BriefcaseIcon,
  User as UserIcon,
  Store
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

interface Professional {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  rating: number;
  reviewCount: number;
  works: number;
  avatar?: string;
  verified: boolean;
  bio?: string;
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
  yearsExperience?: number;
  deliveryTime?: string;
}

interface ArtisanatPageProps {
  onContactClick?: (subject: string, recipientName?: string) => void;
}

const ArtisanatPage: React.FC<ArtisanatPageProps> = ({ onContactClick }) => {
  // États pour l'API
  const [loading, setLoading] = useState(true);
  const [artisans, setArtisans] = useState<Professional[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  
  const navigate = useNavigate();

  // Catégories d'artisanat
  const craftCategories = [
    { 
      id: 1, 
      name: 'Céramique & Poterie', 
      icon: <EggFried size={24} className="text-[#8B4513]" />, 
      description: 'Pièces uniques en terre cuite, grès et porcelaine',
      slug: 'ceramique',
      keywords: ['céramiste', 'poterie', 'céramique', 'terre cuite', 'grès', 'porcelaine']
    },
    { 
      id: 2, 
      name: 'Tissage & Textile', 
      icon: <Scissors size={24} className="text-[#8B4513]" />, 
      description: 'Tissages traditionnels et créations textiles',
      slug: 'tissage',
      keywords: ['tisserand', 'tissage', 'textile', 'tissu']
    },
    { 
      id: 3, 
      name: 'Travail du cuir', 
      icon: <Briefcase size={24} className="text-[#8B4513]" />, 
      description: 'Maroquinerie fine et accessoires en cuir',
      slug: 'cuir',
      keywords: ['maroquinier', 'cuir', 'maroquinerie', 'maroquinier d\'art']
    },
    { 
      id: 4, 
      name: 'Bijoux artisanaux', 
      icon: <Gem size={24} className="text-[#8B4513]" />, 
      description: 'Créations uniques en métal, pierres et perles',
      slug: 'bijoux',
      keywords: ['bijoutier', 'bijoux', 'joaillier']
    },
    { 
      id: 5, 
      name: 'Menuiserie fine', 
      icon: <Target size={24} className="text-[#8B4513]" />, 
      description: 'Meubles et objets en bois massif',
      slug: 'menuiserie',
      keywords: ['ébéniste', 'menuiserie', 'bois', 'ébénisterie']
    },
    { 
      id: 6, 
      name: 'Verre soufflé', 
      icon: <Wine size={24} className="text-[#8B4513]" />, 
      description: 'Verre artistique soufflé à la bouche',
      slug: 'verre',
      keywords: ['verrier', 'verre', 'verre soufflé']
    },
    { 
      id: 7, 
      name: 'Vannerie', 
      icon: <ShoppingBasket size={24} className="text-[#8B4513]" />, 
      description: 'Paniers et objets en osier et rotin',
      slug: 'vannerie',
      keywords: ['vannier', 'vannerie', 'osier', 'rotin']
    },
    { 
      id: 8, 
      name: 'Créations diverses', 
      icon: <BaggageClaim size={24} className="text-[#8B4513]" />, 
      description: 'Créateurs textile, mobilier et créations uniques',
      slug: 'creations',
      keywords: ['créateur textile', 'créateur céramique', 'créateur mobilier', 'créateur verre soufflé']
    },
  ];

  // Fonction pour récupérer les artisans
  const fetchArtisans = useCallback(async () => {
    // console.log('📡 Fetching artisans...');
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
  
      const response = await api.get('/art-creation/artisanat/products', { params });
      
   
      if (response.data.success) {
        setArtisans(response.data.data || []);
      } else {
        setError(response.data.message || 'Erreur lors du chargement des artisans');
      }
    } catch (err: any) {
      console.error('❌ Error fetching artisans:', err);
      setError('Erreur de connexion au serveur');
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cityFilter]);

  // Filtrer les artisans par catégorie
  const filterArtisansByCategory = useCallback((categorySlug: string): Professional[] => {
    if (categorySlug === 'all') return artisans;
    
    const category = craftCategories.find(cat => cat.slug === categorySlug);
    if (!category) return artisans;
    
    return artisans.filter(artisan => {
      const hasMatchingMetier = artisan.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const hasMatchingSpecialty = artisan.specialty && 
        category.keywords.some(keyword => 
          artisan.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty;
    });
  }, [artisans]);

  // Compter les artisans par catégorie
  const countArtisansByCategory = useCallback((categorySlug: string): number => {
    if (categorySlug === 'all') return artisans.length;
    
    const category = craftCategories.find(cat => cat.slug === categorySlug);
    if (!category) return 0;
    
    return artisans.filter(artisan => {
      const hasMatchingMetier = artisan.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const hasMatchingSpecialty = artisan.specialty && 
        category.keywords.some(keyword => 
          artisan.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty;
    }).length;
  }, [artisans]);

  // Recharger les données
  const handleRetry = useCallback(() => {
    setError(null);
    fetchArtisans();
  }, [fetchArtisans]);

  // Gestion du clic sur une catégorie
  const handleCategoryClick = useCallback((categorySlug: string) => {

    setSelectedCategory(categorySlug);
    setIsCategoryPage(true);

    if (artisans.length > 0) {
      // console.log(`🔍 Filtering ${artisans.length} artisans for category: ${categorySlug}`);
    } else {
      fetchArtisans();
    }
  }, [artisans, fetchArtisans]);

  // Gestion du clic "Retour à tous les artisans"
  const handleViewAll = useCallback(() => {

    setSelectedCategory(null);
    setIsCategoryPage(false);
  }, []);

  // Voir tous les artisans (sans filtres)
  const handleViewAllArtisans = useCallback(() => {
    setSelectedCategory('all');
    setIsCategoryPage(true);
  }, []);

  // Voir le profil (clic sur la carte)
  const handleViewProfile = useCallback((artisan: Professional) => {
    navigate(`/professional/${artisan.id}`, {
      state: {
        professional: artisan,
        name: artisan.name,
        specialty: artisan.specialty,
        city: artisan.city,
        rating: artisan.rating,
        avatar: artisan.avatar,
        metiers: artisan.metiers,
        bio: artisan.bio
      },
    });
  }, [navigate]);

  // Voir les œuvres
  const handleViewArtworks = useCallback((artisan: Professional) => {
    navigate(`/oeuvres/${artisan.id}`, {
      state: {
        professionalName: artisan.name,
      },
    });
  }, [navigate]);

  // Appel initial
  useEffect(() => {
    fetchArtisans();
  }, [fetchArtisans]);

  // Effet pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchArtisans();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, cityFilter, fetchArtisans]);

  // Déterminer quelle liste d'artisans afficher
  const artisansToDisplay = isCategoryPage 
    ? (selectedCategory === 'all' ? artisans : filterArtisansByCategory(selectedCategory || ''))
    : artisans.slice(0, 6);

  // Déterminer le titre
  const displayTitle = isCategoryPage 
    ? (selectedCategory === 'all' 
        ? 'Tous les artisans' 
        : `Artisans ${craftCategories.find(c => c.slug === selectedCategory)?.name.toLowerCase()}`)
    : 'Nos Artisans';

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2 flex items-center">
            <Target className="mr-3" size={28} />
            Artisanat
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

        {/* Catégories d'artisanat - TOUJOURS affichées */}
        {!isCategoryPage && (
          <div className="mb-12">        
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {craftCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-6 rounded-lg border border-[#D3D3D3] cursor-pointer transition-all duration-200 group hover:border-[#556B2F] hover:shadow-lg bg-white"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <div className="flex items-center mb-3">
                    <div className="mr-3">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm">
                      {countArtisansByCategory(category.slug)} artisans
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
                    ? `Rechercher dans ${selectedCategory === 'all' ? 'tous les artisans' : craftCategories.find(c => c.slug === selectedCategory)?.name}...`
                    : "Rechercher un artisan..."
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
              Voir tous les artisans
            </button>
          </div>
        )}

        {/* Artisans */}
        <div className="mb-12" id="artisans-section">
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
          ) : artisansToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisansToDisplay.map((artisan) => (
                <div
                  key={artisan.id}
                  className="group relative rounded-lg border border-[#D3D3D3] overflow-hidden hover:border-[#556B2F] hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
                  onClick={() => handleViewProfile(artisan)}
                >
                  {/* Effet de hover sur toute la carte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Avatar */}
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    {artisan.avatar ? (
                      <img 
                        src={artisan.avatar} 
                        alt={artisan.name}
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
                            <Target size={40} className="text-[#8B4513]" />
                          </div>
                          <span className="text-gray-600 text-sm">Aucune photo</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay sur l'image au hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    
                  </div>

                  {/* Info */}
                  <div className="p-4 relative z-10 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#8B4513] transition-colors truncate">
                          {artisan.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <BriefcaseIcon size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm truncate">
                            {artisan.specialty || 'Artisan'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="flex items-center mb-3">
                      <MapPin size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm truncate">
                        {artisan.city || 'Non spécifié'}
                      </span>
                    </div>

                    {/* Métiers */}
                    {artisan.metiers && artisan.metiers.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {artisan.metiers.slice(0, 2).map((metier) => (
                          <span
                            key={metier.id}
                            className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {metier.name}
                          </span>
                        ))}
                        {artisan.metiers.length > 2 && (
                          <span className="text-gray-500 text-xs">
                            +{artisan.metiers.length - 2}
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
                          handleViewArtworks(artisan);
                        }}
                        className="w-full py-2.5 rounded-md font-medium text-center bg-[#8B4513] text-white hover:bg-[#7a3b0f] transition-colors flex items-center justify-center group/btn"
                      >
                        <Store size={16} className="mr-2 group-hover/btn:animate-pulse" />
                        Boutique
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-[#D3D3D3] rounded-lg bg-white">
              <Target size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isCategoryPage 
                  ? `Aucun artisan trouvé dans la catégorie "${selectedCategory === 'all' ? 'tous les artisans' : craftCategories.find(c => c.slug === selectedCategory)?.name}"`
                  : 'Aucun artisan disponible pour le moment'
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
                {isCategoryPage ? 'Voir tous les artisans' : 'Réessayer'}
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

export default ArtisanatPage;