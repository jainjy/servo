import React, { useState, useEffect } from "react";
import { ArrowLeft, Users, Tag, Search, Star, Clock, Wrench, FileText, Loader2, X } from "lucide-react";

// Interfaces
interface Metier {
  id: number;
  libelle: string;
  services: Service[];
  users: any[];
  _count: {
    services: number;
    users: number;
  };
}

interface Service {
  id: number;
  libelle: string;
  name?: string;
  description?: string;
  images: string[];
  duration?: number;
  price?: number;
  category?: Category;
  metiers?: Array<{ id: string; libelle: string; name?: string }>;
  rating?: number;
  _count?: {
    users: number;
  };
}

interface Category {
  id: number;
  name: string;
}

// Composant Modal pour les détails des services
const ServiceDetailsModal = ({ isOpen, onClose, service }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const images = service?.images || [];

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDevisClick = () => {
    setIsDevisModalOpen(true);
  };

  const handleDevisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Devis pour "${service.libelle || service.name}" envoyé !`);
      setIsDevisModalOpen(false);
      onClose();
    } catch (error) {
      alert("Erreur lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDevisModal = () => {
    setIsDevisModalOpen(false);
  };

  if (!isOpen || !service) return null;

  const serviceName = service.libelle || service.name;

  return (
    <>
      {/* Modal principale */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{serviceName}</h2>
              <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            
            {/* Image avec navigation */}
            <div className="mb-4 relative">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${serviceName} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {/* Boutons de navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                      >
                        ‹
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="space-y-3 mb-6">
              {service.price && (
                <div className="text-2xl font-bold text-green-600">{service.price} €</div>
              )}
              <p className="text-gray-600">{service.description}</p>
              
              {service.duration && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Durée: {service.duration} minutes</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Note: {service.rating || '4.5'}/5</span>
              </div>

              {service.metiers && service.metiers.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Spécialités :</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.metiers.map((metier, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {metier.libelle || metier.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-2 mt-6">
              <button onClick={onClose} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                Fermer
              </button>
              <button onClick={handleDevisClick} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Faire un Devis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Devis - SÉPARÉE de la modal principale */}
      {isDevisModalOpen && (
        <DevisModal 
          service={service}
          isOpen={isDevisModalOpen}
          onClose={handleCloseDevisModal}
          onSubmit={handleDevisSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

// Composant Modal Devis séparé
const DevisModal = ({ service, isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateSouhaitee: '',
    budget: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  if (!isOpen) return null;

  const serviceName = service.libelle || service.name;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Demande de Devis
              </h2>
              <p className="text-gray-600 text-xs lg:text-sm">
                {serviceName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 flex items-center justify-center transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input 
                name="nom" 
                placeholder="Votre nom" 
                required 
                value={formData.nom}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input 
                name="prenom" 
                placeholder="Votre prénom" 
                required 
                value={formData.prenom}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input 
                name="email" 
                type="email" 
                placeholder="votre@email.com" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input 
                name="telephone" 
                placeholder="06 12 34 56 78" 
                required 
                value={formData.telephone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse du projet
            </label>
            <input 
              name="adresse" 
              placeholder="Adresse complète du projet" 
              value={formData.adresse}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date souhaitée
              </label>
              <input 
                name="dateSouhaitee" 
                type="date" 
                min={new Date().toISOString().split("T")[0]}
                value={formData.dateSouhaitee}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget estimé *
              </label>
              <select
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Sélectionnez un budget</option>
                <option value="0-5000">0 - 5 000 €</option>
                <option value="5000-15000">5 000 - 15 000 €</option>
                <option value="15000-30000">15 000 - 30 000 €</option>
                <option value="30000+">30 000 € et plus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message supplémentaire
            </label>
            <textarea 
              name="message" 
              placeholder="Décrivez votre projet en détail..." 
              rows={4} 
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Prestation sélectionnée
            </h3>
            <p className="text-blue-800 text-sm">{serviceName}</p>
            {service?.description && (
              <p className="text-blue-600 text-xs mt-1">{service.description}</p>
            )}
          </div>

          <div className="grid lg:flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PartnersPage = () => {
  const [showServices, setShowServices] = useState(false);
  const [selectedMetier, setSelectedMetier] = useState<Metier | null>(null);
  const [metiers, setMetiers] = useState<Metier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // États pour les recherches
  const [metierSearchQuery, setMetierSearchQuery] = useState("");

  // Récupérer les métiers depuis l'API
  useEffect(() => {
    const fetchMetiers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/metiers');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des métiers');
        }
        const data = await response.json();
        setMetiers(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetiers();
  }, []);

  // Gérer le clic sur "VOIR" pour afficher les services du métier
  const handleViewServices = (metier: Metier) => {
    setSelectedMetier(metier);
    setShowServices(true);
    // NE PAS réinitialiser la recherche des services - la recherche reste
  };

  // Retour à la liste des métiers
  const handleBackToMetiers = () => {
    setSelectedMetier(null);
    setShowServices(false);
    // NE PAS réinitialiser la recherche des métiers - la recherche reste
  };

  // Ouvrir la modal de détails du service
  const handleOpenServiceModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // Fonction utilitaire pour obtenir une image par défaut
  const getDefaultImage = (metierLibelle: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
    const color = colors[metierLibelle.length % colors.length];
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="${color.replace('bg-', '')}"><rect width="32" height="32" fill="${color.replace('bg-', '')}"/><text x="16" y="20" text-anchor="middle" fill="white" font-size="12">${metierLibelle.charAt(0)}</text></svg>`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText: string) => {
    const target = e.target as HTMLImageElement;
    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23E5E7EB"/><text x="150" y="100" text-anchor="middle" fill="%23374151" font-family="Arial" font-size="14">${fallbackText}</text></svg>`;
  };

  // Filtrer les métiers
  const getFilteredMetiers = () => {
    return metiers.filter(metier =>
      metier.libelle.toLowerCase().includes(metierSearchQuery.toLowerCase())
    );
  };

  // Filtrer les services selon la recherche
  const getFilteredServices = (services: Service[]) => {
    if (!searchQuery) return services;

    return services.filter(service =>
      service.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Composant de carte pour les services
  const renderServiceCard = (service: Service, index: number) => {
    const displayName = service.libelle || service.name || 'Service';
    const displayPrice = service.price;
    const displayDescription = service.description || 'Aucune description disponible';
    const images = service.images || [];

    return (
      <div 
        key={service.id || `service-${index}`} 
        className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 relative">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Wrench className="w-12 h-12 text-gray-300" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Service
            </span>
          </div>
          {displayPrice && (
            <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1 shadow-md">
              <span className="font-bold text-blue-600 text-sm">
                {typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice} €
              </span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {displayName}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {displayDescription}
          </p>

          {/* Métiers pour les services */}
          {service.metiers && Array.isArray(service.metiers) && service.metiers.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {service.metiers.slice(0, 3).map((metier: any, idx: number) => (
                <span
                  key={metier.id || `metier-${idx}`}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {metier.libelle || metier.name || 'Métier'}
                </span>
              ))}
            </div>
          )}

          {/* Durée pour les services */}
          {service.duration && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Clock className="w-4 h-4" />
              <span>Durée: {service.duration}min</span>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-4">
              {displayPrice && (
                <div className="flex items-center gap-1">
                  <span className="font-bold text-green-600">
                    {displayPrice}€
                  </span>
                </div>
              )}
            </div>

            {/* Note moyenne */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">{service.rating || '4.5'}</span>
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
            onClick={() => handleOpenServiceModal(service)}
          >
            Voir les Détails
          </button>
        </div>
      </div>
    );
  };

  // Composant pour afficher les services d'un métier AVEC RECHERCHE SEULEMENT
  const ServicesSection = ({ metier }: { metier: Metier }) => {
    const filteredServices = getFilteredServices(metier.services);

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Modal de détails */}
        <ServiceDetailsModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          service={selectedService} 
        />

        {/* En-tête avec bouton retour et recherche */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToMetiers}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Tous les Métiers
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{metier.libelle}</h1>
                <p className="text-gray-600 mt-1">
                  {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
                  {searchQuery && ' (recherche appliquée)'}
                </p>
              </div>
            </div>

            {/* Barre de recherche seulement pour les services */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des services */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchQuery ? "Aucun service trouvé pour votre recherche" : "Aucun service disponible pour ce métier."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-blue-600 hover:text-blue-700 underline"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => renderServiceCard(service, index))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Cartes de métiers professionnelles
  const MetierCard = ({ metier, index }: { metier: Metier; index: number }) => (
    <div
      key={metier.id}
      className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => handleViewServices(metier)}
    >
      {/* Image en haut */}
      <div className="h-48 bg-gray-100">
        <img
          src={metier.services[0]?.images[0] || getDefaultImage(metier.libelle)}
          alt={metier.libelle}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, metier.libelle)}
        />
      </div>

      {/* Contenu en bas */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {metier.libelle}
        </h3>
        
        {metier.services[0]?.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {metier.services[0].description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Tag className="w-4 h-4 text-blue-500" />
              <span>{metier._count.services} services</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4 text-green-500" />
              <span>{metier._count.users} experts</span>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            handleViewServices(metier);
          }}
        >
          Voir
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );

  // Affichage principal des métiers AVEC RECHERCHE SEULEMENT
  const MetiersGrid = () => {
    const filteredMetiers = getFilteredMetiers();

    return (
      <div className="space-y-8">
        

        {/* Barre de recherche seulement pour les métiers */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un métier..."
                  value={metierSearchQuery}
                  onChange={(e) => setMetierSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
        {filteredMetiers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {metierSearchQuery ? "Aucun métier trouvé pour votre recherche" : "Aucun métier disponible pour le moment."}
            </p>
            {metierSearchQuery && (
              <button
                onClick={() => setMetierSearchQuery("")}
                className="mt-4 text-blue-600 hover:text-blue-700 underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMetiers.map((metier, index) => (
              <MetierCard key={metier.id} metier={metier} index={index} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Indicateurs de chargement et d'erreur */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Chargement des métiers...</span>
          </div>
        )}
        
        {error && !loading && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Attention</p>
            <p>{error}</p>
          </div>
        )}

        {/* Affichage conditionnel */}
        {!showServices && !loading && <MetiersGrid />}
        {showServices && selectedMetier && <ServicesSection metier={selectedMetier} />}
      </div>
    </div>
  );
};

export default PartnersPage;