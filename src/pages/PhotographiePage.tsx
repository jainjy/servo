import React from 'react';
import { Camera, Search, Filter } from 'lucide-react';

const PhotographiePage = () => {
  const categories = [
    { name: 'Photographes portrait', count: 45 },
    { name: 'Photographes mariage', count: 32 },
    { name: 'Photographes paysage', count: 28 },
    { name: 'Photographie artistique', count: 19 },
    { name: 'Photographes événementiel', count: 26 },
    { name: 'Cours de photographie', count: 15 },
  ];

  const featuredPhotographers = [
    {
      id: 1,
      name: 'Marie Laurent',
      specialty: 'Portrait artistique',
      location: 'Paris',
      rating: 4.9,
      price: 'À partir de 150€/séance',
      image: 'https://picsum.photos/id/433/300/200',
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      specialty: 'Photographie mariage',
      location: 'Lyon',
      rating: 5.0,
      price: 'Pack mariage à 1200€',
      image: 'https://picsum.photos/id/454/300/200',
    },
    {
      id: 3,
      name: 'Sophie Martin',
      specialty: 'Paysage urbain',
      location: 'Marseille',
      rating: 4.8,
      price: 'Expositions sur demande',
      image: 'https://picsum.photos/id/456/300/200',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      {/* Header image can be set via env VITE_HEADER_IMAGE (e.g. Pinterest URL). */}
      <div 
        className="relative py-16 px-4"
        style={{
          backgroundImage: `url(${'https://i.pinimg.com/1200x/c9/87/c4/c987c4c4f4be701a27f5cdf35c078cda.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto text-center mt-12">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Trouvez le photographe idéal
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Des professionnels pour capturer vos moments précieux et des artistes pour vos projets créatifs
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
                    placeholder="Rechercher un photographe, un service..."
                />
                <button className="absolute right-2 top-2 px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: '#556B2F' }}>
                    Rechercher
                </button>
            </div>
                
        </div>
        {/* Categories */}
        <div className="mb-12">
            
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Catégories populaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
                style={{
                  borderColor: '#D3D3D3',
                  backgroundColor: 'white',
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <span className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: '#6B8E23', color: 'white' }}>
                    {category.count} pros
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  Découvrez nos photographes spécialisés en {category.name.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Photographers */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Photographes recommandés
            </h2>
            <button className="px-4 py-2 rounded-md border font-medium"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}>
              Voir tous les photographes
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPhotographers.map((photographer) => (
              <div
                key={photographer.id}
                className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow"
                style={{ borderColor: '#D3D3D3' }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={photographer.image}
                    alt={photographer.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{photographer.name}</h3>
                      <p className="text-gray-600 mb-2">{photographer.specialty}</p>
                    </div>
                    <div className="flex items-center" style={{ color: '#8B4513' }}>
                      <span className="font-bold">{photographer.rating}</span>
                      <span className="ml-1">★</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-semibold">{photographer.price}</span>
                    <button className="px-4 py-2 rounded-md text-white font-medium"
                            style={{ backgroundColor: '#556B2F' }}>
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 px-4 rounded-lg border"
             style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#8B4513' }}>
            Vous êtes photographe ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et augmentez votre visibilité auprès de clients passionnés
          </p>
          <button className="px-8 py-3 rounded-lg text-white font-bold text-lg"
                  style={{ backgroundColor: '#556B2F' }}>
            Proposer mes services
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographiePage;