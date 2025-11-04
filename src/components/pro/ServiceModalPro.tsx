import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImagePlus, X, Upload } from "lucide-react"
import api from "@/lib/api"

interface ServiceModalProProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: any
  mode: "create" | "edit"
  onServiceUpdated?: () => void
}

interface Category {
  id: number
  name: string
}

interface Metier {
  id: number
  libelle: string
}

interface UserData {
  id: string; // UUID string
  nom: string;
  email: string;
}

export function ServiceModalPro({ open, onOpenChange, service, mode, onServiceUpdated }: ServiceModalProProps) {
  const métiersCibles = ["Thérapeute", "Masseur", "Formateur", "Podcasteur"];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as string[],
    price: "",
    duration: "",
    categoryId: "",
    metierIds: [] as string[],
    users: "",
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [metiers, setMetiers] = useState<Metier[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [users, setUsers] = useState<UserData[]>([]);

  // Fonction pour récupérer et mettre à jour les utilisateurs
  const fetchAndUpdateUsers = () => {
    const storedUsers = localStorage.getItem("user-data");
    console.log("🔄 Actualisation des utilisateurs depuis localStorage:", storedUsers);

    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        const usersArray = Array.isArray(parsedUsers) ? parsedUsers : [parsedUsers];

        const formattedUsers = usersArray.map((u: any) => ({
          id: u.id, // Garder l'ID original (UUID string)
          nom: `${u.firstName} ${u.lastName}`,
          email: u.email
        }));

        setUsers(formattedUsers);
        console.log("✅ Utilisateurs chargés depuis localStorage :", formattedUsers);

        // Pré-remplir automatiquement le champ utilisateur
        if (formattedUsers.length === 1) {
          setFormData(prev => ({
            ...prev,
            users: formattedUsers[0].nom
          }));
        } else if (formattedUsers.length > 1) {
          // Si plusieurs utilisateurs, afficher le premier par défaut
          setFormData(prev => ({
            ...prev,
            users: formattedUsers[0].nom
          }));
        }
      } catch (err) {
        console.error("❌ Erreur parsing user-data", err);
      }
    } else {
      console.warn("⚠️ Aucun utilisateur trouvé dans localStorage");
      setUsers([]);
    }
  };

  useEffect(() => {
    if (service && mode === "edit") {
      setFormData({
        name: service.libelle || "",
        description: service.description || "",
        images: service.images || [],
        price: service.price?.toString() || "",
        duration: service.duration?.toString() || "",
        categoryId: service.categoryId?.toString() || "",
        metierIds:
          service.metiers
            ?.map((m: any) => m.metier?.id?.toString())
            .filter((id: string | undefined) => id !== undefined) || [],
        users: service.users || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        images: [],
        price: "",
        duration: "",
        categoryId: "",
        metierIds: [],
        users: "",
      })
    }
  }, [service, mode])

  useEffect(() => {
    if (open) {
      console.log("🎯 Modal ouvert - Actualisation des données...");
      fetchFormData();
      fetchAndUpdateUsers(); // Actualisation automatique à l'ouverture
    }
  }, [open])

  // Ancien useEffect pour les users - REMPLACÉ par fetchAndUpdateUsers()
  // useEffect(() => {
  //   const storedUsers = localStorage.getItem("user-data");
  //   // ... ancien code
  // }, []);

  const fetchFormData = async () => {
    try {
      console.log("📥 Chargement des catégories et métiers...");
      const [categoriesRes, metiersRes] = await Promise.all([
        api.get('/harmonie/categories'),
        api.get('/harmonie/metiers')
      ])
      setCategories(categoriesRes.data)
      setMetiers(metiersRes.data)
      console.log("✅ Catégories et métiers chargés avec succès");
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error)
    }
  }

  // Upload Image
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, response.data.url]
        }))
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error)
      alert(error.response?.data?.error || 'Erreur lors de l\'upload de l\'image')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  // Remove Image
  const removeImage = async (index: number) => {
    const imageUrl = formData.images[index]

    try {
      const url = new URL(imageUrl)
      const path = url.pathname.split('/').pop()

      if (path) {
        await api.delete('/upload/image', {
          data: { path: `blog-images/${path}` }
        })
      }

      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
    }
  }

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des métiers
    if (formData.metierIds.length === 0) {
      alert("Veuillez sélectionner au moins un métier pour que le service soit visible");
      return;
    }

    // Vérification qu'un utilisateur est disponible
    if (users.length === 0) {
      alert("Aucun utilisateur trouvé. Veuillez vous reconnecter.");
      return;
    }

    setLoading(true);

    try {
      // Mapping des champs frontend → backend
      const payload = {
        libelle: formData.name,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        metierIds: formData.metierIds.map((id) => parseInt(id)),
        userId: users.length > 0 ? users[0].id : null,
        images: Array.isArray(formData.images) ? formData.images : [],
      };

      console.log("📤 Payload envoyé au backend:", payload);

      if (mode === "create") {
        await api.post("/harmonie/new", payload);
      } else if (service) {
        await api.put(`/harmonie/${service.id}`, payload);
      }

      onServiceUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("❌ Erreur lors de la sauvegarde du service:", error);
      alert(error.response?.data?.error || "Erreur lors de la sauvegarde du service");
    } finally {
      setLoading(false);
    }
  };

  const handleMetierChange = (metierId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      metierIds: checked
        ? [...prev.metierIds, metierId]
        : prev.metierIds.filter(id => id !== metierId)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "create" ? "Nouveau service" : "Modifier le service"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create" ? "Créer un nouveau service" : "Modifier les détails du service"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Libelle */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nom du service *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background border-input min-h-[100px]"
                placeholder="Description détaillée du service..."
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Images du service
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {uploading ? (
                    <Upload className="h-8 w-8 text-muted-foreground animate-pulse" />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG jusqu'à 5MB
                  </span>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Service image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Prix
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-background border-input"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-foreground">
                Durée (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-background border-input"
                required
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Catégorie
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Métier - FILTRÉ POUR LES 4 MÉTIERS CIBLES */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Métiers associés *
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-input rounded-md p-3 bg-background">
                {metiers
                  .filter(metier => métiersCibles.includes(metier.libelle))
                  .map((metier) => (
                    <div key={metier.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`metier-${metier.id}`}
                        checked={formData.metierIds.includes(metier.id.toString())}
                        onCheckedChange={(checked) =>
                          handleMetierChange(metier.id.toString(), checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`metier-${metier.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {metier.libelle}
                      </label>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Users */}
            <div className="space-y-2">
              <Label htmlFor="users" className="text-foreground">
                Utilisateur associé
              </Label>
              <Input
                id="users"
                value={formData.users}
                className="bg-background border-input"
                readOnly
                disabled
              />
              <div className="flex items-center gap-2 mt-1">
                {users.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchAndUpdateUsers}
                    className="text-xs h-6"
                  >
                    Actualiser
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
              disabled={loading || uploading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading || uploading || users.length === 0}
            >
              {loading ? "Chargement..." : mode === "create" ? "Créer" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}