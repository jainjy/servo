// components/admin/products/products-table.jsx
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductModal } from "./product-modal"
import { Search, Filter, Edit, Trash2, Package, Eye, Copy, BarChart } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export function ProductsTable({ filter = "all" }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sortBy, setSortBy] = useState("newest")

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
      toast.error("Erreur lors du chargement des produits")
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
      toast.success("Produit supprimé avec succès")
      fetchProducts()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression du produit')
    }
  }

  const handleDuplicate = async (product) => {
    try {
      const { id, ...productData } = product
      await api.post('/products', {
        ...productData,
        name: `${product.name} (Copie)`
      })
      toast.success("Produit dupliqué avec succès")
      fetchProducts()
    } catch (error) {
      console.error('Erreur lors de la duplication:', error)
      toast.error('Erreur lors de la duplication du produit')
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: { 
        label: "Actif", 
        className: "bg-[#6B8E23]/20 text-[#556B2F] border border-[#6B8E23]/30" 
      },
      draft: { 
        label: "Brouillon", 
        className: "bg-[#D3D3D3]/50 text-[#8B4513]/70 border border-[#D3D3D3]" 
      },
      inactive: { 
        label: "Inactif", 
        className: "bg-red-100 text-red-800 border border-red-200" 
      },
      archived: { 
        label: "Archivé", 
        className: "bg-yellow-100 text-yellow-800 border border-yellow-200" 
      }
    }
    const config = variants[status] || variants.draft
    return (
      <Badge 
        variant="outline" 
        className={`${config.className} text-xs font-medium px-2 py-0.5`}
      >
        {config.label}
      </Badge>
    )
  }

  const getStockBadge = (quantity, lowStock = 5) => {
    if (quantity === 0) {
      return <Badge variant="destructive" className="text-xs">Rupture</Badge>
    }
    if (quantity <= lowStock) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">Stock faible</Badge>
    }
    return <Badge className="bg-[#6B8E23]/20 text-[#556B2F] border-[#6B8E23]/30 text-xs">En stock</Badge>
  }

  const filteredProducts = products
    .filter(product => {
      if (filter === "all") return true
      if (filter === "active") return product.status === "active"
      if (filter === "draft") return product.status === "draft"
      if (filter === "outofstock") return product.quantity === 0
      return true
    })
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "stock") return b.quantity - a.quantity
      return 0
    })

  if (loading) {
    return (
      <Card className="border-[#D3D3D3] bg-white p-8">
        <div className="text-center flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-[#D3D3D3] border-t-[#6B8E23] rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-[#8B4513] mb-2">Chargement des produits</h3>
          <p className="text-sm text-muted-foreground">Récupération des données...</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* SEARCH AND FILTER BAR */}
        <Card className="border-[#D3D3D3] bg-white p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B4513]/60" />
                <Input
                  placeholder="Rechercher un produit, vendeur ou catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23]/20"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-[#D3D3D3] rounded-lg px-3 py-2 bg-white text-[#8B4513] focus:outline-none focus:border-[#6B8E23]"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-high">Prix élevé</option>
                  <option value="price-low">Prix bas</option>
                  <option value="stock">Stock élevé</option>
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F] hover:border-[#6B8E23]"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Plus de filtres
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-[#8B4513] bg-[#6B8E23]/10 px-3 py-1.5 rounded-lg">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>
        </Card>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="border-[#D3D3D3] bg-white overflow-hidden hover:shadow-md transition-all duration-300 hover:border-[#6B8E23]/30 group"
            >
              {/* PRODUCT IMAGE */}
              <div className="relative h-48 overflow-hidden bg-[#6B8E23]/5">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-[#D3D3D3]" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(product.status)}
                </div>
                <div className="absolute top-3 right-3">
                  {getStockBadge(product.quantity, product.lowStock)}
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-[#8B4513] line-clamp-2 flex-1 pr-2">
                      {product.name}
                    </h3>
                    <span className="text-lg font-bold text-[#6B8E23] whitespace-nowrap">
                      €{product.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-[#D3D3D3] text-[#8B4513]/70 bg-[#6B8E23]/5"
                    >
                      {product.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ID: {product.id.slice(-6)}
                    </span>
                  </div>
                </div>

                {/* PRODUCT DETAILS */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-[#D3D3D3]/30">
                    <span className="text-sm text-[#8B4513]/70">Vendeur</span>
                    <span className="text-sm font-medium text-[#8B4513]">
                      {product.vendor?.companyName || 'Non attribué'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-[#D3D3D3]/30">
                    <span className="text-sm text-[#8B4513]/70">Stock actuel</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        product.quantity === 0 ? 'text-red-500' : 
                        product.quantity <= (product.lowStock || 5) ? 'text-amber-500' : 
                        'text-[#556B2F]'
                      }`}>
                        {product.quantity} unités
                      </span>
                      {product.quantity <= (product.lowStock || 5) && product.quantity > 0 && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          Faible
                        </span>
                      )}
                    </div>
                  </div>

                  {product.sales && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-[#8B4513]/70">Ventes 30j</span>
                      <div className="flex items-center gap-1">
                        <BarChart className="h-3.5 w-3.5 text-[#6B8E23]" />
                        <span className="text-sm font-medium text-[#8B4513]">
                          {product.sales}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 pt-4 border-t border-[#D3D3D3]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F] hover:border-[#6B8E23]"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(product)}
                    className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F] hover:border-[#6B8E23]"
                    title="Dupliquer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product)}
                    className="hover:bg-red-600"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <Card className="border-[#D3D3D3] bg-white p-8 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#6B8E23]/10 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-[#6B8E23]" />
              </div>
              <h3 className="text-lg font-medium text-[#8B4513] mb-2">Aucun produit trouvé</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                {searchQuery 
                  ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres termes.`
                  : filter !== "all"
                    ? `Aucun produit avec le statut "${filter}".`
                    : "Aucun produit disponible pour le moment."
                }
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23]/10"
                >
                  Réinitialiser la recherche
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* EDIT MODAL */}
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