// components/ModalDemandeDevisPack.jsx
import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Clock, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import api from '@/lib/api';

export const ModalDemandeDevisPack = ({
  open,
  onClose,
  property,
  onSuccess,
  isAlreadySent,
}: {
  open: boolean;
  onClose: () => void;
  property: any;
  onSuccess?: (formData: any) => void;
  isAlreadySent?: boolean;
}) => {
  const [formData, setFormData] = useState({
    nomPrenom: "",
    email: "",
    telephone: "",
    message: "",
    dateSouhaitee: "",
    heureSouhaitee: "",
    adresse: "",
    surface: "",
    typeProjet: ""
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    if (isAlreadySent) {
      toast.error("Vous avez déjà envoyé une demande pour ce bien.");
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error('Veuillez vous connecter pour demander un devis.');
      return;
    }

    setLoadingSubmit(true);
    try {
      // Préparer les données pour le devis
      const nameParts = String(formData.nomPrenom || '').trim().split(/\s+/).filter(Boolean);
      const contactPrenom = nameParts.length > 0 ? nameParts[0] : '';
      const contactNom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (nameParts[0] || '');

      const devisData = {
        propertyId: property?.id,
        propertyTitle: property?.title,
        contactNom,
        contactPrenom,
        contactEmail: formData.email,
        contactTel: formData.telephone,
        adresse: formData.adresse,
        surface: formData.surface,
        typeProjet: formData.typeProjet,
        dateSouhaitee: formData.dateSouhaitee,
        heureSouhaitee: formData.heureSouhaitee,
        message: formData.message,
        createdById: user.id
      };

      // Appel à l'API pour créer le devis
      await api.post('/devis/immobilier', devisData);

      // Appeler le callback de succès
      onSuccess?.(devisData);

      toast.success("Votre demande de devis a bien été envoyée.");

      // Réinitialiser le formulaire et fermer le modal
      setFormData({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
        adresse: "",
        surface: "",
        typeProjet: ""
      });
      onClose();
    } catch (err: any) {
      console.error('Erreur en envoyant la demande de devis', err);
      toast.error(err?.response?.data?.error || err?.message || 'Impossible d\'envoyer la demande. Réessayez.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* En-tête du modal */}
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-xl font-bold">Demander un Devis Gratuit</h2>
              <p className="text-white/70 text-sm mt-1">
                Pour : {property?.title || property?.name}
              </p>
            </div>
            <button
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
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 font-medium">Vos coordonnées</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="nomPrenom"
                    value={formData.nomPrenom}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nom et Prénom"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>

            {/* Informations sur le projet */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">Votre projet</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adresse du bien"
                  />
                </div>
                <div className="relative">
                  <input
                    name="surface"
                    type="number"
                    value={formData.surface}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Surface (m²)"
                  />
                </div>
              </div>

              <div className="relative">
                <select
                  name="typeProjet"
                  value={formData.typeProjet}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:bg-white"
                >
                  <option value="">Type de projet</option>
                  <option value="achat">Achat</option>
                  <option value="location">Location</option>
                  <option value="estimation">Estimation</option>
                  <option value="renovation">Rénovation</option>
                </select>
              </div>
            </div>

            {/* Disponibilités */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">Disponibilités pour une visite</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="dateSouhaitee"
                    type="date"
                    value={formData.dateSouhaitee}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <select
                      name="heureSouhaitee"
                      value={formData.heureSouhaitee}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:bg-white"
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
            </div>

            {/* Message */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Détails de votre projet (optionnel)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Précisez vos besoins, budget, ou toute information complémentaire..."
              />
            </div>
          </form>
        </div>

        {/* Boutons d'action */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loadingSubmit || !!isAlreadySent}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FileText className="w-4 h-4" />
              {loadingSubmit ? 'Envoi...' : isAlreadySent ? 'Devis déjà demandé' : 'Demander le devis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDemandeDevisPack;