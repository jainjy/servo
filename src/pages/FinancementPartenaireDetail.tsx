import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { financementAPI } from "@/lib/api";
import {
  Building2,
  Users,
  Shield,
  Home,
  FileText,
  Calculator,
  Phone,
  Mail,
  Star,
  CheckCircle,
  TrendingUp,
  Handshake,
  BadgeDollarSign,
  Clock,
  Heart,
  X,
  ArrowRight,
  LucideIcon,
  CreditCard,
  PieChart,
  Car,
  Plane,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Types
interface FinancementPartenaire {
  id: number;
  nom: string;
  description: string;
  rating: number;
  avantages: string[];
  icon?: LucideIcon;
  type: string;
  services: string[];
}

interface AssuranceService {
  id: number;
  nom: string;
  description: string;
  details: string;
  icon?: LucideIcon;
  obligatoire: boolean;
  public: string;
  categorie: string;
}

interface ModalData {
  selectedAssurance: AssuranceService | null;
  selectedPartenaire: FinancementPartenaire | null;
  simulationData: any;
}

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  message: string;
  montant: string;
  duree: string;
  revenus: string;
  charges: string;
  apport: string;
  taux: string;
  revenus_annuels: string;
  patrimoine: string;
  objectif: string;
  profil_risque: string;
}

interface SimulationResult {
  capacite?: number;
  mensualite?: number;
  estimation?: number;
}

// Données de fallback
const partenairesFinancementFallback: FinancementPartenaire[] = [
  {
    id: 1,
    nom: "Crédit Agricole",
    description: "Banque leader en financement immobilier et professionnel",
    rating: 4.7,
    avantages: ["Taux préférentiels", "Accompagnement personnalisé", "Réseau national"],
    services: ["Prêt immobilier", "Rachat de crédit", "Crédit consommation", "Analyse patrimoniale"],
    icon: Building2,
    type: "banque"
  },
  {
    id: 2,
    nom: "Courtiers Partenaires",
    description: "Réseau de courtiers experts en financement",
    rating: 4.9,
    avantages: ["Comparaison multi-banques", "Négociation des taux", "Service gratuit"],
    services: ["Prêt immobilier", "Rachat de crédit", "Crédit consommation", "Analyse patrimoniale"],
    icon: Users,
    type: "courtier"
  },
  {
    id: 3,
    nom: "Spécialistes Immobilier",
    description: "Experts en financement de projets immobiliers",
    rating: 4.8,
    avantages: ["Prêts sur mesure", "Expertise sectorielle", "Délais optimisés"],
    services: ["Prêt immobilier", "Rachat de crédit", "Analyse patrimoniale"],
    icon: Home,
    type: "expert"
  }
];

const servicesAssuranceFallback: AssuranceService[] = [
  {
    id: 1,
    nom: "Assurance Décennale",
    description: "Protection obligatoire pour les professionnels du bâtiment",
    icon: Shield,
    details: "Couverture des dommages affectant la solidité de l'ouvrage",
    obligatoire: true,
    public: "Professionnels construction",
    categorie: "professionnelle"
  },
  {
    id: 2,
    nom: "Assurance Dommage Ouvrage",
    description: "Garantie pour les maîtres d'ouvrage",
    icon: FileText,
    details: "Protection dès la réception des travaux",
    obligatoire: true,
    public: "Maîtres d'ouvrage",
    categorie: "construction"
  },
  {
    id: 3,
    nom: "Assurance Habitation",
    description: "Protection complète de votre logement",
    icon: Home,
    details: "Incendie, dégâts des eaux, vol, responsabilité civile",
    obligatoire: false,
    public: "Particuliers",
    categorie: "habitation"
  },
  {
    id: 4,
    nom: "Assurance Prêt Immobilier",
    description: "Protection de votre crédit immobilier",
    icon: BadgeDollarSign,
    details: "Décès, invalidité, perte d'emploi",
    obligatoire: false,
    public: "Emprunteurs",
    categorie: "pret"
  },
  {
    id: 5,
    nom: "Assurance Responsabilité Civile Pro",
    description: "Protection de votre activité professionnelle",
    icon: Users,
    details: "Dommages causés aux tiers dans le cadre professionnel",
    obligatoire: true,
    public: "Professionnels",
    categorie: "professionnelle"
  },
  {
    id: 6,
    nom: "Assurance Santé",
    description: "Complémentaire santé entreprise et particuliers",
    icon: Heart,
    details: "Couverture santé optimale",
    obligatoire: false,
    public: "Entreprises & Particuliers",
    categorie: "sante"
  },
  {
    id: 7,
    nom: "Garantie Loyer Impayé",
    description: "Protection contre les impayés de loyers",
    icon: Shield,
    details: "Couverture des loyers impayés et des frais de contentieux",
    obligatoire: false,
    public: "Propriétaires bailleurs",
    categorie: "immobilier"
  },
  {
    id: 8,
    nom: "Assurance Voiture",
    description: "Protection complète pour votre véhicule",
    icon: Car,
    details: "Tous risques, au tiers, assistance routière",
    obligatoire: true,
    public: "Propriétaires de véhicules",
    categorie: "automobile"
  },
  {
    id: 9,
    nom: "Assurance Voyage",
    description: "Protection lors de vos déplacements",
    icon: Plane,
    details: "Annulation, rapatriement, frais médicaux à l'étranger",
    obligatoire: false,
    public: "Voyageurs",
    categorie: "voyage"
  },
  {
    id: 10,
    nom: "GFA",
    description: "Garantie des Fonctions d'Architecte",
    icon: FileText,
    details: "Protection juridique pour les architectes",
    obligatoire: true,
    public: "Architectes",
    categorie: "professionnelle"
  }
];

const financementServices = [
  {
    icon: Home,
    title: "Prêt Immobilier",
    description: "Financez votre projet immobilier",
    features: ["Calcul capacité d'emprunt", "Taux compétitifs", "Simulation en ligne"],
    modalType: 'simulation-immobilier'
  },
  {
    icon: TrendingUp,
    title: "Rachat de Crédit",
    description: "Regroupez vos crédits",
    features: ["Baisse des mensualités", "Taux unique", "Allègement du budget"],
    modalType: 'simulation-rachat'
  },
  {
    icon: CreditCard,
    title: "Crédit Consommation",
    description: "Financez vos projets personnels",
    features: ["Taux fixe", "Délais flexibles", "Dossier simplifié"],
    modalType: 'simulation-consommation'
  },
  {
    icon: PieChart,
    title: "Analyse Patrimoniale",
    description: "Optimisez votre patrimoine",
    features: ["Bilan complet", "Conseils personnalisés", "Stratégie long terme"],
    modalType: 'analyse-patrimoniale'
  }
];

