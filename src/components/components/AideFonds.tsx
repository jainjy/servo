import React from 'react';
import { DollarSign, TrendingUp, Users, FileText, Target, Award, Clock, CheckCircle, LayoutDashboard } from 'lucide-react';

interface FundingCardProps {
  icon: React.ReactNode;
  title: string;
  amount: string;
  description: string;
  eligibility: string[];
  deadline?: string;
}

interface InvestorCardProps {
  type: string;
  description: string;
  investmentRange: string;
  stage: string[];
}

interface AidesLeveesFondsProps {
  className?: string;
}

const FundingCard: React.FC<FundingCardProps> = ({ 
  icon, 
  title, 
  amount, 
  description, 
  eligibility,
  deadline 
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 group">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="p-3 bg-green-100 rounded-xl text-green-600 mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{amount}</p>
        </div>
      </div>
      {deadline && (
        <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4 mr-1" />
          {deadline}
        </div>
      )}
    </div>
    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
    <div className="border-t border-gray-100 pt-4">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
        Éligibilité
      </h4>
      <ul className="space-y-2">
        {eligibility.map((item, index) => (
          <li key={index} className="flex items-center text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const InvestorCard: React.FC<InvestorCardProps> = ({ 
  type, 
  description, 
  investmentRange, 
  stage 
}) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-colors">
    <h4 className="font-bold text-lg text-gray-900 mb-2">{type}</h4>
    <p className="text-blue-600 font-semibold text-sm mb-3">{investmentRange}</p>
    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2">
      {stage.map((s, index) => (
        <span 
          key={index}
          className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
        >
          {s}
        </span>
      ))}
    </div>
  </div>
);

const AidesLeveesFonds: React.FC<AidesLeveesFondsProps> = ({ className = '' }) => {
  const fundingAids = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Subventions Publiques",
      amount: "Jusqu'à 500 000€",
      description: "Aides non remboursables de l'État, des régions et de l'Europe pour l'innovation et le développement.",
      eligibility: [
        "Projet innovant ou R&D",
        "Création d'emplois",
        "Implantation territoriale",
        "Développement durable"
      ],
      deadline: "Dépôt continu"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Prêts Avantageux",
      amount: "50k€ - 2M€",
      description: "Prêts à taux zéro et prêts participatifs avec garanties de l'État et des régions.",
      eligibility: [
        "PME de moins de 5 ans",
        "Chiffre d'affaires < 50M€",
        "Projet de croissance",
        "Secteur éligible"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Love Money",
      amount: "10k€ - 100k€",
      description: "Financement par votre entourage (famille, amis, proches) avec avantages fiscaux.",
      eligibility: [
        "Projet personnel validé",
        "Réseau solide",
        "Business plan clair",
        "Transparence financière"
      ]
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Crowdfunding",
      amount: "5k€ - 1M€",
      description: "Levée de fonds auprès du grand public via des plateformes spécialisées.",
      eligibility: [
        "Projet à fort impact",
        "Communauté engagée",
        "Campagne marketing",
        "Valeur sociale/environnementale"
      ]
    }
  ];

  const investors = [
    {
      type: "Business Angels",
      investmentRange: "25k€ - 200k€",
      description: "Investisseurs individuels apportant capital et expertise sectorielle.",
      stage: ["Early Stage", "Amorçage", "Série A"]
    },
    {
      type: "Fonds VC",
      investmentRange: "200k€ - 5M€",
      description: "Fonds de capital-risque institutionnels pour croissance rapide.",
      stage: ["Série A", "Série B", "Scale-up"]
    },
    {
      type: "Corporate VC",
      investmentRange: "500k€ - 10M€",
      description: "Fonds d'entreprises pour innovation stratégique et synergies.",
      stage: ["Growth", "Scale-up", "Late Stage"]
    },
    {
      type: "Family Offices",
      investmentRange: "1M€ - 20M€",
      description: "Gestion de patrimoine de grandes familles investisseuses.",
      stage: ["Late Stage", "Growth", "LBO"]
    }
  ];

  const successMetrics = [
    { number: "85%", label: "de succès en levée" },
    { number: "250M€", label: "levés cumulés" },
    { number: "180", label: "investisseurs actifs" },
    { number: "95%", label: "dossiers subventions" }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Diagnostic Financement",
      description: "Analyse de votre éligibilité et définition de la stratégie"
    },
    {
      step: 2,
      title: "Préparation Dossier",
      description: "Business plan, prévisionnels et pitch deck professionnels"
    },
    {
      step: 3,
      title: "Introduction Investisseurs",
      description: "Accès à notre réseau et organisation des rendez-vous"
    },
    {
      step: 4,
      title: "Négociation & Legal",
      description: "Support dans les négociations et closing juridique"
    }
  ];

  return (
    <section className={`py-8 mt-12 rounded-lg ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* En-tête */}
        
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg" alt="" />
          <div className="absolute left-2 bottom-0 inline-flex items-center bg-green-100 text-green-700 px-3 py-2 rounded-full text-xs font-semibold mb-4">
            <DollarSign className="w-4 h-4 mr-2" />
            Financement & Croissance
          </div>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Aides & Levées de Fonds
          </h2>
          <p className="text-md text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Soutien financier complet pour entreprises en croissance. De la recherche de subventions 
            aux levées de fonds ambitieuses, nous vous accompagnons dans tous vos défis financiers.
          </p>
        </div>

        {/* Métriques de succès */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {successMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                {metric.number}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Aides au financement */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
            <Award className="w-8 h-8 mr-3 text-green-600" />
            Aides & Subventions Disponibles
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fundingAids.map((aid, index) => (
              <FundingCard
                key={index}
                icon={aid.icon}
                title={aid.title}
                amount={aid.amount}
                description={aid.description}
                eligibility={aid.eligibility}
                deadline={aid.deadline}
              />
            ))}
          </div>
        </div>

        {/* Processus */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Notre Processus en 4 Étapes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Types d'investisseurs */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Réseau d'Investisseurs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investors.map((investor, index) => (
              <InvestorCard
                key={index}
                type={investor.type}
                description={investor.description}
                investmentRange={investor.investmentRange}
                stage={investor.stage}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à Financer Votre Croissance ?
            </h3>
            <p className="text-green-100 text-sm mb-6 max-w-2xl mx-auto">
              Évaluez votre éligibilité aux aides et découvrez le potentiel de levée 
              de fonds de votre entreprise avec notre diagnostic gratuit.
            </p>
              {/* 
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg text-sm">
                <LayoutDashboard /> Diagnostic Gratuit
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-green-600 transition-colors duration-300 text-sm">
                Rencontrer un Expert
              </button>
            </div>
            <p className="text-green-200 text-sm mt-4">
              Analyse complète sous 48h - Sans engagement
            </p>*/}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AidesLeveesFonds;