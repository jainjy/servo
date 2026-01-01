// ProductCreateModal.tsx - VERSION AVEC TYPES ET CATÉGORIES STRUCTURÉS

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
import { X, Upload, Loader2, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Types
interface ArtMetadata {
  creationDate?: string;
  dimensions?: string;
  materials?: string;
  [key: string]: string | undefined;
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
  userId: string;
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

// Catégories par type (métiers)
const METIERS_PAR_CATEGORIES = [
  // 1. PHOTOGRAPHIE
  { libelle: "Photographe portrait", categorie: "photographie" },
  { libelle: "Photographe paysage", categorie: "photographie" },
  { libelle: "Photographe événementiel", categorie: "photographie" },
  { libelle: "Photographe artistique", categorie: "photographie" },
  { libelle: "Photographe de mode", categorie: "photographie" },
  
  // 2. SCULPTURE
  { libelle: "Sculpteur sur bois", categorie: "sculpture" },
  { libelle: "Sculpteur sur pierre", categorie: "sculpture" },
  { libelle: "Sculpteur sur métal", categorie: "sculpture" },
  { libelle: "Sculpteur terre cuite", categorie: "sculpture" },
  { libelle: "Sculpteur contemporain", categorie: "sculpture" },
  
  // 3. PEINTURE
  { libelle: "Peintre à l'huile", categorie: "peinture" },
  { libelle: "Peintre aquarelle", categorie: "peinture" },
  { libelle: "Peintre acrylique", categorie: "peinture" },
  { libelle: "Peintre mural", categorie: "peinture" },
  { libelle: "Peintre abstrait", categorie: "peinture" },
  { libelle: "Peintre portraitiste", categorie: "peinture" },
  
  // 4. ARTISANAT
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
    userId
  });

  // Catégories filtrées selon le type sélectionné
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Initialize avec initialData
  useEffect(() => {
    if (initialData && open) {
      const newFormData = {
        ...formData,
        ...initialData,
        userId
      };
      
      setFormData(newFormData);
      
      // Si un type est fourni dans initialData, mettre à jour les catégories disponibles
      if (initialData.type) {
        setAvailableCategories(getCategoriesByType(initialData.type));
      }
    }
  }, [initialData, userId, open]);

  // Gestion des champs du formulaire
  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | string[] | ArtMetadata
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
  };

  // Gestion des métadonnées
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

      // ✅ CORRECT: Ne pas envoyer userId dans le body
      // Le serveur l'obtiendra du middleware authenticateToken via req.user.id
      const apiData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        price: formData.price,
        status: finalStatus,
        images: formData.images,
        dimensions: formData.dimensions
      };

      console.log('📤 Envoi création œuvre (sans userId):', apiData);

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
        description: result.message || 'Œuvre créée avec succès'
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
    setFormData({
      name: '',
      description: '',
      type: '',
      category: '',
      price: 0,
      status: 'published',
      images: [],
      dimensions: {},
      userId
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-[#D3D3D3] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#8B4513]">
            Ajouter une nouvelle œuvre
          </DialogTitle>
          <p className="text-sm text-[#6B8E23]">
            Complétez les informations de votre création artistique
          </p>
          <button
            onClick={() => { resetForm(); onOpenChange(false); }}
            aria-label="Fermer"
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Section 1: Informations principales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-1 bg-[#556B2F] rounded"></div>
              <h3 className="text-lg font-semibold text-[#8B4513]">Informations principales</h3>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-medium text-[#556B2F]">
                    Titre de l'œuvre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: 'Soleil couchant'"
                    className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]"
                  />
                </div>
               
                <div>
                  <Label htmlFor="description" className="font-medium text-[#556B2F]">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre œuvre, son inspiration, sa technique..."
                    rows={4}
                    className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]"
                  />
                </div>
              </div>
             
              {/* Colonne droite */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type" className="font-medium text-[#556B2F]">
                    Type d'œuvre <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="focus:bg-[#6B8E23]/10">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              type === 'photographie' ? 'bg-blue-500' :
                              type === 'sculpture' ? 'bg-amber-600' :
                              type === 'peinture' ? 'bg-red-500' :
                              'bg-green-600'
                            }`}></div>
                            <span className="text-[#556B2F]">{getTypeLabel(type)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
               
                <div>
                  <Label htmlFor="category" className="font-medium text-[#556B2F]">
                    Catégorie/Métier <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                    disabled={!formData.type}
                  >
                    <SelectTrigger className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]">
                      <SelectValue placeholder={
                        formData.type 
                          ? `Sélectionner une catégorie (${availableCategories.length} disponible${availableCategories.length > 1 ? 's' : ''})`
                          : "Veuillez d'abord sélectionner un type"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category} className="focus:bg-[#6B8E23]/10">
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
               
                <div>
                  <Label htmlFor="price" className="font-medium text-[#556B2F]">
                    Prix (€) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B8E23]">
                      €
                    </span>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="pl-8 border-[#D3D3D3] focus:border-[#6B8E23]"
                    />
                  </div>
                </div>
               
                <div>
                  <Label htmlFor="status" className="font-medium text-[#556B2F]">
                    Statut
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'published' | 'draft' | 'sold') =>
                      handleInputChange('status', value)
                    }
                  >
                    <SelectTrigger className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value} className="focus:bg-[#6B8E23]/10">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                            <span className="text-[#556B2F]">{status.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
           
            {/* Informations supplémentaires */}
            <div className="pt-4 border-t border-[#D3D3D3]">
              <h4 className="text-md font-semibold text-[#8B4513] mb-3">Informations supplémentaires</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="creationDate" className="font-medium text-[#556B2F]">
                    Date de création
                  </Label>
                  <Input
                    id="creationDate"
                    type="date"
                    value={formData.dimensions.creationDate || ''}
                    onChange={(e) => handleMetadataChange('creationDate', e.target.value)}
                    className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]"
                  />
                </div>
               
                <div>
                  <Label htmlFor="dimensions" className="font-medium text-[#556B2F]">
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions.dimensions || ''}
                    onChange={(e) => handleMetadataChange('dimensions', e.target.value)}
                    placeholder="Ex: 100x80 cm"
                    className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]"
                  />
                </div>
               
                <div>
                  <Label htmlFor="materials" className="font-medium text-[#556B2F]">
                    Matériaux et techniques
                  </Label>
                  <Input
                    id="materials"
                    value={formData.dimensions.materials || ''}
                    onChange={(e) => handleMetadataChange('materials', e.target.value)}
                    placeholder="Ex: Huile sur toile, cadre en bois"
                    className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23]"
                  />
                </div>
              </div>
            </div>
          </div>
         
          {/* Section 2: Images */}
          <div className="space-y-4 pt-4 border-t border-[#D3D3D3]">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-1 bg-[#6B8E23] rounded"></div>
              <h3 className="text-lg font-semibold text-[#8B4513]">
                Galerie d'images <span className="text-red-500">*</span>
              </h3>
            </div>
           
            <div className="space-y-4">
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
                  className={`block border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isSubmitting || uploadingImages
                      ? 'border-[#D3D3D3] bg-gray-50 cursor-not-allowed'
                      : 'border-[#6B8E23] border-opacity-50 bg-[#6B8E23]/5 hover:border-[#556B2F] hover:bg-[#6B8E23]/10'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isSubmitting || uploadingImages ? 'bg-gray-100' : 'bg-[#6B8E23]/10'
                    }`}>
                      <Upload className={`h-6 w-6 ${
                        isSubmitting || uploadingImages ? 'text-gray-400' : 'text-[#6B8E23]'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-[#556B2F]">Ajouter des photos</p>
                      <p className="text-sm text-[#6B8E23] mt-1">
                        Glissez-déposez vos images ou cliquez pour sélectionner
                      </p>
                    </div>
                    <p className="text-xs text-[#6B8E23]/70">
                      Formats supportés: JPG, PNG, WEBP • Max 10MB par image
                    </p>
                  </div>
                </label>
              </div>
             
              {/* Prévisualisation des images */}
              {imageFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-[#556B2F]">
                      {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} sélectionnée{imageFiles.length > 1 ? 's' : ''}
                    </p>
                    <Badge variant="outline" className="font-medium border-[#6B8E23] text-[#6B8E23]">
                      {imageFiles.filter(img => img.uploadProgress === 100).length}/{imageFiles.length} uploadée{imageFiles.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                 
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imageFiles.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border border-[#D3D3D3] bg-gray-50">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                         
                          {image.uploadProgress > 0 && image.uploadProgress < 100 && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                              <Loader2 className="h-6 w-6 animate-spin text-white mb-2" />
                              <Progress
                                value={image.uploadProgress}
                                className="w-3/4 h-1.5 bg-gray-300"
                              />
                              <p className="text-xs text-white mt-2 font-medium">
                                {image.uploadProgress}%
                              </p>
                            </div>
                          )}
                         
                          {image.error && (
                            <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center rounded-lg">
                              <p className="text-xs text-white text-center px-2">
                                {image.error}
                              </p>
                            </div>
                          )}
                        </div>
                       
                        {/* Bouton de suppression */}
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          onClick={() => removeImage(index)}
                          disabled={isSubmitting || uploadingImages}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                       
                        {/* Badge image principale */}
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2">
                            <Badge className="text-xs bg-[#6B8E23] text-white border-0">
                              Principale
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                 
                  {/* Note */}
                  <p className="text-xs text-[#6B8E23]/70 mt-2">
                    {uploadingImages
                      ? "Veuillez attendre la fin du téléchargement des images avant de publier."
                      : "La première image sera utilisée comme photo principale de l'œuvre."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-4 border-t border-[#D3D3D3]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || uploadingImages}
            className="min-w-[100px] border-[#D3D3D3] text-[#556B2F] hover:bg-[#6B8E23]/10"
          >
            Annuler
          </Button>
         
          <Button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting || uploadingImages || formData.images.length === 0}
            className="min-w-[160px] bg-[#6B8E23] text-white hover:bg-[#556B2F]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Publication...
              </>
            ) : uploadingImages ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Upload en cours...
              </>
            ) : (
              'Publier l\'œuvre'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};