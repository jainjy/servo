import React, { useState, useEffect } from "react";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Phone,
  AlertCircle,
  Search,
  Filter,
  Home,
  Eye,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../ui/button";

// Interface pour les propriétés depuis Supabase
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  surface: string;
  image_url: string;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  energy_rating?: string;
  images?: number;
  videos?: number;
}

// Initialiser Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Thème de couleurs
const colors = {
  logo: "#556B2F" /* logo / accent - Olive green */,
  "primary-dark": "#6B8E23" /* Sruvol / fonds légers - Yellow-green */,
  "light-bg":
    "#FFFFFF" /* fond de page / bloc texte - White (corrigé de FFFFFF0) */,
  separator: "#D3D3D3" /* séparateurs / bordures, UI - Light gray */,
  "secondary-text":
    "#8B4513" /* touche premium / titres secondaires - Saddle brown */,
  // Couleurs complémentaires ajoutées
  "accent-light": "#98FB98" /* accent clair - Pale green */,
  "accent-warm": "#DEB887" /* accent chaud - Burlywood */,
  "neutral-dark": "#2F4F4F" /* texte foncé / titres - Dark slate gray */,
  "hover-primary": "#7BA05B" /* état hover primary - Medium olive green */,
  "hover-secondary": "#A0522D" /* état hover secondary - Sienna */,
};

const AnnonceCard = ({ property }: { property: Property }) => {
  const formatPrice = (price: number, type: string) => {
    if (type === "location") {
      return `${price.toLocaleString("fr-FR")} €/mois`;
    }
    return `${price.toLocaleString("fr-FR")} €`;
  };

  const isAvailable = property.status === "available";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image avec overlay */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <img
          src={
            property.image_url ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay gradient personnalisé */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge type */}
        <div
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-semibold ${
            property.type === "location"
              ? "bg-[#6B8E23] text-white" /* primary-dark */
              : "bg-[#8B4513] text-white" /* secondary-text */
          }`}
          style={{
            backgroundColor:
              property.type === "location"
                ? colors["primary-dark"]
                : colors["secondary-text"],
          }}
        >
          {property.type === "location" ? "À louer" : "À vendre"}
        </div>

        {/* Badge statut */}
        {!isAvailable && (
          <div
            className="absolute top-4 right-12 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: colors["neutral-dark"] }}
          >
            Non disponible
          </div>
        )}

        {/* Prix */}
        <div
          className="absolute bottom-4 left-4 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
          style={{
            backgroundColor: `${colors["primary-dark"]}CC` /* Avec opacité */,
            color: "white",
          }}
        >
          <span className="font-bold text-sm">
            {formatPrice(property.price, property.type)}
          </span>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        {/* Titre */}
        <h3
          className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-[#6B8E23] transition-colors"
          style={{ color: colors["neutral-dark"] }}
        >
          {property.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description || "Aucune description disponible"}
        </p>

        {/* Caractéristiques */}
        <div
          className="flex items-center justify-between mb-4 pb-4 border-b"
          style={{ borderColor: colors["separator"] }}
        >
          <div className="flex items-center space-x-2">
            <Bed
              className="w-4 h-4"
              style={{ color: colors["primary-dark"] }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: colors["neutral-dark"] }}
            >
              {property.bedrooms || 0} ch.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Bath
              className="w-4 h-4"
              style={{ color: colors["primary-dark"] }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: colors["neutral-dark"] }}
            >
              {property.bathrooms || 0} sdb
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Square
              className="w-4 h-4"
              style={{ color: colors["primary-dark"] }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: colors["neutral-dark"] }}
            >
              {property.surface || "?"} m²
            </span>
          </div>
        </div>

        {/* Localisation */}
        <div className="flex items-center mb-6">
          <MapPin
            className="w-4 h-4 mr-2"
            style={{ color: colors["secondary-text"] }}
          />
          <span className="text-sm" style={{ color: colors["secondary-text"] }}>
            {property.location}
          </span>
        </div>

        {/* Bouton de contact */}
        <a
          href={`https://www.olimmoreunion.re/biens/${property.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <button
            disabled={!isAvailable}
            className={`w-full py-3 px-4 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center group/btn ${
              isAvailable
                ? "text-white hover:bg-[#7BA05B]" /* hover-primary */
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            style={
              isAvailable
                ? {
                    backgroundColor: colors["primary-dark"],
                  }
                : {}
            }
          >
            <Eye className="w-4 h-4 mr-2" />
            {isAvailable ? "Afficher details" : "Non disponible"}
            {isAvailable && (
              <div className="ml-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-200">
                →
              </div>
            )}
          </button>
        </a>
      </div>
    </div>
  );
};

const AnnoncesImmobilieres = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Récupérer les propriétés depuis Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("properties")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        setProperties(data || []);
        setFilteredProperties(data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des propriétés"
        );
        console.error("Erreur Supabase:", err);
        // Afficher les données de secours si la connexion échoue
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = properties;

    // Filtre par type
    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    // Recherche par titre ou localisation
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [properties, selectedType, searchQuery]);

  return (
    <div
      className="w-full py-12 px-4 sm:px-2 lg:px-4"
      style={{ backgroundColor: colors["light-bg"] }}
    >
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-12 grid place-items-center lg:flex justify-between items-center">
          <h2
            className="text-xl sm:text-4xl font-bold mb-3 text-center lg:text-left"
            style={{ color: colors["neutral-dark"] }}
          >
            Propriétés de nos partenaires
          </h2>
          <div className="text-center grid lg:flex items-center justify-between">
            <Button
              className="relative px-8 mx-auto py-3 flex items-center gap-3 overflow-hidden rounded-md group transition-all duration-500 hover:scale-105"
              onClick={() =>
                window.open("https://www.olimmoreunion.re/biens", "_blank")
              }
              style={{ backgroundColor: colors["primary-dark"] }}
            >
              {/* Cercle animé à droite */}
              <span
                className="absolute inset-0 -right-14 top-12 w-36 h-32 group-hover:-top-12 transition-all duration-700 ease-out origin-bottom rounded-full transform group-hover:scale-105"
                style={{ backgroundColor: colors["accent-light"] }}
              ></span>

              {/* Contenu */}
              <span
                className="relative z-10 font-semibold group-hover:text-slate-900 transition-all duration-400 ease-out"
                style={{ color: "white" }}
              >
                Voir plus
              </span>
              <ArrowRight
                className="w-4 h-4 relative z-10 group-hover:text-slate-900 transition-all duration-400 ease-out group-hover:translate-x-1"
                style={{ color: "white" }}
              />
            </Button>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <img src="/loading.gif" alt="" />
            <p className="text-lg" style={{ color: colors["neutral-dark"] }}>
              Chargement des propriétés...
            </p>
          </div>
        )}

        {/* État d'erreur */}
        {error && (
          <div
            className="border-l-4 rounded-lg p-6 mb-8"
            style={{
              backgroundColor: `${colors["accent-light"]}40`,
              borderColor: colors["secondary-text"],
            }}
          >
            <div className="flex items-center">
              <AlertCircle
                className="w-6 h-6 mr-3"
                style={{ color: colors["secondary-text"] }}
              />
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: colors["secondary-text"] }}
                >
                  Erreur de chargement
                </h3>
                <p className="mt-1" style={{ color: colors["neutral-dark"] }}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grille de propriétés */}
        {!loading && filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.slice(0, 4).map((property) => (
              <AnnonceCard key={property.id} property={property} />
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Home
              className="w-16 h-16"
              style={{ color: colors["separator"] }}
            />
            <h3
              className="text-xl font-semibold"
              style={{ color: colors["neutral-dark"] }}
            >
              Aucune propriété trouvée
            </h3>
            <p style={{ color: colors["secondary-text"] }}>
              {searchQuery || selectedType !== "all"
                ? "Essayez de modifier vos critères de recherche"
                : "Aucune propriété disponible pour le moment"}
            </p>
          </div>
        ) : null}

        {/* Résultats */}
        {!loading && filteredProperties.length > 0 && (
          <div className="mt-8 grid place-items-center">
            <p
              className="w-auto lg:w-1/4 text-center text-xs font-bold rounded-full p-2"
              style={{
                backgroundColor: colors["neutral-dark"],
                color: colors["light-bg"],
              }}
            >
              Affichage de{" "}
              <span className="font-semibold">
                {Math.min(4, filteredProperties.length)}
              </span>{" "}
              propriété{Math.min(4, filteredProperties.length) > 1 ? "s" : ""}{" "}
              sur <span className="font-semibold">{properties.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { AnnoncesImmobilieres };
export default AnnoncesImmobilieres;
