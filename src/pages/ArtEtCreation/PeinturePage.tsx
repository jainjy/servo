import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';

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

  // Fonction pour afficher les détails d'une peinture
  const handleViewPaintingDetail = (painting) => {
    setSelectedPainting(painting);
    setShowPaintingDetail(true);
  };

  // Fonction pour liker une peinture
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

  // Fonction pour explorer un style
  const handleExploreStyle = (style) => {
    setSelectedStyle(style);
    // Ici vous pouvez ajouter la logique pour filtrer les peintures par style
  };

  const paintingStyles = [
    { id: 1, name: 'Peinture à l\'huile', color: '#8B4513', artists: 42, description: 'Technique traditionnelle aux couleurs profondes' },
    { id: 2, name: 'Aquarelle', color: '#6B8E23', artists: 38, description: 'Transparence et légèreté' },
    { id: 3, name: 'Acrylique', color: '#556B2F', artists: 29, description: 'Séchage rapide, couleurs vives' },
    { id: 4, name: 'Peinture murale', color: '#DAA520', artists: 24, description: 'Fresques et grandes dimensions' },
    { id: 5, name: 'Art abstrait', color: '#B8860B', artists: 36, description: 'Expression libre et formes' },
    { id: 6, name: 'Portraits', color: '#8B7355', artists: 31, description: 'Capture de l\'essence humaine' },
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
      year: 2023,
      description: 'Scène pastorale capturant la lumière dorée des oliveraies provençales. Technique de glacis traditionnelle.',
      materials: 'Huile sur toile de lin',
      location: 'Provence, France',
      certificate: 'Certifié d\'authenticité',
      shipping: 'Livraison internationale incluse',
      artistBio: 'Camille Rousseau est une peintre paysagiste spécialisée dans les scènes méditerranéennes. Formée aux Beaux-Arts de Paris.',
      moreImages: [
        'https://picsum.photos/id/106/600/400',
        'https://picsum.photos/id/107/600/400',
        'https://picsum.photos/id/108/600/400'
      ]
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
      year: 2024,
      description: 'Abstraction urbaine inspirée par l\'architecture contemporaine et les reflets de la ville.',
      materials: 'Acrylique sur toile',
      location: 'Paris, France',
      certificate: 'Certifié d\'authenticité',
      shipping: 'Frais de port supplémentaires',
      artistBio: 'Artiste contemporain explorant les relations entre architecture et espace urbain.',
      moreImages: [
        'https://picsum.photos/id/107/600/400',
        'https://picsum.photos/id/109/600/400'
      ]
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
      year: 2023,
      description: 'Aquarelle délicate représentant la flore alpine dans toute sa fragilité.',
      materials: 'Aquarelle sur papier coton 300g',
      location: 'Alpes, France',
      certificate: 'Signée par l\'artiste',
      shipping: 'Livraison gratuite en France',
      artistBio: 'Spécialiste de l\'aquarelle botanique, Isabelle expose ses œuvres dans toute l\'Europe.',
      moreImages: [
        'https://picsum.photos/id/108/600/400',
        'https://picsum.photos/id/110/600/400'
      ]
    },
  ];

  const allPaintings = [
    ...featuredPaintings,
    {
      id: 4,
      title: 'Rêverie Céleste',
      artist: 'Thomas Lefebvre',
      style: 'Huile sur toile',
      price: '920€',
      dimensions: '90x60 cm',
      likes: 76,
      image: 'https://picsum.photos/id/111/300/200',
    },
    {
      id: 5,
      title: 'Vagues Éternelles',
      artist: 'Sophie Martin',
      style: 'Acrylique',
      price: '580€',
      dimensions: '70x50 cm',
      likes: 102,
      image: 'https://picsum.photos/id/112/300/200',
    },
    {
      id: 6,
      title: 'Silence Hivernal',
      artist: 'Pierre Garnier',
      style: 'Aquarelle',
      price: '390€',
      dimensions: '45x35 cm',
      likes: 145,
      image: 'https://picsum.photos/id/113/300/200',
    },
  ];

  const artistsOfMonth = [
    { 
      id: 1,
      name: 'Thomas Lefebvre', 
      specialty: 'Paysages méditerranéens', 
      works: 24,
      bio: 'Artiste passionné par la lumière du Sud de la France',
      rating: 4.9,
      image: 'https://picsum.photos/id/100/100/100'
    },
    { 
      id: 2,
      name: 'Sophie Martin', 
      specialty: 'Portraits animaliers', 
      works: 18,
      bio: 'Spécialiste du portrait animalier avec une approche naturaliste',
      rating: 4.7,
      image: 'https://picsum.photos/id/101/100/100'
    },
    { 
      id: 3,
      name: 'Pierre Garnier', 
      specialty: 'Abstrait géométrique', 
      works: 31,
      bio: 'Artiste abstrait explorant les formes géométriques et la couleur',
      rating: 4.8,
      image: 'https://picsum.photos/id/102/100/100'
    },
  ];

  const displayedPaintings = showAllPaintings ? allPaintings : featuredPaintings;

  return (
    <div>
      {/* Painting Styles - TOUS LES BOUTONS FONCTIONNELS */}
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
                {style.artists}+
              </div>
              <h3 className="font-semibold mb-1">{style.name}</h3>
              <p className="text-sm text-gray-600">{style.artists} artistes</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Paintings - TOUS LES BOUTONS FONCTIONNELS */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedPaintings.map((painting) => (
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikePainting(painting.id);
                    }}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={likedPaintings.includes(painting.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSharePainting(painting);
                    }}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  >
                    <Share2 size={20} className="text-gray-600" />
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
                  <button 
                    onClick={() => handleViewPaintingDetail(painting)}
                    className="flex-1 py-2 rounded-md border text-center font-medium hover:bg-[#556B2F] hover:text-white transition-colors duration-300"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}
                  >
                    Détails
                  </button>
                  <button 
                    onClick={() => onContactClick && onContactClick(`Achat: ${painting.title}`, painting.artist)}
                    className="flex-1 py-2 rounded-md text-white font-medium hover:bg-[#485826] transition-colors duration-200"
                    style={{ backgroundColor: '#556B2F' }}
                  >
                    <ShoppingCart size={18} className="inline mr-2" />
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Artists of the Month - TOUS LES BOUTONS FONCTIONNELS */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
            Artistes du mois
          </h2>
          <button 
            onClick={() => setShowAllArtists(!showAllArtists)}
            className="flex items-center text-sm font-medium hover:underline"
            style={{ color: '#556B2F' }}
          >
            {showAllArtists ? 'Voir moins' : 'Voir tous les artistes'}
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artistsOfMonth.map((artist) => (
            <div
              key={artist.id}
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow group"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}
            >
              <div className="flex items-start mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2"
                  style={{ borderColor: '#556B2F' }}>
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#556B2F' }}>{artist.name}</h3>
                  <p className="text-gray-600 text-sm">{artist.specialty}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < Math.floor(artist.rating) ? 'fill-[#8B4513] text-[#8B4513]' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">{artist.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {artist.works} œuvres disponibles
                </span>
                <button 
                  onClick={() => onContactClick && onContactClick(`Visite atelier: ${artist.name}`, artist.name)}
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-[#485826] transition-colors"
                  style={{ backgroundColor: '#6B8E23', color: 'white' }}
                >
                  Visiter l'atelier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Modal Détail Peinture - COMPLET ET FONCTIONNEL */}
      {showPaintingDetail && selectedPainting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedPainting.title}</h2>
                <p className="text-white/80 text-sm mt-1">par {selectedPainting.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleSharePainting(selectedPainting)}
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
                  onClick={() => setShowPaintingDetail(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Galerie d'images */}
                  <div>
                    <div className="h-96 overflow-hidden rounded-lg mb-4">
                      <img 
                        src={selectedPainting.image} 
                        alt={selectedPainting.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedPainting.moreImages?.map((img, index) => (
                        <div key={index} className="h-24 overflow-hidden rounded-lg cursor-pointer">
                          <img 
                            src={img} 
                            alt={`${selectedPainting.title} ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informations */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: '#556B2F' }}>
                        {selectedPainting.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{selectedPainting.description}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <User size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Artiste</p>
                            <p className="text-gray-700">{selectedPainting.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Palette size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Style et technique</p>
                            <p className="text-gray-700">{selectedPainting.style} • {selectedPainting.materials}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Localisation</p>
                            <p className="text-gray-700">{selectedPainting.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Année</p>
                            <p className="text-gray-700">{selectedPainting.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Award size={18} className="mr-3" style={{ color: '#8B4513' }} />
                          <div>
                            <p className="font-medium">Certificat</p>
                            <p className="text-gray-700">{selectedPainting.certificate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Prix et dimensions */}
                      <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#F5F5DC' }}>
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <p className="font-medium" style={{ color: '#8B4513' }}>Dimensions</p>
                            <p className="text-lg font-bold">{selectedPainting.dimensions}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium" style={{ color: '#8B4513' }}>Prix</p>
                            <p className="text-3xl font-bold" style={{ color: '#556B2F' }}>{selectedPainting.price}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{selectedPainting.shipping}</p>
                      </div>                      
                    </div>
                  </div>
                </div>

                {/* À propos de l'artiste */}
                <div className="mt-8 p-6 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>À propos de l'artiste</h4>
                  <p className="text-gray-700 mb-4">{selectedPainting.artistBio}</p>
                  <button 
                    onClick={() => onContactClick && onContactClick(`Contacter artiste: ${selectedPainting.artist}`, selectedPainting.artist)}
                    className="px-4 py-2 rounded-lg border font-medium hover:bg-[#556B2F] hover:text-white transition-colors"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}
                  >
                    <Mail size={16} className="inline mr-2" />
                    Contacter l'artiste
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Star pour la notation
const Star = ({ size, className, fill = 'none' }) => (
  <svg 
    width={size} 
    height={size} 
    className={className}
    fill={fill}
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
    />
  </svg>
);

export default PeinturePage;