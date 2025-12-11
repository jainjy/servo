import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Ruler,
  Bed,
  Bath,
  Car,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  Star,
  Users,
  Shield,
  Home,
  Mountain,
  Waves,
  Euro,
  Building,
  TreePine,
  Wifi,
  Snowflake,
  Utensils,
  Calculator,
  Square,
  Eye,
  UploadIcon,
  X,
} from "lucide-react";
import gsap from "gsap";
import PropertyMap from "@/components/PropertyMap";
import { ModalDemandeVisite } from "@/components/ModalDemandeVisite";

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

interface PropertyDetailPageProps {
  property: Property;
}

const PropertyDetailPage = ({ property }: PropertyDetailPageProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    // Défilement fluide vers le haut
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Pour un défilement fluide
    });
  }, []);
  // Enregistrer ScrollTrigger une seule fois
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  console.log("Détails de la propriété:", property);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  const handleContact = useCallback(() => {
    if (property.owner.phone) {
      window.open(`tel:${property.owner.phone}`, "_self");
    }
  }, [property.owner.phone]);

  const handleEmail = useCallback(() => {
    window.open(
      `mailto:${property.owner.email}?subject=Demande d'information - ${property.title}`,
      "_self"
    );
  }, [property.owner.email, property.title]);

  const handleScheduleVisit = useCallback(() => {
    setIsVisitModalOpen(true);
  }, []);

  const handleCloseVisitModal = useCallback(() => {
    setIsVisitModalOpen(false);
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " €";
  };

  const getPriceSuffix = () => {
    return property.listingType === "rent" ? "/mois" : "";
  };

  const getPriceDisplay = () => {
    if (!property.price) return "Prix sur demande";
    return `${formatPrice(property.price)}${getPriceSuffix()}`;
  };

  const getStatusBadge = () => {
    const statusMap: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      };
    } = {
      published: { label: "Disponible", variant: "default" },
      draft: { label: "Brouillon", variant: "outline" },
      pending: { label: "En attente", variant: "secondary" },
      archived: { label: "Archivé", variant: "outline" },
      sold: { label: "Vendu", variant: "destructive" },
      rented: { label: "Loué", variant: "destructive" },
    };

    return (
      statusMap[property.status] || {
        label: property.status,
        variant: "outline",
      }
    );
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      house: "Maison",
      apartment: "Appartement",
      villa: "Villa",
      land: "Terrain",
      studio: "Studio",
    };

    return typeMap[property.type] || property.type;
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      pool: <Waves className="h-4 w-4" />,
      garden: <TreePine className="h-4 w-4" />,
      parking: <Car className="h-4 w-4" />,
      terrace: <Square className="h-4 w-4" />,
      balcony: <Square className="h-4 w-4" />,
      elevator: <UploadIcon className="h-4 w-4" />,
    };

    return iconMap[amenity] || <Home className="h-4 w-4" />;
  };

  const getFeaturesList = () => {
    const features = [];

    if (property.hasPool) features.push("Piscine");
    if (property.hasGarden) features.push("Jardin");
    if (property.hasParking) features.push("Parking");
    if (property.hasTerrace) features.push("Terrasse");
    if (property.hasBalcony) features.push("Balcon");
    if (property.hasElevator) features.push("Ascenseur");

    return features.length > 0 ? features : ["Aucun équipement spécifique"];
  };

  const getFullAddress = () => {
    const parts = [];
    if (property.address) parts.push(property.address);
    if (property.zipCode) parts.push(property.zipCode);
    if (property.city) parts.push(property.city);
    return parts.join(", ");
  };

  const downloadAllImages = async (images: string[], propertyTitle: string) => {
    try {
      const folderName = propertyTitle
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const fileName = `${folderName}_photo_${i + 1}.jpg`;

        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(link.href);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      console.log("✅ Toutes les images ont été téléchargées !");
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement des images :", error);
    }
  };

  const statusBadge = getStatusBadge();
  const isAvailable = property.isActive;
  const mm = gsap.matchMedia();

  useEffect(() => {
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: "#agents",
        start: "top 90px",
        end: "bottom 55px",
        pin: true,
        scrub: 1,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white ">
      <div className="container mx-auto px-4 py-10">
        {/* Galerie d'images et sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Galerie principale */}
          <div className="lg:col-span-3 bg-white p-2 rounded-xl shadow-lg border border-[#D3D3D3]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Image principale */}
              <div className="lg:col-span-2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[selectedImage]}
                      alt={property.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Building className="h-20 w-20 text-gray-400" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-[#6B8E23] text-white">
                      {getTypeLabel(property.type)}
                    </Badge>
                    <Badge className="bg-[#8B4513]/90 text-white">
                      {statusBadge.label}
                    </Badge>
                    {property.isFeatured && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        En vedette
                      </Badge>
                    )}
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 backdrop-blur text-lg font-semibold border border-[#D3D3D3] text-[#8B4513]">
                      <Euro className="h-4 w-4 mr-1" />
                      {getPriceDisplay()}
                    </Badge>
                  </div>

                  {/* Compteur de vues */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur border border-[#D3D3D3] text-[#556B2F]">
                      <Eye className="h-3 w-3 mr-1" />
                      {property.views} vues
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {property.images && property.images.length > 0 ? (
                  <>
                    {property.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index ? "" : "border-transparent"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} - Vue ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </>
                ) : (
                  [1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent bg-gray-100 flex items-center justify-center"
                    >
                      <Building className="h-6 w-6 text-gray-400" />
                    </div>
                  ))
                )}

                {/* BOUTON TÉLÉCHARGER TOUTES LES PHOTOS */}
                {property.images && property.images.length > 0 && (
                  <div className="col-span-2 mt-[-160px]">
                    <Button
                      onClick={() =>
                        downloadAllImages(property.images, property.title)
                      }
                      variant="outline"
                      size="sm"
                      className="w-full border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Télécharger toutes les photos ({property.images.length})
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Agent & Actions */}
          <div
            id="agents"
            className="space-y-6 relative lg:absolute right-2 lg:w-80"
          >
            {/* Carte Agent */}
            <Card className="border border-[#D3D3D3]">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex justify-between gap-1 mt-1">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 bg-[#6B8E23]/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-[#6B8E23]" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg text-[#8B4513]">
                          {property.owner.firstName} {property.owner.lastName}
                        </h3>
                        {property.owner.companyName && (
                          <p className="text-sm text-gray-600">
                            {property.owner.companyName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {property.owner.phone && (
                    <Button
                      className="w-full bg-[#6B8E23] hover:bg-[#556B2F]"
                      onClick={handleContact}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {property.owner.phone}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                    onClick={handleEmail}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border border-[#D3D3D3]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8B4513] mb-2">
                      {getPriceDisplay()}
                    </div>
                    {property.listingType === "rent" && (
                      <p className="text-sm text-gray-600">
                        Charges non comprises
                      </p>
                    )}
                    {property.listingType === "sale" && (
                      <p className="text-sm text-gray-600">Honoraires inclus</p>
                    )}
                  </div>

                  <Button
                    className={`w-full ${
                      !isAvailable
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#556B2F] hover:bg-[#6B8E23]"
                    }`}
                    size="lg"
                    onClick={handleScheduleVisit}
                    disabled={!isAvailable}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    {isAvailable ? "Visiter ce bien" : "Non disponible"}
                  </Button>

                  {property.owner.phone && (
                    <Button
                      variant="outline"
                      className="w-full border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                      onClick={handleContact}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contacter l'agent
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-2">
                    <Shield className="h-4 w-4 text-[#6B8E23]" />
                    <span>Transaction sécurisée</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contenu principal */}
        <div className=" gap-8 p-2 rounded-lg shadow-lg border border-[#D3D3D3]">
          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* En-tête */}
            <div>
              <h1 className="text-2xl lg:text-2xl font-bold mb-4 text-[#8B4513]">
                {property.title}
              </h1>
              <div className="flex items-center text-sm gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5 text-[#556B2F]" />
                <span>{getFullAddress()}</span>
              </div>

              {/* Caractéristiques principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-[#D3D3D3]">
                {property.surface && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                      <Ruler className="h-5 w-5 text-[#6B8E23]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#8B4513]">
                        {property.surface} m²
                      </div>
                      <div className="text-sm text-gray-600">Surface</div>
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                      <Bed className="h-5 w-5 text-[#6B8E23]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#8B4513]">
                        {property.bedrooms}
                      </div>
                      <div className="text-sm text-gray-600">Chambres</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                      <Bath className="h-5 w-5 text-[#6B8E23]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#8B4513]">
                        {property.bathrooms}
                      </div>
                      <div className="text-sm text-gray-600">
                        Salles de bain
                      </div>
                    </div>
                  </div>
                )}
                {property.rooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                      <Home className="h-5 w-5 text-[#6B8E23]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#8B4513]">
                        {property.rooms}
                      </div>
                      <div className="text-sm text-gray-600">Pièces</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 border-b border-[#D3D3D3]">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white text-[#8B4513]"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white text-[#8B4513]"
                >
                  Équipements
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white text-[#8B4513]"
                >
                  Localisation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-[#8B4513]">
                    Description
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {property.description || "Aucune description disponible."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-[#D3D3D3]">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4 text-[#8B4513]">
                        Caractéristiques
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type</span>
                          <span className="font-medium text-[#556B2F]">
                            {getTypeLabel(property.type)}
                          </span>
                        </div>
                        {property.surface && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Surface</span>
                            <span className="font-medium text-[#556B2F]">
                              {property.surface} m²
                            </span>
                          </div>
                        )}
                        {property.yearBuilt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Année</span>
                            <span className="font-medium text-[#556B2F]">
                              {property.yearBuilt}
                            </span>
                          </div>
                        )}
                        {property.energyClass && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">DPE</span>
                            <span className="font-medium text-[#556B2F]">
                              {property.energyClass}
                            </span>
                          </div>
                        )}
                        {property.floor && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Étage</span>
                            <span className="font-medium text-[#556B2F]">
                              {property.floor}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#D3D3D3]">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4 text-[#8B4513]">
                        Informations
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut</span>
                          <Badge className="bg-[#8B4513]/10 text-[#8B4513] border border-[#8B4513]/30">
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type d'annonce</span>
                          <span className="font-medium text-[#556B2F]">
                            {property.listingType === "rent"
                              ? "Location"
                              : "Vente"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Publié le</span>
                          <span className="font-medium text-[#556B2F]">
                            {new Date(property.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                        {property.expiresAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expire le</span>
                            <span className="font-medium text-[#556B2F]">
                              {new Date(property.expiresAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="features" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFeaturesList().map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-[#D3D3D3] rounded-lg hover:border-[#6B8E23] transition-colors"
                    >
                      <div className="text-[#6B8E23]">
                        {getAmenityIcon(feature.toLowerCase())}
                      </div>
                      <span className="font-medium text-[#8B4513]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="pt-6">
                <Card className="border border-[#D3D3D3]">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4 text-[#8B4513]">
                      Localisation
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-[#556B2F]" />
                        <span>{getFullAddress()}</span>
                      </div>

                      {property.latitude && property.longitude ? (
                        <div className="h-96 rounded-lg overflow-hidden border border-[#D3D3D3]">
                          <PropertyMap
                            latitude={property.latitude}
                            longitude={property.longitude}
                            address={getFullAddress()}
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-[#D3D3D3]">
                          <p className="text-gray-600">
                            Localisation non disponible
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modal de demande de visite */}
      <ModalDemandeVisite
        open={isVisitModalOpen}
        onClose={handleCloseVisitModal}
        property={property}
        onSuccess={() => {
          handleCloseVisitModal();
        }}
      />
    </div>
  );
};

export default PropertyDetailPage;
