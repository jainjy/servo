import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Construction, Search, Filter, X } from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { materiauxService } from "@/services/materiaux.service";
import { MateriauxCategory } from "@/types/produits";
import {
    Warehouse,
    Thermometer,
    Square,
    TreePine,
    DoorClosed,
    Droplets,
    Zap,
    Package,
} from "lucide-react";

interface MateriauxSectionProps {
  searchQuery?: string;
  onCategoryClick?: (categoryName: string, section: string) => void;
}

const iconComponents = {
    Warehouse,
    Thermometer,
    Square,
    TreePine,
    DoorClosed,
    Droplets,
    Zap,
    Package,
};

const MateriauxSection = ({ searchQuery, onCategoryClick }: MateriauxSectionProps) => {
    const [categories, setCategories] = useState<MateriauxCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localSearch, setLocalSearch] = useState(searchQuery || "");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<"name" | "count">("name");
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            try {
                const data = await materiauxService.getCategories(localSearch);
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

    const handleCategoryClick = (category: MateriauxCategory) => {
        navigate(`/produits/categorie/${encodeURIComponent(category.name)}`, {
            state: {
                name: category.name,
                description: category.description,
                image: category.image,
                section: "matériaux"
            }
        });
    };

    const clearSearch = () => {
        setLocalSearch("");
    };

    if (categories.length === 0 && !isLoading && !localSearch) return null;

    return (
        <div className="bg-white/70 p-5 pb-14 my-5 rounded-lg" id="materiaux">
            {/* En-tête avec recherche */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div
                    className="flex items-center gap-4 animate-slide-from-right flex-1"
                    style={{ animationDelay: "0.4s" }}
                >
                    <div className="p-3 rounded-xl bg-slate-900 shadow-lg transform transition-transform duration-300 hover:scale-110">
                        <Construction className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl lg:text-2xl font-bold text-black/70">
                            Matériaux Construction
                        </h2>
                        <p className="text-xs lg:text-sm text-[#5A6470] mt-1">
                            Matériaux de construction et fournitures pour tous vos projets de rénovation
                        </p>
                    </div>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="relative flex-1 min-w-[250px]">
                        <Input
                            placeholder="Rechercher un matériau..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="pl-10 pr-10 rounded-xl border-gray-300 focus:border-[#00C2A8]"
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
                                className={sortBy === "name" ? "bg-[#00C2A8] text-white" : ""}
                            >
                                Nom A-Z
                            </Button>
                            <Button
                                variant={sortBy === "count" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSortBy("count")}
                                className={sortBy === "count" ? "bg-[#00C2A8] text-white" : ""}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C2A8] mx-auto"></div>
                    <p className="text-gray-500 mt-4">Chargement des matériaux...</p>
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
                                    className="group p-6 border-0 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-white/20 text-center animate-slide-from-right-card"
                                    style={{
                                        animationDelay: `${0.5 + index * 0.1}s`,
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

                                    <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-[#00C2A8] transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                    <p className="text-[#5A6470] text-xs mb-4 leading-relaxed">
                                        {category.description}
                                    </p>
                                    <Button
                                        className="w-full border bg-transparent hover:bg-slate-900 hover:text-white text-slate-900 transition-all duration-300 group-hover:shadow-lg"
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        Explorer
                                        <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Message aucun résultat */}
                    {sortedCategories.length === 0 && !isLoading && (
                        <div className="text-center py-12 animate-fade-in">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                Aucun matériau trouvé
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

export default MateriauxSection;