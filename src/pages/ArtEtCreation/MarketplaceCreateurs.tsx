import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search,  
  MapPin, 
  Calendar, 
  ShoppingCart,
  Eye,
  RefreshCw,
  TrendingUp,
  Award,
  Palette,
  Camera,
  Hammer,
  Target,
  ChevronDown,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  AlertCircle,
  Loader2,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useCart } from '@/components/contexts/CartContext'; // Import du contexte panier
import { toast } from 'sonner'; // Pour les notifications

interface Oeuvre {
  id: string;
  title: string;
  description?: string;
  image: string;
  images?: string[];
  price: number;
  createdAt?: string;
  publishedAt?: string;
  artist?: string;
  category?: string;
  type: string;
  userId: string;
  professional?: {
    id: string;
    name: string;
    avatar?: string;
    city?: string;
  };
  dimensions?: {
    creationDate?: string;
    dimensions?: string;
    materials?: string;
    isArtwork?: boolean;
  };
  views?: number;
  likes?: number;
  status: 'published' | 'draft' | 'sold';
  quantity?: number; // Pour le stock
}

interface FilterOptions {
  type: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  category: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

const MarketplaceCreateurs: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [oeuvres, setOeuvres] = useState<Oeuvre[]>([]);
  const [filteredOeuvres, setFilteredOeuvres] = useState<Oeuvre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedOeuvres, setLikedOeuvres] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [addingOeuvreId, setAddingOeuvreId] = useState<string | null>(null); // Pour le bouton loading

  const itemsPerPage = 12;
  const navigate = useNavigate();
  const { addToCart, cartItems, isLoading: cartLoading } = useCart(); // Utilisation du contexte panier

  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    minPrice: 0,
    maxPrice: 10000,
    location: '',
    category: 'all',
    sortBy: 'newest'
  });

  const oeuvreTypes = [
    { id: 'all', name: 'Toutes les œuvres', icon: <Grid size={20} />, color: '#8B4513' },
    { id: 'photographie', name: 'Photographie', icon: <Camera size={20} />, color: '#3B82F6' },
    { id: 'sculpture', name: 'Sculpture', icon: <Hammer size={20} />, color: '#F59E0B' },
    { id: 'peinture', name: 'Peinture', icon: <Palette size={20} />, color: '#EF4444' },
    { id: 'artisanat', name: 'Artisanat', icon: <Target size={20} />, color: '#10B981' }
  ];

  const fetchAllOeuvres = useCallback(async () => {
    console.log('📡 Fetching all published artworks...');
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page,
        limit: itemsPerPage
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (filters.location) {
        params.location = filters.location;
      }
      
      if (filters.type !== 'all') {
        params.type = filters.type;
      }
      
      if (filters.category !== 'all') {
        params.category = filters.category;
      }
      
      console.log('🌐 API params:', params);
      
      const response = await api.get('/art-creation/marketplace/all', { params });
      
      console.log('📦 API response:', {
        success: response.data.success,
        count: response.data.count,
        total: response.data.total,
        dataLength: response.data.data?.length || 0
      });
      
      if (response.data?.success) {
        const allOeuvres = response.data.data || [];
        
        // S'assurer que chaque œuvre a une quantité par défaut
        const formattedOeuvres = allOeuvres.map((oeuvre: any) => ({
          ...oeuvre,
          quantity: 1, // Par défaut en stock
          images: oeuvre.images || [oeuvre.image],
          dimensions: {
            ...oeuvre.dimensions,
            isArtwork: true
          }
        }));
        
        setOeuvres(formattedOeuvres);
        setFilteredOeuvres(formattedOeuvres);
        setTotalCount(response.data.total || 0);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(response.data.error || 'Impossible de charger les œuvres');
      }
    } catch (err: any) {
      console.error('❌ Error fetching marketplace artworks:', err);
      
      try {
        console.log('🔄 Trying alternative API call...');
        const fallbackResponse = await api.get('/art-creation/products', {
          params: {
            status: 'published',
            limit: itemsPerPage,
            page: page
          }
        });
        
        if (fallbackResponse.data?.success) {
          const data = fallbackResponse.data.data || [];
          const formattedOeuvres = data.map((product: any) => ({
            id: product.id,
            title: product.title || product.name,
            description: product.description,
            image: product.images?.[0] || '',
            images: product.images,
            price: product.price,
            createdAt: product.createdAt,
            publishedAt: product.publishedAt,
            type: product.type || product.subcategory,
            category: product.category,
            userId: product.userId,
            artist: product.user?.name || 
                   `${product.user?.firstName} ${product.user?.lastName}`.trim(),
            professional: {
              id: product.userId,
              name: product.user?.name || 
                    `${product.user?.firstName} ${product.user?.lastName}`.trim(),
              avatar: product.user?.avatar,
              city: product.user?.city
            },
            status: product.status,
            quantity: 1, // Stock par défaut
            dimensions: {
              isArtwork: true,
              type: product.type || product.subcategory,
              category: product.category
            }
          }));
          
          setOeuvres(formattedOeuvres);
          setFilteredOeuvres(formattedOeuvres);
          setTotalCount(fallbackResponse.data.total || formattedOeuvres.length);
          setTotalPages(fallbackResponse.data.pagination?.totalPages || 1);
        }
      } catch (fallbackErr: any) {
        console.error('❌ Fallback also failed:', fallbackErr);
        setError('La galerie Marketplace est temporairement indisponible. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filters]);

  const applyLocalFilters = useCallback(() => {
    let filtered = [...oeuvres];
    
    filtered = filtered.filter(oeuvre => 
      oeuvre.price >= filters.minPrice && oeuvre.price <= filters.maxPrice
    );
    
    if (filters.location && !searchTerm.includes(filters.location)) {
      filtered = filtered.filter(oeuvre => 
        oeuvre.professional?.city?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
    }
    
    setFilteredOeuvres(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [oeuvres, filters, searchTerm]);

  useEffect(() => {
    if (oeuvres.length > 0) {
      applyLocalFilters();
    }
  }, [filters, applyLocalFilters, oeuvres]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchAllOeuvres();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.location, filters.type, filters.category, fetchAllOeuvres]);

  const handleLikeOeuvre = useCallback((oeuvreId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedOeuvres(prev => 
      prev.includes(oeuvreId) 
        ? prev.filter(id => id !== oeuvreId)
        : [...prev, oeuvreId]
    );
  }, []);

  const handleViewDetails = useCallback((oeuvre: Oeuvre) => {
    navigate(`/oeuvre/${oeuvre.id}`, {
      state: {
        oeuvre,
        professionalId: oeuvre.userId,
        professionalName: oeuvre.professional?.name
      }
    });
  }, [navigate]);

  const handleViewProfessional = useCallback((professionalId: string, professionalName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/professional/${professionalId}`, {
      state: {
        professionalName: professionalName
      }
    });
  }, [navigate]);

  const handleBuyOeuvre = useCallback(async (oeuvre: Oeuvre, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingOeuvreId(oeuvre.id);
    
    try {
      // Vérifier la disponibilité de l'œuvre
      const stockCheck = await api.post('/cart/check-artwork', {
        productId: oeuvre.id,
        quantity: 1
      });
      
      if (!stockCheck.data.available) {
        toast.error(`L'œuvre "${oeuvre.title}" n'est plus disponible.${stockCheck.data.message ? '\n' + stockCheck.data.message : ''}`);
        return;
      }
      
      // Vérifier si l'œuvre est déjà dans le panier
      const alreadyInCart = cartItems.some(item => item.id === oeuvre.id);
      if (alreadyInCart) {
        toast.warning(`"${oeuvre.title}" est déjà dans votre panier`);
        return;
      }
      
      // Préparer l'objet pour le panier (identique à votre système produit)
      const productToAdd = {
        id: oeuvre.id,
        name: oeuvre.title,
        description: oeuvre.description,
        price: oeuvre.price,
        image: oeuvre.image,
        images: oeuvre.images || [oeuvre.image],
        quantity: 1,
        
        // Propriétés spécifiques pour les œuvres d'art
        itemType: 'product',
        productType: 'artwork',
        trackQuantity: true,
        sellerId: oeuvre.userId,
        
        // Informations artistiques
        dimensions: {
          isArtwork: true,
          type: oeuvre.type,
          category: oeuvre.category,
          creationDate: oeuvre.dimensions?.creationDate,
          materials: oeuvre.dimensions?.materials,
          artistName: oeuvre.artist
        },
        
        // Informations du vendeur
        vendor: {
          id: oeuvre.userId,
          companyName: oeuvre.professional?.name || oeuvre.artist,
          city: oeuvre.professional?.city
        },
        
        // Pour la validation du panier
        status: 'published',
        available: true
      };
      
      // Ajouter au panier
      await addToCart(productToAdd);
      
      // Petit délai pour laisser le temps à l'état de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Message de confirmation
      toast.success(`"${oeuvre.title}" ajoutée au panier !`, {
        description: `Prix: ${formatPrice(oeuvre.price)}`,
        action: {
          label: 'Voir le panier',
          onClick: () => navigate('/panier')
        }
      });
      
    } catch (error: any) {
      console.error('❌ Erreur ajout au panier:', error);
      toast.error(error?.message || "Erreur lors de l'ajout au panier");
    } finally {
      setAddingOeuvreId(null);
    }
  }, [addToCart, cartItems, navigate]);

  const handleViewArtworks = useCallback((professionalId: string, professionalName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/oeuvres/${professionalId}`, {
      state: {
        professionalName: professionalName
      }
    });
  }, [navigate]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      type: 'all',
      minPrice: 0,
      maxPrice: 10000,
      location: '',
      category: 'all',
      sortBy: 'newest'
    });
    setSearchTerm('');
    setPage(1);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photographie': return <Camera size={16} />;
      case 'sculpture': return <Hammer size={16} />;
      case 'peinture': return <Palette size={16} />;
      case 'artisanat': return <Target size={16} />;
      default: return <ImageIcon size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photographie': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sculpture': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'peinture': return 'bg-red-100 text-red-700 border-red-200';
      case 'artisanat': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: totalCount,
    photographie: oeuvres.filter(o => o.type === 'photographie').length,
    sculpture: oeuvres.filter(o => o.type === 'sculpture').length,
    peinture: oeuvres.filter(o => o.type === 'peinture').length,
    artisanat: oeuvres.filter(o => o.type === 'artisanat').length,
    averagePrice: oeuvres.length > 0 
      ? Math.round(oeuvres.reduce((sum, o) => sum + o.price, 0) / oeuvres.length)
      : 0
  };

  useEffect(() => {
    fetchAllOeuvres();
  }, [page, fetchAllOeuvres]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-2">
                Marketplace des Œuvres d'Art
              </h1>
              <p className="text-gray-600">
                Découvrez et achetez des œuvres uniques d'artistes talentueux
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#8B4513]">{stats.total}</div>
                <div className="text-sm text-gray-600">Œuvres disponibles</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#8B4513] flex items-center justify-center">
                <Award size={24} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="h-1 w-20 bg-[#8B4513] rounded-full"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-300 bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="mr-2 text-red-600" />
              <div className="flex-1">
                <p className="text-red-600 font-medium">{error}</p>
                <p className="text-red-500 text-sm mt-1">
                  Vérifiez votre connexion ou réessayez plus tard.
                </p>
              </div>
              <button 
                onClick={() => {
                  setError(null);
                  fetchAllOeuvres();
                }}
                className="ml-4 flex items-center px-3 py-2 rounded-md text-sm bg-[#8B4513] text-white hover:bg-[#7a3b0f] transition-colors"
              >
                <RefreshCw size={14} className="mr-1" />
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!loading && !error && oeuvres.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Photographie', count: stats.photographie, color: '#3B82F6', icon: Camera },
              { label: 'Sculpture', count: stats.sculpture, color: '#F59E0B', icon: Hammer },
              { label: 'Peinture', count: stats.peinture, color: '#EF4444', icon: Palette },
              { label: 'Artisanat', count: stats.artisanat, color: '#10B981', icon: Target },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                         style={{ backgroundColor: `${stat.color}15` }}>
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stat.count}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une œuvre, un artiste, un style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 transition-all bg-white"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              {/* Dropdown pour le filtre de type */}
              <div className="relative">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full md:w-auto pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20 appearance-none bg-white"
                >
                  {oeuvreTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#8B4513] mx-auto mb-4" />
                <p className="text-gray-600">Chargement des œuvres...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-white/50">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Impossible de charger les œuvres
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={fetchAllOeuvres}
                className="px-6 py-3 rounded-xl bg-[#8B4513] text-white font-medium hover:bg-[#7a3b0f] transition-colors inline-flex items-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Réessayer
              </button>
            </div>
          ) : filteredOeuvres.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  {totalCount} œuvre{totalCount > 1 ? 's' : ''} trouvée{totalCount > 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#8B4513] text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#8B4513] text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredOeuvres.map((oeuvre) => (
                    <div
                      key={oeuvre.id}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleViewDetails(oeuvre)}
                    >
                      <div className="relative h-56 bg-gray-100 overflow-hidden">
                        <img
                          src={oeuvre.image || 'https://via.placeholder.com/400x300?text=Image+indisponible'}
                          alt={oeuvre.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+indisponible';
                          }}
                        />
                        
                        <div className="absolute top-3 left-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/90 flex items-center gap-1.5 ${getTypeColor(oeuvre.type)}`}>
                            {getTypeIcon(oeuvre.type)}
                            <span className="capitalize">{oeuvre.type}</span>
                          </div>
                        </div>
                        
                        {/* Badge prix */}
                        <div className="absolute bottom-3 right-3">
                          <div className="px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                            <span className="font-bold text-lg text-[#8B4513]">
                              {formatPrice(oeuvre.price)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Badge vendu si quantity = 0 */}
                        {oeuvre.quantity === 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Vendu
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                          {oeuvre.title}
                        </h3>
                        
                        {oeuvre.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {oeuvre.description}
                          </p>
                        )}
                        
                        {oeuvre.professional && (
                          <div 
                            className="flex items-center mb-3 group/artist"
                            onClick={(e) => handleViewProfessional(oeuvre.professional!.id, oeuvre.professional!.name, e)}
                          >
                            {oeuvre.professional.avatar && (
                              <img
                                src={oeuvre.professional.avatar}
                                alt={oeuvre.professional.name}
                                className="w-8 h-8 rounded-full mr-2 border border-gray-200"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 group-hover/artist:text-[#8B4513] transition-colors truncate">
                                {oeuvre.professional.name}
                              </div>
                              {oeuvre.professional.city && (
                                <div className="text-xs text-gray-500 flex items-center">
                                  <MapPin size={12} className="mr-1" />
                                  <span className="truncate">{oeuvre.professional.city}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(oeuvre.createdAt)}
                          </div>
                          {oeuvre.category && (
                            <div className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-700 truncate max-w-[120px]">
                              {oeuvre.category}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (oeuvre.professional) {
                                handleViewArtworks(oeuvre.professional.id, oeuvre.professional.name, e);
                              }
                            }}
                            className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
                          >
                            <Eye size={14} className="mr-2" />
                            Plus d'œuvres
                          </button>
                          <button
                            onClick={(e) => handleBuyOeuvre(oeuvre, e)}
                            disabled={cartLoading || addingOeuvreId === oeuvre.id || oeuvre.quantity === 0}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center text-sm ${
                              addingOeuvreId === oeuvre.id
                                ? 'bg-[#6B8E23] text-white cursor-wait'
                                : oeuvre.quantity === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#8B4513] text-white hover:bg-[#7a3b0f]'
                            }`}
                          >
                            {addingOeuvreId === oeuvre.id ? (
                              <>
                                <Loader2 size={14} className="mr-2 animate-spin" />
                                Ajout...
                              </>
                            ) : oeuvre.quantity === 0 ? (
                              <>
                                <ShoppingCart size={14} className="mr-2" />
                                Vendu
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={14} className="mr-2" />
                                Ajouter au panier
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOeuvres.map((oeuvre) => (
                    <div
                      key={oeuvre.id}
                      className="group bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => handleViewDetails(oeuvre)}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 relative h-48 md:h-auto overflow-hidden">
                          <img
                            src={oeuvre.image || 'https://via.placeholder.com/400x300?text=Image+indisponible'}
                            alt={oeuvre.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/90 flex items-center gap-1.5 ${getTypeColor(oeuvre.type)}`}>
                              {getTypeIcon(oeuvre.type)}
                              <span className="capitalize">{oeuvre.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {oeuvre.title}
                              </h3>
                              {oeuvre.description && (
                                <p className="text-gray-600 mb-3 line-clamp-2">
                                  {oeuvre.description}
                                </p>
                              )}
                              
                              {oeuvre.professional && (
                                <div className="flex items-center mb-2">
                                  {oeuvre.professional.avatar && (
                                    <img
                                      src={oeuvre.professional.avatar}
                                      alt={oeuvre.professional.name}
                                      className="w-8 h-8 rounded-full mr-2 border border-gray-200"
                                    />
                                  )}
                                  <div>
                                    <div 
                                      className="font-medium text-gray-900 hover:text-[#8B4513] transition-colors cursor-pointer"
                                      onClick={(e) => handleViewProfessional(oeuvre.professional!.id, oeuvre.professional!.name, e)}
                                    >
                                      {oeuvre.professional.name}
                                    </div>
                                    {oeuvre.professional.city && (
                                      <div className="text-sm text-gray-500 flex items-center">
                                        <MapPin size={14} className="mr-1" />
                                        {oeuvre.professional.city}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-2xl font-bold text-[#8B4513] ml-4">
                              {formatPrice(oeuvre.price)}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {formatDate(oeuvre.createdAt)}
                              </div>
                              {oeuvre.category && (
                                <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                  {oeuvre.category}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (oeuvre.professional) {
                                  handleViewArtworks(oeuvre.professional.id, oeuvre.professional.name, e);
                                }
                              }}
                              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Voir toutes les œuvres
                            </button>
                            <button
                              onClick={(e) => handleBuyOeuvre(oeuvre, e)}
                              disabled={cartLoading || addingOeuvreId === oeuvre.id || oeuvre.quantity === 0}
                              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                                addingOeuvreId === oeuvre.id
                                  ? 'bg-[#6B8E23] text-white cursor-wait'
                                  : oeuvre.quantity === 0
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#8B4513] text-white hover:bg-[#7a3b0f]'
                              }`}
                            >
                              {addingOeuvreId === oeuvre.id ? (
                                <>
                                  <Loader2 size={18} className="mr-2 animate-spin" />
                                  Ajout...
                                </>
                              ) : oeuvre.quantity === 0 ? (
                                <>
                                  <ShoppingCart size={18} className="mr-2" />
                                  Vendu
                                </>
                              ) : (
                                <>
                                  <ShoppingCart size={18} className="mr-2" />
                                  Ajouter au panier
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            page === pageNum
                              ? 'bg-[#8B4513] text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-white/50">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Aucune œuvre trouvée
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Aucune œuvre ne correspond à vos critères de recherche.
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-xl bg-[#8B4513] text-white font-medium hover:bg-[#7a3b0f] transition-colors inline-flex items-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCreateurs;