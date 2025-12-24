import React, { useState, useEffect } from "react";
import { Calendar, X, Loader2, CheckCircle, User } from "lucide-react";
import { useBienEtreTracking } from '@/hooks/useBienEtreTracking';
import api from '@/lib/api';

interface Service {
  id: number;
  libelle: string;
  price?: number;
  duration?: number;
  description?: string;
  category?: {
    name: string;
  };
  nutritionist?: {
    name: string;
    specialty?: string;
  };
}

interface ReservationBienEtreModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const ReservationBienEtreModal: React.FC<ReservationBienEtreModalProps> = ({
  isOpen,
  onClose,
  service
}) => {
  const [formData, setFormData] = useState({
    nomComplet: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
    objectives: [] as string[],
    dietaryRestrictions: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { trackBienEtreServiceBook } = useBienEtreTracking();

  // Objectifs possibles
  const objectivesList = [
    "Perte de poids",
    "Prise de masse musculaire",
    "Meilleure énergie",
    "Gestion maladie chronique",
    "Performance sportive",
    "Transition alimentaire",
    "Grossesse/allaitement",
    "Détoxification"
  ];

  // Horaires disponibles
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
  ];

  // Fonction pour vérifier l'authentification et pré-remplir
  const checkAuthAndPrefill = async () => {
    // Récupérer les données spécifiques à l'application
    const token = localStorage.getItem('auth-token');
    const userDataStr = localStorage.getItem('user-data');
    
    // Vérifier l'authentification
    const isAuth = !!token;
    setIsAuthenticated(isAuth);
    
    if (isAuth && userDataStr) {
      setIsFetchingUserData(true);
      
      try {
        // Parser les données utilisateur
        let userData = null;
        try {
          userData = JSON.parse(userDataStr);
        } catch (e) {
          console.error("Erreur parsing user-data:", e);
        }
        
        // Si on a des données, pré-remplir
        if (userData) {
          setUserInfo(userData);
          prefillFormWithUserInfo(userData);
        }
        
      } catch (error) {
        console.error('Erreur traitement user-data:', error);
      } finally {
        setIsFetchingUserData(false);
      }
    } else if (isAuth && !userDataStr) {
      // Token présent mais user-data manquant - tentative API
      setIsFetchingUserData(true);
      
      try {
        const response = await api.get('/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          const userData = response.data;
          setUserInfo(userData);
          prefillFormWithUserInfo(userData);
          
          // Stocker dans localStorage pour usage futur
          localStorage.setItem('user-data', JSON.stringify(userData));
        }
      } catch (apiError) {
        console.error("Erreur API /auth/profile:", apiError);
      } finally {
        setIsFetchingUserData(false);
      }
    }
  };

  // Fonction pour pré-remplir avec les données utilisateur
  const prefillFormWithUserInfo = (user: any) => {
    let nomComplet = "";
    let email = "";
    let phone = "";
    
    // Email - directement depuis user.email
    email = user.email || "";
    
    // Téléphone - directement depuis user.phone
    phone = user.phone || "";
    
    // Nom complet - combiner firstName et lastName
    if (user.firstName && user.lastName) {
      nomComplet = `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
      nomComplet = user.name;
    } else if (user.firstName) {
      nomComplet = user.firstName;
    } else if (user.lastName) {
      nomComplet = user.lastName;
    }
    
    // Message par défaut
    const defaultMessage = service ? 
      `Bonjour, je souhaite prendre rendez-vous pour ${service.libelle}.` : 
      "Bonjour, je souhaite prendre rendez-vous.";
    
    // Mettre à jour SEULEMENT les informations utilisateur
    setFormData(prev => ({
      ...prev,
      nomComplet: nomComplet || prev.nomComplet,
      email: email || prev.email,
      phone: phone || prev.phone,
      // Garder le message existant s'il y en a un, sinon utiliser le défaut
      message: prev.message || defaultMessage
    }));
  };

  // Effet principal - pré-remplissage seulement à l'ouverture
  useEffect(() => {
    if (isOpen && service) {
      // Vérifier l'authentification et pré-remplir
      checkAuthAndPrefill();
      
      // Seulement le message par défaut si vide
      setFormData(prev => ({
        ...prev,
        message: prev.message || `Bonjour, je souhaite prendre rendez-vous pour ${service.libelle}.`
      }));
    }
  }, [isOpen, service]);

  // Gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        objectives: checked
          ? [...prev.objectives, value]
          : prev.objectives.filter(obj => obj !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
    setIsLoading(true);
    
    try {
      // Tracking
      trackBienEtreServiceBook(
        service.id, 
        service.libelle, 
        service.category?.name || 'general'
      );
      
      // Récupérer le token et l'ID utilisateur
      const token = localStorage.getItem('auth-token');
      const userDataStr = localStorage.getItem('user-data');
      let userId = null;
      
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userId = userData.id;
        } catch (e) {
          console.error("Erreur parsing user-data pour userId:", e);
        }
      }
      
      // Séparer le nom complet en prénom et nom pour l'API
      let firstName = "";
      let lastName = "";
      if (formData.nomComplet) {
        const nameParts = formData.nomComplet.trim().split(' ');
        if (nameParts.length > 0) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        }
      }
      
      // Préparer les données pour l'API
      const appointmentData = {
        serviceId: service.id,
        date: formData.date,
        time: formData.time,
        message: formData.message || "",
        email: formData.email,
        phone: formData.phone,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        ...(userId ? { userId: userId } : {}),
        ...(formData.objectives.length > 0 ? { objectives: formData.objectives } : {}),
        ...(formData.dietaryRestrictions ? { dietaryRestrictions: formData.dietaryRestrictions } : {})
      };
      
      // Envoi vers l'API
      const response = await api.post('/bienetre/appointments', appointmentData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          // Réinitialiser mais conserver les données utilisateur si connecté
          if (isAuthenticated && userInfo) {
            let nomComplet = "";
            if (userInfo.firstName && userInfo.lastName) {
              nomComplet = `${userInfo.firstName} ${userInfo.lastName}`;
            } else if (userInfo.name) {
              nomComplet = userInfo.name;
            }
            
            setFormData({
              nomComplet: nomComplet || "",
              email: userInfo.email || "",
              phone: userInfo.phone || "",
              date: "",
              time: "",
              message: "",
              objectives: [],
              dietaryRestrictions: ""
            });
          } else {
            setFormData({
              nomComplet: "",
              email: "",
              phone: "",
              date: "",
              time: "",
              message: "",
              objectives: [],
              dietaryRestrictions: ""
            });
          }
        }, 2000);
      } else {
        throw new Error(response.data.message || "Erreur lors de la réservation");
      }

    } catch (error: any) {
      console.error("❌ Erreur création rendez-vous:", error);
      alert(error.response?.data?.message || "❌ Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour suggérer des objectifs basés sur le service
  const getSuggestedObjectives = () => {
    if (!service) return [];
    
    const serviceName = service.libelle.toLowerCase();
    
    if (serviceName.includes('dépuration') || serviceName.includes('detox') || serviceName.includes('détox')) {
      return ["Détoxification", "Meilleure énergie", "Perte de poids"];
    } else if (serviceName.includes('nutrition') || serviceName.includes('régime') || serviceName.includes('aliment')) {
      return ["Perte de poids", "Meilleure énergie", "Transition alimentaire"];
    } else if (serviceName.includes('sport') || serviceName.includes('performance')) {
      return ["Performance sportive", "Prise de masse musculaire", "Meilleure énergie"];
    }
    
    return [];
  };

  // Effet pour pré-sélectionner des objectifs basés sur le service
  useEffect(() => {
    if (service && formData.objectives.length === 0) {
      const suggestedObjectives = getSuggestedObjectives();
      if (suggestedObjectives.length > 0) {
        setFormData(prev => ({
          ...prev,
          objectives: suggestedObjectives
        }));
      }
    }
  }, [service]);

  if (!isOpen || !service) return null;

  // Calculer la date minimale (aujourd'hui) et maximale (dans 3 mois)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">
                {isSuccess ? "✅ Réservation confirmée !" : "Réserver une consultation"}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {service.libelle}
              </p>
              {service.price && (
                <div className="mt-2">
                  <span className="text-2xl font-bold text-logo">
                    {service.price}€
                  </span>
                  {service.duration && (
                    <span className="text-gray-500 ml-2">
                      • {service.duration} minutes
                    </span>
                  )}
                </div>
              )}
              {service.nutritionist && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-logo/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-logo" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{service.nutritionist.name}</p>
                      {service.nutritionist.specialty && (
                        <p className="text-sm text-gray-600">{service.nutritionist.specialty}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center justify-center flex-shrink-0 ml-4"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Réservation confirmée !
              </h3>
              <p className="text-gray-600 mb-6">
                Vous recevrez un email de confirmation avec tous les détails de votre consultation.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="font-semibold text-gray-800 mb-2">Récapitulatif :</p>
                <p><span className="text-gray-600">Service :</span> {service.libelle}</p>
                <p><span className="text-gray-600">Date :</span> {formData.date} à {formData.time}</p>
                <p><span className="text-gray-600">Email :</span> {formData.email}</p>
                {formData.nomComplet && (
                  <p><span className="text-gray-600">Nom :</span> {formData.nomComplet}</p>
                )}
                {formData.objectives.length > 0 && (
                  <p><span className="text-gray-600">Objectifs :</span> {formData.objectives.join(', ')}</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Indicateur de chargement des données utilisateur */}
              {isFetchingUserData && (
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-500" />
                  <span className="text-blue-600">Chargement de vos informations...</span>
                </div>
              )}
              
              <div className="space-y-6">
                {/* Informations personnelles */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="nomComplet"
                      value={formData.nomComplet}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                      placeholder="Prénom et nom"
                    />
                  </div>
                </div>

                {/* Date et heure - NON pré-remplies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      min={today}
                      max={maxDateString}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                      Créneau horaire *
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                    >
                      <option value="">Sélectionnez un créneau</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Objectifs (optionnel) */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-lg font-medium text-gray-700 text-left">
                      Vos objectifs principaux (optionnel)
                    </label>
                    {getSuggestedObjectives().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const suggested = getSuggestedObjectives();
                          setFormData(prev => ({
                            ...prev,
                            objectives: suggested
                          }));
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Suggérer pour {service.libelle}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {objectivesList.map((objective) => (
                      <label key={objective} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="objectives"
                          value={objective}
                          checked={formData.objectives.includes(objective)}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="h-5 w-5 rounded border-gray-300 text-logo focus:ring-logo"
                        />
                        <span className="text-gray-700">{objective}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Restrictions alimentaires (optionnel) */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Restrictions alimentaires (optionnel)
                  </label>
                  <input
                    type="text"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                    placeholder="Ex: Végétarien, Sans gluten, Allergies..."
                  />
                </div>

                {/* Message complémentaire */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Message complémentaire (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    disabled={isLoading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200 resize-none"
                    placeholder="Autres informations, questions spécifiques..."
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex-row md:flex-col gap-y-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading || isFetchingUserData}
                  className="flex-1 bg-logo hover:bg-primary-dark  text-white rounded-xl p-4 text-lg font-semibold border-2 border-logo hover:border-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Réservation...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-6 h-6 mr-3" />
                      Confirmer la consultation
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading || isFetchingUserData}
                  className="flex-1 rounded-xl w-full mt-3 py-5 text-lg font-semibold border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 transition-all duration-300 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-500 pt-4">
                <p>Les champs marqués d'un * sont obligatoires</p>
                <p className="mt-1">
                  {isAuthenticated 
                    ? "Vos informations personnelles ont été pré-remplies automatiquement"
                    : "Connectez-vous pour pré-remplir automatiquement vos informations"}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationBienEtreModal;