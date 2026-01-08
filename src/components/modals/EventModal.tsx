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
  AlertTriangle,
  Target,
  ChevronRight,
  Loader2
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
  image?: string; // URL Supabase
  images?: string[]; // Tableau d'URLs Supabase
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
  onSubmit: (data: EventFormData) => Promise<void> | void;
  initialData?: EventFormData;
  mode: 'create' | 'edit';
  // Fonction pour uploader les images (optionnelle - si fournie, la modal gère l'upload avant le submit)
  onUploadImages?: (files: File[]) => Promise<string[]>;
  isSubmitting?: boolean;
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

// Types pour les fichiers temporaires
interface TempImage {
  file: File;
  previewUrl: string;
  isUploading?: boolean;
  uploadedUrl?: string;
}

// Fonction pour créer un SVG placeholder
const createPlaceholderSVG = (width: number = 300, height: number = 200, text: string = 'Image') => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
        ${text}
      </text>
    </svg>
  `)}`;
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  onUploadImages,
  isSubmitting = false
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
  const [mainImage, setMainImage] = useState<TempImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<TempImage[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newNotInclude, setNewNotInclude] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showErrorList, setShowErrorList] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

      // Si l'image principale existe déjà (URL Supabase)
      if (initialData.image) {
        // Vérifier si c'est un placeholder et le remplacer par un SVG local
        const isPlaceholder = initialData.image.includes('placeholder.com');
        const imageUrl = isPlaceholder 
          ? createPlaceholderSVG(300, 200, 'Event Image') 
          : initialData.image;
        
        setMainImage({
          previewUrl: imageUrl,
          uploadedUrl: isPlaceholder ? undefined : initialData.image,
          file: new File([], 'existing-image.jpg')
        });
      }

      // Si des images de galerie existent déjà
      if (initialData.images && initialData.images.length > 0) {
        const existingGalleryImages = initialData.images
          .map(img => {
            const isPlaceholder = img.includes('placeholder.com');
            return {
              previewUrl: isPlaceholder ? createPlaceholderSVG(300, 200, 'Gallery Image') : img,
              uploadedUrl: isPlaceholder ? undefined : img,
              file: new File([], 'existing-gallery-image.jpg')
            };
          });
        setGalleryImages(existingGalleryImages);
      }
    } else {
      setFormData(defaultFormData);
      setMainImage(null);
      setGalleryImages([]);
    }
    setFormErrors({});
    setShowErrorList(false);
    setIsUploading(false);
    setUploadProgress(0);
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

      setTimeout(() => {
        const element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Gestion de l'upload de l'image principale
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Créer un object URL pour la prévisualisation
    const previewUrl = URL.createObjectURL(file);

    setMainImage({
      file,
      previewUrl,
      isUploading: false
    });

    // Effacer les erreurs
    if (formErrors.image) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  // Gestion de l'upload des images de galerie
  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Réinitialiser l'input file
    e.target.value = '';

    const newTempImages: TempImage[] = [];

    files.forEach(file => {
      // Vérifications de base
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          images: 'Certaines images dépassent la taille maximale de 5MB'
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          images: 'Certains fichiers ne sont pas des images valides'
        }));
        return;
      }

      // Créer un object URL pour la prévisualisation
      const previewUrl = URL.createObjectURL(file);

      newTempImages.push({
        file,
        previewUrl,
        isUploading: false
      });
    });

    if (newTempImages.length > 0) {
      setGalleryImages(prev => [...prev, ...newTempImages]);
    }
  };

  // Supprimer l'image principale
  const removeMainImage = () => {
    if (mainImage?.previewUrl && mainImage.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mainImage.previewUrl);
    }
    setMainImage(null);
    setFormData(prev => ({ ...prev, image: undefined }));
  };

  // Supprimer une image de la galerie
  const removeGalleryImage = (index: number) => {
    const imageToRemove = galleryImages[index];
    if (imageToRemove.previewUrl && imageToRemove.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Fonction pour uploader toutes les images vers Supabase
  const uploadAllImages = async (): Promise<{ mainImageUrl?: string; galleryImageUrls: string[] }> => {
    const filesToUpload: File[] = [];

    // Récupérer les fichiers de l'image principale
    if (mainImage && !mainImage.uploadedUrl && mainImage.file.size > 0) {
      filesToUpload.push(mainImage.file);
    }

    // Récupérer les fichiers de la galerie
    const newGalleryImages = galleryImages.filter(img => !img.uploadedUrl && img.file.size > 0);
    newGalleryImages.forEach(img => filesToUpload.push(img.file));

    if (filesToUpload.length === 0) {
      // Aucune nouvelle image à uploader
      return {
        mainImageUrl: mainImage?.uploadedUrl,
        galleryImageUrls: galleryImages.map(img => img.uploadedUrl).filter(Boolean) as string[]
      };
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      if (!onUploadImages) {
        throw new Error('Aucune fonction d\'upload configurée');
      }

      // Uploader toutes les images en une fois
      setUploadProgress(30);
      const uploadedUrls = await onUploadImages(filesToUpload);
      setUploadProgress(70);

      // Mapper les URLs aux images
      let urlIndex = 0;
      const galleryUrls: string[] = [];

      // Traiter l'image principale
      let mainImageUrl = mainImage?.uploadedUrl;
      if (mainImage && !mainImage.uploadedUrl && mainImage.file.size > 0) {
        mainImageUrl = uploadedUrls[urlIndex];
        urlIndex++;
      }

      // Traiter les images de galerie
      galleryImages.forEach(img => {
        if (img.uploadedUrl) {
          galleryUrls.push(img.uploadedUrl);
        } else if (img.file.size > 0) {
          galleryUrls.push(uploadedUrls[urlIndex]);
          urlIndex++;
        }
      });

      setUploadProgress(100);

      return {
        mainImageUrl,
        galleryImageUrls: galleryUrls
      };

    } catch (error) {
      console.error('Erreur lors de l\'upload des images:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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
  const prepareFormData = async (): Promise<EventFormData> => {
    const finalData = { ...formData };

    // Si on a des images à uploader et une fonction d'upload
    if ((mainImage || galleryImages.length > 0) && onUploadImages) {
      try {
        const { mainImageUrl, galleryImageUrls } = await uploadAllImages();

        // Mettre à jour l'image principale
        if (mainImageUrl) {
          finalData.image = mainImageUrl;
        } else {
          finalData.image = undefined;
        }

        // Mettre à jour les images de galerie
        if (galleryImageUrls.length > 0) {
          finalData.images = galleryImageUrls;
        } else {
          finalData.images = [];
        }
      } catch (error) {
        console.error('Erreur lors de la préparation des images:', error);
        throw new Error('Échec de l\'upload des images');
      }
    } else {
      // Utiliser les URLs existantes (sans les placeholders)
      if (mainImage?.uploadedUrl && !mainImage.uploadedUrl.includes('data:image/svg+xml')) {
        finalData.image = mainImage.uploadedUrl;
      } else {
        finalData.image = undefined;
      }

      const existingGalleryUrls = galleryImages
        .map(img => img.uploadedUrl)
        .filter((url): url is string => 
          Boolean(url) && !url!.includes('data:image/svg+xml')
        );

      if (existingGalleryUrls.length > 0) {
        finalData.images = existingGalleryUrls;
      } else {
        finalData.images = [];
      }
    }

    // Formater les dates (comme dans votre hook)
    if (finalData.registrationDeadline) {
      try {
        const date = new Date(finalData.registrationDeadline);
        if (!isNaN(date.getTime())) {
          finalData.registrationDeadline = date.toISOString().split('T')[0];
        } else {
          finalData.registrationDeadline = undefined;
        }
      } catch {
        finalData.registrationDeadline = undefined;
      }
    }

    if (finalData.earlyBirdDeadline) {
      try {
        const date = new Date(finalData.earlyBirdDeadline);
        if (!isNaN(date.getTime())) {
          finalData.earlyBirdDeadline = date.toISOString().split('T')[0];
        } else {
          finalData.earlyBirdDeadline = undefined;
        }
      } catch {
        finalData.earlyBirdDeadline = undefined;
      }
    }

    if (finalData.date) {
      try {
        const date = new Date(finalData.date);
        if (!isNaN(date.getTime())) {
          finalData.date = date.toISOString().split('T')[0]; // Format YYYY-MM-DD pour l'API
        }
      } catch (error) {
        console.error('Erreur format date:', error);
      }
    }

    return finalData;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        navigateToError(firstErrorField);
      }
      return;
    }

    try {
      const finalData = await prepareFormData();
      // console.log("📤 Données pour l'API:", finalData);
      await onSubmit(finalData);
    } catch (error) {
      // console.error('Erreur lors de la soumission:', error);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    // Révoquer les URLs locales
    if (mainImage?.previewUrl && mainImage.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mainImage.previewUrl);
    }

    galleryImages.forEach(img => {
      if (img.previewUrl && img.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });

    setFormData(defaultFormData);
    setMainImage(null);
    setGalleryImages([]);
    setFormErrors({});
    setShowErrorList(false);
    setIsUploading(false);
    setUploadProgress(0);
  };

  // Nettoyer les URLs locales lors de la fermeture
  const handleClose = () => {
    // Révoquer les URLs locales (blob: seulement)
    if (mainImage?.previewUrl && mainImage.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mainImage.previewUrl);
    }

    galleryImages.forEach(img => {
      if (img.previewUrl && img.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });

    onClose();
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
          onClick={handleClose}
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
                onClick={handleClose}
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
                    className={`flex items-center gap-2 px-6 py-3 whitespace-nowrap font-medium border-b-2 transition-colors ${activeTab === tab.id
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

              {/* Progress bar pour l'upload */}
              {isUploading && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-blue-700 mb-1">
                        <span>Upload des images vers Supabase...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet: Médias - CORRIGÉ */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale
                    </label>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">URL de l'image existante :</p>
                          <input
                            type="text"
                            name="image"
                            value={formData.image || ''}
                            onChange={handleChange}
                            placeholder="URL de l'image sur Supabase"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.image ? 'border-red-300' : 'border-gray-300'
                              }`}
                            disabled={!!mainImage?.file.size}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Laissez vide pour uploader une nouvelle image
                          </p>
                        </div>
                        {formErrors.image && <ErrorMessage error={formErrors.image} />}

                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Uploader une nouvelle image :</p>
                          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isUploading || isSubmitting
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-300 hover:border-[#6B8E23]'
                            }`}>
                            <input
                              type="file"
                              id="imageUpload"
                              accept="image/*"
                              onChange={handleMainImageUpload}
                              className="hidden"
                              disabled={isUploading || isSubmitting}
                            />
                            <label htmlFor="imageUpload" className={`cursor-pointer ${isUploading || isSubmitting ? 'opacity-70' : ''}`}>
                              {isUploading ? (
                                <div className="flex flex-col items-center">
                                  <Loader2 className="mx-auto text-blue-600 mb-3 h-8 w-8 animate-spin" />
                                  <p className="text-gray-700 font-medium">
                                    Upload en cours...
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="mx-auto text-gray-400 mb-3 h-8 w-8" />
                                  <p className="text-gray-700 font-medium">
                                    Cliquez pour uploader
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    PNG, JPG, WEBP (max 5MB) - Stocké sur Supabase
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
                          {mainImage ? (
                            <>
                              <img
                                src={mainImage.previewUrl}
                                alt="Preview"
                                className="w-full h-auto max-h-64 object-cover"
                                onError={() => {
                                  // Si l'image échoue, utiliser un placeholder SVG
                                  const placeholder = createPlaceholderSVG(300, 200, 'Image');
                                  if (mainImage.previewUrl.startsWith('blob:')) {
                                    URL.revokeObjectURL(mainImage.previewUrl);
                                  }
                                  setMainImage(prev => prev ? {
                                    ...prev,
                                    previewUrl: placeholder
                                  } : null);
                                }}
                              />
                              <button
                                type="button"
                                onClick={removeMainImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              {mainImage.uploadedUrl && !mainImage.uploadedUrl.includes('data:image/svg+xml') && (
                                <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                  ✓ Sur Supabase
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <ImageIcon className="mx-auto text-gray-300 h-12 w-12 mb-2" />
                              <p className="text-sm text-gray-500">Aucune image sélectionnée</p>
                              <p className="text-xs text-gray-400 mt-1">
                                L'image sera uploadée vers Supabase
                              </p>
                            </div>
                          )}
                        </div>
                        {mainImage && (
                          <div className="mt-2 text-xs text-gray-500">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{mainImage.file.name || 'Image existante'}</span>
                              <span className={mainImage.uploadedUrl && !mainImage.uploadedUrl.includes('data:image/svg+xml') ? 'text-green-600' : 'text-orange-600'}>
                                {mainImage.uploadedUrl && !mainImage.uploadedUrl.includes('data:image/svg+xml') ? '✓ Uploadé' : '⚠️ À uploader'}
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
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-colors ${isUploading || isSubmitting
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-300 hover:border-[#6B8E23]'
                      }`}>
                      <input
                        type="file"
                        id="additionalImages"
                        accept="image/*"
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                        multiple
                        disabled={isUploading || isSubmitting}
                      />
                      <label htmlFor="additionalImages" className={`cursor-pointer ${isUploading || isSubmitting ? 'opacity-70' : ''}`}>
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="mx-auto text-blue-600 mb-3 h-8 w-8 animate-spin" />
                            <p className="text-gray-700 font-medium">
                              Upload en cours...
                            </p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="mx-auto text-gray-400 mb-3 h-8 w-8" />
                            <p className="text-gray-700 font-medium">
                              Ajouter des images supplémentaires
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Maximum 10 images, 5MB par image - Stocké sur Supabase
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    {galleryImages.length > 0 && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {galleryImages.map((img, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                  src={img.previewUrl}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => {
                                    // Si l'image échoue, utiliser un placeholder SVG
                                    const placeholder = createPlaceholderSVG(300, 200, `Image ${index + 1}`);
                                    if (img.previewUrl.startsWith('blob:')) {
                                      URL.revokeObjectURL(img.previewUrl);
                                    }
                                    const newGalleryImages = [...galleryImages];
                                    newGalleryImages[index] = { ...img, previewUrl: placeholder };
                                    setGalleryImages(newGalleryImages);
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {img.uploadedUrl && !img.uploadedUrl.includes('data:image/svg+xml') ? '✓' : 'Nouveau'}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {galleryImages.length} image{galleryImages.length > 1 ? 's' : ''} dans la galerie
                          {galleryImages.some(img => !img.uploadedUrl || img.uploadedUrl.includes('data:image/svg+xml')) && (
                            <span className="text-orange-600 ml-2">
                              ({galleryImages.filter(img => !img.uploadedUrl || img.uploadedUrl.includes('data:image/svg+xml')).length} nouvelle(s))
                            </span>
                          )}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.title ? 'border-red-300' : 'border-gray-300'
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
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.date ? 'border-red-300' : 'border-gray-300'
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.startTime ? 'border-red-300' : 'border-gray-300'
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.endTime ? 'border-red-300' : 'border-gray-300'
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.category ? 'border-red-300' : 'border-gray-300'
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
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.location ? 'border-red-300' : 'border-gray-300'
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
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.capacity ? 'border-red-300' : 'border-gray-300'
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
                            className={`flex-1 px-4 py-2 rounded-lg border ${formData.difficulty === level.value
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
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.price ? 'border-red-300' : 'border-gray-300'
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.contactEmail ? 'border-red-300' : 'border-gray-300'
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent ${formErrors.website ? 'border-red-300' : 'border-gray-300'
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
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className={`px-6 py-2.5 font-semibold rounded-lg transition-all ${isSubmitting || isUploading || Object.keys(formErrors).length > 0
                      ? 'bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white opacity-80'
                      : 'bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white hover:opacity-90'
                    }`}
                >
                  {isSubmitting ? 'Traitement...' : mode === 'create' ? 'Créer l\'événement' : 'Mettre à jour'}
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