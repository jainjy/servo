import React, { useState, useEffect, useCallback } from 'react';
import { 
  Palette, 
  Heart, 
  Share2, 
  ShoppingCart, 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  X, 
  Info, 
  Download, 
  Printer,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Mail,
  Phone,
  Eye,
  Users,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  Briefcase,
  ImageIcon,
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
}

interface PeinturePageProps {
  onContactClick?: (subject: string, recipientName?: string) => void;
}

const PeinturePage: React.FC<PeinturePageProps> = ({ onContactClick }) => {
  // États pour l'API
  const [loading, setLoading] = useState(true);
  const [painters, setPainters] = useState<Professional[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  
  const navigate = useNavigate();

  // Types de peinture
  const paintingStyles = [
    { 
      id: 1, 
      name: 'Peinture à l\'huile', 
      color: '#8B4513', 
      description: 'Technique traditionnelle aux couleurs profondes',
      slug: 'huile',
      keywords: ['huile', 'oil', 'peinture à l\'huile', 'oil painting']
    },
    { 
      id: 2, 
      name: 'Aquarelle', 
      color: '#6B8E23', 
      description: 'Transparence et légèreté',
      slug: 'aquarelle',
      keywords: ['aquarelle', 'watercolor', 'aquarelliste']
    },
    { 
      id: 3, 
      name: 'Acrylique', 
      color: '#556B2F', 
      description: 'Séchage rapide, couleurs vives',
      slug: 'acrylique',
      keywords: ['acrylique', 'acrylic', 'acrylique sur toile']
    },
    { 
      id: 4, 
      name: 'Peinture murale', 
      color: '#DAA520', 
      description: 'Fresques et grandes dimensions',
      slug: 'mural',
      keywords: ['mural', 'fresque', 'murale', 'wall painting']
    },
    { 
      id: 5, 
      name: 'Art abstrait', 
      color: '#B8860B', 
      description: 'Expression libre et formes',
      slug: 'abstrait',
      keywords: ['abstrait', 'abstraite', 'abstract', 'non figuratif']
    },
    { 
      id: 6, 
      name: 'Portraits', 
      color: '#8B7355', 
      description: 'Capture de l\'essence humaine',
      slug: 'portrait',
      keywords: ['portrait', 'portraitiste', 'portraiture', 'visage']
    },
  ];

  // Fonction pour récupérer les peintres
  const fetchPainters = useCallback(async () => {
    console.log('📡 Fetching painters...');
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
      
      console.log('🌐 API params:', params);
      const response = await api.get('/art-creation/peinture/products', { params });
      
      console.log('📦 API response:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length || 0
      });
      
      if (response.data.success) {
        setPainters(response.data.data || []);
      } else {
        setError(response.data.message || 'Erreur lors du chargement des peintres');
      }
    } catch (err: any) {
      console.error('❌ Error fetching painters:', err);
      setError('Erreur de connexion au serveur');
      setPainters([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cityFilter]);

  // Filtrer les peintres par catégorie
  const filterPaintersByCategory = useCallback((categorySlug: string): Professional[] => {
    if (categorySlug === 'all') return painters;
    
    const category = paintingStyles.find(cat => cat.slug === categorySlug);
    if (!category) return painters;
    
    return painters.filter(painter => {
      const hasMatchingMetier = painter.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const hasMatchingSpecialty = painter.specialty && 
        category.keywords.some(keyword => 
          painter.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty;
    });
  }, [painters]);

  // Compter les peintres par catégorie
  const countPaintersByCategory = useCallback((categorySlug: string): number => {
    if (categorySlug === 'all') return painters.length;
    
    const category = paintingStyles.find(cat => cat.slug === categorySlug);
    if (!category) return 0;
    
    return painters.filter(painter => {
      const hasMatchingMetier = painter.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const hasMatchingSpecialty = painter.specialty && 
        category.keywords.some(keyword => 
          painter.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty;
    }).length;
  }, [painters]);

  // Recharger les données
  const handleRetry = useCallback(() => {
    console.log('🔄 Retry loading data');
    setError(null);
    fetchPainters();
  }, [fetchPainters]);

  // Gestion du clic sur une catégorie — afficher les pros en place
  const handleCategoryClick = useCallback((categorySlug: string) => {
    console.log('🎯 Category clicked (in-place):', categorySlug);

    // Définir la catégorie sélectionnée et afficher la vue catégorie
    setSelectedCategory(categorySlug);
    setIsCategoryPage(true);

    // Si les peintres sont déjà chargés
    if (painters.length > 0) {
      console.log(`🔍 Filtering ${painters.length} painters for category: ${categorySlug}`);
    } else {
      fetchPainters();
    }
  }, [painters, fetchPainters]);

  // Gestion du clic "Retour à tous les peintres"
  const handleViewAll = useCallback(() => {
    console.log('🔙 Back to all painters (in-place)');
    setSelectedCategory(null);
    setIsCategoryPage(false);
  }, []);

  // Voir tous les peintres (sans filtres)
  const handleViewAllPainters = useCallback(() => {
    setSelectedCategory('all');
    setIsCategoryPage(true);
  }, []);

  // Voir le profil (clic sur la carte)
  const handleViewProfile = useCallback((painter: Professional) => {
    navigate(`/professional/${painter.id}`, {
      state: {
        professional: painter,
        name: painter.name,
        specialty: painter.specialty,
        city: painter.city,
        rating: painter.rating,
        avatar: painter.avatar,
        metiers: painter.metiers,
        bio: painter.bio
      },
    });
  }, [navigate]);

  // Voir les œuvres
  const handleViewArtworks = useCallback((painter: Professional) => {
    navigate(`/oeuvres/${painter.id}`, {
      state: {
        professionalName: painter.name,
      },
    });
  }, [navigate]);

  // Appel initial
  useEffect(() => {
    console.log('🚀 Initializing PeinturePage');
    fetchPainters();
  }, [fetchPainters]);

  // Effet pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPainters();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, cityFilter, fetchPainters]);

  // Déterminer quelle liste de peintres afficher
  const paintersToDisplay = isCategoryPage 
    ? (selectedCategory === 'all' ? painters : filterPaintersByCategory(selectedCategory || ''))
    : painters.slice(0, 6);

  // Déterminer le titre
  const displayTitle = isCategoryPage 
    ? (selectedCategory === 'all' 
        ? 'Tous les peintres' 
        : `Peintres ${paintingStyles.find(c => c.slug === selectedCategory)?.name.toLowerCase()}`)
    : 'Nos Peintres';

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2 flex items-center">
            <Palette className="mr-3" size={28} />
            Peinture
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

        {/* Styles et techniques - TOUJOURS affichés */}
        {!isCategoryPage && (
          <div className="mb-12">
            
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {paintingStyles.map((style) => (
                <div
                  key={style.id}
                  className="text-center group cursor-pointer"
                  onClick={() => handleCategoryClick(style.slug)}
                >
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform border-4 hover:border-[#556B2F]"
                    style={{ 
                      backgroundColor: style.color,
                      borderColor: selectedCategory === style.slug ? '#556B2F' : 'transparent'
                    }}
                  >
                    {countPaintersByCategory(style.slug)}+
                  </div>
                  <h3 className="font-semibold mb-1">{style.name}</h3>
                  <p className="text-sm text-gray-600">{countPaintersByCategory(style.slug)} artistes</p>
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
                    ? `Rechercher dans ${selectedCategory === 'all' ? 'tous les peintres' : paintingStyles.find(c => c.slug === selectedCategory)?.name}...`
                    : "Rechercher un peintre..."
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
              Voir tous les peintres
            </button>
          </div>
        )}

        {/* Peintres */}
        <div className="mb-12" id="artists-section">
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
            {!loading && paintersToDisplay.length > 0 && (
              <div className="text-sm text-gray-600">
                {paintersToDisplay.length} peintre{paintersToDisplay.length > 1 ? 's' : ''}
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
          ) : paintersToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paintersToDisplay.map((painter) => (
                <div
                  key={painter.id}
                  className="group relative rounded-lg border border-[#D3D3D3] overflow-hidden hover:border-[#556B2F] hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
                  onClick={() => handleViewProfile(painter)}
                >
                  {/* Effet de hover sur toute la carte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Avatar */}
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    {painter.avatar ? (
                      <img 
                        src={painter.avatar} 
                        alt={painter.name}
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
                            <Palette size={40} className="text-[#8B4513]" />
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
                          {painter.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Briefcase size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm truncate">
                            {painter.specialty || 'Peintre'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="flex items-center mb-3">
                      <MapPin size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm truncate">
                        {painter.city || 'Non spécifié'}
                      </span>
                    </div>

                    {/* Métiers */}
                    {painter.metiers && painter.metiers.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {painter.metiers.slice(0, 2).map((metier) => (
                          <span
                            key={metier.id}
                            className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {metier.name}
                          </span>
                        ))}
                        {painter.metiers.length > 2 && (
                          <span className="text-gray-500 text-xs">
                            +{painter.metiers.length - 2}
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
                          handleViewArtworks(painter);
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
              <Palette size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isCategoryPage 
                  ? `Aucun peintre trouvé dans la catégorie "${selectedCategory === 'all' ? 'tous les peintres' : paintingStyles.find(c => c.slug === selectedCategory)?.name}"`
                  : 'Aucun peintre disponible pour le moment'
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
                {isCategoryPage ? 'Voir tous les peintres' : 'Réessayer'}
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

export default PeinturePage;