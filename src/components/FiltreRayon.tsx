// src/components/FiltreRayon.tsx
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Locate, LocateOff, RefreshCw } from "lucide-react";

interface FiltreRayonProps {
  radiusKm: number;
  setRadiusKm: (v: number) => void;
  onUseMyLocation?: () => void;
  onResetLocation?: () => void;
  isGettingLocation?: boolean;
  hasUserLocation?: boolean;
  isGeolocationDenied?: boolean;
}

const FiltreRayon: React.FC<FiltreRayonProps> = ({ 
  radiusKm, 
  setRadiusKm, 
  onUseMyLocation, 
  onResetLocation,
  isGettingLocation, 
  hasUserLocation,
  isGeolocationDenied 
}) => {
  return (
    <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">RAYON DE RECHERCHE</span>
        <span className="text-sm font-bold text-slate-900">{radiusKm} Km</span>
      </div>

      <Slider
        value={[radiusKm]}
        min={0}
        max={100}
        step={1}
        onValueChange={(v) => setRadiusKm(v[0] ?? 0)}
        className="mt-2"
      />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button 
            onClick={onUseMyLocation} 
            disabled={isGettingLocation || isGeolocationDenied}
            className="flex-1"
            variant={hasUserLocation ? "default" : "outline"}
          >
            {isGettingLocation ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Localisation...
              </>
            ) : isGeolocationDenied ? (
              <>
                <LocateOff className="w-4 h-4 mr-2" />
                Autorisation refusée
              </>
            ) : hasUserLocation ? (
              <>
                <Locate className="w-4 h-4 mr-2" />
                Position active
              </>
            ) : (
              <>
                <Locate className="w-4 h-4 mr-2" />
                Utiliser ma position
              </>
            )}
          </Button>
          
          {hasUserLocation && onResetLocation && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={onResetLocation}
              title="Désactiver la géolocalisation"
            >
              <LocateOff className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {hasUserLocation && (
          <p className="text-xs text-slate-500 text-center mt-1">
            Filtrage activé autour de votre position
          </p>
        )}
      </div>
    </div>
  );
};

export default FiltreRayon;