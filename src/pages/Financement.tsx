import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
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
  ArrowRight
} from "lucide-react";

// Données des partenaires financement
const partenairesFinancement = [
  {
    id: 1,
    nom: "Crédit Agricole",
    description: "Banque leader en financement immobilier et professionnel",
    rating: 4.7,
    avantages: ["Taux préférentiels", "Accompagnement personnalisé", "Réseau national"],
    icon: Building2,
    type: "banque"
  },
  {
    id: 2,
    nom: "Courtiers Partenaires",
    description: "Réseau de courtiers experts en financement",
    rating: 4.9,
    avantages: ["Comparaison multi-banques", "Négociation des taux", "Service gratuit"],
    icon: Users,
    type: "courtier"
  },
  {
    id: 3,
    nom: "Spécialistes Immobilier",
    description: "Experts en financement de projets immobiliers",
    rating: 4.8,
    avantages: ["Prêts sur mesure", "Expertise sectorielle", "Délais optimisés"],
    icon: Home,
    type: "expert"
  }
];

// Données des assurances
const servicesAssurance = [
  {
    id: 1,
    nom: "Assurance Décennale",
    description: "Protection obligatoire pour les professionnels du bâtiment",
    icon: Shield,
    details: "Couverture des dommages affectant la solidité de l'ouvrage",
    obligatoire: true,
    public: "Professionnels construction"
  },
  {
    id: 2,
    nom: "Assurance Dommage Ouvrage",
    description: "Garantie pour les maîtres d'ouvrage",
    icon: FileText,
    details: "Protection dès la réception des travaux",
    obligatoire: true,
    public: "Maîtres d'ouvrage"
  },
  {
    id: 3,
    nom: "Assurance Habitation",
    description: "Protection complète de votre logement",
    icon: Home,
    details: "Incendie, dégâts des eaux, vol, responsabilité civile",
    obligatoire: false,
    public: "Particuliers"
  },
  {
    id: 4,
    nom: "Assurance Prêt Immobilier",
    description: "Protection de votre crédit immobilier",
    icon: BadgeDollarSign,
    details: "Décès, invalidité, perte d'emploi",
    obligatoire: false,
    public: "Emprunteurs"
  },
  {
    id: 5,
    nom: "Assurance Responsabilité Civile Pro",
    description: "Protection de votre activité professionnelle",
    icon: Users,
    details: "Dommages causés aux tiers dans le cadre professionnel",
    obligatoire: true,
    public: "Professionnels"
  },
  {
    id: 6,
    nom: "Assurance Santé",
    description: "Complémentaire santé entreprise et particuliers",
    icon: Heart,
    details: "Couverture santé optimale",
    obligatoire: false,
    public: "Entreprises & Particuliers"
  }
];

