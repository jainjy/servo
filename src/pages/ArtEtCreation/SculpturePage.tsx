import React, { useState } from 'react'; 
import { 
  Hammer, 
  Star, 
  Trees, 
  Mountain, 
  Drill, 
  EggFried, 
  Palette,
  PencilRuler,
  Users,
  MapPin,
  Calendar,
  Award,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  X,
  Image as ImageIcon,
  ChevronRight,
  Heart,
  Share2,
  ExternalLink,
  Info,
  MapPin as MapPinIcon,
  Tag
} from 'lucide-react';

interface SculpturePageProps {
  searchQuery?: string;
  onContactClick: (subject: string, recipientName?: string) => void;
}

const SculpturePage: React.FC<SculpturePageProps> = ({ searchQuery, onContactClick }) => {
  const [showArtworks, setShowArtworks] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Fonction pour afficher les œuvres
  const handleViewArtworks = (artist) => {
    setSelectedArtist(artist);
    setShowArtworks(true);
  };

  const sculptureTypes = [
    { name: 'Sculpture sur bois', icon: <Trees size={24} />, count: 28 },
    { name: 'Sculpture sur pierre', icon: <Mountain size={24} />, count: 19 },
    { name: 'Sculpture métal', icon: <Drill size={24} />, count: 15 },
    { name: 'Sculpture terre cuite', icon: <EggFried size={24} />, count: 12 },
    { name: 'Sculpture contemporaine', icon: <Palette size={24} />, count: 24 },
    { name: 'Commandes sur mesure', icon: <PencilRuler size={24} />, count: 31 },
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
      artworks: [
        {
          id: 1,
          title: 'L\'Esprit de la Forêt',
          description: 'Sculpture monumentale en chêne, 3m de hauteur',
          price: '4 500€',
          image: 'https://picsum.photos/id/345/400/300',
          category: 'Sculpture sur bois',
          year: 2023
        },
        {
          id: 2,
          title: 'Harmonie Minérale',
          description: 'Pierre et métal fusionnés, 1.5m de hauteur',
          price: '2 800€',
          image: 'https://picsum.photos/id/346/400/300',
          category: 'Pierre & Métal',
          year: 2022
        }
      ],
      bio: 'Artiste sculpteur spécialisé dans les œuvres monumentales. Formé aux Beaux-Arts de Paris, il expose ses œuvres dans toute l\'Europe.',
      rating: 4.8,
      reviews: 42,
      specialties: ['Sculpture monumentale', 'Art sacré', 'Commandes publiques']
    },
    {
      id: 2,
      name: 'Élise Moreau',
      material: 'Bronze & Métal',
      location: 'Normandie',
      experience: '15 ans',
      description: 'Artiste contemporaine primée',
      image: 'https://picsum.photos/id/343/300/200',
      artworks: [
        {
          id: 1,
          title: 'Équilibre Urbain',
          description: 'Bronze poli, formes géométriques',
          price: '3 200€',
          image: 'https://picsum.photos/id/347/400/300',
          category: 'Bronze',
          year: 2024
        },
        {
          id: 2,
          title: 'Métamorphose',
          description: 'Acier corten patiné, mouvement fluide',
          price: '2 900€',
          image: 'https://picsum.photos/id/348/400/300',
          category: 'Métal',
          year: 2023
        }
      ],
      bio: 'Sculptrice contemporaine reconnue pour ses œuvres abstraites en métal. Lauréate du Prix National de Sculpture 2021.',
      rating: 4.9,
      reviews: 38,
      specialties: ['Art abstrait', 'Installations', 'Sculpture contemporaine']
    },
    {
      id: 3,
      name: 'Pierre Dubois',
      material: 'Terre cuite',
      location: 'Provence',
      experience: '30 ans',
      description: 'Maître artisan traditionnel',
      image: 'https://picsum.photos/id/344/300/200',
      artworks: [
        {
          id: 1,
          title: 'Les Vendangeurs',
          description: 'Terre cuite émaillée, scène traditionnelle',
          price: '1 800€',
          image: 'https://picsum.photos/id/349/400/300',
          category: 'Terre cuite',
          year: 2023
        },
        {
          id: 2,
          title: 'Sagesse Provençale',
          description: 'Bas-relief en terre cuite patinée',
          price: '2 100€',
          image: 'https://picsum.photos/id/350/400/300',
          category: 'Terre cuite',
          year: 2022
        }
      ],
      bio: 'Maître artisan céramiste perpétuant les techniques ancestrales. Formé auprès des derniers maîtres potiers de Vallauris.',
      rating: 4.7,
      reviews: 56,
      specialties: ['Céramique traditionnelle', 'Terre cuite', 'Art figuratif']
    },
  ];

  return (
    <div>
      {/* Sculpture Types */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Hammer size={24} className="mr-2" style={{ color: '#8B4513' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
            Types de sculpture
          </h2>
        </div>
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
                <div className="mr-4" style={{ color: '#8B4513' }}>
                  {type.icon}
                </div>
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
                <button className="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                        style={{ backgroundColor: '#6B8E23', color: 'white' }}>
                  <Hammer size={12} className="mr-1" />
                  Explorer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artists */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Award size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Sculpteurs d'exception
            </h2>
          </div>
          <button className="flex items-center px-4 py-2 rounded-md border font-medium"
                  style={{ borderColor: '#556B2F', color: '#556B2F' }}>
            <Users size={18} className="mr-2" />
            Voir tous les sculpteurs
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArtists.map((artist) => (
            <div
              key={artist.id}
              className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow group"
              style={{ borderColor: '#D3D3D3' }}
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3">{artist.name}</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Hammer size={16} className="mr-2" style={{ color: '#8B4513' }} />
                    <div>
                      <span className="font-medium">Matière:</span>
                      <span className="ml-2" style={{ color: '#556B2F' }}>{artist.material}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" style={{ color: '#8B4513' }} />
                    <div>
                      <span className="font-medium">Localisation:</span>
                      <span className="ml-2">{artist.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" style={{ color: '#8B4513' }} />
                    <div>
                      <span className="font-medium">Expérience:</span>
                      <span className="ml-2">{artist.experience}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{artist.description}</p>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewArtworks(artist)} 
                    className="flex-1 py-2 rounded-md border text-center font-medium flex items-center justify-center hover:bg-[#556B2F] hover:text-white transition-colors duration-300"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}
                  >
                    <Palette size={18} className="mr-2" />
                    Voir les œuvres
                  </button>
                  <button 
                    className="flex-1 py-2 rounded-md text-white font-medium flex items-center justify-center hover:bg-[#485826] transition-colors duration-200"
                    style={{ backgroundColor: '#556B2F' }}
                    onClick={() => onContactClick("Demande d'information sculpteur", artist.name)}
                  >
                    <Phone size={18} className="mr-2" />
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Section */}

      
      {/* Modal des œuvres */}
      {showArtworks && selectedArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header du modal */}
            <div className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={selectedArtist.image} 
                    alt={selectedArtist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedArtist.name}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {selectedArtist.description}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowArtworks(false);
                  setSelectedArtist(null);
                }} 
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            {/* Contenu du modal */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Section Bio */}
              <div className="p-6 border-b" style={{ borderColor: '#D3D3D3' }}>
                <div className="flex items-center mb-4">
                  <Info size={20} className="mr-2" style={{ color: '#8B4513' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#8B4513' }}>À propos de l'artiste</h3>
                </div>
                <p className="text-gray-700 mb-4">{selectedArtist.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                    <Star size={18} className="mr-2" style={{ color: '#8B4513' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#556B2F' }}>Note</p>
                      <p className="text-lg font-bold">{selectedArtist.rating}/5</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                    <MapPinIcon size={18} className="mr-2" style={{ color: '#8B4513' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#556B2F' }}>Localisation</p>
                      <p className="text-lg font-bold">{selectedArtist.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                    <Calendar size={18} className="mr-2" style={{ color: '#8B4513' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#556B2F' }}>Expérience</p>
                      <p className="text-lg font-bold">{selectedArtist.experience}</p>
                    </div>
                  </div>
                </div>
                
                {/* Spécialités */}
                <div className="mt-4">
                  <h4 className="font-medium mb-2" style={{ color: '#8B4513' }}>Spécialités :</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArtist.specialties?.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          backgroundColor: '#F0EAD6',
                          color: '#556B2F',
                          border: '1px solid #D3D3D3'
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Section Œuvres */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Palette size={20} className="mr-2" style={{ color: '#8B4513' }} />
                    <h3 className="text-lg font-bold" style={{ color: '#8B4513' }}>Œuvres de l'artiste</h3>
                  </div>
                  <span className="text-sm text-gray-500">{selectedArtist.artworks?.length} œuvres</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedArtist.artworks?.map((artwork) => (
                    <div 
                      key={artwork.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      style={{ borderColor: '#D3D3D3' }}
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={artwork.image} 
                          alt={artwork.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg" style={{ color: '#556B2F' }}>{artwork.title}</h4>
                          <span className="font-bold" style={{ color: '#8B4513' }}>{artwork.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{artwork.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-1 text-xs rounded"
                            style={{ 
                              backgroundColor: '#F0EAD6',
                              color: '#556B2F'
                            }}>
                            {artwork.category}
                          </span>
                          <span className="text-sm text-gray-500">{artwork.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SculpturePage;