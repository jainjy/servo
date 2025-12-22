import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  EggFried, 
  Scissors, 
  Briefcase, 
  Gem,
  Wine,
  ShoppingBasket,
  BaggageClaim,
  Users,
  Award,
  Shield,
  Calendar,
  Tag,
  Phone,
  Eye,
  Heart,
  BookOpen,
  Target,
  DollarSign,
  X,
  Info,
  Share2,
  Mail,
  ShoppingCart,
  ChevronRight,
  Check,
  ExternalLink,
  Download,
  Printer,
  Filter,
  Search,
  Bookmark
} from 'lucide-react';

interface ArtisanatPageProps {
  searchQuery?: string;
  onContactClick?: (subject: string, recipientName?: string) => void;
}

const ArtisanatPage: React.FC<ArtisanatPageProps> = ({ searchQuery, onContactClick }) => {
  const [showArtisanDetail, setShowArtisanDetail] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [showAllArtisans, setShowAllArtisans] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedItems, setLikedItems] = useState([]);
  const [showWorkshopDetail, setShowWorkshopDetail] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  // Fonctions handlers
  const handleViewArtisanDetail = (artisan) => {
    setSelectedArtisan(artisan);
    setShowArtisanDetail(true);
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    // Ici vous pouvez ajouter la logique pour filtrer les artisans par catégorie
  };

  const handleLikeItem = (itemId) => {
    if (likedItems.includes(itemId)) {
      setLikedItems(likedItems.filter(id => id !== itemId));
    } else {
      setLikedItems([...likedItems, itemId]);
    }
  };

  const handleViewWorkshopDetail = (workshop) => {
    setSelectedWorkshop(workshop);
    setShowWorkshopDetail(true);
  };

  const handleShareArtisan = (artisan) => {
    if (navigator.share) {
      navigator.share({
        title: artisan.name,
        text: artisan.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const craftCategories = [
    { 
      id: 1, 
      name: 'Céramique & Poterie', 
      icon: <EggFried size={28} />, 
      items: 156,
      description: 'Pièces uniques en terre cuite, grès et porcelaine'
    },
    { 
      id: 2, 
      name: 'Tissage & Textile', 
      icon: <Scissors size={28} />, 
      items: 89,
      description: 'Tissages traditionnels et créations textiles'
    },
    { 
      id: 3, 
      name: 'Travail du cuir', 
      icon: <Briefcase size={28} />, 
      items: 72,
      description: 'Maroquinerie fine et accessoires en cuir'
    },
    { 
      id: 4, 
      name: 'Bijoux artisanaux', 
      icon: <Gem size={28} />, 
      items: 203,
      description: 'Créations uniques en métal, pierres et perles'
    },
    { 
      id: 5, 
      name: 'Menuiserie fine', 
      icon: <Target size={28} />, 
      items: 64,
      description: 'Meubles et objets en bois massif'
    },
    { 
      id: 6, 
      name: 'Verre soufflé', 
      icon: <Wine size={28} />, 
      items: 42,
      description: 'Verre artistique soufflé à la bouche'
    },
    { 
      id: 7, 
      name: 'Vannerie', 
      icon: <ShoppingBasket size={28} />, 
      items: 38,
      description: 'Paniers et objets en osier et rotin'
    },
    { 
      id: 8, 
      name: 'Maroquinerie', 
      icon: <BaggageClaim size={28} />, 
      items: 57,
      description: 'Sacs et accessoires en cuir de qualité'
    },
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
      bio: 'Atelier familial spécialisé dans la céramique traditionnelle depuis 3 générations. Techniques de tournage, modelage et émaillage.',
      years: 25,
      products: [
        { name: 'Vase cylindrique', price: '85€', image: 'https://picsum.photos/id/228/200/200' },
        { name: 'Service à thé', price: '120€', image: 'https://picsum.photos/id/229/200/200' },
        { name: 'Pots à épices', price: '45€', image: 'https://picsum.photos/id/230/200/200' }
      ],
      techniques: ['Tournage', 'Émaillage', 'Cuisson au bois'],
      certifications: ['Maître Artisan', 'EPV'],
      contact: {
        email: 'contact@terre-feu.fr',
        phone: '04 93 64 12 34',
        website: 'www.terre-feu.fr'
      }
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
      bio: 'Artisan maroquinier spécialisé dans le cuir végétal tanné. Créations sur mesure et pièces uniques.',
      years: 12,
      products: [
        { name: 'Sac besace', price: '280€', image: 'https://picsum.photos/id/231/200/200' },
        { name: 'Portefeuille', price: '95€', image: 'https://picsum.photos/id/232/200/200' },
        { name: 'Ceinture', price: '120€', image: 'https://picsum.photos/id/233/200/200' }
      ],
      techniques: ['Découpe main', 'Couture sellier', 'Patine naturelle'],
      certifications: ['Artisan d\'Art'],
      contact: {
        email: 'info@mainsdor.fr',
        phone: '04 97 05 43 21',
        website: 'www.mainsdor.fr'
      }
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
      bio: 'Ébéniste spécialisé dans le mobilier contemporain en bois locaux. Restauration et création.',
      years: 18,
      products: [
        { name: 'Table basse chêne', price: '450€', image: 'https://picsum.photos/id/234/200/200' },
        { name: 'Chaise design', price: '320€', image: 'https://picsum.photos/id/235/200/200' },
        { name: 'Étagère murale', price: '280€', image: 'https://picsum.photos/id/236/200/200' }
      ],
      techniques: ['Ébénisterie', 'Marqueterie', 'Finitions naturelles'],
      certifications: ['Maître Artisan', 'Entreprise du Patrimoine Vivant'],
      contact: {
        email: 'atelier@bois-massif.fr',
        phone: '03 84 24 56 78',
        website: 'www.bois-massif.fr'
      }
    },
  ];

  const allArtisans = [
    ...featuredArtisans,
    {
      id: 4,
      name: 'Verre & Lumière',
      craft: 'Verre soufflé',
      location: 'Bièvre',
      rating: 4.7,
      description: 'Créations en verre soufflé artisanal',
      delivery: 'Sous 15 jours',
      image: 'https://picsum.photos/id/237/300/200',
    },
    {
      id: 5,
      name: 'Fibres & Couleurs',
      craft: 'Tissage',
      location: 'Aubusson',
      rating: 4.9,
      description: 'Tapisseries et tissages traditionnels',
      delivery: 'Sur mesure',
      image: 'https://picsum.photos/id/238/300/200',
    },
    {
      id: 6,
      name: 'Bijoux d\'Exception',
      craft: 'Bijouterie',
      location: 'Paris',
      rating: 4.6,
      description: 'Créations joaillières uniques',
      delivery: 'Sous 5 jours',
      image: 'https://picsum.photos/id/239/300/200',
    },
  ];

  const workshops = [
    { 
      id: 1,
      title: 'Initiation à la poterie', 
      duration: '3h', 
      price: '65€', 
      slots: 4,
      icon: <EggFried size={20} />,
      description: 'Découverte du tournage et modelage de l\'argile',
      instructor: 'Jean Dupont',
      location: 'Atelier Terre et Feu',
      date: '15 Avril 2024',
      materials: 'Tout inclus',
      level: 'Débutant'
    },
    { 
      id: 2,
      title: 'Création de bijoux', 
      duration: '2h30', 
      price: '45€', 
      slots: 6,
      icon: <Gem size={20} />,
      description: 'Fabrication de bijoux en argent et pierres naturelles',
      instructor: 'Marie Laurent',
      location: 'Bijoux d\'Exception',
      date: '22 Avril 2024',
      materials: 'Matériel fourni',
      level: 'Tous niveaux'
    },
    { 
      id: 3,
      title: 'Atelier cuir débutant', 
      duration: '4h', 
      price: '85€', 
      slots: 3,
      icon: <Briefcase size={20} />,
      description: 'Réalisation d\'un porte-cartes en cuir végétal',
      instructor: 'Pierre Martin',
      location: 'Les Mains d\'Or',
      date: '29 Avril 2024',
      materials: 'Cuir et outils fournis',
      level: 'Débutant'
    },
  ];

  const displayedArtisans = showAllArtisans ? allArtisans : featuredArtisans;
  const displayedCategories = showAllCategories ? craftCategories : craftCategories.slice(0, 8);

  return (
    <div>
      {/* Craft Categories - TOUS LES BOUTONS FONCTIONNELS */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Catégories d'artisanat
            </h2>
          </div>
          <button 
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="flex items-center text-sm font-medium hover:underline"
            style={{ color: '#556B2F' }}
          >
            {showAllCategories ? 'Voir moins' : 'Voir plus'}
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
              style={{
                borderColor: '#D3D3D3',
                backgroundColor: 'white',
              }}
              onClick={() => handleViewCategory(category)}
            >
              <div className="mb-4" style={{ color: '#8B4513' }}>
                {category.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{category.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <BookOpen size={14} className="mr-1" />
                  {category.items} créations
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewCategory(category);
                  }}
                  className="px-2 py-1 rounded text-xs font-medium flex items-center hover:bg-[#485826] transition-colors"
                  style={{ backgroundColor: '#6B8E23', color: 'white' }}
                >
                  <Eye size={12} className="mr-1" />
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artisans - TOUS LES BOUTONS FONCTIONNELS */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Award size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Artisans sélectionnés
            </h2>
          </div>
          <button 
            onClick={() => setShowAllArtisans(!showAllArtisans)}
            className="flex items-center px-4 py-2 rounded-md border font-medium hover:bg-[#556B2F] hover:text-white transition-colors"
            style={{ borderColor: '#556B2F', color: '#556B2F' }}
          >
            <Users size={18} className="mr-2" />
            {showAllArtisans ? 'Voir moins' : 'Voir tous les artisans'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow group"
              style={{ borderColor: '#D3D3D3' }}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeItem(`artisan-${artisan.id}`);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  <Heart 
                    size={18} 
                    className={likedItems.includes(`artisan-${artisan.id}`) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                  />
                </button>
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 hover:bg-[#556B2F] hover:text-white transition-colors cursor-pointer"
                        style={{ backgroundColor: '#F0F0F0', color: '#556B2F' }}
                        onClick={() => handleViewCategory({ name: artisan.craft })}>
                    <Tag size={14} className="mr-1" />
                    {artisan.craft}
                  </span>
                  <p className="text-gray-600">{artisan.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Livraison: {artisan.delivery}
                  </div>
                  <button 
                    onClick={() => handleShareArtisan(artisan)}
                    className="p-1 hover:text-[#556B2F] transition-colors"
                    title="Partager"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewArtisanDetail(artisan)}
                    className="flex-1 py-2 rounded-md border text-center font-medium flex items-center justify-center hover:bg-[#556B2F] hover:text-white transition-colors duration-300"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}
                  >
                    <Eye size={18} className="mr-2" />
                    Voir les créations
                  </button>
                  <button 
                    onClick={() => onContactClick && onContactClick(`Contact: ${artisan.name}`, artisan.name)}
                    className="flex-1 py-2 rounded-md text-white font-medium flex items-center justify-center hover:bg-[#485826] transition-colors duration-200"
                    style={{ backgroundColor: '#556B2F' }}
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

      {/* Workshops Section - TOUS LES BOUTONS FONCTIONNELS */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calendar size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Ateliers découverte
            </h2>
          </div>
          <button 
            onClick={() => onContactClick && onContactClick('Demande ateliers', 'Équipe des ateliers')}
            className="flex items-center text-sm font-medium hover:underline"
            style={{ color: '#556B2F' }}
          >
            Voir tous les ateliers
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="p-6 rounded-lg border group hover:shadow-lg transition-shadow cursor-pointer"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#F9F9F9' }}
              onClick={() => handleViewWorkshopDetail(workshop)}
            >
              <div className="flex items-center mb-3">
                <div className="mr-3" style={{ color: '#8B4513' }}>
                  {workshop.icon}
                </div>
                <h3 className="font-bold text-lg">{workshop.title}</h3>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Durée:
                  </span>
                  <span className="font-medium">{workshop.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <DollarSign size={14} className="mr-1" />
                    Prix:
                  </span>
                  <span className="font-bold" style={{ color: '#8B4513' }}>
                    {workshop.price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Users size={14} className="mr-1" />
                    Places:
                  </span>
                  <span className={`font-medium ${workshop.slots < 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {workshop.slots} places
                  </span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewWorkshopDetail(workshop);
                }}
                className="w-full py-3 rounded-md text-white font-medium flex items-center justify-center hover:bg-[#485826] transition-colors"
                style={{ backgroundColor: '#556B2F' }}
              >
                <Calendar size={18} className="mr-2" />
                Réserver
              </button>
            </div>
          ))}
        </div>
      </div>



      {/* Modal Détail Artisan - COMPLET ET FONCTIONNEL */}
      {showArtisanDetail && selectedArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white">
                  <img 
                    src={selectedArtisan.image} 
                    alt={selectedArtisan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedArtisan.name}</h2>
                  <div className="flex items-center text-white/80 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    {selectedArtisan.location} • 
                    <Star size={14} className="ml-2 mr-1 fill-current" />
                    {selectedArtisan.rating}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleShareArtisan(selectedArtisan)}
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
                  onClick={() => setShowArtisanDetail(false)}
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
                    {/* À propos */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#8B4513' }}>
                        <Info size={20} className="mr-2" />
                        À propos de l'artisan
                      </h3>
                      <p className="text-gray-700 mb-4">{selectedArtisan.bio}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                          <p className="font-medium" style={{ color: '#556B2F' }}>Expérience</p>
                          <p className="text-lg font-bold">{selectedArtisan.years} ans</p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                          <p className="font-medium" style={{ color: '#556B2F' }}>Livraison</p>
                          <p className="text-lg font-bold">{selectedArtisan.delivery}</p>
                        </div>
                      </div>
                    </div>

                    {/* Techniques */}
                    {selectedArtisan.techniques && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Techniques maîtrisées</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedArtisan.techniques.map((tech, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 rounded-full text-sm"
                              style={{ 
                                backgroundColor: '#F0EAD6',
                                color: '#556B2F',
                                border: '1px solid #D3D3D3'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Produits */}
                    {selectedArtisan.products && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Produits phares</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedArtisan.products.map((product, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden" style={{ borderColor: '#D3D3D3' }}>
                              <div className="h-32 overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                                <p className="font-bold" style={{ color: '#8B4513' }}>{product.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Colonne droite - Contact et actions */}
                  <div>
                    {/* Certifications */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-3" style={{ color: '#8B4513' }}>Certifications</h3>
                      <div className="space-y-2">
                        {selectedArtisan.certifications?.map((cert, index) => (
                          <div key={index} className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                            <Shield size={18} className="mr-2" style={{ color: '#556B2F' }} />
                            <span className="font-medium">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    {selectedArtisan.contact && (
                      <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
                        <h3 className="font-bold mb-3" style={{ color: '#8B4513' }}>Contact</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail size={16} className="mr-2" style={{ color: '#8B4513' }} />
                            <span className="text-sm">{selectedArtisan.contact.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={16} className="mr-2" style={{ color: '#8B4513' }} />
                            <span className="text-sm">{selectedArtisan.contact.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <ExternalLink size={16} className="mr-2" style={{ color: '#8B4513' }} />
                            <a href={`https://${selectedArtisan.contact.website}`} className="text-sm hover:underline" style={{ color: '#556B2F' }}>
                              {selectedArtisan.contact.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      
                      <button 
                        onClick={() => onContactClick && onContactClick(`Devis: ${selectedArtisan.name}`, selectedArtisan.name)}
                        className="w-full py-3 rounded-lg border font-medium hover:bg-gray-50 transition-colors"
                        style={{ borderColor: '#556B2F', color: '#556B2F' }}
                      >
                        Demander un devis sur mesure
                      </button>
                      <button 
                        onClick={() => handleLikeItem(`artisan-${selectedArtisan.id}`)}
                        className={`w-full py-3 rounded-lg border font-medium flex items-center justify-center ${
                          likedItems.includes(`artisan-${selectedArtisan.id}`) 
                            ? 'bg-[#8B4513] text-white border-[#8B4513]' 
                            : 'hover:bg-[#556B2F] hover:text-white'
                        }`}
                        style={{ borderColor: '#556B2F', color: likedItems.includes(`artisan-${selectedArtisan.id}`) ? 'white' : '#556B2F' }}
                      >
                        <Heart 
                          size={20} 
                          className="mr-2" 
                          fill={likedItems.includes(`artisan-${selectedArtisan.id}`) ? 'white' : 'none'}
                        />
                        {likedItems.includes(`artisan-${selectedArtisan.id}`) ? 'Favori' : 'Ajouter aux favoris'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Atelier - COMPLET ET FONCTIONNEL */}
      {showWorkshopDetail && selectedWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: '#D3D3D3', backgroundColor: '#556B2F' }}>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedWorkshop.title}</h2>
                <p className="text-white/80 text-sm mt-1">{selectedWorkshop.description}</p>
              </div>
              <button 
                onClick={() => setShowWorkshopDetail(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Clock size={18} className="mr-3" style={{ color: '#8B4513' }} />
                  <div className="flex-1">
                    <p className="font-medium">Durée</p>
                    <p className="text-gray-700">{selectedWorkshop.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-3" style={{ color: '#8B4513' }} />
                  <div className="flex-1">
                    <p className="font-medium">Date</p>
                    <p className="text-gray-700">{selectedWorkshop.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-3" style={{ color: '#8B4513' }} />
                  <div className="flex-1">
                    <p className="font-medium">Lieu</p>
                    <p className="text-gray-700">{selectedWorkshop.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User size={18} className="mr-3" style={{ color: '#8B4513' }} />
                  <div className="flex-1">
                    <p className="font-medium">Animateur</p>
                    <p className="text-gray-700">{selectedWorkshop.instructor}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Tag size={18} className="mr-3" style={{ color: '#8B4513' }} />
                  <div className="flex-1">
                    <p className="font-medium">Niveau</p>
                    <p className="text-gray-700">{selectedWorkshop.level}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase size={18} className="mr-3" style={{ color: '#8B4513' }} />
                  <div className="flex-1">
                    <p className="font-medium">Matériel</p>
                    <p className="text-gray-700">{selectedWorkshop.materials}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#F5F5DC' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium" style={{ color: '#8B4513' }}>Prix</p>
                    <p className="text-2xl font-bold" style={{ color: '#556B2F' }}>{selectedWorkshop.price}</p>
                    <p className="text-sm text-gray-600">par personne</p>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#8B4513' }}>Places restantes</p>
                    <p className={`text-2xl font-bold ${selectedWorkshop.slots < 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedWorkshop.slots}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowWorkshopDetail(false)}
                  className="flex-1 py-3 rounded-lg border font-medium hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#556B2F', color: '#556B2F' }}
                >
                  Retour
                </button>
                <button 
                  onClick={() => onContactClick && onContactClick(`Inscription: ${selectedWorkshop.title}`, selectedWorkshop.instructor)}
                  className="flex-1 py-3 rounded-lg text-white font-medium hover:bg-[#485826] transition-colors"
                  style={{ backgroundColor: '#556B2F' }}
                >
                  <Calendar size={20} className="inline mr-2" />
                  Réserver maintenant
                </button>
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

// Composant User (manquant dans lucide-react)
const User = ({ size, className, style }) => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
    />
  </svg>
);

export default ArtisanatPage;