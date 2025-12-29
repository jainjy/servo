import React, { useState, useEffect, useRef } from 'react';

const VideoCreationVisuelle = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [audioLevels, setAudioLevels] = useState([20, 45, 30, 60, 25, 50, 35, 40]);
  const [timeOfDay, setTimeOfDay] = useState(0);
  const [hoveredProject, setHoveredProject] = useState(null);
  const videoRefs = useRef({});
  const canvasRef = useRef(null);

  // Données des projets vidéo
  const projects = [
    {
      id: 1,
      title: "Volcans Éternels",
      category: "documentaire",
      client: "National Geographic",
      duration: "52 min",
      year: 2023,
      description: "Documentaire en 8K sur les volcans actifs de l'océan Indien, tourné sur 18 mois.",
      techniques: ["Drone FPV", "Slow motion", "Time-lapse", "Son binaural"],
      color: "red",
      featured: true,
      views: "2.4M",
      awards: ["Festival de Cannes", "Wildlife Film Festival"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-volcano-erupting-4159-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      team: ["Réalisateur: Marc Dubois", "DOP: Sophie Martin", "Monteur: Jean Petit"]
    },
    {
      id: 2,
      title: "Rythmes Créoles",
      category: "clip",
      client: "Kaf Maloya",
      duration: "4:32",
      year: 2024,
      description: "Clip musical mêlant danse traditionnelle et effets visuels génératifs.",
      techniques: ["Motion capture", "VFX", "Color grading", "Projection mapping"],
      color: "purple",
      featured: true,
      views: "5.7M",
      awards: ["MTV Music Awards"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-at-a-festival-39851-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
      team: ["Directeur artistique: Léa Chen", "Chorégraphe: Thomas Merle"]
    },
    {
      id: 3,
      title: "Architecture des Sens",
      category: "corporate",
      client: "LVMH",
      duration: "3:15",
      year: 2023,
      description: "Film institutionnel sur les parfums, tourné en macro et ultra slow motion.",
      techniques: ["Macro photography", "Phantom camera", "3D scanning", "Scent visualization"],
      color: "amber",
      featured: false,
      views: "890K",
      awards: ["Cannes Lions"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-perfume-bottle-spraying-4710-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1541643600914-78b084683601",
      team: ["Creative Director: Emma Laurent", "DOP: Robert Kim"]
    },
    {
      id: 4,
      title: "Silence Urbain",
      category: "expérimental",
      client: "Centre Pompidou",
      duration: "17:28",
      year: 2024,
      description: "Film expérimental explorant les sons cachés de la ville la nuit.",
      techniques: ["Binaural audio", "Infrared", "Long exposure", "Spatial audio"],
      color: "blue",
      featured: true,
      views: "320K",
      awards: ["Berlin Art Film Fest"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-3555-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
      team: ["Artist: David Park", "Sound designer: Maria Silva"]
    },
    {
      id: 5,
      title: "Mémoire du Lagon",
      category: "VR",
      client: "Musée Océanographique",
      duration: "25 min",
      year: 2023,
      description: "Expérience VR immersive dans les fonds marins de Mayotte.",
      techniques: ["360° video", "Spatial audio", "Haptic feedback", "Interactive elements"],
      color: "cyan",
      featured: false,
      views: "150K",
      awards: ["Sundance VR"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-a-school-of-fish-swimming-underwater-3111-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0",
      team: ["VR Director: Sam Lee", "Marine biologist: Dr. Marie Dubois"]
    },
    {
      id: 6,
      title: "Data Flow",
      category: "motion",
      client: "Google Creative Lab",
      duration: "2:30",
      year: 2024,
      description: "Animation data-driven visualisant les flux d'information mondiaux.",
      techniques: ["Data visualization", "Procedural animation", "Real-time rendering", "Particle systems"],
      color: "green",
      featured: true,
      views: "1.8M",
      awards: ["The FWA", "Awwwards"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-computer-data-screen-2468-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      team: ["Motion designer: Alex Rivera", "Data scientist: Sarah Johnson"]
    },
    {
      id: 7,
      title: "Couture Numérique",
      category: "fashion",
      client: "Chanel Métiers d'Art",
      duration: "8:45",
      year: 2023,
      description: "Film de mode intégrant tissage traditionnel et effets numériques.",
      techniques: ["Stop motion", "Digital embroidery", "Fabric simulation", "Augmented reality"],
      color: "pink",
      featured: false,
      views: "3.2M",
      awards: ["Vogue Film Festival"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-sewing-with-a-sewing-machine-41300-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1558769132-cb1f458e43b5",
      team: ["Fashion director: Claire Dubois", "VFX artist: Tom Chen"]
    },
    {
      id: 8,
      title: "Horizons Sonores",
      category: "installation",
      client: "Philharmonie de Paris",
      duration: "Loop",
      year: 2024,
      description: "Installation audiovisuelle générative pour le nouvel auditorium.",
      techniques: ["Generative visuals", "Reactive audio", "Projection mapping", "Interactive sensors"],
      color: "indigo",
      featured: true,
      views: "N/A",
      awards: ["Prix Ars Electronica"],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-geometric-shapes-rotating-3122-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      team: ["Media artist: Kenji Yamamoto", "Composer: Anna Schmidt"]
    }
  ];

  // Catégories
  const categories = [
    { id: 'tous', label: 'Tous les projets' },
    { id: 'documentaire', label: 'Documentaire' },
    { id: 'clip', label: 'Clip musical' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'expérimental', label: 'Expérimental' },
    { id: 'VR', label: 'Réalité virtuelle' },
    { id: 'motion', label: 'Motion design' },
    { id: 'fashion', label: 'Fashion film' },
    { id: 'installation', label: 'Installation' }
  ];

  // Équipements
  const equipments = [
    { name: "RED Komodo 6K", type: "Caméra", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" },
    { name: "DJI Inspire 3", type: "Drone", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
    { name: "Phantom Flex 4K", type: "Slow motion", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Unreal Engine 5", type: "3D/VFX", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { name: "Dolby Atmos", type: "Audio", icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728" },
    { name: "Oculus Quest 3", type: "VR", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" }
  ];

  // Filtrage des projets
  const filteredProjects = activeCategory === 'tous'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  // Animation des niveaux audio
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevels(prev => prev.map(level => {
        const change = Math.random() * 30 - 15;
        return Math.max(10, Math.min(90, level + change));
      }));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Animation du canvas (effet VHS/glitch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Effet de scanlines
      for (let y = 0; y < canvas.height; y += 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.02 + Math.sin(time + y * 0.1) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Effet de grain
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(x, y, size, size);
      }

      // Lignes de glitch occasionnelles
      if (Math.random() > 0.95) {
        const y = Math.random() * canvas.height;
        const height = 1 + Math.random() * 3;
        const offset = (Math.random() - 0.5) * 20;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, canvas.width, height);
        ctx.clip();
        ctx.translate(offset, 0);
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
      }

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Animation de la timeline
  useEffect(() => {
    const interval = setInterval(() => {
      setTimelineProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Gestion de la vidéo
  const handleVideoPlay = (id) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
      if (videoRefs.current[id]) {
        videoRefs.current[id].pause();
      }
    } else {
      setPlayingVideo(id);
      // Arrêter toutes les autres vidéos
      Object.keys(videoRefs.current).forEach(videoId => {
        if (videoId !== id.toString() && videoRefs.current[videoId]) {
          videoRefs.current[videoId].pause();
          videoRefs.current[videoId].currentTime = 0;
        }
      });
      if (videoRefs.current[id]) {
        videoRefs.current[id].play();
      }
    }
  };

  // Composant Project Card
  const ProjectCard = ({ project }) => {
    const isPlaying = playingVideo === project.id;
    const isHovered = hoveredProject === project.id;

    return (
      <div
        className={`relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group border-2 ${isPlaying ? 'border-white' : 'border-transparent'
          }`}
        onMouseEnter={() => setHoveredProject(project.id)}
        onMouseLeave={() => setHoveredProject(null)}
      >
        {/* Overlay de couleur */}
        <div className={`absolute inset-0 bg-gradient-to-t from-${project.color}-900/20 via-transparent to-transparent pointer-events-none`}></div>

        {/* Élément vidéo */}
        <div className="relative p-2 h-64 overflow-hidden">
          <video
            ref={el => videoRefs.current[project.id] = el}
            className="w-full h-full rounded-lg object-cover"
            src={project.videoUrl}
            muted
            loop
            playsInline
            poster={`${project.thumbnail}?auto=format&fit=crop&w=800&h=400&q=80`}
          />

          {/* Overlay de contrôle */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
            <button
              onClick={() => handleVideoPlay(project.id)}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${isPlaying ? 'bg-white/20' : 'bg-white'
                } backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110`}
            >
              {isPlaying ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-6 bg-white"></div>
                  <div className="w-2 h-6 bg-white"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-black border-b-[12px] border-b-transparent ml-1"></div>
              )}
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className={`bg-${project.color}-600 text-white px-3 py-1.5 rounded-full text-xs font-bold`}>
              {project.category}
            </div>
            {project.featured && (
              <div className="bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm font-bold">
                ★
              </div>
            )}
          </div>

          {/* Durée */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg">
            {project.duration}
          </div>

          {/* Timeline */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800">
            <div
              className={`h-full bg-${project.color}-500 transition-all duration-300`}
              style={{ width: isPlaying ? `${timelineProgress}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Titre et année */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-md font-bold text-white">{project.title}</h3>
            <div className="text-gray-400 text-md">{project.year}</div>
          </div>

          {/* Client et vues */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-300 text-xs">{project.client}</div>
            <div className="flex items-center text-xs text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {project.views}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-xs mb-6 line-clamp-2">{project.description}</p>

          {/* Techniques */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techniques.slice(0, 3).map((tech, index) => (
              <span key={index} className={`px-3 py-1 bg-${project.color}-900/30 text-${project.color}-300 rounded-full text-xs`}>
                {tech}
              </span>
            ))}
            {project.techniques.length > 3 && (
              <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                +{project.techniques.length - 3}
              </span>
            )}
          </div>

          {/* Équipe */}
          <div className="text-xs text-gray-500 mb-4">
            {project.team.slice(0, 2).map((member, index) => (
              <div key={index} className="truncate">{member}</div>
            ))}
          </div>

          {/* CTA */}
          <button className={`w-full bg-${project.color}-600 text-white font-medium py-3 rounded-xl hover:bg-${project.color}-700 transition-colors`}>
            Voir le projet complet
          </button>
        </div>

        {/* Effet de lumière au survol */}
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-tr from-${project.color}-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      </div>
    );
  };

  // Projet en vedette
  const featuredProject = projects.find(p => p.id === 1);

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Header avec effet cinématique */}
      <div
        className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'

      >
        <div
          className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
        />
        <img
          src="https://i.pinimg.com/1200x/4d/0a/9e/4d0a9e70871124f8efe9fe13bde42d0d.jpg"
          className='h-full object-cover w-full'
          alt="Background"
        />
      </div>
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">

        {/* Overlay de grain */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22256%22 height=%22256%22 filter=%22url(%23noise)%22 opacity=%220.05%22/%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 max-w-6xl pt-10 mx-auto text-center">

          <h1 className="text-xl md:text-4xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Vidéo & création visuelle
          </h1>
          <p className="text-sm text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Donnez vie à vos idées à travers la vidéo et la création visuelle.
            Des récits visuels puissants qui captivent et inspirent.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Projet vedette */}
        {featuredProject && (
          <div className="mb-16 bg-gray-50 shadow-xl overflow-hidden rounded-2xl">
            <div className={`relative overflow-hidden shadow-2xl`}>
              <div className="absolute inset-0">
                <video
                  className="w-full h-full object-cover opacity-40"
                  src={featuredProject.videoUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
                <div className={`absolute inset-0 bg-gradient-to-r from-${featuredProject.color}-900/90 via-${featuredProject.color}-900/70 to-transparent`}></div>
              </div>

              <div className="relative z-10 p-8 md:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="font-bold text-xs text-slate-900">PROJET VEDETTE</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">{featuredProject.title}</h2>
                    <p className="text-gray-800 mb-6 text-sm">{featuredProject.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <div className="text-sm text-gray-800">Client</div>
                        <div className="text-sm font-bold text-slate-900">{featuredProject.client}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-800">Durée</div>
                        <div className="text-sm font-bold text-slate-900">{featuredProject.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-800">Vues</div>
                        <div className="text-sm font-bold text-slate-900">{featuredProject.views}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-800">Année</div>
                        <div className="text-sm font-bold text-slate-900">{featuredProject.year}</div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button className={`bg-${featuredProject.color}-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-${featuredProject.color}-700 transition-colors`}>
                        Voir le projet
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm border border-slate-900 text-slate-900 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/30 transition-colors">
                        Bande-annonce
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h4 className="font-bold mb-4 text-lg">Récompenses</h4>
                      <div className="space-y-3">
                        {featuredProject.awards.map((award, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-5 h-5 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            </div>
                            <span className="text-gray-300 text-sm">{award}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="font-bold mb-3">Techniques utilisées</h4>
                        <div className="flex flex-wrap gap-2">
                          {featuredProject.techniques.map((tech, index) => (
                            <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="mb-12">
          <div className="flex overflow-x-auto pb-4 space-x-3 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 text-sm px-6 py-3 rounded-full font-medium transition-all duration-300 border ${activeCategory === category.id
                    ? 'bg-logo text-slate-100 border-white transform'
                    : 'bg-white/10 text-gray-900 border-white/20 hover:border-white/40 hover:text-salte-900'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Timeline de production */}
        <div className="mb-16 bg-white shadow-xl py-5 rounded-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Processus créatif</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-logo"></div>

            <div className="space-y-12">
              {[
                { step: "Concept", description: "Développement du concept créatif et storyboard", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
                { step: "Préproduction", description: "Scénario, casting, repérages et planification", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                { step: "Tournage", description: "Captation image et son avec équipement professionnel", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" },
                { step: "Postproduction", description: "Montage, étalonnage, sound design et effets visuels", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
                { step: "Livraison", description: "Adaptation aux formats et diffusion sur les plateformes", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
              ].map((step, index) => (
                <div key={index} className={`relative flex  items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2"></div>
                  <div className="absolute z-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-logo rounded-full border-4 border-white flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-12' : 'pl-12'}`}>
                    <div className="bg-logo backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-md font-bold mb-2">{step.step}</h3>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-secondary-text"></div>
          <div className="relative z-10 p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Votre projet mérite une histoire visuelle
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Discutons de votre vision créative. Notre équipe de professionnels
              est prête à donner vie à vos idées les plus ambitieuses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-slate-900 font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity">
                Parler de mon projet
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                Voir notre showreel
              </button>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
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

export default VideoCreationVisuelle;