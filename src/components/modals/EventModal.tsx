import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  DollarSign, 
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Building2,
  FileText,
  Globe,
  CreditCard,
  Percent,
  Timer,
  Star,
  AlertTriangle
} from 'lucide-react';

// Interface pour les données de l'événement
export interface EventFormData {
  id?: number;
  title: string;
  description: string;
  date: string; // Format: "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  city?: string;
  postalCode?: string;
  category: string;
  subCategory?: string;
  capacity: number;
  price: number;
  discountPrice?: number;
  currency: string;
  image?: string; // Doit être une URL valide ou undefined
  images?: string[];
  featured: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
  organizer?: string;
  contactEmail?: string; // Soit email valide, soit undefined
  contactPhone?: string;
  website?: string;
  tags?: string[];
  requirements?: string;
  highlights?: string[];
  duration?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  targetAudience?: string[];
  includes?: string[];
  notIncludes?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  registrationDeadline?: string; // Format: "YYYY-MM-DD"
  earlyBirdDeadline?: string; // Format: "YYYY-MM-DD"
  earlyBirdPrice?: number;
  participants?: number;
  revenue?: number;
  userId?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: EventFormData;
  mode: 'create' | 'edit';
}

// Catégories prédéfinies
const CATEGORIES = [
  'Cuisine', 'Nature', 'Musique', 'Artisanat', 'Culture', 
  'Sport', 'Art', 'Bien-être', 'Éducation', 'Technologie',
  'Business', 'Famille', 'Loisirs', 'Autre'
];

const SUB_CATEGORIES: Record<string, string[]> = {
  'Cuisine': ['Atelier', 'Dégustation', 'Cours', 'Dîner', 'Food Tour'],
  'Nature': ['Randonnée', 'Observation', 'Camping', 'Jardinage', 'Éco-tourisme'],
  'Musique': ['Concert', 'Festival', 'Jam Session', 'Cours', 'Masterclass'],
  'Culture': ['Visite guidée', 'Exposition', 'Conférence', 'Spectacle', 'Tradition']
};

// Niveaux de difficulté
const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Facile', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HARD', label: 'Difficile', color: 'bg-red-100 text-red-800' }
];

// Types de visibilité
const VISIBILITY_TYPES = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Privé' },
  { value: 'INVITE_ONLY', label: 'Sur invitation' }
];

// Statuts d'événement
const STATUS_TYPES = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'UPCOMING', label: 'À venir' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'CANCELLED', label: 'Annulé' },
  { value: 'ARCHIVED', label: 'Archivé' }
];

interface FormErrors {
  [key: string]: string;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  // Données initiales par défaut basées sur le modèle Prisma
  const defaultFormData: EventFormData = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '17:00',
    location: '',
    category: '',
    capacity: 20,
    price: 0,
    currency: 'EUR',
    featured: false,
    status: 'DRAFT',
    visibility: 'PUBLIC',
    tags: [],
    highlights: [],
    includes: [],
    notIncludes: [],
    targetAudience: [],
    images: []
  };

  const [formData, setFormData] = useState<EventFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media' | 'pricing' | 'advanced'>('basic');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newNotInclude, setNewNotInclude] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const formattedData = {
        ...initialData,
        status: initialData.status || 'DRAFT',
        visibility: initialData.visibility || 'PUBLIC',
        tags: initialData.tags || [],
        highlights: initialData.highlights || [],
        includes: initialData.includes || [],
        notIncludes: initialData.notIncludes || [],
        targetAudience: initialData.targetAudience || [],
        images: initialData.images || []
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

  // Valider les champs requis selon le modèle Prisma
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Champs requis dans le modèle Prisma
    if (!formData.title.trim()) errors.title = 'Le titre est requis';
    if (!formData.description.trim()) errors.description = 'La description est requise';
    if (!formData.date) errors.date = 'La date est requise';
    if (!formData.startTime) errors.startTime = "L'heure de début est requise";
    if (!formData.endTime) errors.endTime = "L'heure de fin est requise";
    if (!formData.location.trim()) errors.location = 'Le lieu est requis';
    if (!formData.category) errors.category = 'La catégorie est requise';
    if (formData.capacity <= 0) errors.capacity = 'La capacité doit être supérieure à 0';
    if (formData.price < 0) errors.price = 'Le prix ne peut pas être négatif';
    
    // Validation des heures
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (start >= end) errors.endTime = "L'heure de fin doit être après l'heure de début";
    }
    
    // Validation de la date
    if (formData.date) {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) errors.date = "La date ne peut pas être dans le passé";
    }
    
    // Validation des deadlines
    if (formData.registrationDeadline) {
      const regDeadline = new Date(formData.registrationDeadline);
      const eventDate = new Date(formData.date);
      if (regDeadline > eventDate) {
        errors.registrationDeadline = 'La date limite d\'inscription ne peut pas être après la date de l\'événement';
      }
    }
    
    if (formData.earlyBirdDeadline) {
      const earlyBirdDeadline = new Date(formData.earlyBirdDeadline);
      const eventDate = new Date(formData.date);
      if (earlyBirdDeadline > eventDate) {
        errors.earlyBirdDeadline = 'La date limite early bird ne peut pas être après la date de l\'événement';
      }
    }
    
    // Validation du prix early bird
    if (formData.earlyBirdPrice !== undefined && formData.earlyBirdPrice >= formData.price) {
      errors.earlyBirdPrice = 'Le prix early bird doit être inférieur au prix standard';
    }
    
    // CORRECTION : Validation de l'email - soit valide, soit undefined
    if (formData.contactEmail && formData.contactEmail.trim() !== "") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        errors.contactEmail = 'Email invalide';
      }
    }
    
    // Validation du téléphone (format français)
    if (formData.contactPhone && formData.contactPhone.trim() !== "") {
      if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
        errors.contactPhone = 'Format de téléphone invalide (ex: 0612345678)';
      }
    }
    
    // CORRECTION : Validation de l'URL de l'image
    if (formData.image && formData.image.trim() !== "") {
      try {
        // Vérifier si c'est une URL valide
        const url = new URL(formData.image);
        if (!url.protocol.startsWith('http')) {
          errors.image = 'URL invalide. Doit commencer par http:// ou https://';
        }
      } catch {
        // Ce n'est pas une URL valide
        if (formData.image.startsWith('data:image/')) {
          // C'est une data URL (upload), c'est ok
        } else if (formData.image.includes('via.placeholder.com') || 
                  formData.image.includes('placeholder.com')) {
          // C'est un placeholder, c'est ok
        } else {
          errors.image = 'URL d\'image invalide';
        }
      }
    }
    
    // Validation du site web
    if (formData.website && formData.website.trim() !== "") {
      try {
        new URL(formData.website);
      } catch {
        errors.website = 'URL invalide';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements de formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? 0 : parseFloat(value) 
      }));
    } else {
      // Pour les champs optionnels, convertir les chaînes vides en undefined
      const optionalFields = ['contactEmail', 'contactPhone', 'website', 'image', 'address', 
                             'city', 'postalCode', 'subCategory', 'requirements', 'duration',
                             'cancellationPolicy', 'refundPolicy', 'organizer'];
      
      if (optionalFields.includes(name) && value.trim() === '') {
        setFormData(prev => ({ ...prev, [name]: undefined }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    
    // Effacer l'erreur quand l'utilisateur corrige
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Gestion des images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ 
          ...prev, 
          image: 'L\'image ne doit pas dépasser 5MB' 
        }));
        return;
      }
      
      // Validation du type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ 
          ...prev, 
          image: 'Veuillez uploader une image valide' 
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        if (formErrors.image) {
          setFormErrors(prev => ({ ...prev, image: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdditionalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validation de la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setFormErrors(prev => ({ 
            ...prev, 
            images: 'Une image dépasse la taille maximale de 5MB' 
          }));
          continue;
        }
        
        // Validation du type
        if (!file.type.startsWith('image/')) {
          setFormErrors(prev => ({ 
            ...prev, 
            images: 'Un fichier n\'est pas une image valide' 
          }));
          continue;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          newImages.push(imageUrl);
          
          if (newImages.length === files.length) {
            setAdditionalImages(prev => [...prev, ...newImages]);
            setFormData(prev => ({ 
              ...prev, 
              images: [...(prev.images || []), ...newImages] 
            }));
            if (formErrors.images) {
              setFormErrors(prev => ({ ...prev, images: '' }));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
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
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
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
      highlights: prev.highlights?.filter(h => h !== highlightToRemove)
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
      includes: prev.includes?.filter(i => i !== includeToRemove)
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
      notIncludes: prev.notIncludes?.filter(i => i !== notIncludeToRemove)
    }));
  };

  // Nettoyer les données avant envoi
  const cleanFormData = (data: EventFormData): EventFormData => {
    const cleaned = { ...data };
    
    // Liste des champs qui doivent être undefined si vides
    const optionalFields: (keyof EventFormData)[] = [
      'contactEmail', 'contactPhone', 'website', 'image',
      'address', 'city', 'postalCode', 'subCategory',
      'requirements', 'duration', 'cancellationPolicy', 
      'refundPolicy', 'organizer'
    ];
    
    optionalFields.forEach(field => {
      if (cleaned[field] === '' || cleaned[field] === null) {
        (cleaned[field] as any) = undefined;
      }
    });
    
    // Pour l'image, utiliser un placeholder valide si undefined
    if (!cleaned.image) {
      cleaned.image = 'https://via.placeholder.com/300x200?text=Event+Image';
    }
    
    // S'assurer que les tableaux sont des tableaux vides si undefined
    const arrayFields: (keyof EventFormData)[] = [
      'tags', 'highlights', 'includes', 'notIncludes', 
      'targetAudience', 'images'
    ];
    
    arrayFields.forEach(field => {
      if (!cleaned[field]) {
        (cleaned[field] as any) = [];
      }
    });
    
    // Convertir les nombres
    cleaned.capacity = Number(cleaned.capacity);
    cleaned.price = Number(cleaned.price);
    if (cleaned.discountPrice !== undefined) cleaned.discountPrice = Number(cleaned.discountPrice);
    if (cleaned.earlyBirdPrice !== undefined) cleaned.earlyBirdPrice = Number(cleaned.earlyBirdPrice);
    
    return cleaned;
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Trouver le premier onglet avec des erreurs
      const fieldsWithErrors = Object.keys(formErrors);
      const errorFields = {
        basic: ['title', 'description', 'date', 'startTime', 'endTime', 'category'],
        details: ['location', 'capacity'],
        pricing: ['price', 'earlyBirdPrice'],
        advanced: ['contactEmail', 'contactPhone', 'website'],
        media: ['image']
      };
      
      for (const [tab, fields] of Object.entries(errorFields)) {
        if (fields.some(field => fieldsWithErrors.includes(field))) {
          setActiveTab(tab as any);
          break;
        }
      }
      
      return;
    }
    
    // Nettoyer et formater les données
    const cleanedData = cleanFormData(formData);
    
    console.log("📤 Données nettoyées pour l'API:", JSON.stringify(cleanedData, null, 2));
    
    onSubmit(cleanedData);
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData(defaultFormData);
    setImagePreview('');
    setAdditionalImages([]);
    setFormErrors({});
  };

  // Si la modal n'est pas ouverte
  if (!isOpen) return null;

  // Composant pour afficher les erreurs
  const ErrorMessage = ({ error }: { error: string }) => (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
      <AlertTriangle className="h-3 w-3" />
      <span>{error}</span>
    </div>
  );

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
          <div className="px-6 py-4 bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-7 w-7" />
                <div>
                  <h3 className="text-xl font-bold">
                    {mode === 'create' ? 'Créer un nouvel événement' : 'Modifier l\'événement'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {mode === 'create' ? 'Remplissez les informations de votre événement' : 'Modifiez les informations de votre événement'}
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
                { id: 'basic', label: 'Informations de base', icon: FileText },
                { id: 'details', label: 'Détails', icon: Building2 },
                { id: 'media', label: 'Médias', icon: ImageIcon },
                { id: 'pricing', label: 'Tarification', icon: CreditCard },
                { id: 'advanced', label: 'Avancé', icon: Globe }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 whitespace-nowrap font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#6B8E23] text-[#6B8E23] bg-white'
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
              {/* Onglet: Informations de base */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'événement *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                        formErrors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="ex: Atelier Culinaire Premium"
                      required
                    />
                    {formErrors.title && <ErrorMessage error={formErrors.title} />}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                        formErrors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Décrivez votre événement en détail..."
                      required
                    />
                    {formErrors.description && <ErrorMessage error={formErrors.description} />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de l'événement *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                            formErrors.date ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {formErrors.date && <ErrorMessage error={formErrors.date} />}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure de début *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                              formErrors.startTime ? 'border-red-300' : 'border-gray-300'
                            }`}
                            required
                          />
                        </div>
                        {formErrors.startTime && <ErrorMessage error={formErrors.startTime} />}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure de fin *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                              formErrors.endTime ? 'border-red-300' : 'border-gray-300'
                            }`}
                            required
                          />
                        </div>
                        {formErrors.endTime && <ErrorMessage error={formErrors.endTime} />}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                          formErrors.category ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {formErrors.category && <ErrorMessage error={formErrors.category} />}
                    </div>

                    {formData.category && SUB_CATEGORIES[formData.category] && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sous-catégorie
                        </label>
                        <select
                          name="subCategory"
                          value={formData.subCategory || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        >
                          <option value="">Sélectionnez une sous-catégorie</option>
                          {SUB_CATEGORIES[formData.category].map(subCat => (
                            <option key={subCat} value={subCat}>{subCat}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      placeholder="ex: 3 heures"
                    />
                  </div>
                </div>
              )}

              {/* Onglet: Détails */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu / Localisation *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                          formErrors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="ex: Centre Ville, Restaurant La Villa"
                        required
                      />
                    </div>
                    {formErrors.location && <ErrorMessage error={formErrors.location} />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="123 Rue de la République"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                          placeholder="Paris"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                          placeholder="75001"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacité maximale *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          min="1"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                            formErrors.capacity ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      {formErrors.capacity && <ErrorMessage error={formErrors.capacity} />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulté
                      </label>
                      <div className="flex gap-2">
                        {DIFFICULTY_LEVELS.map(level => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value as any }))}
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                              formData.difficulty === level.value
                                ? `${level.color} border-transparent font-medium`
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="Ajouter un tag (ex: gastronomie, local)"
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
                      {formData.tags?.map(tag => (
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="Ajouter un point fort"
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
                      {formData.highlights?.map((highlight, index) => (
                        <li key={index} className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
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
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                          formErrors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#6B8E23]'
                        }`}>
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
                        {formErrors.image && <ErrorMessage error={formErrors.image} />}
                        <input
                          type="url"
                          name="image"
                          value={formData.image || ''}
                          onChange={handleChange}
                          placeholder="https://via.placeholder.com/300x200?text=Event+Image"
                          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Laisser vide pour utiliser l'image par défaut
                        </p>
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
                                setFormData(prev => ({ ...prev, image: undefined }));
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
                      Galerie d'images supplémentaires
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-colors ${
                      formErrors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#6B8E23]'
                    }`}>
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
                        <p className="text-sm text-gray-500 mt-1">
                          Maximum 10 images, 5MB par image
                        </p>
                      </label>
                    </div>
                    {formErrors.images && <ErrorMessage error={formErrors.images} />}

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

              {/* Onglet: Tarification */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix standard *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                            formErrors.price ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="bg-transparent text-gray-600 focus:outline-none"
                          >
                            <option value="EUR">€</option>
                            <option value="USD">$</option>
                            <option value="GBP">£</option>
                          </select>
                        </div>
                      </div>
                      {formErrors.price && <ErrorMessage error={formErrors.price} />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix promo
                      </label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          name="discountPrice"
                          value={formData.discountPrice || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                          placeholder="Optionnel"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix early bird
                      </label>
                      <div className="relative">
                        <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          name="earlyBirdPrice"
                          value={formData.earlyBirdPrice || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                            formErrors.earlyBirdPrice ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Optionnel"
                        />
                      </div>
                      {formErrors.earlyBirdPrice && <ErrorMessage error={formErrors.earlyBirdPrice} />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date limite early bird
                      </label>
                      <input
                        type="date"
                        name="earlyBirdDeadline"
                        value={formData.earlyBirdDeadline || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                          formErrors.earlyBirdDeadline ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {formErrors.earlyBirdDeadline && <ErrorMessage error={formErrors.earlyBirdDeadline} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date limite d'inscription
                      </label>
                      <input
                        type="date"
                        name="registrationDeadline"
                        value={formData.registrationDeadline || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                          formErrors.registrationDeadline ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {formErrors.registrationDeadline && <ErrorMessage error={formErrors.registrationDeadline} />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conditions d'annulation
                      </label>
                      <select
                        name="cancellationPolicy"
                        value={formData.cancellationPolicy || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      >
                        <option value="">Sélectionnez une politique</option>
                        <option value="flexible">Flexible (remboursement jusqu'à 24h avant)</option>
                        <option value="moderate">Modérée (remboursement jusqu'à 7 jours avant)</option>
                        <option value="strict">Stricte (non remboursable)</option>
                        <option value="custom">Personnalisée</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inclusions
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newInclude}
                        onChange={(e) => setNewInclude(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="ex: Matériel fourni, Collation"
                      />
                      <button
                        type="button"
                        onClick={handleAddInclude}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Ajouter
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {formData.includes?.map((item, index) => (
                        <li key={index} className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-blue-600" />
                            <span>{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeInclude(item)}
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
                      Non inclus
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newNotInclude}
                        onChange={(e) => setNewNotInclude(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNotInclude())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="ex: Transport, Hébergement"
                      />
                      <button
                        type="button"
                        onClick={handleAddNotInclude}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Ajouter
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {formData.notIncludes?.map((item, index) => (
                        <li key={index} className="flex items-center justify-between px-3 py-2 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-600" />
                            <span>{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNotInclude(item)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="Votre entreprise ou nom"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                          formErrors.contactEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="email@exemple.com"
                      />
                      {formErrors.contactEmail && <ErrorMessage error={formErrors.contactEmail} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone de contact
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                          formErrors.contactPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0612345678"
                      />
                      {formErrors.contactPhone && <ErrorMessage error={formErrors.contactPhone} />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                          formErrors.website ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="https://"
                      />
                      {formErrors.website && <ErrorMessage error={formErrors.website} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      >
                        {STATUS_TYPES.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibilité *
                      </label>
                      <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      >
                        {VISIBILITY_TYPES.map(visibility => (
                          <option key={visibility.value} value={visibility.value}>
                            {visibility.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#6B8E23] rounded focus:ring-[#6B8E23]"
                      />
                      <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                        Mettre en vedette
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exigences particulières
                      </label>
                      <input
                        type="text"
                        name="requirements"
                        value={formData.requirements || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="ex: Âge minimum, Tenue vestimentaire"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Politique de remboursement
                    </label>
                    <textarea
                      name="refundPolicy"
                      value={formData.refundPolicy || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      placeholder="Décrivez votre politique de remboursement..."
                    />
                  </div>
                </div>
              )}

              {/* Afficher les erreurs générales */}
              {Object.keys(formErrors).length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Veuillez corriger les erreurs suivantes :</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {Object.values(formErrors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
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
                  className={`px-6 py-2.5 font-semibold rounded-lg transition-all ${
                    Object.keys(formErrors).length > 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white hover:opacity-90'
                  }`}
                  disabled={Object.keys(formErrors).length > 0}
                >
                  {mode === 'create' ? 'Créer l\'événement' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;