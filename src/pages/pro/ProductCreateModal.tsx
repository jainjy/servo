// ProductCreateModal.tsx - VERSION CORRIGÉE AVEC TOAST D'ERREUR

import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Loader2, ChevronDown, Package, Palette, Camera, Scissors, Plus, Minus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

// Types compatibles avec votre modèle Prisma
interface ArtMetadata {
  creationDate?: string;
  dimensions?: string;
  materials?: string;
  artistName?: string;
  type?: string;
  category?: string;
  isArtwork?: boolean;
  artworkType?: string;
  [key: string]: any;
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  type: string;
  category: string;
  price: number;
  quantity: number;
  status: 'published' | 'draft' | 'sold';
  images: string[];
  dimensions: ArtMetadata;
  materials?: string;
  creationDate?: string;
  artistName?: string;
}

interface ImageFile {
  file?: File;
  preview: string;
  uploadProgress: number;
  uploadedUrl?: string;
  uploadedFilename?: string;
  error?: string;
}

interface ProductCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialData?: Partial<ProductFormData>;
  onSuccess?: () => void;
}

// Types principaux
const TYPES = ['photographie', 'sculpture', 'peinture', 'artisanat'] as const;

// Icônes pour chaque type
const TYPE_ICONS = {
  'photographie': Camera,
  'sculpture': Scissors,
  'peinture': Palette,
  'artisanat': Package
};

// Catégories par type (métiers)
const METIERS_PAR_CATEGORIES = [
  // PHOTOGRAPHIE
  { libelle: "Photographe portrait", categorie: "photographie" },
  { libelle: "Photographe paysage", categorie: "photographie" },
  { libelle: "Photographe événementiel", categorie: "photographie" },
  { libelle: "Photographe artistique", categorie: "photographie" },
  { libelle: "Photographe de mode", categorie: "photographie" },
  
  // SCULPTURE
  { libelle: "Sculpteur sur bois", categorie: "sculpture" },
  { libelle: "Sculpteur sur pierre", categorie: "sculpture" },
  { libelle: "Sculpteur sur métal", categorie: "sculpture" },
  { libelle: "Sculpteur terre cuite", categorie: "sculpture" },
  { libelle: "Sculpteur contemporain", categorie: "sculpture" },
  
  // PEINTURE
  { libelle: "Peintre à l'huile", categorie: "peinture" },
  { libelle: "Peintre aquarelle", categorie: "peinture" },
  { libelle: "Peintre acrylique", categorie: "peinture" },
  { libelle: "Peintre mural", categorie: "peinture" },
  { libelle: "Peintre abstrait", categorie: "peinture" },
  { libelle: "Peintre portraitiste", categorie: "peinture" },
  
  // ARTISANAT
  { libelle: "Artisan céramiste", categorie: "artisanat" },
  { libelle: "Artisan tisserand", categorie: "artisanat" },
  { libelle: "Artisan maroquinier", categorie: "artisanat" },
  { libelle: "Artisan bijoutier", categorie: "artisanat" },
  { libelle: "Artisan ébéniste", categorie: "artisanat" },
  { libelle: "Artisan verrier", categorie: "artisanat" },
  { libelle: "Artisan vannier", categorie: "artisanat" },
  { libelle: "Artisan maroquinier d'art", categorie: "artisanat" },
];

// Fonction pour obtenir les libellés des catégories filtrées par type
const getCategoriesByType = (type: string) => {
  return METIERS_PAR_CATEGORIES
    .filter(item => item.categorie === type)
    .map(item => item.libelle);
};

// Fonction pour obtenir le libellé formaté pour l'affichage
const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'photographie': 'Photographie',
    'sculpture': 'Sculpture',
    'peinture': 'Peinture',
    'artisanat': 'Artisanat'
  };
  return labels[type] || type;
};

const apiBase = 'http://localhost:3001';

