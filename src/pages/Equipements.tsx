// components/entretien/Equipements.tsx
import React, { useEffect, useRef, useState } from "react";
import { Sofa, Refrigerator, Droplets, Zap, Truck, CheckCircle, Shield, Award, Clock, Star } from "lucide-react";

// Données de simulation pour les équipements
const equipements = [
  {
    id: 1,
    libelle: "Réfrigérateur Américain Samsung",
    description: "Réfrigérateur américain 615L avec distributeur d'eau et de glaçons, technologie Twin Cooling Plus, No Frost.",
    price: 1899,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1571175443880-49e1d1b7b3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Électroménager" },
    benefits: "Économie d'énergie A++, silencieux, garantie 2 ans",
    features: ["615L capacité", "Distributeur eau/glaçons", "No Frost", "Écran tactile"],
    rating: 4.8,
    delivery: "Livraison et installation incluses"
  },
  {
    id: 2,
    libelle: "Lave-linge Séchant Heat Pump",
    description: "Lave-linge séchant 9kg/5kg avec technologie Heat Pump, 1400 tours, programmes intelligents et connexion WiFi.",
    price: 899,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Électroménager" },
    benefits: "Économie énergie 50%, séchage délicat, silencieux",
    features: ["9kg lavage / 5kg séchage", "Heat Pump", "WiFi connecté", "22 programmes"],
    rating: 4.6,
    delivery: "Livraison et installation"
  },
  {
    id: 3,
    libelle: "Cuisine Équipée sur Mesure",
    description: "Cuisine complète sur mesure avec électroménager intégré, plan de travail quartz et éclairage LED.",
    price: 7500,
    duration: "Sur mesure",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Cuisine" },
    benefits: "Design personnalisé, matériaux premium, garantie 5 ans",
    features: ["Plan de travail quartz", "Électroménager intégré", "Éclairage LED", "Rangement optimisé"],
    rating: 4.9,
    delivery: "Conception et installation complètes"
  },
  {
    id: 4,
    libelle: "Canapé Modulaire 5 Places",
    description: "Canapé modulaire en tissu velours, convertible en lit, nombreuses configurations possibles, confort mémoire de forme.",
    price: 1499,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Salon" },
    benefits: "Modulable, convertible, tissus traités anti-taches",
    features: ["5 places", "Convertible lit", "Tissu velours", "Tête réglable"],
    rating: 4.7,
    delivery: "Livraison et montage"
  },
  {
    id: 5,
    libelle: "Table à Manger Extensible",
    description: "Table en chêne massif extensible de 6 à 10 personnes, style scandinave, finition huile naturelle.",
    price: 1299,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Salle à manger" },
    benefits: "Bois massif, extensible, design intemporel",
    features: ["Chêne massif", "6 à 10 places", "Système extension", "Finition naturelle"],
    rating: 4.5,
    delivery: "Livraison et montage"
  },
  {
    id: 6,
    libelle: "Lit 160x200 avec Tête de Lit",
    description: "Lit coffre en bois massif 160x200 avec tête de lit rembourrée, rangement intégré et sommier réglable.",
    price: 899,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Chambre" },
    benefits: "Rangement intégré, bois massif, sommier réglable",
    features: ["160x200", "Lit coffre", "Tête de lit rembourrée", "Sommier réglable"],
    rating: 4.6,
    delivery: "Livraison et montage"
  },
  {
    id: 7,
    libelle: "Climatiseur Réversible Inverter",
    description: "Climatiseur split réversible 9000 BTU, technologie Inverter, WiFi, très silencieux (19dB), classe A+++.",
    price: 1299,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Climatisation" },
    benefits: "Chauffage et climatisation, économique, silencieux",
    features: ["9000 BTU", "Inverter", "WiFi", "19dB seulement"],
    rating: 4.8,
    delivery: "Livraison et installation professionnelle"
  },
  {
    id: 8,
    libelle: "Purificateur d'Air HEPA",
    description: "Purificateur d'air professionnel avec filtre HEPA H13, capteur qualité air, mode nuit et contrôle smartphone.",
    price: 349,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Qualité air" },
    benefits: "99.97% particules filtrées, écologique, économique",
    features: ["Filtre HEPA H13", "Capteur air", "Mode nuit", "App contrôle"],
    rating: 4.4,
    delivery: "Livraison gratuite"
  },
  {
    id: 9,
    libelle: "Aspirateur Robot Intelligent",
    description: "Aspirateur robot avec cartographie laser, navigation intelligente, station auto-vidage et contrôle application.",
    price: 699,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Nettoyage" },
    benefits: "Autonome, auto-vidage, programmation intelligente",
    features: ["Cartographie laser", "Auto-vidage", "Contrôle app", "Nettoyage moquette"],
    rating: 4.7,
    delivery: "Livraison et configuration"
  },
  {
    id: 10,
    libelle: "Hotte Aspirante Design",
    description: "Hotte aspirante 90cm extraction extérieure, écran tactile, éclairage LED et niveau sonore réduit (52dB).",
    price: 599,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Cuisine" },
    benefits: "Extraction puissante, design minimaliste, facile à nettoyer",
    features: ["90cm", "Extraction 750m³/h", "Écran tactile", "LED intégrées"],
    rating: 4.5,
    delivery: "Livraison"
  },
  {
    id: 11,
    libelle: "Armoire Penderie sur Mesure",
    description: "Armoire de dressing sur mesure avec portes coulissantes, éclairage intégré et rangements optimisés.",
    price: 2200,
    duration: "Sur mesure",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Rangement" },
    benefits: "Sur mesure, rangement maximal, éclairage intégré",
    features: ["Portes coulissantes", "Éclairage LED", "Tiroirs doux", "Adapté espace"],
    rating: 4.8,
    delivery: "Conception et installation"
  },
  {
    id: 12,
    libelle: "Chauffe-eau Thermodynamique",
    description: "Chauffe-eau thermodynamique 270L, classe A, pompe à chaleur intégrée, économie jusqu'à 70% sur l'eau chaude.",
    price: 2499,
    duration: "Neuf",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Énergie" },
    benefits: "Économie 70%, écologique, autocontrôle intelligent",
    features: ["270L", "Pompe à chaleur", "Classe A", "App contrôle"],
    rating: 4.9,
    delivery: "Livraison et installation pro"
  }
];

// Composant SlideIn intégré
const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : direction === "left"
            ? "opacity-0 -translate-x-10"
            : direction === "right"
              ? "opacity-0 translate-x-10"
              : direction === "up"
                ? "opacity-0 translate-y-10"
                : "opacity-0 translate-y-10"
        }
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Composant ProductCard intégré
const ProductCard = ({ product, index, onOpenModal }) => {
  const handleCardClick = () => {
    onOpenModal(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const isCustom = product.duration === "Sur mesure";

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-separator dark:border-border hover:border-primary-dark transform hover:-translate-y-1">

      {isCustom && (
        <div className="absolute top-4 left-4 z-20 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          SUR MESURE
        </div>
      )}

      <div className="relative h-56 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 bg-logo text-white px-4 py-2 rounded-full shadow-lg font-bold">
          {product.price}€
        </div>
        
        <div className="absolute bottom-4 left-4 bg-primary-dark text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Truck className="w-3 h-3" />
          {product.delivery}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 flex-1">
              {product.libelle}
            </h3>
          </div>

          {/* Note */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}/5</span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">{product.category.name}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-2 min-h-[3rem]">
          {product.description}
        </p>

        {/* Caractéristiques */}
        {product.features && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Caractéristiques :</p>
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="text-xs text-gray-500">+{product.features.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Avantages */}
        <div className="pt-2 border-t border-separator">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Avantages :</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{product.benefits}</p>
        </div>

        <button
          onClick={handleCardClick}
          className="w-full bg-logo hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 mt-4"
        >
          <CheckCircle className="w-5 h-5" />
          {isCustom ? "Demander un devis" : "Commander cet équipement"}
        </button>
      </div>
    </div>
  );
};

const Equipements = ({ onOpenModal, searchTerm = "" }) => {
  const [filter, setFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 8000]);
  
  const filteredProducts = equipements.filter(product => {
    const matchesSearch = product.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || product.category?.name === filter;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesFilter && matchesPrice;
  });

  const categories = [
    { id: "all", name: "Tous les équipements", icon: <Sofa className="w-4 h-4" />, count: equipements.length },
    { id: "Électroménager", name: "Électroménager", icon: <Refrigerator className="w-4 h-4" />, count: 3 },
    { id: "Cuisine", name: "Cuisine", icon: <Droplets className="w-4 h-4" />, count: 2 },
    { id: "Salon", name: "Salon", icon: <Sofa className="w-4 h-4" />, count: 1 },
    { id: "Salle à manger", name: "Salle à manger", icon: <Sofa className="w-4 h-4" />, count: 1 },
    { id: "Chambre", name: "Chambre", icon: <Sofa className="w-4 h-4" />, count: 1 },
    { id: "Climatisation", name: "Climatisation", icon: <Zap className="w-4 h-4" />, count: 1 },
    { id: "Rangement", name: "Rangement", icon: <Sofa className="w-4 h-4" />, count: 1 },
    { id: "Énergie", name: "Énergie", icon: <Zap className="w-4 h-4" />, count: 1 }
  ];

  const services = [
    {
      icon: Truck,
      title: "Livraison & Installation",
      description: "Livraison gratuite et installation professionnelle incluse sur tous les équipements"
    },
    {
      icon: Shield,
      title: "Garantie Étendue",
      description: "Garantie jusqu'à 5 ans selon les produits, avec assistance premium"
    },
    {
      icon: CheckCircle,
      title: "Satisfaction Garantie",
      description: "30 jours pour changer d'avis, service après-vente réactif"
    },
    {
      icon: Award,
      title: "Experts à Votre Service",
      description: "Conseils personnalisés par nos experts en équipement maison"
    }
  ];

  const maxPrice = Math.max(...equipements.map(p => p.price));

  return (
    <div>
      {/* Introduction */}
      <SlideIn direction="left">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-logo/10">
              <Sofa className="w-8 h-8 text-logo" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#8B4513' }}>
                Équipements Neufs & Sur Mesure
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Équipez votre maison avec du matériel neuf de qualité professionnelle
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-logo/5 to-primary-dark/5 rounded-2xl p-6 mb-8 border border-logo/20">
            <p className="text-gray-700 dark:text-gray-300">
              Découvrez notre sélection d'équipements neufs et sur mesure pour votre maison. 
              De l'électroménager haut de gamme aux solutions de rangement optimisées, 
              nous proposons des produits de qualité avec installation professionnelle incluse 
              et des garanties étendues pour votre tranquillité d'esprit.
            </p>
          </div>

          {/* Services inclus */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Services inclus avec chaque achat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <div key={index} className="bg-white dark:bg-card rounded-xl p-4 border border-separator dark:border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-logo/10">
                      <service.icon className="w-5 h-5 text-logo" />
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{service.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Filtres */}
      <div className="mb-8 bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtre par catégorie */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Catégories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors duration-300 text-sm ${filter === category.id
                      ? 'bg-logo text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="ml-auto text-xs opacity-75">({category.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtre par prix */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold" style={{ color: '#8B4513' }}>Fourchette de prix</h3>
              <div className="text-logo font-bold">
                {priceRange[0]}€ - {priceRange[1]}€
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>0€</span>
                <span>{maxPrice}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produits */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>
              Nos Équipements
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {filter !== "all" && `Filtré par : ${categories.find(c => c.id === filter)?.name}`}
              {filter === "all" && `Prix : ${priceRange[0]}€ - ${priceRange[1]}€`}
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <SlideIn key={product.id} direction="up" delay={index * 100}>
                <ProductCard
                  product={product}
                  index={index}
                  onOpenModal={onOpenModal}
                />
              </SlideIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <Sofa className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun équipement trouvé
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm 
                ? "Essayez avec d'autres termes de recherche" 
                : "Aucun produit ne correspond à vos filtres"}
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setPriceRange([0, maxPrice]);
              }}
              className="px-4 py-2 bg-logo text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Section sur mesure */}
      <SlideIn direction="up" delay={300}>
        <div className="mt-12 pt-8 border-t border-separator">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-600">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Solutions sur Mesure</h3>
              <p className="text-gray-600 dark:text-gray-400">Nous créons l'équipement parfait pour votre espace</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">Notre processus sur mesure</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h5 className="font-semibold mb-1">Consultation gratuite</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Visite à domicile ou consultation virtuelle pour comprendre vos besoins</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h5 className="font-semibold mb-1">Conception personnalisée</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plans 3D et propositions adaptées à votre espace et budget</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h5 className="font-semibold mb-1">Fabrication qualité</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Réalisation par nos artisans avec matériaux premium</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div>
                    <h5 className="font-semibold mb-1">Installation complète</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Installation par nos experts et garantie sur l'ensemble</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
              <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">Domaines d'expertise sur mesure</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-card/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Cuisines</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Intégrées et optimisées</div>
                </div>
                <div className="bg-white dark:bg-card/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Dressings</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rangement maximal</div>
                </div>
                <div className="bg-white dark:bg-card/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Bibliothèques</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sur mesure murales</div>
                </div>
                <div className="bg-white dark:bg-card/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Bureaux</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Espace travail optimisé</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const customProduct = equipements.find(p => p.duration === "Sur mesure");
                    if (customProduct) onOpenModal(customProduct);
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-300"
                >
                  Demander un devis sur mesure
                </button>
              </div>
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Section financement */}
      <SlideIn direction="up" delay={400}>
        <div className="mt-12 bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-2xl p-8 border border-logo/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-logo">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Solutions de Financement</h3>
              <p className="text-gray-600 dark:text-gray-400">Achetez maintenant, payez plus tard</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Paiement en 3x</div>
              <div className="text-2xl font-bold text-logo mb-2">Sans frais</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pour tout achat supérieur à 300€
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Exemple : 999€ = 3 x 333€
              </div>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Paiement en 10x</div>
              <div className="text-2xl font-bold text-logo mb-2">1.9%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pour tout achat supérieur à 1000€
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Exemple : 2500€ = 10 x 275€
              </div>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Location avec Option d'Achat</div>
              <div className="text-2xl font-bold text-logo mb-2">À partir de 39€/mois</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Changez d'équipement tous les 3 ans
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Option d'achat à terme réduit
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tous nos financements sont sans apport et réponse sous 24h
            </p>
          </div>
        </div>
      </SlideIn>

      {/* CTA Consultation */}
      <SlideIn direction="up" delay={500}>
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-logo to-primary-dark rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Besoin de conseils pour équiper votre maison ?</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Nos experts sont à votre disposition pour vous guider dans le choix des équipements 
              les plus adaptés à votre espace, votre style de vie et votre budget.
            </p>
            <button
              onClick={() => {
                const consultationProduct = {
                  id: 'consultation-equipement',
                  libelle: 'Consultation Équipement Maison',
                  description: 'Consultation avec un expert pour choisir les équipements adaptés à vos besoins',
                  price: 0,
                  duration: '1h',
                  category: { name: 'Consultation' }
                };
                onOpenModal(consultationProduct);
              }}
              className="bg-white text-logo px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Réserver une consultation gratuite
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
};

export default Equipements;