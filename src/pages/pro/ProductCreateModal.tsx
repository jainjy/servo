// ProductCreateModal.tsx - VERSION CORRIGÉE POUR MODÈLE PRISMA EXISTANT

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
import { X, Upload, Loader2, ChevronDown, Package, Palette, Camera, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth'; // Ajout de useAuth

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
  name: string;
  description: string;
  type: string; // Type principal: photographie, sculpture, peinture, artisanat
  category: string; // Catégorie spécifique
  price: number;
  status: 'published' | 'draft' | 'sold';
  images: string[];
  dimensions: ArtMetadata;
  materials?: string; // Champ séparé pour compatibilité
  creationDate?: string; // Champ séparé pour compatibilité
  artistName?: string; // Champ séparé pour compatibilité
}

interface ImageFile {
  file: File;
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

const STATUS_OPTIONS = [
  { value: 'published', label: 'Publié', color: 'bg-[#6B8E23]' },
  { value: 'draft', label: 'Brouillon', color: 'bg-[#8B4513]' },
  { value: 'sold', label: 'Vendu', color: 'bg-[#556B2F]' }
] as const;

const apiBase = 'http://localhost:3001';

export const ProductCreateModal: React.FC<ProductCreateModalProps> = ({
  open,
  onOpenChange,
  userId,
  initialData,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth(); // Récupérer les infos utilisateur
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state avec statut par défaut 'published'
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    type: '',
    category: '',
    price: 0,
    status: 'published',
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
      // Définir le nom d'artiste par défaut
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
    if (initialData && open) {
      const newFormData = {
        ...formData,
        ...initialData,
        userId
      };
      
      // Si initialData contient dimensions, extraire les champs spécifiques
      if (initialData.dimensions) {
        newFormData.materials = initialData.dimensions.materials || '';
        newFormData.creationDate = initialData.dimensions.creationDate || '';
        newFormData.artistName = initialData.dimensions.artistName || 
                                user?.companyName || 
                                `${user?.firstName} ${user?.lastName}`.trim() || 
                                user?.email || '';
      }
      
      setFormData(newFormData);
      
      // Si un type est fourni dans initialData, mettre à jour les catégories disponibles
      if (initialData.type) {
        setAvailableCategories(getCategoriesByType(initialData.type));
      }
    }
  }, [initialData, userId, open, user]);

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
    const TypeIcon = TYPE_ICONS[value as keyof typeof TYPE_ICONS] || Palette;
    
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
          variant: 'destructive'
        });
        continue;
      }
     
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Erreur',
          description: `L'image ${file.name} dépasse 10MB`,
          variant: 'destructive'
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
        const uploadResult = await uploadImageToServer(image.file);
       
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
          description: `${image.file.name}: ${error.message}`,
          variant: 'destructive'
        });
      }
    }
   
    setUploadingImages(false);
  };

  const removeImage = async (index: number) => {
    const image = imageFiles[index];
   
    // Nettoyer la preview
    if (image.preview) {
      URL.revokeObjectURL(image.preview);
    }
   
    // Si l'image a été uploadée, la supprimer du serveur
    if (image.uploadedFilename) {
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

  // Validation du formulaire
  const validateForm = (): string[] => {
    const errors: string[] = [];
   
    if (!formData.name.trim()) errors.push('Le titre est requis');
    if (!formData.description.trim()) errors.push('La description est requise');
    if (!formData.type) errors.push('Le type est requis');
    if (!formData.category) errors.push('La catégorie est requise');
    if (formData.price < 0) errors.push('Le prix doit être positif');
    if (formData.price === 0) errors.push('Le prix doit être supérieur à 0');
    if (formData.images.length === 0) errors.push('Au moins une image est requise');
   
    return errors;
  };

  const handleSubmit = async (submitStatus?: 'published' | 'draft') => {
    const finalStatus = submitStatus || formData.status;
   
    // Validation
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: 'Erreur de validation',
        description: errors.join(', '),
        variant: 'destructive'
      });
      return;
    }
   
    // Vérifier uploads des images
    const pendingUploads = imageFiles.filter(img => img.uploadProgress < 100);
    if (pendingUploads.length > 0) {
      toast({
        title: 'Upload en cours',
        description: 'Veuillez attendre la fin du téléchargement des images',
        variant: 'destructive'
      });
      return;
    }
   
    if (formData.images.length === 0) {
      toast({
        title: 'Images manquantes',
        description: 'Veuillez uploader au moins une image',
        variant: 'destructive'
      });
      return;
    }
   
    setIsSubmitting(true);
   
    try {
      // ✅ CORRECT: Récupérer le token d'authentification
      const token = localStorage.getItem('auth-token') ||
                    localStorage.getItem('token') ||
                    sessionStorage.getItem('token');
     
      if (!token) {
        toast({
          title: 'Authentification requise',
          description: 'Veuillez vous connecter',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ CORRECT: Préparer les données pour le modèle Prisma existant
      const apiData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,           // → sera stocké dans subcategory
        category: formData.category,   // → sera stocké dans category
        price: formData.price,
        status: finalStatus,
        images: formData.images,
        
        // Toutes les métadonnées dans dimensions
        dimensions: {
          ...formData.dimensions,
          // S'assurer que les champs clés sont présents
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
        
        // Champs séparés pour compatibilité avec l'API
        materials: formData.materials || formData.dimensions.materials,
        creationDate: formData.creationDate || formData.dimensions.creationDate,
        artistName: formData.artistName || 
                   user?.companyName || 
                   `${user?.firstName} ${user?.lastName}`.trim() || 
                   user?.email
      };

      console.log('📤 Envoi création œuvre:', apiData);

      const res = await fetch(`${apiBase}/api/art-creation/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ L'utilisateur est identifié ici
        },
        body: JSON.stringify(apiData)
      });

      const result = await res.json();
     
      if (!res.ok) {
        throw new Error(result.error || result.message || `Erreur ${res.status}`);
      }

      toast({
        title: 'Succès',
        description: result.message || 'Œuvre créée avec succès',
        className: 'bg-green-50 text-green-800 border-green-200'
      });
     
      resetForm();
      onOpenChange(false);
      if (onSuccess) onSuccess();

    } catch (err: any) {
      console.error('❌ Erreur création produit:', err);
      toast({
        title: 'Erreur',
        description: err?.message || 'Erreur lors de la création',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Récupérer le nom d'artiste par défaut
    const defaultArtistName = user?.companyName || 
                             `${user?.firstName} ${user?.lastName}`.trim() || 
                             user?.email || '';
    
    setFormData({
      name: '',
      description: '',
      type: '',
      category: '',
      price: 0,
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
   
    // Nettoyer les URLs d'image
    imageFiles.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
   
    setImageFiles([]);
  };

  // Nettoyage à la fermeture
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Nettoyage des URLs d'image
  useEffect(() => {
    return () => {
      imageFiles.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [imageFiles]);

  // Obtenir l'icône du type sélectionné
  const SelectedTypeIcon = formData.type ? TYPE_ICONS[formData.type as keyof typeof TYPE_ICONS] : Palette;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#D3D3D3] bg-white rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-[#D3D3D3]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#6B8E23]/10">
                <SelectedTypeIcon className="h-6 w-6 text-[#6B8E23]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[#8B4513]">
                  {initialData ? 'Modifier une œuvre' : 'Ajouter une nouvelle œuvre'}
                </DialogTitle>
                <p className="text-sm text-[#6B8E23] mt-1">
                  Complétez les informations de votre création artistique
                </p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); onOpenChange(false); }}
              aria-label="Fermer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Informations principales */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 bg-[#556B2F] rounded-full"></div>
              <h3 className="text-lg font-semibold text-[#8B4513]">Informations principales</h3>
            </div>
           
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-[#556B2F] flex items-center gap-1">
                    Titre de l'œuvre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: 'Soleil couchant sur la mer'"
                    className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3"
                  />
                </div>
               
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium text-[#556B2F] flex items-center gap-1">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre œuvre, son inspiration, sa technique, son histoire..."
                    rows={5}
                    className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3 min-h-[120px]"
                  />
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
                    placeholder="Nom sous lequel l'œuvre sera présentée"
                    className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3"
                  />
                  <p className="text-xs text-gray-500">
                    Par défaut: {user?.companyName || `${user?.firstName} ${user?.lastName}`.trim() || user?.email}
                  </p>
                </div>
              </div>
             
              {/* Colonne droite */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="font-medium text-[#556B2F] flex items-center gap-1">
                      Type d'œuvre <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger className="border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3 h-auto">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-[#D3D3D3]">
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
                      Catégorie/Métier <span className="text-red-500">*</span>
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
                      <SelectContent className="rounded-xl border-2 border-[#D3D3D3] max-h-[200px]">
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
               
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-medium text-[#556B2F] flex items-center gap-1">
                    Prix (€) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B8E23] font-bold">
                      
                    </span>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="pl-12 border-2 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl px-4 py-3"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Prix de vente de votre œuvre
                  </p>
                </div>
               
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-medium text-[#556B2F]">
                    Statut de publication
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => handleInputChange('status', status.value)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          formData.status === status.value
                            ? `${status.color} text-white border-2 border-transparent`
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
               
                {/* Informations supplémentaires */}
                <div className="pt-4 border-t border-[#D3D3D3]">
                  <h4 className="text-md font-semibold text-[#8B4513] mb-4">Informations techniques</h4>
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
          </div>
         
          {/* Section 2: Images */}
          <div className="space-y-6 pt-6 border-t border-[#D3D3D3]">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 bg-[#6B8E23] rounded-full"></div>
              <h3 className="text-lg font-semibold text-[#8B4513]">
                Galerie d'images <span className="text-red-500">*</span>
              </h3>
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
                      <p className="font-bold text-lg text-[#556B2F]">Ajouter des photos de votre œuvre</p>
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
                      const isUploading = image.uploadProgress > 0 && image.uploadProgress < 100;
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
                      💡 <span className="font-medium">Conseil :</span> La première image sera utilisée comme visuel principal de votre œuvre. 
                      Choisissez une photo de haute qualité qui met en valeur votre création.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-6 border-t border-[#D3D3D3]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || uploadingImages}
            className="min-w-[120px] border-2 border-[#D3D3D3] text-[#556B2F] hover:bg-gray-50 hover:border-gray-400 rounded-xl px-6 py-2.5"
          >
            Annuler
          </Button>
         
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting || uploadingImages}
              className="min-w-[140px] bg-gray-600 text-white hover:bg-gray-700 rounded-xl px-6 py-2.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                'Sauvegarder brouillon'
              )}
            </Button>
            
            <Button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting || uploadingImages || formData.images.length === 0}
              className="min-w-[160px] bg-[#6B8E23] text-white hover:bg-[#556B2F] hover:shadow-lg rounded-xl px-8 py-2.5 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Publication...
                </>
              ) : uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Téléchargement...
                </>
              ) : (
                'Publier l\'œuvre'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};