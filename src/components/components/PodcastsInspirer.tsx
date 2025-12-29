import React, { useState, useEffect, useRef } from 'react';

const PodcastsComponent = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [playingPodcast, setPlayingPodcast] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioWave, setAudioWave] = useState([]);
  const [equalizerBands, setEqualizerBands] = useState([30, 45, 60, 40, 35, 50, 55, 45]);
  const [recommendedForYou, setRecommendedForYou] = useState([]);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const waveCanvasRef = useRef(null);

  // Données des podcasts
  const podcasts = [
    {
      id: 1,
      title: "Les Voix du Volcan",
      host: "Dr. Sophie Martin",
      category: "science",
      duration: "45:22",
      date: "15 Mars 2024",
      description: "Plongée au cœur de la géologie réunionnaise avec les plus grands vulcanologues de l'île.",
      tags: ["Géologie", "Nature", "Sciences"],
      color: "red",
      featured: true,
      listens: "124k",
      episodes: 24,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
      waveform: [30, 45, 60, 40, 55, 35, 50, 65, 40, 55, 30, 45],
      guests: ["Prof. Jacques Dubois", "Dr. Marie Volcan"]
    },
    {
      id: 2,
      title: "Racines Créoles",
      host: "Jean-Paul Tamarin",
      category: "culture",
      duration: "38:15",
      date: "12 Mars 2024",
      description: "Exploration des traditions orales et des récits ancestraux de l'océan Indien.",
      tags: ["Histoire", "Traditions", "Patrimoine"],
      color: "amber",
      featured: true,
      listens: "89k",
      episodes: 18,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-ethnic-deep-african-168.mp3",
      waveform: [40, 55, 35, 60, 45, 30, 50, 40, 55, 35, 60, 45],
      guests: ["Écrivaine Fatima Ben", "Historien Marc Ravoavy"]
    },
    {
      id: 3,
      title: "Échos Numériques",
      host: "Alex Rivera",
      category: "tech",
      duration: "52:10",
      date: "10 Mars 2024",
      description: "Conversations sur l'innovation technologique et la transformation digitale dans les territoires insulaires.",
      tags: ["Innovation", "Digital", "Startup"],
      color: "blue",
      featured: false,
      listens: "67k",
      episodes: 32,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-ethereal-futuristic-insight-307.mp3",
      waveform: [35, 50, 40, 55, 45, 60, 35, 50, 40, 55, 45, 60],
      guests: ["CEO Tech Réunion", "Investisseur VC"]
    },
    {
      id: 4,
      title: "Cuisine des Îles",
      host: "Chef Mathieu Chazal",
      category: "cuisine",
      duration: "41:30",
      date: "8 Mars 2024",
      description: "Recettes, techniques et histoires culinaires avec les chefs emblématiques de la région.",
      tags: ["Gastronomie", "Recettes", "Produits locaux"],
      color: "emerald",
      featured: true,
      listens: "102k",
      episodes: 28,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-cooking-show-125.mp3",
      waveform: [45, 35, 50, 40, 55, 45, 60, 35, 50, 40, 55, 45],
      guests: ["Chef étoilé", "Producteur local"]
    },
    {
      id: 5,
      title: "Arts Vivants",
      host: "Léa Chen",
      category: "art",
      duration: "36:45",
      date: "5 Mars 2024",
      description: "Rencontres avec artistes, artisans et créateurs qui façonnent la scène culturelle contemporaine.",
      tags: ["Art contemporain", "Création", "Inspiration"],
      color: "purple",
      featured: false,
      listens: "58k",
      episodes: 21,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-urban-style-125.mp3",
      waveform: [50, 40, 55, 35, 60, 45, 50, 40, 55, 35, 60, 45],
      guests: ["Sculpteur local", "Photographe"]
    },
    {
      id: 6,
      title: "Aventures Océanes",
      host: "Capitaine David",
      category: "aventure",
      duration: "49:20",
      date: "3 Mars 2024",
      description: "Récits d'expéditions maritimes, de plongées profondes et de découvertes sous-marines.",
      tags: ["Mer", "Aventure", "Exploration"],
      color: "cyan",
      featured: true,
      listens: "95k",
      episodes: 19,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-deep-sea-ambience-169.mp3",
      waveform: [40, 55, 45, 60, 35, 50, 40, 55, 45, 60, 35, 50],
      guests: ["Plongeur professionnel", "Biologiste marin"]
    },
    {
      id: 7,
      title: "Entrepreneuriat Insulaire",
      host: "Sarah Johnson",
      category: "business",
      duration: "44:10",
      date: "1 Mars 2024",
      description: "Stratégies business et parcours entrepreneuriaux adaptés aux contextes insulaires.",
      tags: ["Business", "Économie", "Leadership"],
      color: "indigo",
      featured: false,
      listens: "73k",
      episodes: 26,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-business-presentation-129.mp3",
      waveform: [55, 35, 50, 40, 45, 60, 35, 50, 40, 45, 60, 35],
      guests: ["Serial entrepreneur", "Consultant stratégie"]
    },
    {
      id: 8,
      title: "Bien-être Tropical",
      host: "Dr. Maria Silva",
      category: "santé",
      duration: "39:55",
      date: "28 Fév 2024",
      description: "Conseils santé, médecines douces et équilibre de vie sous les tropiques.",
      tags: ["Santé", "Bien-être", "Médecine douce"],
      color: "pink",
      featured: true,
      listens: "81k",
      episodes: 22,
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-meditation-ambience-169.mp3",
      waveform: [35, 50, 40, 55, 45, 60, 35, 50, 40, 55, 45, 60],
      guests: ["Naturopathe", "Professeur yoga"]
    }
  ];

  // Catégories
  const categories = [
    { id: 'tous', label: 'Tous les podcasts' },
    { id: 'science', label: 'Science' },
    { id: 'culture', label: 'Culture' },
    { id: 'tech', label: 'Technologie' },
    { id: 'cuisine', label: 'Cuisine' },
    { id: 'art', label: 'Art' },
    { id: 'aventure', label: 'Aventure' },
    { id: 'business', label: 'Business' },
    { id: 'santé', label: 'Santé' }
  ];

  // Filtrage des podcasts
  const filteredPodcasts = activeCategory === 'tous'
    ? podcasts
    : podcasts.filter(podcast => podcast.category === activeCategory);

  // Animation des vagues audio
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setAudioWave(prev => {
          const newWave = [...prev];
          if (newWave.length > 50) newWave.shift();
          newWave.push(Math.random() * 60 + 20);
          return newWave;
        });

        // Mise à jour des bandes d'égaliseur
        setEqualizerBands(prev => prev.map(band => {
          const change = Math.random() * 30 - 15;
          return Math.max(10, Math.min(90, band + change));
        }));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Animation du canvas (effet sonore)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Effet de particules sonores
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.3 + i) * 0.5 + 0.5) * canvas.height;
        const size = 2 + Math.sin(time + i) * (isPlaying ? 3 : 1);
        const alpha = isPlaying ? 0.3 : 0.1;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = playingPodcast
          ? `rgba(var(--color-${podcasts.find(p => p.id === playingPodcast)?.color || 'blue'}), ${alpha})`
          : `rgba(59, 130, 246, ${alpha})`;
        ctx.fill();
      }

      // Ondes concentriques
      if (isPlaying) {
        for (let i = 0; i < 5; i++) {
          const radius = (time * 20 + i * 40) % 300;
          const alpha = 0.1 - (radius / 300) * 0.1;

          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
          ctx.strokeStyle = playingPodcast
            ? `rgba(var(--color-${podcasts.find(p => p.id === playingPodcast)?.color || 'blue'}), ${alpha})`
            : `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      time += 0.02;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, playingPodcast]);

  // Dessin de la waveform
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (audioWave.length > 1) {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      audioWave.forEach((value, index) => {
        const x = (index / audioWave.length) * width;
        const y = height / 2 - (value - 40);

        ctx.lineTo(x, y);
      });

      ctx.strokeStyle = playingPodcast
        ? `rgb(var(--color-${podcasts.find(p => p.id === playingPodcast)?.color || 'blue'}))`
        : '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [audioWave, playingPodcast]);

  // Gestion de l'audio
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      setPlayingPodcast(null);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const handlePlay = (podcastId) => {
    const podcast = podcasts.find(p => p.id === podcastId);

    if (playingPodcast === podcastId) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setPlayingPodcast(podcastId);
      setIsPlaying(true);

      // Simuler le chargement audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = podcast.audioUrl;
          audioRef.current.playbackRate = playbackSpeed;
          audioRef.current.volume = volume / 100;
          audioRef.current.play();
        }
      }, 100);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const activePodcast = playingPodcast ? podcasts.find(p => p.id === playingPodcast) : null;

  // Composant Carte Podcast
  const PodcastCard = ({ podcast }) => {
    const isActive = playingPodcast === podcast.id;
    const isPlayingActive = isActive && isPlaying;

    return (
      <div
        className={`relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl border-2 ${isActive ? `border-${podcast.color}-500 scale-[1.02]` : 'border-transparent'
          }`}
      >
        {/* Header avec waveform */}
        <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-800">
          {/* Waveform */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-end h-16 space-x-1">
              {podcast.waveform.map((height, index) => (
                <div
                  key={index}
                  className={`w-2 rounded-full transition-all duration-300 ${isPlayingActive ? `bg-${podcast.color}-400` : `bg-${podcast.color}-300`
                    }`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className={`bg-${podcast.color}-600 text-white px-3 py-1.5 rounded-full text-sm font-bold`}>
              {podcast.category}
            </div>
            {podcast.featured && (
              <div className="bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm font-bold">
                ★ Populaire
              </div>
            )}
          </div>

          {/* Durée et écoutes */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            {podcast.duration}
          </div>
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              {podcast.listens}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Titre et animateur */}
          <div className="mb-4">
            <h3 className="text-md font-bold text-gray-900 mb-1 line-clamp-1">{podcast.title}</h3>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="truncate text-sm">{podcast.host}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{podcast.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {podcast.tags.map((tag, index) => (
              <span key={index} className={`px-3 py-1 bg-${podcast.color}-50 text-${podcast.color}-800 rounded-full text-xs`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Contrôle de lecture */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">{podcast.date}</div>
            <button
              onClick={() => handlePlay(podcast.id)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isPlayingActive
                  ? `bg-${podcast.color}-100 text-${podcast.color}-600`
                  : `bg-${podcast.color}-600 text-white hover:bg-${podcast.color}-700`
                }`}
            >
              {isPlayingActive ? (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-4 bg-current"></div>
                  <div className="w-1.5 h-4 bg-current"></div>
                </div>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className={`h-full bg-${podcast.color}-500 transition-all duration-300`}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  // Player principal
  const MainPlayer = () => {
    if (!activePodcast) return null;

    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-${activePodcast.color}-600 to-${activePodcast.color}-800 text-white z-50 transform transition-transform duration-300 ${isPlaying ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Infos podcast */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-2xl font-bold">🎙️</div>
              </div>
              <div>
                <div className="font-bold text-lg">{activePodcast.title}</div>
                <div className="text-sm opacity-90">{activePodcast.host}</div>
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center space-x-6">
              {/* Vitesse */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPlaybackSpeed(s => Math.max(0.5, s - 0.25))}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                >
                  -
                </button>
                <div className="text-sm font-mono">{playbackSpeed}x</div>
                <button
                  onClick={() => setPlaybackSpeed(s => Math.min(3.0, s + 0.25))}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                >
                  +
                </button>
              </div>

              {/* Timeline */}
              <div className="flex items-center space-x-4 flex-1 max-w-md">
                <div className="text-sm">{formatTime(currentTime)}</div>
                <div
                  className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-white"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm">{formatTime(duration)}</div>
              </div>

              {/* Contrôles principaux */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePlay(activePodcast.id)}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  {isPlaying ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-5 bg-current text-gray-900"></div>
                      <div className="w-2 h-5 bg-current text-gray-900"></div>
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-gray-900 border-b-[10px] border-b-transparent ml-1"></div>
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = Number(e.target.value);
                      setVolume(newVolume);
                      if (audioRef.current) {
                        audioRef.current.volume = newVolume / 100;
                      }
                    }}
                    className="w-24 accent-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Équaliseur visuel
  const VisualEqualizer = () => (
    <div className="flex items-end justify-center h-24 space-x-1 mb-8">
      {equalizerBands.map((height, index) => (
        <div
          key={index}
          className="w-3 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-100"
          style={{ height: `${height}%` }}
        ></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-white overflow-hidden">


      {/* Header audio */}
      <div className="relative pt-20 pb-16 px-4">
        <div
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'

        >
          <div
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
          />
          <img
            src="https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg"
            className='h-full object-cover w-full'
            alt="Background"
          />
        </div>
        <div className="relative pt-10 z-10 max-w-6xl mx-auto text-center">

          <h1 className="text-xl md:text-4xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Podcasts
          </h1>
          <p className="text-sm text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Écoutez, découvrez et inspirez-vous. Des conversations authentiques qui éclairent,
            passionnent et transforment.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-32">
        {/* Catégories */}
        <div className="mb-12">
          <div className="flex overflow-x-auto pb-4 space-x-3 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all duration-300 border ${activeCategory === category.id
                    ? 'bg-logo text-white text-sm border-white transform'
                    : 'bg-gray-200 text-gray-900 border-white/20 hover:border-white/40 '
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de podcasts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredPodcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>

        {/* Podcast en vedette */}
        {podcasts.find(p => p.id === 1) && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Colonne gauche : Infos */}
                <div className="p-8">
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-light text-sm">EN VEDETTE</span>
                  </div>

                  <h2 className="text-xl font-bold mb-4">{podcasts[0].title}</h2>
                  <p className="text-gray-300 mb-6 text-sm">{podcasts[0].description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Animateur</div>
                      <div className="font-bold">{podcasts[0].host}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Épisodes</div>
                      <div className="font-bold">{podcasts[0].episodes}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Durée moyenne</div>
                      <div className="font-bold">{podcasts[0].duration}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-sm opacity-80 mb-1">Écoutes</div>
                      <div className="font-bold">{podcasts[0].listens}</div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handlePlay(1)}
                      className="flex-1 bg-secondary-text text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      {playingPodcast === 1 && isPlaying ? (
                        <>
                          <div className="flex space-x-1 mr-3">
                            <div className="w-2 h-4 bg-white"></div>
                            <div className="w-2 h-4 bg-white"></div>
                          </div>
                          En écoute
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Écouter maintenant
                        </>
                      )}
                    </button>
                    <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                      Voir tous les épisodes
                    </button>
                  </div>
                </div>

                {/* Colonne droite : Invités */}
                <div className="p-8 bg-black/30">
                  <h4 className="font-bold text-xl mb-6">Derniers invités</h4>
                  <div className="space-y-4">
                    {podcasts[0].guests.map((guest, index) => (
                      <div key={index} className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                          <div className="text-lg">👤</div>
                        </div>
                        <div>
                          <div className="font-bold">{guest}</div>
                          <div className="text-sm text-gray-400">Expert invité</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-lg shadow-xl mb-16">
          {[
            { value: podcasts.length, label: "Podcasts actifs", color: "blue" },
            { value: "245+", label: "Heures de contenu", color: "cyan" },
            { value: "1.2M", label: "Écoutes totales", color: "green" },
            { value: "98%", label: "Satisfaction", color: "purple" }
          ].map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold mb-2 text-slate-900" >{stat.value}</div>
              <div className="text-gray-900">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section "Écouter aussi" */}
        <div className="mb-16 bg-white py-10 px-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Écouter aussi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {podcasts.slice(1, 4).map(podcast => (
              <div key={podcast.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-colors group">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${podcast.color}-500 rounded-xl flex items-center justify-center mr-4`}>
                    <div className="text-xl">🎙️</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{podcast.title}</div>
                    <div className="text-sm text-gray-700">{podcast.host}</div>
                  </div>
                </div>
                <p className="text-gray-800 text-sm mb-4 line-clamp-2">{podcast.description}</p>
                <button
                  onClick={() => handlePlay(podcast.id)}
                  className={`w-full bg-${podcast.color}-600 text-white py-3 rounded-xl hover:bg-${podcast.color}-700 transition-colors flex items-center justify-center`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Écouter
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-secondary-text"></div>
          <div className="relative z-10 p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Votre voix mérite d'être entendue
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Vous avez une histoire à raconter ? Lancez votre propre podcast
              avec notre studio professionnel et notre accompagnement sur mesure.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-slate-900 font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity">
                Créer mon podcast
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                Découvrir le studio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Player principal */}
      <MainPlayer />

      {/* Audio élément caché */}
      <audio ref={audioRef} style={{ display: 'none' }} />

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
        :root {
          --color-red: 239, 68, 68;
          --color-amber: 245, 158, 11;
          --color-blue: 59, 130, 246;
          --color-emerald: 16, 185, 129;
          --color-purple: 139, 92, 246;
          --color-cyan: 6, 182, 212;
          --color-indigo: 99, 102, 241;
          --color-pink: 236, 72, 153;
          --color-green: 34, 197, 94;
          --color-brown: 120, 53, 15;
        }
      `}</style>
    </div>
  );
};

export default PodcastsComponent;