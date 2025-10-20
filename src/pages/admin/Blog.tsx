import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Clock, 
  Filter,
  Upload,
  Image,
  Tag,
  Save,
  X,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { AuthService } from "@/lib/auth";
import api from "@/lib/api";

// Interface
interface BlogArticle {
  id: string;
  titre: string;
  date: string;
  dateCreation: string;
  dateModification: string;
  categorie: string;
  description: string;
  image: string;
  contenu: string;
  auteur: string;
  tempsLecture: string;
  statut: 'publié' | 'brouillon' | 'programmé' | 'archivé';
  tags: string[];
  vues: number;
  likes: number;
  commentaires: number;
  datePublication?: string;
}

const categories = ["Toutes", "Immobilier", "Travaux", "Financement", "Produits", "Rénovation"];
const statuts = ["Tous", "publié", "brouillon", "programmé", "archivé"];

const GestionBlog = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<BlogArticle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    contenu: "",
    categorie: "",
    tags: "",
    statut: "brouillon" as 'publié' | 'brouillon' | 'programmé' | 'archivé',
    datePublication: "",
    image: ""
  });

  // Fetch articles when component mounts
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/articles');
      setArticles(response.data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des articles:', error);
      alert(`Erreur lors du chargement des articles: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "Toutes" || article.categorie === selectedCategory;
      const matchesStatut = selectedStatut === "Tous" || article.statut === selectedStatut;
      return matchesSearch && matchesCategory && matchesStatut;
    });
  }, [articles, searchTerm, selectedCategory, selectedStatut]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, image: response.data.url }));
        return response.data.url;
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      console.error('Erreur upload:', error);
      alert(`Erreur lors de l'upload de l'image: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateArticle = () => {
    setCurrentArticle(null);
    setIsEditing(false);
    setFormData({
      titre: "",
      description: "",
      contenu: "",
      categorie: "",
      tags: "",
      statut: "brouillon",
      datePublication: "",
      image: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditArticle = (article: BlogArticle) => {
    setCurrentArticle(article);
    setIsEditing(true);
    setFormData({
      titre: article.titre,
      description: article.description,
      contenu: article.contenu,
      categorie: article.categorie,
      tags: article.tags.join(", "),
      statut: article.statut,
      datePublication: article.datePublication || "",
      image: article.image
    });
    setIsDialogOpen(true);
  };

  const handleDeleteArticle = (article: BlogArticle) => {
    setCurrentArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentArticle) return;
    try {
      await api.delete(`/articles/${currentArticle.id}`);
      setArticles(articles.filter(article => article.id !== currentArticle.id));
      setIsDeleteDialogOpen(false);
      setCurrentArticle(null);
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      alert(`Erreur lors de la suppression: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSaveArticle = async () => {
    try {
      const user = AuthService.getCurrentUser();
      const payload = {
        ...formData,
        authorId: user?.id // Assurez-vous que l'utilisateur a un ID
      };

      if (isEditing) {
        await api.put(`/articles/${currentArticle!.id}`, payload);
      } else {
        await api.post('/articles', payload);
      }
      
      await fetchArticles();
      setIsDialogOpen(false);
      setCurrentArticle(null);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(`Erreur lors de la sauvegarde: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleChangeStatut = async (articleId: string, newStatut: string) => {
    try {
      const article = articles.find(a => a.id === articleId);
      if (!article) return;

      await api.put(`/articles/${articleId}`, {
        ...article,
        statut: newStatut
      });
      
      await fetchArticles();
    } catch (error: any) {
      console.error('Erreur lors du changement de statut:', error);
      alert(`Erreur lors du changement de statut: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "publié": return "bg-green-100 text-green-800";
      case "brouillon": return "bg-yellow-100 text-yellow-800";
      case "programmé": return "bg-blue-100 text-blue-800";
      case "archivé": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header de la page */}
      <section className="relative bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Gestion du Blog
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Créez, modifiez et gérez vos articles de blog
              </p>
            </div>
            <Button 
              onClick={handleCreateArticle}
              className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvel Article
            </Button>
          </div>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <Card className="p-6 shadow-lg border-0 rounded-2xl backdrop-blur-sm bg-white/95">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Barre de recherche */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuts.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </section>

      {/* Tableau des articles */}
      <section className="container mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          {/* En-tête du tableau */}
          <div className="bg-muted/50 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Articles ({filteredArticles.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Filtres appliqués
              </div>
            </div>
          </div>

          {/* Liste des articles */}
          <div className="divide-y">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-muted/30 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Image miniature */}
                    <div 
                      className="w-20 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex-shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">
                          {article.titre}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="secondary" className={getStatutColor(article.statut)}>
                            {article.statut}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {article.vues} vues
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {article.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {article.date}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {article.auteur}
                        </div>
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          {article.categorie}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.tempsLecture}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditArticle(article)}
                        className="h-9 w-9 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteArticle(article)}
                        className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                  <p className="text-muted-foreground mb-6">
                    {articles.length === 0 
                      ? "Commencez par créer votre premier article" 
                      : "Aucun article ne correspond à vos critères de recherche."
                    }
                  </p>
                  <Button onClick={handleCreateArticle}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un article
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Modal de création/édition d'article */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier l'article" : "Créer un nouvel article"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de votre article de blog
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="titre">Titre de l'article *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  placeholder="Entrez le titre de l'article"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Entrez une description courte de l'article"
                  rows={3}
                />
              </div>

              {/* Contenu */}
              <div className="space-y-2">
                <Label htmlFor="contenu">Contenu de l'article *</Label>
                <Textarea
                  id="contenu"
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  placeholder="Rédigez le contenu de votre article (HTML autorisé)"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {/* Sidebar des paramètres */}
            <div className="space-y-6">
              {/* Image */}
              <div className="space-y-4">
                <Label>Image de l'article</Label>
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  {formData.image ? (
                    <div className="space-y-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-md mx-auto"
                      />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour changer l'image
                      </p>
                    </div>
                  ) : (
                    <>
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Glissez-déposez une image ou cliquez pour uploader
                      </p>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={uploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('file-input')?.click();
                    }}
                  >
                    {uploading ? (
                      <>Chargement...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choisir une image
                      </>
                    )}
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie *</Label>
                <Select 
                  value={formData.categorie} 
                  onValueChange={(value) => setFormData({ ...formData, categorie: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== "Toutes").map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-muted-foreground">
                  Séparez les tags par des virgules
                </p>
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select 
                  value={formData.statut} 
                  onValueChange={(value: any) => setFormData({ ...formData, statut: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                    <SelectItem value="publié">Publié</SelectItem>
                    <SelectItem value="programmé">Programmé</SelectItem>
                    <SelectItem value="archivé">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date de publication programmée */}
              {formData.statut === "programmé" && (
                <div className="space-y-2">
                  <Label htmlFor="datePublication">Date de publication</Label>
                  <Input
                    id="datePublication"
                    type="datetime-local"
                    value={formData.datePublication}
                    onChange={(e) => setFormData({ ...formData, datePublication: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <div className="flex-1"></div>
            <Button onClick={handleSaveArticle} disabled={uploading}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Mettre à jour" : "Publier l'article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir supprimer l'article <strong>"{currentArticle?.titre}"</strong> ?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cette action est irréversible. Toutes les données associées à cet article seront perdues.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionBlog;