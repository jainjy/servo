import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Headphones,
  Clock,
  Heart,
  Star,
  Download,
  Video,
  Map,
  Sun,
  
  TreePalm,
} from "lucide-react";
import { MediaService } from "../lib/api";
import LoadingSpinner from "./Loading/LoadingSpinner";

interface VideoEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  views: number;
  featured: boolean;
  videoUrl: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  mimeType?: string;
  fileSize?: number;
}

const PodcastsReunion: React.FC = () => {
  const [videoEpisodes, setVideoEpisodes] = useState<VideoEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<VideoEpisode | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Images par défaut pour les vidéos sans thumbnail
  const defaultThumbnails = [
    "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
    "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
    "https://i.pinimg.com/1200x/91/01/6a/91016ac95b54c8a72d47945497fc1ddc.jpg",
  ];

  // Image de background pour le titre
  const headerBackgroundImage =
    "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg";

  // États pour la barre de progression
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Formatage du temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Mise à jour du temps
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 0;

      setCurrentTime(current);
      setDuration(total);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    }
  };

  // Clic sur la barre de progression
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;

    const newTime = (percentage / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage);
  };

  // Plein écran
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Charger les vidéos de la catégorie Réunion
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await MediaService.getVideos({
          category: "Réunion",
          limit: 50,
        });

        const apiData = response.data;

        if (apiData.success && Array.isArray(apiData.data)) {
          const reunionVideos: VideoEpisode[] = apiData.data
            .filter((video: any) => {
              const isActive = video.isActive !== false;
              const hasVideoUrl =
                video.videoUrl && video.videoUrl.trim() !== "";

              return isActive && hasVideoUrl;
            })
            .map((video: any, index: number) => {
              return {
                id: video.id,
                title: video.title,
                description:
                  video.description ||
                  "Découvrez la beauté et la culture de la Réunion",
                duration: video.duration || "00:00:00",
                date: new Date(
                  video.createdAt || new Date()
                ).toLocaleDateString("fr-FR"),
                category: video.category || "Réunion",
                views: video.views || 0,
                featured: video.featured || video.isPremium || false,
                videoUrl: video.videoUrl,
                thumbnailUrl:
                  video.thumbnailUrl ||
                  defaultThumbnails[index % defaultThumbnails.length],
                isActive: video.isActive !== false,
                mimeType: video.mimeType || "video/mp4",
                fileSize: video.fileSize || 0,
              };
            });

          setVideoEpisodes(reunionVideos);
        } else {
          console.warn("Structure de réponse inattendue");
          setVideoEpisodes([]);
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des vidéos:", err);
        setError(err.message);
        setVideoEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePlayMedia = () => {
    if (selectedEpisode && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (selectedEpisode) {
      const link = document.createElement("a");
      link.href = selectedEpisode.videoUrl;
      link.download = `${selectedEpisode.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleFavorite = (episodeId: string) => {
    setFavorites((prev) =>
      prev.includes(episodeId)
        ? prev.filter((id) => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const isFavorite = (episodeId: string) => favorites.includes(episodeId);

  const getCategoryColor = (category: string) => {
    const colors = {
      Réunion: "bg-gradient-to-r from-orange-500 to-red-500",
      Tourisme: "bg-gradient-to-r from-blue-500 to-cyan-500",
      Culture: "bg-gradient-to-r from-purple-500 to-pink-500",
      Gastronomie: "bg-gradient-to-r from-yellow-500 to-amber-500",
      Nature: "bg-gradient-to-r from-green-500 to-emerald-500",
      Patrimoine: "bg-gradient-to-r from-indigo-500 to-purple-500",
      Activités: "bg-gradient-to-r from-red-500 to-orange-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Composant de carte vidéo
  const VideoCard = ({ episode }: { episode: VideoEpisode }) => {
    return (
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${
          episode.featured ? "border-2 border-orange-600" : "border-gray-200"
        }`}
      >
        {episode.featured && (
          <div className="bg-orange-600 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
            ⭐ Vedette Réunion
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = defaultThumbnails[0];
            }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Bouton play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
              <Video className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(
                episode.category
              )}`}
            >
              {episode.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {episode.duration}
            </div>
          </div>

          <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
            {episode.title}
          </h4>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {episode.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Headphones className="w-4 h-4 mr-1" />
                {episode.views.toLocaleString()} vues
              </div>
              <div>{episode.date}</div>
            </div>
            <button
              onClick={() => {
                setSelectedEpisode(episode);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors group/btn"
            >
              <Video className="w-4 h-4 mr-2" />
              Découvrir
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des découvertes de la Réunion" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec Image de Background */}
      <div
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${headerBackgroundImage})` }}
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            {/* Titre Principal */}
            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
              Découvrir <span className="text-orange-400">La Réunion</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-md md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Explorez l'île intense à travers nos vidéos : paysages, culture,
              gastronomie et aventures
            </p>

            {/* Statistiques */}
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 text-gray-200">
              {/* Vue totales */}
              <div className="glass-card group p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Headphones className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                      {videoEpisodes
                        .reduce((total, ep) => total + ep.views, 0)
                        .toLocaleString()}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-300 opacity-80">
                      explorations
                    </span>
                  </div>
                </div>
              </div>

              {/* Vidéos disponibles */}
              <div className="glass-card group p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-orange-500/20 border border-orange-400/30 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <Map className="w-5 h-5 lg:w-6 lg:h-6 text-orange-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                      {videoEpisodes.length}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-300 opacity-80">
                      découvertes
                    </span>
                  </div>
                </div>
              </div>

              {/* Vidéos premium */}
              <div className="glass-card group p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-yellow-500/20 border border-yellow-400/30 group-hover:bg-yellow-500/30 transition-colors duration-300">
                    <TreePalm className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                      {videoEpisodes.filter((ep) => ep.featured).length}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-300 opacity-80">
                      pépites
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Vidéos */}
        <section className="mb-16">
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-2xl">
                <Sun className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  L'Île Intense en Vidéo
                </h2>
                <p className="text-gray-600">
                  Visites guidées, spots incontournables et culture réunionnaise
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
              {activeTab === "all" ? videoEpisodes.length : favorites.length}{" "}
              vidéo(s) disponible(s)
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${
                activeTab === "all"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Map className="w-5 h-5" />
                <span>Toutes les découvertes ({videoEpisodes.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${
                activeTab === "favorites"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Mes favoris ({favorites.length})</span>
              </div>
            </button>
          </div>

          {/* Contenu de l'onglet */}
          {activeTab === "all" ? (
            videoEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoEpisodes.map((episode) => (
                  <VideoCard key={episode.id} episode={episode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
                <Map className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">
                  Aucune découverte disponible
                </h3>
                <p className="text-gray-500">
                  Aucune vidéo sur la Réunion n'est disponible pour le moment
                </p>
              </div>
            )
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoEpisodes
                .filter((episode) => favorites.includes(episode.id))
                .map((episode) => (
                  <VideoCard key={episode.id} episode={episode} />
                ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
              <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Aucune découverte en favoris
              </h3>
              <p className="text-gray-500">
                Cliquez sur le cœur d'une découverte pour l'ajouter à vos
                favoris
              </p>
            </div>
          )}
        </section>

        {/* Section Catégories */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explorez par thème
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl mb-2">🏝️</div>
              <h4 className="font-bold">Plages & Côtes</h4>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl mb-2">🌋</div>
              <h4 className="font-bold">Volcans & Randonnées</h4>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl mb-2">🍽️</div>
              <h4 className="font-bold">Gastronomie</h4>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-3xl mb-2">🎭</div>
              <h4 className="font-bold">Culture & Traditions</h4>
            </div>
          </div>
        </section>
      </div>

      {/* Modal Vidéo */}
      {isModalOpen && selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
          {/* Modal Container - Layout vertical sur mobile */}
          <div className="relative w-full max-w-7xl h-[95vh] sm:h-[90vh] bg-gray-900/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Bouton fermeture */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsPlaying(false);
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Colonne de gauche - Vidéo */}
            <div className="flex-1 overflow-hidden lg:mr-5 rounded-t-lg sm:rounded-t-2xl flex flex-col min-w-0">
              {/* Container vidéo */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[200px] sm:min-h-0">
                <video
                  ref={videoRef}
                  src={selectedEpisode.videoUrl}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-contain"
                  controls={false}
                  poster={selectedEpisode.thumbnailUrl}
                />

                {/* Overlay de contrôle custom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                  {/* Barre de progression */}
                  <div className="mb-3 sm:mb-4 px-1 sm:px-2">
                    <div
                      className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
                      onClick={handleProgressClick}
                      ref={progressBarRef}
                    >
                      <div className="absolute inset-0 bg-gray-600 rounded-full"></div>
                      <div
                        className="absolute h-full bg-orange-600 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div
                        className="absolute top-1/2 w-3 h-3 bg-orange-600 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        style={{ left: `calc(${progress}% - 6px)` }}
                      ></div>
                    </div>

                    {/* Temps */}
                    <div className="flex justify-between items-center mt-1 sm:mt-2 text-xs text-gray-300">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <button
                        onClick={handlePlayMedia}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 sm:p-3 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                      >
                        {isPlaying ? (
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {/* Bouton plein écran */}
                      <button
                        onClick={toggleFullscreen}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2 transition-all duration-200"
                        title="Plein écran"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Titre de la vidéo */}
              <div className="p-3 sm:p-4 rounded-b-lg bg-gray-800 border-t border-gray-700">
                <h1 className="text-base sm:text-lg font-bold text-white line-clamp-2">
                  {selectedEpisode.title}
                </h1>
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-400 mt-1">
                  <span>{selectedEpisode.views.toLocaleString()} vues</span>
                  <span>{selectedEpisode.date}</span>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Contenu */}
            <div className="w-full lg:w-80 bg-gray-800 border-t lg:border-l border-gray-700 flex flex-col max-h-[40vh] sm:max-h-none">
              {/* Contenu défilant */}
              <div className="flex-1 overflow-y-auto">
                {/* Informations de base */}
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(
                        selectedEpisode.category
                      )}`}
                    >
                      {selectedEpisode.category}
                    </span>
                    {selectedEpisode.featured && (
                      <span className="flex items-center text-yellow-400 text-xs font-medium">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Coup de cœur
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {selectedEpisode.duration}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {selectedEpisode.description}
                  </p>
                </div>

                {/* Infos techniques */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-semibold text-white mb-2 sm:mb-3">
                    Détails
                  </h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format</span>
                      <span className="text-white">
                        {selectedEpisode.mimeType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taille</span>
                      <span className="text-white">
                        {formatFileSize(selectedEpisode.fileSize || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Durée</span>
                      <span className="text-white">
                        {selectedEpisode.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-900/50">
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePlayMedia}
                      className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm"
                    >
                      {isPlaying ? (
                        <>
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>Explorer</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        selectedEpisode && toggleFavorite(selectedEpisode.id)
                      }
                      className={`p-2 rounded-lg transition-all duration-200 border text-xs ${
                        selectedEpisode && isFavorite(selectedEpisode.id)
                          ? "bg-red-500/20 border-red-500/50 text-red-400"
                          : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          selectedEpisode && isFavorite(selectedEpisode.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 border border-gray-600 text-xs"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastsReunion;
