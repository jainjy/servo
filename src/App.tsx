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
import CartesBiensImmobiliers from "@/components/PSLA";
import CategorieProduits from "./components/CategorieProduits";
import BienEtre from "./pages/bien_etre";
import Travaux from "./pages/Travaux";
import Produits from "./pages/Produits";
import Entreprise from "./pages/Entreprise";
import Financement from "./pages/Financement";
import FinancementPartenaireDetail from "./pages/FinancementPartenaireDetail";
import Actualites from "./pages/Actualites";
import RegisterPage from "./pages/Register";
import ProRegisterPage from "./pages/ProRegisterPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import TourismSection from "./pages/Tourisme";
import EstimationImmobilierPage from "./pages/EstimationImmobilierPage";
import Index from "./pages/Index";
import ProLayout from "./pages/pro/ProLayout";
import Dashboard from "./pages/pro/Dashboard";
import ListingsPage from "./pages/pro/ListingsPage";
import CalendarPage from "./pages/pro/CalendarPage";
import ServicesPartnersPage from "./pages/ServicesPartnersPage";
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
import { useEffect, useState } from "react";
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
import ProBookings from "./components/admin/tourism/ProBookings";
import Recherche from "./pages/Recherche";
import "leaflet/dist/leaflet.css";
import LoadingScreen from "./components/Load";
//tracking page
import GlobalTracking from "@/components/GlobalTracking";
import NetworkStatus from "./components/NetworkStatus";
import AdvertisementManager from "./components/admin/AdvertisementManager";
import AdvertisementPopup from "./components/AdvertisementPopup";

import ReservationTable from "./pages/pro/ReservationBien-etre"
// Import des nouveaux composants immobilier
import FinancementDemandesPro from "./pages/pro/FinancementDemandesPro";
// Import des composants bâtiments
import BatimentsLayout from "./pages/batiments/BatimentsLayout";
import PodcastsBatiment from "./components/PodcastsBatiment";
import PodcastsAssuranceFinance from "./components/PodcastsCreditAssurance";
import PodcastsAlimentation from "./components/PodcastsAlimentation";
import PodcastsInvestissement from "./components/PodcastsInvestissement";
import PodcastsTourisme from "./components/PodcastsTourisme";

// Import des composants domicile
import DomicileLayout from "./pages/domicile/DomicileLayout";
import ImmobilierSections from "./components/ImmobilierSections";
import StripeConnectButton from "./pages/CreateStripeAccount";
import RGPDInfo from "@/pages/RGPDInfo";
import ImportInfo from "@/pages/ImportInfo";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import MentionsLegales from "@/pages/MentionsLegales";
import PolitiqueConfidentialiteComplete from "@/pages/PolitiqueConfidentialiteComplete";
import GestionDroitsRGPD from "@/pages/GestionDroitsRGPD";
import ContactDPO from "@/pages/ContactDPO";
import CreationReprise from "./components/components/CreationReprise";
import AuditMediation from "./components/components/AuditMediation";
import AidesLeveesFonds from "./components/components/AideFonds";
import JuridiqueLiquidation from "./components/components/JuridiqueLiquidation";
import PodcastsServices from "./components/Podcast_services";
import FormationsTourisme from "./components/components/ToursimeFormation";
import ActivitesLoisirsFAQ from "./components/components/ActiviteLoisirs";
import AdminMedia from "./pages/pro/adminMedia";
import ProfessionalProfilePage from "./pages/ProfessionalProfilePage";

