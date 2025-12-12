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
import AuthService from "@/services/authService";
import api from "@/lib/api";
import { toast } from "sonner";

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

// Couleurs personnalisées
const COLORS = {
  logo: "#556B2F",           // Olive green
  primaryDark: "#6B8E23",    // Yellow-green
  lightBg: "#FFFFFF",        // White
  separator: "#D3D3D3",      // Light gray
  secondaryText: "#8B4513",  // Saddle brown
  // Couleurs complémentaires
  success: "#7CB342",        // Green
  warning: "#FBC02D",        // Amber
  info: "#5C7CBA",           // Blue-gray
  danger: "#D32F2F",         // Red
};

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
      // Gérer la structure de la réponse - vérifier si c'est un objet avec une propriété data
      const articlesData = Array.isArray(response.data) ? response.data : response.data?.articles || response.data?.data || [];
      setArticles(articlesData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des articles:', error);
      toast.error(
        `Erreur lors du chargement des articles: ${error.response?.data?.error || error.message
        }`
      );
      setArticles([]); // Initialiser avec un tableau vide en cas d'erreur
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
      toast.error(
        `Erreur lors de l'upload de l'image: ${error.response?.data?.error || error.message
        }`
      );
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
      toast.error(
        `Erreur lors de la suppression: ${error.response?.data?.error || error.message
        }`
      );
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
      toast.error(
        `Erreur lors de la sauvegarde: ${error.response?.data?.error || error.message
        }`
      );
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
      toast.error(
        `Erreur lors du changement de statut: ${error.response?.data?.error || error.message
        }`
      );
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
      case "publié": 
        return "text-white" + ` bg-[${COLORS.success}]`;
      case "brouillon": 
        return "text-white bg-[" + COLORS.warning + "]";
      case "programmé": 
        return "text-white bg-[" + COLORS.info + "]";
      case "archivé": 
        return "text-gray-700 bg-[" + COLORS.separator + "]";
      default: 
        return "text-gray-700 bg-[" + COLORS.separator + "]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF5] to-[#FFFFFF] flex items-center justify-center">
        <div className="text-center">
          <img src="/loading.gif" alt="" className='w-24 h-24' />
          <p className="mt-4 text-[#8B4513]">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF5] to-[#FFFFFF]">
      {/* Header de la page */}
      <section className="relative bg-gradient-to-r from-[#556B2F] to-[#6B8E23] text-white py-16">
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
              className="bg-white text-[#556B2F] hover:bg-[#FAFAF5] px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-[#556B2F]"
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513] h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border-[#D3D3D3] focus:ring-2 focus:ring-[#6B8E23]/20 focus:border-[#6B8E23]"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px] border-[#D3D3D3] text-[#8B4513]">
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
                <SelectTrigger className="w-full sm:w-[180px] border-[#D3D3D3] text-[#8B4513]">
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
          <div className="bg-[#F5F5F0] px-6 py-4 border-b-2 border-[#D3D3D3]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#556B2F]">
                Articles ({filteredArticles.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#8B4513]">
                <Filter className="h-4 w-4" />
                Filtres appliqués
              </div>
            </div>
          </div>

          {/* Liste des articles */}
          <div className="divide-y divide-[#D3D3D3]">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-[#FAFAF5] transition-colors duration-200 border-b border-[#D3D3D3]">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Image miniature */}
                    <div
                      className="w-20 h-16 bg-gradient-to-br from-[#6B8E23]/20 to-[#6B8E23]/10 rounded-lg flex-shrink-0 bg-cover bg-center border border-[#D3D3D3]"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-[#556B2F] truncate">
                          {article.titre}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge 
                            variant="secondary" 
                            className={`
                              ${article.statut === "publié" ? `bg-[${COLORS.success}] text-white` : ""}
                              ${article.statut === "brouillon" ? `bg-[${COLORS.warning}] text-white` : ""}
                              ${article.statut === "programmé" ? `bg-[${COLORS.info}] text-white` : ""}
                              ${article.statut === "archivé" ? "bg-[#D3D3D3] text-[#556B2F]" : ""}
                            `}
                          >
                            {article.statut}
                          </Badge>
                          <span className="text-sm text-[#8B4513]">
                            {article.vues} vues
                          </span>
                        </div>
                      </div>

                      <p className="text-[#8B4513] text-sm mb-2 line-clamp-2">
                        {article.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#8B4513]">
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
                          <Badge key={index} variant="outline" className="text-xs border-[#D3D3D3] text-[#556B2F]">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#556B2F]">
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
                        className="h-9 w-9 p-0 text-[#6B8E23] hover:bg-[#6B8E23]/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteArticle(article)}
                        className="h-9 w-9 p-0 text-[#D32F2F] hover:bg-[#D32F2F]/10"
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
                  <Search className="h-12 w-12 text-[#D3D3D3] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#556B2F] mb-2">Aucun article trouvé</h3>
                  <p className="text-[#8B4513] mb-6">
                    {articles.length === 0
                      ? "Commencez par créer votre premier article"
                      : "Aucun article ne correspond à vos critères de recherche."
                    }
                  </p>
                  <Button 
                    onClick={handleCreateArticle}
                    className="bg-[#6B8E23] text-white hover:bg-[#556B2F]"
                  >
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#556B2F]">
              {isEditing ? "Modifier l'article" : "Créer un nouvel article"}
            </DialogTitle>
            <DialogDescription className="text-[#8B4513]">
              Remplissez les informations de votre article de blog
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="titre" className="text-[#556B2F] font-semibold">Titre de l'article *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  placeholder="Entrez le titre de l'article"
                  className="border-[#D3D3D3] focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#556B2F] font-semibold">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Entrez une description courte de l'article"
                  rows={3}
                  className="border-[#D3D3D3] focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                />
              </div>

              {/* Contenu */}
              <div className="space-y-2">
                <Label htmlFor="contenu" className="text-[#556B2F] font-semibold">Contenu de l'article *</Label>
                <Textarea
                  id="contenu"
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  placeholder="Rédigez le contenu de votre article (HTML autorisé)"
                  rows={12}
                  className="font-mono text-sm border-[#D3D3D3] focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                />
              </div>
            </div>

            {/* Sidebar des paramètres */}
            <div className="space-y-6">
              {/* Image */}
              <div className="space-y-4">
                <Label className="text-[#556B2F] font-semibold">Image de l'article</Label>
                <div
                  className="border-2 border-dashed border-[#D3D3D3] rounded-lg p-4 text-center cursor-pointer hover:border-[#6B8E23] transition-colors bg-[#FAFAF5]"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  {formData.image ? (
                    <div className="space-y-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md mx-auto border border-[#D3D3D3]"
                      />
                      <p className="text-sm text-[#8B4513]">
                        Cliquez pour changer l'image
                      </p>
                    </div>
                  ) : (
                    <>
                      <Image className="h-8 w-8 mx-auto mb-2 text-[#D3D3D3]" />
                      <p className="text-sm text-[#8B4513] mb-2">
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
                    className="border-[#D3D3D3] text-[#556B2F] hover:bg-white hover:border-[#6B8E23]"
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
                <Label htmlFor="categorie" className="text-[#556B2F] font-semibold">Catégorie *</Label>
                <Select
                  value={formData.categorie}
                  onValueChange={(value) => setFormData({ ...formData, categorie: value })}
                >
                  <SelectTrigger className="border-[#D3D3D3] text-[#8B4513]">
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
                <Label htmlFor="tags" className="text-[#556B2F] font-semibold">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                  className="border-[#D3D3D3] focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                />
                <p className="text-xs text-[#8B4513]">
                  Séparez les tags par des virgules
                </p>
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="statut" className="text-[#556B2F] font-semibold">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value: any) => setFormData({ ...formData, statut: value })}
                >
                  <SelectTrigger className="border-[#D3D3D3] text-[#8B4513]">
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
                  <Label htmlFor="datePublication" className="text-[#556B2F] font-semibold">Date de publication</Label>
                  <Input
                    id="datePublication"
                    type="datetime-local"
                    value={formData.datePublication}
                    onChange={(e) => setFormData({ ...formData, datePublication: e.target.value })}
                    className="border-[#D3D3D3] focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#D3D3D3]">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#D3D3D3] text-[#556B2F]">
              Annuler
            </Button>
            <div className="flex-1"></div>
            <Button 
              onClick={handleSaveArticle} 
              disabled={uploading}
              className="bg-[#6B8E23] text-white hover:bg-[#556B2F]"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Mettre à jour" : "Publier l'article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#D32F2F]">
              <AlertCircle className="h-5 w-5" />
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-[#556B2F]">
              Êtes-vous sûr de vouloir supprimer l'article <strong>"{currentArticle?.titre}"</strong> ?
            </p>
            <p className="text-sm text-[#8B4513] mt-2">
              Cette action est irréversible. Toutes les données associées à cet article seront perdues.
            </p>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-[#D3D3D3] text-[#556B2F]"
            >
              Annuler
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-[#D32F2F] text-white hover:bg-[#B71C1C]"
            >
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