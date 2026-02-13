import React, { useState, useEffect } from 'react';
import { 
  X, DollarSign, Clock, MapPin, Tag, Package, 
  Upload, Plus, XCircle, Award, Shield, CheckCircle,
  AlertCircle, Building2, Globe, Truck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CatalogueB2BModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: any;
}

export const CatalogueB2BModal: React.FC<CatalogueB2BModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  initialData
}) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Array<{
      description: string; id: number; libelle: string; category?: { name: string } 
}>>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [newCompetence, setNewCompetence] = useState('');
  const [newZone, setNewZone] = useState('');
  const [newCertification, setNewCertification] = useState('');
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    serviceId: '',
    titre: '',
    description: '',
    prixHT: '',
    tva: '20',
    unite: 'prestation',
    delaiMoyen: '',
    zoneIntervention: [] as string[],
    competences: [] as string[],
    images: [] as string[],
    garantie: '',
    certification: [] as string[],
    isActive: true
  });

  // Liste des unités possibles
  const unites = [
    { value: 'prestation', label: 'Par prestation' },
    { value: 'heure', label: 'Par heure' },
    { value: 'jour', label: 'Par jour' },
    { value: 'forfait', label: 'Forfait' },
    { value: 'm2', label: 'Au m²' },
    { value: 'piece', label: 'Par pièce' },
    { value: 'projet', label: 'Par projet' }
  ];

  // Liste des zones d'intervention (La Réunion)
  const zonesDisponibles = [
    'Saint-Denis', 'Saint-Paul', 'Saint-Pierre', 'Le Tampon', 
    'Saint-André', 'Saint-Louis', 'Saint-Benoît', 'La Possession',
    'Saint-Joseph', 'Sainte-Marie', 'Le Port', 'Saint-Leu',
    'L\'Étang-Salé', 'Petite-Île', 'Sainte-Rose', 'Cilaos',
    'Salazie', 'Bras-Panon', 'Saint-Philippe', 'Entre-Deux',
    'Les Avirons', 'Trois-Bassins', 'Plaine des Palmistes',
    'Toute l\'île'
  ];

  // Liste des certifications
  const certificationsDisponibles = [
    'Qualibat', 'RGE', 'Artisan d\'art', 'Maître artisan',
    'OPQIBI', 'NF Habitat', 'Certibat', 'Eco-artisan',
    'Professionnel du tourisme', 'Guide confirmé', 'Moniteur diplômé'
  ];

  useEffect(() => {
    if (open) {
      fetchServices();
      fetchCategories();
      if (initialData) {
        setFormData({
          serviceId: initialData.serviceId?.toString() || '',
          titre: initialData.titre || '',
          description: initialData.description || '',
          prixHT: initialData.prixHT?.toString() || '',
          tva: initialData.tva?.toString() || '20',
          unite: initialData.unite || 'prestation',
          delaiMoyen: initialData.delaiMoyen || '',
          zoneIntervention: initialData.zoneIntervention || [],
          competences: initialData.competences || [],
          images: initialData.images || [],
          garantie: initialData.garantie || '',
          certification: initialData.certification || [],
          isActive: initialData.isActive !== undefined ? initialData.isActive : true
        });
      } else {
        resetForm();
      }
    }
  }, [open, initialData]);

  const resetForm = () => {
    setFormData({
      serviceId: '',
      titre: '',
      description: '',
      prixHT: '',
      tva: '20',
      unite: 'prestation',
      delaiMoyen: '',
      zoneIntervention: [],
      competences: [],
      images: [],
      garantie: '',
      certification: [],
      isActive: true
    });
    setNewCompetence('');
    setNewZone('');
    setNewCertification('');
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

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/categories');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const handleAddCompetence = () => {
    if (newCompetence.trim() && !formData.competences.includes(newCompetence.trim())) {
      setFormData({
        ...formData,
        competences: [...formData.competences, newCompetence.trim()]
      });
      setNewCompetence('');
    }
  };

  const handleRemoveCompetence = (competence: string) => {
    setFormData({
      ...formData,
      competences: formData.competences.filter(c => c !== competence)
    });
  };

  const handleAddZone = () => {
    if (newZone && !formData.zoneIntervention.includes(newZone)) {
      setFormData({
        ...formData,
        zoneIntervention: [...formData.zoneIntervention, newZone]
      });
      setNewZone('');
    }
  };

  const handleRemoveZone = (zone: string) => {
    setFormData({
      ...formData,
      zoneIntervention: formData.zoneIntervention.filter(z => z !== zone)
    });
  };

  const handleAddCertification = () => {
    if (newCertification && !formData.certification.includes(newCertification)) {
      setFormData({
        ...formData,
        certification: [...formData.certification, newCertification]
      });
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setFormData({
      ...formData,
      certification: formData.certification.filter(c => c !== cert)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      
      if (!formData.titre || !formData.prixHT) {
        toast({
          title: 'Erreur',
          description: 'Veuillez remplir tous les champs obligatoires',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        serviceId: formData.serviceId ? parseInt(formData.serviceId) : null,
        prixHT: parseFloat(formData.prixHT),
        tva: parseFloat(formData.tva)
      };

      const res = await fetch('http://localhost:3001/api/b2b/catalogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur lors de la publication');
      }

      toast({
        title: 'Succès',
        description: initialData
          ? 'Offre mise à jour avec succès'
          : 'Offre publiée avec succès dans le catalogue B2B'
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de publier l\'offre',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const prixTTC = formData.prixHT ? parseFloat(formData.prixHT) * (1 + parseFloat(formData.tva) / 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => onOpenChange(false)} />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="text-green-600" size={24} />
                {initialData ? 'Modifier mon offre' : 'Publier une offre B2B'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Proposez vos services aux autres professionnels
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
            {/* Section: Service existant ou nouveau */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Tag size={16} />
                Service proposé
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service existant
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.serviceId}
                    onChange={(e) => {
                      const service = services.find(s => s.id === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        serviceId: e.target.value,
                        titre: service?.libelle || formData.titre,
                        description: service?.description || formData.description
                      });
                    }}
                  >
                    <option value="">-- Créer un nouveau service --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.libelle} {service.category ? `(${service.category.name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ou titre du nouveau service *
                  </label>
                  <input
                    type="text"
                    required={!formData.serviceId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Rénovation complète de bureaux"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description détaillée de l'offre
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Décrivez précisément ce que vous proposez, votre méthodologie, vos atouts..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Prix et TVA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix HT *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="150.00"
                    value={formData.prixHT}
                    onChange={(e) => setFormData({ ...formData, prixHT: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TVA (%)
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.tva}
                  onChange={(e) => setFormData({ ...formData, tva: e.target.value })}
                >
                  <option value="20">20%</option>
                  <option value="10">10%</option>
                  <option value="8.5">8.5% (Réunion)</option>
                  <option value="5.5">5.5%</option>
                  <option value="2.1">2.1%</option>
                  <option value="0">0%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unité *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.unite}
                  onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                >
                  {unites.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Affichage TTC */}
            {formData.prixHT && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="font-medium text-green-800">Prix TTC proposé</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-green-700">
                      {prixTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                    <span className="text-sm text-green-600 ml-1">
                      / {unites.find(u => u.value === formData.unite)?.label || formData.unite}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Délai et garantie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai moyen d'intervention
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="48h, 3-5 jours, 1 semaine..."
                    value={formData.delaiMoyen}
                    onChange={(e) => setFormData({ ...formData, delaiMoyen: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garantie
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1 an, 2 ans, 10 ans..."
                    value={formData.garantie}
                    onChange={(e) => setFormData({ ...formData, garantie: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Zones d'intervention */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zones d'intervention
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                >
                  <option value="">Sélectionner une zone</option>
                  {zonesDisponibles.map(zone => (
                    <option key={zone} value={zone} disabled={formData.zoneIntervention.includes(zone)}>
                      {zone} {formData.zoneIntervention.includes(zone) ? '(déjà ajoutée)' : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddZone}
                  disabled={!newZone}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.zoneIntervention.map(zone => (
                  <span 
                    key={zone} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <MapPin size={14} />
                    {zone}
                    <button
                      type="button"
                      onClick={() => handleRemoveZone(zone)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
                {formData.zoneIntervention.length === 0 && (
                  <span className="text-sm text-gray-500 italic">
                    Aucune zone sélectionnée (visible partout)
                  </span>
                )}
              </div>
            </div>

            {/* Compétences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences / Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Rénovation, Plomberie, Électricité..."
                  value={newCompetence}
                  onChange={(e) => setNewCompetence(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetence())}
                />
                <button
                  type="button"
                  onClick={handleAddCompetence}
                  disabled={!newCompetence.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.competences.map(comp => (
                  <span 
                    key={comp} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    <Tag size={14} />
                    {comp}
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetence(comp)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                    >
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications & Labels
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                >
                  <option value="">Sélectionner une certification</option>
                  {certificationsDisponibles.map(cert => (
                    <option key={cert} value={cert} disabled={formData.certification.includes(cert)}>
                      {cert} {formData.certification.includes(cert) ? '(déjà ajoutée)' : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  disabled={!newCertification}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.certification.map(cert => (
                  <span 
                    key={cert} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm"
                  >
                    <Award size={14} />
                    {cert}
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(cert)}
                      className="ml-1 text-amber-600 hover:text-amber-800"
                    >
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Images (simplifié) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images d'illustration
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-600">
                  Cliquez pour ajouter des images ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP - Taille max: 5MB
                </p>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  {formData.images.length} image(s) chargée(s)
                </div>
              )}
            </div>

            {/* Statut actif/inactif */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span className="text-sm text-gray-700">Offre active et visible</span>
              </label>
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
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Package size={16} />
                    {initialData ? 'Mettre à jour l\'offre' : 'Publier dans le catalogue B2B'}
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