export default function Financement() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData>({
    selectedAssurance: null,
    selectedPartenaire: null,
    simulationData: null
  });
  const { isAuthenticated } = useAuth();
  const [partenairesFinancement, setPartenairesFinancement] = useState<FinancementPartenaire[]>([]);
  const [servicesAssurance, setServicesAssurance] = useState<AssuranceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [partenairesResponse, assurancesResponse] = await Promise.all([
          financementAPI.getPartenaires(),
          financementAPI.getAssurances()
        ]);

        setPartenairesFinancement(partenairesResponse.data);
        setServicesAssurance(assurancesResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données. Affichage des données de démonstration.');
        setPartenairesFinancement(partenairesFinancementFallback);
        setServicesAssurance(servicesAssuranceFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = useCallback((modalType: string, data: Partial<ModalData> = {}) => {
    setActiveModal(modalType);
    setModalData(prev => ({ ...prev, ...data }));
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData({
      selectedAssurance: null,
      selectedPartenaire: null,
      simulationData: null
    });
  }, []);

  const handleAssuranceClick = useCallback((assurance: AssuranceService) => {
    openModal('contact', { selectedAssurance: assurance });
  }, [openModal]);

  const handlePartenaireClick = useCallback((partenaire: FinancementPartenaire) => {
    if (isAuthenticated) {
      openModal("contact", { selectedPartenaire: partenaire });
    } else {
      alert("Veuillez vous connecter ou vous inscrire pour contacter un partenaire.");
    }
  }, [isAuthenticated, openModal]);

  const handleSimulationSubmit = useCallback(async (simulationData: any) => {
    try {
      const demandeData = {
        nom: simulationData.nom,
        email: simulationData.email,
        telephone: simulationData.telephone,
        message: `Bonjour, je suis intéressé par une simulation de financement. Montant: ${simulationData.montant}€, Durée: ${simulationData.duree} ans. Estimation: ${simulationData.estimation}€/mois.`,
        type: 'simulation',
        montant: parseFloat(simulationData.montant),
        duree: parseInt(simulationData.duree),
        estimation: simulationData.estimation
      };

      const response = await financementAPI.submitDemande(demandeData);

      if (response.data.success) {
        alert("Votre demande a été envoyée avec succès !");
        closeModal();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    }
  }, [closeModal]);

  // Fonction utilitaire pour vérifier si c'est une URL d'image
  const isImageUrl = useCallback((icon: any): boolean => {
    if (typeof icon === 'string') {
      return icon.startsWith('/') || icon.startsWith('https://');
    }
    return false;
  }, []);

  // Fonction pour faire défiler vers une section
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-white to-[#FAFAFA] flex flex-col">
        <div className="flex-col flex-1 flex items-center justify-center">
          <img src="/loading.gif" alt="Chargement" className='w-24 h-24' />
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-white to-[#FAFAFA] flex flex-col">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mx-4 mt-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')`
          }}
        />

        <div className="container mx-auto px-4 h-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-2xl lg:text-5xl md:text-6xl font-bold mb-6 text-white">
              Financement & <span className="text-white/90">Assurance</span>
            </h1>
            <p className="text-sm text-white/90 mb-4 lg:mb-10 leading-relaxed">
              Des solutions complètes pour financer votre projet et le protéger avec nos partenaires de confiance.
              Accompagnement personnalisé de A à Z.
            </p>

          <div className="flex flex-wrap gap-5 justify-center">
            <motion.div>
              <Button
                className="bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-[#8B4513] hover:border-[#A0522D] transition-all duration-300"
                onClick={() => openModal('service')}
              >
                <FileText className="h-5 w-5 mr-3" />
                Découvrir nos service financement
              </Button>
            </motion.div>

            <motion.div>
              <Button
                className="bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300"
                onClick={() => openModal('simulation')}
              >
                <Calculator className="h-5 w-5 mr-3" />
                Simuler mon financement
              </Button>
            </motion.div>

            <motion.div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-blue-600 hover:border-blue-700 transition-all duration-300"
                onClick={() => scrollToSection('assurances')}
              >
                <Shield className="h-5 w-5 mr-3" />
                Découvrir nos offres d'assurance
              </Button>
            </motion.div>

            <motion.div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-5 text-base font-semibold border-2 border-blue-600 hover:border-blue-700 transition-all duration-300"
                onClick={() => scrollToSection('assurances')}
              >
                <Shield className="h-5 w-5 mr-3" />
                Protéger mon projet avec nos assurances
              </Button>
            </motion.div>
          </div>

          </motion.div>
        </div>
      </section>

      {/* Section Financement détaillé */}
      <section className="py-8 lg:py-20 bg-[#FAFAFA]" id="financement-detail">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-[#8B4513]">
              Nos Solutions de <span className="text-[#556B2F]">Financement</span>
            </h2>
            <p className="text-sm lg:text-xl text-slate-600 max-w-2xl mx-auto">
              Des solutions adaptées à tous vos projets financiers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {financementServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className="p-6 h-full border border-[#D3D3D3] rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer bg-white group"
                  onClick={() => openModal(service.modalType)}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#6B8E23]/10 flex items-center justify-center mb-4 group-hover:bg-[#6B8E23] transition-colors duration-300">
                    {isImageUrl(service.icon) ? (
                      <img src={service.icon} alt={service.title} className="h-6 w-6 object-cover rounded-lg" />
                    ) : (
                      <service.icon className="h-6 w-6 text-[#556B2F] group-hover:text-white transition-colors duration-300" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#8B4513] mb-3">{service.title}</h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-[#6B8E23] mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center text-[#556B2F] font-semibold text-sm group-hover:text-[#6B8E23] transition-colors duration-300">
                    Simuler mon projet
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

         
        </div>
      </section>

      {/* Section Partenaires Financement */}
      <section className="py-8 lg:py-20 bg-white" id="partenaires">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-[#8B4513]">
              Nos <span className="text-[#556B2F]">Partenaires Financement</span>
            </h2>
            <p className="text-sm lg:text-sm text-slate-600 max-w-2xl mx-auto">
              Travaillons avec les meilleurs acteurs du marché pour votre projet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partenairesFinancement.map((partenaire, index) => (
              <motion.div
                key={partenaire.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="p-8 h-full border border-[#D3D3D3] rounded-2xl hover:shadow-2xl transition-all duration-500 bg-white group"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mr-5 group-hover:bg-[#556B2F] transition-colors duration-300">
                      {isImageUrl(partenaire.icon) ? (
                        <img src={partenaire.icon} alt={partenaire.nom} className="h-7 w-7 object-cover rounded-lg" />
                      ) : partenaire.icon ? (
                        <partenaire.icon className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
                      ) : (
                        <Building2 className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#8B4513]">{partenaire.nom}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 ml-2">{partenaire.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed">{partenaire.description}</p>

                  <div className="space-y-3 mb-4">
                    {partenaire.avantages?.map((avantage, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-5 w-5 text-[#6B8E23] mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{avantage}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-[#8B4513] mb-2">Services proposés :</h4>
                    <div className="flex flex-wrap gap-2">
                      {partenaire.services?.map((service, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#6B8E23]/10 text-[#556B2F] text-sm rounded-full border border-[#6B8E23]/20">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl py-4 text-base font-semibold transition-all duration-300 border-2 border-[#556B2F] hover:border-[#6B8E23]"
                      onClick={() => handlePartenaireClick(partenaire)}
                    >
                      <Handshake className="h-5 w-5 mr-3" />
                      Contacter
                    </Button>
                    <Button
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#8B4513] rounded-xl py-4 text-base font-semibold transition-all duration-300 border-2 border-[#D3D3D3] hover:border-slate-300"
                      onClick={() => navigate(`/financement/${partenaire.id}`)}
                    >
                      <ChevronRight className="h-5 w-5 mr-3" />
                      Détails
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Assurance */}
      <section className="py-8 lg:py-8 bg-[#FAFAFA]" id="assurances">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-[#8B4513]">
              Solutions <span className="text-[#556B2F]">d'Assurance</span>
            </h2>
            <p className="text-sm lg:text-xl text-slate-600 max-w-2xl mx-auto">
              Protégez votre projet, votre patrimoine et votre activité avec nos assurances sur mesure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesAssurance.map((assurance, index) => (
              <motion.div
                key={assurance.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  className="p-8 h-full border border-[#D3D3D3] rounded-2xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white group"
                  onClick={() => handleAssuranceClick(assurance)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-[#556B2F] transition-colors duration-300">
                      {isImageUrl(assurance.icon) ? (
                        <img src={assurance.icon} alt={assurance.nom} className="h-7 w-7 object-cover rounded-lg" />
                      ) : assurance.icon ? (
                        <assurance.icon className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
                      ) : (
                        <Shield className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>
                    {assurance.obligatoire && (
                      <span className="px-3 py-1.5 bg-[#8B4513]/10 text-[#8B4513] text-sm font-medium rounded-full border border-[#8B4513]/20">
                        Obligatoire
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-[#8B4513] mb-4">{assurance.nom}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{assurance.description}</p>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">{assurance.details}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-600 font-medium">{assurance.public}</span>
                    <div className="flex items-center text-[#556B2F] font-semibold text-sm group-hover:text-[#6B8E23] transition-colors duration-300">
                      Devis gratuit
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              className="bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-xl px-8 py-4 text-base font-semibold border-2 border-[#8B4513] hover:border-[#A0522D] transition-all duration-300"
              onClick={() => scrollToSection('financement-detail')}
            >
              <FileText className="h-5 w-5 mr-3" />
              Revenir aux solutions de financement
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 lg:py-20 bg-white" id="audit">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-6 text-[#8B4513]">
              Prêt à concrétiser votre projet ?
            </h2>
            <p className="text-sm text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nos experts sont à votre écoute pour vous accompagner dans votre financement et vos assurances
            </p>
            <motion.div>
              <Button
                className="bg-[#556B2F] text-white hover:bg-[#6B8E23] rounded-xl px-10 py-5 text-lg font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300"
                onClick={() => openModal('contact')}
              >
                <Phone className="h-5 w-5 mr-3" />
                Être rappelé gratuitement
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modal Unique */}
      {activeModal && (
        <UniversalModal
          type={activeModal}
          data={modalData}
          onClose={closeModal}
          onOpenModal={openModal}
          onSimulationSubmit={handleSimulationSubmit}
        />
      )}
    </div>
  );
}

// ----------- Modal Universel -----------
interface UniversalModalProps {
  type: string;
  data: ModalData;
  onClose: () => void;
  onOpenModal: (modalType: string, data?: Partial<ModalData>) => void;
  onSimulationSubmit: (data: any) => void;
}

function UniversalModal({ type, data, onClose, onOpenModal, onSimulationSubmit }: UniversalModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    montant: "",
    duree: "",
    revenus: "",
    charges: "",
    apport: "",
    taux: "",
    revenus_annuels: "",
    patrimoine: "",
    objectif: "",
    profil_risque: ""
  });
  const { isAuthenticated } = useAuth();
  const [estimation, setEstimation] = useState<SimulationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isImageUrl = useCallback((icon: any): boolean => {
    if (typeof icon === 'string') {
      return icon.startsWith('/') || icon.startsWith('https://');
    }
    return false;
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    calculateEstimation(name, value);
  }, [formData]);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    calculateEstimation(name, value);
  }, [formData]);

  const calculateEstimation = useCallback((name: string, value: string) => {
    if (type === 'simulation-immobilier') {
      const revenus = name === 'revenus' ? parseFloat(value) || 0 : parseFloat(formData.revenus) || 0;
      const charges = name === 'charges' ? parseFloat(value) || 0 : parseFloat(formData.charges) || 0;
      const duree = name === 'duree' ? parseInt(value) || 0 : parseInt(formData.duree) || 0;
      const taux = name === 'taux' ? parseFloat(value) || 0 : parseFloat(formData.taux) || 0;

      if (revenus > 0 && duree > 0 && taux > 0) {
        const capacite = Math.round((revenus - charges) * 0.33 * duree * 12);
        const mensualite = Math.round((capacite * (taux / 100) / 12) / (1 - Math.pow(1 + (taux / 100) / 12, -duree * 12)));
        setEstimation({ capacite, mensualite });
      }
    }
    else if (type === 'simulation') {
      const montant = name === 'montant' ? value : formData.montant;
      const duree = name === 'duree' ? value : formData.duree;
      if (montant && duree) {
        const mensualite = Math.round((parseInt(montant) / (parseInt(duree) * 12)) * 100) / 100;
        setEstimation({ estimation: mensualite });
      }
    }
  }, [type, formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Veuillez vous connecter ou vous inscrire pour envoyer une demande.");
      return;
    }
    setSubmitting(true);

    try {
      let demandeData: any = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        message: formData.message || getDefaultMessage(),
        type: type.includes('simulation') ? 'simulation' : 'contact'
      };

      if (type.includes('simulation') && estimation) {
        Object.assign(demandeData, estimation);
      }

      if (data.selectedAssurance) {
        demandeData.assuranceId = data.selectedAssurance.id;
      }

      if (data.selectedPartenaire) {
        demandeData.partenaireId = data.selectedPartenaire.id;
      }

      const response = await financementAPI.submitDemande(demandeData);

      if (response.data.success) {
        alert("Votre demande a été envoyée avec succès !");
        onClose();
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          message: "",
          montant: "",
          duree: "",
          revenus: "",
          charges: "",
          apport: "",
          taux: "",
          revenus_annuels: "",
          patrimoine: "",
          objectif: "",
          profil_risque: ""
        });
        setEstimation(null);
      }
    } catch (error) {
      console.error('Erreur envoi demande:', error);
      alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }, [formData, estimation, data, isAuthenticated, type, onClose]);

  const getModalTitle = useCallback(() => {
    switch (type) {
      case 'service':
        return "Nos services de financement";
      case 'simulation':
        return "Simulation de financement";
      case 'simulation-immobilier':
        return "Simulation prêt immobilier";
      case 'simulation-rachat':
        return "Rachat de crédit";
      case 'simulation-consommation':
        return "Crédit consommation";
      case 'analyse-patrimoniale':
        return "Analyse patrimoniale";
      case 'contact':
        if (data.selectedAssurance) return `Devis ${data.selectedAssurance.nom}`;
        if (data.selectedPartenaire) return `Contact ${data.selectedPartenaire.nom}`;
        if (data.simulationData) return "Demande de financement";
        return "Contactez-nous";
      default:
        return "Demande d'information";
    }
  }, [type, data]);

  const getDefaultMessage = useCallback(() => {
    if (data.selectedAssurance) {
      return `Bonjour, je souhaite obtenir un devis pour l'assurance ${data.selectedAssurance.nom}.`;
    }
    if (data.selectedPartenaire) {
      return `Bonjour, je souhaite contacter ${data.selectedPartenaire.nom} pour discuter de financement.`;
    }
    if (data.simulationData) {
      return data.simulationData.message;
    }
    return "Bonjour, je souhaite obtenir des informations sur vos services de financement et assurance.";
  }, [data]);

  const renderServiceContent = useMemo(() => (
    <>
      <p className="text-slate-600 mb-8 text-lg leading-relaxed">
        Un accompagnement complet à chaque étape de votre projet
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          {
            icon: FileText,
            title: "Étude de Faisabilité",
            description: "Analyse complète de votre projet et de sa viabilité financière"
          },
          {
            icon: TrendingUp,
            title: "Plan de Financement",
            description: "Élaboration d'un plan financier optimisé pour votre projet"
          },
          {
            icon: Handshake,
            title: "Mise en Relation",
            description: "Contact avec nos partenaires bancaires et assureurs privilégiés"
          },
          {
            icon: Clock,
            title: "Suivi Personnalisé",
            description: "Accompagnement jusqu'à la concrétisation de votre projet"
          }
        ].map((service, index) => (
          <Card key={index} className="p-6 border border-[#D3D3D3] rounded-xl hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/10 flex items-center justify-center mr-4">
                {isImageUrl(service.icon) ? (
                  <img src={service.icon} alt={service.title} className="h-6 w-6 object-cover rounded-lg" />
                ) : (
                  <service.icon className="h-6 w-6 text-[#556B2F]" />
                )}
              </div>
              <h3 className="font-semibold text-[#8B4513] text-lg">{service.title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
          </Card>
        ))}
      </div>
    </>
  ), [isImageUrl]);

  const renderSimulationContent = useMemo(() => (
    <>
      <p className="text-slate-600 mb-8 text-lg leading-relaxed">
        Estimez vos mensualités et obtenez une simulation personnalisée
      </p>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
            Montant du projet (€)
          </label>
          <Input
            name="montant"
            type="number"
            placeholder="Ex: 150000"
            value={formData.montant}
            onChange={handleInputChange}
            className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            required={type === 'simulation'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
            Durée du prêt
          </label>
          <Select
            value={formData.duree}
            onValueChange={(value) => handleSelectChange('duree', value)}
          >
            <SelectTrigger className="rounded-xl border-[#D3D3D3] focus:border-[#556B2F]">
              <SelectValue placeholder="Sélectionnez la durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 ans</SelectItem>
              <SelectItem value="15">15 ans</SelectItem>
              <SelectItem value="20">20 ans</SelectItem>
              <SelectItem value="25">25 ans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {estimation?.estimation && (
          <Card className="p-6 bg-[#6B8E23]/10 border-[#6B8E23]/20 rounded-xl">
            <h4 className="font-semibold text-[#556B2F] mb-3 text-lg">Estimation mensuelle</h4>
            <p className="text-3xl font-bold text-[#556B2F]">
              {estimation.estimation} €/mois*
            </p>
            <p className="text-sm text-[#6B8E23] mt-3">*Estimation hors assurance et frais</p>
          </Card>
        )}
      </div>
    </>
  ), [formData, estimation, handleInputChange, handleSelectChange, type]);

  const renderSimulationImmobilier = useMemo(() => (
    <>
      <p className="text-slate-600 mb-8 text-lg leading-relaxed">
        Calculez votre capacité d'emprunt et simulez votre prêt immobilier
      </p>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
              Revenus mensuels nets (€)
            </label>
            <Input
              name="revenus"
              type="number"
              placeholder="Ex: 3000"
              value={formData.revenus}
              onChange={handleInputChange}
              className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
              Charges mensuelles (€)
            </label>
            <Input
              name="charges"
              type="number"
              placeholder="Ex: 800"
              value={formData.charges}
              onChange={handleInputChange}
              className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
            Apport personnel (€)
          </label>
          <Input
            name="apport"
            type="number"
            placeholder="Ex: 20000"
            value={formData.apport}
            onChange={handleInputChange}
            className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
              Durée du prêt
            </label>
            <Select 
              value={formData.duree} 
              onValueChange={(value) => handleSelectChange('duree', value)}
            >
              <SelectTrigger className="rounded-xl border-[#D3D3D3] focus:border-[#556B2F]">
                <SelectValue placeholder="Sélectionnez la durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 ans</SelectItem>
                <SelectItem value="20">20 ans</SelectItem>
                <SelectItem value="25">25 ans</SelectItem>
                <SelectItem value="30">30 ans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
              Taux d'intérêt (%)
            </label>
            <Input
              name="taux"
              type="number"
              step="0.01"
              placeholder="Ex: 3.5"
              value={formData.taux}
              onChange={handleInputChange}
              className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            />
          </div>
        </div>

        {estimation && (
          <Card className="p-6 bg-[#6B8E23]/10 border-[#6B8E23]/20 rounded-xl">
            <h4 className="font-semibold text-[#556B2F] mb-3 text-lg">Résultats de simulation</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6B8E23]">Capacité d'emprunt</p>
                <p className="text-2xl font-bold text-[#556B2F]">{estimation.capacite} €</p>
              </div>
              <div>
                <p className="text-sm text-[#6B8E23]">Mensualité estimée</p>
                <p className="text-2xl font-bold text-[#556B2F]">{estimation.mensualite} €/mois</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  ), [formData, estimation, handleInputChange, handleSelectChange]);

  const renderAnalysePatrimoniale = useMemo(() => (
    <>
      <p className="text-slate-600 mb-8 text-lg leading-relaxed">
        Analyse complète de votre situation patrimoniale
      </p>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
              Revenus annuels (€)
            </label>
            <Input
              name="revenus_annuels"
              type="number"
              placeholder="Ex: 50000"
              value={formData.revenus_annuels}
              onChange={handleInputChange}
              className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
              Patrimoine existant (€)
            </label>
            <Input
              name="patrimoine"
              type="number"
              placeholder="Ex: 150000"
              value={formData.patrimoine}
              onChange={handleInputChange}
              className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
            Objectifs patrimoniaux
          </label>
          <Select onValueChange={(value) => handleSelectChange('objectif', value)}>
            <SelectTrigger className="rounded-xl border-[#D3D3D3] focus:border-[#556B2F]">
              <SelectValue placeholder="Sélectionnez votre objectif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retraite">Préparation retraite</SelectItem>
              <SelectItem value="transmission">Transmission patrimoine</SelectItem>
              <SelectItem value="investissement">Investissement locatif</SelectItem>
              <SelectItem value="diversification">Diversification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
            Profil de risque
          </label>
          <Select onValueChange={(value) => handleSelectChange('profil_risque', value)}>
            <SelectTrigger className="rounded-xl border-[#D3D3D3] focus:border-[#556B2F]">
              <SelectValue placeholder="Sélectionnez votre profil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prudent">Prudent</SelectItem>
              <SelectItem value="equilibre">Équilibré</SelectItem>
              <SelectItem value="dynamique">Dynamique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  ), [formData, handleInputChange, handleSelectChange]);

  const renderContactForm = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            name="nom"
            placeholder="Nom complet"
            value={formData.nom}
            onChange={handleInputChange}
            required
            className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            disabled={submitting}
          />
        </div>
        <div>
          <Input
            name="telephone"
            type="tel"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleInputChange}
            required
            className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            disabled={submitting}
          />
        </div>
      </div>

      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
        className="w-full rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
        disabled={submitting}
      />

      <div>
        <textarea
          name="message"
          placeholder="Votre message"
          rows={5}
          value={formData.message || getDefaultMessage()}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-[#D3D3D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] resize-none"
          required
          disabled={submitting}
        />
      </div>

      <div className="grid lg:flex gap-4">
        <Button
          type="submit"
          className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl py-4 text-base font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Envoi en cours...
            </>
          ) : type.includes('simulation') ? (
            <>
              <Calculator className="h-5 w-5 mr-3" />
              Obtenir un devis précis
            </>
          ) : (
            <>
              <Mail className="h-5 w-5 mr-3" />
              Envoyer ma demande
            </>
          )}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="flex-1 rounded-xl py-4 text-base font-semibold border-[#D3D3D3] hover:border-slate-400 text-slate-700 hover:text-slate-800 transition-all duration-300"
          disabled={submitting}
        >
          Annuler
        </Button>
      </div>
    </form>
  ), [formData, handleInputChange, handleSubmit, submitting, type, getDefaultMessage, onClose]);

  const renderModalContent = useMemo(() => {
    switch (type) {
      case 'service':
        return renderServiceContent;
      case 'simulation':
        return renderSimulationContent;
      case 'simulation-immobilier':
        return renderSimulationImmobilier;
      case 'analyse-patrimoniale':
        return renderAnalysePatrimoniale;
      default:
        return null;
    }
  }, [type, renderServiceContent, renderSimulationContent, renderSimulationImmobilier, renderAnalysePatrimoniale]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D3D3D3]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* En-tête avec bouton fermer */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl lg:text-3xl font-bold text-[#8B4513]">{getModalTitle()}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800"
              disabled={submitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Contenu dynamique */}
          {renderModalContent}

          {/* Formulaire de contact pour tous les types */}
          {(type === 'contact' || type.includes('simulation') || type === 'analyse-patrimoniale') && renderContactForm}

          {/* Bouton de contact pour le modal service */}
          {type === 'service' && (
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => onOpenModal('contact')}
                className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl py-4 text-base font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-3" />
                Contacter un expert
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-xl py-4 text-base font-semibold border-[#D3D3D3] hover:border-slate-400 text-slate-700 hover:text-slate-800 transition-all duration-300"
              >
                Fermer
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}