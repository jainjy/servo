import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Tag, Briefcase, Euro, Clock, Save, Image, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export function CreateCustomServiceModal({
  open,
  onOpenChange,
  onServiceCreated,
}) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userMetiers, setUserMetiers] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    libelle: "",
    description: "",
    categoryId: "",
    price: "",
    duration: "",
    tags: [],
    metierIds: [],
    images: [],
  });
  const [newTag, setNewTag] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (open) {
      fetchFormData();
      resetForm();
    }
  }, [open]);

  const fetchFormData = async () => {
    try {
      const [categoriesRes, metiersRes] = await Promise.all([
        api.get("/professional/services/categories"),
        api.get("/professional/services/metiers"),
      ]);
      setCategories(categoriesRes.data);
      setUserMetiers(metiersRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  const resetForm = () => {
    setFormData({
      libelle: "",
      description: "",
      categoryId: "",
      price: "",
      duration: "",
      tags: [],
      metierIds: [],
      images: [],
    });
    setNewTag("");
    setPreviewImages([]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    const totalImages = previewImages.length + files.length;

    if (totalImages > maxFiles) {
      toast.error(`Maximum ${maxFiles} images autorisées`);
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Seules les images sont acceptées");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages((prev) => [
          ...prev,
          {
            preview: e.target.result,
            file: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Réinitialiser l'input
    e.target.value = "";
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.libelle.trim()) {
      toast.error("Le nom du service est obligatoire");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        libelle: formData.libelle,
        description: formData.description,
        categoryId: formData.categoryId || null,
        price: formData.price ? parseFloat(formData.price) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        tags: formData.tags,
        metierIds: formData.metierIds,
        images: previewImages.map(img => img.file),
      };

      const formDataToSend = new FormData();
      formDataToSend.append("libelle", submitData.libelle);
      formDataToSend.append("description", submitData.description);
      formDataToSend.append("categoryId", submitData.categoryId);
      formDataToSend.append("price", submitData.price);
      formDataToSend.append("duration", submitData.duration);
      formDataToSend.append("tags", JSON.stringify(submitData.tags));
      formDataToSend.append("metierIds", JSON.stringify(submitData.metierIds));

      submitData.images.forEach((image, index) => {
        formDataToSend.append("images", image);
      });

      const response = await api.post("/professional/services/custom", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Service créé avec succès");
      onServiceCreated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la création du service"
      );
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const toggleMetier = (metierId) => {
    setFormData((prev) => ({
      ...prev,
      metierIds: prev.metierIds.includes(metierId)
        ? prev.metierIds.filter((id) => id !== metierId)
        : [...prev.metierIds, metierId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Créer un service personnalisé
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajoutez un service unique à votre catalogue professionnel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom du service */}
          <div className="space-y-2">
            <Label htmlFor="libelle" className="text-foreground">
              Nom du service *
            </Label>
            <Input
              id="libelle"
              value={formData.libelle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, libelle: e.target.value }))
              }
              placeholder="Ex: Installation de climatiseur mural"
              className="bg-background border-input"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Décrivez votre service en détail..."
              rows={3}
              className="bg-background border-input resize-none"
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images ({previewImages.length}/5)
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                disabled={previewImages.length >= 5 || uploadingImages}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Cliquez pour ajouter des images
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF jusqu'à 5 images (5MB max chacune)
                </p>
              </label>
            </div>

            {/* Aperçu des images */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Catégorie
            </Label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full p-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prix et Durée */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-foreground flex items-center gap-2"
              >
                <Euro className="h-4 w-4" />
                Prix (€)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="0.00"
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-foreground flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Durée (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, duration: e.target.value }))
                }
                placeholder="60"
                className="bg-background border-input"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label
              htmlFor="tags"
              className="text-foreground flex items-center gap-2"
            >
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Ajouter un tag..."
                className="bg-background border-input flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Métiers associés */}
          {userMetiers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Associer à mes métiers
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userMetiers.map((metier) => (
                  <Card
                    key={metier.id}
                    className={`p-3 cursor-pointer border-2 transition-colors ${
                      formData.metierIds.includes(metier.id)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                    onClick={() => toggleMetier(metier.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {metier.libelle}
                      </span>
                      {formData.metierIds.includes(metier.id) && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImages}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Créer le service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
