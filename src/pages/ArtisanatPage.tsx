import React from 'react';
import { Search, MapPin, Clock, Star } from 'lucide-react';

const ArtisanatPage = () => {
  const craftCategories = [
    { name: 'Céramique & Poterie', icon: '🏺', items: 156 },
    { name: 'Tissage & Textile', icon: '🧵', items: 89 },
    { name: 'Travail du cuir', icon: '👜', items: 72 },
    { name: 'Bijoux artisanaux', icon: '💎', items: 203 },
    { name: 'Menuiserie fine', icon: '🪑', items: 64 },
    { name: 'Verre soufflé', icon: '🥂', items: 42 },
    { name: 'Vannerie', icon: '🧺', items: 38 },
    { name: 'Maroquinerie', icon: '👝', items: 57 },
  ];

  const featuredArtisans = [
    {
      id: 1,
      name: 'Atelier Terre et Feu',
      craft: 'Céramique',
      location: 'Vallauris',
      rating: 4.9,
      description: 'Pièces uniques en grès émaillé',
      delivery: 'Sous 7 jours',
      image: 'https://picsum.photos/id/225/300/200',
    },
    {
      id: 2,
      name: 'Les Mains d\'Or',
      craft: 'Maroquinerie',
      location: 'Grasse',
      rating: 5.0,
      description: 'Sacs et accessoires en cuir végétal',
      delivery: 'Sous 10 jours',
      image: 'https://picsum.photos/id/226/300/200',
    },
    {
      id: 3,
      name: 'L\'Atelier du Bois',
      craft: 'Menuiserie',
      location: 'Jura',
      rating: 4.8,
      description: 'Meubles sur mesure en bois massif',
      delivery: 'Sur devis',
      image: 'https://picsum.photos/id/227/300/200',
    },
  ];

  const workshops = [
    { title: 'Initiation à la poterie', duration: '3h', price: '65€', slots: 4 },
    { title: 'Création de bijoux', duration: '2h30', price: '45€', slots: 6 },
    { title: 'Atelier cuir débutant', duration: '4h', price: '85€', slots: 3 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      {/* Header image can be set via env VITE_HEADER_IMAGE (e.g. Pinterest URL). */}
      <div 
        className="relative py-16 px-4"
        style={{
          backgroundImage: `url('https://i.pinimg.com/1200x/d0/3f/70/d03f70718ec218e0432c26ff587e3bf8.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto text-center mt-12">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Artisanat d'excellence
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Des artisans passionnés, des créations uniques, un savoir-faire à préserver
          </p>
          
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Bar */}
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
                placeholder="Rechercher un artisan, une spécialité, un produit..."
              />
              <button className="absolute right-2 top-2 px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: '#556B2F' }}>
                Découvrir
              </button>
            </div>
            <div className="mt-4 text-white">
              <p className="text-sm">
                Plus de 500 artisans répartis dans toute la France
              </p>
            </div>
          </div>
        {/* Craft Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Catégories d'artisanat
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {craftCategories.map((category, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
                style={{
                  borderColor: '#D3D3D3',
                  backgroundColor: 'white',
                }}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {category.items} créations
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: '#6B8E23', color: 'white' }}>
                    Voir
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Artisans */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Artisans sélectionnés
            </h2>
            <button className="px-4 py-2 rounded-md border font-medium"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}>
              Voir tous les artisans
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtisans.map((artisan) => (
              <div
                key={artisan.id}
                className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow"
                style={{ borderColor: '#D3D3D3' }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{artisan.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={16} className="mr-1" />
                        {artisan.location}
                      </div>
                    </div>
                    <div className="flex items-center" style={{ color: '#8B4513' }}>
                      <Star size={16} className="fill-current mr-1" />
                      <span className="font-bold">{artisan.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                          style={{ backgroundColor: '#F0F0F0', color: '#556B2F' }}>
                      {artisan.craft}
                    </span>
                    <p className="text-gray-600">{artisan.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      Livraison: {artisan.delivery}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 rounded-md border text-center font-medium"
                            style={{ borderColor: '#556B2F', color: '#556B2F' }}>
                      Voir les créations
                    </button>
                    <button className="flex-1 py-2 rounded-md text-white font-medium"
                            style={{ backgroundColor: '#556B2F' }}>
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workshops Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Ateliers découverte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border"
                style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}
              >
                <h3 className="font-bold text-lg mb-3">{workshop.title}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">{workshop.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix:</span>
                    <span className="font-bold" style={{ color: '#8B4513' }}>
                      {workshop.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Places restantes:</span>
                    <span className={`font-medium ${workshop.slots < 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {workshop.slots} places
                    </span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-md text-white font-medium"
                        style={{ backgroundColor: '#556B2F' }}>
                  Réserver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Heritage Section */}
        <div className="rounded-lg border p-8"
             style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Patrimoine vivant
              </h2>
              <p className="text-lg mb-6">
                Notre plateforme soutient les artisans détenteurs de savoir-faire rares et reconnus 
                Maître Artisan et Entreprise du Patrimoine Vivant.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full mr-2"
                       style={{ backgroundColor: '#8B4513' }}></div>
                  <span>Maître Artisan</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full mr-2"
                       style={{ backgroundColor: '#556B2F' }}></div>
                  <span>EPV Label</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 text-center">
              <button className="px-8 py-3 rounded-lg text-white font-bold text-lg"
                      style={{ backgroundColor: '#556B2F' }}>
                Soutenir l'artisanat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanatPage;