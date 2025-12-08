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
  onCategoryClick?: (categoryName: string, section: string) => void;
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
const DesignSection = ({
  searchQuery,
  onCategoryClick,
}: DesignSectionProps) => {
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
        setCategories(data.filter((cat) => cat.productCount > 0));
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
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
        section: "design",
      },
    });
  };
  const clearSearch = () => {
    setLocalSearch("");
  };
  // Si pas de catégories et pas de recherche, afficher un message vide
  if (categories.length === 0 && !isLoading && !localSearch) {
    return (
      <div className="bg-[#FFFFFF]/70 p-5 pb-14 my-5 rounded-lg" id="design">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-[#D3D3D3] shadow-lg">
            <Brush className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-4xl font-bold text-[#556B2F]">
              Design & Décoration
            </h2>
            <p className="text-xs lg:text-sm text-[#8B4513] mt-2">
              Aucun design disponible pour le moment
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-[#D3D3D3] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#8B4513] mb-2">
            Section vide
          </h3>
          <p className="text-[#8B4513]">
            Aucun produit design n'est disponible actuellement
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#FFFFFF]/70 p-5 pb-14 my-5 rounded-lg" id="design">
      {/* En-tête avec recherche */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div
          className="flex items-center gap-4 animate-scale-up flex-1"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="p-3 rounded-xl bg-[#556B2F] shadow-lg transform transition-transform duration-300 hover:scale-110">
            <Brush className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-[#556B2F]">
              Design & Décoration
            </h2>
            <p className="text-xs lg:text-sm text-[#8B4513] mt-2">
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
              className="pl-10 pr-10 rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B4513]" />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B4513] hover:text-[#556B2F]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-[#D3D3D3]"
          >
            <Filter className="h-4 w-4" />
            Trier
          </Button>
        </div>
      </div>
      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-[#FFFFFF]/50 p-4 rounded-lg mb-6 border border-[#D3D3D3] animate-fade-in">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-[#8B4513]">
              Trier par :
            </span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
                className={
                  sortBy === "name"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
              >
                Nom A-Z
              </Button>
              <Button
                variant={sortBy === "count" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("count")}
                className={
                  sortBy === "count"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
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
          <p className="text-[#8B4513]">
            {sortedCategories.length > 0
              ? `${sortedCategories.length} résultat(s) pour "${localSearch}"`
              : `Aucun résultat pour "${localSearch}"`}
          </p>
        </div>
      )}
      {/* Loading */}
      {isLoading ? (
        <div className=" py-12 flex flex-col justify-center items-center">
          <img src="/loading.gif" alt="" className="w-24 h-24" />
          <p className="text-[#8B4513] mt-4">Chargement des designs...</p>
        </div>
      ) : (
        <>
          {/* Grille des catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedCategories.map((category, index) => {
              const IconComponent =
                iconComponents[
                  category.iconName as keyof typeof iconComponents
                ] || Package;
              return (
                <Card
                  key={category.name}
                  className="group p-6 border-0 bg-[#FFFFFF]/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-[#D3D3D3]/20 text-center animate-scale-up-card"
                  style={{
                    animationDelay: `${0.7 + index * 0.1}s`,
                  }}
                >
                  <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                    <img
                      src={category.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="flex justify-end absolute bg-[#556B2F] rounded-full text-white bottom-2 right-2">
                      <Badge>
                        {category.productCount} produit
                        {category.productCount !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#556B2F] group-hover:text-[#6B8E23] transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-[#8B4513] text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <Button
                    className="w-full bg-[#556B2F]/10 hover:bg-[#6B8E23] hover:text-white text-[#556B2F] border-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
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
              <Package className="h-16 w-16 text-[#D3D3D3] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#8B4513] mb-2">
                Aucun design trouvé
              </h3>
              <p className="text-[#8B4513]">
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
