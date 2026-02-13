import React, { useState } from 'react';
import { X, DollarSign, Clock, Send, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReponseOffreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appelOffre: any;
  onSuccess: () => void;
}

export const ReponseOffreModal: React.FC<ReponseOffreModalProps> = ({
  open,
  onOpenChange,
  appelOffre,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    montantPropose: '',
    tva: '20',
    delaiPropose: '',
    validiteOffre: '30',
    message: '',
    piecesJointes: [] as string[]
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      
      const payload = {
        ...formData,
        montantPropose: parseFloat(formData.montantPropose),
        tva: parseFloat(formData.tva),
        validiteOffre: parseInt(formData.validiteOffre)
      };

      const res = await fetch(`http://localhost:3001/api/b2b/appels-offre/${appelOffre.id}/repondre`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erreur lors de l\'envoi');

      toast({
        title: 'Succès',
        description: 'Votre réponse a été envoyée avec succès'
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer votre réponse',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open || !appelOffre) return null;

  const montantTTC = parseFloat(formData.montantPropose) * (1 + parseFloat(formData.tva) / 100) || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => onOpenChange(false)} />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Répondre à l'appel d'offres
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {appelOffre.titre} - {appelOffre.numero}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Montant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant proposé (HT) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1500.00"
                    value={formData.montantPropose}
                    onChange={(e) => setFormData({ ...formData, montantPropose: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TVA (%)
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.tva}
                  onChange={(e) => setFormData({ ...formData, tva: e.target.value })}
                >
                  <option value="20">20%</option>
                  <option value="10">10%</option>
                  <option value="5.5">5.5%</option>
                  <option value="2.1">2.1%</option>
                  <option value="0">0%</option>
                </select>
              </div>
            </div>

            {/* Montant TTC (calculé) */}
            {formData.montantPropose && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Total TTC</span>
                  <span className="text-xl font-bold text-blue-700">
                    {montantTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </span>
                </div>
              </div>
            )}

            {/* Délai proposé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Délai de réalisation proposé *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2 semaines, 1 mois..."
                  value={formData.delaiPropose}
                  onChange={(e) => setFormData({ ...formData, delaiPropose: e.target.value })}
                />
              </div>
            </div>

            {/* Validité de l'offre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validité de l'offre (jours)
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.validiteOffre}
                onChange={(e) => setFormData({ ...formData, validiteOffre: e.target.value })}
              >
                <option value="15">15 jours</option>
                <option value="30">30 jours</option>
                <option value="45">45 jours</option>
                <option value="60">60 jours</option>
                <option value="90">90 jours</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message au client
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Expliquez votre offre, votre approche, vos avantages..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* Pièces jointes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pièces jointes
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-600">
                  Cliquez pour ajouter des fichiers ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, XLS - Taille max: 10MB
                </p>
              </div>
            </div>

            {/* Récapitulatif appel d'offres */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Récapitulatif de l'appel d'offres
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-600">Budget max:</div>
                <div className="font-medium">
                  {appelOffre.budgetMax ? `${appelOffre.budgetMax.toLocaleString('fr-FR')} €` : 'Non spécifié'}
                </div>
                <div className="text-gray-600">Date limite:</div>
                <div className="font-medium">
                  {new Date(appelOffre.dateLimite).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-gray-600">Lieu:</div>
                <div className="font-medium">{appelOffre.lieuIntervention || 'Non spécifié'}</div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Envoyer ma réponse
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};