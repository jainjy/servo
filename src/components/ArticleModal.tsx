// components/ArticleModal.tsx
import { useState, useRef, useEffect } from "react";
import { 
  X, Bookmark, Share2, Download, ThumbsUp, MessageCircle, BookOpen, 
  Eye, Heart, Calendar, User, Clock, Send, MoreVertical, Flag, 
  Trash2, Edit, ChevronUp, ChevronDown, Loader2 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

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

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: any;
  onLike: (articleId: string) => void;
  onBookmark: (articleId: string) => void;
  onShare: (article: any) => void;
  onDownload: (article: any) => void;
  onAddComment: () => Promise<void>; // Changé pour retourner Promise
  onLikeComment: (commentId: string) => Promise<void>; // Changé pour retourner Promise
  onEditComment: (commentId: string) => void;
  onSaveEditComment: () => Promise<void>; // Changé pour retourner Promise
  onDeleteComment: (commentId: string) => Promise<void>; // Changé pour retourner Promise
  newComment: string;
  setNewComment: (value: string) => void;
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  editCommentText: string;
  setEditCommentText: (text: string) => void;
  showCommentOptions: string | null;
  setShowCommentOptions: (id: string | null) => void;
  formatTimeAgo: (date: string) => string;
  user?: any;
}

const ArticleModal = ({
  isOpen,
  onClose,
  article,
  onLike,
  onBookmark,
  onShare,
  onDownload,
  onAddComment,
  onLikeComment,
  onEditComment,
  onSaveEditComment,
  onDeleteComment,
  newComment,
  setNewComment,
  editingCommentId,
  setEditingCommentId,
  editCommentText,
  setEditCommentText,
  showCommentOptions,
  setShowCommentOptions,
  formatTimeAgo,
  user
}: ArticleModalProps) => {
  // CORRECTION: Vérifiez d'abord si l'article existe
  if (!article) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Chargement de l'article...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // MAINTENANT les hooks sont déclarés (toujours dans le même ordre)
  const [commentSort, setCommentSort] = useState<'recent' | 'popular'>('recent');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [savingEditCommentId, setSavingEditCommentId] = useState<string | null>(null);
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

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

  const sortedComments = (article.comments || []).sort((a: Comment, b: Comment) => {
    if (commentSort === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.likes - a.likes;
    }
  });

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingCommentId) {
        await handleSaveEditCommentClick();
      } else {
        await handleAddCommentClick();
      }
    }
  };

  const handleShareClick = () => {
    onShare(article);
  };

  const handleDownloadClick = () => {
    onDownload(article);
  };

  const handleBookmarkClick = () => {
    onBookmark(article.id);
  };

  const handleLikeClick = () => {
    if (!user) {
      // Gérer la redirection vers la connexion
      return;
    }
    onLike(article.id);
  };

  const handleEditCommentClick = (commentId: string) => {
    onEditComment(commentId);
  };

  const handleSaveEditCommentClick = async () => {
    if (!selectedArticle || !editingCommentId || !user) return;

    setSavingEditCommentId(editingCommentId);
    try {
      await onSaveEditComment();
    } finally {
      setSavingEditCommentId(null);
    }
  };

  const handleDeleteCommentClick = async (commentId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    setDeletingCommentId(commentId);
    try {
      await onDeleteComment(commentId);
    } finally {
      setDeletingCommentId(null);
      setShowCommentOptions(null);
    }
  };

  const handleAddCommentClick = async () => {
    if (!newComment.trim() || !article || !user) return;

    setIsCommenting(true);
    try {
      await onAddComment();
    } finally {
      setIsCommenting(false);
    }
  };

  const handleLikeCommentClick = async (commentId: string) => {
    if (!user) {
      // Gérer la redirection vers la connexion
      return;
    }

    setLikingCommentId(commentId);
    try {
      await onLikeComment(commentId);
    } finally {
      setLikingCommentId(null);
    }
  };

  const scrollToComments = () => {
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ 
        top: contentRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      setShowScrollTop(scrollTop > 100);
      setShowScrollBottom(scrollTop + clientHeight < scrollHeight - 100);
    }
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0 });
      }, 100);
    }
  }, [isOpen]);

  // Correction: ajout de selectedArticle pour la compatibilité
  const selectedArticle = article;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] overflow-scroll rounded-3xl border-0 shadow-2xl bg-white p-0">
        <DialogHeader className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 flex items-center justify-center border-b border-slate-100">
          <DialogTitle className="mx-auto text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-700 flex items-center">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mr-2 text-slate-600" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">Détail de l'article</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 h-full">
          {/* Colonne Image - Fixe */}
          <div className="lg:w-2/5 w-full h-48 sm:h-56 md:h-64 lg:h-full relative lg:sticky lg:top-0">
            <div
              className="relative h-full w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${article.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-wrap gap-1 sm:gap-2">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                    {article.categorie}
                  </Badge>
                  {article.tags && article.tags.length > 0 && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                      {article.tags[0]}
                    </Badge>
                  )}
                </div>

                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight drop-shadow-lg pr-8 sm:pr-12">
                  {article.titre}
                </h1>

                <div className="flex flex-wrap gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm mt-2 sm:mt-3">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>{article.auteur}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>{article.tempsLecture} de lecture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Contenu - Scrollable */}
          <div className="lg:w-3/5 w-full h-full flex flex-col relative">
            {/* Header du contenu */}
            <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-slate-600 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{(article.views || 0).toLocaleString()} vues</span>
                  </div>
                  <div className="flex items-center">
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{article.shares || 0} partages</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmarkClick}
                    className={`p-1.5 sm:p-2 ${article.isBookmarked ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    aria-label={article.isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${article.isBookmarked ? 'fill-blue-600' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShareClick}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600"
                    aria-label="Partager"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contenu scrollable avec barre de défilement personnalisée */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400"
            >
              <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
                {/* Actions rapides */}
                <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLikeClick}
                      disabled={!user}
                      className={`flex items-center gap-2 ${article.isLiked ? 'bg-red-50 border-red-200 text-red-600' : ''} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-red-600' : ''}`} />
                      <span>{article.likes || 0}</span>
                      <span className="hidden sm:inline">J'aime</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={scrollToComments}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{article.comments?.length || 0}</span>
                      <span className="hidden sm:inline">Commentaires</span>
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadClick}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Télécharger</span>
                  </Button>
                </div>

                {/* Contenu de l'article */}
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-12
                      prose-headings:text-slate-900 prose-headings:font-bold
                      prose-h1:text-lg sm:prose-h1:text-xl md:prose-h1:text-2xl prose-h1:mb-4 sm:prose-h1:mb-6 prose-h1:mt-4 sm:prose-h1:mt-8 prose-h1:border-b prose-h1:pb-2 sm:prose-h1:pb-3 md:prose-h1:pb-4 prose-h1:border-slate-200
                      prose-h2:text-base sm:prose-h2:text-lg md:prose-h2:text-xl prose-h2:mb-3 sm:prose-h2:mb-4 prose-h2:mt-0 prose-h2:text-slate-800
                      prose-h3:text-sm sm:prose-h3:text-base md:prose-h3:text-lg prose-h3:mb-2 sm:prose-h3:mb-3 prose-h3:mt-4 sm:prose-h3:mt-6 prose-h3:text-slate-700
                      prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 md:prose-p:mb-6
                      prose-ul:pl-4 sm:prose-ul:pl-5 md:prose-ul:pl-6 prose-ul:mb-3 sm:prose-ul:mb-4 md:prose-ul:mb-6
                      prose-ol:pl-4 sm:prose-ol:pl-5 md:prose-ol:pl-6 prose-ol:mb-3 sm:prose-ol:mb-4 md:prose-ol:mb-6
                      prose-li:text-slate-700 prose-li:mb-1 sm:prose-li:mb-2 prose-li:leading-relaxed
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: article.contenu }}
                />

                {/* Section Commentaires */}
                <div ref={commentsSectionRef} className="mt-8 sm:mt-12">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                      Commentaires ({article.comments?.length || 0})
                    </h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={commentSort}
                        onChange={(e) => setCommentSort(e.target.value as 'recent' | 'popular')}
                        className="text-xs sm:text-sm border border-slate-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-colors"
                      >
                        <option value="recent">Plus récents</option>
                        <option value="popular">Plus populaires</option>
                      </select>
                    </div>
                  </div>

                  {/* Formulaire de commentaire */}
                  {user ? (
                    <div className="mb-6 sm:mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Ajouter un commentaire..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="min-h-[80px] resize-none border-slate-200 focus:border-slate-400"
                            disabled={!user || isCommenting}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">
                              Appuyez sur Entrée pour envoyer
                            </span>
                            <Button
                              onClick={handleAddCommentClick}
                              disabled={!newComment.trim() || !user || isCommenting}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-6"
                            >
                              {isCommenting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Envoi...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Commenter
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 sm:mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-blue-700 text-sm">
                        ⚠️ Veuillez vous connecter pour ajouter un commentaire.
                      </p>
                    </div>
                  )}

                  {/* Liste des commentaires */}
                  <AnimatePresence>
                    {sortedComments.length > 0 ? (
                      <div className="space-y-4 sm:space-y-6">
                        {sortedComments.map((comment: Comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                          >
                            {editingCommentId === comment.id ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="min-h-[100px] resize-none"
                                  autoFocus
                                  disabled={savingEditCommentId === comment.id}
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditCommentText("");
                                    }}
                                    disabled={savingEditCommentId === comment.id}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={handleSaveEditCommentClick}
                                    disabled={!editCommentText.trim() || savingEditCommentId === comment.id}
                                  >
                                    {savingEditCommentId === comment.id ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enregistrement...
                                      </>
                                    ) : (
                                      'Enregistrer'
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                                      <AvatarImage src={comment.userAvatar} />
                                      <AvatarFallback>
                                        {comment.userName.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                                        {comment.userName}
                                      </h4>
                                      <p className="text-xs text-slate-500">
                                        {formatTimeAgo(comment.date)}
                                        {comment.isEdited && " · Modifié"}
                                      </p>
                                    </div>
                                  </div>
                                  {(comment.userId === user?.id || user?.role === 'admin') && (
                                    <DropdownMenu open={showCommentOptions === comment.id} onOpenChange={(open) => setShowCommentOptions(open ? comment.id : null)}>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deletingCommentId === comment.id}>
                                          {deletingCommentId === comment.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <MoreVertical className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {comment.userId === user?.id && (
                                          <>
                                            <DropdownMenuItem 
                                              onClick={() => handleEditCommentClick(comment.id)}
                                              disabled={savingEditCommentId === comment.id}
                                            >
                                              <Edit className="h-4 w-4 mr-2" />
                                              Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleDeleteCommentClick(comment.id)}
                                              className="text-red-600"
                                              disabled={deletingCommentId === comment.id}
                                            >
                                              {deletingCommentId === comment.id ? (
                                                <>
                                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                  Suppression...
                                                </>
                                              ) : (
                                                <>
                                                  <Trash2 className="h-4 w-4 mr-2" />
                                                  Supprimer
                                                </>
                                              )}
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                        {user?.role === 'admin' && comment.userId !== user?.id && (
                                          <DropdownMenuItem
                                            onClick={() => handleDeleteCommentClick(comment.id)}
                                            className="text-red-600"
                                            disabled={deletingCommentId === comment.id}
                                          >
                                            {deletingCommentId === comment.id ? (
                                              <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Suppression...
                                              </>
                                            ) : (
                                              <>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Supprimer (Admin)
                                              </>
                                            )}
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem>
                                          <Flag className="h-4 w-4 mr-2" />
                                          Signaler
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                                <p className="mt-2 sm:mt-3 text-slate-700 text-sm sm:text-base">
                                  {comment.content}
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLikeCommentClick(comment.id)}
                                    disabled={!user || likingCommentId === comment.id}
                                    className={`flex items-center gap-1 h-8 px-2 ${comment.isLiked ? 'text-red-500' : 'text-slate-500'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {likingCommentId === comment.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? 'fill-red-500' : ''}`} />
                                    )}
                                    <span className="text-xs">{comment.likes}</span>
                                  </Button>
                                  {comment.repliesCount && comment.repliesCount > 0 && (
                                    <span className="text-xs text-slate-500">
                                      {comment.repliesCount} réponse{comment.repliesCount > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                        <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Boutons de navigation scroll */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={scrollToTop}
                  className="absolute right-4 top-20 bg-white border border-slate-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-20"
                  aria-label="Remonter en haut"
                >
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                </motion.button>
              )}
              
              {showScrollBottom && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={scrollToBottom}
                  className="absolute right-4 bottom-20 bg-white border border-slate-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-20"
                  aria-label="Descendre en bas"
                >
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Footer avec actions */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/95 border-t border-slate-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 lg:py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLikeClick}
                    disabled={!user}
                    className={`flex items-center gap-1 sm:gap-2 ${article.isLiked ? 'bg-red-50 border-red-200 text-red-600' : ''} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${article.isLiked ? 'fill-red-600' : ''}`} />
                    <span className="hidden xs:inline">
                      {article.isLiked ? 'Je n\'aime plus' : 'J\'aime'}
                    </span>
                    <span>({article.likes || 0})</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToComments}
                    className="flex items-center gap-1 sm:gap-2"
                  >
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Commenter</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadClick}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareClick}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager
                  </Button>
                  <Button
                    onClick={onClose}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-1 sm:gap-2"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Fermer</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;