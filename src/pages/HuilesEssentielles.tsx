// components/components/HuilesEssentielles.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Leaf,
  Sparkles,
  Zap,
  Droplets,
  ShieldCheck,
  Star,
  ShoppingCart,
  Search,
  Truck,
  Flower,
  Heart,
  Brain,
  Shield,
  Thermometer
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

// Données statiques pour simulation
const huilesEssentiellesStatiques = [
  {
    id: 1,
    name: "Lavande Vraie",
    botanicalName: "Lavandula angustifolia",
    description: "Huile essentielle apaisante et relaxante, parfaite pour le sommeil et la détente",
    price: 12.90,
    comparePrice: 15.90,
    volume: "10ml",
    quantity: 25,
    isOrganic: true,
    purityLevel: "100% Pure",
    extractionMethod: "Distillation à la vapeur",
    origin: "France",
    therapeuticProperties: ["Relaxant", "Apaisant", "Cicatrisant", "Antiseptique"],
    usageMethods: ["Diffusion", "Application cutanée", "Bain"],
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    vendor: {
      companyName: "Essences du Sud"
    },
    allergens: ["Peut causer des irritations chez les peaux sensibles"]
  },
  {
    id: 2,
    name: "Menthe Poivrée",
    botanicalName: "Mentha piperita",
    description: "Stimulante et rafraîchissante, idéale pour les maux de tête et la digestion",
    price: 9.90,
    comparePrice: 11.90,
    volume: "10ml",
    quantity: 18,
    isOrganic: false,
    purityLevel: "100% Pure",
    extractionMethod: "Distillation à la vapeur",
    origin: "Inde",
    therapeuticProperties: ["Stimulant", "Digestif", "Analgésique", "Décongestionnant"],
    usageMethods: ["Inhalation", "Application cutanée", "Diffusion"],
    images: ["https://images.unsplash.com/photo-1582719471384-8d3c1f8b25c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    vendor: {
      companyName: "Aromathérapie Pure"
    },
    allergens: ["Déconseillé aux femmes enceintes"]
  },
  {
    id: 3,
    name: "Tea Tree",
    botanicalName: "Melaleuca alternifolia",
    description: "Puissant antiseptique naturel pour les problèmes cutanés et respiratoires",
    price: 11.50,
    comparePrice: 13.50,
    volume: "15ml",
    quantity: 30,
    isOrganic: true,
    purityLevel: "Bio",
    extractionMethod: "Distillation à la vapeur",
    origin: "Australie",
    therapeuticProperties: ["Antiseptique", "Antifongique", "Immunostimulant", "Expectorant"],
    usageMethods: ["Application cutanée", "Inhalation", "Diffusion"],
    images: ["https://images.unsplash.com/photo-1601524909163-991bd9a5fead?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    vendor: {
      companyName: "Naturellement Bio"
    },
    allergens: ["Peut être irritant à l'état pur"]
  },
  {
    id: 4,
    name: "Eucalyptus Radiata",
    botanicalName: "Eucalyptus radiata",
    description: "Expectorant puissant pour les voies respiratoires, antiviral naturel",
    price: 8.90,
    comparePrice: null,
    volume: "10ml",
    quantity: 15,
    isOrganic: true,
    purityLevel: "100% Pure",
    extractionMethod: "Distillation à la vapeur",
    origin: "Espagne",
    therapeuticProperties: ["Expectorant", "Antiviral", "Antibactérien", "Stimulant"],
    usageMethods: ["Inhalation", "Diffusion", "Application cutanée diluée"],
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    vendor: {
      companyName: "Essences du Sud"
    },
    allergens: ["Déconseillé aux asthmatiques"]
  },
  {
    id: 5,
    name: "Citron",
    botanicalName: "Citrus limon",
    description: "Purifiante et stimulante, excellente pour l'immunité et la digestion",
    price: 7.90,
    comparePrice: 9.90,
    volume: "10ml",
    quantity: 22,
    isOrganic: false,
    purityLevel: "100% Pure",
    extractionMethod: "Expression à froid",
    origin: "Italie",
    therapeuticProperties: ["Purifiant", "Stimulant immunitaire", "Digestif", "Tonique"],
    usageMethods: ["Diffusion", "Application cutanée", "Nettoyage"],
    images: ["https://images.unsplash.com/photo-1582719471384-8d3c1f8b25c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    vendor: {
      companyName: "Aromathérapie Pure"
    },
    allergens: ["Photosensibilisante"]
  },
  {
    id: 6,
    name: "Ravintsara",
    botanicalName: "Cinnamomum camphora",
    description: "Antiviral majeur, stimulant immunitaire et relaxant musculaire",
    price: 14.90,
    comparePrice: 16.90,
    volume: "5ml",
    quantity: 10,
    isOrganic: true,
    purityLevel: "Bio",
    extractionMethod: "Distillation à la vapeur",
    origin: "Madagascar",
    therapeuticProperties: ["Antiviral", "Immunostimulant", "Relaxant musculaire", "Expectorant"],
    usageMethods: ["Application cutanée", "Inhalation", "Massage"],
    images: ["https://images.unsplash.com/photo-1601524909163-991bd9a5fead?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    vendor: {
      companyName: "Naturellement Bio"
    },
    allergens: []
  },
  {
    id: 7,
    name: "Ylang Ylang",
    botanicalName: "Cananga odorata",
    description: "Aphrodisiaque et équilibrante émotionnelle, parfum exotique envoûtant",
    price: 16.90,
    comparePrice: 19.90,
    volume: "5ml",
    quantity: 8,
    isOrganic: false,
    purityLevel: "Extra",
    extractionMethod: "Distillation à la vapeur",
    origin: "Comores",
    therapeuticProperties: ["Aphrodisiaque", "Équilibrant émotionnel", "Hypotenseur", "Antidépresseur"],
    usageMethods: ["Diffusion", "Application cutanée", "Bain"],
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    vendor: {
      companyName: "Essences du Sud"
    },
    allergens: []
  },
  {
    id: 8,
    name: "Romarin à Cinéole",
    botanicalName: "Rosmarinus officinalis",
    description: "Stimulant cérébral et hépatique, excellent pour la concentration",
    price: 10.90,
    comparePrice: 12.90,
    volume: "10ml",
    quantity: 20,
    isOrganic: true,
    purityLevel: "Bio",
    extractionMethod: "Distillation à la vapeur",
    origin: "Maroc",
    therapeuticProperties: ["Stimulant cérébral", "Hépatoprotecteur", "Expectorant", "Tonique"],
    usageMethods: ["Inhalation", "Application cutanée", "Diffusion"],
    images: ["https://images.unsplash.com/photo-1582719471384-8d3c1f8b25c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    vendor: {
      companyName: "Aromathérapie Pure"
    },
    allergens: ["Épileptogène à haute dose"]
  },
  {
    id: 9,
    name: "Géranium Rosat",
    botanicalName: "Pelargonium graveolens",
    description: "Équilibrante hormonale et régénérante cutanée, parfum floral délicat",
    price: 13.50,
    comparePrice: 15.50,
    volume: "5ml",
    quantity: 12,
    isOrganic: true,
    purityLevel: "100% Pure",
    extractionMethod: "Distillation à la vapeur",
    origin: "Égypte",
    therapeuticProperties: ["Équilibrant hormonal", "Régénérant cutané", "Antiseptique", "Cicatrisant"],
    usageMethods: ["Application cutanée", "Diffusion", "Soins visage"],
    images: ["https://images.unsplash.com/photo-1601524909163-991bd9a5fead?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    vendor: {
      companyName: "Naturellement Bio"
    },
    allergens: []
  }
];

