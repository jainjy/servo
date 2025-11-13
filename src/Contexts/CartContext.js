import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { Trash2, Package, Clock, Truck } from "lucide-react";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, deliveryInfo, saveDeliveryInfo } = useCart();
  const [showDelivery, setShowDelivery] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    mode: "standard",
  });

  // Initialiser le formulaire avec les infos existantes
  useEffect(() => {
    if (deliveryInfo) {
      setFormData(deliveryInfo);
    }
  }, [deliveryInfo]);

  // Calculer le total correctement
  const total = cartItems.reduce((sum, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    return sum + itemTotal;
  }, 0);

  // Compter les produits et services
  const productsCount = cartItems.filter(item => item.type === 'product').length;
  const servicesCount = cartItems.filter(item => item.type === 'service').length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    saveDeliveryInfo(formData);
    toast.success("Informations de livraison enregistrées !");
    setShowDelivery(false);
  };

  const handleQuantityChange = (itemId, newQuantity, itemType) => {
    // Pour les services, la quantité reste toujours à 1 - on empêche toute modification
    if (itemType === 'service') {
      toast.info("La quantité des services est fixée à 1");
      return;
    }
    
    // Pour les produits, validation normale
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    toast.info("Article retiré du panier");
  };

  // Fonction pour gérer la commande
  const handleCheckout = async () => {
    try {
      // Validation basique
      if (cartItems.length === 0) {
        toast.error("Votre panier est vide");
        return;
      }

      // Vérifier si des produits nécessitent une livraison
      const hasProducts = cartItems.some(item => item.type === 'product');
      if (hasProducts && !deliveryInfo) {
        toast.error("Veuillez compléter les informations de livraison pour les produits");
        setShowDelivery(true);
        return;
      }

      // Simulation de commande réussie
      console.log("🚀 Commande passée avec succès:", {
        items: cartItems,
        total: total,
        deliveryInfo: hasProducts ? deliveryInfo : "Aucune livraison nécessaire (service)"
      });

      toast.success("🎉 Commande passée avec succès !");
      
      // Ici vous pouvez ajouter la logique pour vider le panier ou rediriger
      // clearCart(); // Si vous avez cette fonction dans votre contexte

    } catch (error) {
      console.error("💥 Erreur lors de la commande:", error);
      toast.error("Erreur lors de la commande");
    }
  };

  const getItemTypeBadge = (item) => {
    if (item.type === 'service') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Clock className="w-3 h-3 mr-1" />
          Service
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Package className="w-3 h-3 mr-1" />
        Produit
      </span>
    );
  };

  const getDeliveryTime = (mode) => {
    return mode === "express" ? "24h" : "2-5 jours";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">🛒 Votre Panier</h2>
            {cartItems.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {cartItems.length} article(s)
                </span>
                {productsCount > 0 && (
                  <span className="bg-blue-500/50 px-3 py-1 rounded-full">
                    {productsCount} produit(s)
                  </span>
                )}
                {servicesCount > 0 && (
                  <span className="bg-green-500/50 px-3 py-1 rounded-full">
                    {servicesCount} service(s)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">Aucun article dans le panier.</p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Continuer vos achats
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Liste des articles */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                              item.type === 'service' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              {item.type === 'service' ? (
                                <Clock className="w-6 h-6 text-green-600" />
                              ) : (
                                <Package className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Détails */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg truncate">
                              {item.name || "Article sans nom"}
                            </h3>
                            {getItemTypeBadge(item)}
                          </div>

                          {/* Informations spécifiques */}
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.type === 'service' && item.duration && (
                              <p>⏱️ Durée: {item.duration}</p>
                            )}
                            {item.type === 'product' && item.trackQuantity && (
                              <p>📦 Stock: {item.availableStock || item.quantity || 0}</p>
                            )}
                            {item.category && (
                              <p>📁 Catégorie: {item.category}</p>
                            )}
                          </div>

                          {/* Contrôles de quantité */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-3">
                              {item.type === 'product' ? (
                                // Contrôles de quantité pour les produits
                                <>
                                  <button
                                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1, item.type)}
                                    disabled={(item.quantity || 1) <= 1}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                  >
                                    -
                                  </button>
                                  <span className="font-medium w-8 text-center">
                                    {item.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1, item.type)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  >
                                    +
                                  </button>
                                </>
                              ) : (
                                // Affichage fixe pour les services - AUCUN BOUTON DE MODIFICATION
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">Quantité:</span>
                                  <span className="font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                    1
                                  </span>
                                  <span className="text-xs text-gray-400">(fixe)</span>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                €{item.price?.toFixed(2)} {item.type === 'service' ? '' : `× ${item.quantity || 1}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Résumé et actions */}
                <div className="border-t pt-6 space-y-6">
                  {/* Total */}
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">€{total.toFixed(2)}</span>
                  </div>

                  {/* Informations importantes */}
                  {servicesCount > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        💡 <strong>Information:</strong> Les services ont une quantité fixe de 1 et ne peuvent pas être modifiés.
                      </p>
                    </div>
                  )}

                  {/* Bouton Livraison */}
                  <div className="flex justify-between items-center">
                    {productsCount > 0 && (
                      <button
                        onClick={() => setShowDelivery(!showDelivery)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                      >
                        <Truck className="w-5 h-5" />
                        <span>Informations de livraison</span>
                      </button>
                    )}
                    
                    {/* Bouton Commander */}
                    <button 
                      onClick={handleCheckout}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Commander (€{total.toFixed(2)})
                    </button>
                  </div>

                  {/* Formulaire Livraison */}
                  {showDelivery && (
                    <form
                      onSubmit={handleDeliverySubmit}
                      className="p-6 border border-gray-200 rounded-lg space-y-4 bg-gray-50"
                    >
                      <h3 className="font-semibold text-lg flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        Informations de livraison
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet *
                          </label>
                          <input
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Votre nom complet"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone *
                          </label>
                          <input
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            placeholder="Votre numéro de téléphone"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse *
                        </label>
                        <input
                          name="adresse"
                          value={formData.adresse}
                          onChange={handleChange}
                          placeholder="Votre adresse complète"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mode de livraison
                        </label>
                        <select
                          name="mode"
                          value={formData.mode}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="standard">Standard ({getDeliveryTime("standard")}) - Gratuit</option>
                          <option value="express">Express ({getDeliveryTime("express")}) - €9.99</option>
                        </select>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex-1"
                        >
                          Confirmer la livraison
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDelivery(false)}
                          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Infos livraison enregistrées */}
                  {deliveryInfo && !showDelivery && productsCount > 0 && (
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-green-800 mb-2">
                            ✅ Informations de livraison enregistrées
                          </p>
                          <p className="text-green-700">
                            <strong>{deliveryInfo.nom}</strong> - {deliveryInfo.adresse} - {deliveryInfo.telephone}
                          </p>
                          <p className="text-green-600 text-sm mt-1">
                            Mode: {deliveryInfo.mode} ({getDeliveryTime(deliveryInfo.mode)})
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDelivery(true)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;