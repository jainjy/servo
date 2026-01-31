import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Home, Loader, TreePalm, X } from "lucide-react";
import GenericMap from "@/components/GenericMap";
import { MapService } from "@/services/mapService";
import { MapPoint } from "@/types/map";
import PointDetailsModal from "@/components/PointDetailsModal";
import api from "@/lib/api";

interface CarteBouttonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  category?: "agences" | "plombiers" | "constructeurs" | "all";
}

const CarteBoutton: React.FC<CarteBouttonProps> = ({
  className = "",
  size = "md",
  position = "bottom-right",
  category = "all"
}) => {
  const navigate = useNavigate();
  
  // États pour la carte
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<MapPoint[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null);

  // États pour le drag du modal (desktop seulement)
  const [isDragging, setIsDragging] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const modalStartPos = useRef({ x: 0, y: 0 });

  // Convertir la catégorie en endpoint API
  const getEndpoint = () => {
    if (category === "agences") return "/pro/agences";
    if (category === "plombiers") return "/pro/plombiers";
    if (category === "constructeurs") return "/pro/constructeurs";
    return "/pro";
  };

  // Déterminer le titre basé sur la catégorie
  const getMapTitle = () => {
    switch (category) {
      case "agences":
        return "Carte des Agences Immobilières";
      case "plombiers":
        return "Carte des Plombiers";
      case "constructeurs":
        return "Carte des Constructeurs";
      case "all":
        return "Carte des Professionnels";
      default:
        return "Carte de la Réunion";
    }
  };

  // ========== GESTION DU DRAG FLUIDE (Desktop seulement) ==========
  const handleHeaderMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    
    setIsDragging(true);
    
    // Sauvegarder la position actuelle du modal
    modalStartPos.current = { ...modalPosition };
    
    // Calculer le décalage exact entre le curseur et le coin supérieur gauche du modal
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      dragStartPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    } else {
      // Fallback si le ref n'est pas disponible
      dragStartPos.current = {
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y
      };
    }
    
    e.preventDefault();
  }, [modalPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculer la nouvelle position en fonction du décalage initial
      if (dragStartPos.current && modalStartPos.current) {
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;
        
        // Appliquer la nouvelle position avec une transition fluide
        setModalPosition({ 
          x: newX, 
          y: newY 
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Réinitialiser les positions de départ
      dragStartPos.current = { x: 0, y: 0 };
      modalStartPos.current = { x: 0, y: 0 };
    };

    // Utiliser requestAnimationFrame pour un mouvement plus fluide
    const onMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => handleMouseMove(e));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Réinitialiser la position du modal quand il est rouvert
  useEffect(() => {
    if (showMapModal && window.innerWidth >= 1024) {
      // Centrer le modal initialement
      const x = window.innerWidth / 2 - 300; // Moitié de la largeur - moitié de la largeur du modal
      const y = window.innerHeight / 2 - 250; // Moitié de la hauteur - moitié de la hauteur du modal
      setModalPosition({ x, y });
    }
  }, [showMapModal]);
  // =========================================================

  // Déterminer la position du bouton
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-4 left-4 md:bottom-8 md:left-8";
      case "top-right":
        return "top-4 right-4 md:top-8 md:right-8";
      case "top-left":
        return "top-4 left-4 md:top-8 md:left-8";
      case "bottom-right":
      default:
        return "bottom-4 right-4 md:bottom-8 md:right-8";
    }
  };

  // Déterminer la taille du bouton
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-2";
      case "lg":
        return "p-4";
      case "md":
      default:
        return "p-3";
    }
  };

  // Filtrer les points selon la catégorie
  const filterPointsByCategory = useCallback((points: MapPoint[]): MapPoint[] => {
    if (category === "all") return points;
    
    const categoryToType: Record<string, string> = {
      "agences": "agency",
      "plombiers": "plumber",
      "constructeurs": "constructor"
    };
    
    const pointType = categoryToType[category];
    return points.filter(point => point.type === pointType || point.category === category);
  }, [category]);

  // Charger toutes les données de la carte
