import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Globe, Truck, Star, Mail, Heart, Share2, Eye, X, Calendar, Clock, Shield, CheckCircle, ShoppingBag } from 'lucide-react';
import { getEmailClient } from "@/components/utils/UserUtils";
import { useCart } from '@/components/contexts/CartContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/lib/api"
import LoadingSpinner from '@/components/Loading/LoadingSpinner';

const ArtCommerceDetail = () => {
  const { id } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const isAuthenticated = !!localStorage.getItem('auth-token') && !!localStorage.getItem('user-data');

  const navigate = useNavigate();
  // États pour les données dynamiques
  const [service, setService] = useState(null);
  const [error, setError] = useState("");
  const [loadingService, setLoadingService] = useState(true);
  const [oeuvres, setOeuvres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOeuvres, setLoadingOeuvres] = useState(true);
  const [selectedArtworkIndex, setSelectedArtworkIndex] = useState(0);

  const mainCategoryNames = [
    "art",
    "commerce",
    "peinture",
    "sculptures",
    "artisanat",
    "boutique",
  ];

  const features = ['Livraison disponible', 'Paiement en ligne', 'Site web', 'Artistes locaux', 'Certificat d\'authenticité', 'Installation sur mesure']

  // Charger les données du service
  useEffect(() => {
    const fetchService = async () => {
      try {
        console.log("🔄 Tentative de récupération du service ID:", id);
        const res = await api.get(`/services/${id}`);
        console.log("✅ Réponse reçue:", res.data);
        setService(res.data);
        setError("");
      } catch (err) {
        console.error("❌ Erreur complète:", {
          url: err.config?.url,
          method: err.config?.method,
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });

        if (err.response?.status === 404) {
          setError(`Service introuvable (ID: ${id})`);
        } else if (err.response?.status === 500) {
          setError("Erreur serveur");
        } else {
          setError("Erreur de connexion");
        }
      } finally {
        setLoadingService(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  // Charger les œuvres
  useEffect(() => {
    const fetchOeuvresData = async () => {
      try {
        const resOeuvres = await api("/oeuvre/all");
        const dataOeuvres = await resOeuvres.data;

        const resCategories = await api("/oeuvre/categories");
        const dataCategories = await resCategories.data;

        const filteredOeuvres = Array.isArray(dataOeuvres)
          ? dataOeuvres.filter(
            (artwork) =>
              artwork.category &&
              mainCategoryNames.includes(artwork.category.name.toLowerCase())
          )
          : [];

        setOeuvres(filteredOeuvres);
        setCategories(Array.isArray(dataCategories) ? dataCategories : []);
      } catch (err) {
        console.error("Erreur lors du chargement des œuvres :", err);
      } finally {
        setLoadingOeuvres(false);
      }
    };

    fetchOeuvresData();
  }, [id]);

  // Gestion des favoris
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.info("✅ Commerce ajouté à vos favoris !");
    } else {
      toast.error("❌ Commerce retiré de vos favoris");
    }
  };

  // Gestion du partage
  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(service?.name || '');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
    setShowShareOptions(false);
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Découvrez ${service?.name || ''} sur Art & Commerces`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    setShowShareOptions(false);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Découvrez ${service?.name || ''} sur Art & Commerces: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
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

  // Formulaire de contact
  const ContactForm = ({ service, setShowContactForm }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const emailClient = getEmailClient();


    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!emailClient) return setFeedback("Vous devez être connecté.");
      if (!message.trim()) return setFeedback("Le message ne peut pas être vide.");

      setLoading(true);
      setFeedback("");

      try {
        const payload = {
          email: emailClient,
          subject: "Contact depuis le site",
          message,
        };

        const res = await api.post("/mail", payload);

        if (res.status === 200) {
          toast.success(`Message envoyé avec succès !`, {
            position: "top-center",
            autoClose: 3000,
          });
          setMessage("");
        } else {
          setFeedback(res.data.error || "Erreur lors de l'envoi.");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setFeedback("Impossible d'envoyer le message.");
      } finally {
        setLoading(false);
      }
    };

    return (
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
            Contacter {service?.name}
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Mail size={20} className="text-blue-600" />
              <span className="text-slate-700 font-medium">{service?.email || "Email non disponible"}</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Mail size={20} className="text-green-600" />
              <span className="text-slate-700 font-medium">{emailClient || "Non connecté"}</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Phone size={20} className="text-blue-600" />
              <span className="text-slate-700 font-medium">{service?.phone || "Téléphone non disponible"}</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Votre message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bonjour, je suis intéressé par..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
              />
            </div>

            {feedback && <p className="text-sm text-red-500">{feedback}</p>}

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
                disabled={loading}
                className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg disabled:opacity-50"
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal d'œuvre d'art
  const ArtworkModal = ({ artwork, onClose }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
      artwork.name = artwork.libelle;
      addToCart(artwork);
      toast.success(`${artwork.libelle} a été ajouté au panier !`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full border border-gray-200 max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-slate-900">{artwork.libelle}</h3>
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
                  src={artwork.images && artwork.images.length > 0 ? artwork.images[0] : "/placeholder.png"}
                  alt={artwork.libelle || "Artwork"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{artwork.libelle || "Nom non défini"}</h2>
                  <p className="text-slate-500">
                    {artwork.category?.name || "Catégorie non définie"} | {artwork.duration ? `${artwork.duration} min` : "Durée non précisée"}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Description</h4>
                  <p className="text-slate-600 leading-relaxed">{artwork.description || "Aucune description disponible"}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">{artwork.price ? `${artwork.price}€` : "Prix non défini"}</span>
                      {artwork.available && (
                        <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full">Disponible</span>
                      )}
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all duration-200 font-semibold shadow-lg"
                    >
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
  };

  // Affichage du chargement
  if (loadingService) {
    return (
      <LoadingSpinner text='Chargement du service' />
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link
              to="/art-commerce"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Retour aux Art & Commerces
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si pas de service trouvé
  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Service non trouvé</h1>
          <Link
            to="/art-commerce"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux Art & Commerces
          </Link>
        </div>
      </div>
    );
  }

  const emailClient = getEmailClient();

  // Rendu principal avec données dynamiques
  return (
    <div className="min-h-screen bg-gradient-to-br my-12 from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

          {/* Image Gallery */}
          <div className="relative">

            <div className="h-96 bg-cover bg-center relative" style={{
              backgroundImage: `url(${service.images && service.images.length > 0 ? service.images[0] : '/placeholder.png'})`
            }}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              <div className="absolute top-4 left-4">
                <Link to="/art-commerce" className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 font-medium shadow-lg border border-white/20 hover:border-white/40 group">
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className='text-xs lg:text-md'>Retour aux Art & Commerces</span>
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">

              <button
                onClick={handleFavoriteClick}
                className={`bg-white/90 backdrop-blur-sm p-3 rounded-xl hover:bg-white transition-all duration-200 shadow-lg ${isFavorite ? 'text-red-500' : 'text-slate-700'}`}
              >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
              </button>

              <div className="relative">
                <button
                  onClick={handleShareClick}
                  className="bg-white/90 backdrop-blur-sm text-slate-700 p-3 rounded-xl hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <Share2 size={20} />
                </button>

                {showShareOptions && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 min-w-48 z-50">
                    <div className="space-y-2">
                      <button onClick={shareOnFacebook} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-700">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">f</span>
                        </div>
                        <span>Partager sur Facebook</span>
                      </button>
                      <button onClick={shareOnTwitter} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-700">
                        <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">𝕏</span>
                        </div>
                        <span>Partager sur Twitter</span>
                      </button>
                      <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors text-slate-700">
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">WA</span>
                        </div>
                        <span>Partager sur WhatsApp</span>
                      </button>
                      <button onClick={copyLink} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-slate-700">
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
                      {service.libelle || "Nom du service"}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={20} className="text-blue-500" />
                        <span className="text-slate-600">{service.location || "Localisation non précisée"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-slate-900">{service.rating || "N/A"}</span>
                        <span className="text-slate-500">({service.reviews || 0} avis)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  {service.description || "Aucune description disponible"}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Services inclus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features && features.length > 0 ? (
                      features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
                          <span className="text-slate-700 font-medium">{feature}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-4 text-slate-500">
                        Aucun service spécifié
                      </div>
                    )}
                  </div>
                </div>

                {/* Artworks Section */}
                <div className="mb-8">

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Œuvres disponibles</h3>
                    <span className="text-slate-500">{oeuvres.length} œuvres</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingOeuvres ? (
                      <div className="col-span-full text-center py-16 text-gray-500">
                        Chargement des œuvres...
                      </div>
                    ) : oeuvres.length > 0 ? (
                      oeuvres.map((artwork) => {
                        const cat = artwork.category?.name || categories.find((c) => c.id === artwork.categoryId)?.name || "—";
                        let imageSrc = "";
                        if (Array.isArray(artwork.images)) {
                          imageSrc = artwork.images[0];
                        } else if (typeof artwork.images === "string") {
                          imageSrc = artwork.images.split(",")[0];
                        } else if (artwork.image) {
                          imageSrc = artwork.image;
                        }

                        return (
                          <div
                            key={artwork.id}
                            className="bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-blue-300"
                            onClick={() => {
                              const index = oeuvres.findIndex(oeuvre => oeuvre.id === artwork.id);
                              setSelectedArtworkIndex(index);
                              navigate(`/art-commerce/${artwork.id}`);
                            }}

                          >
                            <div className="rounded-lg h-40 mb-3 overflow-hidden flex justify-center items-center bg-gray-50">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt={artwork.libelle || artwork.title || "Œuvre"}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <span className="text-gray-400 text-sm">Aucune image</span>
                              )}
                            </div>

                            <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {artwork.libelle || artwork.title || "Sans titre"}
                            </h4>

                            <p className="text-slate-500 text-sm mb-2 line-clamp-2">
                              {artwork.description || "Aucune description disponible"}
                            </p>

                            <p className="text-slate-400 text-sm mb-2">
                              {artwork.artist || "Auteur inconnu"}
                            </p>

                            <div className="flex justify-between items-center">
                              <span className="text-blue-600 font-bold">
                                {artwork.price ? `${artwork.price} €` : "Prix non défini"}
                              </span>
                              <span className="text-slate-400 text-sm bg-slate-100 px-2 py-1 rounded-full">
                                {cat}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-16 text-gray-500">
                        Aucune œuvre disponible
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Contact & Actions */}
              <div className="lg:w-1/3">

                <div className="bg-white rounded-xl p-6 sticky top-6 border border-gray-200 shadow-lg">

                  <h3 className="text-lg font-semibold mb-6 text-slate-900">Contact & Actions</h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Mail size={20} className="text-blue-600" />
                      <span className="text-slate-700 font-medium">{service.mail || "Non disponible"}</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Mail size={20} className="text-blue-600" />
                      <span className="text-slate-700 font-medium">{emailClient || "Non disponible"}</span>
                    </div>

                  </div>

                  <div className="space-y-3">

                    <button
                      onClick={() => isAuthenticated ? setShowContactForm(true) : alert('⚠️ Veuillez vous connecter pour contacter')}
                      disabled={!isAuthenticated}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl
                        ${isAuthenticated
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      Contacter le commerçant
                    </button>

                    <button
                      onClick={() => isAuthenticated ? setSelectedArtwork(oeuvres[selectedArtworkIndex]) : alert('⚠️ Veuillez vous connecter pour voir les œuvres')}
                      disabled={!isAuthenticated || oeuvres.length === 0}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 transition-all duration-200
    ${isAuthenticated && oeuvres.length > 0
                          ? 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'}
  `}
                    >
                      <ShoppingBag size={20} />
                      Acheter
                    </button>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showContactForm && (
        <ContactForm
          service={service}
          setShowContactForm={setShowContactForm}
        />
      )}

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