import AuditsPage from "./pages/admin/AdminAuditPage";
import AidesFinancement from "./components/components/Aide_finance";
import FormationsFinancement from "./components/components/Formation_finance";
import ComptabiliteServices from "./components/components/Comptabilite";
import PodcastsImmobilier from "./components/PodcastsImmobilier";
import PodcastsDomicile from "./components/PodcastsDomicil";
import PodcastsBienEtre from "./components/PodcastsBienEtre";
import LieuxHistoriques from "./components/components/Tourisme_lieux";
import Voyages from "./components/components/voyages";
import ConstructionServicesPage from "./pages/BatimentPage";
import PricingPacksDisplay from "./components/components/PackComplet";
import AgendaPage from "./pages/mon-compte/AgendaPage";
import MesDocumentsPage from "./pages/mon-compte/MesDocumentsPage";
import PlanAdministratifServices from "./components/components/Plan_Administratifs";
import MapPage from "./pages/MapPage";
import BoutiqueNaturel from "./components/components/BoutiqueNaturel";
import ProgrammeNeuf from "./components/components/Programme_neuf";
import InvestirEtranger from "./components/components/Investir_etrangert";
import SHLMR from "./components/components/SHLMR";
import MedecinePlants from "./pages/MedecinePlantes";
import CoursDomicile from "./pages/pro/CoursDomicil";
import FinancementServicesPro from "./pages/pro/FinancementServicesPro";
import ProReservations from "./pages/ProReservations";
import UserReservations from "./pages/UserReservations";
import SubscriptionStatusPage from "./pages/pro/SubscriptionStatusPage";
import SubscriptionPaymentPage from "./pages/pro/SubscriptionPaymentPage";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import Donation from "./components/components/Don";
import ProTouristicPlaceBookings from "./components/pro/ProTouristicPlaceBookings";
import AccountSuspended from "./pages/AccountSuspended";
import AccountStatusGuard from "./components/AccountStatusGuard";
import UserLayout from "./pages/UserLayout";
import InvestmentDemandesPage from "./pages/admin/InvestmentDemandesPage";
import FinancementServicesAdmin from "./pages/admin/FinancementServicesAdmin";
import ServicesIBRPage from "./pages/ServicesIBRPage";
import { App as CapacitorApp } from '@capacitor/app';
import Digitalisation from "./pages/Digitalisation";
import GestionLocationSaisonniere from "./pages/GestionLocationSaisonniere";
import PrivacyPolicyWidget from "./components/Confidentialite";
import LegalMentionsWidget from "./components/MentionLegal";
import DigitalisationPartenaires from "./pages/DigitalisationPartenaires";
import DigitalisationProfessionnelDetail from "./pages/DigitalisationProfessionnelDetail";
import DigitalisationServiceDetail from "./pages/DigitalisationServiceDetail";
import ContactMessagesPage from "./pages/pro/ContactMessagesPage";
import DemandeDroitFamille from "./pages/admin/DemandeDroitFamille";
import PropertyRent from "./pages/PropertyRent";
import PropertyBuy from "./pages/PropertyBuy";
import { SubscriptionStatusGuard } from "./components/SubscriptionStatusGuard";
import Assurance from "./pages/Assurance";

import Agence from "./components/NosPartenaires/Agence";
import Constructeur from "./components/NosPartenaires/Constructeur";
import Plombier from "./components/NosPartenaires/Plombier";

import ResetPasswordPage from "./pages/ResetPasswordPage";

// IMPORT DE LA NOUVELLE PAGE D'ACCOMPAGNEMENT
import AccompagnementPage from "./pages/AccompagnementPage";
import ConseilPage from "./pages/ConseilPage";
import AdminConseilPage from "./pages/AdminConseilPage";
import UserConseilPage from "./pages/UserConseilPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";
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
    }
  }, [location.pathname, location.hash, scrollToSection]);

  return null;
};

const App = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
  }, [user]);

  useEffect(() => {
    // Gestion simple du bouton retour
    CapacitorApp.addListener('backButton', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        if (window.confirm('Voulez-vous quitter SERVO ?')) {
          CapacitorApp.exitApp();
        }
      }
    });
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SocketProvider userId={user?.id}>
          <CartProvider>
            {isLoading && (
              <LoadingScreen
                onLoadingComplete={() => setIsLoading(false)}
                minimumLoadingTime={1500}
              />
            )}
            <Toaster />
            <ToastContainer />
            <Sonner />
            <NetworkStatus />
            <BrowserRouter>
              {/* Intégration du GlobalTracking pour le tracking des pages */}
              <GlobalTracking />

              <ScrollToTop />
              <ScrollToHash />
              
              <Layout>
                <Routes>
                  {/* Section publiques Routes */}
                  <Route
                    path="/services-partners"
                    element={<ServicesPartnersPage />}
                  />
                  <Route path="/" element={<Index />} />

                  {/* NOUVELLE ROUTE POUR LA PAGE D'ACCOMPAGNEMENT */}
                  <Route
                    path="/accompagnement"
                    element={<AccompagnementPage />}
                  />
                  <Route path="conseil" element={<ConseilPage />} />
                  <Route path="/bien-etre" element={<BienEtre />} />
                  <Route path="/digitalisation" element={<Digitalisation />} />
                  <Route
                    path="/digitalisation/services"
                    element={<Digitalisation />}
                  />
                  <Route
                    path="/digitalisation/partenaires"
                    element={<DigitalisationPartenaires />}
                  />
                  <Route
                    path="/digitalisation/professionnel/:id"
                    element={<DigitalisationProfessionnelDetail />}
                  />
                  <Route
                    path="/services/digitalisation/:id"
                    element={<DigitalisationServiceDetail />}
                  />
                  <Route path="/cookies" element={<CookiesPolicy />} />
                  <Route path="/immobilier" element={<Immobilier />} />
                  <Route path="/achat" element={<PropertyBuy />} />
                  <Route path="/location" element={<PropertyRent />} />
                  <Route
                    path="/location-saisonniere"
                    element={<PropertyRent isSeasonal={true} />}
                  />
                  <Route path="/droitFamille" element={<DroitFamille />} />
                  <Route path="/services-ibr" element={<ServicesIBRPage />} />

                  {/* Section entreprise */}
                  <Route path="/reprise" element={<CreationReprise />} />
                  <Route path="/auditMediation" element={<AuditMediation />} />
                  <Route path="/aideFonds" element={<AidesLeveesFonds />} />
                  <Route
                    path="/juridiqueLiquidation"
                    element={<JuridiqueLiquidation />}
                  />
                  <Route
                    path="/account-suspended"
                    element={<AccountSuspended />}
                  />
                  <Route
                    path="/podcast_service"
                    element={<PodcastsServices />}
                  />
                  <Route
                    path="/podcasts-batiment"
                    element={<PodcastsBatiment />}
                  />
                  <Route
                    path="/podcasts-bien_etre"
                    element={<PodcastsBienEtre />}
                  />
                  <Route path="/programme-neuf" element={<ProgrammeNeuf />} />
                  {/* 🆕 ROUTE POUR INVESTISSEMENT INTERNATIONAL */}
                  <Route
                    path="/investir-etranger"
                    element={<InvestirEtranger />}
                  />
                  <Route path="/SHLMR" element={<SHLMR />} />
                  <Route
                    path="/lieux_historique"
                    element={
                      <LieuxHistoriques ville="Paris" typeFiltre="tous" />
                    }
                  />
                  <Route
                    path="/formationTourisme"
                    element={<FormationsTourisme />}
                  />
                  <Route path="/voyages" element={<Voyages />} />
                  <Route
                    path="/confidentialite"
                    element={<PrivacyPolicyWidget />}
                  />
                  <Route
                    path="/mentions_legales"
                    element={<LegalMentionsWidget />}
                  />
                  <Route
                    path="/plan_administratif"
                    element={<PlanAdministratifServices />}
                  />
                  <Route
                    path="/podcasts/immobilier"
                    element={<PodcastsImmobilier />}
                  />
                  <Route
                    path="/podcasts/assurance-finance"
                    element={<PodcastsAssuranceFinance />}
                  />
                  <Route
                    path="/podcasts/alimentation"
                    element={<PodcastsAlimentation />}
                  />
                  <Route
                    path="/podcasts/investissement"
                    element={<PodcastsInvestissement />}
                  />
                  <Route
                    path="/podcasts/tourisme"
                    element={<PodcastsTourisme />}
                  />
                  <Route
                    path="/podcasts/domicile"
                    element={<PodcastsDomicile />}
                  />
                  <Route
                    path="/podcasts/bien-etre"
                    element={<PodcastsBienEtre />}
                  />
                  <Route
                    path="/formation-batiment"
                    element={<ConstructionServicesPage />}
                  />
                  <Route
                    path="/activiteLoisirs"
                    element={<ActivitesLoisirsFAQ />}
                  />
                  <Route
                    path="/professional/:id"
                    element={<ProfessionalProfilePage />}
                  />
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

                  {/* Routes Partenaires */}
                  <Route path="/agences" element={<Agence />} />
                  <Route path="/constructeurs" element={<Constructeur />} />
                  <Route path="/plombiers" element={<Plombier />} />
                  {/* Routes Domicile */}
                  <Route path="/domicile" element={<DomicileLayout />} />
                  <Route
                    path="/produits-commerces"
                    element={<DomicileLayout />}
                  />
                  <Route
                    path="/produits-naturels"
                    element={<BoutiqueNaturel />}
                  />
                  <Route
                    path="/produits-naturels/categorie/:categoryName"
                    element={<BoutiqueNaturel />}
                  />
                  <Route
                    path="/comptabilite"
                    element={
                      <ComptabiliteServices
                        entrepriseId="ENT-12345"
                        typeEntreprise="sarl"
                        chiffreAffaire={150000}
                      />
                    }
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
                  <Route path="/achat/:id" element={<PropertyPage />} />
                  <Route path="/location/:id" element={<PropertyPage />} />
                  <Route path="/immobilier/:id" element={<PropertyPage />} />
                  <Route path="/travaux" element={<Travaux />} />
                  <Route path="/produits" element={<Produits />} />
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
                    path="/medecine-plantes"
                    element={<MedecinePlants />}
                  />
                  <Route
                    path="/produits/categorie/:categoryName"
                    element={<CategorieProduits />}
                  />
                  <Route path="/entreprise" element={<Entreprise />} />
                  <Route path="/financement" element={<Financement />} />
                  <Route path="/assurance" element={<Assurance />} />
                  <Route
                    path="/financement/:id"
                    element={<FinancementPartenaireDetail />}
                  />
                  <Route path="/blog" element={<Actualites />} />
                  <Route path="/tourisme" element={<TourismSection />} />
                  <Route path="/pack" element={<PricingPacksDisplay />} />
                  <Route path="/don" element={<Donation />} />
                  {/* 🗺️ NOUVELLE ROUTE POUR LA CARTE */}
                  <Route path="/carte" element={<MapPage />} />
                  <Route path="/PSLA" element={<CartesBiensImmobiliers />} />
                  {/* Add redirect from /service to /services-partners */}
                  <Route
                    path="/service"
                    element={<Navigate to="/services-partners" replace />}
                  />
                  <Route
                    path="/services-partners"
                    element={<ServicesPartnersPage />}
                  />
                  <Route
                    path="/estimations"
                    element={<EstimationImmobilierPage />}
                  />

                  {/* Routes d'authentification */}
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
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                  />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/investissement" element={<Investissement />} />
                  <Route path="/art-commerce" element={<ArtCommerce />} />
                  <Route
                    path="/art-commerce/:id"
                    element={<ArtCommerceDetail />}
                  />
                  <Route
                    path="/aide_financement"
                    element={
                      <AidesFinancement
                        entrepriseId="ENT-12345"
                        secteurActivite="Technologie"
                        localisation="Île-de-France"
                      />
                    }
                  />
                  <Route
                    path="/formation_finance"
                    element={
                      <FormationsFinancement
                        entrepriseId="ENT-12345"
                        secteurActivite="Industrie"
                      />
                    }
                  />
                  <Route
                    path="/investir/:type"
                    element={<InvestissementDetail />}
                  />

                  {/* Section pro Routes */}
                  <Route
                    path="/pro"
                    element={
                      <AccountStatusGuard>
                        <SubscriptionStatusGuard>
                          <ProLayout />
                        </SubscriptionStatusGuard>
                      </AccountStatusGuard>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="listings" element={<ListingsPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route
                      path="contact-messages"
                      element={<ContactMessagesPage />}
                    />
                    <Route
                      path="financement-demandes"
                      element={<FinancementDemandesPro />}
                    />
                    <Route
                      path="financement-services"
                      element={<FinancementServicesPro />}
                    />
                    <Route
                      path="reservationbien-etre"
                      element={<ReservationTable />}
                    />
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="tourisme" element={<TourismPage />} />
                    <Route path="reservations" element={<ProBookings />} />
                    <Route
                      path="reservationPro"
                      element={<ProTouristicPlaceBookings />}
                    />
                    <Route
                      path="subscription"
                      element={<SubscriptionStatusPage />}
                    />
                    <Route
                      path="subscription/payment"
                      element={<SubscriptionPaymentPage />}
                    />
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
                    <Route path="cours-domicile" element={<CoursDomicile />} />
                    <Route
                      path="reservations-cours"
                      element={<ProReservations />}
                    />
                    <Route path="media" element={<AdminMedia />} />
                    
                    <Route
                      path="delete-account"
                      element={<DeleteAccountPage />}
                    />
                  </Route>

                  {/* Section Mon Compte Routes */}
                  <Route
                    path="/mon-compte"
                    element={
                      <AccountStatusGuard>
                        <UserLayout />
                      </AccountStatusGuard>
                    }
                  >
                    <Route index element={<MonComptePage />} />
                    <Route path="payement" element={<PaiementPage />} />
                    <Route path="profil" element={<MonComptePage />} />
                    <Route path="reservation" element={<ReservationPage />} />
                    <Route path="demandes" element={<MesDemande />} />
                    <Route path="agenda" element={<AgendaPage />} />
                    <Route path="documents" element={<MesDocumentsPage />} />
                    <Route path="conseil" element={<UserConseilPage />} />
                    <Route
                      path="locationSaisonniere"
                      element={<GestionLocationSaisonniere />}
                    />
                    <Route
                      path="delete-account"
                      element={<DeleteAccountPage />}
                    />
                    <Route
                      path="mes-reservations-cours"
                      element={<UserReservations />}
                    />
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
                    <Route path="conseil" element={<AdminConseilPage />} />
                    <Route
                      path="demandeDroitFamille"
                      element={<DemandeDroitFamille />}
                    />
                    <Route
                      path="financement-services"
                      element={<FinancementServicesAdmin />}
                    />
                    <Route
                      path="subscriptions"
                      element={<AdminSubscriptions />}
                    />
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
                    <Route
                      path="financement-demandes"
                      element={<FinancementDemandes />}
                    />
                    <Route
                      path="investissement-demandes"
                      element={<InvestmentDemandesPage />}
                    />
                  </Route>

                  {/* Section not found Routes */}
                  <Route path="*" element={<NotFound />} />
                  <Route path="/en-savoir-plus" element={<RGPDInfo />} />
                  <Route path="/import-info" element={<ImportInfo />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  
                  {/* Routes RGPD et légales */}
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="/politique-confidentialite" element={<PolitiqueConfidentialiteComplete />} />
                  <Route path="/gestion-droits-rgpd" element={<GestionDroitsRGPD />} />
                  <Route path="/contact-dpo" element={<ContactDPO />} />
                </Routes>

                {/* Pop-up publicité globale */}
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