import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyDetailPage from "@/components/PropertyDetailPage";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Propriété non trouvée"}</p>
          <Button onClick={() => navigate("/immobilier")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux propriétés
          </Button>
        </div>
      </div>
    );
  }

  return <PropertyDetailPage property={property} />;
};

export default PropertyPage;