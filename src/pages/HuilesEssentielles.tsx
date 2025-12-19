import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Droplets, Leaf, Package, Search, Star, ShoppingCart, Flower, Award, CheckCircle, Zap, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Données de simulation pour les huiles essentielles
const simulatedHuilesEssentielles = [
  {
    id: 1,
    libelle: "Lavande Vraie Bio",
    description: "Huile essentielle apaisante et relaxante, parfaite pour le sommeil et la détente",
    price: 19.90,
    volume: "10ml",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Relaxation" },
    benefits: "Sommeil profond, stress réduit, peau apaisée",
    properties: ["Calmante", "Cicatrisante", "Antiseptique", "Analgésique"],
    usage: ["Diffusion", "Application cutanée", "Bain"],
    isOrganic: true,
    purity: "100% Pure",
    origin: "France",
    rating: 4.9,
    reviews: 287,
    popular: true
  },
  {
    id: 2,
    libelle: "Menthe Poivrée",
    description: "Stimulante et rafraîchissante, idéale pour les maux de tête et la digestion",
    price: 14.90,
    volume: "10ml",
    images: ["https://images.unsplash.com/photo-1582719471384-8d3c1f8b25c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Énergie" },
    benefits: "Concentration, digestion, fraîcheur",
    properties: ["Stimulante", "Digestive", "Analgésique", "Rafraîchissante"],
    usage: ["Inhalation", "Application cutanée", "Diffusion"],
    isOrganic: false,
    purity: "100% Pure",
    origin: "Inde",
    rating: 4.8,
    reviews: 154,
    popular: true
  },
  {
    id: 3,
    libelle: "Tea Tree Bio",
    description: "Antiseptique puissant naturel pour les problèmes cutanés et respiratoires",
    price: 16.90,
    volume: "15ml",
    images: ["https://images.unsplash.com/photo-1601524909163-991bd9a5fead?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Santé" },
    benefits: "Purifiante, immunostimulante, antifongique",
    properties: ["Antiseptique", "Antifongique", "Immunostimulante", "Expectorante"],
    usage: ["Application cutanée", "Inhalation", "Diffusion"],
    isOrganic: true,
    purity: "Bio",
    origin: "Australie",
    rating: 4.9,
    reviews: 203,
    popular: true
  }
];

// Composant d'animation personnalisé
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

// Composant de carte d'huile essentielle
const HuileEssentielleCard = ({ huile }) => {
  return (
    <Card className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-border hover:border-primary-dark transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={huile.images[0]}
          alt={huile.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-logo text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg">
            {huile.price ? `${huile.price}€` : "N/A"}
          </div>
          {huile.popular && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Populaire
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2">
          {huile.libelle}
        </h3>

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {huile.description}
        </p>

        {/* Propriétés */}
        {huile.properties && (
          <div className="flex flex-wrap gap-2">
            {huile.properties.slice(0, 3).map((prop, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-logo/10 text-logo border-logo/20">
                {prop}
              </Badge>
            ))}
          </div>
        )}

        {/* Informations */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-logo" />
            <span>{huile.volume}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-logo" />
            <span>{huile.origin}</span>
          </div>
        </div>

        {/* Rating et Bio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(huile.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-sm text-gray-600">({huile.reviews})</span>
          </div>
          {huile.isOrganic && (
            <Badge className="bg-green-500 text-white border-green-600">
              <Leaf className="w-3 h-3 mr-1" />
              Bio
            </Badge>
          )}
        </div>

        <Button className="w-full bg-logo hover:bg-primary-dark text-white">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </Card>
  );
};

const HuilesEssentielles = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [huiles, setHuiles] = useState(simulatedHuilesEssentielles);

  const categories = [
    { id: 'all', name: 'Toutes', count: huiles.length },
    { id: 'Relaxation', name: 'Relaxation', count: huiles.filter(h => h.category.name === 'Relaxation').length },
    { id: 'Énergie', name: 'Énergie', count: huiles.filter(h => h.category.name === 'Énergie').length },
    { id: 'Santé', name: 'Santé', count: huiles.filter(h => h.category.name === 'Santé').length },
  ];

  const stats = [
    {
      icon: Droplets,
      value: huiles.length,
      label: "Huiles disponibles",
      description: "Variété exceptionnelle",
      color: "logo"
    },
    {
      icon: Leaf,
      value: huiles.filter(h => h.isOrganic).length,
      label: "Certifiées Bio",
      description: "Qualité garantie",
      color: "primary-dark"
    },
    {
      icon: Star,
      value: Math.round(huiles.reduce((sum, h) => sum + h.rating, 0) / huiles.length * 10) / 10,
      label: "Note moyenne",
      description: "Clients satisfaits",
      color: "logo"
    },
    {
      icon: Package,
      value: "15+",
      label: "Pays d'origine",
      description: "Sélection internationale",
      color: "primary-dark"
    }
  ];

  const filteredHuiles = huiles.filter(huile =>
    (activeCategory === 'all' || huile.category.name === activeCategory) &&
    (huile.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
     huile.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="font-sans text-foreground">
      {/* Statistiques 
      <SlideIn direction="up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-border text-center">
              <div className="text-3xl font-bold text-logo mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-muted-foreground">{stat.label}</div>
              <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">{stat.description}</div>
            </div>
          ))}
        </div>
      </SlideIn>*/}

      {/* Barre de recherche et filtres */}
      <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700/40">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une huile essentielle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-12 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
              />
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id
                      ? 'bg-logo text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {category.name}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des huiles essentielles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHuiles.map((huile, index) => (
          <SlideIn key={huile.id} direction="up" delay={index * 100}>
            <HuileEssentielleCard huile={huile} />
          </SlideIn>
        ))}
      </div>

      {/* Section informations */}
      <div className="mt-12 bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-3xl p-8 border border-logo/20">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Conseils d'utilisation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-card rounded-2xl p-6">
            <div className="p-3 bg-logo/10 rounded-xl w-fit mb-4">
              <Shield className="w-8 h-8 text-logo" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Précautions</h4>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">
              Toujours diluer avant application cutanée. Consultez un professionnel si nécessaire.
            </p>
          </div>
          <div className="bg-white dark:bg-card rounded-2xl p-6">
            <div className="p-3 bg-logo/10 rounded-xl w-fit mb-4">
              <Zap className="w-8 h-8 text-logo" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Conservation</h4>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">
              À l'abri de la lumière et de la chaleur. Bien refermer après utilisation.
            </p>
          </div>
          <div className="bg-white dark:bg-card rounded-2xl p-6">
            <div className="p-3 bg-logo/10 rounded-xl w-fit mb-4">
              <CheckCircle className="w-8 h-8 text-logo" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Qualité</h4>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">
              Huiles 100% pures et naturelles. Certifications contrôlées.
            </p>
          </div>
        </div>
      </div>

      {/* Section Pourquoi choisir nos huiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Pourquoi nos huiles ?</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">100% Pures</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Sans additifs</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Chromatographie vérifiée</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Origine contrôlée</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Modes d'utilisation</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Droplets className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Diffusion</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Assainit l'air et diffuse les bienfaits dans toute la pièce.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Flower className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Application cutanée</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Toujours diluer avec une huile végétale avant application.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Calendar className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Bain aromatique</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Mélanger avec un dispersant avant d'ajouter à l'eau du bain.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuilesEssentielles;