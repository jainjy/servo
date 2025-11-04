import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Dans PartnersPage.tsx et ServicesPages.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Calendar, ArrowRight, ChevronDown, X, Clock, User, Play, Headphones } from "lucide-react";
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
              Actualités
            </h1>
            
            {/* Sous-titre réduit */}
            <p className="text-lg font-modern font-light text-slate-200 mb-6 max-w-2xl mx-auto">
              L'excellence immobilière à portée de main
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
                className={`px-5 py-2.5 rounded-lg font-modern font-medium whitespace-nowrap transition-all duration-300 border ${
                  selectedCategory === category 
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
      <div className="container mx-auto px-4 py-12">
        {/* Section 1: Carrousel des guides fondamentaux */}
        {selectedCategory === "Toutes" && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Guides Fondamentaux</h2>
                <p className="text-slate-600 text-sm">Les essentiels pour maîtriser l'immobilier</p>
              </div>
              <button className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition-all duration-300 group text-sm">
                Explorer
                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {guidesFondamentaux.map((guide) => (
                <div 
                  key={guide.id}
                  className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleReadMore(guide)}
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img
                      src={guide.image}
                      alt={guide.titre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 shadow-lg">
                        {guide.badge}
                      </span>
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Découvrir</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Actualités */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedCategory === "Toutes" ? "Actualités du Marché" : `Actualités - ${selectedCategory}`}
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

        {/* Section 3: Articles Podcast */}
        {selectedCategory === "Toutes" && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Podcasts Immobiliers</h2>
                <p className="text-slate-600 text-sm">Écoutez les experts du secteur</p>
              </div>
              <button className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition-all duration-300 group text-sm">
                Tous les podcasts
                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articlesPodcast.map((podcast) => (
                <div 
                  key={podcast.id}
                  className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleReadMore(podcast)}
                >
                  <div className="relative w-full aspect-[3/2] overflow-hidden">
                    <img
                      src={podcast.image}
                      alt={podcast.titre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Contenu au centre */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 shadow-lg">
                          {podcast.badge}
                        </span>
                        {/* Bouton play */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition-all duration-300">
                          <Play className="h-4 w-4 text-slate-900 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Écouter</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Article Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-2xl bg-white p-0">
          <DialogHeader>
            <DialogTitle className="sr-only">Détail de l'article</DialogTitle>
            <button
              onClick={closeDialog}
              className="absolute right-6 top-6 rounded-xl hover:bg-slate-100 w-10 h-10 flex items-center justify-center transition-all duration-300 z-50"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </DialogHeader>
          
          {selectedArticle && (
            <article className="pt-6">
              {/* Header */}
              <div className="px-8 pb-6 border-b border-slate-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedArticle.categorie}
                  </span>
                  {selectedArticle.badge && (
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedArticle.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {selectedArticle.titre}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(selectedArticle.date)}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {selectedArticle.auteur}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedArticle.tempsLecture} de lecture
                  </div>
                </div>
              </div>

              {/* Image hero */}
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.titre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-8 py-8">
                <div 
                  className="prose prose-base max-w-none text-slate-700 prose-headings:text-slate-900 prose-headings:font-normal prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-blue-600 prose-strong:text-slate-900 prose-strong:font-semibold leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.contenu }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 px-8 pb-8">
                <button 
                  onClick={closeDialog}
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  Fermer l'article
                </button>
              </div>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Actualites;