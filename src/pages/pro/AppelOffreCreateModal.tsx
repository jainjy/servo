import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, MapPin, Clock, AlertCircle, Upload, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppelOffreCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: any;
}

export const AppelOffreCreateModal: React.FC<AppelOffreCreateModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  initialData
}) => {
  const [loading, setLoading] = useState(false);
  const [metiers, setMetiers] = useState<Array<{ id: number; libelle: string }>>([]);
  const [services, setServices] = useState<Array<{
      metierId: number; id: number; libelle: string 
}>>([]);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateLimite: '',
    budgetMin: '',
    budgetMax: '',
    typePrestation: 'service',
    dureeEstimee: '',
    lieuIntervention: '',
    estUrgent: false,
    visibilite: 'tous',
    metierId: '',
    serviceId: '',
    piecesJointes: [] as string[]
  });

  useEffect(() => {
    if (open) {
      fetchMetiers();
      fetchServices();
      if (initialData) {
        setFormData({
          titre: initialData.titre || '',
          description: initialData.description || '',
          dateLimite: initialData.dateLimite?.split('T')[0] || '',
          budgetMin: initialData.budgetMin?.toString() || '',
          budgetMax: initialData.budgetMax?.toString() || '',
          typePrestation: initialData.typePrestation || 'service',
          dureeEstimee: initialData.dureeEstimee || '',
          lieuIntervention: initialData.lieuIntervention || '',
          estUrgent: initialData.estUrgent || false,
          visibilite: initialData.visibilite || 'tous',
          metierId: initialData.metierId?.toString() || '',
          serviceId: initialData.serviceId?.toString() || '',
          piecesJointes: initialData.piecesJointes || []
        });
      } else {
        resetForm();
      }
    }
  }, [open, initialData]);

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      dateLimite: '',
      budgetMin: '',
      budgetMax: '',
      typePrestation: 'service',
      dureeEstimee: '',
      lieuIntervention: '',
      estUrgent: false,
      visibilite: 'tous',
      metierId: '',
      serviceId: '',
      piecesJointes: []
    });
  };

  const fetchMetiers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/metiers');
      const data = await res.json();
      setMetiers(data.data || []);
    } catch (error) {
      console.error('Erreur chargement métiers:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/services');
      const data = await res.json();
      setServices(data.data || []);
    } catch (error) {
      console.error('Erreur chargement services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      
      const payload = {
        ...formData,
        budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
        metierId: formData.metierId ? parseInt(formData.metierId) : null,
        serviceId: formData.serviceId ? parseInt(formData.serviceId) : null
      };

      const url = initialData
        ? `http://localhost:3001/api/b2b/appels-offre/${initialData.id}`
        : 'http://localhost:3001/api/b2b/appels-offre';

      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erreur lors de la création');

      toast({
        title: 'Succès',
        description: initialData
          ? 'Appel d\'offres mis à jour avec succès'
          : 'Appel d\'offres créé avec succès'
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'appel d\'offres',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => onOpenChange(false)} />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Modifier l\'appel d\'offres' : 'Lancer un appel d\'offres'}
            </h3>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l'appel d'offres *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Rénovation complète de bureaux 150m²"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description détaillée *
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez votre besoin, les spécifications, le contexte..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date limite */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date limite de réponse *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.dateLimite}
                    onChange={(e) => setFormData({ ...formData, dateLimite: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Type de prestation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de prestation *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.typePrestation}
                  onChange={(e) => setFormData({ ...formData, typePrestation: e.target.value })}
                >
                  <option value="service">Service</option>
                  <option value="prestation">Prestation</option>
                  <option value="forfait">Forfait</option>
                  <option value="etude">Étude / Conseil</option>
                </select>
              </div>

              {/* Budget min */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget minimum (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Budget max */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget maximum (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Délai estimé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai estimé
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2 semaines, 1 mois..."
                    value={formData.dureeEstimee}
                    onChange={(e) => setFormData({ ...formData, dureeEstimee: e.target.value })}
                  />
                </div>
              </div>

              {/* Lieu d'intervention */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu d'intervention
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Saint-Denis, La Réunion..."
                    value={formData.lieuIntervention}
                    onChange={(e) => setFormData({ ...formData, lieuIntervention: e.target.value })}
                  />
                </div>
              </div>

              {/* Métier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Métier concerné
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.metierId}
                  onChange={(e) => setFormData({ ...formData, metierId: e.target.value, serviceId: '' })}
                >
                  <option value="">Sélectionner un métier</option>
                  {metiers.map(metier => (
                    <option key={metier.id} value={metier.id}>
                      {metier.libelle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service spécifique */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service spécifique
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  disabled={!formData.metierId}
                >
                  <option value="">Sélectionner un service</option>
                  {services
                    .filter(s => !formData.metierId || s.metierId === parseInt(formData.metierId))
                    .map(service => (
                      <option key={service.id} value={service.id}>
                        {service.libelle}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.estUrgent}
                    onChange={(e) => setFormData({ ...formData, estUrgent: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">Marquer comme urgent</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.visibilite === 'selection'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      visibilite: e.target.checked ? 'selection' : 'tous' 
                    })}
                  />
                  <span className="text-sm text-gray-700">Réservé aux partenaires</span>
                </label>
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
                    Publication...
                  </>
                ) : (
                  initialData ? 'Mettre à jour' : 'Publier l\'appel d\'offres'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};