// components/modals/DiscoveryModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Tag, 
  Clock, 
  Activity,
  Star,
  Eye,
  Upload,
  Image as ImageIcon,
  FileText,
  Check,
  AlertCircle,
  Globe,
  Award,
  Mountain,
  TreePine,
  Palette,
  Music,
  Utensils,
  BookOpen,
  Users,
  Euro,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

// Interface pour les données de découverte (correspondant à votre backend)
export interface DiscoveryFormData {
  // Champs de base (requis)
  id?: number;
  title: string;
  description?: string;
  type: string;
  location: string;
  address?: string;
  city?: string;
  postalCode?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration?: string;
  
  // Images
  image?: string;
  images?: string[];
  
  // Statut et visibilité
  featured: boolean;
  status: 'draft' | 'published' | 'archived' | 'active';
  
  // Contact
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  
  // Tags et catégories
  tags?: string[];
  highlights?: string[];
  
  // Prix
  price?: number;
  currency: string;
  
  // Groupe
  groupSizeMin?: number;
  groupSizeMax?: number;
  ageRestrictionMin?: number;
  ageRestrictionMax?: number;
  maxVisitors?: number;
  
  // Services inclus
  guideIncluded: boolean;
  transportIncluded: boolean;
  mealIncluded: boolean;
  parkingAvailable: boolean;
  wifiAvailable: boolean;
  familyFriendly: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
  
  // Développement durable
  sustainabilityRating?: number;
  carbonFootprint?: string;
  
  // Champs optionnels (backend)
  recommendations?: string;
  bestSeason?: string[];
  bestTime?: string[];
  accessibility?: string;
  equipment?: string[];
  safety?: string;
  includes?: string[];
  notIncludes?: string[];
  languages?: string[];
  
  // Coordonnées
  coordinates?: { lat: number; lng: number };
  
  // Champs Json spécifiques (backend)
  includedServices?: string[];
  requirements?: string[];
  availableDates?: string[];
  
  // Statistiques (gérés par le backend)
  rating?: number;
  visits?: number;
  revenue?: number;
  
  // User
  userId?: string;
}

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DiscoveryFormData) => Promise<void>;
  initialData?: DiscoveryFormData;
  mode: 'create' | 'edit';
  loading?: boolean;
}

// Types de découvertes (basés sur votre modèle)
const DISCOVERY_TYPES = [
  'Lieu secret',
  'Gastronomie', 
  'Aventure',
  'Artisanat',
  'Nature',
  'Culture',
  'Historique',
  'Artistique',
  'Bien-être',
  'Insolite',
  'Panoramique',
  'Local',
  'Randonnée',
  'Plage',
  'Montagne',
  'Urbain'
];

// Niveaux de difficulté
const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Facile', icon: TreePine, color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Moyen', icon: Mountain, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Difficile', icon: Activity, color: 'bg-red-100 text-red-800' }
];

// Devises
const CURRENCIES = [
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'USD', label: 'Dollar ($)', symbol: '$' },
  { value: 'MGA', label: 'Ariary (Ar)', symbol: 'Ar' },
  { value: 'GBP', label: 'Livre (£)', symbol: '£' },
  { value: 'JPY', label: 'Yen (¥)', symbol: '¥' },
  { value: 'CNY', label: 'Yuan (¥)', symbol: '¥' }
];

// Saisons
const SEASONS = [
  'Printemps',
  'Été',
  'Automne',
  'Hiver',
  'Toute l\'année'
];

// Périodes de la journée
const TIMES_OF_DAY = [
  'Matin',
  'Après-midi',
  'Soir',
  'Nuit',
  'Toute la journée'
];

