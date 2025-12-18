import React, { useState } from 'react';
import { Store, Search, Filter, Heart, ShoppingBag, TrendingUp } from 'lucide-react';

const MarketplaceCreateurs = () => {
  const [activeFilter, setActiveFilter] = useState('tous');

  const filters = [
    { id: 'tous', label: 'Tous les créateurs' },
    { id: 'tendances', label: 'En tendance' },
    { id: 'nouveaux', label: 'Nouveaux arrivages' },
    { id: 'local', label: 'Artisans locaux' },
    { id: 'eco', label: 'Éco-responsable' },
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
    },
  ];

  const trendingProducts = [
    { name: 'Vase sculptural', creator: 'Terre & Forme', price: '120€', orders: 42 },
    { name: 'Sac cabas cuir', creator: 'Cuir & Tradition', price: '85€', orders: 38 },
    { name: 'Set de bols', creator: 'L\'Atelier des Lys', price: '65€', orders: 29 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      {/* Header image can be set via env VITE_HEADER_IMAGE (e.g. Pinterest URL). */}
      <div 
        className="relative py-16 px-4"
        style={{
          backgroundImage: `url('https://i.pinimg.com/1200x/03/e2/e4/03e2e413bf4d666133600ff2eef90bb7.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto text-center mt-12">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-8B4513">
            Marketplace Créateurs
          </h1>
          <p className="text-xl mb-8 text-556B2F max-w-3xl mx-auto">
            Plateforme dédiée aux artisans et créateurs indépendants. 
            Des pièces uniques, des histoires authentiques.
          </p>
          
          
        </div>
      </div>

      {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" style={{ color: '#8B4513' }} />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{
                    borderColor: '#D3D3D3',
                    backgroundColor: 'white',
                    }}
                    placeholder="Rechercher un créateur, un produit, une matière..."
                />
                <button className="absolute right-2 top-2 px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: '#556B2F' }}>
                    Explorer
                </button>
                </div>
          </div>
        

        {/* Filters */}
        <div className="mb-8 mt-12 flex justify-center">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  activeFilter === filter.id 
                    ? 'text-white' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  borderColor: activeFilter === filter.id ? '#556B2F' : '#D3D3D3',
                  backgroundColor: activeFilter === filter.id ? '#556B2F' : 'white',
                }}
              >
                {filter.label}
              </button>
            ))}
            <button className="flex items-center px-4 py-2 rounded-full border"
                    style={{ borderColor: '#D3D3D3' }}>
              <Filter size={16} className="mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator) => (
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
                    <button className="p-2 rounded-full bg-white/90 hover:bg-white">
                      <Heart size={20} style={{ color: '#8B4513' }} />
                    </button>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{creator.name}</h3>
                      <p className="text-gray-600">{creator.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1" style={{ color: '#8B4513' }}>
                        <span className="font-bold mr-1">{creator.rating}</span>
                        <span>★</span>
                      </div>
                      <div className="text-sm text-gray-500">{creator.followers} abonnés</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{creator.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{creator.products} produits</span>
                      <span>•</span>
                      <span className="ml-2">{creator.location}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 rounded-md border text-center font-medium flex items-center justify-center"
                            style={{ borderColor: '#556B2F', color: '#556B2F' }}>
                      <Heart size={18} className="mr-2" />
                      Suivre
                    </button>
                    <button className="flex-1 py-2 rounded-md text-white font-medium flex items-center justify-center"
                            style={{ backgroundColor: '#556B2F' }}>
                      <ShoppingBag size={18} className="mr-2" />
                      Boutique
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Products */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Produits tendance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingProducts.map((product, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border"
                style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm">par {product.creator}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl mb-1" style={{ color: '#8B4513' }}>
                      {product.price}
                    </div>
                    <div className="text-sm text-gray-500">{product.orders} commandes</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-sm font-medium" style={{ color: '#556B2F' }}>
                    Voir le produit
                  </button>
                  <button className="px-4 py-2 rounded-md text-sm font-medium text-white"
                          style={{ backgroundColor: '#6B8E23' }}>
                    Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Marketplace */}
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
            <div className="p-6 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2">Visibilité maximale</h3>
              <p className="text-gray-600">Mettez en valeur votre travail auprès d'une audience ciblée</p>
            </div>
            <div className="p-6 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-bold text-lg mb-2">Transactions sécurisées</h3>
              <p className="text-gray-600">Paiement sécurisé et gestion simplifiée des commandes</p>
            </div>
            <div className="p-6 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
              <div className="text-3xl mb-4">👥</div>
              <h3 className="font-bold text-lg mb-2">Communauté engagée</h3>
              <p className="text-gray-600">Échangez avec d'autres créateurs et partagez votre passion</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-lg text-white font-bold text-lg"
                    style={{ backgroundColor: '#556B2F' }}>
              Devenir vendeur
            </button>
            <button className="px-8 py-3 rounded-lg border font-bold text-lg"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}>
              Voir les tarifs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCreateurs;