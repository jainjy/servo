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
import Entreprise from "./pages/Entreprise";
import Financement from "./pages/Financement";
import Actualites from "./pages/Actualites";
import RegisterPage from "./pages/Register";
import ProRegisterPage from "./pages/ProRegisterPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import TourismSection from "./pages/Tourisme";
import ServicesPartnersPage from "./pages/ServicesPartnersPage";
import EstimationImmobilierPage from "./pages/EstimationImmobilierPage";
import Index from "./pages/Index";
import Podcast from "./pages/podcast";
import ProLayout from "./pages/pro/ProLayout";
import Dashboard from "./pages/pro/Dashboard";
import ListingsPage from "./pages/pro/ListingsPage";
import CalendarPage from "./pages/pro/CalendarPage";
import ClientSection from "./pages/pro/ClientSection";
import DocumentsPage from "./pages/pro/DocumentsPage";
import ReviewsPage from "./pages/pro/ReviewsPage";
import TourismPage from "./pages/pro/TourismPage";
import BillingSection from "./pages/pro/BillingSection";
import ParametresPage from "./pages/pro/ParametresPage";
import ArtisanDemandesPage from "./pages/pro/ArtisanDemandesPage";
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
import ProfilPage from "./pages/mon-compte/ProfilPage";
import ReservationPage from "./pages/mon-compte/ReservationPage";
import MesDemande from "./pages/mon-compte/MesDemande";
import DemandeMessage from "./pages/mon-compte/DemandeMessage";
import PropertyPage from "./pages/PropertyPage";
import MessagesLayout from "./pages/MessagesLayout";
import ProMessage from "./pages/pro/ProMessage";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Section publiques Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/bien-etre" element={<BienEtre />} />
              <Route path="/podcasts" element={<Podcast />} />
              <Route path="/immobilier" element={<Immobilier />} />
              <Route path="/droitFamille" element={<DroitFamille />} />
              <Route path="/gestion-immobilier" element={<GestionImmobilier />} />
              <Route path="/immobilier/:id" element={<PropertyPage />} />
              <Route path="/travaux" element={<Travaux />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/produits/categorie/:categoryName" element={<CategorieProduits />} />
              <Route path="/entreprise" element={<Entreprise />} />
              <Route path="/financement" element={<Financement />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/tourisme" element={<TourismSection />} />
              <Route path="/service" element={<ServicesPartnersPage />} />
              <Route path="/publicite" element={<Publicite />} />
              <Route path="/estimations" element={<EstimationImmobilierPage />} />
              <Route path="/messages/:id" element={<MessagesLayout />} />
              {/* singular routes for legacy links */}
              <Route path="/message" element={<MessagesLayout />} />
              <Route path="/message/:id" element={<MessagesLayout />} />
              <Route path="/login" element={<LoginRoleSelectionPage />} />
              <Route path="/login/professional" element={<ProLogin />} />
              <Route path="/login/particular" element={<ParticularLogin />} />
              <Route path="/register" element={<RoleSelectionPage />} />
              <Route
                path="/register/professional/subscription"
                element={<ProfessionalSubscriptionPage />}
              />
              <Route
                path="/register/professional"
                element={
                  <Navigate to="/register/professional/subscription" replace />
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
              <Route path="/register/particular" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/investissement" element={<Investissement />} />
              <Route path="/art-commerce" element={<ArtCommerce />} />
              <Route path="/art-commerce/:id" element={<ArtCommerceDetail />} />
              <Route path="/investir/:type" element={<InvestissementDetail />} />
              {/* Section pro Routes */}
              <Route path="/pro" element={<ProLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="listings" element={<ListingsPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="clients" element={<ClientSection />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="tourisme" element={<TourismPage />} />
                <Route path="services" element={<ProfessionalServicesPage />} />
                <Route path="billing" element={<BillingSection />} />
                <Route path="settings" element={<ParametresPage />} />
                <Route path="products" element={<Products />} />
                <Route path="demandes" element={<ArtisanDemandesPage />} />
                <Route path="message" element={<ProMessage />} />
                <Route path="message/:id" element={<ProMessage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="harmonie" element={<HarmoniePage />} />
              </Route>
              {/* Section Mon Compte Routes */}
              <Route path="/mon-compte">
                <Route index element={<MonComptePage />} />
                <Route path="payement" element={<PaiementPage />} />
                <Route path="profil" element={<ProfilPage />} />
                <Route path="reservation" element={<ReservationPage />} />
                <Route path="demandes" element={<MesDemande />} />
                <Route path="demandes/message" element={<DemandeMessage />} />
              </Route>
              {/* Section Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="blog" element={<Blog />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="listings" element={<Listings />} />
                <Route path="payments" element={<Payements />} />
                <Route path="products" element={<Products />} />
                <Route path="profile" element={<Profile />} />
                <Route path="reports" element={<Reports />} />
                <Route path="services" element={<Services />} />
                <Route path="settings" element={<Settings />} />
                <Route path="tourism" element={<Tourism />} />
                <Route path="users" element={<Users />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="demandes" element={<ListeDemande />} />
                <Route path="metiers" element={<AdminMetiers />} />
              </Route>
              {/* Section not found Routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Section publiques Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/bien-etre" element={<BienEtre />} />
            <Route path="/podcasts" element={<Podcast />} />
            <Route path="/immobilier" element={<Immobilier />} />
            <Route path="/droitFamille" element={<DroitFamille />} />
            <Route path="/gestion-immobilier" element={<GestionImmobilier />} />
            <Route path="/immobilier/:id" element={<PropertyPage />} />
            <Route path="/travaux" element={<Travaux />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/entreprise" element={<Entreprise />} />
            <Route path="/financement" element={<Financement />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/tourisme" element={<TourismSection />} />
            <Route path="/service" element={<ServicesPartnersPage />} />
            <Route path="/publicite" element={<Publicite />} />
            <Route path="/estimations" element={<EstimationImmobilierPage />} />
            <Route path="/messages/:id" element={<MessagesLayout />} />
            {/* singular routes for legacy links */}
            <Route path="/message" element={<MessagesLayout />} />
            <Route path="/message/:id" element={<MessagesLayout />} />
            <Route path="/login" element={<LoginRoleSelectionPage />} />
            <Route path="/login/professional" element={<ProLogin />} />
            <Route path="/login/particular" element={<ParticularLogin />} />
            <Route path="/register" element={<RoleSelectionPage />} />
            <Route
              path="/register/professional/subscription"
              element={<ProfessionalSubscriptionPage />}
            />
            <Route
              path="/register/professional"
              element={
                <Navigate to="/register/professional/subscription" replace />
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
            <Route path="/register/particular" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/investissement" element={<Investissement />} />
            <Route path="/art-commerce" element={<ArtCommerce />} />
            <Route path="/art-commerce/:id" element={<ArtCommerceDetail />} />
            <Route path="/investir/:type" element={<InvestissementDetail />} />
            {/* Section pro Routes */}
            <Route path="/pro" element={<ProLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="listings" element={<ListingsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="clients" element={<ClientSection />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="tourisme" element={<TourismPage />} />
              <Route path="services" element={<ProfessionalServicesPage />} />
              <Route path="billing" element={<BillingSection />} />
              <Route path="settings" element={<ParametresPage />} />
              <Route path="products" element={<Products />} />
              <Route path="demandes" element={<ArtisanDemandesPage />} />
              <Route path="message" element={<ProMessage />} />
              <Route path="message/:id" element={<ProMessage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="harmonie" element={<HarmoniePage />} />
            </Route>
            {/* Section Mon Compte Routes */}
            <Route path="/mon-compte">
              <Route index element={<MonComptePage />} />
              <Route path="payement" element={<PaiementPage />} />
              <Route path="profil" element={<MonComptePage />} />
              <Route path="reservation" element={<ReservationPage />} />
              <Route path="demandes" element={<MesDemande />} />
              <Route path="demandes/message" element={<DemandeMessage />} />
            </Route>
            {/* Section Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="blog" element={<Blog />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="listings" element={<Listings />} />
              <Route path="payments" element={<Payements />} />
              <Route path="products" element={<Products />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reports" element={<Reports />} />
              <Route path="services" element={<Services />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tourism" element={<Tourism />} />
              <Route path="users" element={<Users />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="demandes" element={<ListeDemande />} />
              <Route path="metiers" element={<AdminMetiers />} />
            </Route>
            {/* Section not found Routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