// Empreinte carbone
const CARBON_FOOTPRINT_LEVELS = [
  'Très faible',
  'Faible',
  'Moyenne',
  'Élevée'
];

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  loading = false
}) => {
  // Données initiales par défaut
  const defaultFormData: DiscoveryFormData = {
    title: '',
    type: 'Lieu secret',
    location: '',
    difficulty: 'easy',
    currency: 'EUR',
    featured: false,
    status: 'draft',
    guideIncluded: false,
    transportIncluded: false,
    mealIncluded: false,
    parkingAvailable: false,
    wifiAvailable: false,
    familyFriendly: false,
    petFriendly: false,
    wheelchairAccessible: false
  };

  const [formData, setFormData] = useState<DiscoveryFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media' | 'practical' | 'advanced'>('basic');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newNotInclude, setNewNotInclude] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // S'assurer que tous les champs sont présents
      const formattedData = {
        ...defaultFormData,
        ...initialData
      };
      
      setFormData(formattedData);
      setImagePreview(initialData.image || '');
      setAdditionalImages(initialData.images || []);
    } else {
      setFormData(defaultFormData);
      setImagePreview('');
      setAdditionalImages([]);
    }
    setFormErrors({});
  }, [mode, initialData, isOpen]);

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Le titre est requis';
    }
    
    if (!formData.type.trim()) {
      errors.type = 'Le type est requis';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'La localisation est requise';
    }
    
    if (formData.price !== undefined && formData.price < 0) {
      errors.price = 'Le prix ne peut pas être négatif';
    }
    
    if (formData.maxVisitors !== undefined && formData.maxVisitors < 1) {
      errors.maxVisitors = 'Le nombre maximum de visiteurs doit être au moins 1';
    }
    
    if (formData.groupSizeMin !== undefined && formData.groupSizeMax !== undefined) {
      if (formData.groupSizeMin > formData.groupSizeMax) {
        errors.groupSize = 'Le minimum ne peut pas être supérieur au maximum';
      }
    }
    
    if (formData.ageRestrictionMin !== undefined && formData.ageRestrictionMax !== undefined) {
      if (formData.ageRestrictionMin > formData.ageRestrictionMax) {
        errors.ageRestriction = 'L\'âge minimum ne peut pas être supérieur au maximum';
      }
    }
    
    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 5)) {
      errors.rating = 'La note doit être entre 0 et 5';
    }
    
    if (formData.sustainabilityRating !== undefined && (formData.sustainabilityRating < 0 || formData.sustainabilityRating > 5)) {
      errors.sustainabilityRating = 'La note de durabilité doit être entre 0 et 5';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? undefined : Number(value) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Effacer l'erreur pour ce champ
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gestion des images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdditionalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const updatedImages = [...additionalImages, imageUrl];
        setAdditionalImages(updatedImages);
        setFormData(prev => ({ ...prev, images: updatedImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAdditionalImage = (index: number) => {
    const updatedImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(updatedImages);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  // Gestion des tags
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Gestion des points forts
  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (highlightToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights?.filter(h => h !== highlightToRemove) || []
    }));
  };

  // Gestion des équipements
  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...(prev.equipment || []), newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipmentToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.filter(e => e !== equipmentToRemove) || []
    }));
  };

  // Gestion des inclusions
  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...(prev.includes || []), newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (includeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes?.filter(i => i !== includeToRemove) || []
    }));
  };

  // Gestion des exclusions
  const handleAddNotInclude = () => {
    if (newNotInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        notIncludes: [...(prev.notIncludes || []), newNotInclude.trim()]
      }));
      setNewNotInclude('');
    }
  };

  const removeNotInclude = (notIncludeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      notIncludes: prev.notIncludes?.filter(ni => ni !== notIncludeToRemove) || []
    }));
  };

  // Gestion des saisons
  const toggleSeason = (season: string) => {
    const current = formData.bestSeason || [];
    if (current.includes(season)) {
      setFormData(prev => ({
        ...prev,
        bestSeason: current.filter(s => s !== season)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bestSeason: [...current, season]
      }));
    }
  };

  // Gestion des périodes
  const toggleTime = (time: string) => {
    const current = formData.bestTime || [];
    if (current.includes(time)) {
      setFormData(prev => ({
        ...prev,
        bestTime: current.filter(t => t !== time)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bestTime: [...current, time]
      }));
    }
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Nettoyer les données avant envoi
      const cleanedData = { ...formData };
      
      // Supprimer les champs undefined
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key as keyof DiscoveryFormData] === undefined || cleanedData[key as keyof DiscoveryFormData] === '') {
          delete cleanedData[key as keyof DiscoveryFormData];
        }
      });
      
      // S'assurer que les tableaux vides sont envoyés comme tableaux vides
      const arrayFields = ['tags', 'highlights', 'images', 'equipment', 'includes', 'notIncludes', 'bestSeason', 'bestTime', 'languages'];
      arrayFields.forEach(field => {
        if (!cleanedData[field as keyof DiscoveryFormData]) {
          cleanedData[field as keyof DiscoveryFormData] = [];
        }
      });
      
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Réinitialisation
  const handleReset = () => {
    setFormData(defaultFormData);
    setImagePreview('');
    setAdditionalImages([]);
    setFormErrors({});
  };

  // Si modal fermée
  if (!isOpen) return null;

  // Icône selon le type
  const getTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'nature': return TreePine;
      case 'aventure': return Mountain;
      case 'artisanat': return Palette;
      case 'gastronomie': return Utensils;
      case 'culture': return BookOpen;
      case 'musique': return Music;
      default: return MapPin;
    }
  };

  const TypeIcon = getTypeIcon(formData.type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* En-tête */}
          <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TypeIcon className="h-7 w-7" />
                <div>
                  <h3 className="text-xl font-bold">
                    {mode === 'create' ? 'Créer une nouvelle découverte' : 'Modifier la découverte'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {mode === 'create' ? 'Partagez un lieu ou une expérience unique' : 'Modifiez les informations de votre découverte'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {[
                { id: 'basic', label: 'Informations', icon: FileText },
                { id: 'details', label: 'Détails', icon: Tag },
                { id: 'media', label: 'Médias', icon: ImageIcon },
                { id: 'practical', label: 'Pratique', icon: Users },
                { id: 'advanced', label: 'Avancé', icon: Globe }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 whitespace-nowrap font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-600 text-green-600 bg-white'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    disabled={loading}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto p-6">
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{formErrors.general}</p>
                </div>
              )}

              {/* Onglet: Informations */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de la découverte *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${formErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                      placeholder="ex: Les Jardins Secrets de la Vanille"
                      required
                      disabled={loading}
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Décrivez cette découverte unique..."
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de découverte *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${formErrors.type ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                        required
                        disabled={loading}
                      >
                        {DISCOVERY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {formErrors.type && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulté
                      </label>
                      <div className="flex gap-2">
                        {DIFFICULTY_LEVELS.map(level => {
                          const LevelIcon = level.icon;
                          return (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value as any }))}
                              className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border ${
                                formData.difficulty === level.value
                                  ? `${level.color} border-transparent font-medium`
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              disabled={loading}
                            >
                              <LevelIcon className="h-5 w-5 mb-1" />
                              <span className="text-sm">{level.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localisation *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${formErrors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                          placeholder="ex: Vallée secrète, Saint-Philippe"
                          required
                          disabled={loading}
                        />
                      </div>
                      {formErrors.location && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durée
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration || ''}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="ex: 2 heures, 1 journée"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note (0-5)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                            className="p-1"
                            disabled={loading}
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (formData.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-gray-700">{(formData.rating || 0).toFixed(1)}/5</span>
                      </div>
                      {formErrors.rating && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.rating}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet: Détails */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points forts
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="ex: Vue exceptionnelle, Authentique"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        Ajouter
                      </button>
                    </div>
                    {formData.highlights && formData.highlights.length > 0 && (
                      <ul className="space-y-2">
                        {formData.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-green-600" />
                              <span>{highlight}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeHighlight(highlight)}
                              className="text-gray-400 hover:text-red-500"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="ex: nature, local, authentique"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        Ajouter
                      </button>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <div
                            key={tag}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-blue-500 hover:text-blue-700"
                              disabled={loading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meilleure saison
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SEASONS.map(season => (
                          <button
                            key={season}
                            type="button"
                            onClick={() => toggleSeason(season)}
                            className={`px-3 py-1.5 rounded-full text-sm border ${
                              formData.bestSeason?.includes(season)
                                ? 'bg-green-600 text-white border-green-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            disabled={loading}
                          >
                            {season}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meilleur moment
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TIMES_OF_DAY.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => toggleTime(time)}
                            className={`px-3 py-1.5 rounded-full text-sm border ${
                              formData.bestTime?.includes(time)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            disabled={loading}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommandations
                    </label>
                    <textarea
                      name="recommendations"
                      value={formData.recommendations || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Conseils pratiques, choses à ne pas manquer..."
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accessibilité
                    </label>
                    <textarea
                      name="accessibility"
                      value={formData.accessibility || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Conditions d'accès, limitations..."
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Onglet: Médias */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale
                    </label>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-600 transition-colors">
                          <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={loading}
                          />
                          <label htmlFor="imageUpload" className={`cursor-pointer ${loading ? 'opacity-50' : ''}`}>
                            <Upload className="mx-auto text-gray-400 mb-4 h-12 w-12" />
                            <p className="text-gray-700 font-medium mb-2">
                              {imagePreview ? 'Changer l\'image' : 'Cliquez pour uploader'}
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, WEBP (max 5MB)
                            </p>
                          </label>
                        </div>
                        <input
                          type="url"
                          name="image"
                          value={formData.image || ''}
                          onChange={handleChange}
                          placeholder="Ou collez une URL d'image"
                          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          disabled={loading}
                        />
                      </div>
                      
                      {imagePreview && (
                        <div className="w-64">
                          <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                          <div className="relative rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-64 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview('');
                                setFormData(prev => ({ ...prev, image: '' }));
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Galerie d'images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-600 transition-colors mb-4">
                      <input
                        type="file"
                        id="additionalImages"
                        accept="image/*"
                        onChange={handleAddAdditionalImage}
                        className="hidden"
                        multiple
                        disabled={loading}
                      />
                      <label htmlFor="additionalImages" className={`cursor-pointer ${loading ? 'opacity-50' : ''}`}>
                        <ImageIcon className="mx-auto text-gray-400 mb-3 h-10 w-10" />
                        <p className="text-gray-700 font-medium">
                          Ajouter des images supplémentaires
                        </p>
                      </label>
                    </div>

                    {additionalImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {additionalImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={loading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Onglet: Pratique */}
              {activeTab === 'practical' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taille de groupe
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                          <input
                            type="number"
                            name="groupSizeMin"
                            value={formData.groupSizeMin || ''}
                            onChange={handleChange}
                            min="1"
                            className={`w-full px-4 py-2 border ${formErrors.groupSize ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                            placeholder="1"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                          <input
                            type="number"
                            name="groupSizeMax"
                            value={formData.groupSizeMax || ''}
                            onChange={handleChange}
                            min="1"
                            className={`w-full px-4 py-2 border ${formErrors.groupSize ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                            placeholder="10"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      {formErrors.groupSize && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.groupSize}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restriction d'âge
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Âge minimum</label>
                          <input
                            type="number"
                            name="ageRestrictionMin"
                            value={formData.ageRestrictionMin || ''}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-4 py-2 border ${formErrors.ageRestriction ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                            placeholder="0"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Âge maximum</label>
                          <input
                            type="number"
                            name="ageRestrictionMax"
                            value={formData.ageRestrictionMax || ''}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-4 py-2 border ${formErrors.ageRestriction ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                            placeholder="100"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      {formErrors.ageRestriction && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.ageRestriction}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre maximum de visiteurs
                    </label>
                    <input
                      type="number"
                      name="maxVisitors"
                      value={formData.maxVisitors || ''}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-2 border ${formErrors.maxVisitors ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                      placeholder="ex: 20"
                      disabled={loading}
                    />
                    {formErrors.maxVisitors && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.maxVisitors}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Équipement recommandé
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newEquipment}
                        onChange={(e) => setNewEquipment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEquipment())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="ex: Chaussures de marche, Eau"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={handleAddEquipment}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        Ajouter
                      </button>
                    </div>
                    {formData.equipment && formData.equipment.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.equipment.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeEquipment(item)}
                              className="ml-1 text-gray-500 hover:text-red-500"
                              disabled={loading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services inclus
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newInclude}
                        onChange={(e) => setNewInclude(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="ex: Guide local, Déjeuner"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={handleAddInclude}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        Ajouter
                      </button>
                    </div>
                    {formData.includes && formData.includes.length > 0 && (
                      <div className="space-y-2">
                        {formData.includes.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>{item}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeInclude(item)}
                              className="text-gray-400 hover:text-red-500"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services non inclus
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newNotInclude}
                        onChange={(e) => setNewNotInclude(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNotInclude())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="ex: Transport, Assurance"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={handleAddNotInclude}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        Ajouter
                      </button>
                    </div>
                    {formData.notIncludes && formData.notIncludes.length > 0 && (
                      <div className="space-y-2">
                        {formData.notIncludes.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between px-3 py-2 bg-red-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-600" />
                              <span>{item}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeNotInclude(item)}
                              className="text-gray-400 hover:text-red-500"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informations de sécurité
                    </label>
                    <textarea
                      name="safety"
                      value={formData.safety || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Précautions à prendre, risques éventuels..."
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Onglet: Avancé */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organisateur
                      </label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Votre nom ou société"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                        <option value="active">Actif</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail || ''}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="contact@exemple.com"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone || ''}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="+261 34 12 345 67"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site web
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website || ''}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="https://exemple.com"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse complète
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Rue, numéro"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Ville"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Code postal"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (optionnel)
                      </label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 border ${formErrors.price ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                          placeholder="Gratuit si vide"
                          disabled={loading}
                        />
                      </div>
                      {formErrors.price && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Devise
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        disabled={loading}
                      >
                        {CURRENCIES.map(currency => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Services inclus</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="guideIncluded"
                            checked={formData.guideIncluded}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Guide inclus</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="transportIncluded"
                            checked={formData.transportIncluded}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Transport inclus</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="mealIncluded"
                            checked={formData.mealIncluded}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Repas inclus</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Équipements sur place</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="parkingAvailable"
                            checked={formData.parkingAvailable}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Parking disponible</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="wifiAvailable"
                            checked={formData.wifiAvailable}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Wi-Fi disponible</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Accessibilité</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="familyFriendly"
                            checked={formData.familyFriendly}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Famille</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="petFriendly"
                            checked={formData.petFriendly}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Animaux acceptés</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="wheelchairAccessible"
                            checked={formData.wheelchairAccessible}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 rounded"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">Accès fauteuil</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Développement durable</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Note éco-responsable (0-5)
                          </label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, sustainabilityRating: star }))}
                                className="p-1"
                                disabled={loading}
                              >
                                <Star
                                  className={`h-5 w-5 ${
                                    star <= (formData.sustainabilityRating || 0)
                                      ? 'text-green-400 fill-green-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {formErrors.sustainabilityRating && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.sustainabilityRating}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Empreinte carbone
                          </label>
                          <select
                            name="carbonFootprint"
                            value={formData.carbonFootprint || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                            disabled={loading}
                          >
                            <option value="">Non spécifié</option>
                            {CARBON_FOOTPRINT_LEVELS.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mettre en vedette
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 rounded"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">
                        Mettre cette découverte en avant sur la plateforme
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de page */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>* Champs obligatoires</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : mode === 'create' ? 'Créer la découverte' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryModal;