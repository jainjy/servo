import React, { useState, useEffect } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Eye,
  Calendar,
  Loader,
} from "lucide-react";
import api from "../lib/api"; // Adjust the path according to your project structure

const CartesBiensImmobiliers = () => {
  const [filtreType, setFiltreType] = useState("tous");
  const [filtreCategorie, setFiltreCategorie] = useState("tous");
  const [biensImmobiliers, setBiensImmobiliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    },
  ];

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

  const toggleFavori = (id) => {
    // Implémentation de la fonction de favori
    console.log("Toggle favori:", id);
  };

  const handleDemanderVisite = (bienId) => {
    // Implémentation pour demander une visite
    console.log("Demander visite pour:", bienId);
    // Ici vous pouvez ouvrir un modal ou rediriger vers un formulaire de contact
    alert(`Demande de visite pour le bien ${bienId}`);
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
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
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
            <p className="text-green-800 font-semibold">
              🏠 Prêt Social Location Accession - Accessibilité facilitée
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
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
                      🏠 PSLA
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

                  <button
                    onClick={() => handleDemanderVisite(bien.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Demander une visite
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {biensFiltres.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
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
    </div>
  );
};

export default CartesBiensImmobiliers;
