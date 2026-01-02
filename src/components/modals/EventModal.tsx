import React, { useState, useEffect, useRef } from 'react';
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
  Check,
  AlertCircle,
  Building2,
  FileText,
  Globe,
  CreditCard,
  Percent,
  Timer,
  Star,
  AlertTriangle,
  Eye,
  EyeOff,
  Target,
  ChevronRight
} from 'lucide-react';

// Interface pour les données de l'événement basée sur le modèle Prisma
export interface EventFormData {
  id?: number;
  title: string;
  description: string;
  date: string; // Format: "YYYY-MM-DD"
  startTime?: string; // Optionnel dans Prisma
  endTime?: string; // Optionnel dans Prisma
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
  image?: string;
  images?: string[]; // JSON dans Prisma
  featured: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  tags?: string[]; // JSON dans Prisma
  requirements?: string;
  highlights?: string[]; // JSON dans Prisma
  duration?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  targetAudience?: string[]; // JSON dans Prisma
  includes?: string[]; // JSON dans Prisma
  notIncludes?: string[]; // JSON dans Prisma
  cancellationPolicy?: string;
  refundPolicy?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  registrationDeadline?: string; // Format: "YYYY-MM-DD"
  earlyBirdDeadline?: string; // Format: "YYYY-MM-DD"
  earlyBirdPrice?: number;
  // participants et revenue sont gérés automatiquement
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: EventFormData;
  mode: 'create' | 'edit';
}

// Catégories prédéfinies - simplifiées
const CATEGORIES = [
  'Cuisine', 'Nature', 'Musique', 'Artisanat', 'Culture', 
  'Sport', 'Art', 'Bien-être', 'Éducation', 'Technologie',
  'Business', 'Famille', 'Loisirs', 'Autre'
];

// Niveaux de difficulté selon l'enum Prisma
const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Facile', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HARD', label: 'Difficile', color: 'bg-red-100 text-red-800' }
];

// Types de visibilité selon l'enum Prisma
const VISIBILITY_TYPES = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Privé' },
  { value: 'INVITE_ONLY', label: 'Sur invitation' }
];

// Statuts d'événement selon l'enum Prisma
const STATUS_TYPES = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'UPCOMING', label: 'À venir' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'CANCELLED', label: 'Annulé' },
  { value: 'ARCHIVED', label: 'Archivé' }
];

// Devises supportées selon votre modèle
const CURRENCIES = ['EUR', 'USD', 'MGA', 'GBP', 'JPY', 'CNY'];

interface FormErrors {
  [key: string]: string;
}

// Mappage des champs aux onglets
const FIELD_TO_TAB: Record<string, 'basic' | 'details' | 'media' | 'pricing' | 'advanced'> = {
  'title': 'basic',
  'description': 'basic',
  'date': 'basic',
  'startTime': 'basic',
  'endTime': 'basic',
  'category': 'basic',
  'duration': 'basic',
  'location': 'details',
  'address': 'details',
  'city': 'details',
  'postalCode': 'details',
  'capacity': 'details',
  'subCategory': 'details',
  'difficulty': 'details',
  'requirements': 'details',
  'image': 'media',
  'images': 'media',
  'price': 'pricing',
  'discountPrice': 'pricing',
  'currency': 'pricing',
  'earlyBirdPrice': 'pricing',
  'earlyBirdDeadline': 'pricing',
  'registrationDeadline': 'pricing',
  'cancellationPolicy': 'pricing',
  'refundPolicy': 'pricing',
  'organizer': 'advanced',
  'contactEmail': 'advanced',
  'contactPhone': 'advanced',
  'website': 'advanced',
  'status': 'advanced',
  'visibility': 'advanced',
  'featured': 'advanced'
};

// Fonction pour compresser une image
const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensionner si l'image est trop large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir en JPEG avec qualité réduite
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
  });
};

