import { useState, useEffect } from "react";
import api from "@/lib/api";

export interface IBRService {
  id: number;
  libelle: string;
  description: string;
  categoryId: number;
  images: string[];
  duration: number | null;
  price: number | null;
  category: {
    id: number;
    name: string;
  } | null;
  metiers: Array<{
    metier: {
      id: number;
      libelle: string;
    };
  }>;
}
export function useIBRServices() {
  const [services, setServices] = useState<IBRService[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les services IBR
      const servicesResponse = await api.get("/services-ibr");
      console.log("✅ Services IBR chargés:", servicesResponse.data.length);
      setServices(servicesResponse.data);

      // Récupérer les catégories IBR
      const categoriesResponse = await api.get("/services-ibr/categories");
      console.log(
        "✅ Catégories IBR chargées:",
        categoriesResponse.data.length
      );
      setCategories(categoriesResponse.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? `Erreur lors du chargement des services IBR: ${err.message}`
          : "Erreur lors du chargement des services IBR";
      setError(errorMessage);
      console.error("❌ Erreur useIBRServices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Grouper les services par catégorie IBR uniquement
  const servicesByCategory = services.reduce((acc, service) => {
    const categoryName = service.category?.name || "Non catégorisé";

    // Ne garder que les catégories IBR
    const isIBRCategory = categories.some((cat) => cat.name === categoryName);

    if (isIBRCategory) {
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
    }

    return acc;
  }, {} as Record<string, IBRService[]>);

  return {
    services,
    categories,
    servicesByCategory,
    loading,
    error,
    refetch: fetchServices,
  };
}