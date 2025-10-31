// components/Cart.js
import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "./contexts/CartContext";
import api from "@/lib/api"; // Import de votre configuration Axios
import { toast } from "sonner";

const Cart = ({ isOpen, onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    validateCart,
    isLoading,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [localCartItems, setLocalCartItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  // Vérifier l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Synchroniser avec les items du contexte
  useEffect(() => {
    setLocalCartItems(cartItems || []);
  }, [cartItems]);

  // Vérifier l'authentification quand le panier s'ouvre
  useEffect(() => {
    if (isOpen) {
      console.log("🛒 [CART] - Ouverture du panier, vérification auth...");
      checkAuthentication();
    }
  }, [isOpen]);

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

  // Mettre à jour la quantité
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Supprimer un article
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  // Vider le panier
  const handleClearCart = () => {
    clearCart();
    setValidationErrors([]);
  };

  // Rediriger vers la page de connexion
  const redirectToLogin = () => {
    console.log("🔐 [CART] - Redirection vers login");
    onClose();
    window.location.href = "/login";
  };

  // Valider le panier avant commande
  const validateCartBeforeCheckout = async () => {
    try {
      setValidationErrors([]);
      console.log("🛒 [CART VALIDATION] - Validation du panier...");
      const validationResult = await validateCart(localCartItems);

      if (validationResult.errors && validationResult.errors.length > 0) {
        console.log("❌ [CART VALIDATION] - Erreurs de validation:", validationResult.errors);
        setValidationErrors(validationResult.errors);
        return false;
      }

      console.log("✅ [CART VALIDATION] - Panier valide");
      return true;
    } catch (error) {
      console.error("💥 [CART VALIDATION] - Erreur validation panier:", error);
      setValidationErrors([error.message]);
      return false;
    }
  };

  // Créer une commande
  const createOrder = async () => {
    try {
      console.log("📦 [CART ORDER] - Création de commande...");
      
      const orderData = {
        items: localCartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          images: item.images || [],
        })),
        shippingAddress: user?.shippingAddress || {},
        paymentMethod: "card",
      };

      console.log("📦 [CART ORDER] - Données de commande:", {
        itemsCount: orderData.items.length,
        total: calculateTotal(),
        userAuthenticated: isAuthenticated,
        user: user
      });

      const response = await api.post("/orders", orderData);
      console.log("✅ [CART ORDER] - Commande créée avec succès:", response.data);
      return response.data;
    } catch (error) {
      console.error("💥 [CART ORDER] - Erreur création commande:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la création de la commande"
      );
    }
  };

  // Commander
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
      // Créer la commande réelle
      const orderResult = await createOrder();

      console.log("✅ [CART CHECKOUT] - Commande créée avec succès:", orderResult);

      // Vider le panier
      handleClearCart();

      // Fermer le panier
      onClose();

      // Afficher le succès
      const itemsSummary = localCartItems
        .map(
          (item) =>
            `• ${item.name} x${item.quantity} - €${calculateItemTotal(
              item
            ).toFixed(2)}`
        )
        .join("\n");
      
      toast.info(
        `Commande #${orderResult.order.orderNumber} passée avec succès !`
      );
      
      console.log("🎉 [CART CHECKOUT] - Processus de commande terminé avec succès");

    } catch (error) {
      console.error("💥 [CART CHECKOUT] - Erreur lors de la commande:", error);

      // Gestion spécifique des erreurs de stock
      if (error.response?.data?.errors) {
        const stockErrors = error.response.data.errors;
        setValidationErrors(stockErrors);
        toast.error(
          `❌ Problèmes de stock détectés. Veuillez vérifier votre panier.`
        );
      } else {
        toast.error(`❌ Erreur lors de la commande: ${error.message}`);
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Test manuel d'authentification
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

              {/* Indication de statut d'authentification */}
              <div className={`p-3 rounded-lg text-sm ${
                isAuthenticated 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              }`}>
                {isAuthenticated ? (
                  <div>
                    <strong>✅ Connecté en tant que:</strong> {user?.firstName} {user?.lastName}
                  </div>
                ) : (
                  <div>
                    <strong>⚠️ Non connecté:</strong> Veuillez vous connecter pour commander
                  </div>
                )}
              </div>

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

            {/* Bouton de test debug */}
            <Button
              variant="outline"
              className="w-full border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              onClick={testAuthManually}
            >
              🧪 Tester l'Authentification
            </Button>

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