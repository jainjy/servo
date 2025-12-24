import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Clock, 
  EggFried, 
  Scissors, 
  Briefcase, 
  Gem,
  Wine,
  ShoppingBasket,
  BaggageClaim,
  Users,
  Award,
  Shield,
  Calendar,
  Tag,
  Phone,
  Eye,
  BookOpen,
  Target,
  X,
  Info,
  Share2,
  Mail,
  ChevronRight,
  ExternalLink,
  Printer,
  Filter,
  Search,
  AlertCircle,
  RefreshCw,
  Palette,
  Star as StarIcon,
  User as UserIcon
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
  searchQuery?: string;
  onContactClick?: (subject: string, recipientName?: string) => void;
}

const ArtisanatPage: React.FC<ArtisanatPageProps> = ({ searchQuery, onContactClick }) => {
  const [showArtisanDetail, setShowArtisanDetail] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Professional | null>(null);
  const [showAllArtisans, setShowAllArtisans] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{id: number, name: string, slug: string} | null>(null);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  
  // États pour l'API
  const [loading, setLoading] = useState(true);
  const [artisans, setArtisans] = useState<Professional[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  
  const navigate = useNavigate();

  // Catégories d'artisanat basées sur votre seed
  const craftCategories = [
    { 
      id: 1, 
      name: 'Céramique & Poterie', 
      icon: <EggFried size={28} />, 
      description: 'Pièces uniques en terre cuite, grès et porcelaine',
      slug: 'ceramique',
      keywords: ['céramiste', 'poterie', 'céramique', 'terre cuite', 'grès', 'porcelaine']
    },
    { 
      id: 2, 
      name: 'Tissage & Textile', 
      icon: <Scissors size={28} />, 
      description: 'Tissages traditionnels et créations textiles',
      slug: 'tissage',
      keywords: ['tisserand', 'tissage', 'textile', 'tissu']
    },
    { 
      id: 3, 
      name: 'Travail du cuir', 
      icon: <Briefcase size={28} />, 
      description: 'Maroquinerie fine et accessoires en cuir',
      slug: 'cuir',
      keywords: ['maroquinier', 'cuir', 'maroquinerie', 'maroquinier d\'art']
    },
    { 
      id: 4, 
      name: 'Bijoux artisanaux', 
      icon: <Gem size={28} />, 
      description: 'Créations uniques en métal, pierres et perles',
      slug: 'bijoux',
      keywords: ['bijoutier', 'bijoux', 'joaillier']
    },
    { 
      id: 5, 
      name: 'Menuiserie fine', 
      icon: <Target size={28} />, 
      description: 'Meubles et objets en bois massif',
      slug: 'menuiserie',
      keywords: ['ébéniste', 'menuiserie', 'bois', 'ébénisterie']
    },
    { 
      id: 6, 
      name: 'Verre soufflé', 
      icon: <Wine size={28} />, 
      description: 'Verre artistique soufflé à la bouche',
      slug: 'verre',
      keywords: ['verrier', 'verre', 'verre soufflé']
    },
    { 
      id: 7, 
      name: 'Vannerie', 
      icon: <ShoppingBasket size={28} />, 
      description: 'Paniers et objets en osier et rotin',
      slug: 'vannerie',
      keywords: ['vannier', 'vannerie', 'osier', 'rotin']
    },
    { 
      id: 8, 
      name: 'Créations diverses', 
      icon: <BaggageClaim size={28} />, 
      description: 'Créateurs textile, mobilier et créations uniques',
      slug: 'creations',
      keywords: ['créateur textile', 'créateur céramique', 'créateur mobilier', 'créateur verre soufflé']
    },
  ];

  // Fonction pour récupérer les artisans depuis l'API
  const fetchArtisans = useCallback(async () => {
    console.log('📡 Fetching artisans...');
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
      
      if (selectedCategory) {
        params.category = selectedCategory.slug;
      }
      
      console.log('🌐 API params:', params);
      // Appel à la nouvelle route artisanat
      const response = await api.get('/art-creation/artisanat/products', { params });
      
      console.log('📦 API response:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length || 0
      });
      
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
  }, [searchTerm, cityFilter, selectedCategory]);

  // Fonction pour compter les artisans par catégorie
  const countArtisansByCategory = useCallback((categorySlug: string): number => {
    if (categorySlug === 'all') return artisans.length;
    
    const category = craftCategories.find(cat => cat.slug === categorySlug);
    if (!category) return 0;
    
    return artisans.filter(artisan => {
      return artisan.metiers?.some(metier => 
        category.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }).length;
  }, [artisans, craftCategories]);

  // Fonction pour explorer une catégorie
  const handleViewCategory = useCallback((category: any) => {
    setSelectedCategory(category);
    
    // Scroll vers la section des artisans
    setTimeout(() => {
      document.getElementById('artisans-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  }, []);

  // Fonction pour recharger les données
  const handleRetry = useCallback(() => {
    console.log('🔄 Retry loading data');
    setError(null);
    fetchArtisans();
  }, [fetchArtisans]);

  // Fonction pour voir le profil
  const handleViewProfile = useCallback((id: string) => {
    navigate(`/professional/${id}`);
  }, [navigate]);

  // Fonction pour liker un artisan
  const handleLikeItem = (itemId: string) => {
    if (likedItems.includes(itemId)) {
      setLikedItems(likedItems.filter(id => id !== itemId));
    } else {
      setLikedItems([...likedItems, itemId]);
    }
  };

  // Fonction pour partager un artisan
  const handleShareArtisan = (artisan: Professional) => {
    if (navigator.share) {
      navigator.share({
        title: artisan.name,
        text: artisan.specialty || `Découvrez ${artisan.name}, artisan spécialisé`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };



  // Appel initial
  useEffect(() => {
    console.log('🚀 Initializing ArtisanatPage');
    fetchArtisans();
  }, [fetchArtisans]);

  // Effet pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchArtisans();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, cityFilter, selectedCategory, fetchArtisans]);

  // Déterminer quels artisans afficher
  const displayedArtisans = showAllArtisans ? artisans : artisans.slice(0, 3);
  const displayedCategories = showAllCategories ? craftCategories : craftCategories.slice(0, 8);

  // Fonction pour obtenir l'icône de catégorie
  const getCategoryIcon = (metiers: Array<{id: number, name: string}>) => {
    const metierName = metiers?.[0]?.name?.toLowerCase() || '';
    
    if (metierName.includes('céram') || metierName.includes('poterie')) {
      return <EggFried size={28} />;
    }
    if (metierName.includes('tiss') || metierName.includes('textile')) {
      return <Scissors size={28} />;
    }
    if (metierName.includes('cuir') || metierName.includes('maroquin')) {
      return <Briefcase size={28} />;
    }
    if (metierName.includes('bijou') || metierName.includes('joaill')) {
      return <Gem size={28} />;
    }
    if (metierName.includes('bois') || metierName.includes('ébén')) {
      return <Target size={28} />;
    }
    if (metierName.includes('verre')) {
      return <Wine size={28} />;
    }
    if (metierName.includes('vannier')) {
      return <ShoppingBasket size={28} />;
    }
    
    return <BaggageClaim size={28} />;
  };

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

      {/* Catégories d'artisanat */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Catégories d'artisanat
            </h2>
          </div>
          <button 
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="flex items-center text-sm font-medium hover:underline"
            style={{ color: '#556B2F' }}
          >
            {showAllCategories ? 'Voir moins' : 'Voir plus'}
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
              style={{
                borderColor: '#D3D3D3',
                backgroundColor: 'white',
              }}
              onClick={() => handleViewCategory(category)}
            >
              <div className="mb-4" style={{ color: '#8B4513' }}>
                {category.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{category.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <BookOpen size={14} className="mr-1" />
                  {countArtisansByCategory(category.slug)} artisans
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewCategory(category);
                  }}
                  className="px-2 py-1 rounded text-xs font-medium flex items-center hover:bg-[#485826] transition-colors"
                  style={{ backgroundColor: '#6B8E23', color: 'white' }}
                >
                  <Eye size={12} className="mr-1" />
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Barre de recherche */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un artisan..."
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

      {/* Section des artisans */}
      <div className="mb-12" id="artisans-section">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Award size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              {selectedCategory ? `Artisans - ${selectedCategory.name}` : 'Nos artisans'}
            </h2>
            {loading && (
              <div className="ml-4 flex items-center text-gray-500">
                <RefreshCw size={16} className="animate-spin mr-2" />
                <span className="text-sm">Chargement...</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowAllArtisans(!showAllArtisans)}
            className="flex items-center px-4 py-2 rounded-md border font-medium hover:bg-[#556B2F] hover:text-white transition-colors"
            style={{ borderColor: '#556B2F', color: '#556B2F' }}
          >
            <Users size={18} className="mr-2" />
            {showAllArtisans ? '' : 'Voir tous les artisans'}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : displayedArtisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedArtisans.map((artisan) => (
              <div
                key={artisan.id}
                className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow group"
                style={{ borderColor: '#D3D3D3' }}
              >
                <div className="h-48 overflow-hidden relative">
                  {artisan.avatar ? (
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/id/225/300/200';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#F5F5DC] to-[#D3D3D3] flex items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2" style={{ color: '#8B4513' }}>
                          {getCategoryIcon(artisan.metiers || [])}
                        </div>
                        <span className="font-bold" style={{ color: '#556B2F' }}>
                          {artisan.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{artisan.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={16} className="mr-1" />
                        {artisan.city || 'Non spécifié'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 hover:bg-[#556B2F] hover:text-white transition-colors cursor-pointer"
                          style={{ backgroundColor: '#F0F0F0', color: '#556B2F' }}>
                      <Tag size={14} className="mr-1" />
                      {artisan.specialty || 'Artisan'}
                    </span>
                    <p className="text-gray-600">
                      {artisan.metiers?.map(m => m.name).join(', ') || 'Artisan spécialisé'}
                    </p>
                  </div>
                  
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewProfile(artisan.id)}
                      className="flex-1 py-2 rounded-md border text-center font-medium flex items-center justify-center hover:bg-[#556B2F] hover:text-white transition-colors duration-300"
                      style={{ borderColor: '#556B2F', color: '#556B2F' }}
                    >
                      <Eye size={18} className="mr-2" />
                      voir le profil
                    </button>
                    <button 
                      onClick={() => onContactClick && onContactClick(`Contact: ${artisan.name}`, artisan.name)}
                      className="flex-1 py-2 rounded-md text-white font-medium flex items-center justify-center hover:bg-[#485826] transition-colors duration-200"
                      style={{ backgroundColor: '#556B2F' }}
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
            <Target size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun artisan trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory 
                ? `Aucun artisan spécialisé en "${selectedCategory.name}" n'a été trouvé.`
                : 'Aucun artisan ne correspond à vos critères de recherche.'
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
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 py-2 rounded-md bg-[#556B2F] text-white font-medium hover:bg-[#485826] transition-colors"
                >
                  Voir tous les artisans
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Détail Artisan */}
      {showArtisanDetail && selectedArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header du modal */}
            <div className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white bg-white flex items-center justify-center">
                  {selectedArtisan.avatar ? (
                    <img 
                      src={selectedArtisan.avatar} 
                      alt={selectedArtisan.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Target size={32} style={{ color: '#8B4513' }} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedArtisan.name}</h2>
                  
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowArtisanDetail(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne gauche */}
                <div className="lg:col-span-2">
                  {/* À propos */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#8B4513' }}>
                      <Info size={20} className="mr-2" />
                      À propos de l'artisan
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {selectedArtisan.bio || `${selectedArtisan.name} est un artisan spécialisé dans ${selectedArtisan.specialty || "l'artisanat"}.`}
                    </p>
                  </div>

                  {/* Métiers */}
                  {selectedArtisan.metiers && selectedArtisan.metiers.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Spécialités</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtisan.metiers.map((metier) => (
                          <span 
                            key={metier.id}
                            className="px-3 py-2 rounded-lg text-sm font-medium"
                            style={{ 
                              backgroundColor: '#F0EAD6',
                              color: '#556B2F',
                              border: '1px solid #D3D3D3'
                            }}
                          >
                            {metier.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Colonne droite - Contact et actions */}
                <div>
                  {/* Contact */}
                  <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
                    <h3 className="font-bold mb-3" style={{ color: '#8B4513' }}>Contact</h3>
                    <div className="space-y-3">
                      {selectedArtisan.email && (
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2" style={{ color: '#8B4513' }} />
                          <span className="text-sm">{selectedArtisan.email}</span>
                        </div>
                      )}
                      {selectedArtisan.phone && (
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2" style={{ color: '#8B4513' }} />
                          <span className="text-sm">{selectedArtisan.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleViewProfile(selectedArtisan.id)}
                      className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center hover:bg-[#7a3b0f] transition-colors"
                      style={{ backgroundColor: '#8B4513' }}
                    >
                      <Eye size={20} className="mr-2" />
                      Voir le profil complet
                    </button>
                    <button 
                      onClick={() => onContactClick && onContactClick(`Devis: ${selectedArtisan.name}`, selectedArtisan.name)}
                      className="w-full py-3 rounded-lg border font-medium hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#556B2F', color: '#556B2F' }}
                    >
                      Demander un devis sur mesure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default ArtisanatPage;