export const ProductCreateModal: React.FC<ProductCreateModalProps> = ({
  open,
  onOpenChange,
  userId,
  initialData,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState<string>('');

  // Form state avec statut par défaut 'published'
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    type: '',
    category: '',
    price: 0,
    quantity: 1,
    status: 'published', // Toujours publié par défaut
    images: [],
    dimensions: {},
    materials: '',
    creationDate: '',
    artistName: ''
  });

  // Catégories filtrées selon le type sélectionné
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Initialiser avec les données utilisateur
  useEffect(() => {
    if (user && !initialData) {
      const defaultArtistName = user.companyName || 
                               `${user.firstName} ${user.lastName}`.trim() || 
                               user.email;
      
      setFormData(prev => ({
        ...prev,
        artistName: defaultArtistName,
        dimensions: {
          ...prev.dimensions,
          artistName: defaultArtistName
        }
      }));
    }
  }, [user, initialData]);

  // Initialize avec initialData
  useEffect(() => {
    if (open) {
      if (initialData) {
        console.log('🔍 Initialisation avec données:', initialData);
        
        // Vérifier si on est en mode édition
        setIsEditing(!!initialData.id);
        setProductId(initialData.id || '');
        
        // Préparer les images existantes
        const existingImages = initialData.images || [];
        const imageFilesState: ImageFile[] = existingImages.map((url, index) => ({
          file: undefined,
          preview: url.startsWith('http') ? url : `${apiBase}${url}`,
          uploadProgress: 100,
          uploadedUrl: url,
          uploadedFilename: `existing-${index}`
        }));
        
        setImageFiles(imageFilesState);
        
        // Extraire les métadonnées
        const metadata = initialData.dimensions || {};
        const newFormData: ProductFormData = {
          id: initialData.id,
          name: initialData.name || '',
          description: initialData.description || '',
          type: initialData.type || '',
          category: initialData.category || '',
          price: initialData.price || 0,
          quantity: initialData.quantity || 1,
          status: initialData.status || 'published',
          images: existingImages,
          dimensions: metadata,
          materials: metadata.materials || '',
          creationDate: metadata.creationDate || '',
          artistName: metadata.artistName || 
                    user?.companyName || 
                    `${user?.firstName} ${user?.lastName}`.trim() || 
                    user?.email || ''
        };
        
        setFormData(newFormData);
        
        // Mettre à jour les catégories disponibles si un type est défini
        if (initialData.type) {
          setAvailableCategories(getCategoriesByType(initialData.type));
        }
      } else {
        // Mode création - réinitialiser
        resetForm();
      }
    }
  }, [initialData, open, user]);

  // Gestion des champs du formulaire
  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | string[] | ArtMetadata
  ) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      
      // Mettre à jour dimensions avec les champs spécifiques
      if (field === 'materials' || field === 'creationDate' || field === 'artistName') {
        newState.dimensions = {
          ...newState.dimensions,
          [field]: value
        };
      }
      
      return newState;
    });
  };

  // Gestion du changement de type
  const handleTypeChange = (value: string) => {
    // Mettre à jour le type
    setFormData(prev => ({ 
      ...prev, 
      type: value,
      category: '' // Réinitialiser la catégorie quand le type change
    }));
    
    // Mettre à jour les catégories disponibles
    setAvailableCategories(getCategoriesByType(value));
    
    // Mettre à jour dimensions avec le type
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        type: value,
        artworkType: value,
        isArtwork: true
      }
    }));
  };

  // Gestion des métadonnées dans dimensions
  const handleMetadataChange = (
    field: keyof ArtMetadata,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value
      }
    }));
    
    // Mettre à jour aussi les champs séparés si nécessaire
    if (field === 'materials') {
      setFormData(prev => ({ ...prev, materials: value }));
    }
    if (field === 'creationDate') {
      setFormData(prev => ({ ...prev, creationDate: value }));
    }
    if (field === 'artistName') {
      setFormData(prev => ({ ...prev, artistName: value }));
    }
  };

  // FONCTION D'UPLOAD RÉELLE
  const uploadImageToServer = async (file: File): Promise<{url: string, fullUrl: string, filename: string}> => {
    const token = localStorage.getItem('auth-token') || localStorage.getItem('token') || sessionStorage.getItem('token');
   
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${apiBase}/api/art-creation/products/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur ${response.status} lors de l'upload`);
    }

    const result = await response.json();
   
    if (!result.success) {
      throw new Error(result.error || 'Erreur inconnue lors de l\'upload');
    }

    return {
      url: result.url,
      fullUrl: result.fullUrl || `${apiBase}${result.url}`,
      filename: result.filename
    };
  };

  // Upload des images
  const handleImageUpload = async (files: FileList) => {
    const newImages: ImageFile[] = [];
   
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
     
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erreur',
          description: `Le fichier ${file.name} n'est pas une image`,
          variant: 'destructive',
          className: 'z-50'
        });
        continue;
      }
     
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Erreur',
          description: `L'image ${file.name} dépasse 10MB`,
          variant: 'destructive',
          className: 'z-50'
        });
        continue;
      }
     
      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        uploadProgress: 0
      });
    }
   
    if (newImages.length > 0) {
      setImageFiles(prev => [...prev, ...newImages]);
      uploadImagesToServer(newImages);
    }
  };

  const uploadImagesToServer = async (imagesToUpload: ImageFile[]) => {
    setUploadingImages(true);
   
    for (const image of imagesToUpload) {
      try {
        // Mise à jour pour montrer le début de l'upload
        setImageFiles(prev =>
          prev.map(img =>
            img.file === image.file
              ? { ...img, uploadProgress: 10 }
              : img
          )
        );
       
        // UPLOAD RÉEL
        const uploadResult = await uploadImageToServer(image.file!);
       
        // Mettre à jour avec la vraie URL
        setImageFiles(prev =>
          prev.map(img =>
            img.file === image.file
              ? {
                  ...img,
                  uploadedUrl: uploadResult.url,
                  uploadedFilename: uploadResult.filename,
                  uploadProgress: 100
                }
              : img
          )
        );
       
        // Ajouter l'URL à la liste des images du produit
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadResult.url]
        }));
       
        console.log(`✅ Image uploadée: ${uploadResult.url}`);
       
      } catch (error: any) {
        console.error('❌ Erreur upload:', error);
        setImageFiles(prev =>
          prev.map(img =>
            img.file === image.file
              ? {
                  ...img,
                  error: error.message || 'Échec du téléchargement',
                  uploadProgress: 0
                }
              : img
          )
        );
       
        toast({
          title: 'Erreur d\'upload',
          description: `${image.file?.name}: ${error.message}`,
          variant: 'destructive',
          className: 'z-50'
        });
      }
    }
   
    setUploadingImages(false);
  };

  const removeImage = async (index: number) => {
    const image = imageFiles[index];
   
    // Nettoyer la preview si c'est une nouvelle image
    if (image.preview && image.file) {
      URL.revokeObjectURL(image.preview);
    }
   
    // Si l'image a été uploadée, la supprimer du serveur
    if (image.uploadedFilename && image.file) {
      try {
        const token = localStorage.getItem('auth-token') || localStorage.getItem('token') || sessionStorage.getItem('token');
        await fetch(`${apiBase}/api/art-creation/products/delete/${image.uploadedFilename}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        console.log(`🗑️ Image supprimée du serveur: ${image.uploadedFilename}`);
      } catch (error) {
        console.error('Erreur suppression image:', error);
      }
    }
   
    // Mettre à jour l'état local
    setImageFiles(prev => prev.filter((_, i) => i !== index));
   
    if (image.uploadedUrl) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(url => url !== image.uploadedUrl)
      }));
    }
  };

  // Validation du formulaire - MODIFIÉE POUR TOAST
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push('Le titre est requis');
    if (!formData.description.trim()) errors.push('La description est requise');
    if (!formData.type) errors.push('Le type est requis');
    if (!formData.category) errors.push('La catégorie est requise');
    if (formData.price < 0) errors.push('Le prix doit être positif');
    if (formData.price === 0) errors.push('Le prix doit être supérieur à 0');
    if (formData.quantity === undefined || formData.quantity < 1) errors.push('La quantité doit être au moins 1');

    return errors;
  };

  const handleSubmit = async () => {
    // Validation
    const errors = validateForm();
    if (errors.length > 0) {
      // Afficher toutes les erreurs dans UN seul toast formaté
      toast({
        title: `Erreurs de validation (${errors.length})`,
        description: (
          <div>
            <ul className="list-disc pl-4 space-y-0.5 mt-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
            <p className="text-xs mt-2 text-white/90">Corrigez ces erreurs avant de publier le produit.</p>
          </div>
        ),
        variant: 'destructive',
        className: 'z-[100] max-w-md'
      });
      return;
    }
   
    // Vérifier uploads des images en cours
    const pendingUploads = imageFiles.filter(img => img.file && img.uploadProgress < 100);
    if (pendingUploads.length > 0) {
      toast({
        title: 'Upload en cours',
        description: 'Veuillez attendre la fin du téléchargement des images',
        variant: 'destructive',
        className: 'z-50'
      });
      return;
    }
   
    setIsSubmitting(true);
   
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('auth-token') ||
                    localStorage.getItem('token') ||
                    sessionStorage.getItem('token');
     
      if (!token) {
        toast({
          title: 'Authentification requise',
          description: 'Veuillez vous connecter',
          variant: 'destructive',
          className: 'z-50'
        });
        setIsSubmitting(false);
        return;
      }

      // Préparer les données pour le modèle Prisma
      const apiData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        price: formData.price,
        quantity: formData.quantity,
        status: formData.status, // Toujours 'published' par défaut
        images: formData.images,
        
        dimensions: {
          ...formData.dimensions,
          type: formData.type,
          category: formData.category,
          isArtwork: true,
          artworkType: formData.type,
          materials: formData.materials || formData.dimensions.materials,
          creationDate: formData.creationDate || formData.dimensions.creationDate,
          artistName: formData.artistName || 
                     user?.companyName || 
                     `${user?.firstName} ${user?.lastName}`.trim() || 
                     user?.email
        },
        
        materials: formData.materials || formData.dimensions.materials,
        creationDate: formData.creationDate || formData.dimensions.creationDate,
        artistName: formData.artistName || 
                   user?.companyName || 
                   `${user?.firstName} ${user?.lastName}`.trim() || 
                   user?.email
      };

      console.log('📤 Envoi données:', {
        isEditing,
        productId,
        data: apiData
      });

      // Choix de la méthode HTTP
      let url: string;
      let method: string;
      
      if (isEditing && productId) {
        url = `${apiBase}/api/art-creation/products/${productId}`;
        method = 'PUT';
      } else {
        url = `${apiBase}/api/art-creation/products/create`;
        method = 'POST';
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      const result = await res.json();
     
      if (!res.ok) {
        throw new Error(result.error || result.message || `Erreur ${res.status}`);
      }

      toast({
        title: 'Succès',
        description: isEditing 
          ? 'Produit mis à jour avec succès'
          : 'Produit créé avec succès',
        className: 'bg-green-50 text-green-800 border-green-200 z-50'
      });
     
      resetForm();
      onOpenChange(false);
      if (onSuccess) onSuccess();

    } catch (err: any) {
      console.error('❌ Erreur:', err);
      toast({
        title: 'Erreur',
        description: err?.message || `Erreur lors de ${isEditing ? 'la mise à jour' : 'la création'}`,
        variant: 'destructive',
        className: 'z-50'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    const defaultArtistName = user?.companyName || 
                             `${user?.firstName} ${user?.lastName}`.trim() || 
                             user?.email || '';
    
    setFormData({
      name: '',
      description: '',
      type: '',
      category: '',
      price: 0,
      quantity: 1,
      status: 'published',
      images: [],
      dimensions: {
        isArtwork: true,
        artistName: defaultArtistName
      },
      materials: '',
      creationDate: '',
      artistName: defaultArtistName
    });
   
    setAvailableCategories([]);
    setIsEditing(false);
    setProductId('');
   
    // Nettoyer les URLs d'image
    imageFiles.forEach(image => {
      if (image.preview && image.file) {
        URL.revokeObjectURL(image.preview);
      }
    });
   
    setImageFiles([]);
  };

  // Nettoyage à la fermeture
  useEffect(() => {
    if (!open) {
      setTimeout(resetForm, 300);
    }
  }, [open]);

  // Nettoyage des URLs d'image
  useEffect(() => {
    return () => {
      imageFiles.forEach(image => {
        if (image.preview && image.file) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [imageFiles]);

  // Obtenir l'icône du type sélectionné
  const SelectedTypeIcon = formData.type ? TYPE_ICONS[formData.type as keyof typeof TYPE_ICONS] : Palette;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#D3D3D3] bg-white rounded-2xl shadow-2xl z-50">
        <DialogHeader className="pb-4 border-b border-[#D3D3D3] sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#6B8E23]/10">
                <SelectedTypeIcon className="h-6 w-6 text-[#6B8E23]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[#8B4513]">
                  {isEditing ? 'Modifier un produit' : 'Ajouter un nouveau produit'}
                </DialogTitle>
                <p className="text-sm text-[#6B8E23] mt-1">
                  {isEditing 
                    ? 'Modifiez les informations de votre création artistique' 
                    : 'Complétez les informations de votre création artistique'}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4 px-6">
          {/* Section 1: Informations principales */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 bg-[#556B2F] rounded-full"></div>
              <h3 className="text-lg font-semibold text-[#8B4513]">Informations principales</h3>
            </div>
           
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colonne gauche - Informations de base */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-[#556B2F] flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Titre du produit *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: 'Soleil couchant sur la mer'"
                    className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3"
                  />
                  <p className="text-xs text-gray-500">Nom de votre création</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="font-medium text-[#556B2F] flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Prix (€) *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B8E23]">€</span>
                      <Input
                        id="price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="pl-10 border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="font-medium text-[#556B2F] flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Quantité *
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                        className="border-2 border-[#D3D3D3] h-10 w-10"
                        disabled={isSubmitting || uploadingImages}
                      >
                        <Minus size={16} />
                      </Button>
                      
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="999"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                        className="text-center border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3"
                      />
                      
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleInputChange('quantity', formData.quantity + 1)}
                        className="border-2 border-[#D3D3D3] h-10 w-10"
                        disabled={isSubmitting || uploadingImages}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Informations de l'artiste */}
                <div className="space-y-2">
                  <Label htmlFor="artistName" className="font-medium text-[#556B2F]">
                    Nom de l'artiste
                  </Label>
                  <Input
                    id="artistName"
                    value={formData.artistName}
                    onChange={(e) => handleInputChange('artistName', e.target.value)}
                    placeholder="Nom sous lequel le produit sera présenté"
                    className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3"
                  />
                  <p className="text-xs text-gray-500">
                    Par défaut: {user?.companyName || `${user?.firstName} ${user?.lastName}`.trim() || user?.email}
                  </p>
                </div>
              </div>
             
              {/* Colonne droite - Catégorisation */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="font-medium text-[#556B2F] flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Type du produit *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3 h-auto">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-[#D3D3D3] z-50">
                        {TYPES.map((type) => {
                          const Icon = TYPE_ICONS[type];
                          return (
                            <SelectItem key={type} value={type} className="py-3 focus:bg-[#6B8E23]/10">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  type === 'photographie' ? 'bg-blue-100' :
                                  type === 'sculpture' ? 'bg-amber-100' :
                                  type === 'peinture' ? 'bg-red-100' :
                                  'bg-green-100'
                                }`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="text-[#556B2F] font-medium">{getTypeLabel(type)}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-medium text-[#556B2F] flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Catégorie/Métier *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      disabled={!formData.type}
                    >
                      <SelectTrigger className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3 h-auto">
                        <SelectValue placeholder={
                          formData.type 
                            ? `Sélectionner (${availableCategories.length})`
                            : "Choisir d'abord un type"
                        } />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-[#D3D3D3] max-h-[200px] z-50">
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category} className="py-2 focus:bg-[#6B8E23]/10">
                            <div className="flex items-center gap-2">
                              <ChevronDown className="h-3 w-3 text-[#6B8E23]" />
                              <span className="text-[#556B2F]">{category}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.type && availableCategories.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Aucune catégorie disponible pour ce type
                      </p>
                    )}
                  </div>
                </div>

                {/* Informations techniques */}
                <div className="pt-4 border-t border-[#D3D3D3]">
                  <h4 className="text-md font-semibold text-[#8B4513] mb-3">Informations techniques</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creationDate" className="text-sm font-medium text-[#556B2F]">
                        Date de création
                      </Label>
                      <Input
                        id="creationDate"
                        type="date"
                        value={formData.creationDate || formData.dimensions.creationDate || ''}
                        onChange={(e) => handleMetadataChange('creationDate', e.target.value)}
                        className="border border-[#D3D3D3] focus:border-[#6B8E23] rounded-lg px-3 py-2"
                      />
                    </div>
                   
                    <div className="space-y-2">
                      <Label htmlFor="dimensions" className="text-sm font-medium text-[#556B2F]">
                        Dimensions
                      </Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions.dimensions || ''}
                        onChange={(e) => handleMetadataChange('dimensions', e.target.value)}
                        placeholder="Ex: 100x80 cm"
                        className="border border-[#D3D3D3] focus:border-[#6B8E23] rounded-lg px-3 py-2"
                      />
                    </div>
                   
                    <div className="space-y-2">
                      <Label htmlFor="materials" className="text-sm font-medium text-[#556B2F]">
                        Matériaux
                      </Label>
                      <Input
                        id="materials"
                        value={formData.materials || formData.dimensions.materials || ''}
                        onChange={(e) => handleInputChange('materials', e.target.value)}
                        placeholder="Ex: Huile sur toile, cadre bois"
                        className="border border-[#D3D3D3] focus:border-[#6B8E23] rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-[#D3D3D3]">
              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium text-[#556B2F] flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre produit, son inspiration, sa technique, son histoire..."
                  rows={4}
                  className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3 min-h-[100px]"
                />
                <p className="text-xs text-gray-500">Une description détaillée aide les acheteurs à mieux comprendre votre création</p>
              </div>
            </div>
          </div>
         
          {/* Section 2: Images - OPTIONNELLE */}
          <div className="space-y-6 pt-6 border-t border-[#D3D3D3]">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 bg-[#6B8E23] rounded-full"></div>
              <h3 className="text-lg font-semibold text-[#8B4513]">
                Galerie d'images
              </h3>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                Optionnel
              </Badge>
            </div>
           
            <div className="space-y-6">
              {/* Zone d'upload */}
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  disabled={isSubmitting || uploadingImages}
                />
                <label
                  htmlFor="image-upload"
                  className={`block border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    isSubmitting || uploadingImages
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-[#6B8E23] border-opacity-30 bg-[#6B8E23]/5 hover:border-[#556B2F] hover:bg-[#6B8E23]/10 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                      isSubmitting || uploadingImages ? 'bg-gray-200' : 'bg-[#6B8E23]/10'
                    }`}>
                      <Upload className={`h-8 w-8 transition-transform ${
                        isSubmitting || uploadingImages ? 'text-gray-400' : 'text-[#6B8E23]'
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-[#556B2F]">Ajouter des photos de votre produit</p>
                      <p className="text-sm text-[#6B8E23] mt-2">
                        Glissez-déposez vos images ou cliquez pour sélectionner
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Formats: JPG, PNG, WEBP</span>
                      <span>•</span>
                      <span>Max 10MB par image</span>
                      <span>•</span>
                      <span>Recommandé: 1200x800px</span>
                    </div>
                  </div>
                </label>
              </div>
             
              {/* Prévisualisation des images */}
              {imageFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#556B2F]">
                        {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} sélectionnée{imageFiles.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {imageFiles.filter(img => img.uploadProgress === 100).length} sur {imageFiles.length} téléchargée{imageFiles.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`font-medium px-3 py-1.5 ${
                        uploadingImages 
                          ? 'border-yellow-500 text-yellow-700 bg-yellow-50' 
                          : 'border-[#6B8E23] text-[#6B8E23] bg-[#6B8E23]/10'
                      }`}
                    >
                      {uploadingImages ? 'Téléchargement en cours...' : 'Prêt à publier'}
                    </Badge>
                  </div>
                 
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imageFiles.map((image, index) => {
                      const isUploading = image.file && image.uploadProgress > 0 && image.uploadProgress < 100;
                      const isUploaded = image.uploadProgress === 100;
                      const hasError = !!image.error;
                      
                      return (
                        <div key={index} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-xl border-2 border-[#D3D3D3] bg-gray-50 transition-all duration-300 group-hover:border-[#6B8E23] group-hover:shadow-lg">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                           
                            {/* Overlay pour upload en cours */}
                            {isUploading && (
                              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-white mb-2" />
                                <Progress
                                  value={image.uploadProgress}
                                  className="w-full h-1.5 bg-gray-300"
                                />
                                <p className="text-xs text-white mt-2 font-medium">
                                  {image.uploadProgress}%
                                </p>
                              </div>
                            )}
                           
                            {/* Overlay pour erreur */}
                            {hasError && (
                              <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center rounded-xl">
                                <p className="text-xs text-white text-center px-2">
                                  Erreur
                                </p>
                              </div>
                            )}
                           
                            {/* Badge image principale */}
                            {index === 0 && isUploaded && (
                              <div className="absolute top-2 left-2">
                                <Badge className="text-xs bg-[#6B8E23] text-white border-0 px-2 py-1">
                                  Principale
                                </Badge>
                              </div>
                            )}
                          </div>
                         
                          {/* Bouton de suppression */}
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-7 w-7 bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110"
                            onClick={() => removeImage(index)}
                            disabled={isSubmitting || uploadingImages}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                         
                          {/* Indicateur de statut */}
                          <div className="absolute bottom-2 left-2 right-2">
                            {isUploading && (
                              <Badge className="text-xs bg-blue-500 text-white w-full justify-center">
                                Envoi...
                              </Badge>
                            )}
                            {isUploaded && (
                              <Badge className="text-xs bg-green-500 text-white w-full justify-center">
                                ✓ Prêt
                              </Badge>
                            )}
                            {hasError && (
                              <Badge className="text-xs bg-red-500 text-white w-full justify-center">
                                Erreur
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                 
                  {/* Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      💡 <span className="font-medium">Conseil :</span> La première image sera utilisée comme visuel principal de votre produit. 
                      Choisissez une photo de haute qualité qui met en valeur votre création.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Message si pas d'images */}
              {imageFiles.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-amber-800">
                    ℹ️ Aucune image sélectionnée. Vous pouvez publier votre produit sans image pour l'instant.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-6 border-t border-[#D3D3D3] sticky bottom-0 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || uploadingImages}
            className="min-w-[120px] border-2 border-[#D3D3D3] text-[#556B2F] hover:bg-gray-50 hover:border-gray-400 rounded-xl px-6 py-2.5"
          >
            Annuler
          </Button>
        
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || uploadingImages}
            className="min-w-[160px] bg-[#6B8E23] text-white hover:bg-[#556B2F] hover:shadow-lg rounded-xl px-8 py-2.5 font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isEditing ? 'Mise à jour...' : 'Publication...'}
              </>
            ) : uploadingImages ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Téléchargement...
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Publier le produit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};