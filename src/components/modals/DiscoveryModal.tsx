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
  BookOpen
} from 'lucide-react';

// Interface pour les données de découverte
export interface DiscoveryFormData {
  availableDates: string[];
  coordinates: { lat: number; lng: number; };
  includedServices: string[];
  requirements: string[];
  maxVisitors: number;
  id?: number;
  title: string;
  description: string;
  type: string;
  location: string;
  address?: string;
  city?: string;
  postalCode?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  rating: number;
  image: string;
  images: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  organizer: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  tags: string[];
  highlights: string[];
  recommendations?: string;
  bestSeason?: string[];
  bestTime?: string[];
  accessibility?: string;
  equipment?: string[];
  safety?: string;
  price?: number;
  currency: string;
  includes?: string[];
  notIncludes?: string[];
  groupSize?: {
    min: number;
    max: number;
  };
  ageRestriction?: {
    min?: number;
    max?: number;
  };
  languages?: string[];
  guideIncluded: boolean;
  transportIncluded: boolean;
  mealIncluded: boolean;
  parkingAvailable: boolean;
  wifiAvailable: boolean;
  familyFriendly: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
  sustainabilityRating?: number;
  carbonFootprint?: string;
}

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DiscoveryFormData) => void;
  initialData?: DiscoveryFormData;
  mode: 'create' | 'edit';
}

// Types de découvertes
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
  'Local'
];

// Niveaux de difficulté
const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Facile', icon: TreePine, color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Moyen', icon: Mountain, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Difficile', icon: Activity, color: 'bg-red-100 text-red-800' }
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

// Langues
const LANGUAGES = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Chinois',
  'Autre'
];

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  // Données initiales par défaut
  const defaultFormData: DiscoveryFormData = {
    title: '',
    description: '',
    type: 'Lieu secret',
    location: '',
    difficulty: 'easy',
    duration: '2 heures',
    rating: 4.5,
    image: '',
    images: [],
    featured: false,
    status: 'draft',
    organizer: '',
    tags: [],
    highlights: [],
    currency: 'EUR',
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
  const [newInclude, setNewInclude] = useState('');
  const [newNotInclude, setNewNotInclude] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Initialiser le formulaire
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
      setImagePreview(initialData.image);
      setAdditionalImages(initialData.images || []);
    } else {
      setFormData(defaultFormData);
      setImagePreview('');
      setAdditionalImages([]);
    }
  }, [mode, initialData, isOpen]);

  // Gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
        setAdditionalImages(prev => [...prev, imageUrl]);
        setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // Gestion des tags
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Gestion des points forts
  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (highlightToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h !== highlightToRemove)
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
      equipment: prev.equipment?.filter(e => e !== equipmentToRemove)
    }));
  };

  // Gestion des langues
  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages?.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...(prev.languages || []), newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages?.filter(l => l !== languageToRemove)
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Réinitialisation
  const handleReset = () => {
    setFormData(defaultFormData);
    setImagePreview('');
    setAdditionalImages([]);
  };

  // Si modal fermée
  if (!isOpen) return null;

  // Icône selon le type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Nature': return TreePine;
      case 'Aventure': return Mountain;
      case 'Artisanat': return Palette;
      case 'Gastronomie': return Utensils;
      case 'Culture': return BookOpen;
      case 'Musique': return Music;
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
                { id: 'practical', label: 'Pratique', icon: Activity },
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="ex: Les Jardins Secrets de la Vanille"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Décrivez cette découverte unique..."
                      required
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      >
                        {DISCOVERY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulté *
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="ex: Vallée secrète, Saint-Philippe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durée estimée *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="ex: 2 heures, 1 journée"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note (1-5)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= formData.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-gray-700">{formData.rating}/5</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet: Détails */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points forts *
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="ex: Vue exceptionnelle, Authentique"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Ajouter
                      </button>
                    </div>
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
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
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
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Ajouter
                      </button>
                    </div>
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
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Conseils pratiques, choses à ne pas manquer..."
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
                    />
                  </div>
                </div>
              )}

              {/* Onglet: Médias */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale *
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
                          />
                          <label htmlFor="imageUpload" className="cursor-pointer">
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
                          value={formData.image}
                          onChange={handleChange}
                          placeholder="Ou collez une URL d'image"
                          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
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
                      />
                      <label htmlFor="additionalImages" className="cursor-pointer">
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
                        Taille de groupe recommandée
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                          <input
                            type="number"
                            name="groupSize.min"
                            value={formData.groupSize?.min || ''}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                          <input
                            type="number"
                            name="groupSize.max"
                            value={formData.groupSize?.max || ''}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="10"
                          />
                        </div>
                      </div>
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
                            name="ageRestriction.min"
                            value={formData.ageRestriction?.min || ''}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Âge maximum</label>
                          <input
                            type="number"
                            name="ageRestriction.max"
                            value={formData.ageRestriction?.max || ''}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            placeholder="100"
                          />
                        </div>
                      </div>
                    </div>
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
                      />
                      <button
                        type="button"
                        onClick={handleAddEquipment}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.equipment?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeEquipment(item)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langues disponibles
                    </label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      >
                        <option value="">Sélectionnez une langue</option>
                        {LANGUAGES.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddLanguage}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages?.map((lang, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
                        >
                          🌐 {lang}
                          <button
                            type="button"
                            onClick={() => removeLanguage(lang)}
                            className="ml-1 text-purple-500 hover:text-purple-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informations de sécurité
                    </label>
                    <textarea
                      name="safety"
                      value={formData.safety || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      placeholder="Précautions à prendre, risques éventuels..."
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
                        Organisateur *
                      </label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (optionnel)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Gratuit si vide"
                      />
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
                      >
                        <option value="EUR">€</option>
                        <option value="USD">$</option>
                        <option value="GBP">£</option>
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
                            Note éco-responsable (1-5)
                          </label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, sustainabilityRating: star }))}
                                className="p-1"
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
                          >
                            <option value="">Non spécifié</option>
                            <option value="very_low">Très faible</option>
                            <option value="low">Faible</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Élevée</option>
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
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                >
                  {mode === 'create' ? 'Créer la découverte' : 'Mettre à jour'}
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