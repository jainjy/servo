import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  Search, Plus, Edit3, Trash2, Palette, Camera, 
  Cpu, Mountain, Filter, BarChart3, Calendar, 
  User, CheckCircle, Clock, AlertCircle, DollarSign,
  Tag, Layers, ShoppingCart, Mail, TrendingUp, 
  X, FileSearch, Sparkles, Eye as EyeIcon
} from 'lucide-react';
import { ProductCreateModal } from './ProductCreateModal';
import { useToast } from '@/hooks/use-toast';

// Types compatibles avec ProductCreateModal
interface ArtProduct {
  id: number | string;
  title: string;
  name: string;
  type: 'photographie' | 'sculpture' | 'peinture' | 'artisanat' | string;
  category: string;
  status: 'published' | 'draft' | 'sold' | string;
  price: number;
  description: string;
  artist?: string;
  creationDate?: string;
  images?: string[];
  dimensions?: {
    creationDate?: string;
    dimensions?: string;
    materials?: string;
    [key: string]: string | undefined;
  };
  views?: number;
  likes?: number;
  userId?: string;
  slug?: string;
  createdAt?: string;
  publishedAt?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    companyName?: string;
    commercialName?: string;
  };
}

interface Reservation {
  id: number | string;
  productId: number | string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  date: string;
  price: number;
  commission?: number;
  notes?: string;
}

// Catégories correspondant à ProductCreateModal
const TYPE_LABELS: Record<string, string> = {
  'photographie': 'Photographie',
  'sculpture': 'Sculpture',
  'peinture': 'Peinture',
  'artisanat': 'Artisanat'
};

const STATUS_OPTIONS = [
  { value: 'published', label: 'Publié' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'sold', label: 'Vendu' }
] as const;

