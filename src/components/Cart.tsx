// components/Cart.js
import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
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
      console.log("📍 Token:", token);
      console.log("📍 UserData:", userData);
      console.log("📍 Panier items:", cartItems?.length || 0);

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
    window.location.href = "/login";
  };

  // ✅ NOUVELLE FONCTION : Validation réelle avec le backend
  const validateCartWithBackend = async () => {
    try {
      console.log("🛒 [CART VALIDATION] - Début validation avec backend");
      
      // Préparer les données pour l'API
      const cartData = {
        items: localCartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          images: item.images || [],
          productType: item.productType || 'general'
        })),
        shippingAddress: {}, // À compléter selon vos besoins
        paymentMethod: "card" // Par défaut
      };

      console.log("📦 [CART VALIDATION] - Données envoyées:", cartData);

      // Appel réel à l'API
      const response = await api.post('/orders', cartData);
      
      console.log("✅ [CART VALIDATION] - Réponse backend:", response.data);
      
      return response.data;

    } catch (error) {
      console.error("💥 [CART VALIDATION] - Erreur validation panier:", error);
      
      // Gestion détaillée des erreurs
      if (error.response) {
        console.error("📡 [CART VALIDATION] - Détails erreur:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        if (error.response.status === 400 && error.response.data.errors) {
          // Erreurs de stock
          setValidationErrors(error.response.data.errors);
          throw new Error("Problèmes de stock détectés");
        } else if (error.response.status === 401) {
          throw new Error("Authentification requise");
        } else if (error.response.status === 500) {
          throw new Error("Erreur serveur, veuillez réessayer");
        }
      }
      
      throw new Error(error.response?.data?.message || "Erreur lors de la validation du panier");
    }
  };

  // Valider le panier avant commande
  const validateCartBeforeCheckout = async () => {
    if (!localCartItems || localCartItems.length === 0) {
      toast.error("Votre panier est vide !");
      return false;
    }
    return true;
  };

  // ✅ CORRECTION : Commander avec le backend réel
  const handleCheckout = async () => {
    console.log("🎯 [CART CHECKOUT] - Début du processus de commande");
    console.log("🔐 [CART CHECKOUT] - Statut auth avant vérification:", isAuthenticated);
    console.log("👤 [CART CHECKOUT] - Utilisateur avant vérification:", user);

    // Re-vérifier l'authentification avant de commander
    checkAuthentication();

    console.log("🔐 [CART CHECKOUT] - Statut auth après vérification:", isAuthenticated);
    console.log("👤 [CART CHECKOUT] - Utilisateur après vérification:", user);

    if (!isAuthenticated) {
      console.log("❌ [CART CHECKOUT] - Utilisateur non authentifié, redirection vers login");
      toast.error("❌ Veuillez vous connecter pour passer commande");
      redirectToLogin();
      return;
    }

    console.log("✅ [CART CHECKOUT] - Utilisateur authentifié, validation du panier...");

    // Valider le panier d'abord
    const isValid = await validateCartBeforeCheckout();
    if (!isValid) {
      console.log("❌ [CART CHECKOUT] - Panier invalide, arrêt du processus");
      return;
    }

    console.log("✅ [CART CHECKOUT] - Panier valide, création de commande...");
    setIsCheckingOut(true);

    try {
      // ✅ APPEL RÉEL AU BACKEND
      const orderResult = await validateCartWithBackend();

      console.log("✅ [CART CHECKOUT] - Commande créée avec succès:", orderResult);
      
      // Track l'achat
      await safeTrack(() => trackPurchase(localCartItems, calculateTotal()));
      
      // Vider le panier
      handleClearCart();

      // Fermer le panier
      onClose();

      // Afficher le succès avec détails
      toast.success(
        `🎉 Commande #${orderResult.order.orderNumber} passée avec succès !`,
        {
          description: `Total: €${orderResult.order.totalAmount.toFixed(2)}`,
          duration: 5000,
        }
      );
      
      console.log("🎉 [CART CHECKOUT] - Processus de commande terminé avec succès");

    } catch (error) {
      console.error("💥 [CART CHECKOUT] - Erreur lors de la commande:", error);

      // Gestion spécifique des erreurs
      if (error.message.includes("stock")) {
        toast.error(
          `❌ Problèmes de stock détectés. Veuillez vérifier votre panier.`
        );
      } else if (error.message.includes("Authentification")) {
        toast.error("❌ Session expirée, veuillez vous reconnecter");
        redirectToLogin();
      } else {
        toast.error(`❌ Erreur lors de la commande: ${error.message}`);
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Test manuel d'authentification (optionnel)
  const testAuthManually = () => {
    console.log("=== 🧪 TEST MANUEL AUTHENTIFICATION ===");
    const token = localStorage.getItem("auth-token");
    const userData = localStorage.getItem("user-data");
    
    console.log("🔑 Token:", token);
    console.log("👤 UserData:", userData);
    console.log("✅ isAuthenticated:", isAuthenticated);
    console.log("👤 User state:", user);
    console.log("📍 Cart items:", localCartItems.length);
    
    // Test API direct
    api.get("/orders/test/auth")
      .then(response => {
        console.log("✅ Test API Auth réussi:", response.data);
        toast.success("Test API Auth réussi - voir console");
      })
      .catch(error => {
        console.error("❌ Test API Auth échoué:", error);
        toast.error("Test API Auth échoué - voir console");
      });
  };

  // Test de création de commande (debug)
  const testOrderCreation = async () => {
    try {
      console.log("🧪 TEST création commande...");
      const testData = {
        items: [
          {
            productId: "test-product-1",
            name: "Produit Test",
            price: 25.99,
            quantity: 2,
            images: [],
            productType: "general"
          }
        ],
        shippingAddress: {
          firstName: "Test",
          lastName: "User",
          address: "123 Test Street",
          city: "Test City",
          postalCode: "12345",
          country: "France"
        },
        paymentMethod: "card"
      };

      const response = await api.post('/orders', testData);
      console.log("✅ Test création commande réussi:", response.data);
      toast.success("Test création commande réussi");
    } catch (error) {
      console.error("❌ Test création commande échoué:", error);
      toast.error("Test création commande échoué");
    }
  };

  if (!isOpen) return null;

  const items = localCartItems || [];
  const itemsCount = items.length;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panier */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col transform transition-transform duration-300">
        {/* En-tête du panier */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Mon Panier</h2>
            {itemsCount > 0 && (
              <Badge className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                {getCartItemsCount ? getCartItemsCount() : itemsCount}{" "}
                article(s)
              </Badge>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenu du panier */}
        <div className="flex-1 overflow-y-auto p-4">
          {itemsCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ShoppingBag className="h-20 w-20 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Votre panier est vide
              </h3>
              <p className="text-gray-500 mb-6 max-w-xs">
                Explorez nos produits et ajoutez vos favoris pour commencer vos
                achats
              </p>
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Découvrir les produits
              </Button>

              
            </div>
          ) : (
            <div className="space-y-4">
              {/* Messages d'erreur de validation */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold mb-2">
                    ❌ Problèmes détectés dans votre panier :
                  </p>
                  <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
                    onClick={() => setValidationErrors([])}
                  >
                    Compris
                  </Button>
                </div>
              )}

              {items.map((item) => (
                <Card key={item.id} className="p-4 bg-white shadow-sm">
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
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-blue-400" />
                        </div>
                      )}
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.name || "Produit sans nom"}
                      </h4>
                      <p className="text-blue-600 font-bold text-lg mb-2">
                        €{item.price ? item.price.toFixed(2) : "0.00"}
                      </p>

                      {/* Sous-total de l'article */}
                      <p className="text-sm text-gray-600 mb-3">
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

                          <span className="w-8 text-center font-bold text-gray-900">
                            {item.quantity || 0}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-2"
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
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
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
          <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
            {/* Résumé de commande */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Sous-total:</span>
                <span className="font-medium">
                  €{calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Livraison:</span>
                <span className="font-medium text-green-600">Gratuite</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    €{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            
            {/* Actions */}
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-lg"
                onClick={handleCheckout}
                disabled={
                  isCheckingOut ||
                  itemsCount === 0 ||
                  !isAuthenticated ||
                  validationErrors.length > 0
                }
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement en cours...
                  </div>
                ) : !isAuthenticated ? (
                  "Se connecter pour commander"
                ) : validationErrors.length > 0 ? (
                  "Corrigez les erreurs pour commander"
                ) : (
                  "Passer la commande"
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={handleClearCart}
                disabled={itemsCount === 0}
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