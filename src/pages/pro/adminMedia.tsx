// components/AdminMedia.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Headphones, 
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
  AlertCircle
} from "lucide-react";
import api from "../../lib/api";
import MediaUpload from "./MediaUpload";

// Types
interface Category {
  id: string;
  name: string;
  type?: string;
}

interface MediaBase {
  id: string;
  title: string;
  description?: string;
  category?: Category;
  isActive?: boolean;
  createdAt: string;
  thumbnailUrl?: string;
}

interface Podcast extends MediaBase {
  listens: number;
  audioUrl?: string;
}

interface Video extends MediaBase {
  views: number;
  videoUrl?: string;
}

interface Stats {
  totalPodcasts: number;
  totalVideos: number;
  totalViews: number;
  totalListens: number;
  totalCategories: number;
}

interface MediaResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: any;
}

type MediaType = 'podcasts' | 'videos';

// Service intégré directement dans le composant
class MediaServiceIntegrated {
  private static baseUrl = '/admin/media';

  // Statistiques
  static async getStats(): Promise<MediaResponse<Stats>> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return {
      success: true,
      data: response.data
    };
  }

  // Podcasts
  static async getPodcasts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<MediaResponse<Podcast[]>> {
    const response = await api.get(`${this.baseUrl}/podcasts`, { params });
    return response.data;
  }

  static async createPodcast(formData: FormData): Promise<MediaResponse<Podcast>> {
    const response = await api.post(`${this.baseUrl}/podcasts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async updatePodcast(id: string, data: Partial<Podcast>): Promise<MediaResponse<Podcast>> {
    const response = await api.put(`${this.baseUrl}/podcasts/${id}`, data);
    return response.data;
  }

  static async deletePodcast(id: string): Promise<MediaResponse<void>> {
    const response = await api.delete(`${this.baseUrl}/podcasts/${id}`);
    return response.data;
  }

  // Vidéos
  static async getVideos(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<MediaResponse<Video[]>> {
    const response = await api.get(`${this.baseUrl}/videos`, { params });
    return response.data;
  }

  static async createVideo(formData: FormData): Promise<MediaResponse<Video>> {
    const response = await api.post(`${this.baseUrl}/videos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async updateVideo(id: string, data: Partial<Video>): Promise<MediaResponse<Video>> {
    const response = await api.put(`${this.baseUrl}/videos/${id}`, data);
    return response.data;
  }

  static async deleteVideo(id: string): Promise<MediaResponse<void>> {
    const response = await api.delete(`${this.baseUrl}/videos/${id}`);
    return response.data;
  }

  // Catégories
  static async getCategories(): Promise<MediaResponse<Category[]>> {
    const response = await api.get(`${this.baseUrl}/categories`);
    return response.data;
  }
}

// Composant LoadingSpinner intégré
const LoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = "Chargement..." 
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  </div>
);

// Composant ErrorMessage intégré
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

