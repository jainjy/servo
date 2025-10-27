import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
} from "lucide-react";
import gsap from "gsap";
import PropertyMap from "@/components/PropertyMap";

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
  gsap.registerPlugin(ScrollTrigger);

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleContact = () => {
    if (property.owner.phone) {
      window.open(`tel:${property.owner.phone}`, "_self");
    }
  };

  const handleEmail = () => {
    window.open(
      `mailto:${property.owner.email}?subject=Demande d'information - ${property.title}`,
      "_self"
    );
  };

  const handleScheduleVisit = () => {
    // Rediriger vers la page de contact ou ouvrir un formulaire
    navigate("/contact", {
      state: {
        propertyId: property.id,
        propertyTitle: property.title
      }
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implémenter l'ajout aux favoris via API
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
    const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      published: { label: "Disponible", variant: "default" },
      draft: { label: "Brouillon", variant: "outline" },
      pending: { label: "En attente", variant: "secondary" },
      archived: { label: "Archivé", variant: "outline" },
      sold: { label: "Vendu", variant: "destructive" },
      rented: { label: "Loué", variant: "destructive" }
    };

    return statusMap[property.status] || { label: property.status, variant: "outline" };
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      house: "Maison",
      apartment: "Appartement",
      villa: "Villa",
      land: "Terrain",
      studio: "Studio"
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
      elevator: <UploadIcon className="h-4 w-4" />
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
      // Créer un nom de dossier propre
      const folderName = propertyTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();

      // Téléchargement séquentiel
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const fileName = `${folderName}_photo_${i + 1}.jpg`;

        // Télécharger via blob pour éviter les blocages du navigateur
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        // Libérer l’URL pour éviter les fuites mémoire
        URL.revokeObjectURL(link.href);

        // Petit délai (500 ms) pour éviter d’être bloqué par le navigateur
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log("✅ Toutes les images ont été téléchargées !");
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement des images :", error);
    }
  };


  const downloadImage = (imageUrl: string, filename: string) => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      link.target = '_blank';

      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      resolve(true);
    });
  };

  const statusBadge = getStatusBadge();
  const isAvailable = property.status === "published" && property.isActive;
  const mm = gsap.matchMedia();
  useEffect(() => {
    mm.add("(min-width: 1024px)", () => {
    ScrollTrigger.create({
      trigger: "#agent",
      start: "top 90px",
      end: "bottom 55px",
      pin: true,
      scrub: 1,
      //markers: true
    });
    })
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header avec bouton retour */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/immobilier")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux propriétés
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-10">
        {/* Galerie d'images et sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Galerie principale */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Image principale */}
              <div className="lg:col-span-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[selectedImage]}
                      alt={property.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Building className="h-20 w-20 text-muted-foreground" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {getTypeLabel(property.type)}
                    </Badge>
                    <Badge className="bg-success hover:bg-green-900 text-primary-foreground">
                      {statusBadge.label}
                    </Badge>
                    {property.isFeatured && (
                      <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        En vedette
                      </Badge>
                    )}
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur text-lg font-semibold">
                      <Euro className="h-4 w-4 mr-1" />
                      {getPriceDisplay()}
                    </Badge>
                  </div>

                  {/* Compteur de vues */}
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur">
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
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                            ? "border-primary"
                            : "border-transparent"
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
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent bg-muted flex items-center justify-center"
                    >
                      <Building className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))
                )}

                {/* BOUTON TÉLÉCHARGER TOUTES LES PHOTOS - EN DESSOUS DES IMAGES */}
                {property.images && property.images.length > 0 && (
                  <div className="col-span-2 mt-[-160px]">
                    <Button
                      onClick={() => downloadAllImages(property.images, property.title)}
                      variant="outline"
                      size="sm"
                      className="w-full"
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
          <div id="agent" className="space-y-6 relative lg:absolute right-2 lg:w-80">
            {/* Carte Agent */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex justify-between gap-1 mt-1">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">
                          {property.owner.firstName} {property.owner.lastName}
                        </h3>
                        {property.owner.companyName && (
                          <p className="text-sm text-muted-foreground">
                            {property.owner.companyName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {property.owner.phone && (
                    <Button className="w-full" onClick={handleContact}>
                      <Phone className="h-4 w-4 mr-2" />
                      {property.owner.phone}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleEmail}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {getPriceDisplay()}
                    </div>
                    {property.listingType === "rent" && (
                      <p className="text-sm text-muted-foreground">
                        Charges non comprises
                      </p>
                    )}
                    {property.listingType === "sale" && (
                      <p className="text-sm text-muted-foreground">
                        Honoraires inclus
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
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
                      className="w-full"
                      onClick={handleContact}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contacter l'agent
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                    <Shield className="h-4 w-4" />
                    <span>Transaction sécurisée</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* En-tête */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-5 w-5" />
                <span>{getFullAddress()}</span>
              </div>

              {/* Caractéristiques principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                {property.surface && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Ruler className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.surface} m²</div>
                      <div className="text-sm text-muted-foreground">
                        Surface
                      </div>
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">
                        Chambres
                      </div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">
                        Salles de bain
                      </div>
                    </div>
                  </div>
                )}
                {property.rooms && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.rooms}</div>
                      <div className="text-sm text-muted-foreground">
                        Pièces
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Équipements</TabsTrigger>
                <TabsTrigger value="location">Localisation</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {property.description || "Aucune description disponible."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">Caractéristiques</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium">{getTypeLabel(property.type)}</span>
                        </div>
                        {property.surface && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Surface</span>
                            <span className="font-medium">{property.surface} m²</span>
                          </div>
                        )}
                        {property.yearBuilt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Année</span>
                            <span className="font-medium">{property.yearBuilt}</span>
                          </div>
                        )}
                        {property.energyClass && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">DPE</span>
                            <span className="font-medium">{property.energyClass}</span>
                          </div>
                        )}
                        {property.floor && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Étage</span>
                            <span className="font-medium">{property.floor}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">Informations</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Statut</span>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type d'annonce</span>
                          <span className="font-medium">
                            {property.listingType === "rent" ? "Location" : "Vente"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Publié le</span>
                          <span className="font-medium">
                            {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        {property.expiresAt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expire le</span>
                            <span className="font-medium">
                              {new Date(property.expiresAt).toLocaleDateString('fr-FR')}
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
                      className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="text-primary">
                        {getAmenityIcon(feature.toLowerCase())}
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="pt-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Localisation</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{getFullAddress()}</span>
                      </div>

                      {property.latitude && property.longitude ? (
                        <div className="h-96 rounded-lg overflow-hidden">
                          <PropertyMap
                            latitude={property.latitude}
                            longitude={property.longitude}
                            address={getFullAddress()}
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">
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
    </div>
  );
};

export default PropertyDetailPage;