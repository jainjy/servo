// src/pages/admin/ServiceCategoriesPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, ArrowLeft, List, Tag } from "lucide-react";
import { CategoryModal } from "@/components/admin/services/category-modal";
import api from "@/lib/api";
import { toast } from "sonner";
import { AssignCategoryModal } from "./assign-category-modal";

interface Category {
  id: number;
  name: string;
  _count?: {
    services: number;
  };
}

interface Service {
  id: number;
  libelle: string;
  categoryId: number | null;
  description?: string;
  _count?: {
    metiers: number;
    users: number;
  };
}

export default function ServiceCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [servicesWithoutCategory, setServicesWithoutCategory] = useState<
    Service[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchServicesWithoutCategory();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesWithoutCategory = async () => {
    try {
      setServicesLoading(true);
      const response = await api.get("/services/without-category");
      setServicesWithoutCategory(response.data);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des services sans catégorie:",
        error
      );
    } finally {
      setServicesLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedCategory(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ? Cette action supprimera également tous les services associés.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/categories/${category.id}`);
      await fetchCategories();
      await fetchServicesWithoutCategory();
      toast.success("Catégorie supprimée avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression"
      );
    }
  };

  const handleCategoryUpdated = () => {
    fetchCategories();
    fetchServicesWithoutCategory();
    setIsModalOpen(false);
  };

  const handleCategoryAssigned = () => {
    fetchCategories();
    fetchServicesWithoutCategory();
    setIsAssignModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Catégories de services
            </h1>
            <p className="text-muted-foreground">
              Gérer les catégories de services
            </p>
          </div>
        </div>
        <Card className="bg-card border-border p-6">
          <div className="text-center text-muted-foreground">
            Chargement des catégories...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/services"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux services
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Catégories de services
            </h1>
            <p className="text-muted-foreground">
              Gérer les catégories de services
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsAssignModalOpen(true)}
            variant="outline"
            className="border-border hover:bg-accent"
          >
            <Tag className="mr-2 h-4 w-4" />
            Assigner des catégories
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </div>
      </div>

      {/* Section Services sans catégorie */}
      {servicesWithoutCategory.length > 0 && (
        <Card className="bg-card border-border border-yellow-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Tag className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Services sans catégorie
                </h3>
                <p className="text-sm text-muted-foreground">
                  {servicesWithoutCategory.length} service(s) n'ont pas encore
                  de catégorie assignée
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {servicesWithoutCategory.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <span className="text-sm font-medium text-yellow-800">
                    {service.libelle}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 border-yellow-300"
                  >
                    Sans catégorie
                  </Badge>
                </div>
              ))}
              {servicesWithoutCategory.length > 6 && (
                <div className="p-3 text-center">
                  <span className="text-sm text-muted-foreground">
                    + {servicesWithoutCategory.length - 6} autre(s) service(s)
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setIsAssignModalOpen(true)}
                variant="outline"
                size="sm"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                <Tag className="mr-2 h-4 w-4" />
                Assigner les catégories
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Recherche et liste des catégories */}
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery
                ? "Aucune catégorie trouvée pour votre recherche"
                : "Aucune catégorie disponible"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Card
                  key={category.id}
                  className="border-border bg-card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-2">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          {category._count?.services || 0} service(s)
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="flex-1 border-border hover:bg-accent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modales */}
      <CategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        category={selectedCategory}
        mode={modalMode}
        onCategoryUpdated={handleCategoryUpdated}
      />

      <AssignCategoryModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        categories={categories}
        servicesWithoutCategory={servicesWithoutCategory}
        onCategoryAssigned={handleCategoryAssigned}
      />
    </div>
  );
}
