// components/admin/products/products-table.jsx
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductModal } from "./product-modal"
import { Search, Filter, Edit, Trash2 } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export function ProductsTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleDelete = async (product) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }

    try {
      await api.delete(`/products/${product.id}`)
      fetchProducts() // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression du produit')
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: { label: "Actif", className: "bg-green-100 text-green-800" },
      draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800" },
      inactive: { label: "Inactif", className: "bg-red-100 text-red-800" },
      archived: { label: "Archivé", className: "bg-yellow-100 text-yellow-800" }
    }
    const config = variants[status] || variants.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStockColor = (quantity, lowStock = 5) => {
    if (quantity === 0) return "text-red-500"
    if (quantity <= lowStock) return "text-yellow-500"
    return "text-green-500"
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement des produits...</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
              {product.images && product.images.length > 0 && (
                <div className="mb-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">ID: {product.id.slice(0, 8)}...</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    {getStatusBadge(product.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vendeur:</span>
                  <span className="text-sm font-medium">
                    {product.vendor?.companyName || `${product.vendor?.firstName} ${product.vendor?.lastName}` || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prix:</span>
                  <span className="text-lg font-bold">
                    €{product.price}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className={`text-sm font-medium ${getStockColor(product.quantity, product.lowStock)}`}>
                    {product.quantity} unités
                  </span>
                </div>

                {product.images && product.images.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Images:</span>
                    <span className="text-sm font-medium">
                      {product.images.length}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          </div>
        )}
      </Card>

      <ProductModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        product={selectedProduct} 
        mode="edit"
        onSuccess={fetchProducts}
      />
    </>
  )
}