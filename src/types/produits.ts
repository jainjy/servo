export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  iconName: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: string;
}

// Interfaces spécifiques pour chaque section
export interface EquipementCategory extends ProductCategory {
  type: 'equipement';
}

export interface MateriauxCategory extends ProductCategory {
  type: 'materiaux';
}

export interface DesignCategory extends ProductCategory {
  type: 'design';
}