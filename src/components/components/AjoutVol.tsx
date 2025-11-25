import React, { useState } from 'react';
import { 
  X, 
  Plane, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Luggage,
  Utensils,
  Wifi,
  Tv,
  Power
} from 'lucide-react';
import api from '../../lib/api'; // Import de votre instance axios configurée

const AjoutVolModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    idPrestataire: '',
    compagnie: '',
    numeroVol: '',
    departVille: '',
    departDateHeure: '',
    arriveeVille: '',
    arriveeDateHeure: '',
    duree: '',
    escales: 0,
    prix: 0,
    classe: 'economy',
    services: [],
    image: '',
    imageFile: null
  });

  const [loading, setLoading] = useState(false);

  const serviceOptions = [
    { id: 'meal', label: 'Repas', icon: Utensils },
    { id: 'baggage', label: 'Bagage cabine', icon: Luggage },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'entertainment', label: 'Divertissement', icon: Tv },
    { id: 'power', label: 'Prises électriques', icon: Power }
  ];

  const classOptions = [
    { value: 'economy', label: 'Économique' },
    { value: 'premium', label: 'Premium Économique' },
    { value: 'business', label: 'Affaires' },
    { value: 'first', label: 'Première' }
  ];

  const handleServiceChange = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Ajouter les champs texte
      submitData.append("compagnie", formData.compagnie);
      submitData.append("numeroVol", formData.numeroVol);
      submitData.append("departVille", formData.departVille);
      submitData.append("departDateHeure", formData.departDateHeure);
      submitData.append("arriveeVille", formData.arriveeVille);
      submitData.append("arriveeDateHeure", formData.arriveeDateHeure);
      submitData.append("duree", formData.duree);
      submitData.append("escales", formData.escales.toString());
      submitData.append("prix", formData.prix.toString());
      submitData.append("classe", formData.classe);
      submitData.append("services", JSON.stringify(formData.services));

      // Ajouter l'image si elle existe
      if (formData.imageFile) {
        submitData.append("image", formData.imageFile);
      }

      // Utiliser votre instance API configurée
      const response = await api.post("/Vol/flights", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Vol ajouté avec succès ✅");
        // Appeler le callback onSubmit si fourni
        if (onSubmit) {
          onSubmit(response.data.data);
        }
        // Réinitialiser le formulaire
        setFormData({
          idPrestataire: '',
          compagnie: '',
          numeroVol: '',
          departVille: '',
          departDateHeure: '',
          arriveeVille: '',
          arriveeDateHeure: '',
          duree: '',
          escales: 0,
          prix: 0,
          classe: 'economy',
          services: [],
          image: '',
          imageFile: null
        });
        onClose();
      } else {
        alert(response.data.message || "Erreur lors de l'ajout du vol");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du vol:", error);
      
      // Gestion d'erreur améliorée
      let errorMessage = "Erreur lors de l'ajout du vol";
      
      if (error.response) {
        // Erreur de réponse du serveur
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      } else if (error.request) {
        // Erreur de réseau
        errorMessage = "Erreur de connexion au serveur";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      // Créer une URL pour l'aperçu
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ 
        ...prev, 
        image: imageUrl,
        imageFile: file
      }));
    }
  };

  const removeImage = () => {
    // Révoquer l'URL pour libérer la mémoire
    if (formData.image) {
      URL.revokeObjectURL(formData.image);
    }
    setFormData(prev => ({ 
      ...prev, 
      image: '', 
      imageFile: null 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Plane className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Ajouter un nouveau vol
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compagnie aérienne *
              </label>
              <input
                type="text"
                name="compagnie"
                value={formData.compagnie}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Air France, Emirates..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de vol *
              </label>
              <input
                type="text"
                name="numeroVol"
                value={formData.numeroVol}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="AF123"
              />
            </div>
          </div>

          {/* Départ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ville de départ *
              </label>
              <input
                type="text"
                name="departVille"
                value={formData.departVille}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Paris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date et heure de départ *
              </label>
              <input
                type="datetime-local"
                name="departDateHeure"
                value={formData.departDateHeure}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Arrivée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ville d'arrivée *
              </label>
              <input
                type="text"
                name="arriveeVille"
                value={formData.arriveeVille}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date et heure d'arrivée *
              </label>
              <input
                type="datetime-local"
                name="arriveeDateHeure"
                value={formData.arriveeDateHeure}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Durée et escales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Durée du vol *
              </label>
              <input
                type="text"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="2h 30min"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'escales
              </label>
              <select
                name="escales"
                value={formData.escales}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {[0, 1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'escale' : 'escales'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prix et classe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Prix (€) *
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="299.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe *
              </label>
              <select
                name="classe"
                value={formData.classe}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {classOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Services inclus
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {serviceOptions.map(service => {
                const IconComponent = service.icon;
                return (
                  <label
                    key={service.id}
                    className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.services.includes(service.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.id)}
                      onChange={() => !loading && handleServiceChange(service.id)}
                      disabled={loading}
                      className="hidden"
                    />
                    <IconComponent className="w-5 h-5 mb-2 text-gray-600" />
                    <span className="text-sm text-center">{service.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du vol (optionnel)
            </label>
            
            {/* Aperçu de l'image */}
            {formData.image && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                <div className="relative inline-block">
                  <img 
                    src={formData.image} 
                    alt="Aperçu du vol"
                    className="w-32 h-20 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Input file */}
            <label className={`flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-100'
            }`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {loading ? 'Chargement...' : 'Choisir une image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ajout en cours...
                </>
              ) : (
                'Ajouter le vol'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutVolModal;