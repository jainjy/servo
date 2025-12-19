// components/entretien/ServicesMaison.tsx
import React, { useEffect, useRef, useState } from "react";
import { Home, Sprout, Droplets, Shield, CheckCircle, Users, Clock, Award } from "lucide-react";

// Données de simulation pour les services maison
const servicesMaison = [
  {
    id: 1,
    libelle: "Ménage Complet 3h",
    description: "Nettoyage approfondi de toute la maison : sols, surfaces, sanitaires, vitres et poussières avec produits écologiques.",
    price: 65,
    duration: "3h",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Ménage" },
    benefits: "Maison impeccable, produits écologiques, satisfaction garantie"
  },
  {
    id: 2,
    libelle: "Grand Ménage Printemps",
    description: "Nettoyage de printemps complet incluant placards, rideaux, moquettes et zones difficiles d'accès.",
    price: 150,
    duration: "6h",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Ménage" },
    benefits: "Détox maison, coins nettoyés, air purifié"
  },
  {
    id: 3,
    libelle: "Tonte de Pelouse Mensuelle",
    description: "Abonnement mensuel de tonte avec évacuation des déchets verts et finition soignée des bordures.",
    price: 40,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Jardinage" },
    benefits: "Pelouse uniforme, outils professionnels, déchets recyclés"
  },
  {
    id: 4,
    libelle: "Taille Haies & Arbustes",
    description: "Taille professionnelle des haies et arbustes avec mise en forme et évacuation des déchets.",
    price: 75,
    duration: "2h",
    images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Jardinage" },
    benefits: "Forme esthétique, croissance saine, propreté"
  },
  {
    id: 5,
    libelle: "Entretien Piscine Hebdo",
    description: "Nettoyage hebdomadaire complet : skimmer, ligne d'eau, fond, traitement chimique et vérification filtration.",
    price: 85,
    duration: "2h",
    images: ["https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Piscine" },
    benefits: "Eau cristalline, équilibre chimique, prévention algues"
  },
  {
    id: 6,
    libelle: "Hivernage Piscine",
    description: "Préparation complète pour l'hiver avec traitement, bâchage et protection du système de filtration.",
    price: 200,
    duration: "4h",
    images: ["https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Piscine" },
    benefits: "Protection hivernale, économie printemps, sécurité"
  },
  {
    id: 7,
    libelle: "Installation Alarme Complète",
    description: "Système d'alarme sans fil avec capteurs portes/fenêtres, sirène 110dB et connexion application mobile.",
    price: 350,
    duration: "4h",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Sécurité" },
    benefits: "Sécurité renforcée, surveillance 24/7, installation pro"
  },
  {
    id: 8,
    libelle: "Kit 4 Caméras Surveillance",
    description: "Installation de 4 caméras HD extérieures avec vision nocturne, détection mouvement et stockage cloud.",
    price: 600,
    duration: "6h",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Sécurité" },
    benefits: "Vision complète, enregistrement 7j, alertes mobiles"
  },
  {
    id: 9,
    libelle: "Nettoyage Après Travaux",
    description: "Nettoyage intensif après rénovation : poussière de plâtre, résidus, finition impeccable.",
    price: 180,
    duration: "5h",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Spécialisé" },
    benefits: "Déblaiement complet, finition habitable, garantie"
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

// Composant ServiceCard intégré
const ServiceCard = ({ service, index, onOpenModal }) => {
  const handleCardClick = () => {
    onOpenModal(service);
  };

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-separator dark:border-border hover:border-primary-dark transform hover:-translate-y-1">

      <div className="relative h-56 overflow-hidden">
        <img
          src={service.images[0]}
          alt={service.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 bg-logo text-white px-4 py-2 rounded-full shadow-lg font-bold">
          {service.price ? `${service.price}€` : "Devis"}
        </div>
        
        {service.duration && (
          <div className="absolute bottom-4 left-4 bg-primary-dark text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {service.duration}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 flex-1">
            {service.libelle}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {service.description}
        </p>

        {service.benefits && (
          <div className="pt-2 border-t border-separator">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Avantages :</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{service.benefits}</p>
          </div>
        )}

        <button
          onClick={handleCardClick}
          className="w-full bg-logo hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 mt-4"
        >
          <CheckCircle className="w-5 h-5" />
          Réserver ce service
        </button>
      </div>
    </div>
  );
};

const ServicesMaison = ({ onOpenModal, searchTerm = "" }) => {
  const filteredServices = servicesMaison.filter(service =>
    service.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { name: "Ménage", icon: <Home className="w-5 h-5" />, count: 3, color: "bg-blue-100 text-blue-600" },
    { name: "Jardinage", icon: <Sprout className="w-5 h-5" />, count: 2, color: "bg-green-100 text-green-600" },
    { name: "Piscine", icon: <Droplets className="w-5 h-5" />, count: 2, color: "bg-cyan-100 text-cyan-600" },
    { name: "Sécurité", icon: <Shield className="w-5 h-5" />, count: 2, color: "bg-red-100 text-red-600" },
    { name: "Spécialisé", icon: <Award className="w-5 h-5" />, count: 1, color: "bg-purple-100 text-purple-600" }
  ];

  return (
    <div>
      {/* Introduction */}
      <SlideIn direction="left">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-logo/10">
              <Home className="w-8 h-8 text-logo" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#8B4513' }}>
                Services Maison
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Prenez soin de votre maison avec nos professionnels qualifiés
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-logo/5 to-primary-dark/5 rounded-2xl p-6 mb-8 border border-logo/20">
            <p className="text-gray-700 dark:text-gray-300">
              Confiez l'entretien de votre maison à des experts certifiés. Que ce soit pour le ménage, le jardinage, 
              l'entretien de votre piscine ou la sécurité de votre foyer, nous proposons des solutions complètes et personnalisées 
              pour répondre à tous vos besoins.
            </p>
          </div>

          {/* Catégories de services */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>Nos domaines d'expertise</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <div key={index} className="bg-white dark:bg-card rounded-xl p-4 text-center border border-separator dark:border-border hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {category.icon}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{category.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{category.count} service{category.count > 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Services */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>
            Nos Services Maison
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredServices.map((service, index) => (
              <SlideIn key={service.id} direction="up" delay={index * 100}>
                <ServiceCard
                  service={service}
                  index={index}
                  onOpenModal={onOpenModal}
                />
              </SlideIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun service maison trouvé
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? "Essayez avec d'autres termes de recherche" : "Tous nos services sont actuellement disponibles"}
            </p>
          </div>
        )}
      </div>

      {/* Section avantages */}
      <SlideIn direction="up" delay={300}>
        <div className="mt-12 pt-8 border-t border-separator">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#8B4513' }}>Nos engagements qualité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-logo/10">
                  <Users className="w-6 h-6 text-logo" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Professionnels Formés</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tous nos intervenants sont rigoureusement sélectionnés, formés et assurés pour un service irréprochable.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-logo/10">
                  <CheckCircle className="w-6 h-6 text-logo" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Satisfaction Garantie</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nous garantissons la qualité de nos services. Insatisfait ? Nous réintervenons gratuitement.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-logo/10">
                  <Sprout className="w-6 h-6 text-logo" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Écologie Respectée</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nous privilégions les produits écologiques et les méthodes respectueuses de l'environnement.
              </p>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-logo/10">
                  <Shield className="w-6 h-6 text-logo" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Sécurité Totale</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tous nos intervenants sont vérifiés et nos systèmes de sécurité sont aux normes les plus strictes.
              </p>
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Abonnements */}
      <SlideIn direction="up" delay={400}>
        <div className="mt-12 bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-2xl p-8 border border-logo/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-logo">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Formules Abonnement</h3>
              <p className="text-gray-600 dark:text-gray-400">Économisez avec nos forfaits mensuels</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Forfait Ménage</div>
              <div className="text-2xl font-bold text-logo mb-2">150€<span className="text-sm text-gray-500">/mois</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>2 nettoyages complets par mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Produits fournis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Même intervenant</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Forfait Jardin</div>
              <div className="text-2xl font-bold text-logo mb-2">120€<span className="text-sm text-gray-500">/mois</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>4 tontes par mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Taille haies mensuelle</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Évacuation déchets</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Forfait Piscine</div>
              <div className="text-2xl font-bold text-logo mb-2">300€<span className="text-sm text-gray-500">/mois</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Entretien hebdomadaire</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Produits chimiques inclus</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Surveillance filtration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
};

export default ServicesMaison;