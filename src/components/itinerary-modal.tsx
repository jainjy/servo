import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, Edit2, X } from "lucide-react";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface ItineraryPoint {
  latitude: number;
  longitude: number;
  address: string;
  order: number;
}

interface ItineraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationId: string;
  pickupLocation?: { latitude: number; longitude: number; address: string };
  returnLocation?: { latitude: number; longitude: number; address: string };
  existingItinerary?: ItineraryPoint[];
  onSave: (itinerary: ItineraryPoint[]) => Promise<void>;
  isEditable?: boolean;
}

export function ItineraryModal({
  open,
  onOpenChange,
  reservationId,
  pickupLocation,
  returnLocation,
  existingItinerary,
  onSave,
  isEditable = false,
}: ItineraryModalProps) {
  const [waypoints, setWaypoints] = useState<ItineraryPoint[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [map, setMap] = useState<any>(null);

  // Initialiser les waypoints
  useEffect(() => {
    if (open) {
      if (existingItinerary && existingItinerary.length > 0) {
        setWaypoints(existingItinerary);
      } else if (pickupLocation && returnLocation) {
        setWaypoints([
          { ...pickupLocation, order: 0 },
          { ...returnLocation, order: 1 },
        ]);
      }
    }
  }, [open, existingItinerary, pickupLocation, returnLocation]);

  // Recentrer la carte
  useEffect(() => {
    if (map && waypoints.length > 0) {
      const bounds = L.latLngBounds(
        waypoints.map((wp) => [wp.latitude, wp.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, waypoints]);

  const handleAddWaypoint = () => {
    if (!map) return;

    const center = map.getCenter();
    const newWaypoint: ItineraryPoint = {
      latitude: center.lat,
      longitude: center.lng,
      address: `Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}`,
      order: waypoints.length,
    };

    setWaypoints([...waypoints, newWaypoint]);
    toast.success("Point d'arrêt ajouté");
  };

  const handleRemoveWaypoint = (index: number) => {
    const updated = waypoints
      .filter((_, i) => i !== index)
      .map((wp, i) => ({ ...wp, order: i }));
    setWaypoints(updated);
    toast.success("Point d'arrêt supprimé");
  };

  const handleSave = async () => {
    if (waypoints.length < 2) {
      toast.error("Au moins 2 points sont requis (départ et arrivée)");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(waypoints);
      toast.success("Itinéraire sauvegardé avec succès");
      setIsEditing(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur sauvegarde itinéraire:", error);
      toast.error("Erreur lors de la sauvegarde de l'itinéraire");
    } finally {
      setIsSaving(false);
    }
  };

  const polylinePoints = waypoints.map((wp) => [wp.latitude, wp.longitude]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] p-0 gap-0 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900">
                {existingItinerary && existingItinerary.length > 0
                  ? "Votre itinéraire"
                  : "Créer un itinéraire"}
              </DialogTitle>
              <p className="text-sm text-gray-600">
                {isEditing
                  ? "Modifiez votre itinéraire en ajoutant des points d'arrêt"
                  : "Visualisez votre trajet de location"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-100 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Panneau des waypoints */}
          <div className="w-full md:w-80 flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white flex-shrink-0 flex overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Points d'arrêt</h3>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddWaypoint}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {waypoints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Aucun point d'arrêt</p>
                  </div>
                ) : (
                  waypoints.map((waypoint, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                index === 0
                                  ? "default"
                                  : index === waypoints.length - 1
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {index === 0
                                ? "Départ"
                                : index === waypoints.length - 1
                                ? "Arrivée"
                                : `Étape ${index}`}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {waypoint.address}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {waypoint.latitude.toFixed(4)},{" "}
                            {waypoint.longitude.toFixed(4)}
                          </p>
                        </div>
                        {isEditing && index > 0 && index < waypoints.length - 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveWaypoint(index)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Carte */}
          <div className="flex-1 min-h-[300px] relative">
            {waypoints.length > 0 ? (
              <MapContainer
                center={[waypoints[0].latitude, waypoints[0].longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                ref={setMap}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Polyline pour l'itinéraire */}
                {polylinePoints.length > 1 && (
                  <Polyline
                    positions={polylinePoints}
                    color="#3b82f6"
                    weight={3}
                    opacity={0.7}
                  />
                )}

                {/* Markers */}
                {waypoints.map((waypoint, index) => (
                  <Marker
                    key={index}
                    position={[waypoint.latitude, waypoint.longitude]}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-medium">
                          {index === 0
                            ? "Départ"
                            : index === waypoints.length - 1
                            ? "Arrivée"
                            : `Étape ${index}`}
                        </p>
                        <p className="text-gray-600">{waypoint.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <p className="text-gray-500">Aucun itinéraire à afficher</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white shrink-0">
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                onOpenChange(false);
              }}
              className="border-gray-300 hover:bg-gray-50"
            >
              Fermer
            </Button>

            {isEditable && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}

            {isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
