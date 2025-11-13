import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Immobilier from "./pages/Immobilier";
import CategorieProduits from "./components/CategorieProduits";
import BienEtre from "./pages/bien_etre";
import Travaux from "./pages/Travaux";
import Produits from "./pages/Produits";
import ProduitsGeneraux from "./components/produits/ProduitsGeneraux";
import ServicesMaison from "./components/produits/ServiceMaison";
import Entreprise from "./pages/Entreprise";
import Financement from "./pages/Financement";
import Actualites from "./pages/Actualites";
import RegisterPage from "./pages/Register";
import ProRegisterPage from "./pages/ProRegisterPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import TourismSection from "./pages/Tourisme";
import EstimationImmobilierPage from "./pages/EstimationImmobilierPage";
import Index from "./pages/Index";
import Podcast from "./pages/podcast";
import ProLayout from "./pages/pro/ProLayout";
import Dashboard from "./pages/pro/Dashboard";
import ListingsPage from "./pages/pro/ListingsPage";
import CalendarPage from "./pages/pro/CalendarPage";
import ServicesPartnersPage from './pages/ServicesPartnersPage';
import ClientSection from "./pages/pro/ClientSection";
import DocumentsPage from "./pages/pro/DocumentsPage";
import ReviewsPage from "./pages/pro/ReviewsPage";
import TourismPage from "./pages/pro/TourismPage";
import BillingSection from "./pages/pro/BillingSection";
import ParametresPage from "./pages/pro/ParametresPage";
import ArtisanDemandesPage from "./pages/pro/ArtisanDemandesPage";
import ListeDemandesImmobilier from "./pages/pro/ListeDemandesImmobilier";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Blog from "./pages/admin/Blog";
import Bookings from "./pages/admin/Bookings";
import Listings from "./pages/admin/Listings";
import Payements from "./pages/admin/Payements";
import Products from "./pages/admin/Products";
import Profile from "./pages/admin/Profile";
import Reports from "./pages/admin/Reports";
import Services from "./pages/admin/Services";
import Settings from "./pages/admin/Settings";
import Tourism from "./pages/admin/Tourism";
import Users from "./pages/admin/Users";
import Vendors from "./pages/admin/Vendors";
import AdminMetiers from "./pages/admin/AdminMetiers";
import ListeDemande from "./pages/admin/ListeDemande";
import MonComptePage from "./pages/mon-compte/MonComptePage";
import PaiementPage from "./pages/mon-compte/PaiementPage";
import ReservationPage from "./pages/mon-compte/ReservationPage";
import MesDemande from "./pages/mon-compte/MesDemande";
import MesDemandesImmobilier from "./pages/mon-compte/MesDemandesImmobilier";
import PropertyPage from "./pages/PropertyPage";
import MessagesLayout from "./pages/MessagesLayout";
import { useEffect } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import ScrollToTop from "./ScrollToTop";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import UnauthorizedPage from "./pages/Unauthorized";
import ProfessionalServicesPage from "./pages/pro/ProfessionalServicesPage";
import Investissement from "./components/Investissement/investissement";
import ArtCommerce from "./pages/ArtCommerce";
import ArtCommerceDetail from "./pages/ArtCommerceDetail";
import HarmoniePage from "./pages/pro/HarmoniePage";
import RoleSelectionPage from "./pages/RoleSelectionPage ";
import ProfessionalSubscriptionPage from "./pages/ProfessionalSubscriptionPage";
import DroitFamille from "./components/DroitFamille";
import GestionImmobilier from "./components/GestionImmobilier";
import Publicite from "./pages/Publicite";
import LoginRoleSelectionPage from "./pages/LoginRoleSelectionPage";
import SuccessPage from "./pages/SuccessPage";
import PaymentPage from "./pages/PaymentPage";
import ProLogin from "./pages/auth/ProLogin";
import ParticularLogin from "./pages/auth/ParticularLogin";
import InvestissementDetail from "./pages/InvestissementDetail";
import { CartProvider } from "./components/contexts/CartContext";
import ProOrders from "./components/pro/ProOrders";
import Alimentation from "./pages/Alimentation";
import AlimentationCategorie from "./pages/AlimentationCategorie";
import ServiceCategoriesPage from "./pages/admin/ServiceCategoriesPage";
import UserOrders from "./components/orders/UserOrders";
import ListeDemandesDevis from "./pages/pro/ListeDemandesDevis";
import CookieConsent from "./components/CookieConsent";
import CookiesPolicy from "./pages/CookiesPolicy";
import FinancementDemandes from "./pages/admin/FinancementDemandes";
import { ToastContainer } from "react-toastify";
import ArtCommerceService from "./pages/pro/ArtCommerceService";
import { SocketProvider } from "./contexts/SocketContext";
import { useAuth } from "./hooks/useAuth";
import AdminBookings from "./components/admin/tourism/AdminBookings";
import Recherche from "./pages/Recherche";
import "leaflet/dist/leaflet.css";
//tracking page
import GlobalTracking from "@/components/GlobalTracking";

//import TestPage from "./pages/TestPage";
import AdvertisementManager from "./components/admin/AdvertisementManager";
import AdvertisementPopup from "./components/AdvertisementPopup";

// Import des nouveaux composants immobilier
import AuditPatrimonial from "./pages/immobilier/AuditPatrimonial";

// Import des composants bâtiments
import BatimentsLayout from "./pages/batiments/BatimentsLayout";
import RenovationChantiers from "./pages/batiments/RenovationChantiers";

// Import des composants domicile
import DomicileLayout from "./pages/domicile/DomicileLayout";
import ImmobilierSections from "./components/ImmobilierSections";
import StripeConnectButton from "./pages/CreateStripeAccount";
import RGPDInfo from "@/pages/RGPDInfo";
import ImportInfo from "@/pages/ImportInfo";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import CreationReprise from "./components/components/CreationReprise";
import AuditMediation from "./components/components/AuditMediation";
import AidesLeveesFonds from "./components/components/AideFonds";
import JuridiqueLiquidation from "./components/components/JuridiqueLiquidation";
import PodcastsServices from "./components/components/Podcast_services";
import FormationsTourisme from "./components/components/ToursimeFormation";
import ActivitesLoisirsFAQ from "./components/components/ActiviteLoisirs";
import AdminMedia from "./pages/pro/adminMedia";
import ProfessionalProfilePage from "./pages/ProfessionalProfilePage";
import UtilitiesProduits from "./components/produits/UtilitiesProduits";

import AuditsPage from "./pages/admin/AdminAuditPage";
const queryClient = new QueryClient();

const ScrollToHash = () => {
  const location = useLocation();
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace("#", ""));
      let attempts = 0;
      const maxAttempts = 20;
      const timer = setInterval(() => {
        attempts++;
        const el = document.getElementById(id);
        if (el) {
          scrollToSection(id);
          clearInterval(timer);
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash, scrollToSection]);

  return null;
};

