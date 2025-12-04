// components/AdminMedia.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Search,
  BarChart3,
  Users,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  X,
  Play,
  Calendar,
  FileText,
  Headphones,
  Clock,
  Download,
  MoreVertical
} from "lucide-react";
import { MediaService } from "../../lib/api";
import MediaUpload from "./MediaUpload";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

// Types adaptés à votre structure de données
interface MediaBase {
  id: string;
  title: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  createdAt: string;
  thumbnailUrl?: string;
}

interface Video extends MediaBase {
  views: number;
  videoUrl?: string;
  duration?: string;
  fileSize?: number;
  mimeType?: string;
  storagePath?: string;
  isPremium?: boolean;
}

interface Stats {
  totalVideos: number;
  totalViews: number;
  totalCategories: number;
}

// Fonction utilitaire pour les placeholders d'image
const getPlaceholderImage = (text: string = '🎬') => {
  return `https://placehold.co/400x225/EFEFEF/AAAAAA?text=${encodeURIComponent(text)}`;
};

// Composant Modal de base
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Composant Modal de détails
const MediaDetailModal: React.FC<{
  media: Video | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ media, isOpen, onClose }) => {
  if (!media) return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return 'N/A';
    return duration;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails du podcast vidéo" size="lg">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="lg:w-1/3">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
              <img
                src={media.thumbnailUrl || getPlaceholderImage('🎬')}
                alt={media.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getPlaceholderImage('🎬');
                }}
              />
            </div>
          </div>

          {/* Détails */}
          <div className="lg:w-2/3 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{media.title}</h3>
              <p className="text-gray-600 mt-1">{media.description || 'Aucune description'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Catégorie</label>
                <p className="text-gray-900">{media.category || 'Non catégorisé'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Statut</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${media.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {media.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Vues</label>
                <p className="text-gray-900">
                  {media.views?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de création</label>
                <p className="text-gray-900">
                  {new Date(media.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Informations techniques */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Informations techniques</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Durée</label>
                  <p className="text-gray-900">{formatDuration(media.duration)}</p>
                </div>
                <div>
                  <label className="text-gray-500">Taille du fichier</label>
                  <p className="text-gray-900">
                    {formatFileSize(media.fileSize)}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500">Type MIME</label>
                  <p className="text-gray-900">{media.mimeType || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-500">Premium</label>
                  <p className="text-gray-900">
                    {media.isPremium ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <a
                href={media.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play size={16} />
                Regarder le podcast
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Composant Modal d'édition AMÉLIORÉ
const EditMediaModal: React.FC<{
  media: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
  categories: string[];
}> = ({ media, isOpen, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isActive: true,
    isPremium: false
  });
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string>('');

  // Reset les erreurs quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setSaveError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (media) {
      setFormData({
        title: media.title || '',
        description: media.description || '',
        category: media.category || '',
        isActive: media.isActive !== undefined ? media.isActive : true,
        isPremium: media.isPremium || false
      });
    }
  }, [media]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media) return;

    setLoading(true);
    setSaveError('');

    try {
      // Préparer les données exactement comme le backend les attend
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        isActive: formData.isActive.toString(), // Convertir boolean en string
        isPremium: formData.isPremium // Pour les vidéos seulement
      };

      console.log('📤 Données envoyées au backend:', updateData);

      await onSave(media.id, updateData);
      onClose();
    } catch (error: any) {
      console.error('❌ Erreur lors de la modification:', error);
      setSaveError(error.message || 'Une erreur est survenue lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le podcast vidéo" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Afficher l'erreur si elle existe */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800 text-sm">{saveError}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Podcast vidéo actif
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPremium"
              checked={formData.isPremium}
              onChange={(e) => handleChange('isPremium', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="isPremium" className="ml-2 text-sm text-gray-700">
              Contenu premium
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};


const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry
}) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
      <span className="text-red-800 font-medium">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Réessayer
        </button>
      )}
    </div>
  </div>
);

// Composant Dropdown pour les actions
const ActionDropdown: React.FC<{
  media: Video;
  onView: (media: Video) => void;
  onEdit: (media: Video) => void;
  onToggleVisibility: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}> = ({ media, onView, onEdit, onToggleVisibility, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => {
                onView(media);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={16} />
              Voir détails
            </button>

            <button
              onClick={() => {
                onEdit(media);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <Edit size={16} />
              Modifier
            </button>
            <button
              onClick={() => {
                onDelete(media.id);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Composant principal AdminMedia CORRIGÉ
const AdminMedia: React.FC = () => {
  const navigate = useNavigate();

  // États principaux
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalVideos: 0,
    totalViews: 0,
    totalCategories: 0
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // États pour les modals
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<Video | null>(null);

  // Fonction utilitaire pour extraire les données de la réponse API
  const extractData = (response: any) => {
    if (response.data && response.data.data) {
      return response.data.data;
    }
    if (response.data) {
      return response.data;
    }
    return response;
  };

  // Charger les données
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setError('');
      setLoading(true);

      const [videosResponse, categoriesResponse, statsResponse] = await Promise.all([
        MediaService.getVideos({ limit: 100 }),
        MediaService.getCategories(),
        MediaService.getStats()
      ]);

      // Traiter les données
      const videosData = extractData(videosResponse);
      const categoriesData = extractData(categoriesResponse);
      const statsData = extractData(statsResponse);

      setVideos(Array.isArray(videosData) ? videosData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      if (statsData && typeof statsData === 'object') {
        setStats({
          totalVideos: statsData.totalVideos || 0,
          totalViews: statsData.totalViews || 0,
          totalCategories: statsData.totalCategories || 0
        });
      }

    } catch (err: any) {
      console.error('Erreur chargement podcasts vidéo:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors du chargement des podcasts vidéo';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Rafraîchir les données
  const refreshData = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchData();
  }, [fetchData]);

  // Chargement initial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Gestion des modals
  const handleViewDetails = (media: Video) => {
    setSelectedMedia(media);
    setDetailModalOpen(true);
  };

  const handleEdit = (media: Video) => {
    setSelectedMedia(media);
    setEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setDetailModalOpen(false);
    setEditModalOpen(false);
    setSelectedMedia(null);
  };

  // Sauvegarder les modifications - FONCTION CORRIGÉE
  const handleSaveMedia = async (id: string, data: any) => {
    try {
      console.log('🔄 Début de la modification de la vidéo ID:', id);
      console.log('📦 Données reçues du formulaire:', data);

      // Utiliser la méthode avec retry pour plus de robustesse
      const updatedVideo = await MediaService.updateVideoWithRetry(id, data);

      console.log('✅ Modification réussie:', updatedVideo);

      // Mettre à jour l'état local avec les données retournées par le backend
      setVideos(prev => prev.map(v =>
        v.id === id ? { ...v, ...updatedVideo } : v
      ));

      console.log('✅ État local mis à jour');
      return updatedVideo;

    } catch (err: any) {
      console.error('❌ Erreur détaillée lors de la modification:');
      console.error('📋 Message:', err.message);
      console.error('🔧 Stack:', err.stack);

      if (err.response) {
        console.error('📊 Données de réponse erreur:', err.response.data);
        console.error('🔢 Status erreur:', err.response.status);
      }

      const errorMessage = err.message || 'Erreur lors de la modification';
      throw new Error(errorMessage);
    }
  };

  // Gestion des uploads
  const handleUploadClick = (): void => {
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newMedia: Video): void => {
    setVideos(prev => [newMedia, ...prev]);
    setUploadModalOpen(false);
    refreshData();
  };

  // Gestion de la suppression
  const handleDeleteMedia = async (id: string): Promise<void> => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce podcast vidéo ?')) {
      return;
    }

    try {
      const response = await MediaService.deleteVideo(id);
      const responseData = extractData(response);

      if (responseData.success) {
        setVideos(prev => prev.filter(v => v.id !== id));
        refreshData();
      } else {
        alert(responseData.message || 'Erreur lors de la suppression');
      }
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la suppression';
      alert(errorMessage);
    }
  };

  // Gestion de la visibilité
  const handleToggleVisibility = async (
    id: string,
    currentStatus: boolean
  ): Promise<void> => {
    try {
      const response = await MediaService.updateVideo(id, { isActive: !currentStatus });
      const responseData = extractData(response);

      if (responseData.success) {
        setVideos(prev => prev.map(v =>
          v.id === id ? { ...v, isActive: !currentStatus } : v
        ));
      } else {
        alert(responseData.message || 'Erreur lors de la mise à jour');
      }
    } catch (err: any) {
      console.error('Erreur mise à jour:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la mise à jour';
      alert(errorMessage);
    }
  };

  // Gestion des erreurs d'image
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = getPlaceholderImage('🎬');
  };

  // Filtrage des données
  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || video.category === filterCategory)
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Podcasts Vidéo</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
          </div>
          <Video className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Vues Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Catégories</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-md lg:text-2xl font-bold text-gray-900">Gestion des Podcasts Vidéo</h2>
              <p className="text-gray-600">Administrez votre bibliothèque de podcasts vidéo</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button
              onClick={handleUploadClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Ajouter un Podcast Vidéo
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un podcast vidéo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="sm:w-64">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMediaCards = () => (
    <div className=" rounded-2xl  ">
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <Video className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Aucun podcast vidéo trouvé
          </p>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter votre premier podcast vidéo'}
          </p>
          <button
            onClick={handleUploadClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter le premier podcast vidéo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((media) => (
            <div
              key={media.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image et overlay */}
              <div className="relative aspect-video overflow-hidden rounded-t-xl">
                <img
                  src={media.thumbnailUrl || getPlaceholderImage('🎬')}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${media.category === 'Danse' ? 'bg-purple-100 text-purple-800' :
                    media.category === 'Yoga' ? 'bg-green-100 text-green-800' :
                      media.category === 'Méditation' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {media.category || 'Non catégorisé'}
                  </span>
                  {media.isPremium && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Premium
                    </span>
                  )}
                </div>

                {/* Statut overlay */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${media.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {media.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {media.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {media.description || 'Aucune description'}
                </p>

                {/* Métriques */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Headphones size={14} />
                    <span>{media.views?.toLocaleString() || 0} vues</span>
                  </div>
                  {media.duration && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{media.duration}</span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>
                      {media.createdAt ? new Date(media.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(media)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Play size={14} />
                    Voir
                  </button>

                  <ActionDropdown
                    media={media}
                    onView={handleViewDetails}
                    onEdit={handleEdit}
                    onToggleVisibility={handleToggleVisibility}
                    onDelete={handleDeleteMedia}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rendu principal
  if (loading && !refreshing) {
    return <LoadingSpinner text="Chargement des podcasts vidéo" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg border border-slate-700 hover:border-slate-600 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="text-lg lg:text-3xl font-bold text-slate-900">Administration Podcasts Vidéo</h1>
                <p className="text-gray-600 mt-2">Gérez votre bibliothèque de podcasts vidéo</p>
              </div>
            </div>
          </div>

          {error && <ErrorMessage message={error} onRetry={fetchData} />}

          {renderStats()}
        </div>

        {renderControls()}
        {renderMediaCards()}

        {/* Modals */}
        <MediaDetailModal
          media={selectedMedia}
          isOpen={detailModalOpen}
          onClose={handleCloseModals}
        />

        <EditMediaModal
          media={selectedMedia}
          isOpen={editModalOpen}
          onClose={handleCloseModals}
          onSave={handleSaveMedia}
          categories={categories}
        />

        {/* Modal d'upload */}
        {uploadModalOpen && (
          <MediaUpload
            type="video"
            onUploadSuccess={handleUploadSuccess}
            onClose={() => setUploadModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMedia;