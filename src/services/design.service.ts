import api from "@/lib/api";
import { DesignCategory, Product } from "@/types/produits";

export const designCategories = [
  {
    name: "Peinture & Revêtements",
    iconName: "PaintBucket",
    description: "Peintures et finitions murales",
    image: "/design/Peinture & Revêtements.jfif",
    type: "design"
  },
  {
    name: "Mobilier Design",
    iconName: "Sofa",
    description: "Meubles contemporains et design",
    image: "/design/Meubles contemporains et design.jfif",
    type: "design"
  },
  {
    name: "Décoration Murale",
    iconName: "Brush",
    description: "Éléments décoratifs muraux",
    image: "/design/Éléments décoratifs muraux.jfif",
    type: "design"
  },
  {
    name: "Luminaires Design",
    iconName: "Lamp",
    description: "Éclairage design et contemporain",
    image: "/design/Éclairage design et contemporain.jfif",
    type: "design"
  },
  {
    name: "Textiles Décoratifs",
    iconName: "Wand2",
    description: "Tissus et textiles d'ameublement",
    image: "/design/Tissus et textiles d'ameublement.jfif",
    type: "design"
  },
  {
    name: "Accessoires Déco",
    iconName: "Sparkles",
    description: "Accessoires de décoration",
    image: "/design/Accessoires de décoration.jfif",
    type: "design"
  },
  {
    name: "Art & Tableaux",
    iconName: "Palette",
    description: "Œuvres d'art et reproductions",
    image: "/design/Œuvres d'art et reproductions.jfif",
    type: "design"
  },
  {
    name: "Rangements Design",
    iconName: "Warehouse",
    description: "Solutions de rangement esthétiques",
    image: "/design/Solutions de rangement esthétiques.jfif",
    type: "design"
  },
] as DesignCategory[];

export const designService = {
  // Récupérer toutes les catégories de design avec leur nombre de produits
  async getCategories(searchQuery?: string): Promise<DesignCategory[]> {
    try {
      const response = await api.get('/products/categories', {
        params: {
          type: 'design',
          search: searchQuery
        }
      });

      // Fusionner les données statiques avec les comptages de produits
      return designCategories.map(cat => ({
        ...cat,
        productCount: response.data.find((c: any) => c.name === cat.name)?.count || 0
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories design:', error);
      return [];
    }
  },

  // Récupérer les produits d'une catégorie spécifique
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const response = await api.get('/products', {
        params: {
          category: categoryName,
          type: 'design',
          status: 'active'
        }
      });
      return response.data.products;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits design:', error);
      return [];
    }
  },

  // Rechercher des produits de design
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await api.get('/products', {
        params: {
          search: query,
          type: 'design',
          status: 'active'
        }
      });
      return response.data.products;
    } catch (error) {
      console.error('Erreur lors de la recherche des produits design:', error);
      return [];
    }
  }
};