const App = () => {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      return;
    }
    console.log("User ID for Socket Connection:", user.id);
  }, [user]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SocketProvider userId={user?.id}>
          <CartProvider>
            <Toaster />
            <ToastContainer />
            <Sonner />
            <BrowserRouter>
              {/* Intégration du GlobalTracking pour le tracking des pages */}
              <GlobalTracking />

              <ScrollToHash />
              <ScrollToTop />
              <Layout>
                <Routes>
                  {/* Section publiques Routes */}
                  <Route path="/services-partners" element={<ServicesPartnersPage />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/bien-etre" element={<BienEtre />} />
                  <Route path="/cookies" element={<CookiesPolicy />} />
                   <Route path="/podcasts" element={<Podcast />} /> 
                  <Route path="/immobilier" element={<Immobilier />} />
                  <Route path="/droitFamille" element={<DroitFamille />} />
                  {/* /*entreprise link* */}
                  <Route path="/reprise" element={<CreationReprise />} />
                  <Route path="/auditMediation" element={<AuditMediation />} />
                  <Route path="/aideFonds" element={<AidesLeveesFonds />} />
                  <Route
                    path="/juridiqueLiquidation"
                    element={<JuridiqueLiquidation />}
                  />
                  <Route
                    path="/podcast_service"
                    element={<PodcastsServices />}
                  />
                  <Route
                    path="/formationTourisme"
                    element={<FormationsTourisme />}
                  />
                  <Route
                    path="/activiteLoisirs"
                    element={<ActivitesLoisirsFAQ />}
                  />
                  <Route
                    path="/professional/:id"
                    element={<ProfessionalProfilePage />}
                  />
                  {/* /*entreprise link* */}
                  <Route
                    path="/immobilier-sections"
                    element={<ImmobilierSections />}
                  />
                  <Route
                    path="/estimation-immobilier"
                    element={<EstimationImmobilierPage />}
                  />
                  <Route
                    path="/gestion-immobilier"
                    element={<GestionImmobilier />}
                  />
                  {/* Routes Bâtiments */}
                  <Route path="/batiments" element={<BatimentsLayout />} />
                  <Route
                    path="/renovation-chantiers"
                    element={<BatimentsLayout />}
                  />
                  <Route
                    path="/construction-plans"
                    element={<BatimentsLayout />}
                  />
                  <Route
                    path="/materiaux-viabilisations"
                    element={<BatimentsLayout />}
                  />
                  <Route
                    path="/division-parcellaire"
                    element={<BatimentsLayout />}
                  />
                  <Route
                    path="/formation-podcasts"
                    element={<BatimentsLayout />}
                  />
                  {/* Routes Domicile */}
                  <Route path="/domicile" element={<DomicileLayout />} />
                  <Route
                    path="/produits-commerces"
                    element={<DomicileLayout />}
                  />
                  <Route path="/service-maison" element={<DomicileLayout />} />
                  <Route
                    path="/equipements-livraison"
                    element={<DomicileLayout />}
                  />
                  <Route
                    path="/design-decoration"
                    element={<DomicileLayout />}
                  />
                  <Route
                    path="/cours-formations"
                    element={<DomicileLayout />}
                  />
                  <Route path="/utilities" element={<DomicileLayout />} />
                  <Route
                    path="/gestion-immobilier"
                    element={<GestionImmobilier />}
                  />
                  <Route path="/recherche" element={<Recherche />} />
                  <Route path="/immobilier/:id" element={<PropertyPage />} />
                  <Route path="/travaux" element={<Travaux />} />
                  <Route path="/produits" element={<Produits />} />
                  <Route path="/produits-generaux" element={<ProduitsGeneraux />} />
                  <Route path="/services-maison" element={<ServicesMaison />} />
                  <Route path="/utilitie" element={<UtilitiesProduits />} />

                  <Route
                    path="/stripe-create"
                    element={<StripeConnectButton user={user} />}
                  />
                  <Route path="/alimentation" element={<Alimentation />} />
                  <Route
                    path="/alimentation/food-category/:categoryName"
                    element={<AlimentationCategorie />}
                  />
                  <Route
                    path="/produits/categorie/:categoryName"
                    element={<CategorieProduits />}
                  />
                  <Route path="/entreprise" element={<Entreprise />} />
                  <Route path="/financement" element={<Financement />} />
                  <Route path="/actualites" element={<Actualites />} />
                  <Route path="/tourisme" element={<TourismSection />} />
                  {/* Add redirect from /service to /services-partners */}
                  <Route
                    path="/service"
                    element={<Navigate to="/services-partners" replace />}
                  />
                  <Route
                    path="/services-partners"
                    element={<ServicesPartnersPage />}
                  />
                  {/* <Route path="/publicite" element={<Publicite />} /> */}
                  <Route
                    path="/estimations"
                    element={<EstimationImmobilierPage />}
                  />
                  {/* singular routes for legacy links <Route path="/publicite" element={<Publicite />} />*/}
                  <Route path="/login" element={<LoginRoleSelectionPage />} />
                  <Route path="/login/professional" element={<ProLogin />} />
                  <Route
                    path="/login/particular"
                    element={<ParticularLogin />}
                  />
                  <Route path="/register" element={<RoleSelectionPage />} />
                  <Route
                    path="/register/professional/subscription"
                    element={<ProfessionalSubscriptionPage />}
                  />
                  <Route
                    path="/register/professional"
                    element={
                      <Navigate
                        to="/register/professional/subscription"
                        replace
                      />
                    }
                  />
                  <Route
                    path="/register/professional/payment"
                    element={<PaymentPage />}
                  />
                  <Route
                    path="/register/professional/form"
                    element={<ProRegisterPage />}
                  />
                  <Route path="/register/success" element={<SuccessPage />} />
                  <Route
                    path="/register/particular"
                    element={<RegisterPage />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/investissement" element={<Investissement />} />
                  <Route path="/art-commerce" element={<ArtCommerce />} />
                  <Route
                    path="/art-commerce/:id"
                    element={<ArtCommerceDetail />}
                  />
                  <Route
                    path="/investir/:type"
                    element={<InvestissementDetail />}
                  />
                  {/* Section pro Routes */}
                  <Route path="/pro" element={<ProLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="listings" element={<ListingsPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    {/* <Route path="clients" element={<ClientSection />} /> */}
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="tourisme" element={<TourismPage />} />
                    <Route path="reservations" element={<AdminBookings />} />
                    <Route
                      path="services"
                      element={<ProfessionalServicesPage />}
                    />
                    <Route
                      path="Art-commerce-services"
                      element={<ArtCommerceService />}
                    />
                    <Route path="billing" element={<BillingSection />} />
                    <Route path="settings" element={<ParametresPage />} />
                    <Route
                      path="Art-commerce-services"
                      element={<ParametresPage />}
                    />
                    <Route path="orders" element={<ProOrders />} />
                    <Route
                      path="demandes-immobilier"
                      element={<ListeDemandesImmobilier />}
                    />
                    <Route path="products" element={<Products />} />
                    <Route path="demandes" element={<ArtisanDemandesPage />} />
                    <Route path="messages/:id" element={<MessagesLayout />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="harmonie" element={<HarmoniePage />} />
                    <Route
                      path="demandes-devis"
                      element={<ListeDemandesDevis />}
                    />

                    <Route path="media" element={<AdminMedia />} />

                  </Route>
                  {/* Section Mon Compte Routes */}
                  <Route path="/mon-compte">
                    <Route index element={<MonComptePage />} />
                    <Route path="payement" element={<PaiementPage />} />
                    <Route path="profil" element={<MonComptePage />} />
                    <Route path="reservation" element={<ReservationPage />} />
                    <Route path="demandes" element={<MesDemande />} />
                    <Route
                      path="demandes/messages/:id"
                      element={<MessagesLayout />}
                    />
                    <Route
                      path="demandes-immobilier"
                      element={<MesDemandesImmobilier />}
                    />
                    <Route path="mes-commandes" element={<UserOrders />} />
                  </Route>
                  {/* Section Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="listings" element={<Listings />} />
                    <Route path="audits" element={<AuditsPage />} />
                    <Route path="payments" element={<Payements />} />
                    <Route path="products" element={<Products />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="services" element={<Services />} />
                    <Route path="tourism" element={<Tourism />} />
                    <Route path="users" element={<Users />} />
                    <Route path="vendors" element={<Vendors />} />
                    <Route path="messages/:id" element={<MessagesLayout />} />
                    <Route
                      path="publicite"
                      element={<AdvertisementManager />}
                    />

                    <Route path="demandes" element={<ListeDemande />} />

                    <Route
                      path="service-categories"
                      element={<ServiceCategoriesPage />}
                    />
                    <Route path="metiers" element={<AdminMetiers />} />

                    {/* NOUVELLE ROUTE FINANCEMENT DEMANDES */}
                    <Route
                      path="financement-demandes"
                      element={<FinancementDemandes />}
                    />
                  </Route>
                  {/* Section not found Routes */}
                  <Route path="*" element={<NotFound />} />
                  <Route path="/en-savoir-plus" element={<RGPDInfo />} />
                  <Route path="/import-info" element={<ImportInfo />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                </Routes>
                {/* -------------------------
                   Pop-up publicité globale
                   ------------------------- */}
                {user && user.role !== "admin" && (
                  <AdvertisementPopup refreshMinutes={3} />
                )}
                <CookieConsent />
              </Layout>
            </BrowserRouter>
          </CartProvider>
        </SocketProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
