import React from 'react';
import { Hammer, Search, Star } from 'lucide-react';

const SculpturePage = () => {
  const sculptureTypes = [
    { name: 'Sculpture sur bois', icon: '🪵', count: 28 },
    { name: 'Sculpture sur pierre', icon: '🪨', count: 19 },
    { name: 'Sculpture sur bois', icon: '🪵', count: 28 },
    { name: 'Sculpture métal', icon: '🪨', count: 15 },
    { name: 'Sculpture terre cuite', icon: '🪨', count: 12 },
    { name: 'Sculpture contemporaine', icon: '🪨', count: 24 },
    { name: 'Commandes sur mesure', icon: '🪨', count: 31 },
  ];

  const featuredArtists = [
    {
      id: 1,
      name: 'Jean-Luc Bernard',
      material: 'Bois & Pierre',
      location: 'Bretagne',
      experience: '25 ans',
      description: 'Spécialiste des sculptures monumentales',
      image: 'https://picsum.photos/id/342/300/200',
    },
    {
      id: 2,
      name: 'Élise Moreau',
      material: 'Bronze & Métal',
      location: 'Normandie',
      experience: '15 ans',
      description: 'Artiste contemporaine primée',
      image: 'https://picsum.photos/id/343/300/200',
    },
    {
      id: 3,
      name: 'Pierre Dubois',
      material: 'Terre cuite',
      location: 'Provence',
      experience: '30 ans',
      description: 'Maître artisan traditionnel',
      image: 'https://picsum.photos/id/344/300/200',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      {/* Header image can be set via env VITE_HEADER_IMAGE (e.g. Pinterest URL). */}
      <div 
        className="relative py-16 px-4"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/52/ba/77/52ba77a48638da2e6e4a9f0f32fb31b5.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto text-center mt-12">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            L'art de la sculpture
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Découvrez des sculpteurs talentueux et des œuvres uniques pour votre intérieur ou extérieur
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
                    placeholder="Rechercher un sculpteur, une matière, une œuvre..."
                />
                <button className="absolute right-2 top-2 px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: '#556B2F' }}>
                    Rechercher
                </button>
                </div>
            </div>
        {/* Sculpture Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Types de sculpture
          </h2>
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
                  <span className="text-3xl mr-4">{type.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{type.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-current" style={{ color: '#8B4513' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {type.count} artistes disponibles
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#6B8E23', color: 'white' }}>
                    Explorer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Artists */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Sculpteurs d'exception
            </h2>
            <button className="px-4 py-2 rounded-md border font-medium"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}>
              Voir tous les sculpteurs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <div
                key={artist.id}
                className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow"
                style={{ borderColor: '#D3D3D3' }}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{artist.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Matière:</span>
                      <span style={{ color: '#556B2F' }}>{artist.material}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Localisation:</span>
                      <span>{artist.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Expérience:</span>
                      <span>{artist.experience}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{artist.description}</p>
                  <div className="flex justify-between items-center">
                    <button className="px-4 py-2 rounded-md border font-medium"
                            style={{ borderColor: '#556B2F', color: '#556B2F' }}>
                      Voir les œuvres
                    </button>
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

        {/* Workshop Section */}
        <div className="rounded-lg border p-8 mb-12"
             style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Ateliers et formations
              </h2>
              <p className="text-lg mb-6">
                Apprenez la sculpture auprès de maîtres artisans. Stages, cours réguliers et formations professionnelles.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 rounded-lg text-white font-medium"
                        style={{ backgroundColor: '#556B2F' }}>
                  Trouver un atelier
                </button>
                <button className="px-6 py-3 rounded-lg border font-medium"
                        style={{ borderColor: '#556B2F', color: '#556B2F' }}>
                  Cours en ligne
                </button>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white p-6 rounded-lg border"
                   style={{ borderColor: '#D3D3D3' }}>
                <h3 className="font-bold text-lg mb-4" style={{ color: '#8B4513' }}>
                  Prochain événement
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-24">Date:</span>
                    <span>15-17 Novembre 2024</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Lieu:</span>
                    <span>Paris, Atelier des Arts</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Thème:</span>
                    <span>Sculpture sur bois traditionnelle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SculpturePage;