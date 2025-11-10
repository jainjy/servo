import api from "@/lib/api";
import { EquipementCategory, Product } from "@/types/produits";

export const equipementCategories = [
  {
    name: "Équipements de chauffage",
    iconName: "Flame",
    description: "Chauffage et climatisation",
    image: "/equipement/chauffage.jfif",
    type: "equipement"
  },
  {
    name: "Électroménager",
    iconName: "Zap",
    description: "Appareils ménagers modernes",
    image: "/equipement/electroménager.jfif",
    type: "equipement"
  },
  {
    name: "Meubles",
    iconName: "Sofa",
    description: "Meubles design et fonctionnels",
    image: "/equipement/Meubles.jfif",
    type: "equipement"
  },
  {
    name: "Décoration",
    iconName: "Palette",
    description: "Décorations intérieures",
    image: "/equipement/Decoration.jfif",
    type: "equipement"
  },
  {
    name: "Jardinage",
    iconName: "Sprout",
    description: "Équipement de jardin",
    image: "/equipement/Équipement_de_jardin.jfif",
    type: "equipement"
  },
  {
    name: "Outillage",
    iconName: "Wrench",
    description: "Outils professionnels",
    image: "/equipement/Outils_professionnels.jfif",
    type: "equipement"
  },
  {
    name: "Sécurité maison",
    iconName: "Lock",
    description: "Systèmes de sécurité",
    image: "/equipement/Systèmes_de_sécurité.jfif",
    type: "equipement"
  },
  {
    name: "Luminaires",
    iconName: "Lamp",
    description: "Éclairage intérieur et extérieur",
    image: "/equipement/Éclairage_intérieur_et_extérieur.jfif",
    type: "equipement"
  },
] as EquipementCategory[];

export const equipementService = {
  // Récupérer toutes les catégories d'équipement avec leur nombre de produits
  async getCategories(searchQuery?: string): Promise<EquipementCategory[]> {
    try {
      const response = await api.get('/products/categories', {
        params: {
          type: 'equipement',
          search: searchQuery
        }
      });

      // Fusionner les données statiques avec les comptages de produits
      return equipementCategories.map(cat => ({
        ...cat,
        productCount: response.data.find((c: any) => c.name === cat.name)?.count || 0
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories équipement:', error);
      return [];
    }
  },

  // Récupérer les produits d'une catégorie spécifique
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const response = await api.get('/products', {
        params: {
          category: categoryName,
          type: 'equipement',
          status: 'active'
        }
      });
      return response.data.products;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits équipement:', error);
      return [];
    }
  },

  // Rechercher des produits d'équipement
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await api.get('/products', {
        params: {
          search: query,
          type: 'equipement',
          status: 'active'
        }
      });
      return response.data.products;
    } catch (error) {
      console.error('Erreur lors de la recherche des produits équipement:', error);
      return [];
    }
  }
};