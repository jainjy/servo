import React, { useState, useEffect, useRef } from 'react';
import Vids from '/Home.mp4'

const VideosComponent = () => {
  const [activeCategory, setActiveCategory] = useState('toutes');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredActive, setFeaturedActive] = useState(false);
  const [hoveredFeatured, setHoveredFeatured] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const videoRefs = useRef({});
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  // Effect pour contrôler la lecture de la vidéo vedette
  useEffect(() => {
    const featuredId = 1;
    const vid = videoRefs.current[featuredId];

    if (!vid || !vid.isConnected) {
      return;
    }

    // Si on est en fullscreen, on laisse le useEffect fullscreen gérer
    if (fullscreenVideo === featuredId) {
      return;
    }

    if (isPlaying && playingVideo === featuredId) {
      // Jouer la vidéo
      vid.muted = false;
      vid.volume = Math.max(0.5, volume / 100);
      
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Erreur de lecture:', error);
          // Fallback: jouer en muted
          vid.muted = true;
          vid.play().catch(err => console.error('Erreur même en muted:', err));
        });
      }
    } else if (!isPlaying && playingVideo !== featuredId) {
      // Mettre en pause
      if (!vid.paused) {
        vid.pause();
      }
    }
  }, [isPlaying, playingVideo, volume, fullscreenVideo]);

  // Effect pour contrôler la lecture du fullscreen player
  useEffect(() => {
    if (!fullscreenVideo) {
      return;
    }

    const vid = videoRefs.current[fullscreenVideo];
    if (!vid) {
      return;
    }

    // Petit délai pour s'assurer que l'élément est prêt
    const timer = setTimeout(() => {
      if (!vid.isConnected) {
        return;
      }

      if (isPlaying) {
        // Jouer la vidéo
        vid.muted = false;
        vid.volume = Math.max(0.5, volume / 100);
        
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Erreur de lecture fullscreen:', error);
            // Fallback: jouer en muted
            vid.muted = true;
            vid.play().catch(err => console.error('Erreur même en muted:', err));
          });
        }
      } else {
        // Mettre en pause
        if (!vid.paused) {
          vid.pause();
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isPlaying, fullscreenVideo, volume]);

  // Données des vidéos
  const videos = [
    {
      id: 1,
      title: "L'Âme du Volcan",
      category: "documentaire",
      director: "Sophie Martin",
      duration: "24:15",
      year: 2024,
      description: "Une immersion cinématographique dans les entrailles du Piton de la Fournaise, capturant des images inédites de l'activité volcanique.",
      resolution: "8K HDR",
      color: "red",
      featured: true,
      views: "2.4M",
      likes: "145K",
      tags: ["Nature", "Science", "Cinématographie"],
      thumbnail: "https://i.pinimg.com/736x/3c/b2/66/3cb266a3ef8219035b53d31dc2e4ad1c.jpg",
      videoUrl: Vids,
      chapters: [
        { time: "0:00", title: "Prélude" },
        { time: "3:45", title: "Le Réveil" },
        { time: "12:30", title: "La Danse de la Lave" },
        { time: "20:15", title: "Épilogue" }
      ],
      crew: ["Réalisateur: S. Martin", "DOP: J. Petit", "Sound Design: M. Silva"]
    },
    {
      id: 2,
      title: "Rythmes Créoles",
      category: "musique",
      director: "Jean-Paul Tamarin",
      duration: "5:42",
      year: 2024,
      description: "Clip expérimental mêlant danse traditionnelle maloya et effets visuels génératifs en slow motion.",
      resolution: "4K 120fps",
      color: "purple",
      featured: true,
      views: "5.7M",
      likes: "320K",
      tags: ["Musique", "Danse", "Art visuel"],
      thumbnail: "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-at-a-festival-39851-large.mp4",
      chapters: [
        { time: "0:00", title: "Introduction" },
        { time: "1:20", title: "Rythme" },
        { time: "3:45", title: "Transformation" },
        { time: "4:50", title: "Finale" }
      ],
      crew: ["Chorégraphe: T. Merle", "Compositeur: K. Yamamoto"]
    },
    {
      id: 3,
      title: "Silence Urbain",
      category: "expérimental",
      director: "Léa Chen",
      duration: "17:28",
      year: 2023,
      description: "Voyage nocturne à travers les rues désertes de Saint-Denis, capturé en time-lapse et slow motion.",
      resolution: "6K RAW",
      color: "blue",
      featured: false,
      views: "890K",
      likes: "45K",
      tags: ["Ville", "Nuit", "Contemplation"],
      thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-3555-large.mp4",
      chapters: [
        { time: "0:00", title: "Crépuscule" },
        { time: "5:30", title: "Minuit" },
        { time: "12:15", title: "Aube" }
      ],
      crew: ["Photographe: L. Chen", "Compositeur: A. Schmidt"]
    },
    {
      id: 4,
      title: "Mémoire du Lagon",
      category: "nature",
      director: "Dr. Maria Silva",
      duration: "32:10",
      year: 2024,
      description: "Documentaire sous-marin explorant la biodiversité unique du lagon de Mayotte en macro et wide angle.",
      resolution: "5K 60fps",
      color: "cyan",
      featured: true,
      views: "3.2M",
      likes: "210K",
      tags: ["Océan", "Biodiversité", "Conservation"],
      thumbnail: "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-a-school-of-fish-swimming-underwater-3111-large.mp4",
      chapters: [
        { time: "0:00", title: "Plongée" },
        { time: "8:45", title: "Corail" },
        { time: "18:30", title: "Faune" },
        { time: "28:15", title: "Équilibre" }
      ],
      crew: ["Biologiste: Dr. M. Silva", "Plongeur: D. Park"]
    },
    {
      id: 5,
      title: "Data Flow",
      category: "motion",
      director: "Alex Rivera",
      duration: "3:15",
      year: 2024,
      description: "Animation data-driven visualisant les flux d'information mondiaux en temps réel avec effets génératifs.",
      resolution: "4K HDR",
      color: "green",
      featured: false,
      views: "1.8M",
      likes: "98K",
      tags: ["Data", "Animation", "Technologie"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-computer-data-screen-2468-large.mp4",
      chapters: [
        { time: "0:00", title: "Initiation" },
        { time: "1:00", title: "Expansion" },
        { time: "2:30", title: "Convergence" }
      ],
      crew: ["Motion Designer: A. Rivera", "Data Scientist: S. Johnson"]
    },
    {
      id: 6,
      title: "Couture Numérique",
      category: "fashion",
      director: "Claire Dubois",
      duration: "8:45",
      year: 2023,
      description: "Film de mode intégrant tissage traditionnel réunionnais et effets de réalité augmentée.",
      resolution: "6K RAW",
      color: "pink",
      featured: true,
      views: "4.5M",
      likes: "280K",
      tags: ["Mode", "Artisanat", "Innovation"],
      thumbnail: "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-sewing-with-a-sewing-machine-41300-large.mp4",
      chapters: [
        { time: "0:00", title: "Tissage" },
        { time: "3:20", title: "Transformation" },
        { time: "6:45", title: "Révélation" }
      ],
      crew: ["Styliste: C. Dubois", "VFX Artist: T. Chen"]
    },
    {
      id: 7,
      title: "Horizons Sonores",
      category: "art",
      director: "Kenji Yamamoto",
      duration: "21:30",
      year: 2024,
      description: "Installation audiovisuelle générative projetée sur les falaises de la côte sauvage.",
      resolution: "8K 360°",
      color: "indigo",
      featured: false,
      views: "750K",
      likes: "52K",
      tags: ["Projection", "Génératif", "Immersion"],
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-geometric-shapes-rotating-3122-large.mp4",
      chapters: [
        { time: "0:00", title: "Ouverture" },
        { time: "7:45", title: "Crescendo" },
        { time: "16:30", title: "Apothéose" }
      ],
      crew: ["Media Artist: K. Yamamoto", "Composer: A. Schmidt"]
    },
    {
      id: 8,
      title: "Saveurs Insulaires",
      category: "culinaire",
      director: "Chef Mathieu",
      duration: "28:20",
      year: 2024,
      description: "Voyage gastronomique à travers les marchés et cuisines traditionnelles de l'océan Indien.",
      resolution: "4K HDR",
      color: "amber",
      featured: true,
      views: "3.8M",
      likes: "195K",
      tags: ["Cuisine", "Culture", "Voyage"],
      thumbnail: "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cooking-show-125.mp4",
      chapters: [
        { time: "0:00", title: "Marché" },
        { time: "9:15", title: "Préparation" },
        { time: "18:30", title: "Dégustation" }
      ],
      crew: ["Chef: M. Chazal", "Photographe: F. Ben Said"]
    }
  ];

  // Catégories
  const categories = [
    { id: 'toutes', label: 'Toutes les vidéos' },
    { id: 'documentaire', label: 'Documentaire' },
    { id: 'musique', label: 'Musique' },
    { id: 'expérimental', label: 'Expérimental' },
    { id: 'nature', label: 'Nature' },
    { id: 'motion', label: 'Motion Design' },
    { id: 'fashion', label: 'Fashion Film' },
    { id: 'art', label: 'Art Vidéo' },
    { id: 'culinaire', label: 'Culinaire' }
  ];

  // Filtrage des vidéos
  const filteredVideos = activeCategory === 'toutes'
    ? videos
    : videos.filter(video => video.category === activeCategory);

  // Animation du canvas (effet cinéma)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Effet de grain cinématographique
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        const alpha = cinemaMode ? 0.15 : 0.05;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, size, size);
      }

      // Scanlines
      if (cinemaMode) {
        for (let y = 0; y < canvas.height; y += 3) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.05 + Math.sin(time + y * 0.1) * 0.05})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Effet de vignette
      if (cinemaMode) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      time += 0.02;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [cinemaMode]);

  // Gestion des vidéos
  const handleVideoPlay = (videoId) => {
    if (playingVideo === videoId) {
      // Toggle play/pause
      if (isPlaying) {
        videoRefs.current[videoId]?.pause();
        setIsPlaying(false);
      } else {
        videoRefs.current[videoId]?.play();
        setIsPlaying(true);
      }
    } else {
      // Nouvelle vidéo
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo].pause();
        videoRefs.current[playingVideo].currentTime = 0;
      }

      setPlayingVideo(videoId);
      setIsPlaying(true);

      // Simuler le chargement
      setTimeout(() => {
        if (videoRefs.current[videoId]) {
          videoRefs.current[videoId].play();
        }
      }, 100);
    }
  };

  const handleFeaturedPlayClick = () => {
    const id = featuredVideo.id;

    if (!isPlaying) {
      setFeaturedActive(true);
      setPlayingVideo(id);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleFeaturedFullscreen = () => {
    const id = featuredVideo.id;
    setFeaturedActive(true);
    setPlayingVideo(id);
    setIsPlaying(true);
    setCinemaMode(true);
    setFullscreenVideo(id);
    
    // Demander le fullscreen après que le state soit à jour
    setTimeout(() => {
      const vid = videoRefs.current[id];
      if (vid && !document.fullscreenElement) {
        vid.requestFullscreen?.().catch(err => 
          console.log('Fullscreen error:', err)
        );
      }
    }, 50);

  };

  const handleFullscreen = (videoId) => {
    setFullscreenVideo(videoId);
    setPlayingVideo(videoId);
    setIsPlaying(true);
    setCinemaMode(true);

    setTimeout(() => {
      if (videoRefs.current[videoId]) {
        if (!document.fullscreenElement) {
          videoRefs.current[videoId].requestFullscreen?.().catch(err => console.log('Fullscreen error:', err));
        }
      }
    }, 50);
  };

  // Hero background play/pause toggle
  const toggleHeroVideo = () => {
    const vid = heroVideoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
  };

  const handleExitFullscreen = () => {
    setFullscreenVideo(null);
    setCinemaMode(false);

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Composant Carte Vidéo
  const VideoCard = ({ video }) => {
    const isPlaying = playingVideo
    playingVideo === video.id && isPlaying;
    const isHovered = hoveredVideo === video.id;
    const progress = videoProgress[video.id] || 0;

    return (
      <div
        className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl group border-2 ${isPlaying ? `border-${video.color}-500 scale-[1.02]` : 'border-transparent'
          }`}
        onMouseEnter={() => setHoveredVideo(video.id)}
        onMouseLeave={() => setHoveredVideo(null)}
      >
        {/* Thumbnail avec overlay */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={`${video.thumbnail}`}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700"
          />

          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-${video.color}-900/70 via-transparent to-transparent`}></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className={`bg-${video.color}-600 text-white px-3 py-1.5 rounded-full text-xs font-bold`}>
              {video.category}
            </div>
            {video.featured && (
              <div className="bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm font-bold">
                ★
              </div>
            )}
          </div>

          {/* Résolution */}
          <div className="absolute text-xs top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            {video.resolution}
          </div>

          {/* Bouton play */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
            <button
              onClick={() => handleVideoPlay(video.id)}
              className={`w-20 h-20 rounded-full backdrop-blur-sm flex items-center justify-center transition-transform duration-300 hover:scale-110 ${isPlaying ? 'bg-white/20' : 'bg-white/90'
                }`}
            >
              {isPlaying ? (
                <div className="flex space-x-2">
                  <div className="w-3 h-8 bg-white"></div>
                  <div className="w-3 h-8 bg-white"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[16px] border-t-transparent border-l-[24px] border-l-black border-b-[16px] border-b-transparent ml-2"></div>
              )}
            </button>
          </div>

          {/* Durée et vues */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black/60 text-xs backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
              {video.duration}
            </div>
            <div className="bg-black/60 text-xs backdrop-blur-sm text-white px-3 py-1.5 rounded-lg flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {video.views}
            </div>
          </div>

          {/* Barre de progression */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div
              className={`h-full bg-${video.color}-500 transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Titre et réalisateur */}
          <div className="mb-4">
            <h3 className="text-md font-bold text-white mb-1 line-clamp-1">{video.title}</h3>
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="truncate text-xs">{video.director}</span>
              <span className="mx-2">•</span>
              <span className='text-xs'>{video.year}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{video.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {video.tags.map((tag, index) => (
              <span key={index} className={`px-3 py-1 bg-${video.color}-900 text-${video.color}-300 rounded-full text-xs`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => handleFullscreen(video.id)}
                className={`px-4 py-2 bg-${video.color}-600 text-sm text-white rounded-lg hover:bg-${video.color}-700 transition-colors`}
              >
                Plein écran
              </button>
              <button
                onClick={() => handleVideoPlay(video.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${isPlaying ? `bg-${video.color}-100 text-${video.color}-600` : `bg-${video.color}-600 text-white`
                  }`}
              >
                {isPlaying ? (
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-4 bg-current"></div>
                    <div className="w-1.5 h-4 bg-current"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-current border-b-[8px] border-b-transparent ml-1"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Élément vidéo caché */}
        <video
          ref={el => videoRefs.current[video.id] = el}
          className="hidden"
          src={video.videoUrl}
          onTimeUpdate={(e) => {
            const videoElement = e.target as HTMLVideoElement;
            const progress = (videoElement.currentTime / videoElement.duration) * 100;
            setVideoProgress(prev => ({
              ...prev,
              [video.id]: progress
            }));
          }}
          onEnded={() => {
            setIsPlaying(false);
            setVideoProgress(prev => ({
              ...prev,
              [video.id]: 100
            }));
          }}
        />
      </div>
    );
  };

  // Player plein écran
  const FullscreenPlayer = () => {
    if (!fullscreenVideo) return null;

    const video = videos.find(v => v.id === fullscreenVideo);
    if (!video) return null;

    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Canvas d'effets */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-30"
          width={1920}
          height={1080}
        />

        {/* Contrôles */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExitFullscreen}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{video.title}</h2>
                <div className="text-gray-300">{video.director} • {video.year}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-white">{formatTime(currentTime)} / {formatTime(duration)}</div>
              <button
                onClick={() => handleVideoPlay(video.id)}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                {isPlaying ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-6 bg-gray-900"></div>
                    <div className="w-2 h-6 bg-gray-900"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-gray-900 border-b-[12px] border-b-transparent ml-1"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Chapitres */}
        <div className="absolute left-6 bottom-24 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 max-w-sm">
            <h4 className="font-bold text-white mb-3">Chapitres</h4>
            <div className="space-y-2">
              {video.chapters.map((chapter, index) => (
                <div key={index} className="flex items-center justify-between hover:bg-white/10 p-2 rounded cursor-pointer">
                  <div className="text-gray-300">{chapter.title}</div>
                  <div className="text-gray-400 text-sm">{chapter.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Équipe */}
        <div className="absolute right-6 bottom-24 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
            <h4 className="font-bold text-white mb-3">Équipe</h4>
            <div className="space-y-2">
              {video.crew.map((member, index) => (
                <div key={index} className="text-gray-300 text-sm">{member}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Barre de contrôle du bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20">
          <div className="flex items-center space-x-4">
            {/* Timeline */}
            <div
              className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                if (videoRefs.current[video.id]) {
                  videoRefs.current[video.id].currentTime = percent * duration;
                }
              }}
            >
              <div
                className="h-full bg-white"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>

            {/* Vitesse */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPlaybackSpeed(s => Math.max(0.25, s - 0.25))}
                className="w-8 h-8 bg-white/20 rounded-full text-white hover:bg-white/30"
              >
                -
              </button>
              <div className="text-white text-sm font-mono">{playbackSpeed}x</div>
              <button
                onClick={() => setPlaybackSpeed(s => Math.min(4.0, s + 0.25))}
                className="w-8 h-8 bg-white/20 rounded-full text-white hover:bg-white/30"
              >
                +
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  const numValue = Number(e.target.value);
                  setVolume(numValue);
                  if (videoRefs.current[video.id]) {
                    videoRefs.current[video.id].volume = numValue / 100;
                  }
                }}
                className="w-32 accent-white"
              />
            </div>
          </div>
        </div>

        {/* Vidéo en plein écran */}
        <video
          ref={el => videoRefs.current[video.id] = el}
          className="absolute inset-0 w-full h-full object-contain"
          src={video.videoUrl}
          onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
          onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
          onEnded={handleExitFullscreen}
        />
      </div>
    );
  };

  // Vidéo vedette
  const featuredVideo = videos.find(v => v.id === 1);

  return (
    <div className="min-h-screen text-white overflow-hidden" ref={containerRef}>
      {/* Header cinématographique */}
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Effet de lumière de projecteur */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-3xl"></div>
        <div
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'

        >
          <div
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
          />
          <img
            src="https://i.pinimg.com/736x/bb/b9/09/bbb909eb6030ed1cf42c7ecfeb09f16f.jpg"
            className='h-full object-cover w-full'
            alt="Background"
          />
        </div>
        <div className="relative z-10 pt-5 max-w-6xl mx-auto text-center">

          <h1 className="text-xl md:text-4xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Vidéos
          </h1>
          <p className="text-sm text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explorez des histoires et expériences en images animées.
            Des récits visuels qui transportent, émeuvent et inspirent.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        {/* Catégories */}
        <div className="mb-8 mt-5">
          <div className="flex overflow-x-auto pb-4 space-x-3 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-300 border ${activeCategory === category.id
                    ? 'bg-logo text-white text-sm border-white transform '
                    : 'bg-black/10 text-gray-900 border-white/20 hover:border-white/40 hover:text-white'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vidéo vedette */}
        {featuredVideo && (
          <div className="mb-16 ">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                onMouseEnter={() => setHoveredFeatured(true)}
                onMouseLeave={() => setHoveredFeatured(false)}
                style={hoveredFeatured ? { cursor: isPlaying && playingVideo === featuredVideo.id ? 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22white%22%3E%3Cpath d=%22M6 4h4v16H6V4zm8 0h4v16h-4V4z%22/%3E%3C/svg%3E") 12 12, auto' : 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22white%22%3E%3Cpath d=%22M8 5v14l11-7z%22/%3E%3C/svg%3E") 12 12, auto' } : {}}
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10"></div>

                {/* Video player pour la vidéo vedette (always video, paused by default) */}
                <div className="aspect-video overflow-hidden relative">
                  {/* Poster image - hidden when video is playing */}
                  {!(playingVideo === featuredVideo.id && isPlaying) && (
                    <div className="absolute inset-0 z-20">
                      <img
                        src={featuredVideo.thumbnail}
                        alt={featuredVideo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <video
                    ref={el => videoRefs.current[featuredVideo.id] = el}
                    src={featuredVideo.videoUrl}
                    className="w-full h-full object-cover"
                    playsInline
                    muted={false}
                    crossOrigin="anonymous"
                    onTimeUpdate={(e) => {
                      const videoElement = e.target as HTMLVideoElement;
                      const progress = (videoElement.currentTime / (videoElement.duration || 1)) * 100;
                      setVideoProgress(prev => ({ ...prev, [featuredVideo.id]: progress }));
                      setCurrentTime(videoElement.currentTime);
                      setDuration(videoElement.duration || duration);
                    }}
                    onEnded={() => {
                      setIsPlaying(false);
                      setVideoProgress(prev => ({ ...prev, [featuredVideo.id]: 100 }));
                    }}
                  />

                  {/* Invisible click overlay with custom cursor indicator */}
                  {hoveredFeatured && !isPlaying && (
                    <button
                      onClick={handleFeaturedPlayClick}
                      className="absolute inset-0 z-30"
                      aria-label="Toggle lecture vidéo vedette"
                      style={{ background: 'transparent', border: 'none', cursor: 'auto' }}
                    />
                  )}
                </div>

              {/* Contenu */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="max-w-2xl p-4 rounded-lg overflow-hidden backdrop-blur-lg">
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-bold text-xs">VIDÉO VEDETTE</span>
                  </div>

                  <h2 className="text-xl font-bold mb-4">{featuredVideo.title}</h2>
                  <p className="text-gray-300 text-md mb-6">{featuredVideo.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Réalisateur</div>
                      <div className="font-bold">{featuredVideo.director}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Durée</div>
                      <div className="font-bold">{featuredVideo.duration}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Résolution</div>
                      <div className="font-bold">{featuredVideo.resolution}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Vues</div>
                      <div className="font-bold">{featuredVideo.views}</div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        // open video and play
                        handleFeaturedPlayClick();
                      }}
                      className="flex-1 bg-logo text-white font-bold py-4 rounded-xl hover:bg-logo/80 transition-colors flex items-center justify-center"
                    >
                      {playingVideo === featuredVideo.id && isPlaying ? (
                        <>
                          <div className="flex space-x-1 mr-3">
                            <div className="w-2 h-5 bg-white"></div>
                            <div className="w-2 h-5 bg-white"></div>
                          </div>
                          En lecture
                        </>
                      ) : (
                        <>
                          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent mr-3"></div>
                          Lire maintenant
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleFeaturedFullscreen()}
                      className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Plein écran
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grille de vidéos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: videos.length, label: "Vidéos produites", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
            { value: "45M+", label: "Vues totales", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
            { value: "8K", label: "Résolution max", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
            { value: "98%", label: "Satisfaction", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
          ].map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-text rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-xl text-secondary-text font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-800">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section "À ne pas manquer" */}
        <div className="mb-16 bg-white py-10 px-5 rounded-lg shadow-xl">
          <h2 className="text-2xl text-slate-900 font-bold mb-8">À ne pas manquer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.slice(1, 4).map(video => (
              <div key={video.id} className="relative rounded-2xl overflow-hidden group">
                <div className="aspect-video">
                  <img
                    src={`${video.thumbnail}`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black to-transparent`}></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className={`bg-${video.color}-600 text-white px-3 py-1.5 rounded-full text-sm font-bold inline-block mb-3`}>
                    {video.category}
                  </div>
                  <h3 className="text-md font-bold mb-2">{video.title}</h3>
                  <p className="text-gray-300 text-xs line-clamp-2">{video.description}</p>

                  <button
                    onClick={() => handleVideoPlay(video.id)}
                    className={`mt-4 w-full bg-${video.color}-600 text-white py-3 rounded-xl hover:bg-${video.color}-700 transition-colors flex items-center justify-center`}
                  >
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent mr-3"></div>
                    Regarder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Player plein écran */}
      <FullscreenPlayer />

      <style >{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VideosComponent;