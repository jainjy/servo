import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Brush, Search, Filter, X } from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { designService } from "@/services/design.service";
import { DesignCategory } from "@/types/produits";
import {
  PaintBucket,
  Sofa,
  Brush as BrushIcon,
  Lamp,
  Wand2,
  Sparkles,
  Palette,
  Warehouse,
  Package,
} from "lucide-react";

interface DesignSectionProps {
  searchQuery?: string;
}

const iconComponents = {
  PaintBucket,
  Sofa,
  Brush: BrushIcon,
  Lamp,
  Wand2,
  Sparkles,
  Palette,
  Warehouse,
  Package,
};

const DesignSection = ({ searchQuery }: DesignSectionProps) => {
  const [categories, setCategories] = useState<DesignCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "count">("name");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const data = await designService.getCategories(localSearch);
        setCategories(data.filter(cat => cat.productCount > 0));
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [localSearch]);

  // Tri des catégories
  const sortedCategories = [...categories].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return b.productCount - a.productCount;
    }
  });

  const handleCategoryClick = (category: DesignCategory) => {
    navigate(`/produits/categorie/${encodeURIComponent(category.name)}`, {
      state: {
        name: category.name,
        description: category.description,
        image: category.image,
        section: "design"
      }
    });
  };

  const clearSearch = () => {
    setLocalSearch("");
  };

  // Si pas de catégories et pas de recherche, afficher un message vide
  if (categories.length === 0 && !isLoading && !localSearch) {
    return (
      <div className="bg-white/70 p-5 pb-14 my-5 rounded-lg" id="design">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-gray-300 shadow-lg">
            <Brush className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-4xl font-bold text-black/70">
              Design & Décoration
            </h2>
            <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
              Aucun design disponible pour le moment
            </p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Section vide
          </h3>
          <p className="text-gray-500">
            Aucun produit design n'est disponible actuellement
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 p-5 pb-14 my-5 rounded-lg" id="design">
      {/* En-tête avec recherche */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div
          className="flex items-center gap-4 animate-scale-up flex-1"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="p-3 rounded-xl bg-slate-900 shadow-lg transform transition-transform duration-300 hover:scale-110">
            <Brush className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-black/70">
              Design & Décoration
            </h2>
            <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
              Solutions esthétiques pour sublimer votre intérieur
            </p>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Input
              placeholder="Rechercher un design..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-10 rounded-xl border-gray-300 focus:border-[#0052FF]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Trier
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-white/50 p-4 rounded-lg mb-6 border border-gray-200 animate-fade-in">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Trier par :</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
                className={sortBy === "name" ? "bg-[#0052FF] text-white" : ""}
              >
                Nom A-Z
              </Button>
              <Button
                variant={sortBy === "count" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("count")}
                className={sortBy === "count" ? "bg-[#0052FF] text-white" : ""}
              >
                Plus de produits
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      {localSearch && (
        <div className="mb-6 animate-fade-in">
          <p className="text-gray-600">
            {sortedCategories.length > 0 
              ? `${sortedCategories.length} résultat(s) pour "${localSearch}"`
              : `Aucun résultat pour "${localSearch}"`
            }
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0052FF] mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement des designs...</p>
        </div>
      ) : (
        <>
          {/* Grille des catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedCategories.map((category, index) => {
              const IconComponent = iconComponents[category.iconName as keyof typeof iconComponents] || Package;

              return (
                <Card
                  key={category.name}
                  className="group p-6 border-0 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-scale-up-card"
                  style={{
                    animationDelay: `${0.7 + index * 0.1}s`,
                  }}
                >
                  <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                    <img src={category.image} alt="" className="w-full h-full object-cover" />
                    <div className="flex justify-end absolute bg-blue-700 rounded-full text-white bottom-2 right-2">
                      <Badge>
                        {category.productCount} produit{category.productCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-[#0052FF] transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-[#5A6470] text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <Button
                    className="w-full bg-[#0052FF]/10 hover:bg-[#0052FF] hover:text-white text-[#0052FF] border-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                    onClick={() => handleCategoryClick(category)}
                  >
                    Explorer
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Message aucun résultat après recherche */}
          {sortedCategories.length === 0 && !isLoading && localSearch && (
            <div className="text-center py-12 animate-fade-in">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucun design trouvé
              </h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesignSection;