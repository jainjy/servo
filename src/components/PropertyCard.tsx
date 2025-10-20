import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Ruler, Bed, Eye } from "lucide-react";

const PropertyCard = ({ 
  id,
  image, 
  price, 
  title, 
  location, 
  area, 
  type, 
  features, 
  rooms,
  onVoirDetail 
}) => {
  const navigate = useNavigate();

  const handleVoirDetail = (e) => {
    e.stopPropagation();
    if (onVoirDetail) {
      onVoirDetail();
    } else {
      navigate(`/immobilier/${id}`);
    }
  };

  const handleContact = (e) => {
    e.stopPropagation();
    console.log("Contacter pour le bien:", id);
    // Logique pour contacter l'agent
  };

  const handleCardClick = () => {
    if (onVoirDetail) {
      onVoirDetail();
    } else {
      navigate(`/immobilier/${id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20 cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
            {type}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="font-bold bg-background/90 backdrop-blur-sm text-foreground">
            {price}
          </Badge>
        </div>
      </div>

      <div className="px-6 py-2 flex flex-col flex-grow">
        {/* Titre et Localisation */}
        <div className=" flex-grow">
          <h3 className="font-bold text-gray-800 text-xl  line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>{area}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{rooms} ch</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {features}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="default" 
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
            onClick={handleContact}
          >
            Contacter
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleVoirDetail}
            className="flex-shrink-0 border-2 hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
            title="Voir les détails"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;