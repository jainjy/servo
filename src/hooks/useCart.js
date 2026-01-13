// hooks/useCart.js
import { useState, useEffect } from 'react';

export const useCart = (user) => {
  const [cartItems, setCartItems] = useState([]);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // console.log('Cart loaded:', parsedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('Erreur parsing cart:', error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    if (user) {
      // console.log('Saving cart:', cartItems);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product) => {
    // console.log('Adding to cart:', product);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevItems, { 
          ...product, 
          quantity: 1
        }];
      }
      
      // console.log('New cart items:', newItems);
      return newItems;
    });
  };

  const updateCart = (items) => {
    setCartItems(items);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemsCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    // console.log('Cart count:', count);
    return count;
  };

  return {
    cartItems,
    addToCart,
    updateCart,
    clearCart,
    getCartItemsCount,
  };
};