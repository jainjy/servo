import React, { useState } from 'react';
import { 
  Store, 
  Filter, 
  Heart, 
  ShoppingBag, 
  TrendingUp, 
  X,
  ChevronDown,
  Info,
  Share2,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronRight,
  Check,
  ExternalLink,
  ShoppingCart,
  Users,
  Tag,
  Calendar,
  Award,
  Package,
  Truck,
  Shield,
  DollarSign,
  Printer,
  Target,
  ShieldCheck,
  CheckCircle

} from 'lucide-react';

interface MarketplaceCreateursProps {
  searchQuery?: string;
  onContactClick?: (subject: string, recipientName?: string) => void;
}

const MarketplaceCreateurs: React.FC<MarketplaceCreateursProps> = ({ searchQuery, onContactClick }) => {
  const [activeFilter, setActiveFilter] = useState('tous');
  const [showCreatorDetail, setShowCreatorDetail] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Fonctions handlers
  const handleViewCreatorDetail = (creator) => {
    setSelectedCreator(creator);
    setShowCreatorDetail(true);
  };

  const handleViewProductDetail = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleLikeItem = (itemId) => {
    if (likedItems.includes(itemId)) {
      setLikedItems(likedItems.filter(id => id !== itemId));
    } else {
      setLikedItems([...likedItems, itemId]);
    }
  };

  const handleFollowCreator = (creatorId) => {
    if (following.includes(creatorId)) {
      setFollowing(following.filter(id => id !== creatorId));
    } else {
      setFollowing([...following, creatorId]);
    }
  };

  const handleShareCreator = (creator) => {
    if (navigator.share) {
      navigator.share({
        title: creator.name,
        text: creator.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const filters = [
    { id: 'tous', label: 'Tous les créateurs' },
    { id: 'tendances', label: 'En tendance' },
    { id: 'nouveaux', label: 'Nouveaux arrivages' },
    { id: 'local', label: 'Artisans locaux' },
    { id: 'eco', label: 'Éco-responsable' },
  ];

  const moreFilters = [
    { id: 'bestseller', label: 'Best-sellers' },
    { id: 'promo', label: 'En promotion' },
    { id: 'personnalise', label: 'Personnalisable' },
    { id: 'livraison-rapide', label: 'Livraison rapide' },
  ];

  const creators = [
    {
      id: 1,
      name: 'L\'Atelier des Lys',
      category: 'Décoration textile',
      products: 42,
      location: 'Lyon',
      rating: 4.9,
      followers: '2.4k',
      description: 'Tapis et coussins tissés main',
      image: 'https://picsum.photos/id/28/300/200',
      featured: true,
      bio: 'Atelier spécialisé dans le textile d\'art depuis 15 ans. Techniques de tissage traditionnelles revisitées.',
      joinDate: 'Membre depuis 2020',
      materials: ['Laine naturelle', 'Coton bio', 'Teintures végétales'],
      certifications: ['Artisan d\'Art', 'Éco-responsable'],
      contact: {
        email: 'contact@atelier-des-lys.fr',
        phone: '04 78 12 34 56',
        website: 'www.atelier-des-lys.fr'
      },
      shopStats: {
        sales: 856,
        satisfaction: 98,
        deliveryTime: '2-5 jours'
      }
    },
    {
      id: 2,
      name: 'Terre & Forme',
      category: 'Céramique artisanale',
      products: 28,
      location: 'Bordeaux',
      rating: 5.0,
      followers: '1.8k',
      description: 'Vaisselle unique en grès naturel',
      image: 'https://picsum.photos/id/29/300/200',
      featured: true,
      bio: 'Céramiste passionnée par les formes organiques et les émaux naturels.',
      joinDate: 'Membre depuis 2019',
      materials: ['Grès', 'Porcelaine', 'Émaux minéraux'],
      certifications: ['Maître Artisan', 'Fait main France'],
      contact: {
        email: 'terre-forme@contact.fr',
        phone: '05 56 78 90 12',
        website: 'www.terre-forme.fr'
      },
      shopStats: {
        sales: 723,
        satisfaction: 99,
        deliveryTime: '3-7 jours'
      }
    },
    {
      id: 3,
      name: 'Bois & Lignes',
      category: 'Mobilier design',
      products: 15,
      location: 'Normandie',
      rating: 4.8,
      followers: '1.2k',
      description: 'Meubles minimalistes en chêne',
      image: 'https://picsum.photos/id/30/300/200',
      featured: false,
      bio: 'Ébéniste spécialisé dans le mobilier contemporain en bois locaux.',
      joinDate: 'Membre depuis 2021',
      materials: ['Chêne français', 'Hêtre', 'Finitions naturelles'],
      certifications: ['Bois certifié PEFC'],
      contact: {
        email: 'bois.lignes@pro.fr',
        phone: '02 35 12 34 56',
        website: 'www.bois-lignes.fr'
      },
      shopStats: {
        sales: 342,
        satisfaction: 97,
        deliveryTime: 'Sur devis'
      }
    },
    {
      id: 4,
      name: 'Cuir & Tradition',
      category: 'Maroquinerie',
      products: 36,
      location: 'Toulouse',
      rating: 4.7,
      followers: '3.1k',
      description: 'Accessoires en cuir végétal tanné',
      image: 'https://picsum.photos/id/31/300/200',
      featured: true,
      bio: 'Maroquinier traditionnel spécialisé dans le cuir végétal et les finitions à l\'ancienne.',
      joinDate: 'Membre depuis 2018',
      materials: ['Cuir végétal', 'Laiton', 'Fils de lin'],
      certifications: ['Slow Fashion', 'Artisan d\'Art'],
      contact: {
        email: 'info@cuir-tradition.com',
        phone: '05 61 23 45 67',
        website: 'www.cuir-tradition.com'
      },
      shopStats: {
        sales: 1254,
        satisfaction: 96,
        deliveryTime: '5-10 jours'
      }
    },
    {
      id: 5,
      name: 'Verre d\'Art',
      category: 'Verre soufflé',
      products: 23,
      location: 'Alsace',
      rating: 4.9,
      followers: '900',
      description: 'Pièces uniques soufflées à la bouche',
      image: 'https://picsum.photos/id/32/300/200',
      featured: false,
      bio: 'Maître verrier perpétuant l\'art du verre soufflé dans la tradition alsacienne.',
      joinDate: 'Membre depuis 2022',
      materials: ['Verre borosilicate', 'Oxydes métalliques'],
      certifications: ['Entreprise du Patrimoine Vivant'],
      contact: {
        email: 'verre.art@contact.fr',
        phone: '03 88 12 34 56',
        website: 'www.verre-d-art.fr'
      },
      shopStats: {
        sales: 189,
        satisfaction: 100,
        deliveryTime: '7-14 jours'
      }
    },
    {
      id: 6,
      name: 'Fils & Couleurs',
      category: 'Bijoux textile',
      products: 51,
      location: 'Paris',
      rating: 4.6,
      followers: '4.2k',
      description: 'Bijoux brodés et tissés',
      image: 'https://picsum.photos/id/33/300/200',
      featured: false,
      bio: 'Créatrice de bijoux textiles contemporains inspirés des techniques traditionnelles.',
      joinDate: 'Membre depuis 2020',
      materials: ['Soie', 'Linen', 'Perles de verre'],
      certifications: ['Fait main', 'Upcycling'],
      contact: {
        email: 'fils.couleurs@email.com',
        phone: '01 40 12 34 56',
        website: 'www.fils-couleurs.com'
      },
      shopStats: {
        sales: 2103,
        satisfaction: 95,
        deliveryTime: '2-4 jours'
      }
    },
  ];

  const trendingProducts = [
    { 
      id: 1,
      name: 'Vase sculptural', 
      creator: 'Terre & Forme', 
      creatorId: 2,
      price: '120€',
      originalPrice: '150€',
      orders: 42,
      description: 'Vase en grès aux formes organiques, émaillé à la main',
      image: 'https://picsum.photos/id/228/400/300',
      category: 'Céramique',
      materials: 'Grès, émail naturel',
      dimensions: '25x15 cm',
      delivery: 'Livraison gratuite',
      inStock: true,
      rating: 4.9
    },
    { 
      id: 2,
      name: 'Sac cabas cuir', 
      creator: 'Cuir & Tradition', 
      creatorId: 4,
      price: '85€',
      orders: 38,
      description: 'Cabas en cuir végétal tanné, doublure coton',
      image: 'https://picsum.photos/id/231/400/300',
      category: 'Maroquinerie',
      materials: 'Cuir végétal, coton bio',
      dimensions: '35x25x15 cm',
      delivery: 'Sous 10 jours',
      inStock: true,
      rating: 4.8
    },
    { 
      id: 3,
      name: 'Set de bols', 
      creator: 'L\'Atelier des Lys', 
      creatorId: 1,
      price: '65€',
      orders: 29,
      description: 'Set de 4 bols en céramique émaillée',
      image: 'https://picsum.photos/id/229/400/300',
      category: 'Céramique',
      materials: 'Porcelaine, émail',
      dimensions: '10x10 cm chacun',
      delivery: 'Sous 7 jours',
      inStock: true,
      rating: 5.0
    },
  ];

  const allProducts = [
    ...trendingProducts,
    { 
      id: 4,
      name: 'Table basse chêne', 
      creator: 'Bois & Lignes', 
      creatorId: 3,
      price: '450€',
      orders: 12,
      image: 'https://picsum.photos/id/234/400/300'
    },
    { 
      id: 5,
      name: 'Pendentif verre', 
      creator: 'Verre d\'Art', 
      creatorId: 5,
      price: '75€',
      orders: 24,
      image: 'https://picsum.photos/id/232/400/300'
    },
    { 
      id: 6,
      name: 'Collier brodé', 
      creator: 'Fils & Couleurs', 
      creatorId: 6,
      price: '55€',
      orders: 41,
      image: 'https://picsum.photos/id/233/400/300'
    },
  ];

  const displayedProducts = showAllProducts ? allProducts : trendingProducts;
  const displayedCreators = creators.filter(creator => {
    if (activeFilter === 'tous') return true;
    if (activeFilter === 'tendances') return creator.featured;
    if (activeFilter === 'nouveaux') return creator.id > 4;
    if (activeFilter === 'local') return ['Lyon', 'Bordeaux', 'Normandie'].includes(creator.location);
    if (activeFilter === 'eco') return creator.certifications?.some(cert => cert.includes('Éco'));
    return true;
  });

  return (
    <div>
      {/* Filters - TOUS LES BOUTONS FONCTIONNELS */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Dropdown pour les filtres principaux */}
          <div className="relative w-full md:w-auto">
            <div 
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center justify-between px-4 py-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors group"
              style={{ 
                borderColor: '#D3D3D3',
                backgroundColor: 'white'
              }}
            >
              <div className="flex items-center">
                <Filter size={18} className="mr-2" style={{ color: '#8B4513' }} />
                <span className="font-medium">
                  {activeFilter === 'tous' ? 'Tous les créateurs' : 
                  filters.find(f => f.id === activeFilter)?.label || 'Filtrer par'}
                </span>
              </div>
              <ChevronDown 
                size={18} 
                className={`transform transition-transform duration-200 ${showMoreFilters ? 'rotate-180' : ''}`}
                style={{ color: '#8B4513' }}
              />
            </div>
            
            {showMoreFilters && (
              <div 
                className="absolute top-full left-0 mt-1 w-full md:w-64 bg-white border rounded-lg shadow-lg z-10 overflow-hidden"
                style={{ borderColor: '#D3D3D3' }}
              >
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-sm font-medium" style={{ color: '#8B4513' }}>Catégories</span>
                    <button 
                      onClick={() => setShowMoreFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {filters.map((filter) => (
                    <div
                      key={filter.id}
                      onClick={() => {
                        setActiveFilter(filter.id);
                        setShowMoreFilters(false);
                      }}
                      className={`px-3 py-2 rounded-md cursor-pointer hover:bg-[#F5F5DC] transition-colors flex items-center justify-between ${
                        activeFilter === filter.id ? 'bg-[#F5F5DC]' : ''
                      }`}
                      style={{ 
                        color: activeFilter === filter.id ? '#8B4513' : '#556B2F'
                      }}
                    >
                      <span className="text-sm">{filter.label}</span>
                      {activeFilter === filter.id && (
                        <Check size={16} style={{ color: '#8B4513' }} />
                      )}
                    </div>
                  ))}
                  
                  <div className="border-t my-2" style={{ borderColor: '#D3D3D3' }}></div>
                  
                  
                </div>
              </div>
            )}
          </div>
          
          {/* Badge du filtre actif */}
          {activeFilter !== 'tous' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filtre actif :</span>
              <div className="flex items-center px-3 py-1 rounded-full bg-[#F5F5DC]">
                <span className="text-sm font-medium" style={{ color: '#8B4513' }}>
                  {filters.find(f => f.id === activeFilter)?.label}
                </span>
                <button 
                  onClick={() => setActiveFilter('tous')}
                  className="ml-2 hover:text-[#8B4513]"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Creators Grid - TOUS LES BOUTONS FONCTIONNELS */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCreators.map((creator) => (
            <div
              key={creator.id}
              className="rounded-lg border hover:shadow-xl transition-shadow group"
              style={{ borderColor: '#D3D3D3' }}
            >
              {/* Creator Header */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {creator.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: '#8B4513' }}>
                      EN VEDETTE
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => handleLikeItem(`creator-${creator.id}`)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={likedItems.includes(`creator-${creator.id}`) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </button>
                </div>
                <button 
                  onClick={() => handleViewCreatorDetail(creator)}
                  className="absolute bottom-4 left-4 px-3 py-1 rounded text-sm font-medium text-white bg-black/60 hover:bg-black/80 transition-colors"
                >
                  Voir la boutique
                </button>
              </div>

              {/* Creator Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 
                      className="font-bold text-xl mb-1 hover:text-[#8B4513] transition-colors cursor-pointer"
                      onClick={() => handleViewCreatorDetail(creator)}
                    >
                      {creator.name}
                    </h3>
                    <p className="text-gray-600">{creator.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1" style={{ color: '#8B4513' }}>
                      <span className="font-bold mr-1">{creator.rating}</span>
                      <Star size={14} className="fill-current" />
                    </div>
                    <div className="text-sm text-gray-500">{creator.followers} abonnés</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{creator.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{creator.products} produits</span>
                    <span>•</span>
                    <span className="ml-2 flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {creator.location}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleShareCreator(creator)}
                    className="p-1 hover:text-[#556B2F] transition-colors"
                    title="Partager"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleFollowCreator(creator.id)}
                    className={`flex-1 py-2 rounded-md border text-center font-medium flex items-center justify-center transition-colors ${
                      following.includes(creator.id) 
                        ? 'bg-[#8B4513] text-white border-[#8B4513]' 
                        : 'hover:bg-[#556B2F] hover:text-white'
                    }`}
                    style={{ borderColor: '#556B2F', color: following.includes(creator.id) ? 'white' : '#556B2F' }}
                  >
                    <Heart 
                      size={18} 
                      className="mr-2" 
                      fill={following.includes(creator.id) ? 'white' : 'none'}
                    />
                    {following.includes(creator.id) ? 'Suivi' : 'Suivre'}
                  </button>
                  <button 
                    onClick={() => handleViewCreatorDetail(creator)}
                    className="flex-1 py-2 rounded-md text-white font-medium flex items-center justify-center hover:bg-[#485826] transition-colors"
                    style={{ backgroundColor: '#556B2F' }}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Boutique
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products - TOUS LES BOUTONS FONCTIONNELS */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <TrendingUp size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Produits tendance
            </h2>
          </div>
          <button 
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="flex items-center text-sm font-medium hover:underline"
            style={{ color: '#556B2F' }}
          >
            {showAllProducts ? 'Voir moins' : 'Voir tous les produits'}
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}
              onClick={() => handleViewProductDetail(product)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p 
                    className="text-gray-600 text-sm hover:text-[#8B4513] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const creator = creators.find(c => c.id === product.creatorId);
                      if (creator) handleViewCreatorDetail(creator);
                    }}
                  >
                    par {product.creator}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl mb-1" style={{ color: '#8B4513' }}>
                    {product.price}
                  </div>
                  <div className="text-sm text-gray-500">{product.orders} commandes</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProductDetail(product);
                  }}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#556B2F' }}
                >
                  Voir le produit
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onContactClick && onContactClick(`Achat: ${product.name}`, product.creator);
                  }}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-[#485826] transition-colors"
                  style={{ backgroundColor: '#6B8E23' }}
                >
                  Acheter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Marketplace - TOUS LES BOUTONS FONCTIONNELS */}
        <div className="rounded-lg border p-12 text-center"
            style={{ 
              borderColor: '#D3D3D3', 
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F9F9F9 100%)'
            }}>
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Vous êtes créateur ?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Rejoignez notre marketplace et bénéficiez d'un espace dédié, 
            d'outils de gestion et d'une communauté de passionnés.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="p-6 rounded-lg border hover:shadow-lg transition-shadow group" style={{ borderColor: '#D3D3D3' }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#F5F5DC' }}>
                  <Target size={32} style={{ color: '#8B4513' }} />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Visibilité maximale</h3>
              <p className="text-gray-600">Mettez en valeur votre travail auprès d'une audience ciblée</p>
            </div>
            
            <div className="p-6 rounded-lg border hover:shadow-lg transition-shadow group" style={{ borderColor: '#D3D3D3' }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#F5F5DC' }}>
                  <ShieldCheck size={32} style={{ color: '#8B4513' }} />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Transactions sécurisées</h3>
              <p className="text-gray-600">Paiement sécurisé et gestion simplifiée des commandes</p>
            </div>
            
            <div className="p-6 rounded-lg border hover:shadow-lg transition-shadow group" style={{ borderColor: '#D3D3D3' }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#F5F5DC' }}>
                  <Users size={32} style={{ color: '#8B4513' }} />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Communauté engagée</h3>
              <p className="text-gray-600">Échangez avec d'autres créateurs et partagez votre passion</p>
            </div>
          </div>
          
          {/* Section avantages supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center">
                <CheckCircle size={20} className="mr-2" style={{ color: '#6B8E23' }} />
                <span className="font-medium">Commission réduite</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center">
                <CheckCircle size={20} className="mr-2" style={{ color: '#6B8E23' }} />
                <span className="font-medium">Support dédié</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center">
                <CheckCircle size={20} className="mr-2" style={{ color: '#6B8E23' }} />
                <span className="font-medium">Outils marketing</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onContactClick && onContactClick('Devenir vendeur', 'Équipe Marketplace')}
              className="flex items-center justify-center px-8 py-3 rounded-lg text-white font-bold text-lg hover:bg-[#485826] transition-colors"
              style={{ backgroundColor: '#556B2F' }}
            >
              <Store size={22} className="mr-2" />
              Devenir vendeur
            </button>
            
          </div>
          
        </div>

      {/* Modal Détail Créateur - COMPLET ET FONCTIONNEL */}
      {showCreatorDetail && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white">
                  <img 
                    src={selectedCreator.image} 
                    alt={selectedCreator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedCreator.name}</h2>
                  <div className="flex items-center text-white/80 text-sm mt-1">
                    <Store size={14} className="mr-1" />
                    {selectedCreator.category}
                    <span className="mx-2">•</span>
                    <MapPin size={14} className="mr-1" />
                    {selectedCreator.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleShareCreator(selectedCreator)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Partager"
                >
                  <Share2 size={20} className="text-white" />
                </button>
                <button 
                  onClick={() => window.print()}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Imprimer"
                >
                  <Printer size={20} className="text-white" />
                </button>
                <button 
                  onClick={() => setShowCreatorDetail(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Colonne gauche - Informations */}
                  <div className="lg:col-span-2">
                    {/* Bio */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#8B4513' }}>
                        <Info size={20} className="mr-2" />
                        À propos du créateur
                      </h3>
                      <p className="text-gray-700 mb-4">{selectedCreator.bio}</p>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F5F5DC' }}>
                          <p className="font-medium text-sm" style={{ color: '#556B2F' }}>Produits</p>
                          <p className="text-2xl font-bold">{selectedCreator.products}</p>
                        </div>
                        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F5F5DC' }}>
                          <p className="font-medium text-sm" style={{ color: '#556B2F' }}>Note</p>
                          <p className="text-2xl font-bold">{selectedCreator.rating}/5</p>
                        </div>
                        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F5F5DC' }}>
                          <p className="font-medium text-sm" style={{ color: '#556B2F' }}>Ventes</p>
                          <p className="text-2xl font-bold">{selectedCreator.shopStats?.sales || 0}</p>
                        </div>
                        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F5F5DC' }}>
                          <p className="font-medium text-sm" style={{ color: '#556B2F' }}>Satisfaction</p>
                          <p className="text-2xl font-bold">{selectedCreator.shopStats?.satisfaction || 0}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Matériaux */}
                    {selectedCreator.materials && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Matériaux utilisés</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCreator.materials.map((material, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 rounded-full text-sm"
                              style={{ 
                                backgroundColor: '#F0EAD6',
                                color: '#556B2F',
                                border: '1px solid #D3D3D3'
                              }}
                            >
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {selectedCreator.certifications && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Certifications</h3>
                        <div className="space-y-2">
                          {selectedCreator.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                              <Award size={18} className="mr-2" style={{ color: '#556B2F' }} />
                              <span className="font-medium">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Colonne droite - Contact et actions */}
                  <div>
                    {/* Informations boutique */}
                    <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
                      <h3 className="font-bold mb-3" style={{ color: '#8B4513' }}>Informations boutique</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" style={{ color: '#8B4513' }} />
                          <span className="text-sm">{selectedCreator.joinDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Truck size={16} className="mr-2" style={{ color: '#8B4513' }} />
                          <span className="text-sm">Livraison: {selectedCreator.shopStats?.deliveryTime || 'Sous 7 jours'}</span>
                        </div>
                        <div className="flex items-center">
                          <Shield size={16} className="mr-2" style={{ color: '#8B4513' }} />
                          <span className="text-sm">Paiement 100% sécurisé</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    {selectedCreator.contact && (
                      <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
                        <h3 className="font-bold mb-3" style={{ color: '#8B4513' }}>Contact</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail size={16} className="mr-2" style={{ color: '#8B4513' }} />
                            <span className="text-sm">{selectedCreator.contact.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={16} className="mr-2" style={{ color: '#8B4513' }} />
                            <span className="text-sm">{selectedCreator.contact.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <ExternalLink size={16} className="mr-2" style={{ color: '#8B4513' }} />
                            <a href={`https://${selectedCreator.contact.website}`} className="text-sm hover:underline" style={{ color: '#556B2F' }}>
                              {selectedCreator.contact.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      
                      <button 
                        onClick={() => onContactClick && onContactClick(`Commande sur mesure: ${selectedCreator.name}`, selectedCreator.name)}
                        className="w-full py-3 rounded-lg text-white font-bold hover:bg-[#485826] transition-colors"
                        style={{ backgroundColor: '#6B8E23' }}
                      >
                        <ShoppingCart size={20} className="inline mr-2" />
                        Commander un produit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Produit - COMPLET ET FONCTIONNEL */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                <p className="text-white/80 text-sm mt-1">par {selectedProduct.creator}</p>
              </div>
              <button 
                onClick={() => setShowProductDetail(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Contenu */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image */}
                  <div>
                    <div className="h-80 overflow-hidden rounded-lg mb-4">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Informations */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: '#556B2F' }}>
                        {selectedProduct.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <Tag size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Catégorie</p>
                            <p className="text-gray-700">{selectedProduct.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Package size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Matériaux</p>
                            <p className="text-gray-700">{selectedProduct.materials}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Ruler size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Dimensions</p>
                            <p className="text-gray-700">{selectedProduct.dimensions}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Truck size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Livraison</p>
                            <p className="text-gray-700">{selectedProduct.delivery}</p>
                          </div>
                        </div>
                      </div>

                      {/* Prix et stock */}
                      <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#F5F5DC' }}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium" style={{ color: '#8B4513' }}>Prix</p>
                            <div className="flex items-center">
                              <p className="text-3xl font-bold mr-2" style={{ color: '#556B2F' }}>
                                {selectedProduct.price}
                              </p>
                              {selectedProduct.originalPrice && (
                                <p className="text-lg line-through text-gray-500">
                                  {selectedProduct.originalPrice}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: '#8B4513' }}>Disponibilité</p>
                            <p className={`text-lg font-bold ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedProduct.inStock ? 'En stock' : 'Rupture'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <button 
                          onClick={() => onContactClick && onContactClick(`Achat: ${selectedProduct.name}`, selectedProduct.creator)}
                          className="w-full py-4 rounded-lg text-white font-bold text-lg hover:bg-[#485826] transition-colors"
                          style={{ backgroundColor: '#6B8E23' }}
                        >
                          <ShoppingCart size={20} className="inline mr-2" />
                          Acheter maintenant
                        </button>
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleLikeItem(`product-${selectedProduct.id}`)}
                            className={`flex-1 py-3 rounded-lg border font-medium flex items-center justify-center ${
                              likedItems.includes(`product-${selectedProduct.id}`) 
                                ? 'bg-[#8B4513] text-white border-[#8B4513]' 
                                : 'hover:bg-[#556B2F] hover:text-white'
                            }`}
                            style={{ borderColor: '#556B2F', color: likedItems.includes(`product-${selectedProduct.id}`) ? 'white' : '#556B2F' }}
                          >
                            <Heart 
                              size={20} 
                              className="mr-2" 
                              fill={likedItems.includes(`product-${selectedProduct.id}`) ? 'white' : 'none'}
                            />
                            {likedItems.includes(`product-${selectedProduct.id}`) ? 'Favori' : 'Ajouter aux favoris'}
                          </button>
                          <button 
                            onClick={() => onContactClick && onContactClick(`Question produit: ${selectedProduct.name}`, selectedProduct.creator)}
                            className="flex-1 py-3 rounded-lg border font-medium hover:bg-gray-50 transition-colors"
                            style={{ borderColor: '#556B2F', color: '#556B2F' }}
                          >
                            <Info size={20} className="inline mr-2" />
                            Question
                          </button>
                        </div>
                      </div>
                    </div>
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

// Composant Ruler (manquant dans lucide-react)
const Ruler = ({ size, className, style }) => (
  <svg 
    width={size} 
    height={size} 
    className={className}
    style={style}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M9 22V12h6v10" 
    />
  </svg>
);

export default MarketplaceCreateurs;