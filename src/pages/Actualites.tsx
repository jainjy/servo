import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Search, ChevronDown, Lightbulb, Home, BarChart3, Banknote, X, 
  Eye, Heart, Calendar, User, Clock, BookOpen, Download, MessageCircle, 
  ThumbsUp, Share2, Bookmark, Send, MoreVertical, Flag, Trash2, Edit 
} from "lucide-react";
import api from "@/lib/api";
import ArticleModal from "@/components/ArticleModal";
import ConseilModal from "@/components/ConseilModal";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Allpub from "@/components/Allpub";

const categories = ["Toutes", "Immobilier", "Travaux", "Financement", "Produits", "Rénovation"];

// Types
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  repliesCount?: number;
  isEdited?: boolean;
  updatedAt?: string;
}

interface Article {
  id: string;
  titre: string;
  date: string;
  dateFormatted?: string;
  categorie: string;
  description: string;
  image: string;
  contenu: string;
  auteur: string;
  auteurId?: string;
  auteurAvatar?: string;
  tempsLecture: string;
  tags?: string[];
  views: number;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  shares: number;
  comments?: Comment[];
}

const Actualites = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [visibleArticles, setVisibleArticles] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeConseilTab, setActiveConseilTab] = useState("immobilier");
  const [selectedConseil, setSelectedConseil] = useState(null);
  const [isConseilModalOpen, setIsConseilModalOpen] = useState(false);
  
  // États pour les commentaires
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showCommentOptions, setShowCommentOptions] = useState<string | null>(null);

  // Charger les articles depuis l'API
  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== "Toutes") params.category = selectedCategory;
      
      const response = await api.get('/articles', { params });
      
      if (response.data.success) {
        setArticles(response.data.data);
      } else {
        throw new Error(response.data.error || 'Erreur lors du chargement des articles');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des articles:', err);
      setError(err.message || 'Erreur lors du chargement des articles');
      toast.error("Erreur lors du chargement des articles", {
        position: "top-right",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchTerm, selectedCategory]);

  // Fonctions pour les interactions
  const handleLikeArticle = async (articleId: string) => {
    try {
      const response = await api.post(`/articles/${articleId}/like`);
      
      if (response.data.success) {
        setArticles(prev => prev.map(article => {
          if (article.id === articleId) {
            return {
              ...article,
              likes: response.data.data.likes,
              isLiked: response.data.data.liked
            };
          }
          return article;
        }));

        if (selectedArticle?.id === articleId) {
          setSelectedArticle(prev => prev ? {
            ...prev,
            likes: response.data.data.likes,
            isLiked: response.data.data.liked
          } : null);
        }

        if (response.data.data.liked) {
          toast.success("Vous aimez cet article", {
            position: "top-right",
            duration: 3000,
          });
        } else {
          toast.success("Vous n'aimez plus cet article", {
            position: "top-right",
            duration: 3000,
          });
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du like:', error);
      toast.error(error.response?.data?.error || "Erreur lors du like", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleBookmarkArticle = (articleId: string) => {
    toast.info("Fonctionnalité favoris à venir", {
      position: "top-right",
      duration: 3000,
    });
  };

  const handleShareArticle = async (article: Article) => {
    const shareData = {
      title: article.titre,
      text: article.description,
      url: `${window.location.origin}/blog/article/${article.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        
        // Enregistrer le partage côté serveur
        await api.post(`/articles/${article.id}/share`);
        
        toast.success("Article partagé avec succès !", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Lien copié dans le presse-papier !", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast.error("Erreur lors du partage", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleDownloadArticle = (article: Article) => {
    try {
      const articleContent = `
${article.titre}
${article.dateFormatted || article.date} | ${article.auteur} | ${article.tempsLecture} de lecture

${article.description}

${article.contenu.replace(/<[^>]*>/g, '')}

---
Article partagé depuis Immobilier & Conseils
${window.location.origin}/blog/article/${article.id}
      `;

      const blob = new Blob([articleContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `article-${article.id}-${article.titre.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Article téléchargé avec succès !", {
        position: "top-right",
        duration: 3000,
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error("Erreur lors du téléchargement", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedArticle || !user) return;

    try {
      const response = await api.post(`/articles/${selectedArticle.id}/comments`, {
        content: newComment
      });

      if (response.data.success) {
        const newCommentData = response.data.data;
        
        setSelectedArticle(prev => prev ? {
          ...prev,
          comments: [newCommentData, ...(prev.comments || [])]
        } : null);
        
        setNewComment("");
        
        toast.success("Commentaire ajouté avec succès !", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error(error.response?.data?.error || "Erreur lors de l'ajout du commentaire", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!selectedArticle || !user) return;

    try {
      const response = await api.post(`/articles/comments/${commentId}/like`);
      
      if (response.data.success) {
        const updatedComments = (selectedArticle.comments || []).map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: response.data.data.likes,
              isLiked: response.data.data.liked
            };
          }
          return comment;
        });

        setSelectedArticle(prev => prev ? {
          ...prev,
          comments: updatedComments
        } : null);

        toast.success("Réaction enregistrée", {
          position: "top-right",
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error('Erreur lors du like du commentaire:', error);
      toast.error(error.response?.data?.error || "Erreur lors de la réaction", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleEditComment = (commentId: string) => {
    const comment = selectedArticle?.comments?.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditCommentText(comment.content);
      setShowCommentOptions(null);
    }
  };

  const handleSaveEditComment = async () => {
    if (!selectedArticle || !editingCommentId || !user) return;

    try {
      const response = await api.put(`/articles/comments/${editingCommentId}`, {
        content: editCommentText
      });

      if (response.data.success) {
        const updatedComments = (selectedArticle.comments || []).map(comment => {
          if (comment.id === editingCommentId) {
            return response.data.data;
          }
          return comment;
        });

        setSelectedArticle(prev => prev ? {
          ...prev,
          comments: updatedComments
        } : null);
        
        setEditingCommentId(null);
        setEditCommentText("");
        
        toast.success("Commentaire modifié avec succès", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la modification du commentaire:', error);
      toast.error(error.response?.data?.error || "Erreur lors de la modification", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedArticle || !user) return;

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      const response = await api.delete(`/articles/comments/${commentId}`);
      
      if (response.data.success) {
        const updatedComments = (selectedArticle.comments || []).filter(comment => comment.id !== commentId);
        
        setSelectedArticle(prev => prev ? {
          ...prev,
          comments: updatedComments
        } : null);
        
        setShowCommentOptions(null);
        
        toast.success("Commentaire supprimé", {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      toast.error(error.response?.data?.error || "Erreur lors de la suppression", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const loadMoreArticles = async () => {
    setIsLoadingMore(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setVisibleArticles(prev => prev + 6);
    } catch (error) {
      toast.error("Erreur lors du chargement", {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleReadMore = async (article: Article) => {
    try {
      const response = await api.get(`/articles/${article.id}`);
      
      if (response.data.success) {
        setSelectedArticle(response.data.data);
        setIsDialogOpen(true);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'article:', error);
      toast.error(error.response?.data?.error || "Erreur lors du chargement de l'article", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedArticle(null), 300);
  };

  const formatDate = (dateString: string) => {
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return formatDate(dateString);
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Toutes" || article.categorie === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Styles inline pour les polices */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
          .font-elegant { font-family: 'Playfair Display', serif; }
          .font-modern { font-family: 'Inter', sans-serif; }
        `
      }} />

      

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 lg:pt-20 lg:pb-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.90)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')`
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-elegant uppercase font-light text-white mb-4 tracking-tight">
              Blogs et conseils
            </h1>

            <p className="text-sm md:text-md font-modern font-light text-slate-200 mb-6 max-w-2xl mx-auto px-4">
              Restez informé avec nos dernières actualités, guides et podcasts sur l'immobilier.
            </p>

            <div className="max-w-2xl mx-auto px-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10 transition-colors group-focus-within:text-white" />
                <Input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-slate-300 focus:bg-white/15 focus:ring-2 focus:ring-white/30 transition-all duration-300 text-sm sm:text-base font-modern"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Allpub
            title="Offres spéciales"
            description="Bénéficiez de réductions exclusives sur nos meilleurs services."
            image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
            background="bg-white"
            textbg="text-slate-900"
          />

      {/* Navigation par catégories */}
      <section className="bg-white/95 backdrop-blur-md border-b border-slate-100/50 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 sm:py-3 gap-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg font-modern font-medium whitespace-nowrap transition-all duration-300 border text-xs sm:text-sm md:text-base flex-shrink-0 ${selectedCategory === category
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
      <div className="container mx-auto px-4 pt-8 sm:pt-10 lg:pt-12">
        {/* Section Actualités */}
        <section className="mb-12 sm:mb-14 lg:mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                {selectedCategory === "Toutes" ? "Tous nos actualités" : `Actualités - ${selectedCategory}`}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base">
                {selectedCategory === "Toutes"
                  ? "Les dernières nouvelles et analyses"
                  : `Nouvelles spécifiques à ${selectedCategory}`
                }
              </p>
            </div>
            <div className="text-slate-500 text-xs sm:text-sm font-medium bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200"></div>
                  <div className="p-3 sm:p-4">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && filteredArticles.length > 0 && (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredArticles.slice(0, visibleArticles).map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleReadMore(article)}
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.titre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold border border-white/20 shadow-lg">
                          {article.categorie}
                        </span>
                      </div>
                      {article.tags && article.tags.length > 0 && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium shadow-lg">
                            {article.tags[0]}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs sm:text-sm">Lire l'article</span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2">
                        {article.titre}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{formatDate(article.date)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.tempsLecture}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!user) {
                                toast.error("Veuillez vous connecter pour aimer un article", {
                                  position: "top-right",
                                  duration: 3000,
                                });
                                return;
                              }
                              handleLikeArticle(article.id);
                            }}
                            className={`flex items-center gap-1 ${article.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                          >
                            <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-red-500' : ''}`} />
                            <span className="text-xs">{article.likes}</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmarkArticle(article.id);
                            }}
                            className="text-slate-500 hover:text-blue-500"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{article.comments || 0}</span>
                          <MessageCircle className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleArticles < filteredArticles.length && (
                <div className="text-center mt-8 sm:mt-10 lg:mt-12">
                  <Button
                    onClick={loadMoreArticles}
                    disabled={isLoadingMore}
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 font-semibold border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Charger plus d'articles</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* No Results State */}
          {!isLoading && filteredArticles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 sm:py-16 lg:py-20"
            >
              <div className="max-w-md mx-auto px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="h-6 sm:h-8 w-6 sm:w-8 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Aucun résultat trouvé</h3>
                <p className="text-slate-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
                  Aucun article ne correspond à votre recherche. Essayez d'autres termes ou réinitialisez les filtres.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Toutes");
                  }}
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Réinitialiser la recherche
                </Button>
              </div>
            </motion.div>
          )}
        </section>
      </div>

      {/* Article Modal avec toutes les fonctionnalités */}
      <ArticleModal
        isOpen={isDialogOpen}
        onClose={closeDialog}
        article={selectedArticle}
        onLike={handleLikeArticle}
        onBookmark={handleBookmarkArticle}
        onShare={handleShareArticle}
        onDownload={handleDownloadArticle}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onEditComment={handleEditComment}
        onSaveEditComment={handleSaveEditComment}
        onDeleteComment={handleDeleteComment}
        newComment={newComment}
        setNewComment={setNewComment}
        editingCommentId={editingCommentId}
        setEditingCommentId={setEditingCommentId}
        editCommentText={editCommentText}
        setEditCommentText={setEditCommentText}
        showCommentOptions={showCommentOptions}
        setShowCommentOptions={setShowCommentOptions}
        formatTimeAgo={formatTimeAgo}
        user={user}
      />

      <ConseilModal
        isOpen={isConseilModalOpen}
        onClose={() => setIsConseilModalOpen(false)}
        conseil={selectedConseil}
        conseilsData={{}}
      />
    </div>
  );
};

export default Actualites;