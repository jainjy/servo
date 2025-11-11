import React, { useState, useEffect } from "react";
import { Upload, Video, Headphones, X, Loader } from "lucide-react";
import MediaService from "../../services/mediaService";

const MediaUpload = ({ type, onUploadSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    categoryId: ''
  });
  const [files, setFiles] = useState({
    media: null,
    thumbnail: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await MediaService.getCategories(type === 'podcast' ? 'podcast' : 'video');
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        setError('Erreur lors du chargement des catégories');
      }
    };
    loadCategories();
  }, [type]);

  // 🔥 CORRECTION: Fonction pour récupérer le token
  const getAuthToken = () => {
    // Méthode 1: Token depuis auth-token (votre cas)
    let token = localStorage.getItem('auth-token');
    console.log('🔐 Token from auth-token:', token);

    // Méthode 2: Depuis les données utilisateur
    if (!token) {
      const userData = localStorage.getItem('user-data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.id) {
            token = `real-jwt-token-${user.id}`;
            console.log('🔐 Token from user-data:', token);
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }

    // Méthode 3: Vérifier d'autres clés possibles
    if (!token) {
      const possibleKeys = ['token', 'jwtToken', 'accessToken', 'userToken'];
      for (const key of possibleKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          token = value;
          console.log(`🔐 Token from ${key}:`, token);
          break;
        }
      }
    }

    if (!token) {
      console.log('❌ No token found in localStorage');
      console.log('📋 Available keys:', Object.keys(localStorage));
    }

    return token;
  };

  const handleFileChange = (fileType, event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 🔥 CORRECTION: Utiliser la nouvelle fonction pour récupérer le token
    const token = getAuthToken();

    if (!token) {
      setError('Vous devez être connecté pour uploader un fichier. Veuillez vous reconnecter.');
      setLoading(false);
      return;
    }

    console.log('🎯 Final token being sent:', token);

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.duration.trim() || !formData.categoryId) {
      setError('Tous les champs obligatoires doivent être remplis');
      setLoading(false);
      return;
    }

    if (!files.media) {
      setError(`Veuillez sélectionner un fichier ${type === 'podcast' ? 'audio' : 'vidéo'}`);
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();
      
      // Données du formulaire
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('duration', formData.duration);
      uploadData.append('categoryId', formData.categoryId);

      // Fichiers
      uploadData.append(type === 'podcast' ? 'audio' : 'video', files.media);
      if (files.thumbnail) {
        uploadData.append('thumbnail', files.thumbnail);
      }

      let response;
      if (type === 'podcast') {
        response = await MediaService.uploadPodcast(uploadData, token);
      } else {
        response = await MediaService.uploadVideo(uploadData, token);
      }

      console.log('📦 Upload response:', response);

      if (response.success) {
        onUploadSuccess(response.data);
      } else {
        setError(response.message || `Erreur lors de l'upload du ${type}`);
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Uploader un {type === 'podcast' ? 'Podcast' : 'Vidéo'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Titre du ${type === 'podcast' ? 'podcast' : 'vidéo'}`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Description du ${type === 'podcast' ? 'podcast' : 'vidéo'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (mm:ss) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="28:15"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fichier Média */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier {type === 'podcast' ? 'Audio' : 'Vidéo'} *
              </label>
              {files.media ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-green-800">{files.media.name}</p>
                      <p className="text-sm text-green-600">
                        {(files.media.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('media')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    required
                    accept={type === 'podcast' ? 'audio/*' : 'video/*'}
                    onChange={(e) => handleFileChange('media', e)}
                    className="hidden"
                    id="media-file"
                  />
                  <label htmlFor="media-file" className="cursor-pointer block">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <span className="block text-sm font-medium text-gray-900 mb-1">
                      Cliquer pour sélectionner un fichier
                    </span>
                    <span className="block text-sm text-gray-500">
                      {type === 'podcast' ? 'MP3, WAV, M4A (max. 500MB)' : 'MP4, MOV, WebM (max. 500MB)'}
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de couverture (optionnel)
              </label>
              {files.thumbnail ? (
                <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-blue-800">{files.thumbnail.name}</p>
                      <p className="text-sm text-blue-600">
                        {(files.thumbnail.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('thumbnail')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('thumbnail', e)}
                    className="hidden"
                    id="thumbnail-file"
                  />
                  <label htmlFor="thumbnail-file" className="cursor-pointer block">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <span className="block text-sm text-gray-900 mb-1">
                      Image de couverture
                    </span>
                    <span className="block text-xs text-gray-500">
                      JPEG, PNG, WebP (optionnel)
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    Uploader {type === 'podcast' ? 'le podcast' : 'la vidéo'}
                    {type === 'podcast' ? <Headphones size={20} /> : <Video size={20} />}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;