import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { financementAPI } from "@/lib/api";
import ModalAssurance from "@/components/components/ModalAssurance";
import {
  Shield,
  Home,
  FileText,
  Calculator,
  Phone,
  Mail,
  CheckCircle,
  BadgeDollarSign,
  Heart,
  Car,
  Plane,
  Users,
  X,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdvertisementPopup from "@/components/AdvertisementPopup";
import Allpub from "@/components/Allpub";

// Types
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
}

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  message: string;
}



// Données de fallback en cas d'erreur API
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

export default function Assurance() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData>({
    selectedAssurance: null
  });

  const { isAuthenticated } = useAuth();
  const [servicesAssurance, setServicesAssurance] = useState<AssuranceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoriesAssurance = [
    {
      icon: Home,
      title: "Assurances Habitation",
      description: "Protégez votre logement et vos biens avec une couverture adaptée à votre mode de vie",
      features: ["Incendie", "Dégâts des eaux", "Vol", "Responsabilité civile", "Catastrophes naturelles", "Bris de glace"],
      color: "bg-[#6B8E23]/10",
      textColor: "text-[#556B2F]",
      borderColor: "border-[#6B8E23]/20",
      imageUrl: "https://i.pinimg.com/736x/08/39/28/083928363559c12f69700ee25cab4117.jpg",
      details: {
        avantages: [
          "Souscription 100% en ligne disponible",
          "Modification des garanties à tout moment sans frais",
          "Assistance dépannage 24h/24 et 7j/7",
          "Expert dédié disponible par téléphone",
          "Déclaration de sinistre via application mobile"
        ],
        infosPratiques: [
          "Franchise standard : 150€ pour le vol, 230€ pour les dégâts des eaux",
          "Inventaire recommandé pour les biens de valeur",
          "Délai de carence : 48h pour la garantie vol",
          "Déclaration de sinistre sous 5 jours ouvrés maximum",
          "Évaluation des biens par un expert en cas de sinistre important"
        ],
        délaiTraitement: "Traitement moyen des sinistres : 10 à 15 jours ouvrés",
        niveauCouverture: "3 formules : Économique, Confort, Premium avec des plafonds variables",
        exclusions: [
          "Dégâts causés par le vieillissement ou usure normale",
          "Dommages résultant d'un défaut d'entretien évident",
          "Bijoux et œuvres d'art sans expertise préalable",
          "Dommages causés intentionnellement par l'assuré",
          "Catastrophes nucléaires ou actes de guerre"
        ],
        documentsRequis: [
          "Attestation de propriété ou bail",
          "Surface habitable du logement",
          "Valeur estimée des biens à assurer",
          "Description des éléments de valeur"
        ],
        conseils: [
          "Faites régulièrement l'inventaire de vos biens",
          "Conservez les factures d'achat importantes",
          "Vérifiez les plafonds de garantie avant souscription",
          "Mettez à jour votre contrat en cas d'acquisition de biens de valeur"
        ]
      }
    },
    {
      icon: Shield,
      title: "Assurances Professionnelles",
      description: "Protégez votre activité, vos employés et vos responsabilités légales",
      features: ["Décennale", "RC Pro", "GFA", "Dommage ouvrage", "Protection juridique", "Perte d'exploitation"],
      color: "bg-[#6B8E23]/10",
      textColor: "text-logo",
      borderColor: "border-[#6B8E23]/20",
      imageUrl: "https://i.pinimg.com/736x/7e/d6/5a/7ed65a934c44e7486ba52a5c813b45b8.jpg",
      details: {
        avantages: [
          "Tarifs dégressifs selon le nombre d'employés",
          "Couverture internationale optionnelle",
          "Assistance juridique professionnelle incluse",
          "Extension aux sous-traitants possible",
          "Personnalisation selon le secteur d'activité"
        ],
        infosPratiques: [
          "Obligatoire pour les professions réglementées (artisans, professions libérales...)",
          "Montant de garantie adapté au chiffre d'affaires",
          "Déclaration d'activité à jour obligatoire",
          "Renouvellement automatique avec tacite reconduction",
          "Majoration possible en cas de sinistres répétés"
        ],
        délaiTraitement: "Traitement des déclarations sous 48h en semaine",
        niveauCouverture: "Formule sur mesure selon métier et taille d'entreprise",
        exclusions: [
          "Faute intentionnelle ou dolosive du dirigeant",
          "Dommages couverts par d'autres assurances obligatoires",
          "Activités non déclarées ou illicites",
          "Conséquences directes de la faillite",
          "Dommages survenus avant la date d'effet du contrat"
        ],
        documentsRequis: [
          "KBis de moins de 3 mois",
          "Chiffre d'affaires des 3 dernières années",
          "Description détaillée de l'activité",
          "Liste des employés et sous-traitants",
          "Contrats de travaux pour la décennale"
        ],
        conseils: [
          "Vérifiez les obligations légales de votre profession",
          "Assurez-vous que les plafonds correspondent à vos projets",
          "Consultez un expert pour les activités à risques",
          "Mettez à jour votre contrat lors de l'embauche de personnel",
          "Archivez tous les documents relatifs à votre activité"
        ]
      }
    },
    {
      icon: Car,
      title: "Assurances Automobile",
      description: "Sécurité et protection pour vos déplacements et votre véhicule",
      features: ["Tous risques", "Au tiers", "Assistance 0km", "Bris de glace", "Vol", "Incendie"],
      color: "bg-[#556B2F]/10",
      textColor: "text-[#556B2F]",
      borderColor: "border-[#556B2F]/20",
      imageUrl: "https://i.pinimg.com/736x/70/73/55/70735556b223ba73299590b987d840bc.jpg",
      details: {
        avantages: [
          "Premier sinistre sans franchise pour les nouveaux clients",
          "Véhicule de remplacement inclus selon formule",
          "Assistance dépannage et remorquage illimité",
          "Tiers payant sur les réparations agréées",
          "Réduction fidélité jusqu'à 50% après 3 ans"
        ],
        infosPratiques: [
          "Délai de rétractation : 14 jours calendaires",
          "Franchise variable selon l'âge du conducteur et du véhicule",
          "Majoration possible en fonction du bonus/malus",
          "Déclaration de sinistre sous 48h après l'accident",
          "Constat amiable électronique disponible"
        ],
        délaiTraitement: "Indemnisation sous 7 jours après expertise",
        niveauCouverture: "4 formules : Responsabilité civile, Intermédiaire, Confort, Tous risques",
        exclusions: [
          "Conducteur non déclaré au contrat",
          "Usage professionnel non autorisé",
          "Défaut d'entretien mécanique avéré",
          "Conduite en état d'ivresse ou sous stupéfiants",
          "Course ou compétition non déclarée"
        ],
        documentsRequis: [
          "Carte grise du véhicule",
          "Permis de conduire du conducteur principal",
          "Historique bonus/malus si anciennement assuré",
          "Kilométrage annuel estimé",
          "Lieu de garage habituel"
        ],
        conseils: [
          "Adaptez la formule à l'âge et la valeur de votre véhicule",
          "Déclarez tous les conducteurs habituels",
          "Souscrivez une assistance 0km pour les longs trajets",
          "Vérifiez les franchises avant chaque départ en vacances",
          "Conservez les factures d'entretien régulier"
        ]
      }
    },
    {
      icon: Heart,
      title: "Assurances Santé & Vie",
      description: "Prévoyance et protection pour votre santé et votre avenir",
      features: ["Complémentaire santé", "Prévoyance", "Dépendance", "Obsèques", "Invalidité", "Capital décès"],
      color: "bg-[#6B8E23]/10",
      textColor: "text-[#6B8E23]",
      borderColor: "border-[#6B8E23]/20",
      imageUrl: "https://i.pinimg.com/1200x/c4/b9/85/c4b985f1a8e0ef855f514a827bc9d8d0.jpg",
      details: {
        avantages: [
          "Tiers payant intégral chez les professionnels conventionnés",
          "Forfaits prévention (ostéopathie, diététique, psychologie)",
          "Hospitalisation en chambre particulière",
          "Délais de carence réduits pour les nouveaux nés",
          "Option médecines douces et alternatives"
        ],
        infosPratiques: [
          "Délai de carence : 3 mois pour certaines garanties",
          "Questionnaire médical obligatoire au-delà de certains montants",
          "Possibilité d'augmenter les garanties sans nouvel examen médical",
          "Capital garanti et participations aux bénéfices",
          "Avance sur frais d'hospitalisation possible"
        ],
        délaiTraitement: "Remboursement sous 48h pour la télétransmission",
        niveauCouverture: "Forfaits personnalisables : Individuel, Couple, Famille, Senior",
        exclusions: [
          "Maladies préexistantes non déclarées",
          "Soins esthétiques non thérapeutiques",
          "Actes non remboursés par la Sécurité Sociale",
          "Suites de conflits ou d'actes de guerre",
          "Conséquences d'actes intentionnels"
        ],
        documentsRequis: [
          "Carte Vitale et attestation de droits",
          "Questionnaire médical pour les hauts capitaux",
          "État civil complet des bénéficiaires",
          "Renseignements sur les antécédents médicaux familiaux",
          "Justificatifs de profession et revenus"
        ],
        conseils: [
          "Adaptez votre contrat à votre situation familiale",
          "Pensez à la dépendance dès 50 ans",
          "Vérifiez les délais de carence avant souscription",
          "Mettez à jour vos bénéficiaires régulièrement",
          "Consultez le tableau des garanties avant tout soin coûteux"
        ]
      }
    }
  ];

  const handleOpenModal = (categorie) => {
    const categorieWithImage = {
      ...categorie,
      // Garder l'imageUrl existante au lieu de la générer
    };
    setSelectedCategorie(categorieWithImage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategorie(null);
  };


  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const assurancesResponse = await financementAPI.getAssurances();
        setServicesAssurance(assurancesResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données. Affichage des données de démonstration.');
        setServicesAssurance(servicesAssuranceFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (modalType: string, data: Partial<ModalData> = {}) => {
    setActiveModal(modalType);
    setModalData(prev => ({ ...prev, ...data }));
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData({
      selectedAssurance: null
    });
  };

  const handleAssuranceClick = (assurance: AssuranceService) => {
    openModal('contact', { selectedAssurance: assurance });
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const demandeData = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        message: formData.message,
        type: 'assurance',
        assuranceId: modalData.selectedAssurance?.id
      };

      const response = await financementAPI.submitDemande(demandeData);

      if (response.data.success) {
        alert("Votre demande de devis a été envoyée avec succès !");
        closeModal();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    }
  };

  // Fonction utilitaire pour vérifier si c'est une URL d'image
  const isImageUrl = (icon: any): boolean => {
    if (typeof icon === 'string') {
      return icon.startsWith('/') || icon.startsWith('https://');
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-white to-slate-100 flex flex-col">
        <div className="flex-col flex-1 flex items-center justify-center">
          <img src="/loading.gif" alt="" className='w-24 h-24' />
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-white to-slate-100 flex flex-col">
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
      <section className="relative pt-16 pb-44 overflow-hidden">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://i.pinimg.com/1200x/23/18/ba/2318ba8d8dd3bcc8f5e0bd17347032bd.jpg')`
            }}
          />
          {/* Overlay noir avec opacité */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Option: dégradé supplémentaire pour plus de contraste */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70"></div>
        </div>

        <div className="container mx-auto px-4 pt-10 h-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-2xl uppercase lg:text-5xl md:text-6xl font-medium mb-6 text-white drop-shadow-lg">
              Assurance
            </h1>
            <p className="text-sm text-slate-100 mb-4 lg:mb-10 leading-relaxed drop-shadow">
              Protégez votre projet, votre patrimoine et votre activité avec nos assurances sur mesure.
              Des solutions adaptées à vos besoins spécifiques.
            </p>

            <div className="flex flex-wrap gap-5 justify-center">
              <motion.div>
                <Button
                  className="bg-white hover:bg-white/80 text-slate-900 rounded-xl px-8 py-5 text-lg font-semibold border-2 border-white hover:border-white/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => openModal('service-assurance')}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Découvrir nos assurances
                </Button>
              </motion.div>

              <motion.div>
                <Button
                  className="bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => openModal('devis')}
                >
                  <Calculator className="h-5 w-5 mr-3" />
                  Demander un devis
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Catégories d'Assurance */}
      <section className="py-8 lg:py-4 bg-[#FAFAFA]" id="categories-assurance">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-slate-900">
              Nos <span className="text-[#556B2F]">Catégories d'Assurance</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Des solutions de protection adaptées à chaque aspect de votre vie
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categoriesAssurance.map((categorie, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="p-6 h-full cursor-pointer border border-[#D3D3D3] rounded-2xl hover:shadow-xl transition-all duration-300 bg-white group"
                  onClick={() => handleOpenModal(categorie)}
                >
                  <div className={`w-12 h-12 rounded-xl ${categorie.color} flex items-center justify-center mb-4 group-hover:${categorie.textColor.replace('text-', 'bg-')} transition-colors duration-300`}>
                    {isImageUrl(categorie.icon) ? (
                      <img src={categorie.icon} alt={categorie.title} className="h-6 w-6 object-cover rounded-lg" />
                    ) : (
                      <categorie.icon className={`h-6 w-6 ${categorie.textColor} group-hover:text-white transition-colors duration-300`} />
                    )}
                  </div>
                  <h3 className={`text-xl font-bold ${categorie.textColor} mb-3`}>{categorie.title}</h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">{categorie.description}</p>
                  <ul className="space-y-2">
                    {categorie.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-secondary-text mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center text-[#556B2F] font-semibold text-sm group-hover:text-[#6B8E23] transition-colors duration-300">
                    En savoir plus
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <ModalAssurance isOpen={isModalOpen} onClose={handleCloseModal} data={selectedCategorie} />
        </div>
      </section>

      <AdvertisementPopup position="page-assurance-1" showOnMobile={true}/>

      {/* Section Services d'Assurance */}
      <section className="py-8 lg:py-4 bg-white" id="services-assurance">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-slate-900">
              Nos <span className="text-[#556B2F]">Services d'Assurance</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Des solutions complètes pour protéger tous les aspects de votre vie
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
                    <div className="w-14 h-14 rounded-xl bg-[#6B8E23]/10 flex items-center justify-center group-hover:bg-[#556B2F] transition-colors duration-300">
                      {isImageUrl(assurance.icon) ? (
                        <img src={assurance.icon} alt={assurance.nom} className="h-7 w-7 object-cover rounded-lg" />
                      ) : assurance.icon ? (
                        <assurance.icon className="h-7 w-7 text-[#556B2F] group-hover:text-white transition-colors duration-300" />
                      ) : (
                        <Shield className="h-7 w-7 text-[#556B2F] group-hover:text-white transition-colors duration-300" />
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
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AdvertisementPopup position="page-assurance-2" showOnMobile={true}/>

      {/* Section Avantages */}
      <section className="py-8 lg:py-4 bg-[#FAFAFA]" id="avantages-assurance">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-slate-900">
              Pourquoi choisir <span className="text-[#556B2F]">nos assurances</span> ?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Couvertures Adaptées",
                description: "Des garanties sur mesure pour répondre à vos besoins spécifiques"
              },
              {
                icon: Calculator,
                title: "Devis Gratuit",
                description: "Obtenez un devis personnalisé sans engagement en quelques clics"
              },
              {
                icon: CheckCircle,
                title: "Expertise reconnue",
                description: "Des conseillers spécialisés pour vous accompagner"
              },
              {
                icon: Heart,
                title: "Service Client Premium",
                description: "Un accompagnement personnalisé tout au long de votre contrat"
              }
            ].map((avantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 border border-[#D3D3D3] rounded-2xl bg-white text-center">
                  <div className="w-16 h-16 rounded-xl bg-[#6B8E23]/10 flex items-center justify-center mx-auto mb-4">
                    {isImageUrl(avantage.icon) ? (
                      <img src={avantage.icon} alt={avantage.title} className="h-8 w-8 object-cover rounded-lg" />
                    ) : (
                      <avantage.icon className="h-8 w-8 text-[#556B2F]" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-logo mb-3">{avantage.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{avantage.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AdvertisementPopup position="page-assurance-3" showOnMobile={true}/>

      {/* CTA Section */}
      <section className="py-2 lg:py-4 m-4" id="devis-assurance">
        <div className="container mx-auto py-10 rounded-lg  bg-white shadow-xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-6 text-logo">
              Besoin d'une protection adaptée ?
            </h2>
            <p className="text-sm text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nos experts en assurance sont à votre écoute pour vous proposer la solution la plus adaptée à vos besoins
            </p>
            <motion.div>
              <Button
                className="bg-[#556B2F] text-white hover:bg-[#6B8E23] rounded-xl text-lg font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300"
                onClick={() => openModal('contact')}
              >
                <Phone className="h-5 w-5" />
                Demander un devis gratuit
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modal Unique */}
      {activeModal && (
        <AssuranceModal
          type={activeModal}
          data={modalData}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  );
}

// ----------- Modal Assurance -----------
interface AssuranceModalProps {
  type: string;
  data: ModalData;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

function AssuranceModal({ type, data, onClose, onSubmit }: AssuranceModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    email: "",
    telephone: "",
    message: ""
  });
  const { isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Veuillez vous connecter ou vous inscrire pour demander un devis.");
      return;
    }
    setSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        message: ""
      });
    } catch (error) {
      console.error('Erreur envoi demande:', error);
      alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'service-assurance':
        return "Nos services d'assurance";
      case 'devis':
        return "Demande de devis d'assurance";
      case 'contact':
        if (data.selectedAssurance) return `Devis ${data.selectedAssurance.nom}`;
        return "Contactez-nous";
      default:
        return "Demande d'information";
    }
  };

  const getDefaultMessage = () => {
    if (data.selectedAssurance) {
      return `Bonjour, je souhaite obtenir un devis pour l'assurance ${data.selectedAssurance.nom}.`;
    }
    return "Bonjour, je souhaite obtenir des informations sur vos services d'assurance.";
  };

  const renderServiceContent = () => (
    <>
      <p className="text-slate-600 mb-8 text-lg leading-relaxed">
        Une protection complète pour tous les aspects de votre vie
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          {
            icon: Home,
            title: "Protection Patrimoniale",
            description: "Assurances habitation, automobile, multirisque"
          },
          {
            icon: Shield,
            title: "Protection Professionnelle",
            description: "Assurances décennale, RC Pro, garanties"
          },
          {
            icon: Heart,
            title: "Protection Personnelle",
            description: "Assurances santé, prévoyance, dépendance"
          },
          {
            icon: BadgeDollarSign,
            title: "Protection Financière",
            description: "Assurances de prêt, garanties loyers impayés"
          }
        ].map((service, index) => (
          <Card key={index} className="p-6 border border-[#D3D3D3] rounded-xl hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/10 flex items-center justify-center mr-4">
                <service.icon className="h-6 w-6 text-[#556B2F]" />
              </div>
              <h3 className="font-semibold text-[#8B4513] text-lg">{service.title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
          </Card>
        ))}
      </div>
    </>
  );

  const renderContactForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {data.selectedAssurance && (
        <div className="mb-6 p-4 bg-[#6B8E23]/10 rounded-xl border border-[#6B8E23]/20">
          <h4 className="font-semibold text-[#556B2F] mb-2">Assurance sélectionnée :</h4>
          <p className="text-[#8B4513] font-medium">{data.selectedAssurance.nom}</p>
          <p className="text-sm text-slate-600 mt-1">{data.selectedAssurance.description}</p>
        </div>
      )}

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
          ) : (
            <>
              <Mail className="h-5 w-5 mr-3" />
              Demander un devis
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
  );

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
          <div className="flex justify-between items-center ">
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
          {type === 'service-assurance' && renderServiceContent()}

          {/* Formulaire de contact pour tous les types */}
          {(type === 'contact' || type === 'devis') && renderContactForm()}

          {/* Bouton de contact pour le modal service */}
          {type === 'service-assurance' && (
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => onClose()}
                className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white rounded-xl py-4 text-base font-semibold border-2 border-[#556B2F] hover:border-[#6B8E23] transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-3" />
                Contacter un conseiller
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