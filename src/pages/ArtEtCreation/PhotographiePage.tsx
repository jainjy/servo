import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  User, 
  Mountain, 
  Palette, 
  Calendar, 
  Heart,
  Star,
  MapPin,
  Users,
  AlertCircle,
  RefreshCw,
  Briefcase,
  Search,
  ImageIcon,
  ChevronRight,
  Store
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface PhotographiePageProps {
  onContactClick: (subject: string, recipientName?: string) => void;
}

const PhotographiePage: React.FC<PhotographiePageProps> = ({ onContactClick }) => {
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [photographers, setPhotographers] = useState<Professional[]>([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState<Professional[]>([]);
  
  // Catégories FIXES - toujours affichées
  const [categories] = useState<Category[]>([
    { id: 1, name: 'Photographe portrait', slug: 'portrait' },
    { id: 2, name: 'Photographe paysage', slug: 'paysage' },
    { id: 3, name: 'Photographe événementiel', slug: 'evenementiel' },
    { id: 4, name: 'Photographe artistique', slug: 'artistique' },
    { id: 5, name: 'Photographe de mode', slug: 'mode' },
  ]);
  
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si on est sur une page de catégorie spécifique
  useEffect(() => {
    const path = location.pathname;
    const categoryFromPath = categories.find(cat => 
      path.includes(`/photographie/${cat.slug}`)
    );
    
    if (categoryFromPath) {
      setIsCategoryPage(true);
      setSelectedCategory(categoryFromPath.slug);
      // console.log(`📌 On category page: ${categoryFromPath.slug}`);
    } else {
      setIsCategoryPage(false);
      setSelectedCategory('');
    }
  }, [location, categories]);

  // Fonction pour filtrer les photographes par catégorie
  const filterPhotographersByCategory = useCallback((photogs: Professional[], categorySlug: string): Professional[] => {
    if (categorySlug === 'all') return photogs;
    
    const categoryMap: Record<string, string[]> = {
      'portrait': ['portrait', 'portraitiste', 'portraiture'],
      'paysage': ['paysage', 'landscape', 'nature', 'extérieur'],
      'evenementiel': ['événementiel', 'evenementiel', 'évènementiel', 'événement', 'evenement', 'event', 'mariage', 'cérémonie', 'ceremonie'],
      'artistique': ['artistique', 'art', 'créatif', 'creatif', 'artistic'],
      'mode': ['mode', 'fashion', 'stylisme', 'mannequin', 'editorial']
    };
    
    const keywords = categoryMap[categorySlug] || [];
    
    return photogs.filter(photog => {
      // Vérifier dans les métiers
      const hasMatchingMetier = photog.metiers?.some(metier => 
        keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      // Vérifier dans la spécialité
      const hasMatchingSpecialty = photog.specialty && 
        keywords.some(keyword => 
          photog.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      // Vérifier dans le nom/description
      const hasMatchingName = photog.name && 
        keywords.some(keyword => 
          photog.name.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty || hasMatchingName;
    });
  }, []);

  // Récupérer TOUS les photographes (toutes catégories)
  const fetchAllPhotographers = useCallback(async () => {
    // console.log('📡 Fetching ALL photographers');
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {};
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (cityFilter) {
        params.location = cityFilter;
      }
      
      // Récupérer TOUS les photographes (sans filtre de catégorie)
      params.limit = 50; // Augmenter la limite pour avoir plus de résultats
      

      const response = await api.get('/art-creation/photographers', { params });
      
    
      
      if (response.data.success) {
        const allPhotographers = response.data.data || [];
        setPhotographers(allPhotographers);
        
        // Filtrer selon la catégorie sélectionnée (si applicable)
        if (selectedCategory) {
          const filtered = filterPhotographersByCategory(allPhotographers, selectedCategory);
          setFilteredPhotographers(filtered);
          // console.log(`🔍 Filtered ${filtered.length} photographers for category: ${selectedCategory}`);
        } else {
          setFilteredPhotographers(allPhotographers);
        }
        
      } else {
        setError(response.data.message || 'Erreur lors du chargement');
      }
    } catch (err: any) {
      console.error('❌ Error fetching photographers:', err);
      setError('Erreur de connexion au serveur');
      setPhotographers([]);
      setFilteredPhotographers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cityFilter, selectedCategory, filterPhotographersByCategory]);

  // Récupérer les catégories depuis l'API (pour les counts seulement)
  const fetchCategoriesWithCounts = useCallback(async () => {
    try {
      setLoadingCategories(true);
      
      // Récupérer tous les photographes d'abord
      const response = await api.get('/art-creation/products', { params: { limit: 100 } });
      
      if (response.data.success && response.data.data) {
        const allPhotographers = response.data.data;
        
        // Compter les photographes par catégorie
        const categoryCounts = categories.map(category => {
          const count = filterPhotographersByCategory(allPhotographers, category.slug).length;
          return { ...category, count };
        });
        
        // Mettre à jour les catégories avec les counts
        // console.log('📊 Category counts:', categoryCounts);
        
      }
    } catch (err) {
      console.error('❌ Error fetching category counts:', err);
    } finally {
      setLoadingCategories(false);
    }
  }, [categories, filterPhotographersByCategory]);

  // Gestion du clic sur une catégorie — afficher les pros en place (pas de navigation)
  const handleCategoryClick = useCallback((categorySlug: string) => {
 
    // Définir la catégorie sélectionnée et afficher la vue catégorie
    setSelectedCategory(categorySlug);
    setIsCategoryPage(true);

    // Si les photographes sont déjà chargés, filtrer directement, sinon déclencher le fetch
    if (photographers.length > 0) {
      const filtered = filterPhotographersByCategory(photographers, categorySlug);
      setFilteredPhotographers(filtered);
      // console.log(`🔍 Filtered ${filtered.length} photographers for category: ${categorySlug}`);
    } else {
      fetchAllPhotographers();
    }
  }, [photographers, filterPhotographersByCategory, fetchAllPhotographers]);

  // Gestion du clic "Retour à tous les photographes" — réinitialiser l'affichage en place
  const handleViewAll = useCallback(() => {
    // console.log('🔙 Back to all photographers (in-place)');
    setSelectedCategory('');
    setIsCategoryPage(false);
    setFilteredPhotographers(photographers);
  }, [photographers]);

  // Fonction pour recharger les données
  const handleRetry = useCallback(() => {
    
    setError(null);
    fetchAllPhotographers();
  }, [fetchAllPhotographers]);

  // Appels initiaux
  useEffect(() => {
    // console.log('🚀 Initializing PhotographiePage');
    fetchCategoriesWithCounts();
    fetchAllPhotographers();
  }, [fetchCategoriesWithCounts, fetchAllPhotographers]);

  // Re-filtrer quand la catégorie change
  useEffect(() => {
    if (photographers.length > 0 && selectedCategory) {
      const filtered = filterPhotographersByCategory(photographers, selectedCategory);
      setFilteredPhotographers(filtered);
    } else if (photographers.length > 0) {
      setFilteredPhotographers(photographers);
    }
  }, [selectedCategory, photographers, filterPhotographersByCategory]);

  // Effet pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAllPhotographers();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, cityFilter, fetchAllPhotographers]);

  const handleContact = useCallback((professional: Professional) => {
    const subject = encodeURIComponent(`Demande pour ${professional.name}`);
    const recipient = encodeURIComponent(professional.name);
    navigate(`/contact?subject=${subject}&recipient=${recipient}`);
  }, [navigate]);

  // Fonction pour voir le profil (clic sur la carte)
  const handleViewProfile = useCallback((professional: Professional) => {
    // console.log('👤 Viewing profile:', professional);
    
    navigate(`/professional/${professional.id}`, {
      state: {
        professional: professional,
        name: professional.name,
        specialty: professional.specialty,
        city: professional.city,
        rating: professional.rating,
        avatar: professional.avatar,
        metiers: professional.metiers,
        bio: professional.bio
      },
    });
  }, [navigate]);

  const handleViewArtworks = useCallback((professional: Professional) => {

    
    navigate(`/oeuvres/${professional.id}`, {
      state: {
        professionalName: professional.name,
      },
    });
  }, [navigate]);

  // Icones pour les catégories
  const categoryIcons = [
    <User size={24} className="text-[#8B4513]" />,
    <Mountain size={24} className="text-[#8B4513]" />,
    <Calendar size={24} className="text-[#8B4513]" />,
    <Palette size={24} className="text-[#8B4513]" />,
    <Heart size={24} className="text-[#8B4513]" />,
  ];

  // Déterminer quelle liste de photographes afficher
  const photographersToDisplay = isCategoryPage ? filteredPhotographers : photographers;
  const displayTitle = isCategoryPage 
    ? `Photographes ${categories.find(c => c.slug === selectedCategory)?.name.toLowerCase()}`
    : ' Nos Photographes';

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2 flex items-center">
            <Camera className="mr-3" size={28} />
            Photographie
          </h1>
          <div className="h-1 w-20 bg-[#8B4513] rounded-full"></div>
        </div>

        {/* Erreur principale */}
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

        {/* Catégories - TOUJOURS affichées */}
        {!isCategoryPage && (
          <div className="mb-12">
                        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="p-6 rounded-lg border border-[#D3D3D3] cursor-pointer transition-all duration-200 group hover:border-[#556B2F] hover:shadow-lg bg-white"
                >
                  <div className="flex items-center mb-3">
                    <div className="mr-3">
                      {categoryIcons[index] || <Camera size={24} className="text-[#8B4513]" />}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="mt-2 text-gray-600 text-sm">
                      Découvrez nos photographes spécialisés
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
                    ? `Rechercher dans ${categories.find(c => c.slug === selectedCategory)?.name}...`
                    : "Rechercher un photographe..."
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
              Voir tous les photographes
            </button>
          </div>
        )}

        {/* Photographes */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {!isCategoryPage && (
                <>
                  <Star size={24} className="mr-2 text-[#8B4513]" />
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
            {!loading && photographersToDisplay.length > 0 && (
              <div className="text-sm text-gray-600">
                {photographersToDisplay.length} photographe{photographersToDisplay.length > 1 ? 's' : ''}
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
          ) : photographersToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {photographersToDisplay.map((professional) => (
                <div
                  key={professional.id}
                  className="group relative rounded-lg border border-[#D3D3D3] overflow-hidden hover:border-[#556B2F] hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
                  onClick={() => handleViewProfile(professional)}
                >
                  {/* Effet de hover sur toute la carte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Avatar */}
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    {professional.avatar ? (
                      <img 
                        src={professional.avatar} 
                        alt={professional.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <User size={64} class="text-gray-400" />
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={64} className="text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay sur l'image au hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    
                    {/* Badge vérifié */}
                    {professional.verified && (
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
                          {professional.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Briefcase size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm truncate">
                            {professional.specialty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="flex items-center mb-3">
                      <MapPin size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm truncate">
                        {professional.city || 'Non spécifié'}
                      </span>
                    </div>

                    {/* Métiers */}
                    {professional.metiers && professional.metiers.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {professional.metiers.slice(0, 2).map((metier) => (
                          <span
                            key={metier.id}
                            className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {metier.name}
                          </span>
                        ))}
                        {professional.metiers.length > 2 && (
                          <span className="text-gray-500 text-xs">
                            +{professional.metiers.length - 2}
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
                          handleViewArtworks(professional);
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
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isCategoryPage 
                  ? `Aucun photographe trouvé dans la catégorie "${categories.find(c => c.slug === selectedCategory)?.name}"`
                  : 'Aucun photographe disponible pour le moment'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {isCategoryPage 
                  ? 'Essayez de modifier vos critères de recherche ou consultez tous les photographes.'
                  : 'Veuillez réessayer ultérieurement.'
                }
              </p>
              <button
                onClick={isCategoryPage ? handleViewAll : handleRetry}
                className="px-4 py-2 rounded-md border border-[#556B2F] text-[#556B2F] font-medium hover:bg-gray-50 transition-colors"
              >
                {isCategoryPage ? 'Voir tous les photographes' : 'Réessayer'}
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

export default PhotographiePage;