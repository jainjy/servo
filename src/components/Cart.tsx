// components/Cart.js
import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "./contexts/CartContext";

const Cart = ({ isOpen, onClose }) => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemsCount
    } = useCart();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [localCartItems, setLocalCartItems] = useState([]);
    const [imageErrors, setImageErrors] = useState({});

    // Vérifier l'authentification
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Synchroniser avec les items du contexte
    useEffect(() => {
        setLocalCartItems(cartItems || []);
    }, [cartItems]);

    // Vérifier l'authentification quand le panier s'ouvre
    useEffect(() => {
        checkAuthentication();
    }, [isOpen]);

    // Fonction pour vérifier l'authentification
    const checkAuthentication = () => {
        try {
            const token = localStorage.getItem('auth-token');
            const userData = localStorage.getItem('user-data');
            
            if (token && token !== 'null' && token !== 'undefined') {
                setIsAuthenticated(true);
                if (userData && userData !== 'null' && userData !== 'undefined') {
                    try {
                        const parsedUser = JSON.parse(userData);
                        setUser(parsedUser);
                    } catch (error) {
                        setUser({ firstName: 'Utilisateur', lastName: '' });
                    }
                } else {
                    setUser({ firstName: 'Utilisateur', lastName: '' });
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    // Empêcher le scroll du body quand le panier est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Gérer les erreurs d'image
    const handleImageError = (productId) => {
        setImageErrors(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    // Calcul du total
    const calculateTotal = () => {
        return (localCartItems || []).reduce((total, item) => {
            const price = item?.price || 0;
            const quantity = item?.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    // Calcul du sous-total pour un article
    const calculateItemTotal = (item) => {
        const price = item?.price || 0;
        const quantity = item?.quantity || 0;
        return price * quantity;
    };

    // Mettre à jour la quantité
    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    // Supprimer un article
    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    // Vider le panier
    const handleClearCart = () => {
        clearCart();
    };

    // Rediriger vers la page de connexion
    const redirectToLogin = () => {
        onClose();
        window.location.href = '/login';
    };

    // Générer un numéro de commande aléatoire
    const generateOrderNumber = () => {
        return 'CMD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    };

    // Formater la date
    const formatOrderDate = () => {
        return new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Commander (mode simulation)
    const handleCheckout = async () => {
        // Re-vérifier l'authentification avant de commander
        checkAuthentication();
        
        if (!isAuthenticated) {
            alert('❌ Veuillez vous connecter pour passer commande');
            redirectToLogin();
            return;
        }

        setIsCheckingOut(true);
        
        // Simulation du traitement de commande
        setTimeout(() => {
            try {
                // Générer une commande simulée
                const orderNumber = generateOrderNumber();
                const totalAmount = calculateTotal();
                const orderDate = formatOrderDate();
                
                console.log('✅ Commande simulée créée:', {
                    orderNumber,
                    totalAmount,
                    items: localCartItems,
                    user: user,
                    date: orderDate
                });

                // Sauvegarder la commande dans le localStorage pour historique
                const orderData = {
                    orderNumber,
                    totalAmount,
                    items: localCartItems,
                    user: user,
                    date: orderDate,
                    status: 'confirmed'
                };

                // Sauvegarder dans l'historique des commandes
                const existingOrders = JSON.parse(localStorage.getItem('order-history') || '[]');
                existingOrders.push(orderData);
                localStorage.setItem('order-history', JSON.stringify(existingOrders));

                // Vider le panier
                handleClearCart();

                // Fermer le panier
                onClose();

                // Afficher le succès avec plus de détails
                const itemsSummary = localCartItems.map(item => 
                    `• ${item.name} x${item.quantity} - €${calculateItemTotal(item).toFixed(2)}`
                ).join('\n');

                alert(`✅ Commande #${orderNumber} passée avec succès !

📦 Détails de la commande :
${itemsSummary}

💰 Total : €${totalAmount.toFixed(2)}
📅 Date : ${orderDate}
👤 Client : ${user.firstName} ${user.lastName}
📧 Email : ${user.email}

💡 Cette commande est en mode simulation. 
Le système de commandes complet sera disponible prochainement.`);

            } catch (error) {
                console.error("💥 Erreur lors de la commande simulée:", error);
                alert('❌ Erreur lors du traitement de la commande simulée');
            } finally {
                setIsCheckingOut(false);
            }
        }, 1500); // 1.5 secondes de simulation
    };

    if (!isOpen) return null;

    const items = localCartItems || [];
    const itemsCount = items.length;

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Panier */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col transform transition-transform duration-300">
                {/* En-tête du panier */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Mon Panier</h2>
                        {itemsCount > 0 && (
                            <Badge className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                {getCartItemsCount ? getCartItemsCount() : itemsCount} article(s)
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
                                Explorez nos produits et ajoutez vos favoris pour commencer vos achats
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
                            {items.map((item) => (
                                <Card key={item.id} className="p-4 bg-white shadow-sm">
                                    <div className="flex gap-4">
                                        {/* Image du produit */}
                                        <div className="flex-shrink-0">
                                            {item.images && item.images.length > 0 && !imageErrors[item.id] ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name || 'Produit'}
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
                                                {item.name || 'Produit sans nom'}
                                            </h4>
                                            <p className="text-blue-600 font-bold text-lg mb-2">
                                                €{item.price ? item.price.toFixed(2) : '0.00'}
                                            </p>

                                            {/* Sous-total de l'article */}
                                            <p className="text-sm text-gray-600 mb-3">
                                                Sous-total: <span className="font-semibold">€{calculateItemTotal(item).toFixed(2)}</span>
                                            </p>

                                            {/* Contrôles de quantité */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full border-2"
                                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 0) - 1)}
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
                                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 0) + 1)}
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
                                <span className="font-medium">€{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Livraison:</span>
                                <span className="font-medium text-green-600">Gratuite</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">€{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Note d'information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <div className="text-blue-600 mt-0.5">💡</div>
                                <div>
                                    <p className="text-blue-800 text-sm font-medium">Mode démonstration</p>
                                    <p className="text-blue-700 text-xs">Le système de commandes fonctionne en simulation</p>
                                </div>
                            </div>
                        </div>

                        {/* Indication de connexion */}
                        {!isAuthenticated && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-yellow-800 text-sm text-center">
                                    🔐 Connectez-vous pour passer commande
                                </p>
                            </div>
                        )}

                        {/* Informations utilisateur */}
                        {isAuthenticated && user && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-green-800 text-sm text-center">
                                    ✅ Connecté en tant que <strong>{user.firstName} {user.lastName}</strong>
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-lg"
                                onClick={handleCheckout}
                                disabled={isCheckingOut || itemsCount === 0 || !isAuthenticated}
                            >
                                {isCheckingOut ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Traitement en cours...
                                    </div>
                                ) : !isAuthenticated ? (
                                    "Se connecter pour commander"
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