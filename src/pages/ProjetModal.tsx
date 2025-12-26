import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileImage, 
  FileVideo, 
  Check, 
  AlertCircle, 
  Loader2,
  Calendar,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';

interface ProjetFormData {
  titre: string;
  details: string;
  duree: string;
  categorie: string;
  status: 'active' | 'inactive';
}

interface ProjetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const categories = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Développement' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'video', label: 'Production Vidéo' },
  { value: 'photo', label: 'Photographie' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Autre' },
];

const ProjetModal: React.FC<ProjetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ProjetFormData>({
    titre: '',
    details: '',
    duree: '',
    categorie: '',
    status: 'active',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Couleurs personnalisées
  const colors = {
    logo: "#556B2F",
    primaryDark: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
  };

  // Nettoyer l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      titre: '',
      details: '',
      duree: '',
      categorie: '',
      status: 'active',
    });
    setMediaFile(null);
    setMediaType('image');
    setPreviewUrl(null);
    setError(null);
    setSuccess(false);
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
    // Vérifier la taille du fichier (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximale: 50MB');
      return;
    }

    // Vérifier le type de fichier
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG, GIF, MP4, MOV, AVI ou WEBM.');
      return;
    }

    // Déterminer le type de média
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');

    // Créer une prévisualisation
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setMediaFile(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!isAuthenticated || !user) {
      setError('Veuillez vous connecter pour créer un projet');
      return;
    }

    if (!formData.titre || !formData.details || !formData.duree) {
      setError('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Ajouter le fichier média
      if (mediaFile) {
        const fieldName = mediaType === 'video' ? 'video' : 'image';
        formDataToSend.append(fieldName, mediaFile);
      }

      // Envoyer la requête
      const response = await api.post('/projets', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(true);
        resetForm();
        
        // Fermer la modal après 2 secondes
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      console.error('Erreur création projet:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Erreur lors de la création du projet. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  const handleRemoveFile = () => {
    setMediaFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl transform rounded-lg shadow-xl transition-all"
          style={{ backgroundColor: colors.lightBg }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête */}
          <div 
            className="flex items-center justify-between rounded-t-lg px-6 py-4"
            style={{ backgroundColor: colors.logo, color: 'white' }}
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileImage size={24} />
              Ajouter un Nouveau Projet
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-white hover:bg-opacity-20 transition-colors active:scale-95"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Corps */}
          <div className="p-6">
            {success ? (
              <div className="text-center py-8">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: colors.primaryDark + '20' }}
                >
                  <Check size={32} style={{ color: colors.primaryDark }} />
                </div>
                <h4 className="text-xl font-semibold mb-2" style={{ color: colors.secondaryText }}>
                  Projet Créé avec Succès!
                </h4>
                <p className="text-gray-600">Votre projet a été enregistré et sera visible dans votre portfolio.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Message d'erreur */}
                {error && (
                  <div 
                    className="mb-6 p-4 rounded-lg border flex items-start gap-3"
                    style={{ 
                      backgroundColor: '#FEF2F2',
                      borderColor: '#FCA5A5',
                    }}
                  >
                    <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#DC2626' }}>Erreur</p>
                      <p className="text-sm" style={{ color: '#B91C1C' }}>{error}</p>
                    </div>
                  </div>
                )}

                {/* Titre */}
                <div className="mb-6">
                  <label htmlFor="titre" className="block mb-2 font-medium" style={{ color: colors.secondaryText }}>
                    Titre du Projet *
                  </label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border focus:outline-none transition-all"
                    style={{ 
                      borderColor: colors.separator,
                      backgroundColor: colors.lightBg,
                      boxShadow: '0 0 0 1px transparent'
                    }}
                    placeholder="Ex: Refonte de site web e-commerce"
                    required
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}`;
                      e.target.style.borderColor = colors.primaryDark;
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 0 0 1px transparent';
                      e.target.style.borderColor = colors.separator;
                    }}
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label htmlFor="details" className="block mb-2 font-medium" style={{ color: colors.secondaryText }}>
                    Description Détaillée *
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border focus:outline-none transition-all resize-none"
                    style={{ 
                      borderColor: colors.separator,
                      backgroundColor: colors.lightBg,
                      boxShadow: '0 0 0 1px transparent'
                    }}
                    placeholder="Décrivez votre projet, les objectifs, les technologies utilisées..."
                    required
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}`;
                      e.target.style.borderColor = colors.primaryDark;
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 0 0 1px transparent';
                      e.target.style.borderColor = colors.separator;
                    }}
                  />
                </div>

                {/* Fichier média */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium" style={{ color: colors.secondaryText }}>
                    Média (Image ou Vidéo)
                    <span className="text-gray-500 text-sm font-normal ml-1">- Optionnel</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                      dragActive ? 'border-opacity-100 bg-opacity-10' : 'border-opacity-30'
                    }`}
                    style={{ 
                      borderColor: colors.primaryDark,
                      backgroundColor: dragActive ? colors.primaryDark + '10' : 'transparent'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {previewUrl ? (
                      <div className="space-y-4">
                        <div className="relative">
                          {mediaType === 'image' ? (
                            <img
                              src={previewUrl}
                              alt="Prévisualisation"
                              className="max-h-48 mx-auto rounded-lg object-cover"
                            />
                          ) : (
                            <video
                              src={previewUrl}
                              className="max-h-48 mx-auto rounded-lg"
                              controls
                            />
                          )}
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg hover:shadow-xl active:scale-95 transition-all"
                            style={{ border: `1px solid ${colors.separator}` }}
                          >
                            <X size={16} style={{ color: colors.secondaryText }} />
                          </button>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          {mediaType === 'image' ? (
                            <FileImage size={16} style={{ color: colors.secondaryText }} />
                          ) : (
                            <FileVideo size={16} style={{ color: colors.secondaryText }} />
                          )}
                          <p className="text-sm truncate max-w-xs" style={{ color: colors.secondaryText }}>
                            {mediaFile?.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.primaryDark + '20' }}
                        >
                          <Upload size={24} style={{ color: colors.primaryDark }} />
                        </div>
                        <p className="mb-2 font-medium" style={{ color: colors.secondaryText }}>
                          Glissez-déposez un fichier ou cliquez pour sélectionner
                        </p>
                        <p className="text-sm opacity-70 flex items-center justify-center gap-1">
                          <AlertTriangle size={14} />
                          Formats acceptés: JPG, PNG, GIF, MP4, MOV (max 50MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Date de fin */}
                  <div>
                    <label htmlFor="duree" className="block mb-2 font-medium" style={{ color: colors.secondaryText }}>
                      Date de Fin *
                    </label>
                    <div className="relative">
                      <Calendar 
                        size={20} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: colors.secondaryText }}
                      />
                      <input
                        type="date"
                        id="duree"
                        name="duree"
                        value={formData.duree}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none transition-all"
                        style={{ 
                          borderColor: colors.separator,
                          backgroundColor: colors.lightBg,
                          boxShadow: '0 0 0 1px transparent'
                        }}
                        required
                        onFocus={(e) => {
                          e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}`;
                          e.target.style.borderColor = colors.primaryDark;
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '0 0 0 1px transparent';
                          e.target.style.borderColor = colors.separator;
                        }}
                      />
                    </div>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label htmlFor="categorie" className="block mb-2 font-medium" style={{ color: colors.secondaryText }}>
                      Catégorie
                      <span className="text-gray-500 text-sm font-normal ml-1">- Optionnel</span>
                    </label>
                    <div className="relative">
                      <Tag 
                        size={20} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: colors.secondaryText }}
                      />
                      <select
                        id="categorie"
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none transition-all appearance-none"
                        style={{ 
                          borderColor: colors.separator,
                          backgroundColor: colors.lightBg,
                          boxShadow: '0 0 0 1px transparent'
                        }}
                        onFocus={(e) => {
                          e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}`;
                          e.target.style.borderColor = colors.primaryDark;
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '0 0 0 1px transparent';
                          e.target.style.borderColor = colors.separator;
                        }}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Statut */}
                  <div>
                    <label htmlFor="status" className="block mb-2 font-medium" style={{ color: colors.secondaryText }}>
                      Statut
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border focus:outline-none transition-all appearance-none"
                      style={{ 
                        borderColor: colors.separator,
                        backgroundColor: colors.lightBg,
                        boxShadow: '0 0 0 1px transparent'
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}`;
                        e.target.style.borderColor = colors.primaryDark;
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '0 0 0 1px transparent';
                        e.target.style.borderColor = colors.separator;
                      }}
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t" 
                     style={{ borderColor: colors.separator }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg font-medium transition-all active:scale-95"
                    style={{ 
                      border: `1px solid ${colors.separator}`,
                      color: colors.secondaryText,
                    }}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 min-w-[140px]"
                    style={{ 
                      backgroundColor: isSubmitting ? colors.separator : colors.primaryDark,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        Créer le Projet
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetModal;