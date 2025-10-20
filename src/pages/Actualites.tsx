import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Calendar, ArrowRight, ChevronDown, X, Clock, User } from "lucide-react";
import "@/styles/actualite.css";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import home from '@/assets/house.jpg'

const categories = ["Toutes", "Immobilier", "Travaux", "Financement", "Produits", "Rénovation"];

const Actualites = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [visibleArticles, setVisibleArticles] = useState(6);
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
        // En cas d'erreur, utiliser les données de secours
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
      image: "/api/placeholder/400/250",
      contenu: `
        <h2>Les aides financières pour 2025</h2>
        <p>Le gouvernement a annoncé de nouvelles mesures pour accompagner les propriétaires dans leurs projets de rénovation énergétique.</p>
      `,
      auteur: "Jean Dupont",
      tempsLecture: "4 min",
    },
    {
      id: 2,
      titre: "Tendances immobilières : ce qui change en 2025",
      date: "10 Mars 2025",
      categorie: "Immobilier",
      description: "Les tendances du marché immobilier français et les évolutions à prévoir pour l'année 2025.",
      image: "/api/placeholder/400/250",
      contenu: `
        <h2>Le marché immobilier en 2025</h2>
        <p>L'année 2025 marque un tournant dans le marché immobilier français.</p>
      `,
      auteur: "Marie Laurent",
      tempsLecture: "5 min",
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
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 800));
      setVisibleArticles(prev => prev + 3);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
     
      
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 backdrop-blur-sm z-10"></div>
          <img src={home} alt="" className="absolute -top-28 w-screen h-screen"/>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Actualités
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-in-up delay-100">
              Restez informé des dernières tendances et actualités immobilières
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        <Card className="p-6 shadow-lg border-0 rounded-2xl backdrop-blur-sm bg-white/95 animate-fade-in-up delay-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border-border focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 py-12">
        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            {isLoading && " - Chargement..."}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="flex justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <span>Chargement des articles...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="text-red-500 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && !error && filteredArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.slice(0, visibleArticles).map((article, index) => (
                <Card 
                  key={article.id} 
                  className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <div 
                      className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 relative bg-cover bg-center"
                      style={{ 
                        backgroundImage: article.image ? `url(${article.image})` : 'none',
                        backgroundColor: !article.image ? '#f1f5f9' : 'transparent'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {article.categorie}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(article.date)}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {article.titre}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="link" 
                        className="p-0 text-primary font-semibold group/btn transition-all duration-300"
                        onClick={() => handleReadMore(article)}
                      >
                        Lire la suite
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.tempsLecture}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {visibleArticles < filteredArticles.length && (
              <div className="text-center mt-12 animate-fade-in">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={loadMoreArticles}
                  disabled={isLoadingMore}
                  className="rounded-full px-8 py-6 border-2 hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      Chargement...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      VOIR PLUS D'ARTICLES
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          /* No Results State */
          !isLoading && !error && (
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  Aucun article ne correspond à votre recherche. Essayez d'autres termes.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Toutes");
                  }}
                  variant="default"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          )
        )}
      </section>

      {/* Article Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Détail de l'article</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full"
              onClick={closeDialog}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          {selectedArticle && (
            <article className="pt-8">
              {/* Header */}
              <div className="mb-6">
                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {selectedArticle.categorie}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {selectedArticle.titre}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
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

              {/* Image */}
              <div 
                className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-8 bg-cover bg-center"
                style={{ 
                  backgroundImage: selectedArticle.image ? `url(${selectedArticle.image})` : 'none',
                  backgroundColor: !selectedArticle.image ? '#f1f5f9' : 'transparent'
                }}
              />

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.contenu }}
              />

              {/* Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button onClick={closeDialog} className="bg-red-500">
                  Fermer
                </Button>
              </div>
            </article>
          )}
        </DialogContent>
      </Dialog>

   

    </div>
  );
};

export default Actualites;