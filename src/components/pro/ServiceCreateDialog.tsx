import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import {
  FileText,
  DollarSign,
  Clock,
  Tag,
  Briefcase,
  Upload,
  X,
  ImageIcon
} from "lucide-react";
import { toast } from "../../hooks/use-toast";

import api from "../../lib/api";

interface Category {
  id: number;
  nom: string;
}

interface Metier {
  id: number;
  libelle: string;
}

interface UserData {
  id: number;
  nom: string;
}

interface NewService {
  libelle: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  metierId: number;
  userId: number;
}

interface ServiceCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoriesFormateur: Category[];
  categoriesPodcasteur: Category[];
  metiers: Metier[];
  users: UserData[];
  onSubmit: (service: NewService, files: FileList | null) => void;
  activeCategory: "Formateur" | "Podcasteur" | "Masseur" | "Thérapeute" | null;
}

export const ServiceCreateDialog = ({
  isOpen,
  onClose,
  categoriesFormateur,
  categoriesPodcasteur,
  metiers,
  users,
  onSubmit,
  activeCategory,
}: ServiceCreateDialogProps) => {
  const [newService, setNewService] = useState<NewService>({
    libelle: "",
    description: "",
    price: 0,
    duration: 0,
    categoryId: 0,
    metierId: 0,
    userId: 0,
  });

  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState("");

  // Déterminer les catégories à afficher selon activeCategory
  const categories = activeCategory === "Formateur"
    ? categoriesFormateur
    : activeCategory === "Podcasteur"
      ? categoriesPodcasteur
      : [];

  // Initialisation user
  useEffect(() => {
    if (users.length > 0) {
      setUserName(users[0].nom);
      setNewService(prev => ({ ...prev, userId: users[0].id }));
    }
  }, [users]);


  // Gestion de la sélection et prévisualisation des fichiers
  const handleImageUpload = async (file: File) => {

    if (!file.type.startsWith("image/")) return toast({ title: "Erreur", description: "Veuillez sélectionner une image valide", variant: "destructive" });
    if (file.size > 10 * 1024 * 1024) return toast({ title: "Erreur", description: "L'image ne doit pas dépasser 10MB", variant: "destructive" });

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await api.post("/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {

        setImagePreviews(prev => [...prev, response.data.url]);

        setImageFiles(prev => {
          const dt = new DataTransfer();
          if (prev) Array.from(prev).forEach(f => dt.items.add(f));
          dt.items.add(file);
          return dt.files;
        });

      }
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      toast({ title: "Erreur", description: error.response?.data?.error || "Erreur lors de l'upload de l'image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => handleImageUpload(file));
  };

  // Supprimer une image
  const removeImage = async (index: number) => {
    const imageUrl = imagePreviews[index];
    try {
      const url = new URL(imageUrl);
      const path = url.pathname.split("/").pop();
      if (path) await api.delete("/upload/image", { data: { path } });
    } catch (error) {
      console.error("Erreur suppression image:", error);
    } finally {
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      if (imageFiles) {
        const dt = new DataTransfer();
        Array.from(imageFiles).forEach((file, i) => { if (i !== index) dt.items.add(file); });
        setImageFiles(dt.files);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();

    if (!newService.libelle.trim())
      return toast({ title: "Erreur", description: "Le libellé est requis", variant: "destructive" });

    if (newService.metierId === 0)
      return toast({ title: "Erreur", description: "Veuillez sélectionner une catégorie et un métier", variant: "destructive" });


    const payload = {
      libelle: newService.libelle,
      description: newService.description,
      images: imagePreviews,
      price: newService.price,
      duration: newService.duration,
      categoryId: newService.categoryId,
      category: categories.find(c => c.id === newService.categoryId)?.nom,
      metiers: [
        {
          id: newService.metierId,
          libelle: metiers.find(m => m.id === newService.metierId)?.libelle
        }
      ],
      users: [
        {
          id: newService.userId,
          nom: userName
        }
      ]
    };

    console.log("Données envoyées au backend :", payload);

    try {
      const response = await api.post("/harmonie/new", payload);
      toast({ title: "Succès", description: "Service créé avec succès", variant: "default" });

      // Réinitialiser le formulaire
      setNewService({ libelle: "", description: "", price: 0, duration: 0, categoryId: 0, metierId: 0, userId: 0 });
      setImageFiles(null);
      setImagePreviews([]);
    } catch (error: any) {
      console.error("Erreur création service :", error);
      toast({ title: "Erreur", description: error.response?.data?.error || "Erreur lors de la création du service", variant: "destructive" });
    }
  };

  console.log("Active Category:", activeCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-black">
            Créer un Service
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau service
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">

          {/* Libellé */}
          <div className="space-y-2">
            <Label htmlFor="libelle" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              Libellé
            </Label>
            <Input
              id="libelle"
              type="text"
              placeholder="Ex: Coupe de cheveux moderne"
              value={newService.libelle}
              onChange={(e) => setNewService({ ...newService, libelle: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez le service en détail..."
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              rows={4}
            />
          </div>

          {/* Prix et Durée */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-primary" />
                Prix (€)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={newService.price || ""}
                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                Durée (min)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={newService.duration || ""}
                onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4 text-primary" />
              Catégorie
            </Label>

            <Select
              value={newService.categoryId?.toString() || ""}
              onValueChange={(value) =>
                setNewService({ ...newService, categoryId: Number(value) })
              }
              disabled={
                activeCategory === "Formateur"
                  ? categoriesFormateur.length === 0
                  : categoriesPodcasteur.length === 0
              }
            >
              <SelectTrigger
                className={`transition-all duration-200 focus:shadow-soft ${(activeCategory === "Formateur"
                  ? categoriesFormateur.length === 0
                  : categoriesPodcasteur.length === 0)
                  ? "bg-gray-100 cursor-not-allowed opacity-70"
                  : ""
                  }`}
              >
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="0">Sélectionner une catégorie</SelectItem>

                {(activeCategory === "Formateur"
                  ? categoriesFormateur
                  : categoriesPodcasteur
                ).map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          {/* Métier */}
          <div className="space-y-2">
            <Label htmlFor="metier" className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-primary" />
              Métier
            </Label>

            <Select
              value={newService.metierId?.toString() || ""}
              onValueChange={(value) => {
                const selectedId = Number(value);
                setNewService({ ...newService, metierId: selectedId });
                const selectedMetier = metiers.find((m) => m.id === selectedId);
                console.log("Métier sélectionné :", selectedMetier);
              }}
            >

              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un métier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sélectionner un métier</SelectItem>
                {(metiers || []).map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.libelle} {/* ou m.libelle selon ton schéma */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          {/* Utilisateur */}
          <div className="space-y-2">
            <Label htmlFor="users" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              Utilisateur
            </Label>
            <Input
              id="users"
              type="text"
              value={userName}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Upload d'images */}
          <div className="space-y-2">
            <Label htmlFor="images" className="flex items-center gap-2 text-sm font-medium">
              <Upload className="h-4 w-4 text-primary" /> Images du service
            </Label>
            <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary cursor-pointer">
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <label htmlFor="images" className="flex flex-col items-center gap-2 cursor-pointer">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{uploading ? "Upload en cours..." : "Cliquez pour sélectionner des images"}</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, WEBP jusqu'à 10MB</span>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border shadow-soft">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={uploading}>Annuler</Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90 text-black" disabled={uploading}>Créer le service</Button>
          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
};
