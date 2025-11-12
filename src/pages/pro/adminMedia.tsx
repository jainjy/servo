import React, { useState, useEffect } from "react";
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
  ArrowLeft
} from "lucide-react";
import MediaService from "../../services/mediaService";
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
  imageUrl?: string;
  thumbnailUrl?: string;
}

interface Podcast extends MediaBase {
  listens?: number;
  audioUrl?: string;
}

interface Video extends MediaBase {
  views?: number;
  videoUrl?: string;
}

interface Stats {
  totalPodcasts: number;
  totalVideos: number;
  totalViews: number;
  totalListens: number;
}

interface MediaUploadProps {
  type: string;
  onUploadSuccess: (newMedia: any) => void;
  onClose: () => void;
  categories?: Category[]; // Ajout de la prop categories
}

const AdminMedia: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'podcasts' | 'videos'>('podcasts');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<'podcast' | 'video'>('podcast');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPodcasts: 0,
    totalVideos: 0,
    totalViews: 0,
    totalListens: 0
  });

  // Charger les données
  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  // Mettre à jour les stats quand les données changent
  useEffect(() => {
    fetchStats();
  }, [podcasts, videos]);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [podcastsResponse, videosResponse] = await Promise.all([
        MediaService.getPodcasts({ limit: 100 }),
        MediaService.getVideos({ limit: 100 })
      ]);

      if (podcastsResponse.success) {
        setPodcasts(podcastsResponse.data || []);
      } else {
        console.error('Erreur podcasts:', podcastsResponse.error);
        setPodcasts([]);
      }

      if (videosResponse.success) {
        setVideos(videosResponse.data || []);
      } else {
        console.error('Erreur vidéos:', videosResponse.error);
        setVideos([]);
      }
    } catch (error) {
      console.error('Erreur chargement médias:', error);
      setPodcasts([]);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await MediaService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        console.error('Erreur catégories:', response.error);
        setCategories([]);
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setCategories([]);
    }
  };

  const fetchStats = (): void => {
    try {
      setStats({
        totalPodcasts: podcasts.length,
        totalVideos: videos.length,
        totalViews: videos.reduce((sum: number, video: Video) => sum + (video.views || 0), 0),
        totalListens: podcasts.reduce((sum: number, podcast: Podcast) => sum + (podcast.listens || 0), 0)
      });
    } catch (error) {
      console.error('Erreur calcul stats:', error);
    }
  };

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
  };

  const handleDeleteMedia = async (id: string, type: 'podcast' | 'video'): Promise<void> => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ce ${type === 'podcast' ? 'podcast' : 'vidéo'} ?`)) {
      return;
    }

    try {
      let response;
      if (type === 'podcast') {
        response = await MediaService.deletePodcast(id);
      } else {
        response = await MediaService.deleteVideo(id);
      }

      if (response.success) {
        if (type === 'podcast') {
          setPodcasts(prev => prev.filter(p => p.id !== id));
        } else {
          setVideos(prev => prev.filter(v => v.id !== id));
        }
      } else {
        alert(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleVisibility = async (id: string, type: 'podcast' | 'video', currentStatus: boolean): Promise<void> => {
    try {
      let response;
      if (type === 'podcast') {
        response = await MediaService.updatePodcast(id, { isActive: !currentStatus });
      } else {
        response = await MediaService.updateVideo(id, { isActive: !currentStatus });
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
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/48/48?text=${activeTab === 'podcasts' ? '🎧' : '🎬'}`;
  };

  // Filtrer les données
  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || podcast.category?.name === filterCategory)
  );

  const filteredVideos = videos.filter(video => 
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || video.category?.name === filterCategory)
  );

  const currentData = activeTab === 'podcasts' ? filteredPodcasts : filteredVideos;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Chargement des médias...</span>
        </div>
      </div>
    );
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

          {/* Statistiques */}
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
        </div>

        {/* Contrôles */}
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
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des médias */}
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
                              src={media.imageUrl || media.thumbnailUrl || '/api/placeholder/48/48'}
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
                          media.isActive !== false
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {media.isActive !== false ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {media.createdAt ? new Date(media.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleToggleVisibility(media.id, activeTab.slice(0, -1) as 'podcast' | 'video', media.isActive !== false)}
                            className={`p-2 rounded-lg transition-colors ${
                              media.isActive !== false
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={media.isActive !== false ? 'Désactiver' : 'Activer'}
                          >
                            {media.isActive !== false ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Éditer"
                            onClick={() => {
                              alert('Fonctionnalité d\'édition à implémenter');
                            }}
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteMedia(media.id, activeTab.slice(0, -1) as 'podcast' | 'video')}
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
      </div>

      {/* Modal d'upload */}
      {uploadModalOpen && (
        <MediaUpload
          type={uploadType}
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setUploadModalOpen(false)}
          categories={categories.filter(cat => !cat.type || cat.type === uploadType)}
        />
      )}
    </div>
  );
};

export default AdminMedia;