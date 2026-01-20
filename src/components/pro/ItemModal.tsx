import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Loader2 } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<Item, 'id'>) => Promise<void>; // Changé pour accepter une Promise
  initialData?: Item | null;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    location: '',
    images: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setIsLoading(true);
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        location: initialData.location,
        images: initialData.images,
      });
      setImagePreviews(initialData.images);
      setIsLoading(false);
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        location: '',
        images: [],
      });
      setImageFiles([]);
      setImagePreviews([]);
    }
    setError(null);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validation des champs obligatoires
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (formData.price < 0) {
        throw new Error('Le prix ne peut pas être négatif');
      }

      // Préparer toutes les images : existantes + nouvelles
      const allImages = [...formData.images]; // Images existantes (URLs)
      
      // Convertir les nouvelles images en base64
      if (imageFiles.length > 0) {
        setIsLoading(true); // Loading pour la conversion des images
        
        const newBase64Images = await Promise.all(
          imageFiles.map(file => {
            return new Promise<string>((resolve, reject) => {
              if (file.size > 10 * 1024 * 1024) { // 10MB limit
                reject(new Error(`L'image ${file.name} dépasse la taille limite de 10MB`));
              }
              
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.onerror = () => {
                reject(new Error(`Erreur lors de la lecture de l'image ${file.name}`));
              };
              reader.readAsDataURL(file);
            });
          })
        );
        
        // Ajouter les nouvelles images en base64
        allImages.push(...newBase64Images);
        setIsLoading(false);
      }
      
      // Soumettre avec toutes les images
      await onSubmit({
        ...formData,
        images: allImages,
      });
      
      // Fermer la modal après soumission réussie
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la soumission');
      setIsLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsLoading(true);
    
    try {
      const newFiles = Array.from(files);
      
      // Vérifier la taille des fichiers
      for (const file of newFiles) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`L'image ${file.name} dépasse la taille limite de 10MB`);
        }
      }
      
      setImageFiles(prev => [...prev, ...newFiles]);

      // Créer des prévisualisations
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (isLoading || isSubmitting) return;
    
    // Supprimer de la liste des fichiers
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);

    // Supprimer de la liste des prévisualisations
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Libérer l'URL de l'objet avant de la supprimer
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImagePreviews(newPreviews);
  };

  const handleRemoveExistingImage = (index: number) => {
    if (isLoading || isSubmitting) return;
    
    // Supprimer une image existante (URL)
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    
    // Mettre à jour les prévisualisations
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* En-tête avec état de chargement */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {isLoading && (
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#556B2F' }} />
              )}
              <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
                {initialData ? 'Modifier le parapente' : 'Ajouter un nouveau parapente'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isSubmitting || isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Overlay de chargement */}
          {(isLoading || isSubmitting) && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-4" style={{ 
                  borderTopColor: 'transparent',
                  borderRightColor: '#556B2F',
                  borderBottomColor: '#556B2F',
                  borderLeftColor: '#556B2F'
                }}></div>
                <p className="text-gray-600 font-medium">
                  {isLoading ? 'Traitement des images...' : 'Envoi en cours...'}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Champs du formulaire */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: isSubmitting || isLoading ? '#E5E7EB' : '#D3D3D3',
                  backgroundColor: isSubmitting || isLoading ? '#F9FAFB' : '#FFFFFF',
                  '--tw-ring-color': '#556B2F'
                } as React.CSSProperties}
                disabled={isSubmitting || isLoading}
                placeholder="Entrez le titre du parapente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: isSubmitting || isLoading ? '#E5E7EB' : '#D3D3D3',
                  backgroundColor: isSubmitting || isLoading ? '#F9FAFB' : '#FFFFFF',
                  '--tw-ring-color': '#556B2F'
                } as React.CSSProperties}
                disabled={isSubmitting || isLoading}
                placeholder="Décrivez le parapente en détail"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                  Prix (€) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors"
                  style={{ 
                    borderColor: isSubmitting || isLoading ? '#E5E7EB' : '#D3D3D3',
                    backgroundColor: isSubmitting || isLoading ? '#F9FAFB' : '#FFFFFF',
                    '--tw-ring-color': '#556B2F'
                  } as React.CSSProperties}
                  disabled={isSubmitting || isLoading}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                  Lieu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors"
                  style={{ 
                    borderColor: isSubmitting || isLoading ? '#E5E7EB' : '#D3D3D3',
                    backgroundColor: isSubmitting || isLoading ? '#F9FAFB' : '#FFFFFF',
                    '--tw-ring-color': '#556B2F'
                  } as React.CSSProperties}
                  disabled={isSubmitting || isLoading}
                  placeholder="Ex: Paris, France"
                />
              </div>
            </div>

            {/* Section Images */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Images
              </label>
              
              {/* Zone d'upload avec état de chargement */}
              <div className="mb-4 relative">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isSubmitting || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                       style={{ borderColor: '#D3D3D3' }}>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Loader2 className="w-8 h-8 mb-2 animate-spin" style={{ color: '#8B4513' }} />
                      <p className="text-sm" style={{ color: '#8B4513' }}>
                        Chargement des images...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2" style={{ color: '#8B4513' }} />
                      <p className="text-sm" style={{ color: '#8B4513' }}>
                        <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                      </p>
                      <p className="text-xs" style={{ color: '#8B4513' }}>
                        PNG, JPG, WEBP jusqu'à 10MB
                      </p>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting || isLoading}
                  />
                </label>
              </div>

              {/* Liste des images avec indicateur de chargement */}
              {imagePreviews.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium" style={{ color: '#8B4513' }}>
                      Images ({imagePreviews.length})
                    </p>
                    {isLoading && (
                      <div className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" style={{ color: '#556B2F' }} />
                        <span className="text-xs text-gray-500">Traitement...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => {
                      const isExistingImage = index < formData.images.length;
                      
                      return (
                        <div key={index} className="relative group">
                          {/* Overlay de chargement pour l'image */}
                          {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 rounded-lg flex items-center justify-center z-10">
                              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#556B2F' }} />
                            </div>
                          )}
                          
                          <img
                            src={preview}
                            alt={`Image ${index + 1}`}
                            className={`w-full h-24 object-cover rounded-lg ${isLoading ? 'opacity-50' : ''}`}
                          />
                          
                          {/* Bouton de suppression */}
                          {!isLoading && !isSubmitting && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => isExistingImage ? handleRemoveExistingImage(index) : handleRemoveImage(index - formData.images.length)}
                                className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          
                          {/* Badge pour les images existantes */}
                          {isExistingImage && (
                            <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                              Existante
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 pt-6 border-t" style={{ borderColor: '#D3D3D3' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border rounded-lg font-medium transition-colors"
                style={{ 
                  borderColor: isSubmitting || isLoading ? '#E5E7EB' : '#D3D3D3',
                  color: isSubmitting || isLoading ? '#9CA3AF' : '#8B4513',
                  backgroundColor: isSubmitting || isLoading ? '#F9FAFB' : 'transparent'
                }}
                disabled={isSubmitting || isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 min-w-[120px] transition-colors"
                style={{ 
                  backgroundColor: isSubmitting || isLoading ? '#9CA3AF' : '#556B2F',
                  '--tw-ring-color': '#6B8E23',
                  cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer'
                } as React.CSSProperties}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi...
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Traitement...
                  </>
                ) : initialData ? (
                  'Modifier'
                ) : (
                  'Ajouter'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;