import React from 'react';
import { Palette, Search, Heart, Share2 } from 'lucide-react';

const PeinturePage = () => {
  const paintingStyles = [
    { name: 'Peinture à l\'huile', color: '#8B4513', artists: 42 },
    { name: 'Aquarelle', color: '#6B8E23', artists: 38 },
    { name: 'Acrylique', color: '#556B2F', artists: 29 },
    { name: 'Peinture murale', color: '#DAA520', artists: 24 },
    { name: 'Art abstrait', color: '#B8860B', artists: 36 },
    { name: 'Portraits', color: '#8B7355', artists: 31 },
  ];

  const featuredPaintings = [
    {
      id: 1,
      title: 'Les Champs d\'Olive',
      artist: 'Camille Rousseau',
      style: 'Huile sur toile',
      price: '850€',
      dimensions: '80x60 cm',
      likes: 124,
      image: 'https://picsum.photos/id/106/300/200',
    },
    {
      id: 2,
      title: 'Reflets Urbains',
      artist: 'Lucas Mercier',
      style: 'Acrylique',
      price: '620€',
      dimensions: '100x70 cm',
      likes: 89,
      image: 'https://picsum.photos/id/107/300/200',
    },
    {
      id: 3,
      title: 'Harmonie Naturelle',
      artist: 'Isabelle Blanc',
      style: 'Aquarelle',
      price: '450€',
      dimensions: '50x40 cm',
      likes: 156,
      image: 'https://picsum.photos/id/108/300/200',
    },
  ];

  const artistsOfMonth = [
    { name: 'Thomas Lefebvre', specialty: 'Paysages méditerranéens', works: 24 },
    { name: 'Sophie Martin', specialty: 'Portraits animaliers', works: 18 },
    { name: 'Pierre Garnier', specialty: 'Abstrait géométrique', works: 31 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      {/* Header image can be set via env VITE_HEADER_IMAGE (e.g. Pinterest URL). */}
      <div 
        className="relative py-16 px-4"
        style={{
          backgroundImage: `url('https://i.pinimg.com/1200x/3d/08/6f/3d086f097c43d22c6b074b375aed88d2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto text-center mt-12">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            L'univers de la peinture
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Des artistes contemporains aux techniques traditionnelles, découvrez l'art sous toutes ses couleurs
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
                        placeholder="Rechercher un artiste, un style, une œuvre..."
                        />
                    <div className="absolute right-2 top-2 flex space-x-2">
                        <button className="px-4 py-2 rounded-md border font-medium"
                                style={{ borderColor: '#D3D3D3', color: '#8B4513' }}>
                        Filtres
                        </button>
                        <button className="px-4 py-2 rounded-md text-white"
                                style={{ backgroundColor: '#556B2F' }}>
                        Explorer
                        </button>
                    </div>
                </div>
            </div>
        {/* Painting Styles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Styles et techniques
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {paintingStyles.map((style, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: style.color }}
                >
                  {style.artists}+
                </div>
                <h3 className="font-semibold mb-1">{style.name}</h3>
                <p className="text-sm text-gray-600">{style.artists} artistes</p>
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
            <button className="px-4 py-2 rounded-md border font-medium"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}>
              Voir toutes les œuvres
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPaintings.map((painting) => (
              <div
                key={painting.id}
                className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow group"
                style={{ borderColor: '#D3D3D3' }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={painting.image}
                    alt={painting.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 rounded-full bg-white/90 hover:bg-white">
                      <Heart size={20} style={{ color: '#8B4513' }} />
                    </button>
                    <button className="p-2 rounded-full bg-white/90 hover:bg-white">
                      <Share2 size={20} style={{ color: '#8B4513' }} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="text-white">
                      <div className="font-bold text-lg">{painting.title}</div>
                      <div className="text-sm">{painting.artist}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-600 mb-1">{painting.style}</p>
                      <p className="text-sm text-gray-500">{painting.dimensions}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl mb-1" style={{ color: '#8B4513' }}>
                        {painting.price}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart size={14} className="mr-1" />
                        {painting.likes} likes
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 rounded-md border text-center font-medium"
                            style={{ borderColor: '#556B2F', color: '#556B2F' }}>
                      Détails
                    </button>
                    <button className="flex-1 py-2 rounded-md text-white font-medium"
                            style={{ backgroundColor: '#556B2F' }}>
                      Acheter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artists of the Month */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Artistes du mois
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artistsOfMonth.map((artist, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border"
                style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src={`https://picsum.photos/id/${100 + index}/100/100`}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{artist.name}</h3>
                    <p className="text-gray-600 text-sm">{artist.specialty}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {artist.works} œuvres disponibles
                  </span>
                  <button className="px-4 py-2 rounded-md text-sm font-medium"
                          style={{ backgroundColor: '#6B8E23', color: 'white' }}>
                    Visiter l'atelier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Section */}
        <div className="rounded-lg border p-8 text-center"
             style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#8B4513' }}>
            Une œuvre sur mesure ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Commandez une peinture personnalisée à l'un de nos artistes. Portraits, paysages, ou création unique selon vos envies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-lg text-white font-bold text-lg"
                    style={{ backgroundColor: '#556B2F' }}>
              Commander une œuvre
            </button>
            <button className="px-8 py-3 rounded-lg border font-bold text-lg"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}>
              Voir les portfolios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeinturePage;