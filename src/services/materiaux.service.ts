import api from "@/lib/api";
import { MateriauxCategory, Product } from "@/types/produits";

export const materiauxCategories = [
  {
    name: "Matériaux de construction",
    iconName: "Warehouse",
    description: "Matériaux de base",
    image: "/materiaux/Matériaux_de_construction.jfif",
    type: "materiaux"
  },
  {
    name: "Isolation",
    iconName: "Thermometer",
    description: "Isolation thermique et phonique",
    image: "/materiaux/Isolation thermique et phonique.jfif",
    type: "materiaux"
  },
  {
    name: "Revêtements de sol",
    iconName: "Square",
    description: "Parquet, carrelage, moquette",
    image: "/materiaux/Parquet, carrelage, moquette.jfif",
    type: "materiaux"
  },
  {
    name: "Carrelage",
    iconName: "Square",
    description: "Carreaux et faïence",
    image: "/materiaux/Carreaux et faïence.jfif",
    type: "materiaux"
  },
  {
    name: "Bois et panneaux",
    iconName: "TreePine",
    description: "Bois massif et dérivés",
    image: "/materiaux/Bois massif et dérivés.jfif",
    type: "materiaux"
  },
  {
    name: "Menuiserie",
    iconName: "DoorClosed",
    description: "Portes et fenêtres",
    image: "/materiaux/Portes et fenêtres.jfif",
    type: "materiaux"
  },
  {
    name: "Plomberie",
    iconName: "Droplets",
    description: "Tuyauterie et sanitaires",
    image: "/materiaux/Tuyauterie et sanitaires.jfif",
    type: "materiaux"
  },
  {
    name: "Électricité",
    iconName: "Zap",
    description: "Câbles et appareillages",
    image: "/materiaux/Électricité.jfif",
    type: "materiaux"
  },
] as MateriauxCategory[];

export const materiauxService = {
  // Récupérer toutes les catégories de matériaux avec leur nombre de produits
  async getCategories(searchQuery?: string): Promise<MateriauxCategory[]> {
    try {
      const response = await api.get('/products/categories', {
        params: {
          type: 'materiaux',
          search: searchQuery
        }
      });

      // Fusionner les données statiques avec les comptages de produits
      return materiauxCategories.map(cat => ({
        ...cat,
        productCount: response.data.find((c: any) => c.name === cat.name)?.count || 0
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories matériaux:', error);
      return [];
    }
  },

  // Récupérer les produits d'une catégorie spécifique
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const response = await api.get('/products', {
        params: {
          category: categoryName,
          type: 'materiaux',
          status: 'active'
        }
      });
      return response.data.products;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits matériaux:', error);
      return [];
    }
  },

  // Rechercher des produits de matériaux
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await api.get('/products', {
        params: {
          search: query,
          type: 'materiaux',
          status: 'active'
        }
      });
      return response.data.products;
    } catch (error) {
      console.error('Erreur lors de la recherche des produits matériaux:', error);
      return [];
    }
  }
};