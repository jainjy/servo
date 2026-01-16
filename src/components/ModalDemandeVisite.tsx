import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import api from '@/lib/api';

// Composant Modal pour la demande de visite (Réutilisable)
export const ModalDemandeVisite = ({
  open,
  onClose,
  property,
  onSuccess,
  isAlreadySent,
  onPropertyContact,
}: {
  open: boolean;
  onClose: () => void;
  property: any;
  onSuccess?: (propertyId: string) => void;
  isAlreadySent?: boolean;
  onPropertyContact?: (property: any) => void;
}) => {
  const [formData, setFormData] = useState({
    nomPrenom: "",
    email: "",
    telephone: "",
    message: "",
    dateSouhaitee: "",
    heureSouhaitee: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({
    dateSouhaitee: false,
    heureSouhaitee: false
  });

  const { user, isAuthenticated } = useAuth();

  // Pré-remplir automatiquement avec les données de l'utilisateur connecté
  useEffect(() => {
    if (open && user && isAuthenticated) {
      // Construire le nom complet
      const nomComplet = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      
      // Mettre à jour le formulaire avec les données de l'utilisateur
      setFormData(prev => ({
        ...prev,
        nomPrenom: nomComplet,
        email: user.email || '',
        telephone: user.phone || user.telephone || user.mobile || '',
      }));
    } else if (open) {
      // Réinitialiser si l'utilisateur n'est pas connecté ou modal fermé
      setFormData({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
      });
    }
  }, [open, user, isAuthenticated]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!property) return;
  
  // VÉRIFICATION CRITIQUE - Empêcher l'envoi si date ou heure ne sont pas sélectionnées
  if (!formData.dateSouhaitee || !formData.heureSouhaitee) {
    setFormErrors({
      dateSouhaitee: !formData.dateSouhaitee,
      heureSouhaitee: !formData.heureSouhaitee
    });
    toast.error("Veuillez sélectionner une date et un créneau horaire.");
    return;
  }

  // Réinitialiser les erreurs si tout est valide
  setFormErrors({ dateSouhaitee: false, heureSouhaitee: false });
  
  // Track contact action
  if (onPropertyContact) {
    onPropertyContact(property);
  }
  
  if (isAlreadySent) {
    toast.error("Vous avez déjà envoyé une demande pour ce bien.");
    return;
  }

  if (!isAuthenticated || !user) {
    toast.error('Veuillez vous connecter pour demander une visite.');
    return;
  }

  setLoadingSubmit(true);
  try {
    // Récupérer l'ID du propriétaire du bien
    const propertyOwnerId = property?.ownerId || property?.createdById || user.id;

    // Ensure backend-required contactPrenom and contactNom are provided
    const nameParts = String(formData.nomPrenom || '').trim().split(/\s+/).filter(Boolean);
    const contactPrenom = nameParts.length > 0 ? nameParts[0] : '';
    const contactNom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (nameParts[0] || '');

    const payload = {
      // NE PAS envoyer de serviceId - le backend utilisera l'ID du propriétaire
      // serviceId: null, // Optionnel, laissé vide
      createdById: user.id, // ID de la personne qui envoie la demande
      propertyId: property?.id,
      contactNom,
      contactPrenom,
      contactEmail: formData.email,
      contactTel: formData.telephone,
      description: `Demande visite pour le bien: ${property?.title || property?.id} (${property?.id}). ${formData.message || ''}`,
      lieuAdresse: property?.address || property?.city || '',
      dateSouhaitee: formData.dateSouhaitee,
      heureSouhaitee: formData.heureSouhaitee,
    };

    await api.post('/demandes/immobilier', payload);

    // Notify parent that a request was sent
    onSuccess?.(String(property.id));

    toast.success("Votre demande de visite a bien été envoyée.");

    // Réinitialiser le formulaire et fermer le modal
    setFormData({
      nomPrenom: "",
      email: "",
      telephone: "",
      message: "",
      dateSouhaitee: "",
      heureSouhaitee: "",
    });
    onClose();
  } catch (err: any) {
    console.error('Erreur en envoyant la demande de visite', err);
    toast.error(err?.response?.data?.error || err?.message || 'Impossible d\'envoyer la demande. Réessayez.');
  } finally {
    setLoadingSubmit(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser l'erreur du champ quand l'utilisateur commence à taper
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#D3D3D3]">
        {/* En-tête du modal */}
        <div className="bg-[#556B2F] px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-xl font-bold">Demander une visite</h2>
              <p className="text-white/80 text-sm mt-1">
                Pour le bien : {property?.title || property?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium">Vos coordonnées</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="nomPrenom"
                    value={formData.nomPrenom}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-[#D3D3D3] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                    placeholder="Nom et Prénom"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-[#D3D3D3] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-[#D3D3D3] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>

            {/* Date et heure souhaitées */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium">Disponibilités</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4" />
                  <input
                    name="dateSouhaitee"
                    type="date"
                    value={formData.dateSouhaitee}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className={`w-full bg-gray-50 border ${
                      formErrors.dateSouhaitee ? 'border-red-500' : 'border-[#D3D3D3]'
                    } pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-4 h-4 z-10" />
                    <select
                      id="heureSouhaitee"
                      name="heureSouhaitee"
                      value={formData.heureSouhaitee}
                      onChange={handleChange}
                      required
                      className={`w-full bg-gray-50 border ${
                        formErrors.heureSouhaitee ? 'border-red-500' : 'border-[#D3D3D3]'
                      } pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200 appearance-none hover:bg-white`}
                    >
                      <option value="">Sélectionnez un créneau</option>
                      <option value="08:00">Matin : 08h00</option>
                      <option value="10:00">Matin : 10h00</option>
                      <option value="14:00">Après-midi : 14h00</option>
                      <option value="16:00">Après-midi : 16h00</option>
                      <option value="18:00">Soir : 18h00</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Message d'erreur */}
              {(formErrors.dateSouhaitee || formErrors.heureSouhaitee) && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Veuillez sélectionner une date et un créneau horaire pour continuer
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-3">
              <label className="block text-[#8B4513] font-medium text-sm">
                Message complémentaire (optionnel)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-[#D3D3D3] p-4 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200"
                placeholder="Précisez vos disponibilités ou toute information complémentaire..."
              />
            </div>
          </form>
        </div>

        {/* Boutons d'action */}
        <div className="border-t border-[#D3D3D3] p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border border-[#D3D3D3] px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loadingSubmit || !!isAlreadySent}
              className="flex-1 bg-[#6B8E23] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#556B2F] transition-all duration-200 shadow-lg shadow-[#6B8E23]/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Calendar className="w-4 h-4" />
              {loadingSubmit ? 'Envoi...' : isAlreadySent ? 'Demande déjà envoyée' : 'Demander la visite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDemandeVisite;