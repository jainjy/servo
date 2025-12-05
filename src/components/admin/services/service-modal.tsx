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
import { ImagePlus, X, Upload, Search } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface ServiceModalProps {
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

export function ServiceModal({ open, onOpenChange, service, mode, onServiceUpdated }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    metierIds: [] as string[],
    images: [] as string[],
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [metiers, setMetiers] = useState<Metier[]>([])
  const [metierSearch, setMetierSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (service && mode === "edit") {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        categoryId: service.categoryId?.toString() || "",
        metierIds: service.metiers?.map((m: any) => m.id.toString()) || [],
        images: service.images || [],
      })
    } else {
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        metierIds: [],
        images: [],
      })
    }
  }, [service, mode])

  useEffect(() => {
    if (open) {
      fetchFormData()
    }
  }, [open])

  const fetchFormData = async () => {
    try {
      const [categoriesRes, metiersRes] = await Promise.all([
        api.get('/services/categories'),
        api.get('/services/metiers')
      ])
      setCategories(categoriesRes.data)
      setMetiers(metiersRes.data)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    }
  }

  const filteredMetiers = metiers.filter(metier =>
    metier.libelle.toLowerCase().includes(metierSearch.toLowerCase())
  )

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.warning("Veuillez sélectionner une image valide");
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("L'image ne doit pas dépasser 5MB");
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
      toast.error(
        error.response?.data?.error || "Erreur lors de l'upload de l'image"
      );
    } finally {
      setUploading(false)
      // Réinitialiser l'input file
      event.target.value = ''
    }
  }

  const removeImage = async (index: number) => {
    const imageUrl = formData.images[index]
    
    try {
      // Extraire le chemin du fichier de l'URL
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
      // Supprimer quand même de l'interface même si l'upload échoue
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "create") {
        await api.post('/services', formData)
      } else {
        await api.put(`/services/${service.id}`, formData)
      }
      
      onServiceUpdated?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du service:', error)
      toast.error("Erreur lors de la sauvegarde du service");
    } finally {
      setLoading(false)
    }
  }

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
      <DialogContent className="bg-card border-border sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {mode === "create" ? "Nouveau service" : "Modifier le service"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create" ? "Créer un nouveau service pour votre catalogue" : "Modifier les détails du service existant"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">
                Nom du service <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-input focus-visible:ring-1 focus-visible:ring-primary"
                placeholder="Ex: Réparation moteur"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground font-semibold">
                Catégorie
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="bg-background border-input focus-visible:ring-1 focus-visible:ring-primary">
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-semibold">
                  Métiers associés
                </Label>
                <span className="text-xs text-muted-foreground">
                  {formData.metierIds.length} sélectionné{formData.metierIds.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Barre de recherche des métiers */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un métier..."
                  value={metierSearch}
                  onChange={(e) => setMetierSearch(e.target.value)}
                  className="bg-background border-input pl-10 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* Liste des métiers */}
              <div className="border border-input rounded-lg bg-background max-h-48 overflow-y-auto p-3">
                {filteredMetiers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredMetiers.map((metier) => (
                      <div key={metier.id} className="flex items-center space-x-3 hover:bg-accent p-2 rounded-md transition-colors">
                        <Checkbox
                          id={`metier-${metier.id}`}
                          checked={formData.metierIds.includes(metier.id.toString())}
                          onCheckedChange={(checked) => 
                            handleMetierChange(metier.id.toString(), checked as boolean)
                          }
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor={`metier-${metier.id}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {metier.libelle}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun métier trouvé
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background border-input min-h-[100px] focus-visible:ring-1 focus-visible:ring-primary"
                placeholder="Description détaillée du service..."
              />
            </div>

            {/* Section Images */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">
                Images du service
              </Label>
              
              {/* Upload d'image */}
              <div className="border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-lg p-8 text-center transition-colors bg-primary/5">
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
                  className={`cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <Upload className="h-10 w-10 text-primary animate-pulse" />
                  ) : (
                    <ImagePlus className="h-10 w-10 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, JPEG jusqu'à 5MB
                    </p>
                  </div>
                </label>
              </div>

              {/* Aperçu des images */}
              {formData.images.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} ajoutée{formData.images.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Service image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-input"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-3">
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
              disabled={loading || uploading}
            >
              {loading ? "Chargement..." : mode === "create" ? "Créer le service" : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}