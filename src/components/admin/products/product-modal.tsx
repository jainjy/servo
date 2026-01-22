// components/admin/products/product-modal.jsx
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
import { Switch } from "@/components/ui/switch"
import api from "@/lib/api"
import { toast } from "sonner"

interface ProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: any
  mode: "create" | "edit"
  onSuccess?: () => void
}

interface DeliveryPrice { // Prix par catégorie de livraison
  id: string;
  category: string;
  price: number;
}

export function ProductModal({ open, onOpenChange, product, mode, onSuccess }: ProductModalProps) {
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPrice[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    comparePrice: "",
    cost: "",
    sku: "",
    barcode: "",
    quantity: "0",
    lowStock: "5",
    weight: "",
    images: [] as string[],
    status: "draft",
    featured: false,
    visibility: "public",
    seoTitle: "",
    seoDescription: "",
    trackQuantity: true
  })
  const [loading, setLoading] = useState(false)
  const [imageInput, setImageInput] = useState("")

  // Initialiser le formulaire quand le produit change
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        price: product.price?.toString() || "",
        comparePrice: product.comparePrice?.toString() || "",
        cost: product.cost?.toString() || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        quantity: product.quantity?.toString() || "0",
        lowStock: product.lowStock?.toString() || "5",
        weight: product.weight?.toString() || "",
        images: product.images || [],
        status: product.status || "draft",
        featured: product.featured || false,
        visibility: product.visibility || "public",
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        trackQuantity: product.trackQuantity !== undefined ? product.trackQuantity : true
      })
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        price: "",
        comparePrice: "",
        cost: "",
        sku: "",
        barcode: "",
        quantity: "0",
        lowStock: "5",
        weight: "",
        images: [],
        status: "draft",
        featured: false,
        visibility: "public",
        seoTitle: "",
        seoDescription: "",
        trackQuantity: true
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price) || 0,
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        sku: formData.sku,
        barcode: formData.barcode,
        quantity: parseInt(formData.quantity),
        lowStock: parseInt(formData.lowStock),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        images: formData.images,
        status: formData.status,
        featured: formData.featured,
        visibility: formData.visibility,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        trackQuantity: formData.trackQuantity
      }

      if (mode === "create") {
        await api.post('/products', productData)
      } else {
        await api.put(`/products/${product.id}`, productData)
      }

      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error)
      toast.error('Erreur lors de la sauvegarde du produit')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchDeliveryPrices();
    }
  }, [open]);

  const fetchDeliveryPrices = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/delivery-prices`);
      setDeliveryPrices(response.data);
    } catch {
      toast.error('Erreur lors du chargement des prix des catégories de livraison');
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()]
      })
      setImageInput("")
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData({ ...formData, images: newImages })
  }

  const categories = [
    "Équipements de chauffage", "Électroménager", "Meubles", "Décoration",
    "Jardinage", "Outillage", "Sécurité maison", "Luminaires",
    "Matériaux de construction", "Isolation", "Revêtements de sol", "Carrelage",
    "Bois et panneaux", "Menuiserie", "Plomberie", "Électricité",
    "Peinture & Revêtements", "Mobilier Design", "Décoration Murale",
    "Luminaires Design", "Textiles Décoratifs", "Accessoires Déco",
    "Art & Tableaux", "Rangements Design"
  ]

  const statusOptions = [
    { value: "draft", label: "Brouillon" },
    { value: "active", label: "Actif" },
    { value: "inactive", label: "Inactif" },
  ]

  const visibilityOptions = [
    { value: "public", label: "Public" },
    { value: "hidden", label: "Caché" },
    { value: "private", label: "Privé" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nouveau produit" : "Modifier le produit"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Ajouter un nouveau produit au marketplace" : "Modifier les détails du produit"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie * /Prix de livraison</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryPrices.map((category) => (
                      <SelectItem key={category.id} value={category.category}>
                        {category.category}{category.price ? ` - ${category.price.toFixed(2)} €` : '- 0 €'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Sous-catégorie</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparePrice">Ancien prix (€)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Coût (€)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">Référence (SKU)</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Code-barres</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.trackQuantity}
                onCheckedChange={(checked) => setFormData({ ...formData, trackQuantity: checked })}
                disabled={loading}
              />
              <Label htmlFor="trackQuantity">Suivre le stock</Label>
            </div>

            {formData.trackQuantity && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Stock *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStock">Alerte stock faible</Label>
                  <Input
                    id="lowStock"
                    type="number"
                    min="0"
                    value={formData.lowStock}
                    onChange={(e) => setFormData({ ...formData, lowStock: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex gap-2">
                <Input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="URL de l'image"
                  disabled={loading}
                />
                <Button type="button" onClick={addImage} disabled={loading}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt="" className="w-16 h-16 object-cover rounded" />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibilité</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityOptions.map((visibility) => (
                      <SelectItem key={visibility.value} value={visibility.value}>
                        {visibility.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                disabled={loading}
              />
              <Label htmlFor="featured">Produit en vedette</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">Titre SEO</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">Description SEO</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  {mode === "create" ? "Création..." : "Sauvegarde..."}
                </>
              ) : (
                mode === "create" ? "Créer" : "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}