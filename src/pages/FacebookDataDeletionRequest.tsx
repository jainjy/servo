import React, { useState } from 'react';

interface FormData {
  email: string;
  reason: string;
  confirmDeletion: boolean;
  confirmUnderstanding: boolean;
}

interface FormErrors {
  email?: string;
  confirmDeletion?: string;
  confirmUnderstanding?: string;
  general?: string;
}

const FacebookDataDeletionRequest: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    reason: '',
    confirmDeletion: false,
    confirmUnderstanding: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
    }
    
    if (!formData.confirmDeletion) {
      newErrors.confirmDeletion = 'Vous devez confirmer la demande de suppression';
    }
    
    if (!formData.confirmUnderstanding) {
      newErrors.confirmUnderstanding = 'Vous devez confirmer que vous comprenez les conséquences';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simuler un appel API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer un ID de requête unique
      const newRequestId = `DEL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setRequestId(newRequestId);
      
      // Enregistrer la demande (dans un vrai projet, cela enverrait à votre backend)
      console.log('Demande de suppression:', {
        ...formData,
        requestId: newRequestId,
        timestamp: new Date().toISOString(),
      });
      
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Demande envoyée</h2>
            <p className="text-gray-500 mb-4">
              Votre demande de suppression des données a bien été reçue.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-1">Numéro de référence</p>
              <p className="text-lg font-mono font-semibold text-blue-600">{requestId}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Nous traiterons votre demande dans un délai maximum de <strong>30 jours</strong>.<br />
              Un email de confirmation vous sera envoyé à l'adresse fournie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retour à l'accueil
              </a>
              <a
                href="/contact"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mt-10 mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              🗑️
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demande de suppression des données
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Conformément au RGPD et à la législation sur la protection des données,
            vous pouvez demander la suppression de l'ensemble de vos données personnelles.
          </p>
        </div>

        {/* Alert - Important Information */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 mb-8">
          <div className="flex gap-3">
            <span className="text-amber-600 text-xl">⚠️</span>
            <div>
              <p className="font-medium text-amber-800 mb-1">Conséquences importantes</p>
              <p className="text-sm text-amber-700">
                La suppression de vos données est définitive et irréversible. Vous perdrez l'accès à votre compte,
                à votre historique, et à tous les services associés. Les données conservées pour des obligations
                légales seront anonymisées.
              </p>
            </div>
          </div>
        </div>

        {/* What will be deleted */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ce qui sera supprimé</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '👤', label: 'Données personnelles', desc: 'Nom, email, téléphone, adresse' },
              { icon: '💬', label: 'Messages et conversations', desc: 'Historique Messenger et chat' },
              { icon: '📊', label: 'Données d\'utilisation', desc: 'Historique de navigation, préférences' },
              { icon: '💳', label: 'Historique de transactions', desc: 'Commandes et paiements' },
              { icon: '⭐', label: 'Avis et évaluations', desc: 'Commentaires et notes' },
              { icon: '🔧', label: 'Paramètres', desc: 'Configuration personnalisée' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What will be retained */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Données conservées (obligations légales)</h2>
          <div className="space-y-3">
            <div className="flex gap-3 text-sm text-gray-500">
              <span className="text-gray-400">📋</span>
              <span>Données de facturation conservées <strong>10 ans</strong> (obligation fiscale)</span>
            </div>
            <div className="flex gap-3 text-sm text-gray-500">
              <span className="text-gray-400">🔒</span>
              <span>Données de connexion conservées <strong>1 an</strong> (sécurité)</span>
            </div>
            <div className="flex gap-3 text-sm text-gray-500">
              <span className="text-gray-400">⚖️</span>
              <span>Données liées à des litiges conservées jusqu'à résolution</span>
            </div>
          </div>
        </div>

        {/* Deletion Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Formulaire de demande</h2>
          
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email du compte *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Reason */}
            <div className="mb-6">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Raison (optionnelle)
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Sélectionnez une raison</option>
                <option value="no_longer_use">Je n'utilise plus le service</option>
                <option value="privacy_concerns">Inquiétudes concernant la confidentialité</option>
                <option value="data_accuracy">Données inexactes</option>
                <option value="right_to_be_forgotten">Droit à l'oubli</option>
                <option value="other">Autre raison</option>
              </select>
            </div>
            
            {/* Confirmation Checkboxes */}
            <div className="space-y-4 mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="confirmDeletion"
                  checked={formData.confirmDeletion}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Je confirme vouloir supprimer définitivement mon compte et toutes mes données associées.
                </span>
              </label>
              {errors.confirmDeletion && (
                <p className="text-sm text-red-500 -mt-2 ml-7">{errors.confirmDeletion}</p>
              )}
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="confirmUnderstanding"
                  checked={formData.confirmUnderstanding}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Je comprends que cette action est <strong>irréversible</strong> et que je ne pourrai pas récupérer mes données après suppression.
                </span>
              </label>
              {errors.confirmUnderstanding && (
                <p className="text-sm text-red-500 -mt-2 ml-7">{errors.confirmUnderstanding}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                'Envoyer la demande de suppression'
              )}
            </button>
          </form>
        </div>
        
        {/* Alternative Methods */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">Ou contactez-nous directement :</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@oliplus.re?subject=Demande%20de%20suppression%20des%20donn%C3%A9es"
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center gap-2"
            >
              ✉️ privacy@oliplus.re
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-gray-500 text-sm flex items-center justify-center gap-2"
            >
              📝 Formulaire de contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookDataDeletionRequest;