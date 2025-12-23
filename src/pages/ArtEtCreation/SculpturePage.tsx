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
  Tag,
  Briefcase,
  Eye,
  Search,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
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
  searchQuery?: string;
  onContactClick: (subject: string, recipientName?: string) => void;
}

const SculpturePage: React.FC<SculpturePageProps> = ({ searchQuery, onContactClick }) => {
  const [loading, setLoading] = useState(true);
  const [sculptors, setSculptors] = useState<Professional[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllSculptors, setShowAllSculptors] = useState(false);
  
  const navigate = useNavigate();

  // Types de sculpture avec keywords pour le filtrage
  const sculptureTypes = [
    { 
      name: 'Sculpture sur bois', 
      icon: <Trees size={24} />, 
      slug: 'bois',
      keywords: ['bois', 'wood', 'chêne', 'noyer', 'ébène', 'bois']
    },
    { 
      name: 'Sculpture sur pierre', 
      icon: <Mountain size={24} />, 
      slug: 'pierre',
      keywords: ['pierre', 'stone', 'marbre', 'granit', 'calcaire', 'pierre']
    },
    { 
      name: 'Sculpture métal', 
      icon: <Drill size={24} />, 
      slug: 'metal',
      keywords: ['métal', 'metal', 'fer', 'acier', 'bronze', 'cuivre']
    },
    { 
      name: 'Sculpture terre cuite', 
      icon: <EggFried size={24} />, 
      slug: 'terre-cuite',
      keywords: ['terre', 'argile', 'céramique', 'poterie', 'terre-cuite', 'terre']
    },
    { 
      name: 'Sculpture contemporaine', 
      icon: <Palette size={24} />, 
      slug: 'contemporain',
      keywords: ['contemporain', 'moderne', 'abstrait', 'contemporary', 'actuel']
    },
    { 
      name: 'Commandes sur mesure', 
      icon: <PencilRuler size={24} />, 
      slug: 'sur-mesure',
      keywords: ['sur-mesure', 'commande', 'personnalisé', 'custom', 'personnalisée']
    },
  ];

  // Fonction pour récupérer les sculpteurs depuis l'API
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
      
      console.log('🌐 API params:', params);
      const response = await api.get('/art-creation/sculpture/products', { params });
      
      console.log('📦 API response:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length || 0
      });
      
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

  // Fonction pour filtrer les sculpteurs par catégorie
  const filterSculptorsByCategory = useCallback((categorySlug: string): Professional[] => {
    if (categorySlug === 'all') return sculptors;
    
    const category = sculptureTypes.find(cat => cat.slug === categorySlug);
    if (!category) return sculptors;
    
    return sculptors.filter(sculptor => {
      // Vérifier dans les métiers
      const hasMatchingMetier = sculptor.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      // Vérifier dans la spécialité
      const hasMatchingSpecialty = sculptor.specialty && 
        category.keywords.some(keyword => 
          sculptor.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      // Vérifier dans le nom
      const hasMatchingName = sculptor.name && 
        category.keywords.some(keyword => 
          sculptor.name.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty || hasMatchingName;
    });
  }, [sculptors]);

  // Fonction pour compter les sculpteurs par catégorie
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

  // Fonction pour recharger les données
  const handleRetry = useCallback(() => {
    console.log('🔄 Retry loading data');
    setError(null);
    fetchSculptors();
  }, [fetchSculptors]);

  // Gestion du clic sur une catégorie
  const handleCategoryClick = useCallback((categorySlug: string) => {
    console.log('🎯 Category clicked:', categorySlug);
    setSelectedCategory(categorySlug);
    setShowAllSculptors(true);
    
    // Scroll vers la section des sculpteurs
    setTimeout(() => {
      document.getElementById('sculptors-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  }, []);

  // Retour aux catégories
  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setShowAllSculptors(false);
  }, []);

  // Voir tous les sculpteurs
  const handleViewAllSculptors = useCallback(() => {
    setSelectedCategory('all');
    setShowAllSculptors(true);
    
    setTimeout(() => {
      document.getElementById('sculptors-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  }, []);

  // Appel initial
  useEffect(() => {
    console.log('🚀 Initializing SculpturePage');
    fetchSculptors();
  }, [fetchSculptors]);

  // Effet pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSculptors();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, cityFilter, fetchSculptors]);

  // Fonction pour voir le profil
  const handleViewProfile = useCallback((id: string) => {
    navigate(`/professional/${id}`);
  }, [navigate]);

  // Déterminer quelle liste de sculpteurs afficher
  const sculptorsToDisplay = selectedCategory 
    ? filterSculptorsByCategory(selectedCategory)
    : sculptors.slice(0, 6); // Affiche seulement 6 sculpteurs initialement

  // Déterminer le titre
  const displayTitle = selectedCategory 
    ? selectedCategory === 'all'
      ? 'Tous les sculpteurs'
      : `Sculpteurs - ${sculptureTypes.find(c => c.slug === selectedCategory)?.name}`
    : ' Nos Sculpteurs';

  return (
    <div>
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

      {/* Sculpture Types */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Hammer size={24} className="mr-2" style={{ color: '#8B4513' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
            Types de sculpture
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sculptureTypes.map((type, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
              style={{
                borderColor: '#D3D3D3',
                backgroundColor: 'white',
              }}
            >
              <div className="flex items-center mb-4">
                <div className="mr-4" style={{ color: '#8B4513' }}>
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{type.name}</h3>
                  
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {countSculptorsByCategory(type.slug)} artistes disponibles
                </span>
                <button 
                  className="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                  style={{ backgroundColor: '#6B8E23', color: 'white' }}
                  onClick={() => handleCategoryClick(type.slug)}
                >
                  <Hammer size={12} className="mr-1" />
                  Explorer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un sculpteur..."
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

      {/* Featured Artists - AFFICHAGE DES SCULPTEURS RÉELS */}
      <div className="mb-12" id="sculptors-section">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Award size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              {displayTitle}
              
            </h2>
            {loading && (
              <div className="ml-4 flex items-center text-gray-500">
                <RefreshCw size={16} className="animate-spin mr-2" />
                <span className="text-sm">Chargement...</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center px-4 py-2 rounded-md border font-medium"
              style={{ borderColor: '#556B2F', color: '#556B2F' }}
              onClick={handleViewAllSculptors}
            >
              <Users size={18} className="mr-2" />
              Voir tous les sculpteurs
            </button>
          </div>
        </div>

        

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-56 bg-gray-200 rounded-t-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : sculptorsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sculptorsToDisplay.map((sculptor) => (
              <div
                key={sculptor.id}
                className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow group bg-white"
                style={{ borderColor: '#D3D3D3' }}
              >
                {/* Avatar/Image */}
                <div className="h-56 relative overflow-hidden bg-gray-100">
                  {sculptor.avatar ? (
                    <img 
                      src={sculptor.avatar} 
                      alt={sculptor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                        <div className="w-24 h-24 rounded-full bg-[#8B4513] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                          <Hammer size={48} className="text-[#8B4513]" />
                        </div>
                        <span className="text-gray-600 text-sm">Aucune photo</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">{sculptor.name}</h3>
                    {sculptor.verified && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Hammer size={16} className="mr-2" style={{ color: '#8B4513' }} />
                      <div>
                        <span className="font-medium">Spécialité:</span>
                        <span className="ml-2" style={{ color: '#556B2F' }}>
                          {sculptor.specialty || 'Sculpteur'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" style={{ color: '#8B4513' }} />
                      <div>
                        <span className="font-medium">Localisation:</span>
                        <span className="ml-2">
                          {sculptor.city || 'Non spécifié'}
                        </span>
                      </div>
                    </div>
                    
                    {sculptor.metiers && sculptor.metiers.length > 0 && (
                      <div className="flex items-start">
                        <Briefcase size={16} className="mr-2 mt-1" style={{ color: '#8B4513' }} />
                        <div className="flex flex-wrap gap-1">
                          {sculptor.metiers.slice(0, 2).map((metier) => (
                            <span
                              key={metier.id}
                              className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                            >
                              {metier.name}
                            </span>
                          ))}
                          {sculptor.metiers.length > 2 && (
                            <span className="text-gray-500 text-xs mt-1">
                              +{sculptor.metiers.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewProfile(sculptor.id)} 
                      className="flex-1 py-2 rounded-md border text-center font-medium flex items-center justify-center hover:bg-[#556B2F] hover:text-white transition-colors duration-300"
                      style={{ borderColor: '#556B2F', color: '#556B2F' }}
                    >
                      <Eye size={18} className="mr-2" />
                      Profil
                    </button>
                    <button 
                      className="flex-1 py-2 rounded-md text-white font-medium flex items-center justify-center hover:bg-[#485826] transition-colors duration-200"
                      style={{ backgroundColor: '#556B2F' }}
                      onClick={() => onContactClick("Demande d'information sculpteur", sculptor.name)}
                    >
                      <Phone size={18} className="mr-2" />
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-[#D3D3D3] rounded-lg">
            <Hammer size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedCategory 
                ? `Aucun sculpteur trouvé dans la catégorie "${sculptureTypes.find(c => c.slug === selectedCategory)?.name}"`
                : 'Aucun sculpteur trouvé'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory 
                ? 'Essayez de modifier vos critères de recherche ou consultez tous les sculpteurs.'
                : 'Aucun sculpteur ne correspond à vos critères de recherche.'
              }
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-md border border-[#556B2F] text-[#556B2F] font-medium hover:bg-gray-50 transition-colors"
              >
                Réessayer
              </button>
              {selectedCategory && (
                <button
                  onClick={handleBackToCategories}
                  className="px-4 py-2 rounded-md bg-[#556B2F] text-white font-medium hover:bg-[#485826] transition-colors"
                >
                  Retour aux catégories
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SculpturePage;