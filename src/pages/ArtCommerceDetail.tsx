import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Globe, Truck, Star, Mail, Heart, Share2, Eye, X, Calendar, Clock, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ArtCommerceDetail = () => {
  const { id } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const listing = {
    id: 1,
    title: "Galerie d'Art Tropical",
    category: 'peinture',
    location: 'Saint-Denis, La Réunion',
    price: '39€/mois',
    description: "Galerie d'art spécialisée dans les œuvres tropicales et locales. Nous mettons en valeur les artistes réunionnais et leurs créations uniques inspirées par la richesse culturelle et naturelle de notre île.",
    images: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80'
    ],
    contact: {
      phone: '+262 692 123 456',
      email: 'contact@galerietropical.re',
      website: 'www.galerietropical.re'
    },
    features: ['Livraison disponible', 'Paiement en ligne', 'Site web', 'Artistes locaux', 'Certificat d\'authenticité', 'Installation sur mesure'],
    rating: 4.8,
    reviews: 24,
    deliveryOptions: [
      { name: 'Uber Connect', price: '5€', time: '2h' },
      { name: 'Livraison express', price: '8€', time: '24h' },
      { name: 'Retrait sur place', price: 'Gratuit', time: 'Immédiat' }
    ],
    hours: {
      lundi: '9h-18h',
      mardi: '9h-18h',
      mercredi: '9h-18h',
      jeudi: '9h-18h',
      vendredi: '9h-20h',
      samedi: '10h-17h',
      dimanche: 'Fermé'
    },
    artworks: [
      {
        id: 1,
        title: "Coucher de soleil à Saint-Leu",
        artist: "Marie-Louise Durand",
        price: 450,
        category: "Peinture",
        dimensions: "80x60 cm",
        technique: "Huile sur toile",
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80',
        description: "Une représentation vibrante des couchers de soleil caractéristiques de la côte ouest de La Réunion. Les couleurs chaudes et les jeux de lumière capturent l'essence même des tropiques.",
        year: 2024,
        available: true
      },
      {
        id: 2,
        title: "Sculpture 'Le Piton'",
        artist: "Jean-Philippe Morel",
        price: 1200,
        category: "Sculpture",
        dimensions: "45x30 cm",
        technique: "Bois de tamarin",
        image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        description: "Sculpture sur bois représentant le Piton de la Fournaise, symbole de la force volcanique de l'île. Réalisée dans du bois de tamarin local.",
        year: 2023,
        available: true
      },
      {
        id: 3,
        title: "Vannerie traditionnelle",
        artist: "Association des Artisans",
        price: 85,
        category: "Artisanat",
        dimensions: "35x35 cm",
        technique: "Vannerie naturelle",
        image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: "Panier traditionnel réalisé selon les techniques ancestrales de vannerie réunionnaise. Utilisation de matériaux naturels et locaux.",
        year: 2024,
        available: true
      }
    ]
  };

  // Fonction pour gérer les favoris
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // Simulation d'enregistrement en base de données
    console.log(`Commerce ${isFavorite ? 'retiré des' : 'ajouté aux'} favoris`);
    
    // Optionnel: Afficher une notification
    if (!isFavorite) {
      toast.info("✅ Commerce ajouté à vos favoris !");
    } else {
      toast.error("❌ Commerce retiré de vos favoris");
    }
  };

  // Fonction pour partager
  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  // Fonctions de partage spécifiques
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(listing.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
    setShowShareOptions(false);
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Découvrez ${listing.title} sur Art & Commerces`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    setShowShareOptions(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.info("✅ Lien copié dans le presse-papier !");
        setShowShareOptions(false);
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
        toast.error("❌ Erreur lors de la copie du lien");
      });
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Découvrez ${listing.title} sur Art & Commerces: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareOptions(false);
  };

  const ContactForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 relative">
        <button
          onClick={() => setShowContactForm(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center pr-8">
          <Mail className="h-5 w-5 mr-2 text-blue-600" />
          Contacter {listing.title}
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Phone size={20} className="text-blue-600" />
            <span className="text-slate-700 font-medium">{listing.contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Mail size={20} className="text-blue-600" />
            <span className="text-slate-700 font-medium">{listing.contact.email}</span>
          </div>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">Votre message</label>
            <textarea 
              rows="4" 
              placeholder="Bonjour, je suis intéressé par..."
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => setShowContactForm(false)}
              className="flex-1 bg-gray-200 text-slate-700 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeliveryForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full border border-gray-200 shadow-2xl relative">
        <button
          onClick={() => setShowDeliveryForm(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
          <Truck className="h-5 w-5 mr-2 text-blue-600" />
          Demander une livraison
        </h3>
        <p className="text-slate-600 mb-4">Choisissez votre option de livraison :</p>
        
        <div className="space-y-3 mb-6">
          {listing.deliveryOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer border border-gray-200 hover:border-blue-200 transition-all">
              <Truck size={20} className="text-blue-600" />
              <div className="flex-1">
                <span className="font-semibold text-slate-900 block">{option.name}</span>
                <span className="text-slate-600 text-sm">{option.time} • {option.price}</span>
              </div>
              <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
            </div>
          ))}
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">Adresse de livraison</label>
            <input 
              type="text" 
              placeholder="Votre adresse complète"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => setShowDeliveryForm(false)}
              className="flex-1 bg-gray-200 text-slate-700 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ArtworkModal = ({ artwork, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full border border-gray-200 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-slate-900">{artwork.title}</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden bg-gray-100 h-80">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Description</h4>
                <p className="text-slate-600 leading-relaxed">{artwork.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="text-slate-500 text-sm block">Artiste</span>
                  <p className="text-slate-900 font-medium">{artwork.artist}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="text-slate-500 text-sm block">Technique</span>
                  <p className="text-slate-900 font-medium">{artwork.technique}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="text-slate-500 text-sm block">Dimensions</span>
                  <p className="text-slate-900 font-medium">{artwork.dimensions}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="text-slate-500 text-sm block">Année</span>
                  <p className="text-slate-900 font-medium">{artwork.year}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">{artwork.price}€</span>
                    {artwork.available && (
                      <span className="ml-2 bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full">Disponible</span>
                    )}
                  </div>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all duration-200 font-semibold shadow-lg">
                    Acheter maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br my-12 from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Image Gallery avec bouton de retour */}
          <div className="relative">
            <div className="h-96 bg-cover bg-center relative" style={{ backgroundImage: `url(${listing.images[activeImage]})` }}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Bouton de retour dans l'image principale */}
              <div className="absolute top-4 left-4">
                <Link to="/art-commerce" className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 font-medium shadow-lg border border-white/20 hover:border-white/40 group">
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className='text-xs lg:text-md'>Retour aux Art & Commerces</span>
                </Link>
              </div>
            </div>
            
            {/* Image Thumbnails */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 ${
                    activeImage === index ? 'border-blue-500' : 'border-white'
                  } overflow-hidden`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Action Buttons avec fonctionnalités */}
            <div className="absolute top-4 right-4 flex gap-2">
              {/* Bouton Favoris */}
              <button 
                onClick={handleFavoriteClick}
                className={`bg-white/90 backdrop-blur-sm p-3 rounded-xl hover:bg-white transition-all duration-200 shadow-lg ${
                  isFavorite ? 'text-red-500' : 'text-slate-700'
                }`}
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'fill-current' : ''} 
                />
              </button>

              {/* Bouton Partage avec menu déroulant */}
              <div className="relative">
                <button 
                  onClick={handleShareClick}
                  className="bg-white/90 backdrop-blur-sm text-slate-700 p-3 rounded-xl hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <Share2 size={20} />
                </button>

                {/* Menu de partage */}
                {showShareOptions && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 min-w-48 z-50">
                    <div className="space-y-2">
                      <button
                        onClick={shareOnFacebook}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-700"
                      >
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">f</span>
                        </div>
                        <span>Partager sur Facebook</span>
                      </button>
                      
                      <button
                        onClick={shareOnTwitter}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-700"
                      >
                        <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">𝕏</span>
                        </div>
                        <span>Partager sur Twitter</span>
                      </button>
                      
                      <button
                        onClick={shareOnWhatsApp}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors text-slate-700"
                      >
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">WA</span>
                        </div>
                        <span>Partager sur WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={copyLink}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-slate-700"
                      >
                        <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs">🔗</span>
                        </div>
                        <span>Copier le lien</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Info */}
              <div className="lg:w-2/3">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h1 className="text-xl lg:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      {listing.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={20} className="text-blue-500" />
                        <span className="text-slate-600">{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-slate-900">{listing.rating}</span>
                        <span className="text-slate-500">({listing.reviews} avis)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left lg:text-right">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600">
                      {listing.price}
                    </div>
                    <div className="text-sm text-slate-500">abonnement mensuel</div>
                  </div>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  {listing.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Services inclus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Artworks Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Œuvres disponibles</h3>
                    <span className="text-slate-500">{listing.artworks.length} œuvres</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listing.artworks.map((artwork) => (
                      <div 
                        key={artwork.id}
                        className="bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-blue-300"
                        onClick={() => setSelectedArtwork(artwork)}
                      >
                        <div className="rounded-lg h-40 mb-3 overflow-hidden">
                          <img 
                            src={artwork.image} 
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{artwork.title}</h4>
                        <p className="text-slate-500 text-sm mb-2">{artwork.artist}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 font-bold">{artwork.price}€</span>
                          <span className="text-slate-400 text-sm bg-slate-100 px-2 py-1 rounded-full">{artwork.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact & Actions */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-xl p-6 sticky top-6 border border-gray-200 shadow-lg">
                  <h3 className="text-lg font-semibold mb-6 text-slate-900">Contact & Actions</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Phone size={20} className="text-blue-600" />
                      <span className="text-slate-700 font-medium">{listing.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Mail size={20} className="text-blue-600" />
                      <span className="text-slate-700 font-medium">{listing.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Globe size={20} className="text-blue-600" />
                      <span className="text-slate-700 font-medium">{listing.contact.website}</span>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      Horaires d'ouverture
                    </h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(listing.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-slate-600 capitalize">{day}</span>
                          <span className="text-slate-900 font-medium">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowContactForm(true)}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Contacter le commerçant
                    </button>
                    <button 
                      onClick={() => setSelectedArtwork(listing.artworks[0])}
                      className="w-full border-2 border-slate-900 text-slate-900 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-200 font-semibold"
                    >
                      Voir les œuvres
                    </button>
                    <button 
                      onClick={() => setShowDeliveryForm(true)}
                      className="w-full border border-gray-300 text-slate-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                    >
                      <Truck size={20} />
                      Demander une livraison
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showContactForm && <ContactForm />}
      {showDeliveryForm && <DeliveryForm />}
      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          onClose={() => setSelectedArtwork(null)} 
        />
      )}
    </div>
  );
};

export default ArtCommerceDetail;