const ArtCreationProduct: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ArtProduct[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingInitial, setEditingInitial] = useState<any | undefined>(undefined);
  const { toast } = useToast();

  const currentUserId = typeof window !== 'undefined' ? (localStorage.getItem('userId') || 'votre-user-id-ici') : 'votre-user-id-ici';
  const apiBase = 'http://localhost:3001';

  // Thème personnalisé
  const theme = {
    logo: '#556B2F',
    primaryDark: '#6B8E23',
    lightBg: '#FFFFFF',
    separator: '#D3D3D3',
    secondaryText: '#8B4513'
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      
      const res = await fetch(`${apiBase}/api/art-creation/products`, {
        headers: token ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {},
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }
      
      const response = await res.json();
      const productsData = response.data || [];
      
      // Formater les produits pour correspondre à l'interface ArtProduct
      const mapped: ArtProduct[] = productsData.map((p: any) => ({
        id: p.id,
        title: p.name || p.title || 'Sans titre',
        name: p.name || p.title || 'Sans titre',
        type: p.type || p.subcategory || '',
        category: p.category || '',
        status: p.status || 'draft',
        price: p.price || 0,
        description: p.description || '',
        artist: p.user?.firstName ? `${p.user.firstName} ${p.user.lastName || ''}`.trim() : 
                p.user?.companyName || p.user?.commercialName || 'Artiste',
        creationDate: p.dimensions?.creationDate || p.dimensions?.date || p.createdAt || '',
        images: Array.isArray(p.images) ? p.images.map((img: string) => 
          img.startsWith('http') ? img : `${apiBase}${img}`
        ) : [],
        dimensions: p.dimensions || {},
        views: p.viewCount || Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 100),
        userId: p.userId,
        slug: p.slug,
        createdAt: p.createdAt,
        publishedAt: p.publishedAt,
        user: p.user
      }));
      
      setProducts(mapped);
      
      // Simuler des réservations pour la démo
      
      
    } catch (err: any) {
      console.error('fetchProducts error', err);
      toast({ 
        title: 'Erreur', 
        description: err?.message || 'Impossible de charger les œuvres', 
        variant: 'destructive' 
      });
      setProducts([]);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { 
    if (showModal === false) {
      fetchProducts(); 
    }
  }, [fetchProducts, showModal]);

  const filteredProducts = useMemo(() => products.filter(product => {
    const matchesSearch = (product.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.artist || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }), [products, searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    published: products.filter(p => p.status === 'published').length,
    draft: products.filter(p => p.status === 'draft').length,
    sold: products.filter(p => p.status === 'sold').length,
    totalRevenue: reservations
      .filter(r => r.status === 'completed' || r.status === 'confirmed')
      .reduce((sum, r) => sum + r.price, 0)
  }), [products, reservations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return { 
          bg: 'bg-green-50', 
          text: 'text-green-700', 
          border: 'border-green-200',
          darkBg: 'bg-green-500/10',
          darkText: 'text-green-600',
          label: 'Publié'
        };
      case 'draft':
        return { 
          bg: 'bg-yellow-50', 
          text: 'text-yellow-700', 
          border: 'border-yellow-200',
          darkBg: 'bg-yellow-500/10',
          darkText: 'text-yellow-600',
          label: 'Brouillon'
        };
      case 'sold':
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-700', 
          border: 'border-blue-200',
          darkBg: 'bg-blue-500/10',
          darkText: 'text-blue-600',
          label: 'Vendu'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-700', 
          border: 'border-gray-200',
          darkBg: 'bg-gray-500/10',
          darkText: 'text-gray-600',
          label: status
        };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photographie':
        return { 
          bg: 'bg-blue-500/10', 
          text: 'text-blue-600',
          icon: Camera
        };
      case 'sculpture':
        return { 
          bg: 'bg-amber-500/10', 
          text: 'text-amber-600',
          icon: Mountain
        };
      case 'peinture':
        return { 
          bg: 'bg-red-500/10', 
          text: 'text-red-600',
          icon: Palette
        };
      case 'artisanat':
        return { 
          bg: 'bg-green-500/10', 
          text: 'text-green-600',
          icon: Layers
        };
      default:
        return { 
          bg: 'bg-gray-500/10', 
          text: 'text-gray-600',
          icon: Cpu
        };
    }
  };

  const getReservationStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Confirmée' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'En attente' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Annulée' };
      case 'completed':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle, label: 'Terminée' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle, label: status };
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Confirmer la suppression de cette œuvre ? Cette action est irréversible.')) return;
    
    try {
      const token = localStorage.getItem('auth-token') || 
                    localStorage.getItem('token') || 
                    sessionStorage.getItem('token');
      
      if (!token) {
        toast({ 
          title: 'Authentification requise', 
          description: 'Veuillez vous reconnecter',
          variant: 'destructive' 
        });
        return;
      }
      
      const res = await fetch(`${apiBase}/api/art-creation/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur de suppression');
      }
      
      toast({ 
        title: 'Supprimé', 
        description: "L'œuvre a été supprimée avec succès" 
      });
      
      setProducts(prev => prev.filter(p => p.id !== id));
      
    } catch (err: any) {
      console.error('delete error', err);
      toast({ 
        title: 'Erreur', 
        description: err?.message || 'Impossible de supprimer l\'œuvre', 
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (product: ArtProduct) => {
    const initial = {
      name: product.name || product.title,
      description: product.description || '',
      type: product.type || '',
      category: product.category || '',
      price: product.price || 0,
      status: product.status as 'published' | 'draft' | 'sold',
      images: product.images || [],
      dimensions: product.dimensions || {
        creationDate: product.creationDate,
        dimensions: '',
        materials: ''
      },
      userId: product.userId || currentUserId,
      id: product.id
    };
    setEditingInitial(initial);
    setShowModal(true);
  };

  const onModalSuccess = () => {
    setShowModal(false);
    setEditingInitial(undefined);
    fetchProducts();
  };

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Section titre et statistiques */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6" 
               style={{ 
                 border: `1px solid ${theme.separator}`,
                 background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)'
               }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: `${theme.logo}15` }}>
                    <Palette size={24} style={{ color: theme.logo }} />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ color: theme.secondaryText }}>
                      Mes Créations Artistiques
                    </h1>
                    <p className="text-gray-600 mt-1">Gérez vos œuvres d'art et artisanat</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => { 
                  setEditingInitial(undefined); 
                  setShowModal(true); 
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 group"
                style={{ 
                  backgroundColor: theme.logo,
                  color: 'white'
                }}
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Nouvelle œuvre</span>
              </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { 
                  label: 'Total œuvres', 
                  value: stats.total, 
                  color: theme.logo, 
                  icon: BarChart3 
                },
                { 
                  label: 'Publiées', 
                  value: stats.published, 
                  color: '#10B981', 
                  icon: EyeIcon 
                },
                { 
                  label: 'Brouillons', 
                  value: stats.draft, 
                  color: '#F59E0B', 
                  icon: Clock 
                },
                { 
                  label: 'Vendues', 
                  value: stats.sold, 
                  color: '#3B82F6', 
                  icon: CheckCircle 
                },
                { 
                  label: 'Chiffre d\'affaires', 
                  value: `${stats.totalRevenue.toLocaleString('fr-FR')} €`, 
                  color: '#8B5CF6', 
                  icon: TrendingUp 
                },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-xl border hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  style={{ 
                    borderColor: `${theme.separator}`,
                    borderWidth: '1px'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                         style={{ backgroundColor: `${stat.color}15` }}>
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                    <span className="text-2xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section principale des œuvres */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-2xl shadow-xl p-6" 
                 style={{ border: `1px solid ${theme.separator}` }}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher par titre, artiste, catégorie..."
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all bg-gray-50 hover:bg-white"
                    style={{ 
                      borderColor: theme.separator,
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      className="pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none appearance-none bg-gray-50 hover:bg-white cursor-pointer"
                      style={{ 
                        borderColor: theme.separator,
                      }}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="relative">
                    <select
                      className="pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none appearance-none bg-gray-50 hover:bg-white cursor-pointer"
                      style={{ 
                        borderColor: theme.separator,
                      }}
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      {Object.entries(TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des œuvres */}
            {loading ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center" 
                   style={{ border: `1px solid ${theme.separator}` }}>
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" 
                     style={{ borderColor: `${theme.logo} ${theme.logo} ${theme.logo} transparent` }}></div>
                <p className="mt-4 text-gray-600 text-lg">Chargement des œuvres...</p>
                <p className="text-sm text-gray-500">Patience, vos créations arrivent</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center" 
                   style={{ 
                     border: `2px dashed ${theme.separator}`,
                     background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)'
                   }}>
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
                    {products.length === 0 ? (
                      <div className="relative">
                        <Plus size={28} className="absolute -top-2 -right-2 text-white bg-gray-400 rounded-full p-1.5" />
                        <Palette size={48} className="text-gray-300" />
                      </div>
                    ) : (
                      <div className="relative">
                        <FileSearch size={48} className="text-gray-300" />
                        <X size={28} className="absolute -top-2 -right-2 text-white bg-gray-400 rounded-full p-1.5" />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {products.length === 0 ? "Votre galerie attend ses premières œuvres" : "Aucune correspondance trouvée"}
                </h3>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {products.length === 0 
                    ? "Transformez votre créativité en art visible. Commencez par ajouter votre première création."
                    : "Essayez d'autres termes de recherche ou ajustez vos filtres pour découvrir plus d'œuvres."}
                </p>
                
                <button 
                  onClick={() => {
                    if (products.length === 0) {
                      setShowModal(true);
                    } else {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: theme.logo,
                    color: 'white'
                  }}
                >
                  {products.length === 0 ? (
                    <>
                      <Sparkles size={20} />
                      <span className="font-medium">Commencer votre collection</span>
                    </>
                  ) : (
                    <>
                      <Filter size={20} />
                      <span className="font-medium">Voir toutes les œuvres</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const statusColors = getStatusColor(product.status);
                  const typeColors = getTypeColor(product.type);
                  const TypeIcon = typeColors.icon;
                  
                  return (
                    <div 
                      key={product.id} 
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border hover:-translate-y-1"
                      style={{ 
                        borderColor: theme.separator,
                      }}
                    >
                      {/* Image avec overlay */}
                      <div className="relative h-48 overflow-hidden">
                        {product.images && product.images[0] ? (
                          <>
                            <img 
                              src={product.images[0]}
                              alt={product.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80`;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" 
                               style={{ backgroundColor: `${theme.logo}10` }}>
                            <TypeIcon size={64} style={{ color: `${theme.logo}30` }} />
                          </div>
                        )}
                        
                        {/* Badge statut */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${statusColors.darkBg} ${statusColors.darkText}`}>
                            {statusColors.label}
                          </span>
                        </div>
                        
                        {/* Badge type */}
                        <div className="absolute top-3 right-3">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 ${typeColors.bg} ${typeColors.text}`}>
                            <TypeIcon size={12} />
                            <span>{TYPE_LABELS[product.type] || product.type}</span>
                          </div>
                        </div>
                        
                        {/* Prix overlay */}
                        <div className="absolute bottom-3 right-3">
                          <div className="px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                            <span className="font-bold text-lg" style={{ color: theme.logo }}>
                              {product.price ? `${product.price.toLocaleString('fr-FR')} €` : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contenu de la carte */}
                      <div className="p-5">
                        {/* Titre et catégorie */}
                        <div className="mb-4">
                          <h3 className="font-bold text-xl text-gray-900 truncate group-hover:text-gray-800 transition-colors mb-1">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Tag size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600 truncate">
                              {product.category || 'Non catégorisé'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        {product.description && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                        )}
                        
                        {/* Métriques */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              <span className="font-medium">{formatDate(product.creationDate || product.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: theme.separator }}>
                          <button 
                            onClick={() => handleEdit(product)} 
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:scale-105 transition-all duration-300 group/edit"
                            style={{ 
                              backgroundColor: `${theme.logo}10`,
                              color: theme.logo
                            }}
                          >
                            <Edit3 size={16} className="group-hover/edit:rotate-12 transition-transform" />
                            <span className="text-sm font-medium">Modifier</span>
                          </button>                          
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:scale-105 transition-all duration-300 group/delete bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={16} className="group-hover/delete:shake transition-transform" />
                            <span className="text-sm font-medium">Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section réservations - Barre latérale */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6" 
                 style={{ 
                   border: `1px solid ${theme.separator}`,
                   background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)'
                 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: theme.secondaryText }}>
                    Réservations
                  </h2>
                  <p className="text-gray-600 text-sm">Demandes et ventes récentes</p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-sm font-medium" 
                     style={{ 
                       backgroundColor: `${theme.logo}15`, 
                       color: theme.logo,
                       border: `1px solid ${theme.separator}`
                     }}>
                  {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Statistiques des réservations */}
              <div className="mb-6 p-4 rounded-xl border" 
                   style={{ 
                     borderColor: theme.separator, 
                     backgroundColor: `${theme.logo}05` 
                   }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Chiffre d'affaires</span>
                  <DollarSign size={18} className="text-green-600" />
                </div>
                <div className="text-2xl font-bold" style={{ color: theme.secondaryText }}>
                  {stats.totalRevenue.toLocaleString('fr-FR')} €
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {reservations.filter(r => r.status === 'completed' || r.status === 'confirmed').length} transaction{reservations.filter(r => r.status === 'completed' || r.status === 'confirmed').length > 1 ? 's' : ''} validée{reservations.filter(r => r.status === 'completed' || r.status === 'confirmed').length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Liste des réservations */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {reservations.map((reservation) => {
                  const statusColors = getReservationStatusColor(reservation.status);
                  const StatusIcon = statusColors.icon;
                  
                  return (
                    <div 
                      key={reservation.id} 
                      className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-white group/reservation"
                      style={{ borderColor: theme.separator }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" 
                                 style={{ 
                                   backgroundColor: statusColors.bg.replace('bg-', '').split('-')[1]
                                 }}></div>
                            <h4 className="font-semibold text-gray-800 truncate">
                              {reservation.productTitle}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <User size={12} className="text-gray-400" />
                            <span className="text-sm text-gray-600">{reservation.customerName}</span>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${statusColors.bg} ${statusColors.text}`}>
                          <StatusIcon size={12} />
                          {statusColors.label}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>Réservé le {new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-gray-400" />
                          <span>
                            <span className="font-medium" style={{ color: theme.logo }}>
                              {reservation.price.toLocaleString('fr-FR')} €
                            </span>
                            <span className="text-gray-500 ml-1 text-xs">
                              (comm. {reservation.commission || 0} €)
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="truncate text-gray-600">{reservation.customerEmail}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t" style={{ borderColor: theme.separator }}>
                        <button className="flex-1 text-center py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors font-medium"
                                style={{ borderColor: theme.separator }}>
                          Détails
                        </button>
                        {reservation.status === 'pending' && (
                          <button className="flex-1 text-center py-2 text-sm rounded-lg text-white hover:shadow-md transition-all font-medium"
                                  style={{ backgroundColor: theme.logo }}>
                            Valider
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {reservations.length === 0 && (
                  <div className="text-center py-8 rounded-xl border-2 border-dashed" style={{ borderColor: theme.separator }}>
                    <ShoppingCart className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-600">Aucune réservation pour le moment</p>
                    <p className="text-sm text-gray-500 mt-1">Les réservations apparaîtront ici</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ProductCreateModal
        open={showModal}
        onOpenChange={setShowModal}
        userId={currentUserId}
        initialData={editingInitial}
        onSuccess={onModalSuccess}
      />
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .group-hover\\/delete:shake {
          animation: shake 0.5s ease-in-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ArtCreationProduct;