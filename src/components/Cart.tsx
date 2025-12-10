// components/Cart.js - VERSION AVEC TEXTES EN NOIR
import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "./contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { trackUserActivity } from '@/lib/suggestionApi';

const Cart = ({ isOpen, onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    isLoading,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [localCartItems, setLocalCartItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Couleurs personnalisées
  const COLORS = {
    logo: "#556B2F",           /* Olive green - accent */
    primaryDark: "#6B8E23",    /* Yellow-green - fonds légers */
    lightBg: "#FFFFFF",        /* White - fond de page */
    separator: "#D3D3D3",      /* Light gray - séparateurs */
    secondaryText: "#8B4513",  /* Saddle brown - titres secondaires */
    smallText: "#000000",      /* Noir pour les petits textes */
  };

  // Synchroniser avec les items du contexte
  useEffect(() => {
    console.log("🔄 [CART] - Synchronisation des items du panier:", cartItems?.length);
    setLocalCartItems(cartItems || []);
  }, [cartItems]);

  // Vérifier l'authentification et tracker l'ouverture du panier
  useEffect(() => {
    if (isOpen) {
      console.log("🛒 [CART] - Ouverture du panier, vérification auth...");
      checkAuthentication();
      
      // Track l'ouverture du panier
      safeTrack(() => trackUserActivity({
        entityType: "cart",
        entityId: "cart_view",
        action: "view_cart",
        metadata: {
          itemsCount: cartItems?.length || 0,
          total: calculateTotal()
        }
      }));
    }
  }, [isOpen]);

  // Empêcher le scroll du body quand le panier est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fonctions de tracking avec gestion d'erreurs
  const safeTrack = async (trackingFunction) => {
    try {
      await trackingFunction();
    } catch (error) {
      console.error('Erreur tracking (non bloquante):', error);
    }
  };

  const trackAddToCart = async (item) => {
    await trackUserActivity({
      entityType: "product",
      entityId: item.id,
      action: "add_to_cart",
      metadata: {
        productName: item.name,
        price: item.price,
        quantity: item.quantity
      }
    });
  };

  const trackRemoveFromCart = async (item, reason = "manual_remove") => {
    await trackUserActivity({
      entityType: "product",
      entityId: item.id,
      action: "remove_from_cart",
      metadata: {
        productName: item.name,
        reason: reason,
        quantity: item.quantity
      }
    });
  };

  const trackPurchase = async (items, total) => {
    for (const item of items) {
      await trackUserActivity({
        entityType: "product",
        entityId: item.id,
        action: "purchase",
        metadata: {
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          total: total
        }
      });
    }
  };

  const trackQuantityChange = async (item, oldQuantity, newQuantity) => {
    const action = newQuantity > oldQuantity ? "cart_quantity_increase" : "cart_quantity_decrease";
    await trackUserActivity({
      entityType: "product",
      entityId: item.id,
      action: action,
      metadata: {
        productName: item.name,
        oldQuantity,
        newQuantity,
        difference: Math.abs(newQuantity - oldQuantity)
      }
    });
  };

  // Fonction pour vérifier l'authentification
  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");

      console.log("🔍 [CART AUTH] - Vérification détaillée:");
      console.log("📍 Token:", token ? "Présent" : "Absent");
      console.log("📍 UserData:", userData ? "Présent" : "Absent");

      if (token && token !== "null" && token !== "undefined") {
        setIsAuthenticated(true);
        console.log("✅ [CART AUTH] - Utilisateur authentifié");

        if (userData && userData !== "null" && userData !== "undefined") {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            console.log("👤 [CART AUTH] - Données utilisateur:", parsedUser);
          } catch (error) {
            console.error("❌ [CART AUTH] - Erreur parsing user data:", error);
            setUser({ firstName: "Utilisateur", lastName: "" });
          }
        } else {
          console.log("⚠️ [CART AUTH] - Données utilisateur manquantes");
          setUser({ firstName: "Utilisateur", lastName: "" });
        }
      } else {
        console.log("❌ [CART AUTH] - Aucun token valide - Utilisateur non authentifié");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("💥 [CART AUTH] - Erreur lors de la vérification auth:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Gérer les erreurs d'image
  const handleImageError = (productId) => {
    setImageErrors((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  // Calcul du total
  const calculateTotal = () => {
    return (localCartItems || []).reduce((total, item) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  // Calcul du sous-total pour un article
  const calculateItemTotal = (item) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    return price * quantity;
  };

  // Mettre à jour la quantité avec tracking
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const item = localCartItems.find(item => item.id === productId);
      const oldQuantity = item?.quantity || 0;
      
      await updateQuantity(productId, newQuantity);
      
      // Track le changement de quantité
      if (item && newQuantity !== oldQuantity) {
        await safeTrack(() => trackQuantityChange(item, oldQuantity, newQuantity));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Supprimer un article avec tracking
  const handleRemoveItem = async (productId) => {
    const item = localCartItems.find(item => item.id === productId);
    if (item) {
      await safeTrack(() => trackRemoveFromCart(item, "manual_remove"));
    }
    removeFromCart(productId);
  };

  // Vider le panier avec tracking
  const handleClearCart = async () => {
    try {
      // Track chaque article supprimé
      for (const item of localCartItems) {
        await safeTrack(() => trackRemoveFromCart(item, "clear_cart"));
      }
      
      clearCart();
      setValidationErrors([]);
      toast.success("Panier vidé");
    } catch (error) {
      console.error('Erreur tracking clear cart:', error);
      // Vider quand même le panier même si le tracking échoue
      clearCart();
      setValidationErrors([]);
    }
  };

  // Rediriger vers la page de connexion
  const redirectToLogin = () => {
    console.log("🔐 [CART] - Redirection vers login");
    onClose();
    navigate("/login");
  };

  // Fonction de checkout améliorée avec meilleur débogage
  const handleCheckout = async () => {
    console.log("🎯 [CART CHECKOUT] - Début du processus de commande");
    
    // DEBUG: Afficher les items
    console.log("📦 Items dans le panier:", JSON.stringify(localCartItems, null, 2));

    // Validation
    if (!isAuthenticated) {
      toast.error("❌ Veuillez vous connecter pour passer commande");
      redirectToLogin();
      return;
    }

    if (!localCartItems || localCartItems.length === 0) {
      toast.error("Votre panier est vide !");
      return;
    }

    setIsCheckingOut(true);
    setValidationErrors([]);

    try {
      // ✅ Structure SIMPLIFIÉE
      const orderData = {
        items: localCartItems.map(item => ({
          productId: item.id, // Garde l'ID tel quel
          quantity: item.quantity || 1
        })),
        shippingAddress: {
          firstName: user?.firstName || "Client",
          lastName: user?.lastName || "",
          address: user?.address || "",
          city: user?.city || "",
          postalCode: user?.zipCode || "",
          country: "France"
        },
        paymentMethod: "card"
      };

      console.log("📤 Données envoyées au backend:", JSON.stringify(orderData, null, 2));

      // Appel API
      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        // Succès
        clearCart();
        onClose();
        
        toast.success(
          `🎉 Commande #${response.data.order.orderNumber} créée !`,
          {
            description: `Total: €${response.data.order.totalAmount?.toFixed(2) || '0.00'}`,
            duration: 5000,
          }
        );

        // Redirection
        setTimeout(() => {
          navigate('/mon-compte/mes-commandes');
        }, 2000);
      } else {
        throw new Error(response.data.message || "Erreur inconnue");
      }

    } catch (error) {
      console.error("💥 Erreur détaillée:", error);
      console.error("💥 Réponse erreur:", error.response?.data);
      
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
        toast.error("❌ Problèmes détectés dans votre panier");
      } else if (error.response?.status === 401) {
        toast.error("❌ Session expirée");
        redirectToLogin();
      } else {
        toast.error(error.response?.data?.message || "Erreur lors de la création de la commande");
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  const items = localCartItems || [];
  const itemsCount = items.length;
  const totalAmount = calculateTotal();

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose} 
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      />

      {/* Panier */}
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md flex flex-col transform transition-transform duration-300"
        style={{ backgroundColor: COLORS.lightBg }}
      >
        {/* En-tête du panier */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ 
            backgroundColor: COLORS.lightBg,
            borderBottom: `1px solid ${COLORS.separator}`
          }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag 
              className="h-6 w-6" 
              style={{ color: COLORS.logo }}
            />
            <h2 
              className="text-xl font-bold"
              style={{ color: COLORS.secondaryText }}
            >
              Mon Panier
            </h2>
            {itemsCount > 0 && (
              <Badge 
                className="px-2 py-1 rounded text-sm font-medium"
                style={{ 
                  backgroundColor: `${COLORS.primaryDark}15`,
                  color: COLORS.secondaryText
                }}
              >
                {getCartItemsCount ? getCartItemsCount() : itemsCount}{" "}
                article(s)
              </Badge>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-lg hover:bg-gray-100"
            style={{ 
              color: COLORS.smallText,
              borderColor: COLORS.separator
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenu du panier */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{ backgroundColor: COLORS.lightBg }}
        >
          {itemsCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ShoppingBag 
                className="h-20 w-20 mb-4" 
                style={{ color: COLORS.separator }}
              />
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: COLORS.secondaryText }}
              >
                Votre panier est vide
              </h3>
              <p 
                className="mb-6 max-w-xs"
                style={{ color: COLORS.smallText }}
              >
                Explorez nos produits et ajoutez vos favoris pour commencer vos
                achats
              </p>
              <Button
                onClick={() => {
                  navigate('/domicile#produits-commerces');
                  onClose();
                }}
                className="px-6 text-white"
                style={{ 
                  backgroundColor: COLORS.logo,
                  borderColor: COLORS.logo
                }}
              >
                Découvrir les produits
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Messages d'erreur de validation */}
              {validationErrors.length > 0 && (
                <div 
                  className="border rounded-lg p-4"
                  style={{ 
                    backgroundColor: "#FEF2F2",
                    borderColor: "#FCA5A5"
                  }}
                >
                  <p 
                    className="font-semibold mb-2"
                    style={{ color: "#991B1B" }}
                  >
                    ❌ Problèmes détectés dans votre panier :
                  </p>
                  <ul 
                    className="text-sm list-disc list-inside space-y-1"
                    style={{ color: "#991B1B" }}
                  >
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    style={{ 
                      color: "#991B1B",
                      borderColor: "#FCA5A5",
                      backgroundColor: "#FEF2F2"
                    }}
                    onClick={() => setValidationErrors([])}
                  >
                    Compris
                  </Button>
                </div>
              )}

              {items.map((item) => (
                <Card 
                  key={item.id} 
                  className="p-4 shadow-sm"
                  style={{ 
                    backgroundColor: COLORS.lightBg,
                    border: `1px solid ${COLORS.separator}`
                  }}
                >
                  <div className="flex gap-4">
                    {/* Image du produit */}
                    <div className="flex-shrink-0">
                      {item.images &&
                      item.images.length > 0 &&
                      !imageErrors[item.id] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name || "Produit"}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={() => handleImageError(item.id)}
                        />
                      ) : (
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${COLORS.primaryDark}15, ${COLORS.logo}15)`
                          }}
                        >
                          <ShoppingBag 
                            className="h-6 w-6"
                            style={{ color: COLORS.logo }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-semibold text-sm mb-1 line-clamp-2"
                        style={{ color: COLORS.secondaryText }}
                      >
                        {item.name || "Produit sans nom"}
                      </h4>
                      <p 
                        className="font-bold text-lg mb-2"
                        style={{ color: COLORS.logo }}
                      >
                        €{item.price ? item.price.toFixed(2) : "0.00"}
                      </p>

                      {/* Sous-total de l'article */}
                      <p 
                        className="text-sm mb-3"
                        style={{ color: COLORS.smallText }}
                      >
                        Sous-total:{" "}
                        <span className="font-semibold">
                          €{calculateItemTotal(item).toFixed(2)}
                        </span>
                      </p>

                      {/* Contrôles de quantité */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-2"
                            style={{ 
                              borderColor: COLORS.separator,
                              color: COLORS.smallText
                            }}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                (item.quantity || 0) - 1
                              )
                            }
                            disabled={(item.quantity || 0) <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span 
                            className="w-8 text-center font-bold"
                            style={{ color: COLORS.smallText }}
                          >
                            {item.quantity || 0}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-2"
                            style={{ 
                              borderColor: COLORS.separator,
                              color: COLORS.smallText
                            }}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                (item.quantity || 0) + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          style={{ 
                            color: "#DC2626",
                            backgroundColor: "transparent"
                          }}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pied de page - Total et actions */}
        {itemsCount > 0 && (
          <div 
            className="border-t p-4 space-y-4"
            style={{ 
              backgroundColor: `${COLORS.primaryDark}08`,
              borderTop: `1px solid ${COLORS.separator}`
            }}
          >
            {/* Résumé de commande */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span style={{ color: COLORS.smallText }}>
                  Sous-total:
                </span>
                <span 
                  className="font-medium"
                  style={{ color: COLORS.smallText }}
                >
                  €{totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span style={{ color: COLORS.smallText }}>
                  Livraison:
                </span>
                <span 
                  className="font-medium"
                  style={{ color: COLORS.logo }}
                >
                  Gratuite
                </span>
              </div>
              <div 
                className="border-t pt-2"
                style={{ borderColor: COLORS.separator }}
              >
                <div className="flex justify-between items-center text-lg font-bold">
                  <span style={{ color: COLORS.secondaryText }}>
                    Total:
                  </span>
                  <span 
                    style={{ color: COLORS.logo }}
                  >
                    €{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              <Button
                className="w-full h-12 text-base font-semibold rounded-lg text-white"
                onClick={handleCheckout}
                disabled={
                  isCheckingOut ||
                  itemsCount === 0 ||
                  !isAuthenticated ||
                  validationErrors.length > 0
                }
                style={{ 
                  backgroundColor: isCheckingOut || !isAuthenticated || validationErrors.length > 0 
                    ? `${COLORS.logo}80` 
                    : COLORS.logo,
                  borderColor: COLORS.logo
                }}
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                    />
                    Traitement en cours...
                  </div>
                ) : !isAuthenticated ? (
                  "Se connecter pour commander"
                ) : validationErrors.length > 0 ? (
                  "Corrigez les erreurs pour commander"
                ) : (
                  `Passer au Commande`
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full h-10 rounded-lg"
                onClick={handleClearCart}
                disabled={itemsCount === 0}
                style={{ 
                  borderColor: COLORS.separator,
                  color: COLORS.smallText,
                  backgroundColor: COLORS.lightBg
                }}
              >
                Vider le panier
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;