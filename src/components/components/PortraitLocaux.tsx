import React, { useState, useEffect, useRef, useMemo } from 'react';
import TourismNavigation from '../TourismNavigation';

const PortraitsLocaux = () => {
  const [activeGeneration, setActiveGeneration] = useState('tous');
  const [selectedPortrait, setSelectedPortrait] = useState(null);
  const [playingStory, setPlayingStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [socialShares, setSocialShares] = useState({});
  
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const storyRef = useRef(null);

  // Données des portraits
  const portraits = [
    {
      id: 1,
      name: "Mamie Marie-Claire",
      age: 94,
      generation: "anciens",
      location: "Salazie",
      profession: "Tisserande traditionnelle",
      story: "Née en 1930, elle a vu l'île se transformer tout en préservant l'art du tissage vacoa transmis par sa grand-mère.",
      quote: "Chaque feuille de vacoa raconte une histoire. Mes mains ont tissé la mémoire de cette île.",
      color: "amber",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1584302179602-e76e20f6e19e",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        "https://images.unsplash.com/photo-1597212617258-7f2d6f282e4c"
      ],
      interview: {
        duration: "24:15",
        topics: ["Traditions", "Mémoire", "Transmission"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-ethnic-deep-african-168.mp3"
      },
      socialMedia: {
        instagram: "mamie_marieclaire",
        facebook: "MamieMarieClaireReunion",
        youtube: "@MamieReunion"
      },
      wisdom: [
        "La patience est la mère de toutes les vertus",
        "Un homme sans mémoire est comme un arbre sans racines",
        "Le savoir-faire se transmet par le cœur, pas seulement par les mains"
      ]
    },
    {
      id: 2,
      name: "Papa Jacques",
      age: 87,
      generation: "anciens",
      location: "Saint-Paul",
      profession: "Pêcheur traditionnel",
      story: "Depuis 70 ans, il lit la mer comme un livre ouvert. Dernier détenteur des techniques de pêche au filet volant.",
      quote: "La mer ne ment jamais. Elle te donne ce que tu mérites.",
      color: "blue",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        "https://images.unsplash.com/photo-1557862925-8d5d0902e5f7",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a"
      ],
      interview: {
        duration: "18:30",
        topics: ["Mer", "Transmission", "Écologie"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-deep-sea-ambience-169.mp3"
      },
      socialMedia: {
        instagram: "papa_jacques_pecheur",
        facebook: "PapaJacquesPecheur",
        youtube: "@PecheTraditionnelle"
      },
      wisdom: [
        "Respecte la mer et elle te nourrira",
        "Un bon pêcheur écoute avant de parler",
        "Les poissons viennent à ceux qui patientent"
      ]
    },
    {
      id: 3,
      name: "Tante Lucie",
      age: 82,
      generation: "anciens",
      location: "Saint-Denis",
      profession: "Guérisseuse traditionnelle",
      story: "Détentrice des savoirs sur les plantes médicinales endémiques. Elle soigne avec les herbes depuis 60 ans.",
      quote: "Chaque maladie a son herbe, chaque herbe a son secret.",
      color: "emerald",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
        "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8",
        "https://images.unsplash.com/photo-1584302179595-b7e6a8c5f9c6"
      ],
      interview: {
        duration: "32:45",
        topics: ["Médecine traditionnelle", "Plantes", "Spiritualité"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-meditation-ambience-169.mp3"
      },
      socialMedia: {
        instagram: "tante_lucie_herboriste",
        facebook: "TanteLucieHerboristerie",
        youtube: "@MedecineTraditionnelle"
      },
      wisdom: [
        "La nature sait guérir, il faut juste savoir écouter",
        "Une plante soigne, plusieurs plantes guérissent",
        "Le remède est souvent dans le jardin"
      ]
    },
    {
      id: 4,
      name: "Marie-Ange",
      age: 42,
      generation: "actuels",
      location: "Saint-Pierre",
      profession: "Agricultrice bio",
      story: "Ingénieure agronome revenue à la terre familiale pour développer l'agriculture durable et les circuits courts.",
      quote: "Notre terre nous nourrit, à nous de la nourrir en retour.",
      color: "green",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c",
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
      ],
      interview: {
        duration: "28:20",
        topics: ["Agriculture durable", "Innovation", "Transmission"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-cooking-show-125.mp3"
      },
      socialMedia: {
        instagram: "marieange_agricultrice",
        facebook: "MarieAngeAgricultureBio",
        youtube: "@AgricultureDurableReunion"
      },
      wisdom: [
        "Une graine plantée avec amour donne toujours des fruits",
        "L'innovation doit respecter la tradition",
        "Manger local, c'est préserver notre avenir"
      ]
    },
    {
      id: 5,
      name: "Jean-Marc",
      age: 35,
      generation: "actuels",
      location: "Saint-Gilles",
      profession: "Surf instructor & artisan",
      story: "Ancien champion de surf reconverti dans la fabrication de planches en bois local et la transmission aux jeunes.",
      quote: "La vague parfaite n'existe pas, c'est le surfeur qui la crée.",
      color: "cyan",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4",
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f"
      ],
      interview: {
        duration: "21:15",
        topics: ["Sport", "Artisanat", "Jeunesse"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-urban-style-125.mp3"
      },
      socialMedia: {
        instagram: "jeanmarc_surfboards",
        facebook: "JeanMarcSurfArtisan",
        youtube: "@SurfTraditionReunion"
      },
      wisdom: [
        "Une planche c'est comme un partenaire de danse",
        "Respecter l'océan, c'est se respecter soi-même",
        "La meilleure vague est celle que tu partages"
      ]
    },
    {
      id: 6,
      name: "Fatou",
      age: 28,
      generation: "jeunes",
      location: "Saint-Benoît",
      profession: "Artiste numérique",
      story: "Diplômée des Beaux-Arts, elle fusionne art traditionnel et technologies pour créer une nouvelle identité visuelle réunionnaise.",
      quote: "Nos racines sont notre force, la technologie notre aile.",
      color: "purple",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b786",
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      ],
      interview: {
        duration: "26:40",
        topics: ["Art numérique", "Identité", "Innovation"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
      },
      socialMedia: {
        instagram: "fatou_digitalart",
        facebook: "FatouArtNumerique",
        youtube: "@ArtNumeriqueReunion"
      },
      wisdom: [
        "L'art doit parler à son époque",
        "La tradition n'est pas un musée, c'est une source",
        "Chaque pixel peut raconter une histoire"
      ]
    },
    {
      id: 7,
      name: "Kévin",
      age: 24,
      generation: "jeunes",
      location: "Le Tampon",
      profession: "DJ & producteur",
      story: "Il réinvente le maloya traditionnel en le fusionnant avec des sonorités électroniques pour toucher les nouvelles générations.",
      quote: "Le maloya bat dans mon cœur, l'électro dans mes veines.",
      color: "pink",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      ],
      interview: {
        duration: "19:55",
        topics: ["Musique", "Fusion", "Jeunesse"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
      },
      socialMedia: {
        instagram: "kevin_dj_reunion",
        facebook: "KevinDJReunion",
        youtube: "@MaloyaElectro"
      },
      wisdom: [
        "La musique unit les générations",
        "Innovation sans tradition, c'est comme un arbre sans racines",
        "Le rythme, c'est le cœur qui parle"
      ]
    },
    {
      id: 8,
      name: "Sarah",
      age: 31,
      generation: "actuels",
      location: "Cilaos",
      profession: "Guide de montagne",
      story: "Première femme guide certifiée des cirques, elle fait découvrir les secrets des montagnes réunionnaises avec passion.",
      quote: "La montagne ne se conquiert pas, elle se découvre.",
      color: "red",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786"
      ],
      interview: {
        duration: "35:10",
        topics: ["Montagne", "Féminisme", "Écologie"],
        audio: "https://assets.mixkit.co/music/preview/mixkit-ethnic-deep-african-168.mp3"
      },
      socialMedia: {
        instagram: "sarah_guide_montagne",
        facebook: "SarahGuideMontagne",
        youtube: "@MontagnesReunion"
      },
      wisdom: [
        "Chaque sommet a une histoire à raconter",
        "Respecter la nature, c'est se respecter",
        "Le plus beau chemin est souvent le plus difficile"
      ]
    }
  ];

  // Générations
  const generations = [
    { id: 'tous', label: 'Toutes les générations' },
    { id: 'anciens', label: 'Anciens (70+ ans)' },
    { id: 'actuels', label: 'Actuels (30-69 ans)' },
    { id: 'jeunes', label: 'Jeunes (18-29 ans)' }
  ];

  // Filtrage des portraits
  const filteredPortraits = activeGeneration === 'tous'
    ? portraits
    : portraits.filter(portrait => portrait.generation === activeGeneration);

  // Citation du jour : choisir un index fixe au montage
  const dailyQuoteIndex = useMemo(() => Math.floor(Math.random() * portraits.length), []);
  const [quoteRotation, setQuoteRotation] = useState(0);

  // Lente animation de la marque de citation (rotation subtile)
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteRotation(prev => (prev + 2) % 360);
    }, 3000); // toutes les 3s
    return () => clearInterval(interval);
  }, []);

  // Animation du canvas (effet de texture)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Effet de texture papier vieilli
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 1 + Math.random() * 3;
        const alpha = 0.05 + Math.sin(time + i) * 0.03;

        ctx.fillStyle = `rgba(120, 53, 15, ${alpha})`;
        ctx.fillRect(x, y, size, size);
      }

      // Lignes organiques (comme des rides/empreintes)
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const y = canvas.height * 0.2 + i * 40;
        const frequency = 0.01 + i * 0.005;
        const amplitude = 10 + i * 3;

        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 5) {
          const waveY = y + Math.sin(x * frequency + time) * amplitude;
          ctx.lineTo(x, waveY);
        }
      }
      ctx.strokeStyle = `rgba(139, 195, 74, 0.1)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      time += 0.02;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Gestion de l'audio
  const handleStoryPlay = (portraitId) => {
    const portrait = portraits.find(p => p.id === portraitId);

    if (playingStory === portraitId) {
      if (isListening) {
        audioRef.current.pause();
        setIsListening(false);
      } else {
        audioRef.current.play();
        setIsListening(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setPlayingStory(portraitId);
      setIsListening(true);

      // Simuler le chargement
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = portrait.interview.audio;
          audioRef.current.play();
        }
      }, 100);
    }
  };

  // Animation de la progression de l'histoire
  useEffect(() => {
    const interval = setInterval(() => {
      if (isListening && storyProgress < 100) {
        setStoryProgress(prev => prev + 0.5);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isListening]);

  // Gestion des partages sociaux
  const handleSocialShare = (platform, portraitId) => {
    const portrait = portraits.find(p => p.id === portraitId);
    setSocialShares(prev => ({
      ...prev,
      [portraitId]: {
        ...prev[portraitId],
        [platform]: (prev[portraitId]?.[platform] || 0) + 1
      }
    }));

    // Message de partage
    const message = `Découvrez l'histoire inspirante de ${portrait.name}, ${portrait.age} ans, ${portrait.profession} à ${portrait.location}. #PortraitsLocaux #Réunion`;

    // Simuler l'ouverture du partage (en vrai, ce serait window.open)
    console.log(`Partage sur ${platform}: ${message}`);
  };

  // Composant Carte Portrait
  const PortraitCard = ({ portrait }) => {
    const isSelected = selectedPortrait === portrait.id;
    const isListeningStory = playingStory === portrait.id && isListening;
    const shares = socialShares[portrait.id] || {};

    return (
      <div
        className={`relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl border-2 ${isSelected ? `border-${portrait.color}-500 scale-[1.02]` : 'border-transparent'
          }`}
        onClick={() => setSelectedPortrait(portrait.id)}
      >
        {/* Photo principale */}
        <div className="relative h-64 p-2 overflow-hidden">
          <img
            src={`${portrait.images[0]}?auto=format&fit=crop&w=800&h=400&q=80`}
            alt={portrait.name}
            className="w-full rounded-sm h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay gradient */}
          <div className={`absolute m-2 rounded-sm inset-0 bg-gradient-to-t from-${portrait.color}-900/60 via-transparent to-transparent`}></div>

          {/* Badge d'âge et génération */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <div className={`bg-${portrait.color}-600 text-white px-3 py-1.5 rounded-full text-xs font-bold`}>
              {portrait.age} ans
            </div>
            <div className="bg-black/60 backdrop-blur-sm text-xs text-white px-3 py-1.5 rounded-lg">
              {portrait.generation === 'anciens' ? 'Ancien' :
                portrait.generation === 'actuels' ? 'Actuel' : 'Jeune'}
            </div>
          </div>

          {/* Badge vedette */}
          {portrait.featured && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold">
              ★ Histoire marquante
            </div>
          )}

          {/* Localisation */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            <div className="flex items-center text-xs">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {portrait.location}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Nom et profession */}
          <div className="mb-4">
            <h3 className="text-md font-bold text-gray-900 mb-1">{portrait.name}</h3>
            <div className={`text-${portrait.color}-600 text-sm font-semibold`}>{portrait.profession}</div>
          </div>

          {/* Citation */}
          <div className="mb-6 relative">
            <div className="absolute -left-2 top-0 text-3xl text-gray-300">"</div>
            <p className="text-gray-700 italic text-xs pl-6">{portrait.quote}</p>
            <div className="absolute -right-2 bottom-0 text-3xl text-gray-300">"</div>
          </div>

          {/* Histoire courte */}
          <p className="text-gray-600 text-xs mb-6 line-clamp-2">{portrait.story}</p>

          {/* Topics de l'interview */}
          <div className="flex flex-wrap gap-2 mb-6">
            {portrait.interview.topics.map((topic, index) => (
              <span key={index} className={`px-3 py-1 bg-${portrait.color}-50 text-${portrait.color}-800 rounded-full text-xs`}>
                {topic}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStoryPlay(portrait.id);
              }}
              className={`flex items-center px-4 py-2 rounded-lg ${isListeningStory
                ? `bg-${portrait.color}-100 text-${portrait.color}-800`
                : `bg-${portrait.color}-600 text-white hover:bg-${portrait.color}-700`
                }`}
            >
              {isListeningStory ? (
                <>
                  <div className="flex space-x-1 mr-2">
                    <div className="w-1 h-3 bg-current"></div>
                    <div className="w-1 h-3 bg-current"></div>
                  </div>
                  En écoute
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Écouter son histoire
                </>
              )}
            </button>

            <div className="text-sm text-gray-500">
              {portrait.interview.duration}
            </div>
          </div>
        </div>

        {/* Barre de progression audio */}
        {isListeningStory && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className={`h-full bg-${portrait.color}-500 transition-all duration-300`}
              style={{ width: `${storyProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  // Composant Partage Social
  const SocialShareButtons = ({ portrait }) => {
    const shares = socialShares[portrait.id] || {};

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4">Partager cette histoire</h4>
        <div className="grid grid-cols-3 gap-3">
          {/* Instagram */}
          <button
            onClick={() => handleSocialShare('instagram', portrait.id)}
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
          >
            <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="text-sm">Instagram</span>
            <span className="text-xs opacity-80">{shares.instagram || 0}</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleSocialShare('facebook', portrait.id)}
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:opacity-90 transition-opacity"
          >
            <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-sm">Facebook</span>
            <span className="text-xs opacity-80">{shares.facebook || 0}</span>
          </button>

          {/* YouTube */}
          <button
            onClick={() => handleSocialShare('youtube', portrait.id)}
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white hover:opacity-90 transition-opacity"
          >
            <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-sm">YouTube</span>
            <span className="text-xs opacity-80">{shares.youtube || 0}</span>
          </button>
        </div>

        {/* Liens sociaux de la personne */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h5 className="font-bold text-gray-900 mb-3">Suivre {portrait.name.split(' ')[0]}</h5>
          <div className="flex flex-wrap gap-2">
            {Object.entries(portrait.socialMedia).map(([platform, handle]) => (
              <a
                key={platform}
                href="#"
                className={`px-3 py-1.5 rounded-lg text-sm ${platform === 'instagram' ? 'bg-pink-50 text-pink-700' :
                  platform === 'facebook' ? 'bg-blue-50 text-blue-700' :
                    'bg-red-50 text-red-700'
                  }`}
              >
                @{String(handle)}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Portrait sélectionné en détail
  const selectedPortraitData = portraits.find(p => p.id === selectedPortrait);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Header avec effet de texture */}
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 h-64 -z-10 w-full overflow-hidden">
          <div className="absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70" />
          <img
            src="https://i.pinimg.com/1200x/d5/99/51/d59951aaef774bfb6c704069ce42a3bc.jpg"
            className="h-full object-cover w-full"
            alt="Background"
          />
        </div>
        {/* Overlay de particules */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-xl md:text-4xl font-bold text-gray-100 mb-6 tracking-tight">
            Portraits locaux
          </h1>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Découvrez les visages et histoires des habitants locaux. Des
            rencontres authentiques qui tissent la mémoire vivante de notre île.
          </p>
          <TourismNavigation page="inspirer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Filtres par génération */}
        <div className="mb-12">
          <div className="flex justify-center space-x-4">
            {generations.map((generation) => (
              <button
                key={generation.id}
                onClick={() => setActiveGeneration(generation.id)}
                className={`px-6 py-3 text-xs rounded-full font-medium transition-all duration-300 border ${
                  activeGeneration === generation.id
                    ? "bg-secondary-text text-white  transform scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:text-emerald-700"
                }`}
              >
                {generation.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des portraits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredPortraits.map((portrait) => (
            <PortraitCard key={portrait.id} portrait={portrait} />
          ))}
        </div>

        {/* Section détaillée du portrait sélectionné */}
        {selectedPortraitData && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-200">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Colonne gauche : Photos et informations */}
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedPortraitData.name}
                      </h2>
                      <div
                        className={`text-xl font-semibold text-${selectedPortraitData.color}-600`}
                      >
                        {selectedPortraitData.age} ans •{" "}
                        {selectedPortraitData.profession} •{" "}
                        {selectedPortraitData.location}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPortrait(null)}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Galerie de photos */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {selectedPortraitData.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-xl aspect-square"
                      >
                        <img
                          src={`${img}?auto=format&fit=crop&w=400&h=400&q=80`}
                          alt={`${selectedPortraitData.name} - Photo ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Histoire complète */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Son histoire
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPortraitData.story}
                    </p>
                  </div>

                  {/* Interview */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">
                        Interview audio
                      </h4>
                      <div className="text-gray-600">
                        {selectedPortraitData.interview.duration}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleStoryPlay(selectedPortraitData.id)}
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          playingStory === selectedPortraitData.id &&
                          isListening
                            ? `bg-${selectedPortraitData.color}-100 text-${selectedPortraitData.color}-600`
                            : `bg-${selectedPortraitData.color}-600 text-white hover:bg-${selectedPortraitData.color}-700`
                        }`}
                      >
                        {playingStory === selectedPortraitData.id &&
                        isListening ? (
                          <div className="flex space-x-1">
                            <div className="w-2 h-5 bg-current"></div>
                            <div className="w-2 h-5 bg-current"></div>
                          </div>
                        ) : (
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">
                          Sujets abordés
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedPortraitData.interview.topics.map(
                            (topic, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 bg-${selectedPortraitData.color}-100 text-${selectedPortraitData.color}-800 rounded-full text-sm`}
                              >
                                {topic}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    {playingStory === selectedPortraitData.id && (
                      <div className="mt-6">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${selectedPortraitData.color}-500 transition-all duration-300`}
                            style={{ width: `${storyProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sagesse */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">
                      Sagesse transmise
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedPortraitData.wisdom.map((wisdom, index) => (
                        <div
                          key={index}
                          className={`bg-${selectedPortraitData.color}-50 rounded-xl p-4 border border-${selectedPortraitData.color}-200`}
                        >
                          <div className="text-lg mb-2">"</div>
                          <p className="text-gray-700 italic">{wisdom}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colonne droite : Partage et réseaux sociaux */}
                <div className="p-8 bg-gray-50">
                  <SocialShareButtons portrait={selectedPortraitData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques des générations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Les générations réunionnaises
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                generation: "Anciens",
                count: portraits.filter((p) => p.generation === "anciens")
                  .length,
                description:
                  "Porteurs de la mémoire et des traditions ancestrales",
                color: "amber",
                icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
              },
              {
                generation: "Actuels",
                count: portraits.filter((p) => p.generation === "actuels")
                  .length,
                description: "Acteurs du présent, bâtisseurs du futur",
                color: "emerald",
                icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6 M9 17l2 2 4-4",
              },
              {
                generation: "Jeunes",
                count: portraits.filter((p) => p.generation === "jeunes")
                  .length,
                description:
                  "Visionnaires qui réinventent l'identité réunionnaise",
                color: "purple",
                icon: "M12 14l9-5-9-5-9 5 9 5z M12 14v6 M5 13.999v5 M19 13.999v5",
              },
            ].map((gen, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={` w-10 h-10 bg-${gen.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <svg
                      className={`w-5 h-5 text-${gen.color}-600`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={gen.icon}
                      />
                    </svg>
                  </div>
                  <div className="flex-1 flex gap-4 items-start ml-4">
                    <div className="text-xl font-bold text-gray-900 mb-2">
                      {gen.count}
                    </div>
                    <div
                      className={`text-xl font-bold text-${gen.color}-600 mb-3`}
                    >
                      {gen.generation}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{gen.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section citation du jour */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-12 text-white text-center">
            <div
              className="text-5xl mb-6"
              style={{
                transform: `rotate(${quoteRotation}deg)`,
                transition: "transform 1s ease-in-out",
              }}
            >
              "
            </div>
            <div className="text-2xl italic mb-8 max-w-3xl mx-auto">
              {portraits[dailyQuoteIndex].quote}
            </div>
            <div className="text-emerald-200">
              — {portraits[dailyQuoteIndex].name},{" "}
              {portraits[dailyQuoteIndex].age} ans
            </div>
          </div>
        </div>


      </div>

      {/* Élément audio caché */}
      <audio ref={audioRef} style={{ display: "none" }} />

      <style>{`
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

export default PortraitsLocaux;