export default function Financement() {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({
    selectedAssurance: null,
    selectedPartenaire: null,
    simulationData: null
  });

  const openModal = (modalType, data = {}) => {
    setActiveModal(modalType);
    setModalData(prev => ({ ...prev, ...data }));
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData({
      selectedAssurance: null,
      selectedPartenaire: null,
      simulationData: null
    });
  };

  const handleAssuranceClick = (assurance) => {
    openModal('contact', { selectedAssurance: assurance });
  };

  const handlePartenaireClick = (partenaire) => {
    openModal('contact', { selectedPartenaire: partenaire });
  };

  const handleSimulationSubmit = (simulationData) => {
    openModal('contact', { 
      simulationData,
      message: `Bonjour, je suis intéressé par une simulation de financement. Montant: ${simulationData.montant}€, Durée: ${simulationData.duree} ans. Estimation: ${simulationData.estimation}€/mois.`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      <Header />
      
      {/* Hero Section avec background image */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')`
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Financement & <span className="text-blue-400">Assurance</span>
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed">
              Des solutions complètes pour financer votre projet et le protéger avec nos partenaires de confiance. 
              Accompagnement personnalisé de A à Z.
            </p>

            <div className="flex flex-wrap gap-5 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-slate-700 hover:border-slate-600 transition-all duration-300"
                  onClick={() => openModal('service')}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Découvrir nos services
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-blue-500 hover:border-blue-400 transition-all duration-300"
                  onClick={() => openModal('simulation')}
                >
                  <Calculator className="h-5 w-5 mr-3" />
                  Simuler mon financement
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Partenaires Financement */}
      <section className="py-20 bg-white" id="partenaires">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Nos <span className="text-slate-900">Partenaires Financement</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                <Card className="p-8 h-full border border-slate-200 rounded-2xl hover:shadow-2xl transition-all duration-500 bg-white group">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mr-5 group-hover:bg-slate-900 transition-colors duration-300">
                      <partenaire.icon className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{partenaire.nom}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 ml-2">{partenaire.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">{partenaire.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {partenaire.avantages.map((avantage, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{avantage}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-4 text-base font-semibold transition-all duration-300 border-2 border-slate-900 hover:border-slate-800"
                    onClick={() => handlePartenaireClick(partenaire)}
                  >
                    <Handshake className="h-5 w-5 mr-3" />
                    Contacter ce partenaire
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Assurance */}
      <section className="py-20 bg-slate-50" id="assurances">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Solutions <span className="text-slate-900">d'Assurance</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                  className="p-8 h-full border border-slate-200 rounded-2xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white group"
                  onClick={() => handleAssuranceClick(assurance)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                      <assurance.icon className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    {assurance.obligatoire && (
                      <span className="px-3 py-1.5 bg-orange-100 text-orange-800 text-sm font-medium rounded-full border border-orange-200">
                        Obligatoire
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{assurance.nom}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{assurance.description}</p>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">{assurance.details}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-600 font-medium">{assurance.public}</span>
                    <div className="flex items-center text-slate-900 font-semibold text-sm group-hover:text-slate-700 transition-colors duration-300">
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

      {/* CTA Section */}
      <section className="py-20 bg-white" id="audit">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-900">
              Prêt à concrétiser votre projet ?
            </h2>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nos experts sont à votre écoute pour vous accompagner dans votre financement et vos assurances
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-10 py-5 text-lg font-semibold border-2 border-white hover:border-slate-100 transition-all duration-300"
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
          onSimulationSubmit={handleSimulationSubmit}
        />
      )}
    </div>
  );
}

// ----------- Modal Universel -----------
function UniversalModal({ type, data, onClose, onSimulationSubmit }) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    montant: "",
    duree: ""
  });

  const [estimation, setEstimation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if ((name === 'montant' || name === 'duree') && formData.montant && formData.duree) {
      const montant = name === 'montant' ? value : formData.montant;
      const duree = name === 'duree' ? value : formData.duree;
      if (montant && duree) {
        const mensualite = Math.round((parseInt(montant) / (parseInt(duree) * 12)) * 100) / 100;
        setEstimation(mensualite);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (type === 'simulation' && estimation) {
      onSimulationSubmit({
        montant: formData.montant,
        duree: formData.duree,
        estimation: estimation
      });
    } else {
      console.log("Formulaire envoyé:", formData);
      alert("Votre demande a été envoyée avec succès !");
      onClose();
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'service':
        return "Nos services de financement";
      case 'simulation':
        return "Simulation de financement";
      case 'contact':
        if (data.selectedAssurance) return `Devis ${data.selectedAssurance.nom}`;
        if (data.selectedPartenaire) return `Contact ${data.selectedPartenaire.nom}`;
        if (data.simulationData) return "Demande de financement";
        return "Contactez-nous";
      default:
        return "Demande d'information";
    }
  };

  const getDefaultMessage = () => {
    if (data.selectedAssurance) {
      return `Bonjour, je souhaite obtenir un devis pour l'assurance ${data.selectedAssurance.nom}.`;
    }
    if (data.selectedPartenaire) {
      return `Bonjour, je souhaite contacter ${data.selectedPartenaire.nom} pour discuter de financement.`;
    }
    if (data.simulationData) {
      return data.message;
    }
    return "Bonjour, je souhaite obtenir des informations sur vos services de financement et assurance.";
  };

  const renderServiceContent = () => (
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
          <Card key={index} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mr-4">
                <service.icon className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">{service.title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
          </Card>
        ))}
      </div>
    </>
  );

  const renderSimulationContent = () => (
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
            className="w-full rounded-xl border-slate-300 focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-left">
            Durée du prêt
          </label>
          <Select 
            name="duree" 
            value={formData.duree} 
            onValueChange={(value) => handleInputChange({ target: { name: 'duree', value } })}
          >
            <SelectTrigger className="rounded-xl border-slate-300 focus:border-slate-900">
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

        {estimation && (
          <Card className="p-6 bg-green-50 border-green-200 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-3 text-lg">Estimation mensuelle</h4>
            <p className="text-3xl font-bold text-green-600">
              {estimation} €/mois*
            </p>
            <p className="text-sm text-green-600 mt-3">*Estimation hors assurance et frais</p>
          </Card>
        )}
      </div>
    </>
  );

  const renderContactForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            name="nom"
            placeholder="Nom complet"
            value={formData.nom}
            onChange={handleInputChange}
            required
            className="w-full rounded-xl border-slate-300 focus:border-slate-900"
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
            className="w-full rounded-xl border-slate-300 focus:border-slate-900"
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
        className="w-full rounded-xl border-slate-300 focus:border-slate-900"
      />

      <div>
        <textarea
          name="message"
          placeholder="Votre message"
          rows={5}
          value={formData.message || getDefaultMessage()}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-4 text-base font-semibold border-2 border-slate-900 hover:border-slate-800 transition-all duration-300"
        >
          {type === 'simulation' ? (
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
          className="flex-1 rounded-xl py-4 text-base font-semibold border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 transition-all duration-300"
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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* En-tête avec bouton fermer */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">{getModalTitle()}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Contenu dynamique */}
          {type === 'service' && renderServiceContent()}
          {type === 'simulation' && renderSimulationContent()}
          
          {/* Formulaire de contact pour tous les types */}
          {(type === 'contact' || type === 'simulation') && renderContactForm()}
          
          {/* Bouton de contact pour le modal service */}
          {type === 'service' && (
            <div className="flex gap-4 mt-8">
              <Button 
                onClick={() => openModal('contact')}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-4 text-base font-semibold border-2 border-slate-900 hover:border-slate-800 transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-3" />
                Contacter un expert
              </Button>
              <Button 
                onClick={onClose}
                variant="outline" 
                className="flex-1 rounded-xl py-4 text-base font-semibold border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 transition-all duration-300"
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