import React, { useState, useEffect, useRef } from 'react';

const ArtistesCreateurs = () => {
  const [activeArtist, setActiveArtist] = useState(0);
  const [hoveredWork, setHoveredWork] = useState(null);
  const [galleryView, setGalleryView] = useState('grid');
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  // Données des artistes
  const artists = [
    {
      id: 1,
      name: "Sophie Lenoir",
      discipline: "Peinture acrylique",
      location: "Saint-Denis, Réunion",
      description: "Artiste contemporaine explorant la relation entre les éléments naturels et la mémoire collective.",
      style: "Abstrait organique",
      years: "12 ans",
      works: [
        { id: 1, title: "Mémoire du volcan", year: 2023, medium: "Acrylique sur toile", size: "120x180cm", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262" },
        { id: 2, title: "Racines créoles", year: 2022, medium: "Mixte sur bois", size: "90x90cm", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9" },
        { id: 3, title: "Lagon intérieur", year: 2024, medium: "Résine et pigments", size: "100x150cm", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5" }
      ],
      color: "rose",
      inspiration: "Nature, mémoire, identité",
      exhibitions: ["Biennale de Lyon 2022", "Galerie du Volcan 2023"],
      audio: null
    },
    {
      id: 2,
      name: "Jean-Michel Tamarin",
      discipline: "Sculpture métal",
      location: "Saint-Pierre, Réunion",
      description: "Sculpteur transformant des matériaux industriels en formes organiques inspirées de la faune marine.",
      style: "Sculpture contemporaine",
      years: "18 ans",
      works: [
        { id: 4, title: "Migration des raies", year: 2023, medium: "Acier inoxydable", size: "200x300x150cm", image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd" },
        { id: 5, title: "Écailles du lagon", year: 2022, medium: "Cuivre patiné", size: "80x120x60cm", image: "https://images.unsplash.com/photo-1580993769601-8d9d1af67aa0" },
        { id: 6, title: "Courant marin", year: 2024, medium: "Aluminium poli", size: "150x250x100cm", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b" }
      ],
      color: "amber",
      inspiration: "Faune marine, mouvement, lumière",
      exhibitions: ["FIAC Paris 2021", "Musée des Arts Décoratifs"],
      audio: null
    },
    {
      id: 3,
      name: "Léa Chen",
      discipline: "Photographie",
      location: "Hell-Bourg, Réunion",
      description: "Photographe capturant les paysages mystiques des cirques à travers des techniques de pose longue.",
      style: "Photographie contemplative",
      years: "8 ans",
      works: [
        { id: 7, title: "Brouillard matinal", year: 2023, medium: "Tirage argentique", size: "80x120cm", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4" },
        { id: 8, title: "Silhouettes dans la brume", year: 2022, medium: "Tirage jet d'encre", size: "100x150cm", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" },
        { id: 9, title: "Couleurs du cirque", year: 2024, medium: "Tirage sur aluminium", size: "90x135cm", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" }
      ],
      color: "cyan",
      inspiration: "Brumes, montagnes, temporalité",
      exhibitions: ["Rencontres d'Arles 2023", "Galerie 127 Marrakech"],
      audio: "https://assets.mixkit.co/music/preview/mixkit-ethereal-futuristic-insight-307.mp3"
    },
    {
      id: 4,
      name: "Toussaint Merle",
      discipline: "Art numérique",
      location: "Saint-Gilles, Réunion",
      description: "Pionnier de l'art génératif dans l'océan Indien, créant des œuvres algorithmiques inspirées des vagues.",
      style: "Art génératif",
      years: "6 ans",
      works: [
        { id: 10, title: "Algorithmes marins", year: 2023, medium: "Écran LED", size: "Variable", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176" },
        { id: 11, title: "Données océanes", year: 2022, medium: "Projection interactive", size: "Site spécifique", image: "https://images.unsplash.com/photo-1531685250784-7569952593d2" },
        { id: 12, title: "Rythmes du lagon", year: 2024, medium: "NFT génératif", size: "2560x1440px", image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031" }
      ],
      color: "purple",
      inspiration: "Algorithmes, vagues, données",
      exhibitions: ["Art Basel Miami 2022", "Centre Pompidou"],
      audio: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
    },
    {
      id: 5,
      name: "Fatima Ben",
      discipline: "Textile art",
      location: "Salazie, Réunion",
      description: "Tisseuse contemporaine réinterprétant les techniques traditionnelles avec des fibres végétales locales.",
      style: "Art textile contemporain",
      years: "15 ans",
      works: [
        { id: 13, title: "Tissage de mémoire", year: 2023, medium: "Fibres de vacoa", size: "200x300cm", image: "https://images.unsplash.com/photo-1605001011156-cbf0a0b7a88f" },
        { id: 14, title: "Champ de cannes", year: 2022, medium: "Lin et pigments", size: "150x220cm", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b" },
        { id: 15, title: "Murmures végétaux", year: 2024, medium: "Soie sauvage", size: "180x240cm", image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df" }
      ],
      color: "emerald",
      inspiration: "Fibres locales, traditions, terre",
      exhibitions: ["Musée du Quai Branly", "Triennale de Milan"],
      audio: null
    },
    {
      id: 6,
      name: "Marcus Rivera",
      discipline: "Street art",
      location: "Saint-Paul, Réunion",
      description: "Artiste urbain transformant les murs en récits visuels mêlant culture créole et symboles universels.",
      style: "Muralisme narratif",
      years: "10 ans",
      works: [
        { id: 16, title: "Ancêtres du lagon", year: 2023, medium: "Peinture murale", size: "8x15m", image: "https://images.unsplash.com/photo-1542744095-291d1f67b221" },
        { id: 17, title: "Rêves créoles", year: 2022, medium: "Aérosol et pochoir", size: "6x10m", image: "https://images.unsplash.com/photo-1543857778-c4a1a569e388" },
        { id: 18, title: "Échos urbains", year: 2024, medium: "Fresque collaborative", size: "12x20m", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0" }
      ],
      color: "orange",
      inspiration: "Rues, histoire, communauté",
      exhibitions: ["Miami Art Week", "Urban Art Fair Paris"],
      audio: "https://assets.mixkit.co/music/preview/mixkit-urban-style-125.mp3"
    }
  ];

  // Éléments visuels flottants
  const floatingShapes = [
    { type: 'circle', color: 'rose', size: 40, x: 10, y: 20 },
    { type: 'square', color: 'amber', size: 30, x: 85, y: 10 },
    { type: 'triangle', color: 'cyan', size: 35, x: 15, y: 70 },
    { type: 'circle', color: 'purple', size: 25, x: 90, y: 60 }
  ];

  // Animation du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Points connectés
      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100;
      const points = 8;

      for (let i = 0; i < points; i++) {
        const angle1 = (i / points) * Math.PI * 2 + time;
        const angle2 = ((i + 1) / points) * Math.PI * 2 + time;

        const x1 = centerX + Math.cos(angle1) * radius;
        const y1 = centerY + Math.sin(angle1) * radius;
        const x2 = centerX + Math.cos(angle2) * radius;
        const y2 = centerY + Math.sin(angle2) * radius;

        // Ligne principale
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${activeArtist === 0 ? '244, 114, 182' : activeArtist === 1 ? '251, 191, 36' : activeArtist === 2 ? '34, 211, 238' : '167, 139, 250'}, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Points
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${activeArtist === 0 ? '244, 114, 182' : activeArtist === 1 ? '251, 191, 36' : activeArtist === 2 ? '34, 211, 238' : '167, 139, 250'})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeArtist]);

  const activeArtistData = artists[activeArtist];

  // Composant Work Card
  const WorkCard = ({ work, artistColor }) => {
    const colorMap = {
      rose: 'bg-rose-50 border-rose-200 text-rose-800',
      amber: 'bg-amber-50 border-amber-200 text-amber-800',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800'
    };

    return (
      <div
        className={`relative overflow-hidden rounded-2xl border-2 ${colorMap[artistColor]} transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-xl`}
        onMouseEnter={() => setHoveredWork(work.id)}
        onMouseLeave={() => setHoveredWork(null)}
      >
        {/* Image */}
        <div className="aspect-square p-2 overflow-hidden">
          <img
            src={`${work.image}?auto=format&fit=crop&w=800&h=800&q=80`}
            alt={work.title}
            className="w-full rounded-sm h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>

        {/* Overlay au survol */}
        {hoveredWork === work.id && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
            <div className="text-white text-center p-6">
              <div className="text-2xl font-bold mb-2">{work.title}</div>
              <div className="text-sm opacity-90">{work.year} • {work.medium}</div>
              <div className="text-sm opacity-80 mt-2">{work.size}</div>
            </div>
          </div>
        )}

        {/* Infos basiques */}
        <div className="p-4">
          <h4 className="font-bold text-gray-900 truncate">{work.title}</h4>
          <div className="text-sm text-gray-600 mt-1">{work.year}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'
        >
          <div
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
          />
          <img
            src="https://i.pinimg.com/736x/10/3d/0e/103d0ef9248784b2285e94d2382743d2.jpg"
            className='h-full object-cover w-full'
            alt="Background"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto pt-10 text-center">
          <h1 className="text-xl md:text-4xl font-light text-gray-100 mb-6 tracking-tight">
            Artistes & créateurs
          </h1>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Rencontrez des artistes et explorez leur univers créatif. Découvrez des talents locaux et leurs œuvres uniques.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Navigation des artistes */}
        <div className="mb-12 pt-5">
          <div className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar">
            {artists.map((artist, index) => (
              <button
                key={artist.id}
                onClick={() => setActiveArtist(index)}
                className={`flex-shrink-0 px-8 py-4 rounded-2xl border-2 transition-all duration-500 ${activeArtist === index
                  ? `border-${artist.color}-500 bg-${artist.color}-50 text-gray-900 scale-105`
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
              >
                <div className="text-left">
                  <div className="font-bold text-sm">{artist.name}</div>
                  <div className="text-sm text-gray-500">{artist.discipline}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 mb-12">
          {/* Colonne gauche - Présentation de l'artiste */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              {/* Header de l'artiste */}
              <div className={`bg-logo p-4 text-white`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-md font-bold mb-2">{activeArtistData.name}</h2>
                    <div className="flex items-center space-x-4">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                        {activeArtistData.discipline}
                      </span>
                      <span className="flex text-xs items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {activeArtistData.location}
                      </span>
                    </div>
                  </div>
                  <div className=" flex items-center gap-2">
                    <div className="text-xl font-extralight">{activeArtistData.years} d'expérience</div>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <p className="text-gray-700 text-md leading-relaxed mb-8">
                  {activeArtistData.description}
                </p>

                {/* Informations */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Style</div>
                    <div className="font-bold text-xs text-gray-900">{activeArtistData.style}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Inspiration</div>
                    <div className="font-bold text-xs text-gray-900 truncate">{activeArtistData.inspiration}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Expositions</div>
                    <div className="font-bold text-xs text-gray-900">{activeArtistData.exhibitions.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Discipline</div>
                    <div className="font-bold text-xs text-gray-900">{activeArtistData.discipline}</div>
                  </div>
                </div>

                {/* Expositions notables */}
                <div className="mb-4">
                  <h3 className="font-bold text-sm text-gray-900 mb-4">Expositions notables</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeArtistData.exhibitions.map((expo, index) => (
                      <span key={index} className={`px-4 py-2 bg-${activeArtistData.color}-50 text-${activeArtistData.color}-800 rounded-full text-xs`}>
                        {expo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Audio si disponible */}
                {activeArtistData.audio && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 bg-${activeArtistData.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                          <svg className={`w-5 h-5 text-${activeArtistData.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Ambiance de l'atelier</div>
                          <div className="text-sm text-gray-500">Écoutez l'univers sonore de l'artiste</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (audioRef.current) {
                            if (isPlaying) {
                              audioRef.current.pause();
                            } else {
                              audioRef.current.play();
                            }
                            setIsPlaying(!isPlaying);
                          }
                        }}
                        className={`px-6 py-2 rounded-lg font-semibold ${isPlaying
                          ? `bg-${activeArtistData.color}-100 text-${activeArtistData.color}-800`
                          : `bg-${activeArtistData.color}-600 text-white hover:bg-${activeArtistData.color}-700`
                          }`}
                      >
                        {isPlaying ? 'Pause' : 'Écouter'}
                      </button>
                    </div>
                    <audio ref={audioRef} src={activeArtistData.audio} />
                  </div>
                )}

                {/* CTA */}
                <div className="flex space-x-4">
                  <button className={`flex-1 bg-secondary-text text-white font-semibold py-3.5 px-6 rounded-xl hover:secondary-text/80 transition-colors`}>
                    Contacter l'artiste
                  </button>
                  <button className="px-8 py-3.5 border-2 border-secondary-text text-secondary-text font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Voir le portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='lg:col-span-2'>

            {/* Navigation entre artistes */}
            <div className="flex justify-between items-center mb-10">
              <button
                onClick={() => setActiveArtist(prev => prev > 0 ? prev - 1 : artists.length - 1)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Artiste précédent</span>
              </button>

              <div className="flex space-x-2">
                {artists.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveArtist(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeArtist === index
                      ? `w-8 bg-${activeArtistData.color}-500`
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveArtist(prev => (prev + 1) % artists.length)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <span className="font-semibold">Artiste suivant</span>
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Colonne droite - Galerie */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Œuvres récentes</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setGalleryView('grid')}
                  className={`p-2 rounded-lg ${galleryView === 'grid' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setGalleryView('list')}
                  className={`p-2 rounded-lg ${galleryView === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={`${galleryView === 'grid' ? 'grid lg:grid-cols-4 grid-cols-2 gap-4' : 'space-y-4'}`}>
              {activeArtistData.works.map((work) => (
                <WorkCard key={work.id} work={work} artistColor={activeArtistData.color} />
              ))}
            </div>

            {/* Statistiques de l'artiste */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="grid grid-cols-4 bg-white py-4 rounded-lg shadow-lg gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{activeArtistData.works.length}</div>
                  <div className="text-sm text-gray-600">Œuvres présentées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{activeArtistData.exhibitions.length}</div>
                  <div className="text-sm text-gray-600">Expositions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{activeArtistData.years}</div>
                  <div className="text-sm text-gray-600">Carrière</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Original</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Section techniques */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Techniques & disciplines
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Peinture", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
              { name: "Sculpture", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { name: "Photographie", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" },
              { name: "Art numérique", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { name: "Textile", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
              { name: "Street art", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" }
            ].map((tech, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tech.icon} />
                  </svg>
                </div>
                <div className="font-semibold text-gray-800">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-logo rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Vous êtes artiste ou créateur ?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Rejoignez notre plateforme pour présenter vos œuvres, connecter avec des collectionneurs et participer à nos expositions virtuelles.
          </p>
          <button className="bg-white text-gray-900 font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors">
            Proposer mon portfolio
          </button>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ArtistesCreateurs;