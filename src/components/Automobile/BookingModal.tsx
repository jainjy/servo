// components/automobile/BookingModal.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Calendar, Car, Phone, Mail, User, MessageSquare, 
  Clock, Wrench, CheckCircle, AlertCircle 
} from "lucide-react";

interface Props {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  message: string;
  consent: boolean;
}

const services = [
  "Diagnostic électronique",
  "Révision complète",
  "Entretien courant",
  "Contrôle technique",
  "Carrosserie & Peinture",
  "Climatisation",
  "Freins & Embrayage",
  "Suspension & Direction"
];

const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00", 
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00"
];

export default function BookingModal({ onClose }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    service: "",
    date: "",
    time: "",
    message: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSuccess(true);
    setIsSubmitting(false);
    
    // Fermeture automatique après 2 secondes
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* En-tête */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#6B8E23', opacity: 0.1 }}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Calendar className="w-5 h-5" style={{ color: '#6B8E23' }} />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">Prendre rendez-vous</h2>
              <p className="text-sm text-gray-500">
                {step === 1 && "Étape 1/3 - Choix du service"}
                {step === 2 && "Étape 2/3 - Vos coordonnées"}
                {step === 3 && "Étape 3/3 - Confirmation"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de progression */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: i <= step ? '#6B8E23' : '#E5E7EB',
                    opacity: i <= step ? 1 : 0.3
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: '#6B8E23', opacity: 0.1 }}
                >
                  <CheckCircle className="w-10 h-10" style={{ color: '#6B8E23' }} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Demande envoyée !</h3>
                <p className="text-gray-600 mb-4">
                  Nous vous confirmerons le rendez-vous par téléphone dans les plus brefs délais.
                </p>
                <p className="text-sm text-gray-400">Fermeture automatique...</p>
              </motion.div>
            ) : (
              <motion.form
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Étape 1 - Choix du service */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Wrench className="w-4 h-4" style={{ color: '#6B8E23' }} />
                        Type de service *
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 transition"
                        style={{ focusRingColor: '#6B8E23' }}
                        required
                      >
                        <option value="">Sélectionnez un service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: '#6B8E23' }} />
                          Date souhaitée *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2"
                          style={{ focusRingColor: '#6B8E23' }}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: '#6B8E23' }} />
                          Créneau horaire *
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2"
                          style={{ focusRingColor: '#6B8E23' }}
                          required
                        >
                          <option value="">Choisir un créneau</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Car className="w-4 h-4" style={{ color: '#6B8E23' }} />
                        Véhicule *
                      </label>
                      <input
                        type="text"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        placeholder="Ex: Renault Clio 4 - 2018"
                        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2"
                        style={{ focusRingColor: '#6B8E23' }}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Étape 2 - Coordonnées */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" style={{ color: '#6B8E23' }} />
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2"
                        style={{ focusRingColor: '#6B8E23' }}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4" style={{ color: '#6B8E23' }} />
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jean@exemple.fr"
                          className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2"
                          style={{ focusRingColor: '#6B8E23' }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4" style={{ color: '#6B8E23' }} />
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="06 12 34 56 78"
                          className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2"
                          style={{ focusRingColor: '#6B8E23' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" style={{ color: '#6B8E23' }} />
                        Message (optionnel)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Précisions complémentaires..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2"
                        style={{ focusRingColor: '#6B8E23' }}
                      />
                    </div>
                  </div>
                )}

                {/* Étape 3 - Confirmation */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" style={{ color: '#6B8E23' }} />
                        Récapitulatif de votre demande
                      </h3>
                      
                      <div className="grid gap-3 text-sm">
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Service :</span>
                          <span className="font-medium">{formData.service || "Non spécifié"}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Date :</span>
                          <span className="font-medium">{formData.date || "Non spécifiée"}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Horaire :</span>
                          <span className="font-medium">{formData.time || "Non spécifié"}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Véhicule :</span>
                          <span className="font-medium">{formData.vehicle || "Non spécifié"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Client :</span>
                          <span className="font-medium">{formData.name || "Non spécifié"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        Notre équipe vous contactera dans les 24h pour confirmer votre rendez-vous.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-1" 
                        required 
                      />
                      <label htmlFor="consent" className="text-xs text-gray-500">
                        J'accepte que mes données soient traitées pour la prise de rendez-vous. 
                        Elles ne seront jamais partagées avec des tiers. *
                      </label>
                    </div>
                  </div>
                )}

                {/* Boutons de navigation */}
                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                      Précédent
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 text-white py-3 rounded-xl transition hover:opacity-90"
                      style={{ backgroundColor: '#6B8E23' }}
                    >
                      Continuer
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!formData.consent || isSubmitting}
                      className="flex-1 text-white py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#6B8E23' }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Envoi en cours...
                        </>
                      ) : (
                        "Confirmer le rendez-vous"
                      )}
                    </button>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Pied de page */}
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            ⏱️ Réponse sous 24h • 🔒 Données confidentielles • 📞 01 23 45 67 89
          </p>
        </div>
      </motion.div>
    </div>
  );
}