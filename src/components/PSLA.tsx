import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Eye,
  Calendar,
  Loader,
  AlertTriangle,
  Home,
  X,
  User,
  Mail,
  Phone,
  Clock,
  ArrowRight,
} from "lucide-react";
import api from "../lib/api"; // Adjust the path according to your project structure
import { useAuth } from "../hooks/useAuth"; // Adjust path
import { toast } from "../hooks/use-toast"; // Adjust path
import { useNavigate } from "react-router-dom";

// Composant Modal pour la demande de visite (identique à PropertyListings)
const ModalDemandeVisite = ({
  open,
  onClose,
  property,
  onSuccess,
  isAlreadySent,
  onPropertyContact,
}: {
  open: boolean;
  onClose: () => void;
  property: any;
  onSuccess?: (propertyId: string) => void;
  isAlreadySent?: boolean;
  onPropertyContact?: (property: any) => void;
}) => {
  const [formData, setFormData] = useState({
    nomPrenom: "",
    email: "",
    telephone: "",
    message: "",
    dateSouhaitee: "",
    heureSouhaitee: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { user, isAuthenticated } = useAuth();

  // Réinitialiser le formulaire quand la modale se ferme ou que la propriété change
  useEffect(() => {
    if (!open) {
      setFormData({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
      });
    } else if (user && user.firstName) {
      // Pré-remplir avec les données de l'utilisateur s'il existe
      setFormData((prev) => ({
        ...prev,
        nomPrenom: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        telephone: user.phone || "",
      }));
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    // Track contact action
    if (onPropertyContact) {
      onPropertyContact(property);
    }

    if (isAlreadySent) {
      toast({
        title: "Demande déjà envoyée",
        description: "Vous avez déjà envoyé une demande pour ce bien.",
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour demander une visite.",
      });
      return;
    }

    setLoadingSubmit(true);
    try {
      // Récupérer un service pertinent (préférence pour un service lié à l'immobilier/visite)
      const servicesResp = await api.get("/services");
      const services = servicesResp.data || [];

      if (!Array.isArray(services) || services.length === 0) {
        toast({
          title: "Aucun service",
          description:
            "Aucun service disponible sur le serveur. Créez un service ou configurez-en un pour les visites.",
        });
        setLoadingSubmit(false);
        return;
      }

      // Essayer de trouver un service lié aux visites ou à l'immobilier
      let chosenService = services.find((s: any) =>
        /visite|visiter/i.test(String(s.name || s.libelle || ""))
      );
      if (!chosenService) {
        chosenService = services.find((s: any) =>
          /immobilier|property|bien/i.test(String(s.name || s.libelle || ""))
        );
      }
      if (!chosenService) {
        // fallback: first service
        chosenService = services[0];
      }

      // Ensure backend-required contactPrenom and contactNom are provided
      const nameParts = String(formData.nomPrenom || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const contactPrenom = nameParts.length > 0 ? nameParts[0] : "";
      const contactNom =
        nameParts.length > 1
          ? nameParts.slice(1).join(" ")
          : nameParts[0] || "";

      const payload = {
        // backend expects serviceId and createdById
        serviceId: chosenService.id,
        createdById: user.id,
        propertyId: property?.id,
        contactNom,
        contactPrenom,
        contactEmail: formData.email,
        contactTel: formData.telephone,
        description: `Demande visite pour le bien PSLA: ${
          property?.title || property?.id
        } (${property?.id}). ${formData.message || ""}`,
        lieuAdresse: property?.address || property?.city || "",
        dateSouhaitee: formData.dateSouhaitee,
        heureSouhaitee: formData.heureSouhaitee,
        // nombreArtisans, optionAssurance etc left as defaults
      };

      await api.post("/demandes/immobilier", payload);

      // Notify parent that a request was sent
      onSuccess?.(String(property.id));

      toast({
        title: "Demande envoyée",
        description: "Votre demande de visite a bien été envoyée.",
      });

      // Réinitialiser le formulaire et fermer le modal
      setFormData({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
      });
      onClose();
    } catch (err: any) {
      console.error("Erreur en envoyant la demande de visite", err);
      toast({
        title: "Erreur",
        description:
          err?.response?.data?.error ||
          err?.message ||
          "Impossible d'envoyer la demande. Réessayez.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* En-tête du modal */}
        <div className="bg-green-600 px-6 py-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-xl font-bold">
                Demander une visite
              </h2>
              <p className="text-white/50 text-xs mt-1">
                Pour le bien PSLA : {property?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de contact */}
            <div className="space-y-4">
              <div className="flex -mt-2 text-xl justify-center items-center gap-2">
                <User className="w-6 h-6 text-gray-700" />
                <span className="text-gray-700 font-medium">
                  Vos coordonnées
                </span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="nomPrenom"
                    value={formData.nomPrenom}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nom et Prénom"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>

            {/* Date et heure souhaitées */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">
                  Disponibilités
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="dateSouhaitee"
                    type="date"
                    value={formData.dateSouhaitee}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <select
                      id="heureSouhaitee"
                      name="heureSouhaitee"
                      value={formData.heureSouhaitee}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none hover:bg-white"
                    >
                      <option value="">Sélectionnez un créneau</option>
                      <option value="08:00">Matin : 08h00</option>
                      <option value="10:00">Matin : 10h00</option>
                      <option value="14:00">Après-midi : 14h00</option>
                      <option value="16:00">Après-midi : 16h00</option>
                      <option value="18:00">Soir : 18h00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Message complémentaire (optionnel)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Précisez vos disponibilités ou toute information complémentaire..."
              />
            </div>
          </form>
        </div>

        {/* Boutons d'action */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loadingSubmit || !!isAlreadySent}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Calendar className="w-4 h-4" />
              {loadingSubmit
                ? "Envoi..."
                : isAlreadySent
                ? "Demande déjà envoyée"
                : "Demander la visite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartesBiensImmobiliers = () => {
  const [filtreType, setFiltreType] = useState("tous");
  const [filtreCategorie, setFiltreCategorie] = useState("tous");
  const [biensImmobiliers, setBiensImmobiliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la modal de demande de visite
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Fetch PSLA properties from backend
  const fetchPSLAProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/properties/psla");

      if (response.data.success) {
        // Transform backend data to match frontend format
        const transformedProperties = response.data.data.map((property) => ({
          id: property.id,
          image:
            property.images?.[0] ||
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
          type: property.listingType === "rent" ? "location" : "achat",
          categorie: mapPropertyTypeToCategory(property.type),
          prix:
            property.listingType === "rent"
              ? `${property.price?.toLocaleString("fr-FR")} €/mois`
              : `${property.price?.toLocaleString("fr-FR")} €`,
          titre: property.title,
          lieu: `${property.city}, ${property.zipCode || ""}`,
          description:
            property.description ||
            "Bien immobilier éligible au Prêt Social Location Accession.",
          caracteristiques: {
            chambres: property.bedrooms || 0,
            sdb: property.bathrooms || 0,
            surface: `${property.surface || 0} m²`,
            parking: property.hasParking ? 1 : 0,
            annee: property.yearBuilt || new Date().getFullYear(),
          },
          favori: false,
          vues: property.views || 0,
          // Additional PSLA-specific information
          isPSLA: property.isPSLA || property.socialLoan,
          energyClass: property.energyClass,
          features: property.features || [],
          // Additional fields for modal
          address: property.address,
          owner: property.owner,
        }));

        setBiensImmobiliers(transformedProperties);
      }
    } catch (err) {
      console.error("Error fetching PSLA properties:", err);
      setError("Erreur lors du chargement des propriétés PSLA");
      // Fallback to sample data if API fails
      setBiensImmobiliers(getSamplePSLAData());
    } finally {
      setLoading(false);
    }
  };

  // Map backend property type to frontend category
  const mapPropertyTypeToCategory = (type) => {
    const typeMap = {
      house: "maison",
      apartment: "appartement",
      villa: "villa",
      studio: "appartement",
    };
    return typeMap[type] || "maison";
  };

  // Sample PSLA data as fallback
  const getSamplePSLAData = () => [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
      type: "achat",
      categorie: "maison",
      prix: "250 000 €",
      titre: "Maison familiale PSLA",
      lieu: "Lille, 59000",
      description:
        "Maison éligible au Prêt Social Location Accession. Parfait pour les primo-accédants.",
      caracteristiques: {
        chambres: 3,
        sdb: 1,
        surface: "85 m²",
        parking: 1,
        annee: 2015,
      },
      favori: false,
      vues: 89,
      isPSLA: true,
      energyClass: "B",
      address: "123 Rue de l'Exemple, Lille",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      type: "achat",
      categorie: "appartement",
      prix: "180 000 €",
      titre: "Appartement PSLA centre-ville",
      lieu: "Roubaix, 59100",
      description:
        "Appartement neuf éligible au dispositif PSLA. Proche transports et commerces.",
      caracteristiques: {
        chambres: 2,
        sdb: 1,
        surface: "55 m²",
        parking: 0,
        annee: 2022,
      },
      favori: true,
      vues: 124,
      isPSLA: true,
      energyClass: "A",
      address: "456 Avenue du Test, Roubaix",
    },
  ];

  // Load user's demandes to persist "demande déjà envoyée" state
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let mounted = true;
    const loadUserDemandes = async () => {
      try {
        const resp = await api.get(`/demandes/immobilier/user/${user.id}`);
        const demandes = resp.data || [];
        const map: Record<string, boolean> = {};
        demandes.forEach((d: any) => {
          if (d && d.propertyId) map[String(d.propertyId)] = true;
        });
        if (mounted) setSentRequests((prev) => ({ ...prev, ...map }));
      } catch (err) {
        console.error("Unable to load user demandes", err);
      }
    };

    loadUserDemandes();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchPSLAProperties();
  }, []);

  const types = [
    { value: "tous", label: "Tous les types" },
    { value: "achat", label: "À acheter" },
    { value: "location", label: "À louer" },
  ];

  const categories = [
    { value: "tous", label: "Toutes catégories" },
    { value: "maison", label: "Maisons" },
    { value: "appartement", label: "Appartements" },
    { value: "villa", label: "Villas" },
  ];

  const biensFiltres = biensImmobiliers.filter((bien) => {
    const matchType = filtreType === "tous" || bien.type === filtreType;
    const matchCategorie =
      filtreCategorie === "tous" || bien.categorie === filtreCategorie;
    return matchType && matchCategorie;
  });

  const handleDemanderVisite = (property: any, e: React.MouseEvent) => {
    e.stopPropagation();

    if (sentRequests?.[property?.id]) {
      toast({
        title: "Demande déjà envoyée",
        description: "Vous avez déjà envoyé une demande pour ce bien.",
      });
      return;
    }
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleVoirDetails = (property: any, e: React.MouseEvent) => {
    e.stopPropagation();
    // Ici vous pouvez naviguer vers une page de détails ou ouvrir un modal de détails
    console.log("Voir détails pour:", property.id);

    navigate(`/immobilier/${property.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des propriétés PSLA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-16 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchPSLAProperties}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Biens éligibles au PSLA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de propriétés éligibles au Prêt Social
            Location Accession
          </p>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p className="text-green-800 font-semibold flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Prêt Social Location Accession - Accessibilité facilitée
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              {/* Filtre par type */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Type :
                </label>
                <select
                  value={filtreType}
                  onChange={(e) => setFiltreType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par catégorie */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Catégorie :
                </label>
                <select
                  value={filtreCategorie}
                  onChange={(e) => setFiltreCategorie(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((categorie) => (
                    <option key={categorie.value} value={categorie.value}>
                      {categorie.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {biensFiltres.length} bien{biensFiltres.length > 1 ? "s" : ""}{" "}
              PSLA trouvé{biensFiltres.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {biensFiltres.map((bien) => (
            <div
              key={bien.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image avec badges superposés */}
              <div className="relative">
                <img
                  src={bien.image}
                  alt={bien.titre}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges superposés */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      bien.type === "achat"
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {bien.type === "achat" ? "À vendre" : "À louer"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      bien.categorie === "villa"
                        ? "bg-purple-500 text-white"
                        : bien.categorie === "maison"
                        ? "bg-orange-500 text-white"
                        : "bg-cyan-500 text-white"
                    }`}
                  >
                    {bien.categorie.charAt(0).toUpperCase() +
                      bien.categorie.slice(1)}
                  </span>
                  {/* Badge PSLA */}
                  {bien.isPSLA && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      PSLA
                    </span>
                  )}
                </div>

                {/* Badge prix */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-gray-900 shadow-lg">
                    {bien.prix}
                  </span>
                </div>

                {/* Badge classe énergie */}
                {bien.energyClass && (
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        bien.energyClass === "A"
                          ? "bg-green-500 text-white"
                          : bien.energyClass === "B"
                          ? "bg-lime-500 text-white"
                          : bien.energyClass === "C"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      Classe {bien.energyClass}
                    </span>
                  </div>
                )}
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Titre et lieu */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {bien.titre}
                </h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{bien.lieu}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {bien.description}
                </p>

                {/* Caractéristiques */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.chambres} chambre
                      {bien.caracteristiques.chambres > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.sdb} salle
                      {bien.caracteristiques.sdb > 1 ? "s" : ""} de bain
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Square className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.surface}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.parking} place
                      {bien.caracteristiques.parking > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{bien.caracteristiques.annee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{bien.vues} vues</span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={(e) => handleDemanderVisite(bien, e)}
                    disabled={!!sentRequests?.[bien?.id]}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:bg-green-400 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    {sentRequests?.[bien?.id]
                      ? "Demande envoyée"
                      : "Demander visite"}
                  </button>

                  <button
                    onClick={(e) => handleVoirDetails(bien, e)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {biensFiltres.length === 0 && (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun bien PSLA trouvé
            </h3>
            <p className="text-gray-500">
              Aucun bien éligible au PSLA ne correspond à vos critères de
              recherche.
            </p>
          </div>
        )}

        {/* Bouton voir plus */}
        {biensFiltres.length > 0 && (
          <div className="text-center mt-12">
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
              Voir plus de biens PSLA
            </button>
          </div>
        )}
      </div>

      {/* Modal de demande de visite */}
      <ModalDemandeVisite
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        property={selectedProperty}
        isAlreadySent={
          selectedProperty ? !!sentRequests?.[selectedProperty.id] : false
        }
        onSuccess={(id: string) =>
          setSentRequests((prev) => ({ ...prev, [id]: true }))
        }
      />
    </div>
  );
};

export default CartesBiensImmobiliers;
