"use client";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Euro, Sliders } from "lucide-react";

const PropertyFilters = () => {
  return (
   <div className="container mx-auto px-4 mb-8"> 
      <div className="bg-white rounded-lg py-5 px-2 shadow-lg flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            ACHAT
          </Button>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            LOCATION LONGUE DURÉE
          </Button>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            LOCATION SAISONNIÈRE
          </Button>
          <Button variant="outline" className="gap-2">
            <Sliders className="h-4 w-4" />
            Type de bien
          </Button>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Localisation
          </Button>
          <Button variant="outline" className="gap-2">
            <Euro className="h-4 w-4" />
            RAYON
          </Button>
          <Button >
          VENDRE / LOUER UN BIEN
        </Button>
        </div>
        
      </div>
    </div>
  );
};

export default PropertyFilters;
