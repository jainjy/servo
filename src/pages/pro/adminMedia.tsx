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
  Play, 
  Pause,
  Upload,
  Filter,
  Search,
  BarChart3,
  Users
} from "lucide-react";
import MediaService from "../../services/MediaService";
import MediaUpload from "./MediaUpload";

const AdminMedia = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('podcasts');
  const [podcasts, setPodcasts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState('podcast');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalPodcasts: 0,
    totalVideos: 0,
    totalViews: 0,
    totalListens: 0
  });

  // Charger les données
  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [podcastsResponse, videosResponse] = await Promise.all([
        MediaService.getPodcasts({ limit: 100 }),
        MediaService.getVideos({ limit: 100 })
      ]);

      if (podcastsResponse.success) {
        setPodcasts(podcastsResponse.data);
      }

      if (videosResponse.success) {
        setVideos(videosResponse.data);
      }
    } catch (error) {
      console.error('Erreur chargement médias:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await MediaService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Simuler des statistiques (à adapter avec vos vraies données)
      setStats({
        totalPodcasts: podcasts.length,
        totalVideos: videos.length,
        totalViews: videos.reduce((sum, video) => sum + (video.views || 0), 0),
        totalListens: podcasts.reduce((sum, podcast) => sum + (podcast.listens || 0), 0)
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleUploadClick = (type) => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newMedia) => {
    if (uploadType === 'podcast') {
      setPodcasts(prev => [newMedia, ...prev]);
    } else {
      setVideos(prev => [newMedia, ...prev]);
    }
    setUploadModalOpen(false);
    fetchStats(); // Mettre à jour les stats
  };

  const handleDeleteMedia = async (id, type) => {
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
        fetchStats(); // Mettre à jour les stats
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleVisibility = async (id, type, currentStatus) => {
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
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  // Filtrer les données
  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || podcast.category?.name === filterCategory)
  );

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || video.category?.name === filterCategory)
  );

  const currentData = activeTab === 'podcasts' ? filteredPodcasts : filteredVideos;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administration Médias</h1>
              <p className="text-gray-600 mt-2">Gérez vos podcasts et vidéos</p>
            </div>
            <button
              onClick={() => navigate("/bien-etre")}
              className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
            >
              Retour à l'accueil
            </button>
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
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'podcasts'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Headphones className="w-4 h-4 inline mr-2" />
                  Podcasts ({podcasts.length})
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'videos'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Video className="w-4 h-4 inline mr-2" />
                  Vidéos ({videos.length})
                </button>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleUploadClick(activeTab === 'podcasts' ? 'podcast' : 'video')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="sm:w-64">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Toutes les catégories</option>
                  {categories
                    .filter(cat => cat.type === activeTab.slice(0, -1)) // "podcasts" -> "podcast"
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
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p>Aucun {activeTab === 'podcasts' ? 'podcast' : 'vidéo'} trouvé</p>
                    </td>
                  </tr>
                ) : (
                  currentData.map((media) => (
                    <tr key={media.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={media.imageUrl || media.thumbnailUrl}
                              alt={media.title}
                              className="h-12 w-12 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {media.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {media.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          media.category?.name === 'Danse' ? 'bg-purple-100 text-purple-800' :
                          media.category?.name === 'Yoga' ? 'bg-green-100 text-green-800' :
                          media.category?.name === 'Méditation' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {media.category?.name || 'Non catégorisé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activeTab === 'podcasts' ? media.listens || 0 : media.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          media.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {media.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(media.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleToggleVisibility(media.id, activeTab.slice(0, -1), media.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              media.isActive 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={media.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {media.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Éditer"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteMedia(media.id, activeTab.slice(0, -1))}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
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
        />
      )}
    </div>
  );
};

export default AdminMedia;