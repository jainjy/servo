// components/MateriauxTravauxSection.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  Boxes,
  Truck,
  Package,
  Euro,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Eye,
  Heart,
  Star,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  sku?: string;
  brand?: string;
  quantity: number;
  lowStock?: number;
  featured: boolean;
  productType: string;
  origin?: string;
  unit?: string;
  viewCount: number;
  vendor?: {
    companyName?: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FilterOptions {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: "price_asc" | "price_desc" | "name" | "newest" | "most_viewed";
  inStock: boolean;
  featured: boolean;
}

const MateriauxTravauxSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<FilterOptions>({
    category: "Toutes",
    minPrice: null,
    maxPrice: null,
    sortBy: "newest", // OK mais pas envoyé au serveur
    inStock: false,
    featured: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<
    { name: string; count: number }[]
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const { user } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/products/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  // Récupérer les produits
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pagination.limit,
        productType: "materiaux",
        status: "active",
      };

      // Ajouter les filtres
      if (searchQuery) params.search = searchQuery;
      if (filters.category !== "Toutes") params.category = filters.category;
      if (filters.minPrice !== null) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== null) params.maxPrice = filters.maxPrice;
      if (filters.inStock) params.inStock = true;
      if (filters.featured) params.featured = true;

      // 🔧 CORRECTION: Simplifier le tri
      if (filters.sortBy === "price_asc") {
        params.sort = "price:asc";
      } else if (filters.sortBy === "price_desc") {
        params.sort = "price:desc";
      } else if (filters.sortBy === "name") {
        params.sort = "name:asc";
      } else if (filters.sortBy === "most_viewed") {
        params.sort = "viewCount:desc";
      }
      // Pour "newest" ne pas ajouter de sort (utilise le tri par défaut du serveur)

      const response = await api.get("/products/all", { params });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      console.log(response.data)
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  // Initialisation - CORRECTION: Simplifier
  useEffect(() => {
    fetchCategories();
    fetchProducts(1);
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchProducts(1);
      } else {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtres
  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  // Pagination
  useEffect(() => {
    fetchProducts(pagination.page);
  }, [pagination.page]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour ajouter au panier");
      return;
    }

    try {
      setAddingProductId(product.id);

      // ✅ Structure standardisée pour le panier
      const cartProduct = {
        id: product.id,
        name: product.name || "Produit sans nom",
        price: product.price || 0,
        image: product.images?.[0] || "/placeholder.jpg",
        category: product.category || "Matériaux",
        quantity: 1, // Toujours ajouter 1 article
        description: product.description,
        vendor: product.vendor?.companyName,
        sku: product.sku,
        unit: product.unit,
      };

      // ✅ Ajouter au panier via le contexte
      addToCartContext(cartProduct);

      // ✅ Afficher confirmation
      toast.success(`${product.name} ajouté au panier !`);

    } catch (error) {
      console.error('Erreur ajout panier:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setTimeout(() => setAddingProductId(null), 500);
    }
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const clearFilters = () => {
    setFilters({
      category: "Toutes",
      minPrice: null,
      maxPrice: null,
      sortBy: "newest",
      inStock: false,
      featured: false,
    });
    setSearchQuery("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getStockStatus = (quantity: number, lowStock = 5) => {
    if (quantity === 0)
      return { text: "Rupture", color: "bg-red-100 text-red-800" };
    if (quantity <= lowStock)
      return { text: "Stock faible", color: "bg-yellow-100 text-yellow-800" };
    return { text: "En stock", color: "bg-green-100 text-green-800" };
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product.quantity, product.lowStock);
    const hasDiscount =
      product.comparePrice && product.comparePrice > product.price;
    const discountPercent = hasDiscount
      ? Math.round(
          ((product.comparePrice! - product.price) / product.comparePrice!) *
            100
        )
      : 0;

    return (
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
        {/* Badge promotion */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-red-600 text-white px-2 py-1 text-xs font-bold">
              -{discountPercent}%
            </Badge>
          </div>
        )}

        {/* Badge vedette */}
        {product.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-yellow-500 text-white px-2 py-1 text-xs">
              <Star className="h-3 w-3 mr-1" />
              Vedette
            </Badge>
          </div>
        )}

        {/* Image produit */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Actions rapides */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={() => handleQuickView(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Catégorie */}
          <div className="mb-2">
            <Badge variant="outline" className="text-xs text-gray-600">
              {product.subcategory || product.category}
            </Badge>
          </div>

          {/* Nom produit */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#556B2F] transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Vendeur */}
          {product.vendor?.companyName && (
            <div className="text-xs text-gray-500 mb-3">
              <Package className="h-3 w-3 inline mr-1" />
              {product.vendor.companyName}
            </div>
          )}

          {/* Prix */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-[#556B2F]">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>
            <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
          </div>

          {/* Origine */}
          {product.origin && (
            <div className="text-xs text-gray-500 mb-3">
              <Truck className="h-3 w-3 inline mr-1" />
              Origine: {product.origin}
            </div>
          )}

          {/* Unités */}
          {product.unit && (
            <div className="text-xs text-gray-500 mb-4">
              <Boxes className="h-3 w-3 inline mr-1" />
              Unité: {product.unit}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
              size="sm"
              onClick={() => handleAddToCart(product)}
              disabled={product.quantity === 0 || addingProductId === product.id}
            >
              {addingProductId === product.id ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ajout...
                </div>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.quantity === 0 ? "Rupture" : "Ajouter"}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickView(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex justify-between mb-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const QuickViewModal = () => {
    if (!selectedProduct) return null;

    const stockStatus = getStockStatus(
      selectedProduct.quantity,
      selectedProduct.lowStock
    );
    const hasDiscount =
      selectedProduct.comparePrice &&
      selectedProduct.comparePrice > selectedProduct.price;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                <Boxes className="h-6 w-6 text-[#6B8E23]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedProduct.category}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedProduct(null)}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Images */}
              <div>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedProduct.images[0] || "/placeholder.jpg"}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.slice(0, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="h-20 object-cover rounded cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Détails */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700">{selectedProduct.description}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prix</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#556B2F]">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      {hasDiscount && (
                        <div>
                          <span className="text-sm text-gray-500 line-through mr-2">
                            {formatPrice(selectedProduct.comparePrice!)}
                          </span>
                          <Badge className="bg-red-100 text-red-800">
                            Économisez{" "}
                            {formatPrice(
                              selectedProduct.comparePrice! -
                                selectedProduct.price
                            )}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Stock</span>
                    <Badge className={stockStatus.color}>
                      {stockStatus.text} ({selectedProduct.quantity} unités)
                    </Badge>
                  </div>

                  {selectedProduct.brand && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Marque</span>
                      <span className="font-medium">
                        {selectedProduct.brand}
                      </span>
                    </div>
                  )}

                  {selectedProduct.origin && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Origine</span>
                      <span className="font-medium">
                        {selectedProduct.origin}
                      </span>
                    </div>
                  )}

                  {selectedProduct.sku && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Référence</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {selectedProduct.sku}
                      </code>
                    </div>
                  )}

                  {selectedProduct.vendor?.companyName && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vendeur</span>
                      <span className="font-medium">
                        {selectedProduct.vendor.companyName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white py-3"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.quantity === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {selectedProduct.quantity === 0
                      ? "Rupture de stock"
                      : "Ajouter au panier"}
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="materiaux-travaux-section" className="py-8">
      {/* Barre de recherche et filtres */}
      <div className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Input
              placeholder="Rechercher un matériau..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Bouton filtres */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
            {(filters.category !== "Toutes" ||
              filters.minPrice !== null ||
              filters.maxPrice !== null) && (
              <Badge className="ml-2 bg-[#556B2F]">Actifs</Badge>
            )}
          </Button>

          {/* Tri */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="newest">Nouveautés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
            <option value="most_viewed">Plus populaires</option>
          </select>
        </div>

        {/* Panneau filtres avancés */}
        {showFilters && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Catégories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Toutes">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min €"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max €"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          inStock: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-[#556B2F]"
                    />
                    <span className="text-sm">En stock seulement</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-[#556B2F]"
                    />
                    <span className="text-sm">Produits vedettes</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions filtres */}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#556B2F]">
              {pagination.total}
            </div>
            <div className="text-sm text-gray-600">Produits</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#556B2F]">
              {products.filter((p) => p.featured).length}
            </div>
            <div className="text-sm text-gray-600">Vedettes</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#556B2F]">
              {products.filter((p) => p.quantity > 0).length}
            </div>
            <div className="text-sm text-gray-600">En stock</div>
          </div>

        </div>
      </div>

      {/* Liste produits */}
      {loading ? (
        <LoadingSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Boxes className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Aucun matériau trouvé
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? `Aucun résultat pour "${searchQuery}"`
              : "Aucun matériau disponible pour le moment"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2 mx-auto"
            >
              <X className="h-4 w-4" />
              Réinitialiser la recherche
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? "default" : "outline"
                        }
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page: pageNum }))
                        }
                        className={`h-10 w-10 ${
                          pagination.page === pageNum
                            ? "bg-[#556B2F] text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
                className="flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Résumé pagination */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Affichage de {(pagination.page - 1) * pagination.limit + 1} à{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur{" "}
            {pagination.total} produits
          </div>
        </>
      )}

      {/* Modal vue rapide */}
      <QuickViewModal />

    </div>
  );
};

export default MateriauxTravauxSection;