// Fonction pour vérifier si une URL est une data URL valide
const isValidDataUrl = (url: string): boolean => {
  return url.startsWith('data:image/') && url.includes('base64,');
};

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
  const [newTarget, setNewTarget] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showErrorList, setShowErrorList] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Références pour les champs de formulaire
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const capacityRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  // Initialiser le formulaire
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
    setShowErrorList(false);
  }, [mode, initialData, isOpen]);

  // Valider les champs requis selon le modèle Prisma
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Champs requis dans le modèle Prisma
    if (!formData.title.trim()) errors.title = 'Le titre est requis';
    if (!formData.date) errors.date = 'La date est requise';
    if (!formData.location.trim()) errors.location = 'Le lieu est requis';
    if (!formData.category) errors.category = 'La catégorie est requise';
    if (formData.capacity <= 0) errors.capacity = 'La capacité doit être supérieure à 0';
    if (formData.price < 0) errors.price = 'Le prix ne peut pas être négatif';
    
    // Validation des heures (optionnelles mais doivent être valides si fournies)
    if (formData.startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.startTime)) {
      errors.startTime = "Format d'heure invalide (HH:MM)";
    }
    if (formData.endTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.endTime)) {
      errors.endTime = "Format d'heure invalide (HH:MM)";
    }
    
    // Validation de l'email - soit valide, soit undefined
    if (formData.contactEmail && formData.contactEmail.trim() !== "") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        errors.contactEmail = 'Email invalide';
      }
    }
    
    // Validation de l'URL de l'image - accepter les data URLs
    if (formData.image && formData.image.trim() !== "") {
      try {
        // Si c'est une URL normale, la valider
        if (!formData.image.startsWith('data:')) {
          new URL(formData.image);
        }
        // Si c'est une data URL, vérifier qu'elle est valide
        else if (!isValidDataUrl(formData.image)) {
          errors.image = 'Format d\'image invalide';
        }
      } catch {
        errors.image = 'URL d\'image invalide';
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
    setShowErrorList(Object.keys(errors).length > 0);
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
                             'cancellationPolicy', 'refundPolicy', 'organizer',
                             'startTime', 'endTime', 'discountPrice', 'earlyBirdPrice',
                             'registrationDeadline', 'earlyBirdDeadline'];
      
      if (optionalFields.includes(name) && value.trim() === '') {
        setFormData(prev => ({ ...prev, [name]: undefined }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    
    // Effacer l'erreur quand l'utilisateur corrige
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Naviguer vers un champ avec erreur
  const navigateToError = (fieldName: string) => {
    const tab = FIELD_TO_TAB[fieldName];
    if (tab) {
      setActiveTab(tab);
      
      // Attendre un peu pour que l'onglet soit changé avant de focus
      setTimeout(() => {
        const element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Gestion des images - version corrigée
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Réinitialiser l'input file
    e.target.value = '';
    
    // Vérifications de base
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ 
        ...prev, 
        image: 'L\'image ne doit pas dépasser 5MB' 
      }));
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({ 
        ...prev, 
        image: 'Veuillez uploader une image valide (PNG, JPG, JPEG, WEBP)' 
      }));
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Compresser l'image avant de la convertir en base64
      const compressedImage = await compressImage(file, 1200, 0.7);
      
      // Vérifier la taille de l'image compressée
      const base64Size = compressedImage.length * 0.75; // Estimation taille en bytes
      if (base64Size > 2 * 1024 * 1024) { // Limite à 2MB après compression
        setFormErrors(prev => ({ 
          ...prev, 
          image: 'L\'image compressée est trop grande. Veuillez choisir une image plus petite.' 
        }));
        setIsUploading(false);
        return;
      }
      
      console.log('📏 Taille image compressée:', Math.round(base64Size / 1024), 'KB');
      
      setFormData(prev => ({ ...prev, image: compressedImage }));
      setImagePreview(compressedImage);
      
      if (formErrors.image) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      setFormErrors(prev => ({ 
        ...prev, 
        image: 'Erreur lors du traitement de l\'image' 
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddAdditionalImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Réinitialiser l'input file
    e.target.value = '';
    
    setIsUploading(true);
    const newImages: string[] = [];
    let hasError = false;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ 
          ...prev, 
          images: 'Certaines images dépassent la taille maximale de 5MB' 
        }));
        hasError = true;
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ 
          ...prev, 
          images: 'Certains fichiers ne sont pas des images valides' 
        }));
        hasError = true;
        continue;
      }
      
      try {
        // Compresser l'image
        const compressedImage = await compressImage(file, 800, 0.6);
        newImages.push(compressedImage);
        
        console.log(`📏 Image ${i+1} compressée:`, Math.round(compressedImage.length * 0.75 / 1024), 'KB');
      } catch (error) {
        console.error(`Erreur avec l'image ${i+1}:`, error);
        hasError = true;
      }
    }
    
    if (!hasError && newImages.length > 0) {
      setAdditionalImages(prev => [...prev, ...newImages]);
      setFormData(prev => ({ 
        ...prev, 
        images: [...(prev.images || []), ...newImages] 
      }));
    }
    
    setIsUploading(false);
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // Supprimer l'image principale
  const removeMainImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: undefined }));
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

  // Gestion du public cible
  const handleAddTarget = () => {
    if (newTarget.trim()) {
      setFormData(prev => ({
        ...prev,
        targetAudience: [...(prev.targetAudience || []), newTarget.trim()]
      }));
      setNewTarget('');
    }
  };

  const removeTarget = (targetToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience?.filter(t => t !== targetToRemove)
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
      'refundPolicy', 'organizer', 'startTime', 'endTime',
      'discountPrice', 'earlyBirdPrice', 'registrationDeadline',
      'earlyBirdDeadline', 'difficulty'
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
    
    // S'assurer que les tableaux JSON sont des tableaux
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
    
    // Formater les dates pour l'API
    if (cleaned.registrationDeadline) {
      cleaned.registrationDeadline = new Date(cleaned.registrationDeadline).toISOString();
    }
    if (cleaned.earlyBirdDeadline) {
      cleaned.earlyBirdDeadline = new Date(cleaned.earlyBirdDeadline).toISOString();
    }
    cleaned.date = new Date(cleaned.date).toISOString();
    
    return cleaned;
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Naviguer vers le premier champ avec erreur
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        navigateToError(firstErrorField);
      }
      return;
    }
    
    const cleanedData = cleanFormData(formData);
    console.log("📤 Données nettoyées pour l'API:", {
      ...cleanedData,
      image: cleanedData.image?.substring(0, 100) + '...', // Log partiel pour éviter l'overflow
      images: cleanedData.images?.map(img => img.substring(0, 50) + '...')
    });
    onSubmit(cleanedData);
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData(defaultFormData);
    setImagePreview('');
    setAdditionalImages([]);
    setFormErrors({});
    setShowErrorList(false);
    setIsUploading(false);
  };

  // Obtenir le label du champ pour l'affichage des erreurs
  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      'title': 'Titre',
      'date': 'Date',
      'location': 'Lieu',
      'category': 'Catégorie',
      'capacity': 'Capacité',
      'price': 'Prix',
      'startTime': 'Heure de début',
      'endTime': 'Heure de fin',
      'contactEmail': 'Email de contact',
      'website': 'Site web',
      'image': 'Image principale'
    };
    
    return labels[fieldName] || fieldName;
  };

  if (!isOpen) return null;

  const ErrorMessage = ({ error }: { error: string }) => (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
      <AlertTriangle className="h-3 w-3" />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

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
              {/* Liste des erreurs avec navigation */}
              {showErrorList && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between text-red-700 font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Veuillez corriger les erreurs suivantes :</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowErrorList(false)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {Object.entries(formErrors).map(([field, error]) => (
                      <li key={field} className="flex items-center justify-between">
                        <div className="text-sm text-red-600">
                          <span className="font-medium">{getFieldLabel(field)} :</span> {error}
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateToError(field)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          Corriger
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Onglet: Médias - CORRIGÉ */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale *
                    </label>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">URL de l'image :</p>
                          <input
                            type="text"
                            name="image"
                            value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                              formErrors.image ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {formErrors.image && <ErrorMessage error={formErrors.image} />}
                        
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Ou uploader une image :</p>
                          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                            isUploading 
                              ? 'border-blue-300 bg-blue-50' 
                              : 'border-gray-300 hover:border-[#6B8E23]'
                          }`}>
                            <input
                              type="file"
                              id="imageUpload"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                            <label htmlFor="imageUpload" className={`cursor-pointer ${isUploading ? 'opacity-70' : ''}`}>
                              {isUploading ? (
                                <div className="flex flex-col items-center">
                                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6B8E23] mb-3"></div>
                                  <p className="text-gray-700 font-medium">
                                    Compression en cours...
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Veuillez patienter
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="mx-auto text-gray-400 mb-3 h-8 w-8" />
                                  <p className="text-gray-700 font-medium">
                                    Cliquez pour uploader
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    PNG, JPG, WEBP (max 5MB) - L'image sera automatiquement compressée
                                  </p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Aperçu de l'image */}
                      <div className="w-64">
                        <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 min-h-[200px] bg-gray-50 flex items-center justify-center">
                          {imagePreview ? (
                            <>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-auto max-h-64 object-cover"
                                onError={() => {
                                  setFormErrors(prev => ({ 
                                    ...prev, 
                                    image: 'Erreur de chargement de l\'image' 
                                  }));
                                }}
                              />
                              <button
                                type="button"
                                onClick={removeMainImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <ImageIcon className="mx-auto text-gray-300 h-12 w-12 mb-2" />
                              <p className="text-sm text-gray-500">Aucune image sélectionnée</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Utilisera l'image par défaut
                              </p>
                            </div>
                          )}
                        </div>
                        {imagePreview && (
                          <div className="mt-2 text-xs text-gray-500">
                            <div className="flex items-center justify-between">
                              <span>Taille: {Math.round((imagePreview.length * 0.75) / 1024)} KB</span>
                              <span className="text-green-600">
                                ✓ Image compressée
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Galerie d'images supplémentaires
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-colors ${
                      isUploading 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-300 hover:border-[#6B8E23]'
                    }`}>
                      <input
                        type="file"
                        id="additionalImages"
                        accept="image/*"
                        onChange={handleAddAdditionalImage}
                        className="hidden"
                        multiple
                        disabled={isUploading}
                      />
                      <label htmlFor="additionalImages" className={`cursor-pointer ${isUploading ? 'opacity-70' : ''}`}>
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6B8E23] mb-3"></div>
                            <p className="text-gray-700 font-medium">
                              Compression en cours...
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Veuillez patienter
                            </p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="mx-auto text-gray-400 mb-3 h-8 w-8" />
                            <p className="text-gray-700 font-medium">
                              Ajouter des images supplémentaires
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Maximum 10 images, 5MB par image - Compression automatique
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    {additionalImages.length > 0 && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {additionalImages.map((img, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                  src={img}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => {
                                    console.error(`Erreur de chargement de l'image ${index + 1}`);
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {Math.round((img.length * 0.75) / 1024)} KB
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {additionalImages.length} image{additionalImages.length > 1 ? 's' : ''} dans la galerie
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

             {/* Onglet: Informations de base */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'événement *
                    </label>
                    <input
                      ref={titleRef}
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
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      placeholder="Décrivez votre événement en détail..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de l'événement *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          ref={dateRef}
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                            formErrors.date ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      {formErrors.date && <ErrorMessage error={formErrors.date} />}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure de début
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="time"
                            name="startTime"
                            value={formData.startTime || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                              formErrors.startTime ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {formErrors.startTime && <ErrorMessage error={formErrors.startTime} />}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure de fin
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="time"
                            name="endTime"
                            value={formData.endTime || ''}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${
                              formErrors.endTime ? 'border-red-300' : 'border-gray-300'
                            }`}
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
                        ref={categoryRef}
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
                        maxLength={50}
                      />
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
                        ref={locationRef}
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
                          ref={capacityRef}
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
                        Sous-catégorie
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="ex: Atelier, Dégustation"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Public cible
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTarget}
                        onChange={(e) => setNewTarget(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTarget())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="ex: Adultes, Familles, Professionnels"
                      />
                      <button
                        type="button"
                        onClick={handleAddTarget}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.targetAudience?.map((target, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
                        >
                          <Target className="h-3 w-3" />
                          {target}
                          <button
                            type="button"
                            onClick={() => removeTarget(target)}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          ref={priceRef}
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
                            {CURRENCIES.map(currency => (
                              <option key={currency} value={currency}>{currency}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {formErrors.price && <ErrorMessage error={formErrors.price} />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix réduit
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                          placeholder="Optionnel"
                        />
                      </div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conditions d'annulation
                      </label>
                      <input
                        type="text"
                        name="cancellationPolicy"
                        value={formData.cancellationPolicy || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="ex: Flexible, modérée, stricte"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Politique de remboursement
                      </label>
                      <input
                        type="text"
                        name="refundPolicy"
                        value={formData.refundPolicy || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="ex: Remboursement jusqu'à 48h avant"
                      />
                    </div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                        placeholder="0612345678"
                      />
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
                      Mettre en vedette (featured)
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
                  className={`px-6 py-2.5 font-semibold rounded-lg transition-all ${
                    Object.keys(formErrors).length > 0
                      ? 'bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white hover:opacity-90 opacity-80'
                      : 'bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white hover:opacity-90'
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? 'Traitement...' : mode === 'create' ? 'Créer l\'événement' : 'Mettre à jour'}
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