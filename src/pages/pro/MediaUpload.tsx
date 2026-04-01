// components/MediaUpload.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileAudio, FileVideo, Image } from 'lucide-react';
import api from '../../lib/api';

// Définition du thème
const theme = {
  logo: "#556B2F",           // logo / accent - Olive green
  primaryDark: "#6B8E23",    // Sruvol / fonds légers - Yellow-green
  lightBg: "#FFFFFF",        // fond de page / bloc texte - White
  separator: "#D3D3D3",     // séparateurs / bordures, UI - Light gray
  secondaryText: "#8B4513",  // touche premium / titres secondaires - Saddle brown
};

interface MediaUploadProps {
  type: 'podcast' | 'video';
  onUploadSuccess: (media: any) => void;
  onClose: () => void;
  existingCategories?: string[]; // Maintenant un tableau de strings
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  type,
  onUploadSuccess,
  onClose,
  existingCategories = []
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isActive: 'true',
    // Ajout du champ videoUrl pour les vidéos
    videoUrl: ''
  });

  const [files, setFiles] = useState<{
    media?: File;      // Pour les podcasts uniquement (fichier audio)
    thumbnail?: File;
  }>({});

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Charger les catégories existantes
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/admin/media/categories');
        if (response.data.success) {
          setAvailableCategories(response.data.data || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // Utiliser les catégories fournies en prop
        setAvailableCategories(existingCategories);
      }
    };

    loadCategories();
  }, [existingCategories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'media' | 'thumbnail'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation de la taille du fichier
      const maxSize = fileType === 'media'
        ? (type === 'podcast' ? 100 * 1024 * 1024 : 500 * 1024 * 1024)
        : 10 * 1024 * 1024;

      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        setError(`Le fichier est trop volumineux. Taille maximum: ${maxSizeMB}MB`);
        return;
      }

      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
      setError('');
    }
  };

  const removeFile = (fileType: 'media' | 'thumbnail') => {
    setFiles(prev => ({
      ...prev,
      [fileType]: undefined
    }));

    if (fileType === 'media' && mediaInputRef.current) {
      mediaInputRef.current.value = '';
    }
    if (fileType === 'thumbnail' && thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return;
    }

    // Validation spécifique selon le type
    if (type === 'podcast' && !files.media) {
      setError('Le fichier audio est requis');
      return;
    }

    if (type === 'video' && !formData.videoUrl.trim()) {
      setError('L\'URL de la vidéo est requise');
      return;
    }

    // Validation basique de l'URL pour les vidéos
    if (type === 'video' && formData.videoUrl.trim()) {
      try {
        new URL(formData.videoUrl);
      } catch {
        setError('Veuillez entrer une URL valide');
        return;
      }
    }

    try {
      setUploading(true);
      setError('');
      setProgress(0);

      // Pour les podcasts, on garde FormData avec les fichiers
      if (type === 'podcast') {
        const uploadFormData = new FormData();

        // Ajouter les données du formulaire
        uploadFormData.append('title', formData.title);
        uploadFormData.append('description', formData.description);
        uploadFormData.append('isActive', formData.isActive);

        if (formData.category && formData.category.trim() !== '') {
          uploadFormData.append('category', formData.category.trim());
        }

        // Ajouter les fichiers
        uploadFormData.append('audio', files.media!);

        if (files.thumbnail) {
          uploadFormData.append('thumbnail', files.thumbnail);
        }

        const response = await api.post('/admin/media/podcasts', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
          timeout: 300000,
        });

        if (response.data.success) {
          onUploadSuccess(response.data.data);
        } else {
          throw new Error(response.data.message || 'Erreur lors de l\'upload');
        }
      }
      // Pour les vidéos, on envoie simplement les données JSON avec l'URL
      else {
        // Pour les vidéos, on utilise FormData pour pouvoir envoyer l'image
        const uploadFormData = new FormData();

        // Ajouter les données du formulaire
        uploadFormData.append('title', formData.title);
        uploadFormData.append('description', formData.description);
        uploadFormData.append('category', formData.category || '');
        uploadFormData.append('isActive', formData.isActive);
        uploadFormData.append('videoUrl', formData.videoUrl);

        // Ajouter la thumbnail si elle existe
        if (files.thumbnail) {
          uploadFormData.append('thumbnail', files.thumbnail);
        }

        console.log('📤 Envoi des données vidéo avec thumbnail:', {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          isActive: formData.isActive,
          videoUrl: formData.videoUrl,
          hasThumbnail: !!files.thumbnail
        });

        const response = await api.post('/admin/media/videos', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important pour l'upload de fichier
          }
        });

        if (response.data.success) {
          onUploadSuccess(response.data.data);
        } else {
          throw new Error(response.data.message || 'Erreur lors de la création');
        }
      }
    } catch (err: any) {
      console.error('❌ Erreur détaillée:', err);

      let errorMessage = 'Erreur lors de l\'opération';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const getFileAccept = () => {
    if (type === 'podcast') {
      return 'audio/*,.mp3,.wav,.ogg,.aac,.m4a';
    }
    return ''; // Pour les vidéos, on n'utilise plus de fichier
  };

  const getFileSizeLimit = () => {
    return type === 'podcast' ? '100MB' : ''; // Plus de limite pour les vidéos
  };

  const getSupportedFormats = () => {
    return type === 'podcast'
      ? 'MP3, WAV, OGG, AAC, M4A'
      : 'YouTube, Vimeo, Dailymotion, etc.'; // Message pour les vidéos
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.lightBg }}>
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.separator }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.logo }}>
              Ajouter un {type === 'podcast' ? 'Podcast' : 'Vidéo'}
            </h2>
            <p className="mt-1" style={{ color: theme.secondaryText }}>
              {type === 'podcast'
                ? 'Téléchargez votre podcast et remplissez les informations'
                : 'Ajoutez l\'URL de votre vidéo et remplissez les informations'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={uploading}
            style={{ color: theme.secondaryText }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="border rounded-lg p-4" style={{
              backgroundColor: `${theme.separator}20`,
              borderColor: theme.separator
            }}>
              <p className="text-sm font-medium" style={{ color: theme.secondaryText }}>{error}</p>
            </div>
          )}

          {/* SECTION SPÉCIFIQUE AU TYPE */}
          {type === 'podcast' ? (
            /* Section Podcast - Upload de fichier audio */
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: theme.secondaryText }}>
                Fichier Audio *
              </label>
              <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors"
                style={{
                  borderColor: theme.separator,
                  backgroundColor: `${theme.separator}10`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.separator;
                }}
              >
                {files.media ? (
                  <div className="flex items-center justify-between rounded-lg p-4" style={{ backgroundColor: `${theme.separator}20` }}>
                    <div className="flex items-center space-x-3">
                      <FileAudio className="h-8 w-8" style={{ color: theme.primaryDark }} />
                      <div className="text-left">
                        <p className="font-medium" style={{ color: theme.logo }}>{files.media.name}</p>
                        <p className="text-sm" style={{ color: theme.secondaryText }}>
                          {(files.media.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('media')}
                      className="p-1"
                      disabled={uploading}
                      style={{ color: '#DC2626' }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      ref={mediaInputRef}
                      type="file"
                      accept={getFileAccept()}
                      onChange={(e) => handleFileChange(e, 'media')}
                      className="hidden"
                      disabled={uploading}
                    />
                    <button
                      type="button"
                      onClick={() => mediaInputRef.current?.click()}
                      className="flex flex-col items-center space-y-3 w-full"
                      disabled={uploading}
                    >
                      <FileAudio className="h-12 w-12" style={{ color: theme.primaryDark }} />
                      <div>
                        <p className="text-lg font-medium" style={{ color: theme.logo }}>
                          Cliquez pour sélectionner un fichier
                        </p>
                        <p className="text-sm mt-1" style={{ color: theme.secondaryText }}>
                          {getSupportedFormats()} • Max {getFileSizeLimit()}
                        </p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Section Vidéo - Input URL */
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium mb-3" style={{ color: theme.secondaryText }}>
                URL de la vidéo *
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all duration-200"
                  style={{
                    borderColor: theme.separator,
                    backgroundColor: theme.lightBg,
                    color: theme.logo
                  }}
                  placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                  disabled={uploading}
                  required
                />
                <p className="text-sm" style={{ color: theme.secondaryText }}>
                  {getSupportedFormats()}
                </p>
                <p className="text-xs" style={{ color: theme.secondaryText }}>
                  💡 Collez l'URL complète de votre vidéo (YouTube, Vimeo, Dailymotion, etc.)
                </p>
              </div>
            </div>
          )}

          {/* Miniature - Commun aux deux types */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: theme.secondaryText }}>
              Image de couverture
            </label>
            <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors"
              style={{
                borderColor: theme.separator,
                backgroundColor: `${theme.separator}10`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primaryDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.separator;
              }}
            >
              {files.thumbnail ? (
                <div className="flex items-center justify-between rounded-lg p-4" style={{ backgroundColor: `${theme.separator}20` }}>
                  <div className="flex items-center space-x-3">
                    <Image className="h-8 w-8" style={{ color: theme.primaryDark }} />
                    <div className="text-left">
                      <p className="font-medium" style={{ color: theme.logo }}>{files.thumbnail.name}</p>
                      <p className="text-sm" style={{ color: theme.secondaryText }}>
                        {(files.thumbnail.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('thumbnail')}
                    className="p-1"
                    disabled={uploading}
                    style={{ color: '#DC2626' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                    className="hidden"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="flex flex-col items-center space-y-3 w-full"
                    disabled={uploading}
                  >
                    <Image className="h-12 w-12" style={{ color: theme.primaryDark }} />
                    <div>
                      <p className="text-lg font-medium" style={{ color: theme.logo }}>
                        Ajouter une image de couverture
                      </p>
                      <p className="text-sm mt-1" style={{ color: theme.secondaryText }}>
                        JPEG, PNG, WebP, GIF • Max 10MB
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Informations du média */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
                Titre *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all duration-200"
                style={{
                  borderColor: theme.separator,
                  backgroundColor: theme.lightBg,
                  color: theme.logo
                }}
                placeholder={`Titre du ${type === 'podcast' ? 'podcast' : 'vidéo'}`}
                disabled={uploading}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all duration-200"
                style={{
                  borderColor: theme.separator,
                  backgroundColor: theme.lightBg,
                  color: theme.logo
                }}
                placeholder={`Description du ${type === 'podcast' ? 'podcast' : 'vidéo'}...`}
                disabled={uploading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all duration-200"
                  style={{
                    borderColor: theme.separator,
                    backgroundColor: theme.lightBg,
                    color: theme.logo
                  }}
                  disabled={uploading}
                >
                  <option value="">Sélectionnez une catégorie...</option>
                  <option value="immobiliers">Immobiliers</option>
                  <option value="services">Services</option>
                  <option value="partenaires">Partenaires</option>
                </select>
              </div>

              <div>
                <label htmlFor="isActive" className="block text-sm font-medium mb-2" style={{ color: theme.secondaryText }}>
                  Statut
                </label>
                <select
                  id="isActive"
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all duration-200"
                  style={{
                    borderColor: theme.separator,
                    backgroundColor: theme.lightBg,
                    color: theme.logo
                  }}
                  disabled={uploading}
                >
                  <option value="true" style={{ color: theme.logo }}>Actif</option>
                  <option value="false" style={{ color: theme.logo }}>Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Barre de progression - Uniquement pour les podcasts */}
          {uploading && type === 'podcast' && (
            <div className="rounded-xl p-4" style={{ backgroundColor: `${theme.separator}20` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: theme.logo }}>Upload en cours...</span>
                <span className="text-sm" style={{ color: theme.secondaryText }}>{progress}%</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: `${theme.separator}40` }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: theme.primaryDark
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Loading pour les vidéos */}
          {uploading && type === 'video' && (
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: `${theme.separator}20` }}>
              <p className="text-sm" style={{ color: theme.secondaryText }}>Création en cours...</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t" style={{ borderColor: theme.separator }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-xl transition-colors font-medium"
              style={{
                borderColor: theme.separator,
                color: theme.secondaryText,
                backgroundColor: 'transparent'
              }}
              disabled={uploading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.title.trim() ||
                (type === 'podcast' ? !files.media : !formData.videoUrl.trim())}
              className="px-6 py-3 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                backgroundColor: uploading ? `${theme.primaryDark}80` : theme.primaryDark
              }}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {type === 'podcast' ? `Upload... (${progress}%)` : 'Création...'}
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Publier le {type === 'podcast' ? 'podcast' : 'vidéo'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaUpload;