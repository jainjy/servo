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
  Briefcase
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
  searchQuery?: string;
  onContactClick?: (subject: string, recipientName?: string) => void;
}

const PeinturePage: React.FC<PeinturePageProps> = ({ searchQuery, onContactClick }) => {
  const [showPaintingDetail, setShowPaintingDetail] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [showAllPaintings, setShowAllPaintings] = useState(false);
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [likedPaintings, setLikedPaintings] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  // États pour l'API
  const [loading, setLoading] = useState(true);
  const [painters, setPainters] = useState<Professional[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  
  const navigate = useNavigate();

  // Types de peinture avec keywords pour le filtrage
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

  // Fonction pour récupérer les peintres depuis l'API
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

  // Fonction pour compter les peintres par catégorie
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

  // Fonction pour explorer un style
  const handleExploreStyle = useCallback((style) => {
    setSelectedStyle(style);
    // Filtrer les peintres par style
    const filteredPainters = painters.filter(painter => {
      const hasMatchingMetier = painter.metiers?.some(metier => 
        style.keywords.some(keyword => 
          metier.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const hasMatchingSpecialty = painter.specialty && 
        style.keywords.some(keyword => 
          painter.specialty.toLowerCase().includes(keyword.toLowerCase())
        );
      
      return hasMatchingMetier || hasMatchingSpecialty;
    });
    
    // Scroll vers la section des artistes
    setTimeout(() => {
      document.getElementById('artists-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  }, [painters]);

  // Fonction pour recharger les données
  const handleRetry = useCallback(() => {
    console.log('🔄 Retry loading data');
    setError(null);
    fetchPainters();
  }, [fetchPainters]);

  // Fonction pour voir le profil
  const handleViewProfile = useCallback((id: string) => {
    navigate(`/professional/${id}`);
  }, [navigate]);

  // Fonction pour liker une peinture (fonctionnalité frontend seulement)
  const handleLikePainting = (paintingId) => {
    if (likedPaintings.includes(paintingId)) {
      setLikedPaintings(likedPaintings.filter(id => id !== paintingId));
    } else {
      setLikedPaintings([...likedPaintings, paintingId]);
    }
  };

  // Fonction pour partager une peinture
  const handleSharePainting = (painting) => {
    if (navigator.share) {
      navigator.share({
        title: painting.title,
        text: painting.description || `Découvrez "${painting.title}" par ${painting.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

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

  // Déterminer quel peintres afficher
  const displayedPainters = showAllArtists ? painters : painters.slice(0, 3);

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

      {/* Recherche et filtres */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un peintre..."
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

      {/* Painting Styles */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
            Styles et techniques
          </h2>
          <button 
            onClick={() => setSelectedStyle(null)}
            className="text-sm font-medium hover:underline"
            style={{ color: '#556B2F' }}
          >
            Tout voir
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {paintingStyles.map((style) => (
            <div
              key={style.id}
              className="text-center group cursor-pointer"
              onClick={() => handleExploreStyle(style)}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform border-4 hover:border-[#556B2F]"
                style={{ 
                  backgroundColor: style.color,
                  borderColor: selectedStyle?.id === style.id ? '#556B2F' : 'transparent'
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

      {/* Featured Paintings */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
            Œuvres du moment
          </h2>
          <button 
            onClick={() => setShowAllPaintings(!showAllPaintings)}
            className="flex items-center px-4 py-2 rounded-md border font-medium hover:bg-[#556B2F] hover:text-white transition-colors"
            style={{ borderColor: '#556B2F', color: '#556B2F' }}
          >
            {showAllPaintings ? 'Voir moins' : 'Voir toutes les œuvres'}
            <ChevronRight size={18} className="ml-2" />
          </button>
        </div>
        {/* Votre section des œuvres reste ici */}
      </div>

      {/* Artists Section - AVEC DONNÉES RÉELLES DE L'API */}
      <div className="mb-12" id="artists-section">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Award size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              {selectedStyle ? `Peintres - ${selectedStyle.name}` : 'Nos peintres'}
            </h2>
            {loading && (
              <div className="ml-4 flex items-center text-gray-500">
                <RefreshCw size={16} className="animate-spin mr-2" />
                <span className="text-sm">Chargement...</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowAllArtists(!showAllArtists)}
            className="flex items-center text-sm font-medium hover:underline"
            style={{ color: '#556B2F' }}
          >
            {showAllArtists ? 'Voir moins' : 'Voir tous les peintres'}
            <ChevronRight size={16} className="ml-1" />
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
        ) : displayedPainters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedPainters.map((painter) => (
              <div
                key={painter.id}
                className="p-6 rounded-lg border hover:shadow-lg transition-shadow group bg-white"
                style={{ borderColor: '#D3D3D3' }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 flex-shrink-0"
                    style={{ borderColor: '#556B2F' }}>
                    {painter.avatar ? (
                      <img
                        src={painter.avatar}
                        alt={painter.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                <Palette size={24} style="color: #8B4513" />
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Palette size={24} style={{ color: '#8B4513' }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    
                    <p className="text-gray-600 text-sm mb-2 truncate">
                      {painter.specialty || 'Peintre'}
                    </p>
                    <div className="flex items-center mb-2">
                      <MapPin size={14} className="mr-1 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {painter.city || 'Non spécifié'}
                      </span>
                    </div>
                    {painter.metiers && painter.metiers.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {painter.metiers.slice(0, 2).map((metier) => (
                          <span
                            key={metier.id}
                            className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {metier.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm font-medium">
                      {painter.works || Math.floor(Math.random() * 30) + 5} œuvres
                    </span>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={() => handleViewProfile(painter.id)}
                      className="px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                      style={{ border: '1px solid #556B2F', color: '#556B2F' }}
                    >
                      <Eye size={14} className="inline mr-1" />
                      Profil
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  
                  <button 
                    onClick={() => onContactClick && onContactClick(`Demande peinture: ${painter.name}`, painter.name)}
                    className="px-4 py-2 rounded-md text-sm font-medium hover:bg-[#485826] transition-colors flex items-center"
                    style={{ backgroundColor: '#6B8E23', color: 'white' }}
                  >
                    <Mail size={14} className="mr-2" />
                    Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-[#D3D3D3] rounded-lg">
            <Palette size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun peintre trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedStyle 
                ? `Aucun peintre spécialisé en "${selectedStyle.name}" n'a été trouvé.`
                : 'Aucun peintre ne correspond à vos critères de recherche.'
              }
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-md border border-[#556B2F] text-[#556B2F] font-medium hover:bg-gray-50 transition-colors"
              >
                Réessayer
              </button>
              {selectedStyle && (
                <button
                  onClick={() => setSelectedStyle(null)}
                  className="px-4 py-2 rounded-md bg-[#556B2F] text-white font-medium hover:bg-[#485826] transition-colors"
                >
                  Voir tous les peintres
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeinturePage;