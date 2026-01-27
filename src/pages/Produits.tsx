// pages/Produits.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EquipementSection from "@/components/produits/EquipementSection";
import MateriauxSection from "@/components/produits/MateriauxSection";
import DesignSection from "@/components/produits/DesignSection";
import '/fonts/Azonix.otf';
import {
  Search,
  Sparkles,
  Shield,
  Zap,
  X,
  Phone,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { default as ProductCard } from "@/components/ProductCard";
import api from "@/lib/api";
import { useProduitsTracking } from '@/hooks/useProduitsTracking';
import AdvertisementPopup from '@/components/AdvertisementPopup';
import Allpub from '@/components/Allpub';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

interface FetchProductsParams {
  status: string;
  category?: string;
  search?: string;
}

// Composant Contact Modal
const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0A0A0A]">
            {type === "contact" ? "Contactez-nous" : "Prendre rendez-vous"}
          </h2>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#0052FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {type === "contact" ? (
                <Phone className="h-8 w-8 text-[#0052FF]" />
              ) : (
                <Calendar className="h-8 w-8 text-[#00C2A8]" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2">
              {type === "contact" ? "Service Client" : "Consultation Expert"}
            </h3>
            <p className="text-[#5A6470]">
              {type === "contact"
                ? "Notre équipe est disponible pour répondre à toutes vos questions."
                : "Planifiez une visite avec nos experts pour votre projet."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <Phone className="h-5 w-5 text-[#0052FF]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  +33 1 23 45 67 89
                </p>
                <p className="text-sm text-[#5A6470]">Lun-Ven 9h-18h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <MapPin className="h-5 w-5 text-[#0052FF]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  123 Avenue des Champs
                </p>
                <p className="text-sm text-[#5A6470]">75008 Paris</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <Clock className="h-5 w-5 text-[#0052FF]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">Ouverture</p>
                <p className="text-sm text-[#5A6470]">Lun-Sam 9h-19h</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1 bg-[#0052FF] hover:bg-[#003EE6] text-white"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open("tel:+33123456789");
                }
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Appeler maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Produits = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState("contact");
  const [products, setProducts] = useState<Product[]>([]);

  // Intégration du hook de tracking
  const {
    trackProduitsView,
    trackProductView,
    trackProductClick,
    trackAddToCart,
    trackProductSearch,
    trackProductFilter,
    trackCategoryClick
  } = useProduitsTracking();

  // Track de la vue de la page produits
  useEffect(() => {
    trackProduitsView();
  }, [trackProduitsView]);

  const { user } = useAuth();
  const { addToCart } = useCart(user);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tracking de la recherche
    trackProductSearch(searchQuery);

    try {
      setIsLoading(true);
      const params: FetchProductsParams = {
        status: 'active',
        search: searchQuery
      };

      const response = await api.get('/products', { params });
      setProducts(response.data.products);

      // Track des vues de produits individuels
      response.data.products.forEach((product: Product) => {
        trackProductView(product.id.toString(), product.name, product.category || 'unknown');
      });
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de l'ajout au panier avec tracking
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    trackAddToCart(product.id.toString(), product.name, product.category || 'unknown');
  };

  // Gestion du clic sur un produit avec tracking
  const handleProductClick = (product: Product) => {
    trackProductClick(product.id.toString(), product.name, product.category || 'unknown');
    // Navigation vers la page détail du produit si nécessaire
    // navigate(`/produits/${product.id}`);
  };

  const handleContactClick = (type: string) => {
    setContactModalType(type);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen relative pt-16 overflow-hidden bg-[#F6F8FA]">
      {/* Background Image avec overlay */}
      {/* Advertisement Popup - Absolute Position */}
      <div className="absolute top-12 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>

      <div className="fixed w-1/2 bottom-0 right-4 z-50">
        <AdvertisementPopup />
      </div>
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#F6F8FA]/50 to-[#F6F8FA]/30 z-1" />

      {/* Éléments décoratifs animés */}
      <div className="absolute top-20 left-10 animate-float z-2">
        <Sparkles className="h-8 w-8 text-[#0052FF]/30" />
      </div>
      <div
        className="absolute top-40 right-20 animate-float z-2"
        style={{ animationDelay: "1s" }}
      >
        <Shield className="h-6 w-6 text-[#00C2A8]/30" />
      </div>
      <div
        className="absolute bottom-40 left-20 animate-float z-2"
        style={{ animationDelay: "2s" }}
      >
        <Zap className="h-5 w-5 text-[#0052FF]/30" />
      </div>

      <div className="relative z-10">
        <section className="container mx-auto px-4 py-8">
          {/* En-tête avec animation */}
          <div className="bg-white py-5 rounded-lg">
            <div className="text-center mb-5 animate-fade-in">
              <h1 className="tracking-widest text-xl lg:text-5xl md:text-4xl font-medium mb-4 text-logo uppercase">
                Produits & Accessoires
              </h1>
              <p className="text-sm px-2 lg:text-md text-[#5A6470] max-w-2xl mx-auto leading-relaxed">
                Découvrez notre gamme complète pour équiper et embellir votre maison
              </p>
            </div>

            {/* Barre de recherche améliorée
            <form
              onSubmit={handleSearch}
              className="relative mb-5 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-2"
            >
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="RECHERCHER UN PRODUIT, UNE CATÉGORIE..."
                  className="w-full h-12 sm:h-14 lg:h-16 pl-10 sm:pl-12 lg:pl-16 pr-16 sm:pr-32 lg:pr-8 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm lg:text-lg text-start font-semibold tracking-wide transition-all duration-300 group-hover:shadow-sm border-[#0052FF]/30 bg-white/80 backdrop-blur-md focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Search className="absolute left-3 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#0052FF] transition-transform duration-300 group-hover:scale-110 group-focus-within:scale-110" />

                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 sm:h-11 lg:h-12 px-3 sm:px-4 lg:px-6 bg-[#0052FF] hover:bg-[#003EE6] text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Rechercher</span>
                      <Search className="sm:hidden h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form> */}
          </div>

         

          {/* Affichage des résultats de recherche */}
          {searchQuery && products.length > 0 && (
            <div className="mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Résultats pour "{searchQuery}"</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onProductClick={handleProductClick}
                    user={user}
                  />
                ))}
              </div>
            </div>
          )}

           <Allpub
            title="Offres spéciales"
            description="Bénéficiez de réductions exclusives sur nos meilleurs services."
            image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
            background="bg-white"
            textbg="text-slate-900"
          />

          {/* Sections avec props de tracking */}
          <EquipementSection
            searchQuery={searchQuery}
            onCategoryClick={trackCategoryClick}
          />
          <MateriauxSection
            searchQuery={searchQuery}
            onCategoryClick={trackCategoryClick}
          />
          <DesignSection
            searchQuery={searchQuery}
            onCategoryClick={trackCategoryClick}
          />

           <Allpub
            title="Offres spéciales"
            description="Bénéficiez de réductions exclusives sur nos meilleurs services."
            image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
            background="bg-white"
            textbg="text-slate-900"
          />

          {/* Section CTA */}
          <div
            className="text-center animate-bounce-in"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 lg:p-12 border border-white/20 shadow-2xl">
              <h3 className="text-xl lg:text-3xl font-bold text-gray-700 mb-4">
                Vous ne trouvez pas ce que vous cherchez ?
              </h3>
              <p className="text-sm lg:text-xl text-[#5A6470] mb-8 max-w-2xl mx-auto">
                Notre équipe d'experts est là pour vous accompagner dans tous vos projets
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  className="bg-[#0052FF] hover:bg-[#003EE6] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta"
                  onClick={() => handleContactClick("contact")}
                >
                  Contactez-nous
                </Button>
                <Button
                  className="bg-[#00C2A8] hover:bg-[#00A890] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta"
                  style={{ animationDelay: "0.5s" }}
                  onClick={() => handleContactClick("rdv")}
                >
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de contact seulement */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type={contactModalType}
      />
    </div>
  );
};

export default Produits;