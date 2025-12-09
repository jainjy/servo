import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyDetailPage from "@/components/PropertyDetailPage";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Calendar, MapPin, Phone, MessageSquare, ChevronRight } from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  price: number | null;
  surface: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string | null;
  city: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  features: string[];
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  views: number;
  listingType: string;
  energyClass: string | null;
  yearBuilt: number | null;
  floor: number | null;
  totalFloors: number | null;
  hasElevator: boolean;
  hasParking: boolean;
  hasBalcony: boolean;
  hasTerrace: boolean;
  hasGarden: boolean;
  hasPool: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  slug: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  expiresAt: string | null;
  owner: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    companyName: string | null;
    commercialName: string | null;
  };
}

const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("ID de propriété manquant");
          return;
        }

        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error: any) {
        console.error("Erreur lors du chargement de la propriété:", error);
        setError(error.response?.data?.error || "Erreur lors du chargement de la propriété");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBackClick = () => {
    if (property?.status === "for_sale") {
      navigate("/achat");
    } else if (property?.status === "for_rent") {
      navigate("/location");
    } else {
      navigate("/immobilier");
    }
  };

  const handleContactAgent = () => {
    if (property?.owner?.phone) {
      window.location.href = `tel:${property.owner.phone}`;
    } else {
      // Rediriger vers le formulaire de contact
      navigate("/contact", { 
        state: { 
          propertyId: property?.id,
          propertyTitle: property?.title 
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#6B8E23]/10 to-white">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#556B2F]/30 border-t-[#556B2F] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Home className="h-10 w-10 text-[#556B2F]" />
            </div>
          </div>
          <p className="mt-6 text-[#8B4513] font-medium">Chargement de la propriété...</p>
          <p className="mt-2 text-gray-600 text-sm">Veuillez patienter un instant</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#6B8E23]/10 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-[#D3D3D3]">
          <div className="w-16 h-16 bg-[#556B2F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-[#556B2F]" />
          </div>
          <h2 className="text-xl font-bold text-[#8B4513] mb-2">Oups !</h2>
          <p className="text-gray-700 mb-6">{error || "Propriété non trouvée"}</p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/immobilier")}
              className="w-full bg-[#6B8E23] hover:bg-[#556B2F] text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux propriétés
            </Button>
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6B8E23]/5 to-white">
          
      {/* Contenu principal */}
      <PropertyDetailPage property={property} />     
      {/* Bouton retour flottant pour desktop */}
      <div className="fixed top-24 left-4 z-30 hidden lg:block">
        <Button
          onClick={handleBackClick}
          variant="outline"
          className="flex items-center gap-2 border-[#D3D3D3] bg-white/80 backdrop-blur-sm text-[#8B4513] hover:text-[#6B8E23] hover:border-[#6B8E23] hover:bg-[#6B8E23]/5 shadow-lg transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour</span>
        </Button>
      </div>
    </div>
  );
};

export default PropertyPage;