// Charger toutes les données de la carte
const loadMapData = useCallback(async () => {
  try {
    setMapLoading(true);

    // MODIFIÉ: Toujours utiliser l'API, même pour "all"
    const endpoint = getEndpoint();
    const res = await api.get(endpoint);

    if (!res.data.success) {
      throw new Error("Erreur lors de la récupération des données");
    }

    const categoryPoints: MapPoint[] = res.data.data.map((item: any) => {
      const safeName =
        [item.firstName, item.lastName].filter(Boolean).join(" ").trim() ||
        item.commercialName ||
        item.companyName ||
        item.firstName ||
        "Professionnel";

      return {
        id: item.id,
        latitude: item.latitude ?? null,
        longitude: item.longitude ?? null,
        title: safeName,
        description: item.description || item.specialty || "",
        type: item.type || "user",
        category: category,
        address: item.address || item.city || "Réunion",
        phone: item.phone || "",
        email: item.email || "",
        website: item.website || ""
      };
    });

    setMapPoints(categoryPoints);
    setFilteredPoints(categoryPoints);

    setMapError(null);

  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Erreur lors du chargement de la carte";

    setMapError(errorMessage);
    console.error("❌ Erreur chargement carte:", err);

    setMapPoints([]);
    setFilteredPoints([]);
  } finally {
    setMapLoading(false);
  }
}, [category]);
  // Obtenir la géolocalisation utilisateur
  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      setMapError("La géolocalisation n'est pas supportée par votre navigateur.");
      setUserLocation([-21.1351, 55.2471]);
      handleCenterToReunion();
      return;
    }

    setGeoLoading(true);
    setMapError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setGeoLoading(false);
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('centerMap', { 
            detail: { 
              location: [latitude, longitude],
              zoom: 14,
              smooth: true
            } 
          }));
        }, 300);
      },
      (error) => {
        console.error("Erreur géolocalisation:", error);
        setGeoLoading(false);
        setMapError("Impossible d'obtenir votre position. Carte centrée sur la Réunion.");
        setUserLocation([-21.1351, 55.2471]);
        handleCenterToReunion();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  // Centrer sur la Réunion
  const handleCenterToReunion = () => {
    window.dispatchEvent(new CustomEvent('centerMap', {
      detail: {
        location: [-21.1351, 55.2471],
        zoom: 10
      }
    }));
  };

  // Gérer le clic sur un point de la carte
  const handleMapPointClick = (point: MapPoint) => {
    // console.log("Point carte cliqué:", point);
    setSelectedMapPoint(point);
  };

  // Fermer le modal de détail
  const handleClosePointModal = () => {
    setSelectedMapPoint(null);
  };

  // Voir les détails complets
  const handleViewDetails = (point: MapPoint) => {
    handleClosePointModal();
    
    if (point.type === "property" || point.category === "agences") {
      navigate(`/immobilier/${point.id}`);
    } else {
      navigate(`/professional/${point.id}`);
    }
  };

  // Initialiser les données au chargement du composant
  useEffect(() => {
    if (showMapModal) {
      loadMapData();
    }
  }, [showMapModal, loadMapData]);

  // Styles pour le drag fluide
  const modalStyle = window.innerWidth >= 1024 
    ? {
        position: 'fixed' as const,
        left: `${modalPosition.x}px`,
        top: `${modalPosition.y}px`,
        transform: 'none',
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab'
      }
    : {};

  return (
    <>
      {/* Bouton flottant pour ouvrir la carte */}
      {!showMapModal && (
        <button
          onClick={() => setShowMapModal(true)}
          className={`
            fixed z-40
            bg-green-600 hover:bg-green-700
            text-white rounded-full shadow-lg
            transition-all duration-300
            hover:scale-110 active:scale-95
            ${getPositionClasses()}
            ${getSizeClasses()}
            ${className}
          `}
          title={`Afficher la carte des ${category}`}
          aria-label={`Ouvrir la carte des ${category}`}
        >
          <MapPin className={`${size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5"}`} />
        </button>
      )}

      {/* Modal de la carte */}
      {showMapModal && (
        <div
          ref={modalRef}
          className={`fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden
            bottom-0 right-0 w-full h-3/4
            md:bottom-4 md:right-4 md:w-[calc(100vw-2rem)] md:h-3/5 md:max-w-[700px] md:max-h-[600px]
            lg:w-full lg:h-full lg:bottom-auto lg:right-auto
            animate-in slide-in-from-bottom duration-300
            ${window.innerWidth >= 1024 ? 'cursor-grab' : ''}
          `}
          style={modalStyle}
        >
          {/* Header de la carte */}
          <div 
            className={`bg-white p-3 md:p-4 border-b flex items-center justify-between flex-wrap gap-2 ${
              window.innerWidth >= 1024 ? 'cursor-grab active:cursor-grabbing select-none' : ''
            }`}
            onMouseDown={handleHeaderMouseDown}
          >
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base truncate">
                {getMapTitle()}
              </span>
              <div className="hidden md:flex items-center gap-2 ml-3">
                <span className="text-xs md:text-sm bg-green-100 text-green-800 px-2 py-1 md:px-3 md:py-1.5 rounded">
                  {filteredPoints.length} {category === "all" ? "professionnels" : category}
                </span>
                {userLocation && (
                  <span className="text-xs md:text-sm bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1.5 rounded">
                    Position active
                  </span>
                )}
              </div>
            </div>
            
            {/* Badges mobiles */}
            <div className="flex md:hidden gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {filteredPoints.length}
              </span>
              {userLocation && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Position
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={handleGetUserLocation}
                disabled={geoLoading}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                title="Ma position"
                aria-label="Centrer sur ma position"
              >
                {geoLoading ? (
                  <Loader className="h-4 w-4 md:h-5 md:w-5 text-purple-600 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                )}
              </button>
              
              <button
                onClick={handleCenterToReunion}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Centrer sur la Réunion"
                aria-label="Centrer sur la Réunion"
              >
                <TreePalm className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              </button>

              <button
                onClick={() => setShowMapModal(false)}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fermer la carte"
                aria-label="Fermer la carte"
              >
                <X className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Contenu de la carte */}
          <div className="h-[calc(100%-120px)] md:h-[calc(100%-130px)] overflow-hidden bg-gray-100 relative">
            {mapLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader className="h-8 w-8 md:h-10 md:w-10 animate-spin mx-auto text-green-600" />
                  <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-600">
                    Chargement de la carte...
                  </p>
                </div>
              </div>
            ) : mapError ? (
              <div className="h-full flex items-center justify-center p-4 md:p-6">
                <div className="text-center">
                  <p className="text-sm md:text-base text-red-600">{mapError}</p>
                  <button
                    onClick={loadMapData}
                    className="mt-2 md:mt-3 px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : filteredPoints.length === 0 ? (
              <div className="h-full flex items-center justify-center p-4 md:p-6">
                <div className="text-center">
                  <p className="text-sm md:text-base text-gray-600">
                    Aucun {category === "all" ? "professionnel" : category} trouvé sur la carte.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <GenericMap
                  points={filteredPoints}
                  userLocation={userLocation}
                  center={[-21.1351, 55.2471]}
                  zoom={10}
                  onPointClick={handleMapPointClick}
                />
                
                {/* Overlay d'information */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/70 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded pointer-events-none">
                  {filteredPoints.length} {category === "all" ? "points" : category} affichés
                </div>
              </>
            )}
          </div>

          {/* Footer avec statistiques */}
          <div className="bg-white p-2 md:p-3 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex flex-wrap gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                <span className="text-xs md:text-sm text-gray-700">
                  {filteredPoints.length} {category === "all" ? "professionnels" : category}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowMapModal(false);
                navigate('/carte', { state: { category } });
              }}
              className="text-xs md:text-sm text-green-600 hover:text-green-800 hover:underline font-medium transition-colors self-end sm:self-auto"
            >
              Voir carte complète →
            </button>
          </div>
        </div>
      )}

      {/* Modal des détails du point */}
      <PointDetailsModal
        point={selectedMapPoint}
        onClose={handleClosePointModal}
        onViewDetails={handleViewDetails}
      />
    </>
  );
};

export default CarteBoutton;