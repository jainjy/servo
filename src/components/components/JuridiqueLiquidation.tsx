import React from 'react';
import { Scale, FileText, Shield, AlertTriangle, Building, Users, Clock, CheckCircle, ArrowRight, TrendingUp, Handshake, DollarSign } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  urgent?: boolean;
}

interface LiquidationStepProps {
  number: number;
  title: string;
  description: string;
  duration: string;
}

interface CessionStepProps {
  number: number;
  title: string;
  description: string;
  duration: string;
}

interface JuridiqueLiquidationProps {
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features, urgent }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border relative ${urgent ? 'border-red-200 hover:border-red-300' : 'border-gray-100 hover:border-purple-200'
    }`}>
    {urgent && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
        <AlertTriangle className="w-3 h-3 mr-1" />
        URGENT
      </div>
    )}
    <div className="flex items-start mb-4">
      <div className={`p-3 rounded-xl mr-4 flex-shrink-0 ${urgent ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
        }`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
    <ul className="space-y-2 mt-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-700">
          <CheckCircle className={`w-4 h-4 mr-3 ${urgent ? 'text-red-500' : 'text-purple-500'
            }`} />
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const LiquidationStep: React.FC<LiquidationStepProps> = ({
  number,
  title,
  description,
  duration
}) => (
  <div className="flex items-start bg-gray-50 rounded-lg p-4 hover:bg-white transition-colors">
    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0 mt-1">
      {number}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
          {duration}
        </span>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const CessionStep: React.FC<CessionStepProps> = ({
  number,
  title,
  description,
  duration
}) => (
  <div className="flex items-start bg-blue-50 rounded-lg p-4 hover:bg-white transition-colors">
    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0 mt-1">
      {number}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {duration}
        </span>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const JuridiqueLiquidation: React.FC<JuridiqueLiquidationProps> = ({ className = '' }) => {

  const liquidationTypes = [
    {
      type: "Liquidation Amiable",
      description: "Processus volontaire pour cessation d'activité planifiée",
      duration: "2-4 mois",
      advantages: ["Préservation du dirigeant", "Contrôle du processus", "Coûts maîtrisés"]
    },
    {
      type: "Liquidation Judiciaire",
      description: "Procédure encadrée par le tribunal pour cessation définitive",
      duration: "6-12 mois",
      advantages: ["Arrêt des poursuites", "Clôture définitive", "Effacement des dettes"]
    },
    {
      type: "Redressement Judiciaire",
      description: "Tentative de sauvegarde et continuation de l'entreprise",
      duration: "3-18 mois",
      advantages: ["Période d'observation", "Plan de continuation", "Aides spécifiques"]
    }
  ];

  const liquidationSteps = [
    {
      number: 1,
      title: "Analyse de la Situation",
      description: "Évaluation complète de la situation financière et juridique",
      duration: "48h"
    },
    {
      number: 2,
      title: "Choix de la Procédure",
      description: "Sélection de la solution optimale adaptée à votre situation",
      duration: "1 semaine"
    },
    {
      number: 3,
      title: "Dépôt au Tribunal",
      description: "Préparation et dépôt du dossier auprès du tribunal compétent",
      duration: "72h"
    },
    {
      number: 4,
      title: "Gestion de la Procédure",
      description: "Suivi complet avec le liquidateur et les créanciers",
      duration: "2-12 mois"
    },
    {
      number: 5,
      title: "Clôture Définitive",
      description: "Radiation et clôture complète de la procédure",
      duration: "1 mois"
    }
  ];

  const cessionSteps = [
    {
      number: 1,
      title: "Audit & Évaluation",
      description: "Diagnostic complet : bilan financier, juridique et commercial",
      duration: "2-3 semaines"
    },
    {
      number: 2,
      title: "Valorisation de l'Entreprise",
      description: "Détermination du prix juste et des modalités de paiement",
      duration: "1-2 semaines"
    },
    {
      number: 3,
      title: "Prospection d'Acquéreurs",
      description: "Recherche et présentation aux repreneurs potentiels",
      duration: "4-8 semaines"
    },
    {
      number: 4,
      title: "Négociation & Accord",
      description: "Mise en accord sur les termes et signature des documents",
      duration: "2-4 semaines"
    },
    {
      number: 5,
      title: "Finalisation du Transfert",
      description: "Transfert des actifs, clients, contrats et clôture de la transition",
      duration: "2-4 semaines"
    }
  ];

  const cessionTypes = [
    {
      type: "Cession Totale",
      description: "Vente complète de l'entreprise à un tiers ou société d'acquisition",
      duration: "2-4 mois",
      advantages: ["Sortie complète", "Maximisation de la valeur", "Transition accompagnée"]
    },
    {
      type: "Cession Partielle",
      description: "Vente d'une activité, division ou branche spécifique de l'entreprise",
      duration: "2-3 mois",
      advantages: ["Flexibilité", "Conservation d'activités", "Diversification"]
    },
    {
      type: "Reprise par Management",
      description: "Vente de l'entreprise à votre direction ou votre équipe",
      duration: "3-6 mois",
      advantages: ["Continuité garantie", "Confiance élevée", "Facilités de financement"]
    }
  ];

  const emergencyServices = [
    {
      title: "Urgence Cessation de Paiement",
      description: "Déclaration dans les 48h obligatoires",
      delay: "48h",
      critical: true
    },
    {
      title: "Saisie Imminente",
      description: "Blocage des procédures d'exécution",
      delay: "24h",
      critical: true
    },
    {
      title: "Conflit Actionnaire",
      description: "Médiation urgente et résolution de crise",
      delay: "72h",
      critical: false
    },
    {
      title: "Contrôle Fiscal/URSSAF",
      description: "Assistance immédiate lors des contrôles",
      delay: "Immédiat",
      critical: true
    }
  ];

  return (
    <section className={`py-8 mt-12 rounded-lg ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">

        {/* En-tête */}
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/06/b1/dc/06b1dc5f7bcca0813ec75fc60af71120.jpg" alt="" />
          <div className="absolute left-2 bottom-0 inline-flex items-center bg-violet-100 text-violet-700 px-3 py-2 rounded-full text-xs font-semibold mb-4">
            <Scale className="w-4 h-4 mr-2" />
            Expertise Juridique & Liquidation
          </div>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Cession & Liquidation
          </h2>
          <p className="text-sm text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Services juridiques complets pour entreprises, de la création à la liquidation.
            Notre expertise vous accompagne dans toutes les étapes de la vie de votre société.
          </p>
        </div>

        {/* Types de Liquidation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Procédures de Liquidation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liquidationTypes.map((procedure, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                <h4 className="font-bold text-lg text-gray-900 mb-3">{procedure.type}</h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{procedure.description}</p>
                <div className="flex items-center text-sm text-purple-600 font-semibold mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  Durée moyenne : {procedure.duration}
                </div>
                <div className="space-y-2">
                  {procedure.advantages.map((advantage, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {advantage}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Processus de Liquidation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Processus de Liquidation
            </h3>
            <div className="space-y-4">
              {liquidationSteps.map((step) => (
                <LiquidationStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  duration={step.duration}
                />
              ))}
            </div>
          </div>

          {/* Services d'Urgence */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
              Situations d'Urgence
            </h3>
            <div className="space-y-4">
              {emergencyServices.map((service, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${service.critical
                      ? 'border-red-200 bg-red-50'
                      : 'border-orange-200 bg-orange-50'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{service.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${service.critical
                        ? 'bg-red-500 text-white'
                        : 'bg-orange-500 text-white'
                      }`}>
                      {service.delay}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  {service.critical && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Délai légal impératif
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Types de Cession */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-16 border border-blue-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
            <Handshake className="w-8 h-8 mr-3 text-blue-600" />
            Procédures de Cession
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cessionTypes.map((procedure, index) => (
              <div key={index} className="border border-blue-200 bg-white rounded-xl p-6 hover:border-blue-400 hover:shadow-xl transition-all">
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  {procedure.type}
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{procedure.description}</p>
                <div className="flex items-center text-sm text-blue-600 font-semibold mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  Durée moyenne : {procedure.duration}
                </div>
                <div className="space-y-2">
                  {procedure.advantages.map((advantage, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                      {advantage}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processus de Cession */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-blue-600" />
              Processus de Cession
            </h3>
            <div className="space-y-4">
              {cessionSteps.map((step) => (
                <CessionStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  duration={step.duration}
                />
              ))}
            </div>
          </div>

          {/* Avantages de la Cession */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Building className="w-6 h-6 mr-3 text-blue-600" />
              Avantages de la Cession
            </h3>
            <div className="space-y-3">
              {[
                "Sortie rentable et sécurisée de votre entreprise",
                "Maximisation de la valeur lors de la vente",
                "Accompagnement complet du dirigeant et de l'équipe",
                "Gestion de la transmission de patrimoine",
                "Optimisation fiscale et juridique de la transaction",
                "Viabilité long terme pour l'acquéreur",
                "Continuité de l'emploi pour vos collaborateurs",
                "Réseau d'acquéreurs et investisseurs",
                "Financement des acquisitions facilitées",
                "Garantie légale et protection des risques"
              ].map((advantage, idx) => (
                <div key={idx} className="flex items-start bg-white rounded-lg p-3 border border-blue-100 hover:border-blue-300 transition-colors">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Urgence Juridique */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 mr-3" />
              <h3 className="text-2xl md:text-3xl font-bold">
                Situation Critique ?
              </h3>
            </div>
            <p className="text-purple-100 text-sm mb-6 max-w-2xl mx-auto">
              Notre cellule d'urgence juridique est disponible 24h/24 pour les situations
              de crise nécessitant une intervention immédiate (cessation de paiement, saisie, contrôle).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JuridiqueLiquidation;