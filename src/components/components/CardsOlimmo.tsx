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
  X,
  Calendar,
  Ruler,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

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

// Composant Modal pour afficher les détails
const PropertyDetailModal = ({
  property,
  isOpen,
  onClose
}: {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !property) return null;

  const formatPrice = (price: number, type: string) => {
    if (type === "location") {
      return `${price.toLocaleString("fr-FR")} €/mois`;
    }
    return `${price.toLocaleString("fr-FR")} €`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: colors["light-bg"] }}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: colors["neutral-dark"] }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenu du modal */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Section image */}
          <div className="relative h-full min-h-[400px]">
            <img
              src={property.image_url || "https://via.placeholder.com/600x400?text=No+Image"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${property.type === "location"
                    ? "bg-[#6B8E23] text-white"
                    : "bg-[#8B4513] text-white"
                    }`}
                >
                  {property.type === "location" ? "À louer" : "À vendre"}
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatPrice(property.price, property.type)}
                </div>
              </div>
            </div>
          </div>

          {/* Section détails */}
          <div className="p-8">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: colors["neutral-dark"] }}
            >
              {property.title}
            </h2>

            <div className="flex items-center mb-6">
              <MapPin
                className="w-5 h-5 mr-2"
                style={{ color: colors["secondary-text"] }}
              />
              <span
                className="text-lg font-medium"
                style={{ color: colors["secondary-text"] }}
              >
                {property.location}
              </span>
            </div>

            {/* Caractéristiques principales */}
            <div
              className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl"
              style={{ backgroundColor: colors["accent-light"] + "20" }}
            >
              <div className="text-center">
                <Bed className="w-6 h-6 mx-auto mb-2" style={{ color: colors["primary-dark"] }} />
                <span className="font-semibold" style={{ color: colors["neutral-dark"] }}>
                  {property.bedrooms || 0} chambres
                </span>
              </div>
              <div className="text-center">
                <Bath className="w-6 h-6 mx-auto mb-2" style={{ color: colors["primary-dark"] }} />
                <span className="font-semibold" style={{ color: colors["neutral-dark"] }}>
                  {property.bathrooms || 0} salles de bain
                </span>
              </div>
              <div className="text-center">
                <Square className="w-6 h-6 mx-auto mb-2" style={{ color: colors["primary-dark"] }} />
                <span className="font-semibold" style={{ color: colors["neutral-dark"] }}>
                  {property.surface || "?"} m²
                </span>
              </div>
            </div>

            {/* Description complète */}
            <div className="mb-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: colors["neutral-dark"] }}
              >
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description || "Aucune description disponible"}
              </p>
            </div>

            {/* Informations supplémentaires */}
            <div className="space-y-3">
              {property.energy_rating && (
                <div className="flex items-center">
                  <span className="w-32 font-medium" style={{ color: colors["neutral-dark"] }}>
                    Énergie:
                  </span>
                  <span style={{ color: colors["secondary-text"] }}>
                    {property.energy_rating}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <span className="w-32 font-medium" style={{ color: colors["neutral-dark"] }}>
                  Statut:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${property.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"}`}
                >
                  {property.status === "available" ? "Disponible" : "Non disponible"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium" style={{ color: colors["neutral-dark"] }}>
                  Mise à jour:
                </span>
                <span style={{ color: colors["secondary-text"] }}>
                  {new Date(property.updated_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: colors["separator"] }}>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-semibold transition-colors hover:opacity-90"
                style={{
                  backgroundColor: colors["light-bg"],
                  color: colors["neutral-dark"],
                  border: `2px solid ${colors["separator"]}`
                }}
              >
                Fermer
              </button>
              <a
                href={`https://www.olimmoreunion.re/biens/${property.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:opacity-90"
                  style={{
                    backgroundColor: colors["secondary-text"],
                    color: colors["light-bg"]
                  }}
                >
                  Voir plus
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnonceCard = ({ property }: { property: Property }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  const formatPrice = (price: number, type: string) => {
    if (type === "location") {
      return `${price.toLocaleString("fr-FR")} €/mois`;
    }
    return `${price.toLocaleString("fr-FR")} €`;
  };

  const isAvailable = property.status === "available";

  const handleShowDetails = () => {
    if (!isAvailable) return;

    if (isLoggedIn) {
      setShowDetails(true);
    } else {
      toast.info("Vous devez être connecté pour voir les détails de cette annonce !");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Image avec badges */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.image_url || "https://via.placeholder.com/400x300"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay gradient subtil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Badges groupés */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Badge type */}
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${property.type === "location"
                ? "bg-[#6B8E23] text-white"
                : "bg-logo text-slate-100"}`}
            >
              {property.type === "location" ? "À louer" : "À vendre"}
            </div>

            {/* Badge prix */}
            <div className="backdrop-blur-sm px-3 py-2 rounded-lg bg-white/90 shadow-sm">
              <span className="font-bold text-sm text-gray-800">
                {formatPrice(property.price, property.type)}
              </span>
            </div>
          </div>

          {/* Badge disponibilité (si nécessaire) */}
          {!isAvailable && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-700/90 text-white backdrop-blur-sm">
              Indisponible
            </div>
          )}
        </div>

        {/* Contenu compact */}
        <div className="p-4">
          {/* Titre et localisation */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#6B8E23] transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          {/* Description ultra courte */}
          <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
            {property.description || "Description non disponible"}
          </p>

          {/* Caractéristiques en ligne */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <Bed className="w-4 h-4 text-[#6B8E23]" />
                <span className="text-sm font-medium text-gray-700">
                  {property.bedrooms || 0}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Bath className="w-4 h-4 text-[#6B8E23]" />
                <span className="text-sm font-medium text-gray-700">
                  {property.bathrooms || 0}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Square className="w-4 h-4 text-[#6B8E23]" />
                <span className="text-sm font-medium text-gray-700">
                  {property.surface || "?"}m²
                </span>
              </div>
            </div>
          </div>

          {/* Bouton compact */}
          <button
            onClick={handleShowDetails}
            disabled={!isAvailable}
            className={`w-full py-2.5 px-4 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center ${isAvailable
              ? "bg-[#6B8E23] text-white hover:bg-[#5A7D1C] cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Eye className="w-3.5 h-3.5 mr-2" />
            {isAvailable ? "Voir détails" : "Indisponible"}
          </button>
        </div>
      </div>

      {/* Modal de détails - uniquement accessible si connecté */}
      {isLoggedIn && (
        <PropertyDetailModal
          property={property}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
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
    <div className="w-full pt-8 bg-white">
      <div className="pl-6 pr-5 ">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-3"
        >
          <div>
            <h2 className="ext-xl font-medium text-[#222222] tracking-tight">
              Propriétés de nos partenaires
            </h2>
            <p className="text-xs text-[#717171]">
              Une collection exclusive de nos partenaires
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <a
              href="https://www.olimmoreunion.re/biens"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-[#222222] text-white rounded-full text-xs font-medium hover:bg-[#333333] transition-all flex items-center gap-1.5 no-underline"
            >
              <span>Voir plus</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </motion.div>

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
        {/* {!loading && filteredProperties.length > 0 && (
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
        )} */}
      </div>
    </div>
  );
};

export default AnnoncesImmobilieres;
export { AnnoncesImmobilieres };