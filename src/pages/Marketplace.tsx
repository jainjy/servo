// components/entretien/Marketplace.tsx
import React, { useEffect, useRef, useState } from "react";
import { ShoppingCart, Shield, CheckCircle, Truck, Star, RefreshCw, ShieldCheck, ThumbsUp } from "lucide-react";

// Données de simulation pour la marketplace
const marketplaceProducts = [
  {
    id: 1,
    libelle: "Lave-linge Samsung 8kg",
    description: "Lave-linge frontal 8kg, technologie EcoBubble, excellent état, 2 ans d'utilisation. Vérifié par nos experts.",
    price: 250,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Électroménager" },
    benefits: "Économie 60%, état vérifié, garantie 6 mois",
    condition: "Très bon état",
    rating: 4.5
  },
  {
    id: 2,
    libelle: "Table à Manger Bois Massif",
    description: "Table extensible en chêne massif pour 6-10 personnes, style industriel, quelques marques d'usage.",
    price: 380,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Ameublement" },
    benefits: "Unique, solide, livraison possible",
    condition: "Bon état",
    rating: 4.0
  },
  {
    id: 3,
    libelle: "Scie Circulaire sur Table",
    description: "Scie circulaire sur table 1500W, peu utilisée, manuel d'origine, tous accessoires présents.",
    price: 95,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Outils" },
    benefits: "Prix imbattable, fonctionnement parfait, testée",
    condition: "Comme neuve",
    rating: 4.8
  },
  {
    id: 4,
    libelle: "Canapé 3 Places D'Angle",
    description: "Canapé d'angle convertible en lit, tissu microfibre, mécanisme récent, nettoyé professionnellement.",
    price: 450,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Ameublement" },
    benefits: "Confort optimal, nettoyé, mécanisme garanti",
    condition: "Très bon état",
    rating: 4.3
  },
  {
    id: 5,
    libelle: "Réfrigérateur Américain",
    description: "Réfrigérateur américain 550L, distributeur d'eau et de glaçons, contrôle électronique, 3 ans.",
    price: 650,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Électroménager" },
    benefits: "Économie 1200€, parfait fonctionnement, livraison",
    condition: "Excellent état",
    rating: 4.7
  },
  {
    id: 6,
    libelle: "Tondeuse Thermique Autotractée",
    description: "Tondeuse thermique 163cc, bac 70L, démarrage électrique, coupe réglable, très peu utilisée.",
    price: 320,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Jardinage" },
    benefits: "Puissante, économique, vérifiée moteur",
    condition: "Comme neuve",
    rating: 4.6
  },
  {
    id: 7,
    libelle: "Lustre Cristal 8 Bras",
    description: "Lustre suspendu avec cristaux, 8 bras, éclairage LED, parfait état, emballage d'origine.",
    price: 180,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Décoration" },
    benefits: "Élégant, LED économique, installation possible",
    condition: "Parfait état",
    rating: 4.9
  },
  {
    id: 8,
    libelle: "Perceuse Visseuse 18V",
    description: "Kit complet perceuse-visseuse sans fil 18V, 2 batteries, chargeur rapide, coffret de transport.",
    price: 75,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Outils" },
    benefits: "Complet, batteries neuves, testé puissance",
    condition: "Très bon état",
    rating: 4.4
  },
  {
    id: 9,
    libelle: "Armoire Vintage en Bois",
    description: "Armoire ancienne en chêne massif, 4 portes, étagères amovibles, patine naturelle, authentique.",
    price: 520,
    duration: "Occasion",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Ameublement" },
    benefits: "Pièce unique, qualité exceptionnelle, histoire",
    condition: "État vintage",
    rating: 4.2
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

  // Générer les étoiles pour la note
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

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-yellow-400 hover:border-yellow-500 transform hover:-translate-y-1">

      {/* Badge Occasion */}
      <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        OCCASION
      </div>

      {/* Badge Économie */}
      <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        ÉCONOMIE
      </div>

      <div className="relative h-56 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Garantie 6 mois
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 flex-1">
              {product.libelle}
            </h3>
            <div className="text-2xl font-bold text-logo ml-2">
              {product.price}€
            </div>
          </div>

          {/* Note et condition */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}/5</span>
            </div>
            <div className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {product.condition}
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {product.description}
        </p>

        <div className="pt-2 border-t border-separator">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Avantages :</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{product.benefits}</p>
        </div>

        <button
          onClick={handleCardClick}
          className="w-full bg-logo hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 mt-4"
        >
          <ShoppingCart className="w-5 h-5" />
          Acheter ce produit
        </button>
      </div>
    </div>
  );
};

const Marketplace = ({ onOpenModal, searchTerm = "" }) => {
  const [filter, setFilter] = useState("all");
  
  const filteredProducts = marketplaceProducts.filter(product => {
    const matchesSearch = product.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || product.category?.name === filter;
    
    return matchesSearch && matchesFilter;
  });

  const categories = [
    { id: "all", name: "Toutes catégories", count: marketplaceProducts.length },
    { id: "Électroménager", name: "Électroménager", count: 2 },
    { id: "Ameublement", name: "Ameublement", count: 3 },
    { id: "Outils", name: "Outils", count: 2 },
    { id: "Jardinage", name: "Jardinage", count: 1 },
    { id: "Décoration", name: "Décoration", count: 1 }
  ];

  const stats = [
    { label: "Produits vérifiés", value: "100%", icon: ShieldCheck },
    { label: "Garantie incluse", value: "6 mois", icon: Shield },
    { label: "Livraison possible", value: "90%", icon: Truck },
    { label: "Satisfaction clients", value: "4.7/5", icon: ThumbsUp }
  ];

  return (
    <div>
      {/* Introduction */}
      <SlideIn direction="left">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <ShoppingCart className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#8B4513' }}>
                Marketplace d'Occasion
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Des bonnes affaires en produits d'occasion vérifiés et garantis
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/5 to-yellow-600/5 rounded-2xl p-6 mb-8 border border-yellow-400/20">
            <p className="text-gray-700 dark:text-gray-300">
              Découvrez notre sélection de produits d'occasion de qualité, tous vérifiés par nos experts. 
              Économisez jusqu'à 70% sur des équipements en parfait état, bénéficiez de notre garantie 
              et faites un geste pour la planète en choisissant la seconde main.
            </p>
          </div>

          {/* Statistiques */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-card rounded-xl p-4 text-center border border-separator dark:border-border">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <stat.icon className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Filtres par catégorie */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>Filtrer par catégorie</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${filter === category.id
                  ? 'bg-logo text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Produits */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>
              Nos Produits d'Occasion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {filter !== "all" && `Filtré par : ${categories.find(c => c.id === filter)?.name}`}
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
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun produit trouvé
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? "Essayez avec d'autres termes de recherche" : "Aucun produit disponible dans cette catégorie"}
            </p>
            <button
              onClick={() => setFilter("all")}
              className="px-4 py-2 bg-logo text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </div>

      {/* Section garanties */}
      <SlideIn direction="up" delay={300}>
        <div className="mt-12 pt-8 border-t border-separator">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-logo">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Nos Garanties Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-400">Achetez en toute confiance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Produits Vérifiés</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Chaque produit passe par notre processus de vérification en 3 étapes : 
                inspection physique, test fonctionnel et nettoyage professionnel.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Garantie 6 Mois</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Tous nos produits bénéficient d'une garantie de 6 mois. En cas de problème, 
                nous réparons, remplaçons ou remboursons.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-yellow-100">
                  <Truck className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Livraison & Installation</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Option livraison et installation disponible. Nos équipes s'occupent de tout, 
                du transport à la mise en service.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Reprise Possible</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Nous reprenons vos anciens appareils ou meubles lors de la livraison de votre nouvel achat.
              </p>
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Comment vendre */}
      <SlideIn direction="up" delay={400}>
        <div className="mt-12 bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-2xl p-8 border border-logo/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Vous avez des produits à vendre ?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Nous rachetons vos équipements en bon état ou nous les vendons pour vous sur commission.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Estimation gratuite en ligne ou à domicile</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Rachat immédiat ou vente sur commission</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Enlèvement gratuit à votre domicile</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Paiement sécurisé sous 48h</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg inline-block">
                <div className="text-4xl font-bold text-logo mb-2">70%</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">d'économie moyenne</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">par rapport au neuf</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Nos clients économisent en moyenne 70% en choisissant l'occasion vérifiée
              </p>
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
};

export default Marketplace;