import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Camera, Star, Clock, MapPin, Bed, Bath, Ruler, Wrench, Home, Car, Utensils } from "lucide-react";
import PartnersPage from "./ServicesPartnersPage/PartnersPage";
import ServicesPage from "./ServicesPartnersPage/ServicesPages";

// Types pour TypeScript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  images: string[];
  metiers?: Array<{ id: string; libelle: string; name?: string }>;
  rating?: number;
  type: 'service';
}

interface Property {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  address?: string;
  images: string[];
  rooms?: number;
  bathrooms?: number;
  surface?: number;
  rating?: number;
  type: 'property';
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  rating?: number;
  type: 'product';
}

interface Aliment {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  rating?: number;
  type: 'aliment';
}

type Item = Service | Property | Product | Aliment;

const ServicesPartnersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("section");

  const [view, setView] = useState("default");
  const [services, setServices] = useState<Service[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [aliments, setAliments] = useState<Aliment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction utilitaire pour parser les données API
  const parseApiData = (data: any, defaultKey: string): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data[defaultKey] && Array.isArray(data[defaultKey])) return data[defaultKey];
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.items && Array.isArray(data.items)) return data.items;
    if (data.results && Array.isArray(data.results)) return data.results;
    return [data];
  };

  // Fonction pour récupérer toutes les données
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      // console.log('🔄 Chargement des données depuis:', API_BASE_URL);

      // Récupérer tous les services en parallèle
      const requests = [
        fetch(`${API_BASE_URL}/api/services`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`${API_BASE_URL}/api/properties`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`${API_BASE_URL}/api/products`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`${API_BASE_URL}/api/aliments`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
      ];

      const [servicesRes, propertiesRes, productsRes, alimentsRes] = await Promise.all(requests);

      // Traitement des réponses
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        const parsedServices = parseApiData(servicesData, 'services');
        // console.log('✅ Services chargés:', parsedServices.length);
        setServices(parsedServices.map((service: any) => ({ ...service, type: 'service' })));
      } else {
        console.warn('❌ Erreur services:', servicesRes.status);
        setServices([]);
      }

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json();
        const parsedProperties = parseApiData(propertiesData, 'properties');
        // console.log('✅ Propriétés chargées:', parsedProperties.length);
        setProperties(parsedProperties.map((property: any) => ({ ...property, type: 'property' })));
      } else {
        console.warn('❌ Erreur propriétés:', propertiesRes.status);
        setProperties([]);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const parsedProducts = parseApiData(productsData, 'products');
        // console.log('✅ Produits chargés:', parsedProducts.length);
        setProducts(parsedProducts.map((product: any) => ({ ...product, type: 'product' })));
      } else {
        console.warn('❌ Erreur produits:', productsRes.status);
        setProducts([]);
      }

      if (alimentsRes.ok) {
        const alimentsData = await alimentsRes.json();
        const parsedAliments = parseApiData(alimentsData, 'aliments');
        // console.log('✅ Aliments chargés:', parsedAliments.length);
        setAliments(parsedAliments.map((aliment: any) => ({ ...aliment, type: 'aliment' })));
      } else {
        console.warn('❌ Erreur aliments:', alimentsRes.status);
        setAliments([]);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      setError(errorMessage);
      console.error('💥 Erreur générale:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les données au chargement
  useEffect(() => {
    fetchAllData();
  }, []);

  // Gestion de la section URL
  useEffect(() => {
    if (section) {
      if (section === "partenaires") setView("partenaires");
      if (section === "prestations") setView("services");
    } else {
      setView("default");
    }
  }, [section]);

  // Composant pour afficher tous les services, biens, produits, etc.
  const AllServicesGridView = () => {
    if (loading) {
      return (
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F]"></div>
              <span className="ml-3 text-gray-600 mt-4">Chargement des données...</span>
              <div className="mt-2 text-sm text-gray-500">
                Services, biens, produits et aliments
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">
                Erreur lors du chargement
              </div>
              <div className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                {error}
              </div>
              <button
                onClick={fetchAllData}
                className="bg-[#556B2F] text-white px-6 py-2 rounded-lg hover:bg-[#6B8E23] transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      );
    }

    const allItems: Item[] = [
      ...services,
      ...properties,
      ...products,
      ...aliments
    ];

    // Statistiques par type
    const stats = {
      services: services.length,
      properties: properties.length,
      products: products.length,
      aliments: aliments.length,
      total: allItems.length
    };

    if (allItems.length === 0) {
      return (
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">Aucune donnée disponible pour le moment</div>
              <div className="text-gray-400 text-sm mb-6">
                Les services, biens et produits apparaîtront ici une fois disponibles
              </div>
              <button
                onClick={fetchAllData}
                className="bg-[#556B2F] text-white px-6 py-2 rounded-lg hover:bg-[#6B8E23] transition-colors"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Composant de carte générique
    const renderItemCard = (item: Item, index: number) => {
      // Configuration par type
      const getTypeConfig = (type: string) => {
        const configs = {
          service: {
            color: '#556B2F',
            lightColor: '#556B2F/10',
            icon: Wrench,
            label: 'Service',
            bgFrom: 'from-[#556B2F]/10',
            bgTo: 'to-[#6B8E23]/10',
            borderColor: 'border-[#556B2F]/20'
          },
          property: {
            color: '#8B4513',
            lightColor: '#8B4513/10',
            icon: Home,
            label: 'Bien Immobilier',
            bgFrom: 'from-[#8B4513]/10',
            bgTo: 'to-[#8B4513]/20',
            borderColor: 'border-[#8B4513]/20'
          },
          product: {
            color: '#6B8E23',
            lightColor: '#6B8E23/10',
            icon: Car,
            label: 'Produit',
            bgFrom: 'from-[#6B8E23]/10',
            bgTo: 'to-[#6B8E23]/20',
            borderColor: 'border-[#6B8E23]/20'
          },
          aliment: {
            color: '#556B2F',
            lightColor: '#556B2F/10',
            icon: Utensils,
            label: 'Aliment',
            bgFrom: 'from-[#556B2F]/10',
            bgTo: 'to-[#556B2F]/20',
            borderColor: 'border-[#556B2F]/20'
          }
        };
        return configs[type as keyof typeof configs] || configs.service;
      };

      const config = getTypeConfig(item.type);
      const IconComponent = config.icon;
      const displayName = (item as any).name || (item as any).title || config.label;
      const displayPrice = (item as any).price;
      const displayDescription = (item as any).description || 'Aucune description disponible';
      const images = (item as any).images || [];

      return (
        <div
          key={item.id || `${item.type}-${index}`}
          className={`bg-[#FFFFF0] rounded-xl shadow-lg border ${config.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          {/* Image */}
          <div className={`aspect-video bg-gradient-to-br ${config.bgFrom} ${config.bgTo} relative`}>
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconComponent className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="bg-[#556B2F] text-white px-2 py-1 rounded-full text-xs font-medium">
                {config.label}
              </span>
            </div>
            {displayPrice && (
              <div className="absolute top-3 right-3 bg-[#FFFFF0] rounded-lg px-3 py-1 shadow-md">
                <span className="font-bold text-[#8B4513] text-sm">
                  {typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice} €
                </span>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
              {displayName}
            </h3>

            {/* Adresse pour les propriétés */}
            {(item as Property).address && (
              <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{(item as Property).address}</span>
              </div>
            )}

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {displayDescription}
            </p>

            {/* Caractéristiques spécifiques */}
            <div className="mb-4">
              {/* Métiers pour les services */}
              {(item as Service).metiers && Array.isArray((item as Service).metiers) && (item as Service).metiers!.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(item as Service).metiers!.slice(0, 3).map((metier: any, idx: number) => (
                    <span
                      key={metier.id || `metier-${idx}`}
                      className="bg-[#D3D3D3]/30 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {metier.libelle || metier.name || 'Métier'}
                    </span>
                  ))}
                </div>
              )}

              {/* Caractéristiques immobilières */}
              {((item as Property).rooms || (item as Property).bathrooms || (item as Property).surface) && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  {(item as Property).rooms && (
                    <div className="bg-[#FFFFF0] rounded-lg p-2 border border-[#D3D3D3]">
                      <div className="flex items-center justify-center gap-1 text-gray-700">
                        <Bed className="w-4 h-4" />
                        <span className="text-sm font-medium">{(item as Property).rooms}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Chambres</div>
                    </div>
                  )}
                  {(item as Property).bathrooms && (
                    <div className="bg-[#FFFFF0] rounded-lg p-2 border border-[#D3D3D3]">
                      <div className="flex items-center justify-center gap-1 text-gray-700">
                        <Bath className="w-4 h-4" />
                        <span className="text-sm font-medium">{(item as Property).bathrooms}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Salles</div>
                    </div>
                  )}
                  {(item as Property).surface && (
                    <div className="bg-[#FFFFF0] rounded-lg p-2 border border-[#D3D3D3]">
                      <div className="flex items-center justify-center gap-1 text-gray-700">
                        <Ruler className="w-4 h-4" />
                        <span className="text-sm font-medium">{(item as Property).surface}m²</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Surface</div>
                    </div>
                  )}
                </div>
              )}

              {/* Durée pour les services */}
              {(item as Service).duration && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Durée: {(item as Service).duration}min</span>
                </div>
              )}

              {/* Catégorie pour les produits/aliments */}
              {((item as Product).category || (item as Aliment).category) && (
                <div className="mb-2">
                  <span className="inline-block bg-[#D3D3D3]/30 text-gray-700 px-2 py-1 rounded text-xs">
                    {(item as Product).category || (item as Aliment).category}
                  </span>
                </div>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="flex items-center justify-between text-sm text-gray-600 border-t border-[#D3D3D3] pt-3">
              <div className="flex items-center gap-4">
                {displayPrice && (
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#8B4513]">
                      {displayPrice}€
                    </span>
                  </div>
                )}
              </div>

              {/* Note moyenne */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{(item as any).rating || '4.5'}</span>
              </div>
            </div>

            {/* Bouton d'action */}
            <button
              className="w-full mt-4 bg-[#556B2F] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#6B8E23] transition-colors duration-300"
              onClick={() => {
                // console.log('Détails item:', item);
                alert(`Détails: ${displayName}\nType: ${config.label}\nPrix: ${displayPrice || 'N/A'}€`);
              }}
            >
              Voir les détails
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* Bannière d'information */}
          <div className="bg-[#556B2F]/10 border border-[#556B2F]/20 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#556B2F] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-[#556B2F] font-medium">Tous nos services et produits</span>
            </div>
            <p className="text-[#556B2F] text-sm mt-2">
              Découvrez l'ensemble de nos services, biens immobiliers, produits et aliments disponibles.
            </p>
          </div>

          {/* En-tête avec statistiques */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Catalogue complet ({stats.total} éléments)
            </h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-[#556B2F]/20 text-[#556B2F] px-3 py-1 rounded-full flex items-center gap-1">
                <Wrench className="w-3 h-3" />
                {stats.services} services
              </span>
              <span className="bg-[#8B4513]/20 text-[#8B4513] px-3 py-1 rounded-full flex items-center gap-1">
                <Home className="w-3 h-3" />
                {stats.properties} biens
              </span>
              <span className="bg-[#6B8E23]/20 text-[#6B8E23] px-3 py-1 rounded-full flex items-center gap-1">
                <Car className="w-3 h-3" />
                {stats.products} produits
              </span>
              <span className="bg-[#556B2F]/20 text-[#556B2F] px-3 py-1 rounded-full flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                {stats.aliments} aliments
              </span>
            </div>
          </div>

          {/* Grille de tous les éléments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item: Item, index: number) => renderItemCard(item, index))}
          </div>

          {/* Bouton de rafraîchissement */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={fetchAllData}
              className="px-6 py-2 border border-[#D3D3D3] rounded-lg text-sm hover:bg-[#FFFFF0] flex items-center gap-2 transition-colors text-[#556B2F]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualiser les données
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Header titles
  const renderHeaderTitles = () => {
    return (
      <div className="text-center py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6 text-secondary-text">
            {view === "default" ? "Tous nos services" :
              view === "partenaires" ? "Nos Partenaires" :
                view === "services" ? "Tous nos services" : "Aides"}
          </h1>
          <p className="text-sm text-gray-100">
            {view === "default" ? "Découvrez l'ensemble de nos prestations et propriétés disponibles" :
              view === "partenaires" ? "Trouvez les meilleurs experts pour votre projet" :
                view === "services" ? "Découvrez l'ensemble de nos prestations et propriétés disponibles" : "Obtenez de l'aide et des conseils"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-900 antialiased mt-15">
      <header
        className="relative pt-12 px-8 pb-8 overflow-hidden border-b border-[#D3D3D3]"
      >
        {/* Image de fond */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://i.pinimg.com/736x/9c/7a/3a/9c7a3a5a0b27ce38ef9f99260836aa28.jpg)', // Remplacez par le chemin de votre image
          }}
        >
          {/* Overlay noir */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/60"></div>
        </div>

        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">{renderHeaderTitles()}</div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${view === "services"
                  ? "border-[#556B2F] bg-[#556B2F] text-white shadow-lg"
                  : "border-[#556B2F] bg-[#FFFFF0] text-[#556B2F] hover:bg-[#556B2F]/10 shadow-md"
                } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=prestations')}
            >
              TOUS NOS SERVICES
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${view === "partenaires"
                  ? "border-[#8B4513] bg-[#8B4513] text-white shadow-lg"
                  : "border-[#8B4513] bg-[#FFFFF0] text-[#8B4513] hover:bg-[#8B4513]/10 shadow-md"
                } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=partenaires')}
            >
              PRÉSENTATION PARTENAIRES
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 pb-20 relative z-10">
        {view === "default" && <AllServicesGridView />}
        {view === "partenaires" && <PartnersPage />}
        {view === "services" && <ServicesPage />}
      </main>
    </div>
  );
};

export default ServicesPartnersPage;