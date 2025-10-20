import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Immobilier from "./pages/Immobilier";
import Travaux from "./pages/Travaux";
import Produits from "./pages/Produits";
import Entreprise from "./pages/Entreprise";
import Financement from "./pages/Financement";
import Actualites from "./pages/Actualites";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import TourismSection from "./pages/Tourisme";
import ServicesPartnersPage from "./pages/ServicesPartnersPage";
import EstimationImmobilierPage from "./pages/EstimationImmobilierPage";
import Index from "./pages/Index";
import ProLayout from "./pages/pro/ProLayout";
import Dashboard from "./pages/pro/Dashboard";
import ListingsPage from "./pages/pro/ListingsPage";
import CalendarPage from "./pages/pro/CalendarPage";
import ClientSection from "./pages/pro/ClientSection";
import DocumentsPage from "./pages/pro/DocumentsPage";
import ReviewsPage from "./pages/pro/ReviewsPage";
import TeamPage from "./pages/pro/TeamPage";
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
import ProDashboard from "./pages/pro/ProDashboard";
import { useEffect } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import ScrollToTop from "./ScrollToTop";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import UnauthorizedPage from "./pages/Unauthorized";
import ProfessionalServicesPage from "./pages/pro/ProfessionalServicesPage";

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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Section publiques Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/immobilier" element={<Immobilier />} />
            <Route path="/immobilier/:id" element={<PropertyPage />} />
            <Route path="/travaux" element={<Travaux />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/entreprise" element={<Entreprise />} />
            <Route path="/financement" element={<Financement />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/tourisme" element={<TourismSection />} />
            <Route path="/service" element={<ServicesPartnersPage />} />
            <Route path="/estimations" element={<EstimationImmobilierPage />} />
            <Route path="/messages/:id" element={<MessagesLayout />} />
            {/* singular routes for legacy links */}
            <Route path="/message" element={<MessagesLayout />} />
            <Route path="/message/:id" element={<MessagesLayout />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Section pro Routes */}
            <Route path="/pro" element={<ProLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="listings" element={<ListingsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="clients" element={<ClientSection />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="tourisme" element={<TourismPage />} />
              <Route path="services" element={<ProfessionalServicesPage />} />
              <Route path="billing" element={<BillingSection />} />
              <Route path="settings" element={<ParametresPage />} />
              <Route path="bookings" element={<ProDashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="demandes" element={<ArtisanDemandesPage />} />
              <Route path="message" element={<ProMessage />} />
              <Route path="message/:id" element={<ProMessage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
