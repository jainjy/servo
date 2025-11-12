// pages/CategorieProduits.js
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";

const CategorieProduits = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart(user);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const categoryData = location.state?.category;
    if (categoryData) {
      setCategory(categoryData);
    }
    fetchCategoryProducts();
  }, [categoryName]);

  const fetchCategoryProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products', {
        params: {
          category: categoryName,
          status: 'active'
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits de la catégorie:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-[#F6F8FA] flex items-center justify-center">
        <div className="text-center">
          <img src="/loading.gif" alt="" className='w-24 h-24'/>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#F6F8FA]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la catégorie */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>

          {category && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                {category.icon && (
                  <div className="p-3 rounded-2xl bg-[#0052FF]/10">
                    <category.icon className="h-8 w-8 text-[#0052FF]" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {category.name}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {category.description}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {products.length} produit{products.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Produits de la catégorie */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Aucun produit disponible dans cette catégorie pour le moment.
            </p>
            <Button
              onClick={() => navigate('/produits')}
              className="bg-[#0052FF] hover:bg-[#003EE6]"
            >
              Retour aux catégories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorieProduits;