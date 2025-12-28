import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix des icônes par défaut de Leaflet (compatible ESM / Vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const OeuvresCreationsLocales = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [hoveredArtisan, setHoveredArtisan] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [artisanStory, setArtisanStory] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);

  // Données des artisans et œuvres
  const artisans = [
    {
      id: 1,
      name: "Marie-Claire Ravoavy",
      craft: "Tissage vacoa",
      location: "Salazie, Réunion",
      years: "42 ans",
      description: "Maîtresse tisserande spécialisée dans le vacoa, transmettant son savoir depuis trois générations.",
      materials: ["Feuilles de vacoa", "Teintures végétales", "Fibres de coco"],
      techniques: ["Tissage traditionnel", "Teinture naturelle", "Séchage solaire"],
      products: [
        { id: 1, name: "Panier rondeau", price: "85€", time: "3 jours", image: "https://images.unsplash.com/photo-1605001011156-cbf0a0b7a88f" },
        { id: 2, name: "Sac cabas", price: "120€", time: "5 jours", image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df" },
        { id: 3, name: "Tapis mural", price: "350€", time: "12 jours", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b" }
      ],
      story: "J'ai appris le tissage avec ma grand-mère à l'âge de 8 ans. Chaque feuille de vacoa raconte une histoire, chaque panier porte une mémoire...",
      color: "emerald",
      featured: true,
      coordinates: { x: 30, y: 40 }
    },
    {
      id: 2,
      name: "Jean-Paul Tamarin",
      craft: "Sculpture sur bois",
      location: "Cilaos, Réunion",
      years: "28 ans",
      description: "Sculpteur utilisant exclusivement des bois locaux de récupération pour créer des œuvres inspirées de la faune endémique.",
      materials: ["Bois de tamarin", "Ébène de Bourbon", "Acajou local"],
      techniques: ["Sculpture au couteau", "Polissage à la main", "Patine naturelle"],
      products: [
        { id: 4, name: "Statue endormi", price: "450€", time: "15 jours", image: "https://images.unsplash.com/photo-1580993769601-8d9d1af67aa0" },
        { id: 5, name: "Masque traditionnel", price: "280€", time: "8 jours", image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd" },
        { id: 6, name: "Bol sculpté", price: "95€", time: "4 jours", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b" }
      ],
      story: "Le bois mort a une âme. Je ne sculpte pas le bois, je révèle ce qu'il contient déjà...",
      color: "amber",
      featured: true,
      coordinates: { x: 25, y: 55 }
    },
    {
      id: 3,
      name: "Fatima Ben Said",
      craft: "Céramique créole",
      location: "Saint-Paul, Réunion",
      years: "15 ans",
      description: "Potière créant des pièces utilitaires inspirées des formes traditionnelles créoles avec des émaux locaux.",
      materials: ["Argile de Saint-Paul", "Oxydes naturels", "Cendre volcanique"],
      techniques: ["Tournage manuel", "Cuisson raku", "Émaillage traditionnel"],
      products: [
        { id: 7, name: "Bol canari", price: "65€", time: "2 jours", image: "https://images.unsplash.com/photo-1574732011388-8e9d1df76e4c" },
        { id: 8, name: "Vase créole", price: "180€", time: "6 jours", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820" },
        { id: 9, name: "Service à thé", price: "320€", time: "10 jours", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136" }
      ],
      story: "L'argile parle entre mes mains. Chaque pièce est unique car elle porte l'empreinte du moment où elle est née...",
      color: "rose",
      featured: false,
      coordinates: { x: 20, y: 30 }
    },
    {
      id: 4,
      name: "Henri Moutou",
      craft: "Vannerie bambou",
      location: "Saint-Benoît, Réunion",
      years: "35 ans",
      description: "Vannier spécialiste du bambou local, créant des meubles et objets du quotidien selon des techniques ancestrales.",
      materials: ["Bambou local", "Lianes naturelles", "Cire d'abeille"],
      techniques: ["Tressage bambou", "Assemblage sans clou", "Finition à la cire"],
      products: [
        { id: 10, name: "Chaise longue", price: "890€", time: "18 jours", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b" },
        { id: 11, name: "Corbeille à fruits", price: "75€", time: "3 jours", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" },
        { id: 12, name: "Paravent", price: "650€", time: "25 jours", image: "https://images.unsplash.com/photo-1581579431533-eb4af5c9b0d6" }
      ],
      story: "Le bambou pousse droit et fort. J'aime suivre sa ligne naturelle pour révéler sa beauté...",
      color: "green",
      featured: false,
      coordinates: { x: 35, y: 25 }
    },
    {
      id: 5,
      name: "Sofia Ramanantsoa",
      craft: "Broderie malgache",
      location: "Saint-Denis, Réunion",
      years: "20 ans",
      description: "Brodeuse perpétuant les techniques malgaches traditionnelles sur des tissus locaux avec des fils naturels.",
      materials: ["Soie sauvage", "Coton bio", "Fil d'argent"],
      techniques: ["Broderie au fil compté", "Point de croix", "Appliqué"],
      products: [
        { id: 13, name: "Tableau brodé", price: "420€", time: "30 jours", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629" },
        { id: 14, name: "Châle créole", price: "250€", time: "15 jours", image: "https://images.unsplash.com/photo-1515747211093-1166c6a2a1b7" },
        { id: 15, name: "Coussins brodés", price: "95€", time: "7 jours", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" }
      ],
      story: "Chaque point est une prière, chaque motif une histoire transmise par mes ancêtres...",
      color: "purple",
      featured: true,
      coordinates: { x: 15, y: 20 }
    },
    {
      id: 6,
      name: "Pierre Govindin",
      craft: "Marqueterie de palissandre",
      location: "Saint-Pierre, Réunion",
      years: "25 ans",
      description: "Maître marqueteur travaillant les bois précieux de l'île pour créer des œuvres d'art uniques.",
      materials: ["Palissandre", "Ébène", "Bois de fer"],
      techniques: ["Marqueterie fine", "Incrustation", "Polissage à l'huile"],
      products: [
        { id: 16, name: "Coffret précieux", price: "780€", time: "20 jours", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f" },
        { id: 17, name: "Tableau marqueté", price: "1200€", time: "45 jours", image: "https://images.unsplash.com/photo-1594736797933-d0a6a89d8c7f" },
        { id: 18, name: "Plateau d'exception", price: "320€", time: "12 jours", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b" }
      ],
      story: "Chaque essence de bois chante une couleur différente. Je compose avec ces couleurs comme un peintre...",
      color: "brown",
      featured: false,
      coordinates: { x: 40, y: 35 }
    }
  ];

  // Catégories de savoir-faire
  const categories = [
    { id: 'tous', label: 'Tous les artisans' },
    { id: 'tissage', label: 'Tissage' },
    { id: 'sculpture', label: 'Sculpture' },
    { id: 'céramique', label: 'Céramique' },
    { id: 'vannerie', label: 'Vannerie' },
    { id: 'broderie', label: 'Broderie' },
    { id: 'marqueterie', label: 'Marqueterie' }
  ];

  // Carte de l'île avec points artisans
  const islandMap = [
    { id: 1, name: "Salazie", artisans: [1], x: 30, y: 40 },
    { id: 2, name: "Cilaos", artisans: [2], x: 25, y: 55 },
    { id: 3, name: "Saint-Paul", artisans: [3], x: 20, y: 30 },
    { id: 4, name: "Saint-Benoît", artisans: [4], x: 35, y: 25 },
    { id: 5, name: "Saint-Denis", artisans: [5], x: 15, y: 20 },
    { id: 6, name: "Saint-Pierre", artisans: [6], x: 40, y: 35 }
  ];

  // Filtrage des artisans
  const filteredArtisans = activeCategory === 'tous' 
    ? artisans 
    : artisans.filter(artisan => artisan.craft.toLowerCase().includes(activeCategory));

  // Animation de la rotation des éléments
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Dessin du canvas (effets textiles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Effet de tissage
      const time = Date.now() * 0.001;
      const patternSize = 40;
      
      for (let y = 0; y < canvas.height; y += patternSize) {
        for (let x = 0; x < canvas.width; x += patternSize) {
          // Fils horizontaux
          ctx.beginPath();
          ctx.moveTo(x, y + patternSize/2);
          ctx.lineTo(x + patternSize, y + patternSize/2);
          ctx.strokeStyle = `rgba(139, 195, 74, ${0.1 + Math.sin(time + x * 0.01) * 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Fils verticaux
          ctx.beginPath();
          ctx.moveTo(x + patternSize/2, y);
          ctx.lineTo(x + patternSize/2, y + patternSize);
          ctx.strokeStyle = `rgba(121, 85, 72, ${0.1 + Math.cos(time + y * 0.01) * 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Points de couture organiques
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.3 + i) * 0.5 + 0.5) * canvas.height;
        const size = 2 + Math.sin(time + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${artisanStory ? '244, 143, 177' : '76, 175, 80'}, 0.5)`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [artisanStory]);

  // Composant Carte Artisan
  const ArtisanCard = ({ artisan }) => {
    const isHovered = hoveredArtisan === artisan.id;
    const isStoryOpen = artisanStory === artisan.id;

    return (
      <div 
        className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl border-2 ${
          isHovered ? `border-${artisan.color}-300 scale-[1.02]` : 'border-transparent'
        }`}
        onMouseEnter={() => setHoveredArtisan(artisan.id)}
        onMouseLeave={() => setHoveredArtisan(null)}
      >
        {/* Header avec photo et badge */}
        <div className={`relative h-48 bg-gradient-to-br from-${artisan.color}-100 to-${artisan.color}-50`}>
          {/* Pattern textile en arrière-plan */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)`,
                 color: `var(--color-${artisan.color})`
               }}>
          </div>
          
          {/* Badge d'expérience */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl">
            <div className="text-sm text-gray-500">Expérience</div>
            <div className="text-lg font-bold text-gray-900">{artisan.years}</div>
          </div>
          
          {/* Badge artisan vedette */}
          {artisan.featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
              ★ Artisan d'exception
            </div>
          )}
          
          {/* Localisation */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {artisan.location}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Nom et métier */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{artisan.name}</h3>
            <div className={`text-${artisan.color}-600 font-semibold`}>{artisan.craft}</div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 line-clamp-2">{artisan.description}</p>

          {/* Matériaux */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Matériaux utilisés</div>
            <div className="flex flex-wrap gap-2">
              {artisan.materials.slice(0, 2).map((material, index) => (
                <span key={index} className={`px-3 py-1 bg-${artisan.color}-50 text-${artisan.color}-800 rounded-full text-sm`}>
                  {material}
                </span>
              ))}
              {artisan.materials.length > 2 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{artisan.materials.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Produits phares */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Produits phares</div>
            <div className="grid grid-cols-3 gap-2">
              {artisan.products.slice(0, 3).map(product => (
                <div key={product.id} className="text-center">
                  <div className="font-medium text-gray-900 text-sm truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-3">
            <button 
              onClick={() => setArtisanStory(artisanStory === artisan.id ? null : artisan.id)}
              className={`flex-1 bg-${artisan.color}-100 text-${artisan.color}-800 font-medium py-3 rounded-xl hover:bg-${artisan.color}-200 transition-colors`}
            >
              {isStoryOpen ? 'Fermer' : 'Lire son histoire'}
            </button>
            <button className={`px-6 bg-${artisan.color}-600 text-white font-medium py-3 rounded-xl hover:bg-${artisan.color}-700 transition-colors`}>
              Contacter
            </button>
          </div>
        </div>

        {/* Histoire de l'artisan (expandable) */}
        {isStoryOpen && (
          <div className="px-6 pb-6">
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-start mb-4">
                <div className={`w-10 h-10 bg-${artisan.color}-100 rounded-full flex items-center justify-center mr-4`}>
                  <svg className={`w-5 h-5 text-${artisan.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Parole d'artisan</h4>
                  <p className="text-gray-700 italic">"{artisan.story}"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Effet de texture sur les bords */}
        <div className={`absolute inset-0 rounded-3xl border-2 border-${artisan.color}-200 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}></div>
      </div>
    );
  };

  // Carte interactive de l'île (Leaflet)
  const IslandMap = () => {
    const center: [number, number] = [-21.115, 55.536]; // centre approximatif de La Réunion
    const mapZoom = 9;

    // Convertit les coordonnées x/y (%) vers lat/lng approximatif autour du centre
    const toLatLng = (x: number, y: number): [number, number] => {
      const lat = center[0] + (y - 30) * 0.08;
      const lng = center[1] + (x - 30) * 0.08;
      return [lat, lng];
    };

    return (
      <div className="mb-12">

        <div className="rounded-3xl overflow-hidden border-2 border-emerald-200">
          <MapContainer center={center} zoom={mapZoom} style={{ height: 420, width: '100%' }} whenCreated={map => { mapRef.current = map; }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {islandMap.map(place => {
              const artisan = artisans.find(a => a.id === place.artisans[0]);
              if (!artisan) return null;
              const position = toLatLng(place.x, place.y);
              return (
                <Marker
                  key={place.id}
                  position={position}
                  eventHandlers={{
                    click: () => setArtisanStory(artisan.id),
                    mouseover: () => setHoveredArtisan(artisan.id),
                    mouseout: () => setHoveredArtisan(null),
                  }}
                >
                  <Popup>
                    <div className="font-bold">{artisan.name}</div>
                    <div className="text-sm">{place.name} — {artisan.craft}</div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    );
  };

  // Galerie de produits
  const ProductGallery = ({ artisan }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 border-2 border-gray-200">
      <h4 className="font-bold text-gray-900 mb-6 text-lg">Créations disponibles</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {artisan.products.map(product => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl mb-3">
              <img
                src={`${product.image}?auto=format&fit=crop&w=400&h=300&q=80`}
                alt={product.name}
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-${artisan.color}-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{product.price}</div>
              <div className="text-sm text-gray-500">Temps de réalisation : {product.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-emerald-50/30 overflow-hidden">
      {/* Header avec texture artisanale */}
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Texture textile animée en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   linear-gradient(45deg, #8BC34A 25%, transparent 25%),
                   linear-gradient(-45deg, #8BC34A 25%, transparent 25%),
                   linear-gradient(45deg, transparent 75%, #8BC34A 75%),
                   linear-gradient(-45deg, transparent 75%, #8BC34A 75%)
                 `,
                 backgroundSize: '40px 40px',
                 backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
                 animation: 'slide 20s linear infinite'
               }}>
          </div>
          <style >{`
            @keyframes slide {
              0% { background-position: 0 0, 0 20px, 20px -20px, -20px 0px; }
              100% { background-position: 40px 0, 40px 20px, 60px -20px, 20px 0px; }
            }
          `}</style>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            Savoir-faire 100% local
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Œuvres & créations locales
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez des œuvres et créations issues du savoir-faire local. 
            Des artisans passionnés perpétuant des traditions centenaires.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { value: artisans.length, label: "Artisans actifs", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a4 4 0 110 5.292" },
            { value: "150+", label: "Créations uniques", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            { value: "300+", label: "Années d'expérience", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { value: "98%", label: "Satisfaction clients", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carte interactive */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Les artisans sur l'île
          </h2>
          <IslandMap />
        </div>

        {/* Filtres */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border ${
                  activeCategory === category.id
                    ? 'bg-emerald-600 text-white border-emerald-600 transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:text-emerald-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des artisans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredArtisans.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>

        {/* Artisan sélectionné en détail */}
        {artisanStory && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-200">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Colonne gauche : Informations artisan */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {artisans.find(a => a.id === artisanStory)?.name}
                      </h2>
                      <div className={`text-xl font-semibold text-${artisans.find(a => a.id === artisanStory)?.color}-600`}>
                        {artisans.find(a => a.id === artisanStory)?.craft}
                      </div>
                    </div>
                    <button
                      onClick={() => setArtisanStory(null)}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">Localisation</div>
                      <div className="font-bold text-gray-900">{artisans.find(a => a.id === artisanStory)?.location}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">Expérience</div>
                      <div className="font-bold text-gray-900">{artisans.find(a => a.id === artisanStory)?.years}</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-3">Techniques maîtrisées</h4>
                    <div className="flex flex-wrap gap-2">
                      {artisans.find(a => a.id === artisanStory)?.techniques.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-8 leading-relaxed">
                    {artisans.find(a => a.id === artisanStory)?.description}
                  </p>

                  <button className={`w-full bg-${artisans.find(a => a.id === artisanStory)?.color}-600 text-white font-bold py-4 rounded-xl hover:bg-${artisans.find(a => a.id === artisanStory)?.color}-700 transition-colors`}>
                    Commander une création personnalisée
                  </button>
                </div>

                {/* Colonne droite : Galerie des produits */}
                <div className="p-8 bg-gray-50">
                  <ProductGallery artisan={artisans.find(a => a.id === artisanStory)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section matériaux */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Matériaux naturels locaux
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Vacoa", description: "Feuilles tressées", color: "green", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
              { name: "Bambou local", description: "Tiges naturelles", color: "emerald", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { name: "Argile locale", description: "Terre cuite", color: "amber", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
              { name: "Bois précieux", description: "Essences rares", color: "brown", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" }
            ].map((material, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 bg-${material.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <svg className={`w-8 h-8 text-${material.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={material.icon} />
                  </svg>
                </div>
                <div className="font-bold text-gray-900 mb-1">{material.name}</div>
                <div className="text-sm text-gray-600">{material.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>
          <div className="relative z-10 p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">
              Soutenez l'artisanat local
            </h2>
            <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
              Chaque achat contribue à préserver un savoir-faire unique et à soutenir 
              les artisans dans leur passion. Commandez directement auprès des créateurs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-emerald-700 font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors">
                Découvrir la boutique
              </button>
              <button className="bg-transparent border-2 border-white text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Devenir mécène
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OeuvresCreationsLocales;