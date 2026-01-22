// components/Cart.tsx - VERSION AVEC SYNCHRONISATION LIVRAISON
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Minus, Trash2, ShoppingBag, MapPin, ChevronRight,
  Package, User, Home, Truck, Clock, CheckCircle, AlertCircle,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "./contexts/CartContext";
import api, { deliveryAPI, deliveryService } from "@/lib/api"; // MODIFIÉ
import { toast } from "sonner";
import { trackUserActivity } from '@/lib/suggestionApi';

// Import Leaflet pour la carte
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 48.8566, lng: 2.3522 });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [tempAddress, setTempAddress] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isAddressFromDB, setIsAddressFromDB] = useState(false);
  const [isDraggingMarker, setIsDraggingMarker] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [hasLoadedUserAddress, setHasLoadedUserAddress] = useState(false);

  // NOUVEAUX ÉTATS POUR LA LIVRAISON
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState(null);
  const [deliveryETA, setDeliveryETA] = useState(null);
  const [syncStatus, setSyncStatus] = useState('pending'); // pending, syncing, synced, failed
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Couleurs personnalisées
  const COLORS = {
    logo: "#556B2F",
    primaryDark: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
    smallText: "#000000",
  };

  // Synchroniser avec les items du contexte
  useEffect(() => {
    setLocalCartItems(cartItems || []);
    console.log("Cart items updated: ", cartItems);
  }, [cartItems]);

  // Vérifier l'authentification et tracker l'ouverture du panier
  useEffect(() => {
    if (isOpen) {
      const checkAndTrack = async () => {
        await checkAuthentication();

        safeTrack(() => trackUserActivity({
          entityType: "cart",
          entityId: "cart_view",
          action: "view_cart",
          metadata: {
            itemsCount: cartItems?.length || 0,
            total: calculateTotal()
          }
        }));
      };

      checkAndTrack();
    }
  }, [isOpen]);

  // NOUVEL EFFET : Vérifier le statut de livraison si une commande a été créée
  useEffect(() => {
    if (lastCreatedOrderId && syncStatus === 'syncing') {
      const checkDeliveryStatus = async () => {
        try {
          const statusData = await deliveryAPI.getDeliveryStatus(lastCreatedOrderId);

          if (statusData?.success) {
            setDeliveryStatus(statusData.deliveryStatus);
            setTrackingNumber(statusData.trackingNumber);
            setDeliveryETA(statusData.eta);
            setSyncStatus('synced');

            // Si livrée, arrêter de vérifier
            if (statusData.deliveryStatus === 'delivered') {
              toast.success("🎉 Votre commande a été livrée !");
            }
          }
        } catch (error) {
          console.error('Erreur vérification statut:', error);
          // Continuer à vérifier
        }
      };

      // Vérifier toutes les 10 secondes pendant 5 minutes
      const interval = setInterval(checkDeliveryStatus, 10000);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (syncStatus === 'syncing') {
          setSyncStatus('failed');
          toast.warning("La synchronisation avec la livraison prend plus de temps que prévu.");
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [lastCreatedOrderId, syncStatus]);

  // Charger l'adresse depuis l'utilisateur UNE FOIS seulement
  useEffect(() => {
    if (user?.address && !tempAddress && !hasLoadedUserAddress) {
      setDeliveryAddress(user.address);
      setTempAddress(user.address);
      setIsAddressFromDB(true);
      setHasLoadedUserAddress(true);

      setTimeout(() => {
        if (user.address.trim().length > 0) {
          geocodeAddress(user.address, true);
        }
      }, 100);
    }
  }, [user, tempAddress, hasLoadedUserAddress]);

  // Empêcher le scroll du body quand le panier est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setHasLoadedUserAddress(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Mettre à jour la carte quand les coordonnées changent
  useEffect(() => {
    if (mapRef.current && coordinates) {
      const map = mapRef.current;
      map.setView([coordinates.lat, coordinates.lng], map.getZoom());

      if (markerRef.current) {
        markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      }
    }
  }, [coordinates]);

  // Initialiser l'adresse temporaire quand le modal s'ouvre
  useEffect(() => {
    if (showDetailModal) {
      setTempAddress(deliveryAddress);
    }
  }, [showDetailModal, deliveryAddress]);

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
  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");

      if (token && token !== "null" && token !== "undefined") {
        setIsAuthenticated(true);

        if (userData && userData !== "null" && userData !== "undefined") {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } catch (error) {
            setUser({ firstName: "Utilisateur", lastName: "" });
          }
        } else {
          setUser({ firstName: "Utilisateur", lastName: "" });
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

  // Gérer les erreurs d'image
  const handleImageError = (productId) => {
    setImageErrors((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  // Calcul du total AVEC livraison
  const calculateTotal = () => {
    return (localCartItems || []).reduce((total, item) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 0;
      const deliveryPrice = item?.deliveryPrice || 0; // Ajout du prix de livraison
      return total + (price + deliveryPrice) * quantity;
    }, 0);
  };

  // Calcul du sous-total pour un article AVEC livraison
  const calculateItemTotal = (item) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    const deliveryPrice = item?.deliveryPrice || 0; // Ajout du prix de livraison
    return (price + deliveryPrice) * quantity;
  };

  // Nouvelle fonction pour calculer le total SANS livraison
  const calculateSubtotal = () => {
    return (localCartItems || []).reduce((total, item) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  // Nouvelle fonction pour calculer le total des frais de livraison
  const calculateDeliveryTotal = () => {
    return (localCartItems || []).reduce((total, item) => {
      const deliveryPrice = item?.deliveryPrice || 0;
      const quantity = item?.quantity || 0;
      return total + deliveryPrice * quantity;
    }, 0);
  };

  // Mettre à jour la quantité avec tracking
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const item = localCartItems.find(item => item.id === productId);
      const oldQuantity = item?.quantity || 0;

      await updateQuantity(productId, newQuantity);

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
      for (const item of localCartItems) {
        await safeTrack(() => trackRemoveFromCart(item, "clear_cart"));
      }

      clearCart();
      setValidationErrors([]);
      toast.success("Panier vidé");
    } catch (error) {
      console.error('Erreur tracking clear cart:', error);
      clearCart();
      setValidationErrors([]);
    }
  };

  // Rediriger vers la page de connexion
  const redirectToLogin = () => {
    onClose();
    navigate("/login");
  };

  // Fonction pour utiliser l'adresse depuis la base de données
  const handleUseMyAddress = () => {
    if (user?.address) {
      setTempAddress(user.address);
      setDeliveryAddress(user.address);
      setIsAddressFromDB(true);
      geocodeAddress(user.address, true);
      toast.success("Adresse personnelle utilisée");
    }
  };

  // Fonction pour géocoder une adresse
  const geocodeAddress = async (address, fromDB = false) => {
    if (!address || address.trim() === "") {
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'fr',
            'User-Agent': 'YourEcommerceApp/1.0'
          }
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCoordinates = {
          lat: parseFloat(lat),
          lng: parseFloat(lon)
        };
        setCoordinates(newCoordinates);
        setDeliveryAddress(address);

        if (fromDB) {
          toast.success("Adresse localisée depuis votre profil");
        }
      } else {
        // console.log("Adresse non trouvée:", address);
      }
    } catch (error) {
      // console.error("Erreur de géocodage:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Fonction pour gérer les changements d'adresse avec debounce
  const handleAddressChange = (newAddress) => {
    setTempAddress(newAddress);

    if (isAddressFromDB) {
      setIsAddressFromDB(false);
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (newAddress.trim().length > 3) {
        geocodeAddress(newAddress, false);
      }
    }, 800);

    setDebounceTimeout(timeout);
  };

  // Fonction pour valider l'adresse manuellement
  const handleAddressSubmit = async () => {
    if (!tempAddress || tempAddress.trim() === "") {
      toast.error("Veuillez entrer une adresse de livraison");
      return;
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }

    await geocodeAddress(tempAddress, false);
    toast.success("Adresse validée et localisée");
  };

  // Fonction pour gérer les clics sur la carte
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const newCoordinates = { lat, lng };
    setCoordinates(newCoordinates);
    setIsAddressFromDB(false);
    reverseGeocode(lat, lng);
  };

  // Fonction pour le géocodage inverse
  const reverseGeocode = async (lat, lng) => {
    setIsReverseGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr',
            'User-Agent': 'YourEcommerceApp/1.0'
          }
        }
      );

      const data = await response.json();

      if (data && data.display_name) {
        const address = data.display_name;
        setTempAddress(address);
        setDeliveryAddress(address);
        toast.success("Adresse mise à jour depuis la carte");
      } else {
        const newAddress = `Localisation: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setTempAddress(newAddress);
        setDeliveryAddress(newAddress);
      }
    } catch (error) {
      console.error("Erreur de reverse geocoding:", error);
      const newAddress = `Coordonnées GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setTempAddress(newAddress);
      setDeliveryAddress(newAddress);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Fonction pour gérer le début du drag du marqueur
  const handleMarkerDragStart = () => {
    setIsDraggingMarker(true);
  };

  // Fonction pour gérer le drag du marqueur en temps réel
  const handleMarkerDrag = (e) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setCoordinates({ lat: position.lat, lng: position.lng });
    const tempCoordAddress = `Déplacement en cours... ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
    setTempAddress(tempCoordAddress);
  };

  // Fonction pour gérer la fin du drag du marqueur
  const handleMarkerDragEnd = async (e) => {
    const marker = e.target;
    const position = marker.getLatLng();
    const finalCoordinates = { lat: position.lat, lng: position.lng };
    setCoordinates(finalCoordinates);
    setIsAddressFromDB(false);
    await reverseGeocode(position.lat, position.lng);
    setIsDraggingMarker(false);
  };

  // Fonctions utilitaires pour extraire ville et code postal
  const extractCityFromAddress = (address) => {
    try {
      const parts = address.split(',');
      if (parts.length > 1) {
        const cityPart = parts[parts.length - 2].trim();
        return cityPart.replace(/\d{5}\s?/, '').trim();
      }
      return "";
    } catch (error) {
      console.error("Erreur extraction ville:", error);
      return "";
    }
  };

  const extractPostalCodeFromAddress = (address) => {
    try {
      const postalCodeMatch = address.match(/\b\d{5}\b/);
      return postalCodeMatch ? postalCodeMatch[0] : "";
    } catch (error) {
      console.error("Erreur extraction code postal:", error);
      return "";
    }
  };

  // Fonction pour préparer les détails de la commande (pour l'affichage seulement)
  const prepareOrderDetails = () => {
    const items = localCartItems.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0,
      total: calculateItemTotal(item)
    }));

    const totalAmount = calculateTotal();
    const orderId = `CMD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      orderId,
      items,
      totalAmount,
      customer: {
        id: user?.id,
        firstName: user?.firstName || "Client",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || ""
      },
      deliveryAddress: {
        text: deliveryAddress,
        coordinates: coordinates,
        geocoded: coordinates.lat !== 48.8566 || coordinates.lng !== 2.3522
      }
    };
  };

  // Fonction pour ouvrir la modal de détail
  const handleOpenDetailModal = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour voir les détails");
      redirectToLogin();
      return;
    }

    if (localCartItems.length === 0) {
      toast.error("Votre panier est vide !");
      return;
    }

    const details = prepareOrderDetails();
    setOrderDetails(details);

    if (!deliveryAddress && user?.address && !hasLoadedUserAddress) {
      setDeliveryAddress(user.address);
      setTempAddress(user.address);
      setIsAddressFromDB(true);
      await geocodeAddress(user.address, true);
      setHasLoadedUserAddress(true);
    } else {
      setTempAddress(deliveryAddress);
    }

    setShowDetailModal(true);
  };

  // Fonction pour fermer la modal
  const handleCloseDetailModal = () => {
    if (tempAddress && tempAddress.trim() !== "") {
      setDeliveryAddress(tempAddress);
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }

    setShowDetailModal(false);
  };

  // NOUVELLE FONCTION : Vérifier le statut de livraison
  const checkDeliveryStatus = async (orderId) => {
    try {
      const response = await deliveryAPI.getDeliveryStatus(orderId);
      if (response?.success) {
        setDeliveryStatus(response.deliveryStatus);
        setTrackingNumber(response.trackingNumber);
        setDeliveryETA(response.eta);
        return response.deliveryStatus;
      }
    } catch (error) {
      console.error('Erreur vérification statut livraison:', error);
    }
    return null;
  };

  // FONCTION PRINCIPALE DE CHECKOUT - VERSION AVEC SYNCHRONISATION LIVRAISON
  const handleCheckout = async () => {
    // console.log("🎯 Début du processus de commande synchronisée avec livraison");

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

    // Utiliser l'adresse temporaire pour la validation
    const finalAddress = tempAddress || deliveryAddress;
    if (!finalAddress || finalAddress.trim() === "") {
      toast.error("❌ Veuillez saisir une adresse de livraison");
      setShowDetailModal(true);
      return;
    }

    setIsCheckingOut(true);
    setValidationErrors([]);
    setSyncStatus('syncing');

    try {
      // 1. Préparer les données pour la NOUVELLE API avec livraison
      const orderData = {
        items: localCartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity || 1
        })),
        shippingAddress: {
          address: finalAddress,
          city: extractCityFromAddress(finalAddress),
          postalCode: extractPostalCodeFromAddress(finalAddress),
          country: "France"
        },
<<<<<<< Updated upstream
        deliveryAddress: finalAddress,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        paymentMethod: "card",
        // Informations client pour la livraison
        customerInfo: {
          name: `${user?.firstName} ${user?.lastName}`,
          phone: user?.phone || "",
          email: user?.email || ""
=======
        deliveryAddress: finalAddress, // Adresse texte complète
        latitude: coordinates.lat,     // Coordonnées GPS
        longitude: coordinates.lng,    // Coordonnées GPS
        paymentMethod: "card",

        // NOUVEAUX CHAMPS POUR LA SYNCHRONISATION
        deliveryInfo: {
          geocoded: true, // Puisque vous avez géocodé l'adresse
          coordinates: {
            lat: coordinates.lat,
            lng: coordinates.lng
          },
          // Ces champs seront remplis par le backend
          syncStatus: "pending", // À envoyer pour être clair
          estimatedDelivery: null,
          metadata: {
            source: "web",
            device: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
>>>>>>> Stashed changes
        }
      };

      // console.log("📤 Envoi de la commande avec livraison...", orderData);

      // 2. Appeler l'API avec deliveryAPI (nouvelle fonction)
      const response = await deliveryAPI.createOrderWithDelivery(orderData);

      console.log("📥 Réponse de l'API de création de commande avec livraison:", response);
      if (response.success) {
        // Succès - stocker l'ID pour le suivi
        setLastCreatedOrderId(response.order.id);

        // Clear cart et fermer modals
        clearCart();
        onClose();
        setShowDetailModal(false);

        // Afficher les informations de suivi avec notification
        toast.success(
          `🎉 Commande #${response.order.orderNumber} créée !`,
          {
            description: `La commande est en cours de synchronisation avec le service de livraison.`,
            duration: 7000,
            action: {
              label: "Suivre",
              onClick: () => navigate(`/mon-compte/mes-commandes`)
            }
          }
        );

        // Track l'achat
        await safeTrack(() => trackPurchase(localCartItems, calculateTotal()));

        // Redirection vers la page de commande après un délai
        setTimeout(() => {
          navigate(`/mon-compte/mes-commandes`);
        }, 3000);

        // Démarrer la vérification du statut
        setTimeout(() => {
          if (response.order.id) {
            checkDeliveryStatus(response.order.id);
          }
        }, 2000);

      } else {
        throw new Error(response.message || "Erreur création commande");
      }

    } catch (error) {
      console.error("💥 Erreur détaillée checkout:", error);
      setSyncStatus('failed');

      // Gestion des erreurs spécifiques
      if (error.response?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
        redirectToLogin();
      } else if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
        toast.error("Problèmes détectés dans votre commande");
      } else {
        toast.error(
          error.response?.data?.message ||
          "Erreur lors de la création de la commande. Veuillez réessayer."
        );
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Bouton "Commander depuis le panier principal"
  const handleCheckoutFromCart = () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour commander");
      redirectToLogin();
      return;
    }

    if (localCartItems.length === 0) {
      toast.error("Votre panier est vide !");
      return;
    }

    // Si l'adresse est déjà définie, procéder directement au checkout
    if (deliveryAddress && deliveryAddress.trim() !== "") {
      handleCheckout();
    } else {
      // Sinon ouvrir la modal pour saisir l'adresse
      handleOpenDetailModal();
    }
  };

  // NOUVELLE FONCTION : Afficher le statut de synchronisation
  const renderSyncStatus = () => {
    if (syncStatus === 'pending') return null;

    const statusConfig = {
      syncing: {
        icon: <Clock className="h-4 w-4 animate-pulse" />,
        text: "Synchronisation avec la livraison en cours...",
        color: "text-blue-600 bg-blue-50 border-blue-200"
      },
      synced: {
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Synchronisée avec le service de livraison",
        color: "text-green-600 bg-green-50 border-green-200"
      },
      failed: {
        icon: <AlertCircle className="h-4 w-4" />,
        text: "Échec de synchronisation",
        color: "text-red-600 bg-red-50 border-red-200"
      }
    };

    const config = statusConfig[syncStatus];
    if (!config) return null;

    return (
      <Card className={`p-3 border ${config.color}`}>
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="font-medium text-sm">{config.text}</span>
        </div>
      </Card>
    );
  };

  // Nettoyer les timeouts à la destruction du composant
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

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
              {/* Statut de synchronisation */}
              {renderSyncStatus()}

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
                <Card key={item.id} className="p-4 shadow-sm mb-3 overflow-hidden">
                  {/* En-tête toujours visible */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg overflow-hidden">
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
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">€{calculateItemTotal(item).toFixed(2)}</span>
                          <ChevronRight
                            className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Badge livraison rapide */}
                    {item.deliveryPrice !== undefined && (
                      <span className={`text-xs px-2 py-1 rounded-full ${item.deliveryPrice > 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {item.deliveryPrice > 0 ? `€${item.deliveryPrice.toFixed(2)} liv.` : 'Gratuit'}
                      </span>
                    )}
                  </div>

                  {/* Contenu dépliable avec animation */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t space-y-3">
                          {/* Détails */}
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>Prix unitaire:</span>
                              <span>€{(item.price || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Livraison unitaire:</span>
                              <span>{item.deliveryPrice > 0 ? `€${item.deliveryPrice.toFixed(2)}` : 'Gratuite'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Quantité:</span>
                              <span>{item.quantity || 0}</span>
                            </div>
                          </div>

                          {/* Calcul détaillé */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Produit:</span>
                                <span>€{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                              </div>
                              {item.deliveryPrice > 0 && (
                                <div className="flex justify-between">
                                  <span>Livraison:</span>
                                  <span className="text-blue-600">
                                    + €{((item.deliveryPrice || 0) * (item.quantity || 0)).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Total:</span>
                                <span>€{calculateItemTotal(item).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-between">
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleUpdateQuantity(item.id, (item.quantity || 0) - 1)}>-</Button>
                              <Button size="sm" onClick={() => handleUpdateQuantity(item.id, (item.quantity || 0) + 1)}>+</Button>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
              {/* <div className="flex justify-between items-center text-sm">
                <span style={{ color: COLORS.smallText }}>
                  Sous-total:
                </span>
                <span
                  className="font-medium"
                  style={{ color: COLORS.smallText }}
                >
                  €{totalAmount.toFixed(2)}
                </span>
              </div> */}
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
              {/* BOUTON COMMANDER AVEC LIVRAISON */}
              <Button
                className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-white"
                onClick={handleCheckoutFromCart}
                disabled={itemsCount === 0 || !isAuthenticated}
                style={{
                  backgroundColor: COLORS.logo,
                  borderColor: COLORS.logo
                }}
              >
                <Truck className="h-4 w-4" />
                Commander avec livraison
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* BOUTON DÉTAIL */}
              <Button
                className="w-full h-10 rounded-lg flex items-center justify-center gap-2"
                onClick={handleOpenDetailModal}
                disabled={itemsCount === 0 || !isAuthenticated}
                style={{
                  borderColor: COLORS.separator,
                  color: COLORS.logo,
                  backgroundColor: COLORS.lightBg
                }}
              >
                <MapPin className="h-4 w-4" />
                Voir le détail & Adresse
                <ChevronRight className="h-4 w-4" />
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

      {/* MODAL DE DÉTAIL */}
      <Dialog open={showDetailModal} onOpenChange={handleCloseDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Détails de la commande & Adresse de livraison
            </DialogTitle>
            <DialogDescription>
              Vérifiez les informations de votre commande et saisissez l'adresse de livraison
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Colonne gauche: Détails de la commande */}
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations client
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nom:</span>
                    <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="font-medium">{user?.email || "Non renseigné"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Téléphone:</span>
                    <span className="font-medium">{user?.phone || "Non renseigné"}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Récapitulatif des articles ({itemsCount})
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Quantité: {item.quantity} × ( €{item.price?.toFixed(2)} + Livraison: {item.deliveryPrice > 0 ? `€${item.deliveryPrice.toFixed(2)}` : 'Gratuite'} )
                        </p>
                      </div>
                      <div className="font-semibold">
                        €{calculateItemTotal(item).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                <div className="space-y-2">
                  {/* <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span className="font-bold">€{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span className="text-green-600 font-bold">Gratuite</span>
                  </div> */}
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span>Total:</span>
                    <span className="font-bold text-green-700">€{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Colonne droite: Adresse et carte */}
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Adresse de livraison
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="delivery-address" className="mb-2 block">
                      Adresse complète *
                    </Label>

                    {/* Option pour utiliser l'adresse de la BDD */}
                    {user?.address && tempAddress !== user.address && (
                      <div className="mb-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleUseMyAddress}
                          className="text-xs"
                          style={{
                            borderColor: COLORS.logo,
                            color: COLORS.logo
                          }}
                        >
                          <Home className="h-3 w-3 mr-1" />
                          Utiliser mon adresse personnelle
                        </Button>
                      </div>
                    )}

                    <div className="relative">
                      <Input
                        id="delivery-address"
                        placeholder="Ex: 123 Rue de la Paix, 75002 Paris, France"
                        value={tempAddress}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="pr-10"
                      />
                      {(isGeocoding || isReverseGeocoding) && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Indicateur de provenance de l'adresse */}
                    {isAddressFromDB && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Adresse pré-remplie depuis votre profil
                      </p>
                    )}

                    {/* Indicateur de drag du marqueur */}
                    {isDraggingMarker && (
                      <p className="text-xs text-blue-600 mt-1">
                        🎯 Glissez-déposez le marqueur pour ajuster la position
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">
                        Saisissez une adresse OU glissez-déposez le marqueur sur la carte
                      </p>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100">
                        {isGeocoding ? "Localisation..." :
                          isReverseGeocoding ? "Mise à jour..." :
                            isDraggingMarker ? "Glissement..." : "En direct"}
                      </span>
                    </div>
                  </div>

                  {/* Carte Leaflet */}
                  <div className="mt-4">
                    <Label className="mb-2 block">Carte de localisation - Cliquez ou glissez-déposez le marqueur</Label>
                    <div className="h-64 rounded-lg overflow-hidden border">
                      <MapContainer
                        center={[coordinates.lat, coordinates.lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        whenCreated={(map) => {
                          mapRef.current = map;
                        }}
                        ref={mapRef}
                        onClick={handleMapClick}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                          position={[coordinates.lat, coordinates.lng]}
                          ref={markerRef}
                          draggable={true}
                          eventHandlers={{
                            dragstart: handleMarkerDragStart,
                            drag: handleMarkerDrag,
                            dragend: handleMarkerDragEnd
                          }}
                        >
                          <Popup>
                            <div className="text-center">
                              <p className="font-semibold">Adresse de livraison</p>
                              <p className="text-sm">{tempAddress || "Adresse non définie"}</p>
                              <p className="text-xs mt-1">
                                Lat: {coordinates.lat.toFixed(6)}<br />
                                Lng: {coordinates.lng.toFixed(6)}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                ✏️ Glissez-déposez pour ajuster la position
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>
                        Coordonnées: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {isGeocoding ? "Recherche..." :
                          isReverseGeocoding ? "Mise à jour adresse..." :
                            isDraggingMarker ? "Glissement marqueur" :
                              tempAddress ? "Synchronisé" : "Saisissez une adresse"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* NOUVEAU : Statut de livraison */}
              {deliveryStatus && (
                <Card className="p-4 border-l-4 border-green-500">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Statut de la livraison
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <span className={`font-medium ${deliveryService.getStatusColor(deliveryStatus)} px-2 py-1 rounded text-xs`}>
                        {deliveryService.getStatusIcon(deliveryStatus)} {deliveryStatus}
                      </span>
                    </div>
                    {trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Numéro de suivi:</span>
                        <span className="font-mono text-sm">{trackingNumber}</span>
                      </div>
                    )}
                    {deliveryETA && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Livraison estimée:</span>
                        <span className="font-medium">{deliveryETA}</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Boutons d'action dans la modal */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCloseDetailModal}
                >
                  Retour au panier
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCheckout}
                  disabled={!tempAddress || isCheckingOut}
                  style={{ backgroundColor: COLORS.logo }}
                >
                  {isCheckingOut ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Traitement avec livraison...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Commander avec livraison
                    </div>
                  )}
                </Button>
              </div>

              {/* Informations de synchronisation */}
              {orderDetails && (
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    <span className="font-bold">ID Commande:</span> {orderDetails.orderId}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Cette commande sera synchronisée avec la plateforme de livraison
                  </p>
                  <div className="mt-2 text-xs text-blue-500">
                    <p>✓ Coordonnées GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
                    <p>✓ Adresse: {tempAddress}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;