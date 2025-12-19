import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/lib/api'; // Import de votre configuration Axios

// Constants
const CART_STORAGE_KEY = 'cart';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  [key: string]: any;
}

interface CartItem extends Product {
  quantity: number;
  addedAt: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  updateCart: (items: CartItem[]) => void;
  clearCart: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  getCartItemsCount: () => number;
  validateCart: (items: CartItem[]) => Promise<any>;
  checkStock: (productId: string, quantity: number) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error('Invalid cart data format');
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
  }, []);

  // Save cart on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  // Valider le panier avec le backend
  const validateCart = useCallback(async (items: CartItem[]) => {
    try {
      setError(null);
      const response = await api.post('/cart/validate', { 
        cartItems: items 
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur validation panier:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la validation du panier';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Vérifier le stock d'un produit
  const checkStock = useCallback(async (productId: string, quantity: number) => {
    try {
      const response = await api.post('/cart/check-stock', { 
        productId, 
        quantity 
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur vérification stock:', error);
      // En cas d'erreur, on suppose que le produit est disponible
      return { available: true };
    }
  }, []);

  const addToCart = useCallback(async (product: Product) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const existingItem = cartItems.find(item => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      // Vérifier le stock avant d'ajouter
      const stockCheck = await checkStock(product.id, newQuantity);
      if (!stockCheck.available) {
        throw new Error(`Stock insuffisant pour "${product.name}". Disponible: ${stockCheck.availableStock}`);
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...prevItems, {
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString()
        }];
      });
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, checkStock]);

  const updateCart = useCallback((items: CartItem[]) => {
    setCartItems(items);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setError(null);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    setError(null);
  }, []);

  const updateQuantity = useCallback(async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Vérifier le stock avant mise à jour
      const stockCheck = await checkStock(productId, newQuantity);
      if (!stockCheck.available) {
        throw new Error(`Stock insuffisant. Disponible: ${stockCheck.availableStock}`);
      }

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [removeFromCart, checkStock]);

  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateCart,
    clearCart,
    removeFromCart,
    updateQuantity,
    getCartItemsCount,
    validateCart,
    checkStock,
    isLoading,
    error
  }), [
    cartItems,
    addToCart,
    updateCart,
    clearCart,
    removeFromCart,
    updateQuantity,
    getCartItemsCount,
    validateCart,
    checkStock,
    isLoading,
    error
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return {
    cartItems: context.cartItems,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    getCartItemsCount: () => context.cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0,
    isLoading: context.isLoading,
  };
};