// Composant principal AdminMedia
const AdminMedia: React.FC = () => {
  const navigate = useNavigate();
  
  // États
  const [activeTab, setActiveTab] = useState<MediaType>('podcasts');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<'podcast' | 'video'>('podcast');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPodcasts: 0,
    totalVideos: 0,
    totalViews: 0,
    totalListens: 0,
    totalCategories: 0
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Charger les données
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setError('');
      setLoading(true);
      
      const [podcastsResponse, videosResponse, categoriesResponse, statsResponse] = await Promise.all([
        MediaServiceIntegrated.getPodcasts({ limit: 100 }),
        MediaServiceIntegrated.getVideos({ limit: 100 }),
        MediaServiceIntegrated.getCategories(),
        MediaServiceIntegrated.getStats()
      ]);

      if (podcastsResponse.success) {
        setPodcasts(podcastsResponse.data || []);
      } else {
        throw new Error('Erreur lors du chargement des podcasts');
      }

      if (videosResponse.success) {
        setVideos(videosResponse.data || []);
      } else {
        throw new Error('Erreur lors du chargement des vidéos');
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

    } catch (err) {
      console.error('Erreur chargement médias:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des médias');
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

  // Gestion des uploads
  const handleUploadClick = (type: 'podcast' | 'video'): void => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newMedia: Podcast | Video): void => {
    if (uploadType === 'podcast') {
      setPodcasts(prev => [newMedia as Podcast, ...prev]);
    } else {
      setVideos(prev => [newMedia as Video, ...prev]);
    }
    setUploadModalOpen(false);
    refreshData(); // Rafraîchir les stats
  };

  // Gestion de la suppression
  const handleDeleteMedia = async (id: string, type: 'podcast' | 'video'): Promise<void> => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ce ${type === 'podcast' ? 'podcast' : 'vidéo'} ?`)) {
      return;
    }

    try {
      let response;
      if (type === 'podcast') {
        response = await MediaServiceIntegrated.deletePodcast(id);
      } else {
        response = await MediaServiceIntegrated.deleteVideo(id);
      }

      if (response.success) {
        if (type === 'podcast') {
          setPodcasts(prev => prev.filter(p => p.id !== id));
        } else {
          setVideos(prev => prev.filter(v => v.id !== id));
        }
        refreshData(); // Rafraîchir les stats
      } else {
        alert(response.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // Gestion de la visibilité
  const handleToggleVisibility = async (
    id: string, 
    type: 'podcast' | 'video', 
    currentStatus: boolean
  ): Promise<void> => {
    try {
      let response;
      if (type === 'podcast') {
        response = await MediaServiceIntegrated.updatePodcast(id, { isActive: !currentStatus });
      } else {
        response = await MediaServiceIntegrated.updateVideo(id, { isActive: !currentStatus });
      }

      if (response.success) {
        if (type === 'podcast') {
          setPodcasts(prev => prev.map(p => 
            p.id === id ? { ...p, isActive: !currentStatus } : p
          ));
        } else {
          setVideos(prev => prev.map(v => 
            v.id === id ? { ...v, isActive: !currentStatus } : v
          ));
        }
      } else {
        alert(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur mise à jour:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  // Gestion des erreurs d'image
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/48/48?text=${activeTab === 'podcasts' ? '🎧' : '🎬'}`;
  };

  // Filtrage des données
  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || podcast.category?.id === filterCategory)
  );

  const filteredVideos = videos.filter(video => 
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || video.category?.id === filterCategory)
  );

  const currentData = activeTab === 'podcasts' ? filteredPodcasts : filteredVideos;

  // Composants d'affichage
  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Podcasts</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPodcasts}</p>
          </div>
          <Headphones className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Vidéos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
          </div>
          <Video className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Écoutes Podcasts</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalListens}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Vues Vidéos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
          </div>
          <Users className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('podcasts')}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'podcasts'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Headphones className="w-4 h-4" />
              Podcasts ({podcasts.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="w-4 h-4" />
              Vidéos ({videos.length})
            </button>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button
              onClick={() => handleUploadClick(activeTab === 'podcasts' ? 'podcast' : 'video')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Ajouter {activeTab === 'podcasts' ? 'Podcast' : 'Vidéo'}
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Rechercher un ${activeTab === 'podcasts' ? 'podcast' : 'vidéo'}...`}
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
              {categories
                .filter(cat => !cat.type || cat.type === activeTab.slice(0, -1))
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMediaTable = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Média
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'podcasts' ? 'Écoutes' : 'Vues'}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Aucun {activeTab === 'podcasts' ? 'podcast' : 'vidéo'} trouvé
                  </p>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterCategory ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter votre premier média'}
                  </p>
                  <button
                    onClick={() => handleUploadClick(activeTab === 'podcasts' ? 'podcast' : 'video')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Ajouter le premier {activeTab === 'podcasts' ? 'podcast' : 'vidéo'}
                  </button>
                </td>
              </tr>
            ) : (
              currentData.map((media) => (
                <tr key={media.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={media.thumbnailUrl || `https://via.placeholder.com/48/48?text=${activeTab === 'podcasts' ? '🎧' : '🎬'}`}
                          alt={media.title}
                          className="h-12 w-12 object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {media.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {media.description || 'Aucune description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      media.category?.name === 'Danse' ? 'bg-purple-100 text-purple-800' :
                      media.category?.name === 'Yoga' ? 'bg-green-100 text-green-800' :
                      media.category?.name === 'Méditation' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {media.category?.name || 'Non catégorisé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {activeTab === 'podcasts' 
                      ? (media as Podcast).listens || 0 
                      : (media as Video).views || 0
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      media.isActive
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {media.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {media.createdAt ? new Date(media.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleToggleVisibility(
                          media.id, 
                          activeTab.slice(0, -1) as 'podcast' | 'video', 
                          media.isActive || false
                        )}
                        className={`p-2 rounded-lg transition-colors ${
                          media.isActive
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={media.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {media.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Éditer"
                        onClick={() => {
                          // À implémenter : ouverture modal d'édition
                          alert('Fonctionnalité d\'édition à implémenter');
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteMedia(
                          media.id, 
                          activeTab.slice(0, -1) as 'podcast' | 'video'
                        )}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Rendu principal
  if (loading && !refreshing) {
    return <LoadingSpinner message="Chargement des médias..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
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
                <h1 className="text-3xl font-bold text-slate-900">Administration Médias</h1>
                <p className="text-gray-600 mt-2">Gérez vos podcasts et vidéos</p>
              </div>
            </div>
          </div>

          {error && <ErrorMessage message={error} onRetry={fetchData} />}
          
          {renderStats()}
        </div>

        {renderControls()}
        {renderMediaTable()}

        {/* Modal d'upload */}
        {uploadModalOpen && (
          <MediaUpload
            type={uploadType}
            onUploadSuccess={handleUploadSuccess}
            onClose={() => setUploadModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMedia;