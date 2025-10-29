import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, removeFromCart, deliveryInfo, saveDeliveryInfo } = useCart();
  const [showDelivery, setShowDelivery] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    mode: "standard",
  });

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    saveDeliveryInfo(formData);
    toast.success("Infos de livraison enregistrées !");
    setShowDelivery(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Votre Panier</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Aucun article dans le panier.</p>
      ) : (
        <>
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b py-2">
              <div>
                <span className="font-medium">{item.title || "Produit sans nom"}</span>
                <p className="text-gray-600 text-sm">{item.price}€</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between mt-4 font-bold text-lg">
            <span>Total</span>
            <span>{total}€</span>
          </div>

          {/* Bouton Livraison */}
          <div className="mt-4 text-right">
            <button
              onClick={() => setShowDelivery(!showDelivery)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              🚚 Livraison
            </button>
          </div>

          {/* Formulaire Livraison */}
          {showDelivery && (
            <form
              onSubmit={handleDeliverySubmit}
              className="mt-4 p-4 border border-gray-200 rounded space-y-3 bg-gray-50"
            >
              <h3 className="font-semibold mb-2">Informations de livraison</h3>
              <input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom complet"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="Adresse"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Téléphone"
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="standard">Standard (2-5 jours)</option>
                <option value="express">Express (24h)</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirmer Livraison
              </button>
            </form>
          )}

          {/* Infos livraison */}
          {deliveryInfo && (
            <div className="mt-4 p-3 border border-green-200 bg-green-50 rounded">
              <p><strong>Livraison enregistrée :</strong></p>
              <p>
                {deliveryInfo.nom} - {deliveryInfo.adresse} - {deliveryInfo.telephone} - Mode : {deliveryInfo.mode}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