const HuilesEssentielles = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, getCartItemsCount } = useCart();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("tous");

  useEffect(() => {
    // Utiliser les données statiques pour la simulation
    setProducts(huilesEssentiellesStatiques);
    setIsLoading(false);
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning("Veuillez vous connecter pour ajouter des articles au panier");
      return;
    }

    try {
      setAddingProductId(product.id);

      // Ajouter le produit au panier
      addToCart(product);

      // Petit délai pour laisser le temps à l'état de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trouver l'article dans le panier pour afficher la bonne quantité
      const cartItem = cartItems.find(item => item.id === product.id);
      const quantity = cartItem ? cartItem.quantity : 1;
      const totalItems = getCartItemsCount();

      // Afficher une confirmation détaillée
      toast.success(`${product.name} ajouté au panier !`, {
        description: `Quantité: ${quantity} - Total articles: ${totalItems}`,
        duration: 3000,
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  // Obtenir les propriétés thérapeutiques uniques
  const getUniqueProperties = () => {
    const allProperties = products.flatMap(product => 
      product.therapeuticProperties || []
    );
    const uniqueProperties = [...new Set(allProperties)].filter(Boolean);
    
    return [
      { id: 'tous', name: 'Toutes les propriétés', count: products.length },
      ...uniqueProperties.map(prop => ({
        id: prop,
        name: prop,
        count: products.filter(p => 
          p.therapeuticProperties && p.therapeuticProperties.includes(prop)
        ).length
      }))
    ];
  };

  // Obtenir les méthodes d'utilisation uniques
  const getUniqueUsageMethods = () => {
    const allMethods = products.flatMap(product => 
      product.usageMethods || []
    );
    const uniqueMethods = [...new Set(allMethods)].filter(Boolean);
    
    return [
      { id: 'tous', name: 'Toutes les utilisations', count: products.length },
      ...uniqueMethods.map(method => ({
        id: method,
        name: method,
        count: products.filter(p => 
          p.usageMethods && p.usageMethods.includes(method)
        ).length
      }))
    ];
  };

  const getProductProperties = (product) => {
    if (!product.therapeuticProperties) return [];
    return Array.isArray(product.therapeuticProperties) 
      ? product.therapeuticProperties 
      : [product.therapeuticProperties];
  };

  const getProductUsageMethods = (product) => {
    if (!product.usageMethods) return [];
    return Array.isArray(product.usageMethods) 
      ? product.usageMethods 
      : [product.usageMethods];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex-col pt-16 bg-[#F6F8FA] flex items-center justify-center">
        <img src="/loading.gif" alt="" />
        <p className="mt-4 text-black">Chargement des huiles essentielles...</p>
      </div>
    );
  }

  // Filtrer les produits selon la recherche
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.botanicalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.therapeuticProperties && product.therapeuticProperties.some(prop => 
      prop.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  // Appliquer le filtre par propriété
  const finalFilteredProducts = selectedProperty === 'tous'
    ? filteredProducts
    : filteredProducts.filter(product => 
        product.therapeuticProperties && 
        product.therapeuticProperties.includes(selectedProperty)
      );

  const propertyCategories = getUniqueProperties();
  const usageCategories = getUniqueUsageMethods();

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full bg-[#556B2F]/90'></div>
          <img src="https://images.unsplash.com/photo-1601524909163-991bd9a5fead?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
               className='h-full object-cover w-full' 
               alt="Huiles essentielles" />
        </div>
        <div className="mb-2">
          <div className="flex flex-col gap-5 justify-between items-center">
            <div className="flex flex-col items-center gap-5">
              <h2 className="text-xl lg:text-5xl font-bold text-white tracking-widest">
                HUILES ESSENTIELLES
              </h2>
              <p className="text-white text-xs lg:text-sm text-center">
                Des extraits purs de plantes pour votre bien-être naturel
              </p>
            </div>

            {/* Badges d'information */}
            <div className="hidden md:flex gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-lg border border-white/40">
                <Droplets className="h-3 w-3 text-white" />
                <span className="text-xs font-semibold text-white">100% Pur</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-lg border border-white/40">
                <Leaf className="h-3 w-3 text-white" />
                <span className="text-xs font-semibold text-white">Biologique</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-lg border border-white/40">
                <ShieldCheck className="h-3 w-3 text-white" />
                <span className="text-xs font-semibold text-white">Certifié</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-3xl p-6 border border-[#D3D3D3]">
          {/* Barre de recherche */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B4513]" />
              <input
                type="text"
                placeholder="Rechercher une huile essentielle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#D3D3D3] focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#6B8E23]/10 rounded-lg p-4 text-center border border-[#D3D3D3]">
              <p className="text-2xl font-bold text-[#556B2F]">{products.length}</p>
              <p className="text-sm text-black">Huiles disponibles</p>
            </div>
            <div className="bg-[#6B8E23]/10 rounded-lg p-4 text-center border border-[#D3D3D3]">
              <p className="text-2xl font-bold text-[#556B2F]">
                {products.filter(p => p.isOrganic).length}
              </p>
              <p className="text-sm text-black">Certifiées Bio</p>
            </div>
            <div className="bg-[#6B8E23]/10 rounded-lg p-4 text-center border border-[#D3D3D3]">
              <p className="text-2xl font-bold text-[#556B2F]">
                €{products.reduce((sum, p) => sum + (p.comparePrice || p.price), 0).toFixed(2)}
              </p>
              <p className="text-sm text-black">Valeur totale</p>
            </div>
            <div className="bg-[#6B8E23]/10 rounded-lg p-4 text-center border border-[#D3D3D3]">
              <p className="text-2xl font-bold text-[#556B2F]">
                {Math.round(products.reduce((sum, p) => sum + p.quantity, 0) / products.length)}
              </p>
              <p className="text-sm text-black">Stock moyen</p>
            </div>
          </div>

          {/* Filtrage par propriétés thérapeutiques */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-[#8B4513]">Propriétés thérapeutiques</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {propertyCategories.map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedProperty === prop.id
                    ? 'bg-[#556B2F] text-white'
                    : 'bg-[#FFFFFF] text-black border border-[#D3D3D3] hover:bg-[#6B8E23]/10'
                    }`}
                >
                  {prop.name}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${selectedProperty === prop.id
                    ? 'bg-[#6B8E23] text-white'
                    : 'bg-[#D3D3D3] text-black'
                    }`}>
                    {prop.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Liste des méthodes d'utilisation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-[#8B4513]">Méthodes d'utilisation</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {usageCategories.map((method) => (
                <Badge
                  key={method.id}
                  variant="outline"
                  className="px-3 py-1 rounded-full text-sm bg-[#6B8E23]/10 text-black border border-[#6B8E23]/20"
                >
                  {method.name}
                  <span className="ml-1 text-xs bg-[#556B2F]/20 text-black px-1.5 py-0.5 rounded-full">
                    {method.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Liste des produits */}
          {finalFilteredProducts && finalFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredProducts.map((product) => {
                const properties = getProductProperties(product);
                const usageMethods = getProductUsageMethods(product);

                return (
                  <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow group border border-[#D3D3D3]">
                    {product.images && product.images.length > 0 ? (
                      <div className="relative">
                        <div
                          className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                          style={{ backgroundImage: `url(${product.images[0]})` }}
                        />
                        {/* Badges sur l'image */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
                          {product.isOrganic && (
                            <Badge className="bg-[#556B2F] text-white w-fit">
                              <Leaf className="h-3 w-3 mr-1" />
                              Bio
                            </Badge>
                          )}
                          {product.purityLevel && (
                            <Badge className="bg-[#8B4513] text-white w-fit">
                              <Droplets className="h-3 w-3 mr-1" />
                              {product.purityLevel}
                            </Badge>
                          )}
                          {product.featured && (
                            <Badge className="bg-amber-500 text-white w-fit">
                              <Star className="h-3 w-3 mr-1" />
                              Vedette
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-[#6B8E23]/10 rounded-lg mb-4 flex items-center justify-center border border-[#D3D3D3]">
                        <Flower className="h-12 w-12 text-[#556B2F]/40" />
                      </div>
                    )}

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#556B2F] transition-colors text-[#8B4513]">
                      {product.name}
                    </h3>

                    {product.botanicalName && (
                      <p className="text-sm italic text-black mb-2">
                        {product.botanicalName}
                      </p>
                    )}

                    <p className="text-black text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Propriétés thérapeutiques */}
                    {properties.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-black mb-1">Propriétés:</p>
                        <div className="flex flex-wrap gap-1">
                          {properties.slice(0, 3).map((prop, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-[#6B8E23]/10 text-black border border-[#6B8E23]/20"
                            >
                              {prop}
                            </Badge>
                          ))}
                          {properties.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-[#556B2F]/10 text-black border border-[#556B2F]/20"
                            >
                              +{properties.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Méthodes d'utilisation */}
                    {usageMethods.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-black mb-1">Utilisation:</p>
                        <div className="flex flex-wrap gap-1">
                          {usageMethods.slice(0, 2).map((method, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-[#8B4513]/10 text-black border border-[#8B4513]/20"
                            >
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Informations supplémentaires */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-black">
                      {product.extractionMethod && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-[#556B2F]" />
                          <span className="text-xs">{product.extractionMethod}</span>
                        </div>
                      )}
                      {product.origin && (
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-[#556B2F]" />
                          <span className="text-xs">{product.origin}</span>
                        </div>
                      )}
                    </div>

                    {/* Prix et stock */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-[#556B2F]">
                          €{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-black line-through ml-2">
                            €{product.comparePrice.toFixed(2)}
                          </span>
                        )}
                        {product.volume && (
                          <span className="text-sm text-black ml-1">
                            / {product.volume}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant={product.quantity > 0 ? "default" : "destructive"}
                        className={product.quantity > 0 ? "bg-[#556B2F]" : ""}
                      >
                        {product.quantity > 0 ? "En stock" : "Rupture"}
                      </Badge>
                    </div>

                    {/* Allergènes */}
                    {product.allergens && product.allergens.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-black mb-1">Précautions:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.allergens.map((allergen, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-amber-50 text-black border border-amber-200"
                            >
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.vendor?.companyName && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-black">
                        <Sparkles className="h-4 w-4 text-[#556B2F]" />
                        <span>{product.vendor.companyName}</span>
                      </div>
                    )}

                    {/* Bouton Ajouter au panier */}
                    <Button
                      className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white border border-[#556B2F]"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0 || addingProductId === product.id}
                    >
                      {addingProductId === product.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Ajout...
                        </div>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.quantity > 0 ? "Ajouter au panier" : "Rupture de stock"}
                        </>
                      )}
                    </Button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Droplets className="h-16 w-16 text-[#8B4513] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#8B4513]">Aucune huile essentielle trouvée</h3>
              <p className="text-black mb-6">
                {searchQuery
                  ? `Aucune huile essentielle ne correspond à "${searchQuery}"`
                  : 'Aucune huile essentielle disponible pour le moment.'}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  className="bg-[#556B2F] hover:bg-[#6B8E23] text-white border border-[#556B2F]"
                >
                  Réinitialiser la recherche
                </Button>
              )}
            </div>
          )}

          {/* Section Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#6B8E23]/10 rounded-xl p-4 text-center border border-[#D3D3D3]">
              <Droplets className="h-8 w-8 text-[#556B2F] mx-auto mb-2" />
              <h4 className="font-semibold text-[#8B4513]">100% Pur</h4>
              <p className="text-sm text-black">
                Huiles essentielles pures non diluées
              </p>
            </div>
            <div className="bg-[#6B8E23]/10 rounded-xl p-4 text-center border border-[#D3D3D3]">
              <Leaf className="h-8 w-8 text-[#556B2F] mx-auto mb-2" />
              <h4 className="font-semibold text-[#8B4513]">Biologique</h4>
              <p className="text-sm text-black">
                Issue de l'agriculture biologique
              </p>
            </div>
            <div className="bg-[#6B8E23]/10 rounded-xl p-4 text-center border border-[#D3D3D3]">
              <Zap className="h-8 w-8 text-[#556B2F] mx-auto mb-2" />
              <h4 className="font-semibold text-[#8B4513]">Distillation</h4>
              <p className="text-sm text-black">
                Extraction par vapeur d'eau
              </p>
            </div>
            <div className="bg-[#6B8E23]/10 rounded-xl p-4 text-center border border-[#D3D3D3]">
              <ShieldCheck className="h-8 w-8 text-[#556B2F] mx-auto mb-2" />
              <h4 className="font-semibold text-[#8B4513]">Testées</h4>
              <p className="text-sm text-black">
                Analyses chromatographiques
              </p>
            </div>
          </div>

          {/* Section Conseils d'utilisation */}
          <div className="mt-8 p-6 bg-[#6B8E23]/5 rounded-xl border border-[#D3D3D3]">
            <h3 className="text-lg font-semibold mb-4 text-[#8B4513]">Conseils d'utilisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#556B2F] rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Précautions</h4>
                  <p className="text-sm text-black">Toujours diluer avant application cutanée</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#556B2F] rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Femmes enceintes</h4>
                  <p className="text-sm text-black">Consulter un professionnel avant utilisation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#556B2F] rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Conservation</h4>
                  <p className="text-sm text-black">À l'abri de la lumière et de la chaleur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuilesEssentielles;