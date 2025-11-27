import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Dans PartnersPage.tsx et ServicesPages.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Calendar, ArrowRight, ChevronDown, X, Clock, User, Play, Headphones, BookOpen, Download, MessageCircle, ThumbsUp, Share2, Bookmark, Heart, Eye, Pause, Lightbulb, Home, BarChart3, Banknote } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import "@/styles/actualite.css";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";

const categories = ["Toutes", "Immobilier", "Travaux", "Financement", "Produits", "Rénovation"];

// Données pour les sections spécifiques
const guidesFondamentaux = [
  {
    id: 101,
    titre: "Les étapes clés pour l'achat d'un bien immobilier",
    date: "10 Mars 2025",
    categorie: "Immobilier",
    description: "Guide complet des étapes à suivre pour réussir votre projet d'achat immobilier.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80",
    tempsLecture: "8 min",
    type: "guide",
    badge: "Guide"
  },
  {
    id: 102,
    titre: "Comment financer son projet immobilier",
    date: "8 Mars 2025",
    categorie: "Financement",
    description: "Toutes les solutions de financement pour votre acquisition immobilière.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
    tempsLecture: "6 min",
    type: "guide",
    badge: "Guide"
  },
  {
    id: 103,
    titre: "Rénovation : par où commencer ?",
    date: "5 Mars 2025",
    categorie: "Rénovation",
    description: "Les premières étapes essentielles pour planifier votre projet de rénovation.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
    tempsLecture: "5 min",
    type: "guide",
    badge: "Guide"
  }
];

const articlesPodcast = [
  {
    id: 201,
    titre: "Les tendances immobilières 2025",
    date: "12 Mars 2025",
    categorie: "Immobilier",
    description: "Analyse des tendances du marché immobilier pour l'année 2025.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80",
    tempsLecture: "45 min",
    type: "podcast",
    duree: "45:30",
    badge: "Podcast"
  },
  {
    id: 202,
    titre: "Investissement locatif : les bonnes pratiques",
    date: "9 Mars 2025",
    categorie: "Financement",
    description: "Conseils pour réussir votre investissement locatif.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
    tempsLecture: "38 min",
    type: "podcast",
    duree: "38:15",
    badge: "Podcast"
  }
];

// Données des conseils par catégorie
const conseilsData = {
  immobilier: {
    titre: "Conseils Immobilier",
    icon: Home,
    couleur: "from-blue-600 to-cyan-600",
    conseils: [
      {
        id: 1,
        titre: "Bien choisir son bien immobilier",
        description: "Les critères essentiels pour trouver le bon bien selon votre budget et vos besoins.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        tips: [
          "Vérifier la localisation et l'accessibilité",
          "Analyser les tendances du marché local",
          "Inspecter l'état général de la propriété",
          "Évaluer le potentiel d'appréciation",
          "Considérer les frais de copropriété"
        ]
      },
      {
        id: 2,
        titre: "Négocier le meilleur prix",
        description: "Stratégies pour obtenir un accord au meilleur prix possible.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        tips: [
          "Faire une étude comparative du marché",
          "Identifier les motivations du vendeur",
          "Proposer un prix initial légèrement bas",
          "Être prêt à faire comprometis",
          "Obtenir une inspection professionnelle"
        ]
      },
      {
        id: 3,
        titre: "Comprendre les diagnostics immobiliers",
        description: "Guide complet des diagnostics obligatoires et leur interprétation.",
        image: "https://i.pinimg.com/736x/fe/6e/f9/fe6ef9d561df8876a2c4c9df8fea643b.jpg",
        tips: [
          "Diagnostic de performance énergétique",
          "Diagnostic amiante et plomb",
          "Inspection termites et ravageurs",
          "Diagnostic gaz et électricité",
          "État relatif à la présence de polluants"
        ]
      }
    ]
  },
  travaux: {
    titre: "Conseils Travaux",
    icon: BarChart3,
    couleur: "from-orange-600 to-red-600",
    conseils: [
      {
        id: 1,
        titre: "Planifier vos travaux de rénovation",
        description: "Méthodologie pour planifier et budgéter vos travaux efficacement.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        tips: [
          "Établir un plan détaillé des travaux",
          "Évaluer le budget réaliste",
          "Prioriser les travaux urgents",
          "Demander plusieurs devis",
          "Prévoir une marge de contingence de 10-15%"
        ]
      },
      {
        id: 2,
        titre: "Choisir les bons artisans",
        description: "Comment sélectionner et travailler avec des entrepreneurs qualifiés.",
        image: "https://i.pinimg.com/1200x/10/1a/3b/101a3b63cbe22f20331ed259d36b328a.jpg",
        tips: [
          "Vérifier les qualifications et certifications",
          "Consulter les références antérieures",
          "Comparer les devis détaillés",
          "Vérifier l'assurance responsabilité civile",
          "Mettre en place un contrat clair"
        ]
      },
      {
        id: 3,
        titre: "Aides et subventions disponibles",
        description: "Liste complète des aides gouvernementales pour vos travaux.",
        image: "https://i.pinimg.com/1200x/34/52/64/3452648882e5ac346729a623e41b6292.jpg",
        tips: [
          "MaPrimeRénov' pour les rénovations énergétiques",
          "Éco-PTZ pour les travaux écologiques",
          "Crédit d'impôt transition énergétique",
          "Aides des collectivités locales",
          "Subventions ANAH pour les propriétaires"
        ]
      }
    ]
  },
  financement: {
    titre: "Conseils Financement",
    icon: Banknote,
    couleur: "from-green-600 to-emerald-600",
    conseils: [
      {
        id: 1,
        titre: "Préparer votre dossier de crédit",
        description: "Comment préparer un dossier solide pour obtenir votre crédit immobilier.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
        tips: [
          "Maintenir un bon score de crédit",
          "Augmenter votre apport personnel",
          "Stabiliser vos revenus",
          "Réduire vos dettes existantes",
          "Documenter votre situation financière"
        ]
      },
      {
        id: 2,
        titre: "Comprendre les taux de prêt",
        description: "Guide pour comprendre et négocier les taux d'intérêt.",
        image: "https://i.pinimg.com/1200x/9b/24/d0/9b24d0ed911c05757b4f2dd2f704dd47.jpg",
        tips: [
          "Taux fixe vs taux variable",
          "L'impact du TAEG (Taux Annuel Effectif Global)",
          "Les frais de dossier et d'assurance",
          "Comparaison entre banques et courtiers",
          "Timing optimal pour demander un crédit"
        ]
      },
      {
        id: 3,
        titre: "Assurance emprunteur : ce qu'il faut savoir",
        description: "Tout ce que vous devez connaître sur l'assurance crédit immobilier.",
        image: "https://i.pinimg.com/1200x/36/50/80/365080dea43aa6265c52ba9d7a3b10fd.jpg",
        tips: [
          "Assurance décès-invalidité obligatoire",
          "Délai de réflexion et loi Lemoine",
          "Comparaison des garanties",
          "Possibilité de changer d'assurance",
          "Impact sur le coût total du prêt"
        ]
      }
    ]
  },
  renovation: {
    titre: "Conseils Rénovation",
    icon: Lightbulb,
    couleur: "from-purple-600 to-pink-600",
    conseils: [
      {
        id: 1,
        titre: "Rénovation énergétique : où commencer ?",
        description: "Étapes pour réduire votre consommation énergétique et vos factures.",
        image: "https://i.pinimg.com/736x/72/66/14/72661412809840e6abd0c937940b3c4e.jpg",
        tips: [
          "Audit énergétique initial recommandé",
          "Isolation toiture et combles en priorité",
          "Remplacement des fenêtres",
          "Chauffage et production d'eau chaude",
          "Installation d'énergies renouvelables"
        ]
      },
      {
        id: 2,
        titre: "Choisir les matériaux durables",
        description: "Guide des matériaux écologiques et performants pour vos travaux.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        tips: [
          "Matériaux biosourcés (bois, liège, chanvre)",
          "Isolants naturels et performants",
          "Peintures et finitions éco-responsables",
          "Matériaux recyclés et récupérés",
          "Certifications environnementales à vérifier"
        ]
      },
      {
        id: 3,
        titre: "Budget et calendrier de rénovation",
        description: "Comment gérer le budget et le timing de votre projet de rénovation.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        tips: [
          "Établir un budget réaliste par zone",
          "Prévoir la durée de chaque étape",
          "Gérer la logistique pendant les travaux",
          "Éviter les retards coûteux",
          "Documenter tous les frais et modifications"
        ]
      }
    ]
  }
};

const Actualites = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [visibleArticles, setVisibleArticles] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [activeConseilTab, setActiveConseilTab] = useState("immobilier");
  const [selectedConseil, setSelectedConseil] = useState(null);
  const [isConseilModalOpen, setIsConseilModalOpen] = useState(false);

  // Charger les articles depuis l'API
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/articles');
        setArticles(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des articles:', err);
        setError('Erreur lors du chargement des articles');
        setArticles(getFallbackArticles());
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fonction de secours avec des données statiques
  const getFallbackArticles = () => [
    {
      id: 1,
      titre: "Les nouvelles aides à la rénovation énergétique 2025",
      date: "15 Mars 2025",
      categorie: "Rénovation",
      description: "Découvrez les nouvelles aides gouvernementales pour vos projets de rénovation énergétique en 2025.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
      contenu: `
        <h2>Les aides financières pour 2025</h2>
        <p>Le gouvernement a annoncé de nouvelles mesures pour accompagner les propriétaires dans leurs projets de rénovation énergétique.</p>
        <h3>Les principales aides</h3>
        <ul>
          <li>MaPrimeRénov' évolue avec de nouveaux plafonds</li>
          <li>Crédit d'impôt transition énergétique</li>
          <li>Éco-prêt à taux zéro</li>
          <li>Aides des collectivités locales</li>
        </ul>
      `,
      auteur: "Jean Dupont",
      tempsLecture: "4 min",
      type: "actualite",
      badge: "Nouveau"
    },
    {
      id: 2,
      titre: "Tendances immobilières : ce qui change en 2025",
      date: "10 Mars 2025",
      categorie: "Immobilier",
      description: "Les tendances du marché immobilier français et les évolutions à prévoir pour l'année 2025.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80",
      contenu: `
        <h2>Le marché immobilier en 2025</h2>
        <p>L'année 2025 marque un tournant dans le marché immobilier français avec plusieurs évolutions majeures.</p>
        <h3>Les tendances à suivre</h3>
        <ul>
          <li>Montée en puissance de l'immobilier durable</li>
          <li>Digitalisation des transactions</li>
          <li>Nouvelles attentes des acheteurs</li>
        </ul>
      `,
      auteur: "Marie Laurent",
      tempsLecture: "5 min",
      type: "actualite",
      badge: "Trending"
    },
    {
      id: 3,
      titre: "Nouveaux matériaux écologiques pour la construction",
      date: "7 Mars 2025",
      categorie: "Travaux",
      description: "Découverte des nouveaux matériaux durables qui révolutionnent la construction.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
      contenu: `
        <h2>Matériaux innovants</h2>
        <p>Les matériaux écologiques gagnent du terrain dans le secteur de la construction.</p>
      `,
      auteur: "Pierre Martin",
      tempsLecture: "6 min",
      type: "actualite",
      badge: "Innovation"
    },
    {
      id: 4,
      titre: "Le financement participatif immobilier expliqué",
      date: "3 Mars 2025",
      categorie: "Financement",
      description: "Comprendre le crowdfunding immobilier et ses opportunités d'investissement.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
      contenu: `
        <h2>Financement participatif</h2>
        <p>Une nouvelle façon d'investir dans l'immobilier.</p>
      `,
      auteur: "Sophie Bernard",
      tempsLecture: "7 min",
      type: "actualite",
      badge: "Finance"
    },
    {
      id: 5,
      titre: "Les produits connectés pour la maison intelligente",
      date: "1 Mars 2025",
      categorie: "Produits",
      description: "Tour d'horizon des derniers produits connectés pour équiper votre habitat.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
      contenu: `
        <h2>Maison connectée</h2>
        <p>Les innovations technologiques au service de votre confort.</p>
      `,
      auteur: "Thomas Moreau",
      tempsLecture: "5 min",
      type: "actualite",
      badge: "Tech"
    },
    {
      id: 6,
      titre: "Rénovation de cuisine : les erreurs à éviter",
      date: "28 Février 2025",
      categorie: "Rénovation",
      description: "Conseils pratiques pour réussir la rénovation de votre cuisine sans mauvaises surprises.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
      contenu: `
        <h2>Rénovation cuisine</h2>
        <p>Les pièges à éviter pour un projet réussi.</p>
      `,
      auteur: "Laura Petit",
      tempsLecture: "6 min",
      type: "actualite",
      badge: "Conseil"
    }
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Toutes" || article.categorie === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategory]);

  const loadMoreArticles = async () => {
    setIsLoadingMore(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setVisibleArticles(prev => prev + 6);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedArticle(null), 300);
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Date non disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style >{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-elegant {
          font-family: 'Playfair Display', serif;
        }
        
        .font-modern {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <Header />

      {/* Hero Section réduite */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image réduite */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.90)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')`
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Titre réduit */}
            <h1 className="text-4xl md:text-8xl font-elegant font-light text-white mb-4 tracking-tight">
              Blogs et conseils
            </h1>

            {/* Sous-titre réduit */}
            <p className="text-lg font-modern font-light text-slate-200 mb-6 max-w-2xl mx-auto">
              Restez informé avec nos dernières actualités, guides et podcasts sur l'immobilier.
            </p>

            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10 transition-colors group-focus-within:text-white" />
                <Input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-slate-300 focus:bg-white/15 focus:ring-2 focus:ring-white/30 transition-all duration-300 text-base font-modern"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation par catégories */}
      <section className="bg-white/95 backdrop-blur-md border-b border-slate-100/50 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-lg font-modern font-medium whitespace-nowrap transition-all duration-300 border ${selectedCategory === category
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 pt-12">
        {/* Section 1: Carrousel des guides fondamentaux */}
        

        {/* Section 2: Actualités */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedCategory === "Toutes" ? "Tous nos actualités" : `Actualités - ${selectedCategory}`}
              </h2>
              <p className="text-slate-600 text-sm">
                {selectedCategory === "Toutes"
                  ? "Les dernières nouvelles et analyses"
                  : `Nouvelles spécifiques à ${selectedCategory}`
                }
              </p>
            </div>
            <div className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200"></div>
                </div>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && filteredArticles.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredArticles.slice(0, visibleArticles).map((article) => (
                  <div
                    key={article.id}
                    className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleReadMore(article)}
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.titre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Badge principal */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 shadow-lg">
                          {article.categorie}
                        </span>
                      </div>
                      {/* Badge supplémentaire */}
                      {article.badge && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
                            {article.badge}
                          </span>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Lire</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleArticles < filteredArticles.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreArticles}
                    disabled={isLoadingMore}
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-6 py-3 font-semibold border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Charger plus</span>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Results State */}
          {!isLoading && filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Aucun article ne correspond à votre recherche.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Toutes");
                  }}
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 py-2 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </section>

       
      </div>

      {/* Section Conseils avec Onglets */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Conseils pratiques
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Des guides détaillés et astuces pour vous accompagner dans vos projets immobiliers
            </p>
          </motion.div>

          {/* Menu des onglets */}
          <LayoutGroup>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 flex-wrap">
              {Object.entries(conseilsData).map(([key, data]) => {
                const IconComponent = data.icon;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveConseilTab(key)}
                    className={`relative px-8 py-4 rounded-3xl font-semibold text-base transition-all duration-300 flex items-center gap-3 border-2 ${
                      activeConseilTab === key
                        ? `bg-gradient-to-r ${data.couleur} text-white border-transparent shadow-lg`
                        : 'bg-gradient-to-br from-white to-slate-50 text-slate-900 border-slate-200/60 hover:bg-slate-100'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={{
                        scale: activeConseilTab === key ? 1.15 : 1,
                        rotate: activeConseilTab === key ? 5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </motion.div>
                    <motion.span
                      animate={{
                        x: activeConseilTab === key ? 2 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {data.titre}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Contenu des onglets */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeConseilTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200/40"
            >
              <div className=" mx-auto">
                <h3 className="text-3xl font-bold text-slate-900 mb-8">
                  {conseilsData[activeConseilTab].titre}
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {conseilsData[activeConseilTab].conseils.map((conseil, idx) => (
                    <motion.div
                      key={conseil.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="mb-4">
                        <div className={`w-full overflow-hidden h-40 rounded-xl bg-gradient-to-br ${conseilsData[activeConseilTab].couleur} mb-4`}>
                          <img src={conseil.image} alt={conseil.titre} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">
                          {conseil.titre}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          {conseil.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                          Points clés:
                        </p>
                        {conseil.tips.map((tip, tipIdx) => (
                          <div key={tipIdx} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${conseilsData[activeConseilTab].couleur} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedConseil({ ...conseil, categorie: activeConseilTab });
                          setIsConseilModalOpen(true);
                        }}
                        className={`w-full mt-6 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r ${conseilsData[activeConseilTab].couleur} hover:shadow-lg hover:scale-105`}>
                        En savoir plus
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Modal Conseils */}
      {isConseilModalOpen && selectedConseil && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsConseilModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Header */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={selectedConseil.image}
                alt={selectedConseil.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setIsConseilModalOpen(false)}
                className="absolute top-6 right-6 bg-white/90 hover:bg-white text-slate-900 rounded-full p-2 transition-all duration-300 shadow-lg"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h2 className="text-4xl font-bold mb-2">{selectedConseil.titre}</h2>
                <p className="text-slate-200 text-lg">{selectedConseil.description}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Points clés à retenir</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {selectedConseil.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${conseilsData[selectedConseil.categorie]?.couleur} flex items-center justify-center flex-shrink-0 mt-1`}>
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 p-8 text-center">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Prêt à passer à l'action ?</h4>
                  <p className="text-slate-600 mb-6">Contactez nos experts pour une assistance personnalisée</p>
                  <button className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r ${conseilsData[selectedConseil.categorie]?.couleur} hover:shadow-lg hover:scale-105`}>
                    Demander un conseil personnalisé
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Article Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl h-[95vh] overflow-hidden rounded-3xl border-0 shadow-2xl bg-white p-0">
          <DialogHeader className="px-8 py-2 flex items-center justify-center border-b border-slate-100">
            <DialogTitle className="mx-auto text-4xl font-semibold text-slate-700 flex items-center">
              <BookOpen className="w-8 h-8 mr-2 text-slate-600" />
              Détail de l'article
            </DialogTitle>
          </DialogHeader>

          {selectedArticle && (
            <div className="flex flex-1 h-full">
              {/* Colonne Image - Fixe */}
              <div className="w-2/5 relative">
                <div
                  className="relative h-full flex items-center w-full rounded-lg bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${selectedArticle.image})` }}
                >
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Content superposé sur l'image */}
                  <div className=" bottom-0 left-0 right-0 p-8 text-white">
                    <div className="absolute top-2 right-2 flex flex-wrap gap-2 mb-4">
                      <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                        {selectedArticle.categorie}
                      </span>
                      {selectedArticle.badge && (
                        <span className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          {selectedArticle.badge}
                        </span>
                      )}
                    </div>

                    <h1 className="text-3xl font-bold text-center leading-tight drop-shadow-lg">
                      {selectedArticle.titre}
                    </h1>

                    <div className="absolute bottom-10 flex justif gap-3 text-white/90 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-3" />
                        <span>{formatDate(selectedArticle.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-3" />
                        <span>{selectedArticle.auteur}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-3" />
                        <span>{selectedArticle.tempsLecture} de lecture</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne Contenu - Scrollable */}
              <div className="w-3/5 h-[530px] flex flex-col">
                {/* Header du contenu */}
                <div className="px-8 py-6 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-600 text-sm">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        2.4K vues
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2" />
                        184 j'aime
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1  overflow-y-auto">
                  <div className="px-10">
                    <div
                      className="prose prose-lg max-w-none 
                          prose-headings:text-slate-900 prose-headings:font-bold
                          prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b prose-h1:pb-4 prose-h1:border-slate-200
                          prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-0 prose-h2:text-slate-800
                          prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-slate-700
                          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
                          prose-strong:text-slate-900 prose-strong:font-semibold
                          prose-em:text-slate-600 prose-em:italic
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 prose-blockquote:my-8
                          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                          prose-li:text-slate-700 prose-li:mb-2 prose-li:leading-relaxed
                          prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-slate-800 prose-code:font-mono
                          prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-6
                          prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-8 prose-img:border prose-img:border-slate-200
                          prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:rounded-lg prose-table:overflow-hidden
                          prose-th:bg-slate-100 prose-th:text-slate-900 prose-th:font-semibold prose-th:p-4 prose-th:border prose-th:border-slate-300
                          prose-td:p-4 prose-td:border prose-td:border-slate-300 prose-td:text-slate-700
                          prose-hr:border-slate-200 prose-hr:my-8"
                      dangerouslySetInnerHTML={{ __html: selectedArticle.contenu }}
                    />
                  </div>
                </div>

                {/* Footer avec actions */}
                <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/95 border-t border-slate-100 px-10 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all duration-200 font-medium">
                        <ThumbsUp className="w-4 h-4" />
                        J'aime
                      </button>
                      <button className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all duration-200 font-medium">
                        <MessageCircle className="w-4 h-4" />
                        Commenter
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={closeDialog}
                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Fermer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Actualites;