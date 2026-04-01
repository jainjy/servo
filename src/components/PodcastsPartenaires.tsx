import React, { useState, useEffect, useRef } from "react";
import {
  Headphones, Clock, Heart, Star, Download,
  Video, Users, Handshake,
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

// ─── YouTube helpers ──────────────────────────────────────────────────────────

const YT_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?\s]+)/;

/** Returns true if the given URL is a YouTube URL */
const isYouTubeUrl = (url?: string): boolean =>
  !!url && YT_REGEX.test(url);

/** Extracts the YouTube video ID from any YouTube URL format */
const getYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(YT_REGEX);
  return match ? match[1] : null;
};

/**
 * Resolves the YouTube video ID from EITHER field.
 * Priority: videoUrl → thumbnailUrl (in case only thumbnailUrl is a YT link).
 */
const resolveYouTubeId = (
  videoUrl?: string,
  thumbnailUrl?: string
): string | null =>
  getYouTubeId(videoUrl) ?? getYouTubeId(thumbnailUrl) ?? null;

/** Returns an embeddable YouTube URL with autoplay */
const toEmbedUrl = (youtubeId: string): string =>
  `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;

/** Returns the best-quality YouTube thumbnail URL from a video ID */
const toYtThumbnail = (youtubeId: string): string =>
  `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

// ─────────────────────────────────────────────────────────────────────────────

const PodcastsPartenaires: React.FC = () => {
  const [videoEpisodes, setVideoEpisodes] = useState<VideoEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<VideoEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const defaultThumbnails = [
    "https://i.pinimg.com/1200x/6a/9a/66/6a9a661a89881207fcc24bf0c16e5bf5.jpg",
    "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
    "https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg",
  ];

  const headerBackgroundImage =
    "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg";

  // ── Resolve thumbnail ───────────────────────────────────────────────────────
  /**
   * Priority order:
   * 1. If thumbnailUrl is a plain image URL (non-YouTube) → use it directly
   * 2. If videoUrl OR thumbnailUrl contains a YouTube ID → use YT thumbnail
   * 3. Fallback to default rotating images
   */
  const resolveThumbnail = (video: any, index: number): string => {
    const ytId = resolveYouTubeId(video.videoUrl, video.thumbnailUrl);

    // Non-YouTube thumbnailUrl takes highest priority
    if (video.thumbnailUrl?.trim() && !isYouTubeUrl(video.thumbnailUrl)) {
      return video.thumbnailUrl;
    }
    // Auto-generate from YouTube ID if available
    if (ytId) return toYtThumbnail(ytId);
    // Last resort
    return defaultThumbnails[index % defaultThumbnails.length];
  };

  // ── Utilities ───────────────────────────────────────────────────────────────
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Partenaires: "bg-gradient-to-r from-[#556B2F] to-[#6B8E23]",
      Immobilier: "bg-gradient-to-r from-[#8B4513] to-[#A0522D]",
      "Bâtiment & Construction": "bg-gradient-to-r from-[#8B4513] to-[#D2691E]",
      Entreprise: "bg-gradient-to-r from-[#556B2F] to-[#8FBC8F]",
      Investissement: "bg-gradient-to-r from-[#8B4513] to-[#CD853F]",
      Témoignage: "bg-gradient-to-r from-[#6B8E23] to-[#7BA05B]",
      Interview: "bg-gradient-to-r from-[#2E8B57] to-[#3CB371]",
      Premium: "bg-gradient-to-r from-[#8B4513] to-[#D2691E]",
    };
    return colors[category] ?? "bg-gradient-to-r from-[#6B8E23] to-[#7BA05B]";
  };

  // ── Data fetching ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await MediaService.getVideos({ category: "Partenaires", limit: 50 });
        const apiData = response.data;

        if (apiData.success && Array.isArray(apiData.data)) {
          const videos: VideoEpisode[] = apiData.data
            .filter((v: any) => {
              // Accept if isActive and has at least one usable URL
              const hasUrl = v.videoUrl?.trim() || v.thumbnailUrl?.trim();
              return v.isActive !== false && hasUrl;
            })
            .map((v: any, i: number) => ({
              id: v.id,
              title: v.title,
              description: v.description || "Témoignage de partenaire et interview",
              duration: v.duration || "00:00:00",
              date: new Date(v.createdAt || new Date()).toLocaleDateString("fr-FR"),
              category: v.category || "Partenaires",
              views: v.views || 0,
              featured: v.featured || v.isPremium || false,
              videoUrl: v.videoUrl || "",
              thumbnailUrl: resolveThumbnail(v, i),
              isActive: v.isActive !== false,
              mimeType: v.mimeType || "video/mp4",
              fileSize: v.fileSize || 0,
            }));
          setVideoEpisodes(videos);
        } else {
          setVideoEpisodes([]);
        }
      } catch (err: any) {
        setError(err.message);
        setVideoEpisodes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // ── Modal helpers ───────────────────────────────────────────────────────────
  const closeModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const tot = videoRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(tot);
    setProgress(tot > 0 ? (cur / tot) * 100 : 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const newTime = (pct / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(pct);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    document.fullscreenElement
      ? document.exitFullscreen?.()
      : videoRef.current.requestFullscreen?.();
  };

  const handlePlayMedia = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!selectedEpisode) return;
    // YouTube: open in new tab; direct files: download
    const ytId = resolveYouTubeId(selectedEpisode.videoUrl, selectedEpisode.thumbnailUrl);
    if (ytId) {
      window.open(selectedEpisode.videoUrl || `https://youtu.be/${ytId}`, "_blank");
      return;
    }
    const a = document.createElement("a");
    a.href = selectedEpisode.videoUrl;
    a.download = `${selectedEpisode.title}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const isFavorite = (id: string) => favorites.includes(id);

  // ── For the currently selected episode ─────────────────────────────────────
  const selectedYtId = selectedEpisode
    ? resolveYouTubeId(selectedEpisode.videoUrl, selectedEpisode.thumbnailUrl)
    : null;

  // ── Video Card ──────────────────────────────────────────────────────────────
  const VideoCard = ({ episode }: { episode: VideoEpisode }) => {
    // Check if this episode has a YouTube source from either field
    const epYtId = resolveYouTubeId(episode.videoUrl, episode.thumbnailUrl);

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${
          episode.featured ? "border-2 border-[#8B4513]" : "border-[#D3D3D3]"
        }`}
      >
        {episode.featured && (
          <div className="bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white px-4 py-1 text-sm font-semibold rounded-t-2xl flex items-center justify-center">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Partenaire Premium
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              // YouTube thumbnails have black bars — use object-contain for them
              epYtId ? "object-contain bg-black" : "object-cover"
            }`}
            onError={(e) => { e.currentTarget.src = defaultThumbnails[0]; }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* YouTube badge */}
          {epYtId && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
              </svg>
              YouTube
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
              <Video className="w-8 h-8 text-[#6B8E23]" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(episode.category)}`}>
              {episode.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {episode.duration}
            </div>
          </div>

          <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-[#6B8E23] transition-colors line-clamp-2">
            {episode.title}
          </h4>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{episode.description}</p>

          <div className="flex items-center justify-between pt-4 border-t border-[#D3D3D3]">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Headphones className="w-4 h-4 mr-1" />
                {episode.views.toLocaleString()} vues
              </div>
              <div>{episode.date}</div>
            </div>
            <button
              onClick={() => { setSelectedEpisode(episode); setIsModalOpen(true); setIsPlaying(false); }}
              className="flex items-center px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#6B8E23] to-[#7BA05B] hover:from-[#556B2F] hover:to-[#6B8E23] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Video className="w-4 h-4 mr-2" />
              Regarder
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner text="Chargement des témoignages partenaires" />;
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
      {/* Hero */}
      <div
        className="relative pt-20 pb-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${headerBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-2xl lg:text-4xl uppercase font-medium mb-6 leading-tight drop-shadow-lg">
              Podcasts&nbsp;Partenaires
            </h1>
            <p className="text-sm md:text-md text-gray-100 max-w-3xl mx-auto leading-relaxed mb-8 drop-shadow-lg">
              Témoignages, interviews et retours d'expérience de nos partenaires
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8">
              <div className="glass-card group p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/20 bg-gradient-to-br from-[#556B2F]/30 to-[#6B8E23]/20 hover:from-[#556B2F]/40 hover:to-[#6B8E23]/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-[#6B8E23]/30 to-[#7BA05B]/30 border border-[#6B8E23]/30">
                    <Headphones className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                      {videoEpisodes.reduce((t, ep) => t + ep.views, 0).toLocaleString()}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-200 opacity-90">vues totales</span>
                  </div>
                </div>
              </div>

              <div className="glass-card group p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/20 bg-gradient-to-br from-[#8B4513]/30 to-[#D2691E]/20 hover:from-[#8B4513]/40 hover:to-[#D2691E]/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-[#8B4513]/30 to-[#A0522D]/30 border border-[#8B4513]/30">
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">{videoEpisodes.length}</span>
                    <span className="text-xs lg:text-sm text-gray-200 opacity-90">témoignages</span>
                  </div>
                </div>
              </div>

              <div className="glass-card group p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/20 bg-gradient-to-br from-[#556B2F]/30 to-[#8FBC8F]/20 hover:from-[#556B2F]/40 hover:to-[#8FBC8F]/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-[#556B2F]/30 to-[#8FBC8F]/30 border border-[#556B2F]/30">
                    <Handshake className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                      {videoEpisodes.filter((ep) => ep.featured).length}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-200 opacity-90">partenaires premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-[#6B8E23]/20 to-[#7BA05B]/20 rounded-2xl border border-[#6B8E23]/30">
                <Handshake className="w-8 h-8 text-[#6B8E23]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#8B4513]">Témoignages Partenaires</h2>
                <p className="text-gray-600">Découvrez les expériences et réussites de nos partenaires</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-[#D3D3D3] shadow-sm">
              {activeTab === "all" ? videoEpisodes.length : favorites.length} vidéo(s) disponible(s)
            </div>
          </div>

          <div className="flex gap-4 mb-8 border-b border-[#D3D3D3]">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${
                activeTab === "all" ? "border-[#6B8E23] text-[#6B8E23]" : "border-transparent text-gray-600 hover:text-[#556B2F]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Tous les témoignages ({videoEpisodes.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${
                activeTab === "favorites" ? "border-[#8B4513] text-[#8B4513]" : "border-transparent text-gray-600 hover:text-[#8B4513]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Mes favoris ({favorites.length})</span>
              </div>
            </button>
          </div>

          {activeTab === "all" ? (
            videoEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoEpisodes.map((ep) => <VideoCard key={ep.id} episode={ep} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-[#D3D3D3]">
                <Users className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun témoignage disponible</h3>
                <p className="text-gray-500">Aucun témoignage partenaire n'est disponible pour le moment</p>
              </div>
            )
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoEpisodes.filter((ep) => favorites.includes(ep.id)).map((ep) => <VideoCard key={ep.id} episode={ep} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-[#D3D3D3]">
              <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun témoignage en favoris</h3>
              <p className="text-gray-500">Cliquez sur le cœur d'un témoignage pour l'ajouter à vos favoris</p>
            </div>
          )}
        </section>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────────────── */}
      {isModalOpen && selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-7xl h-[95vh] sm:h-[90vh] bg-gray-900/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#7BA05B] text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-lg"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Player column */}
            <div className="flex-1 overflow-hidden lg:mr-5 rounded-t-lg sm:rounded-t-2xl flex flex-col min-w-0">
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[200px] sm:min-h-0">

                {/* ── YouTube iframe (triggered by ID found in either field) ── */}
                {selectedYtId ? (
                  <iframe
                    key={selectedEpisode.id}
                    src={toEmbedUrl(selectedYtId)}
                    title={selectedEpisode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full min-h-[200px]"
                    style={{ border: "none", aspectRatio: "16/9" }}
                  />
                ) : (
                  /* ── Direct video file ── */
                  <>
                    <video
                      ref={videoRef}
                      src={selectedEpisode.videoUrl}
                      onEnded={() => setIsPlaying(false)}
                      onTimeUpdate={handleTimeUpdate}
                      className="w-full h-full object-contain"
                      controls={false}
                      poster={selectedEpisode.thumbnailUrl}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                      <div className="mb-3 sm:mb-4 px-1 sm:px-2">
                        <div
                          className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
                          onClick={handleProgressClick}
                          ref={progressBarRef}
                        >
                          <div className="absolute inset-0 bg-gray-600 rounded-full" />
                          <div
                            className="absolute h-full bg-gradient-to-r from-[#6B8E23] to-[#7BA05B] rounded-full transition-all duration-100"
                            style={{ width: `${progress}%` }}
                          />
                          <div
                            className="absolute top-1/2 w-3 h-3 bg-gradient-to-r from-[#6B8E23] to-[#7BA05B] rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                            style={{ left: `calc(${progress}% - 6px)` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1 sm:mt-2 text-xs text-gray-300">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handlePlayMedia}
                          className="bg-gradient-to-r from-[#6B8E23] to-[#7BA05B] hover:from-[#556B2F] hover:to-[#6B8E23] text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          {isPlaying ? (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={toggleFullscreen}
                          className="bg-gradient-to-r from-[#6B8E23] to-[#7BA05B] hover:from-[#556B2F] hover:to-[#6B8E23] text-white rounded-full p-1.5 sm:p-2 transition-all duration-200 shadow-md"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Title bar */}
              <div className="p-3 sm:p-4 rounded-b-lg bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700">
                <h1 className="text-base sm:text-lg font-bold text-white line-clamp-2">{selectedEpisode.title}</h1>
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-300 mt-1">
                  <span>{selectedEpisode.views.toLocaleString()} vues</span>
                  <span>{selectedEpisode.date}</span>
                  {selectedYtId && (
                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                      <svg className="w-3 h-3 fill-red-400" viewBox="0 0 24 24">
                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
                      </svg>
                      YouTube
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info column */}
            <div className="w-full lg:w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-t lg:border-l border-gray-700 flex flex-col max-h-[40vh] sm:max-h-none">
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(selectedEpisode.category)}`}>
                      {selectedEpisode.category}
                    </span>
                    {selectedEpisode.featured && (
                      <span className="flex items-center bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white px-2 py-1 rounded text-xs font-medium">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Partenaire Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#6B8E23]" />
                    {selectedEpisode.duration}
                  </div>
                </div>

                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {selectedEpisode.description}
                  </p>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-semibold text-white mb-2 sm:mb-3">Détails</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source</span>
                      <span className="text-white">{selectedYtId ? "YouTube" : "Fichier direct"}</span>
                    </div>
                    {!selectedYtId && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Format</span>
                          <span className="text-white">{selectedEpisode.mimeType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Taille</span>
                          <span className="text-white">{formatFileSize(selectedEpisode.fileSize || 0)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Durée</span>
                      <span className="text-white">{selectedEpisode.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-900/50">
                  <div className="flex space-x-2">
                    {/* Play/Pause only for direct files — YouTube iframe handles its own controls */}
                    {!selectedYtId && (
                      <button
                        onClick={handlePlayMedia}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#6B8E23] to-[#7BA05B] hover:from-[#556B2F] hover:to-[#6B8E23] text-white py-2 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm shadow-md"
                      >
                        {isPlaying ? (
                          <><svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg><span>Pause</span></>
                        ) : (
                          <><svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg><span>Lecture</span></>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => toggleFavorite(selectedEpisode.id)}
                      className={`p-2 rounded-lg transition-all duration-200 border text-xs shadow-md ${
                        isFavorite(selectedEpisode.id)
                          ? "bg-gradient-to-r from-[#8B4513] to-[#D2691E] border-[#8B4513]/50 text-white"
                          : "bg-gray-700 border-gray-600 text-white hover:bg-gradient-to-r hover:from-[#8B4513]/20 hover:to-[#D2691E]/20"
                      }`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite(selectedEpisode.id) ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-2 bg-gradient-to-r from-[#6B8E23] to-[#7BA05B] hover:from-[#556B2F] hover:to-[#6B8E23] text-white rounded-lg transition-all duration-200 border border-[#6B8E23]/50 shadow-md text-xs"
                      title={selectedYtId ? "Ouvrir sur YouTube" : "Télécharger"}
                    >
                      {selectedYtId ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      ) : (
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
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

export default PodcastsPartenaires;