import React, { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Smartphone,
  Globe,
  FileText,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Award
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

interface CaseStudy {
  id: number;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
}

interface PricingTier {
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}

const CommunicationMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('strategies');
  const [selectedService, setSelectedService] = useState<number>(1);

  const services: Service[] = [
    {
      id: 1,
      title: "Stratégie Marketing Digitale",
      description: "Plan complet pour votre présence en ligne",
      icon: <Target className="w-6 h-6" />,
      features: ["Audit concurrentiel", "Positionnement de marque", "Roadmap digital"]
    },
    {
      id: 2,
      title: "Content Marketing",
      description: "Création de contenu engageant",
      icon: <FileText className="w-6 h-6" />,
      features: ["Stratédie éditoriale", "Création de contenu", "Calendrier de publication"]
    },
    {
      id: 3,
      title: "Réseaux Sociaux",
      description: "Gestion et animation des communautés",
      icon: <Users className="w-6 h-6" />,
      features: ["Stratédie sociale", "Community management", "Analyse de performance"]
    },
    {
      id: 4,
      title: "SEO & Référencement",
      description: "Optimisation pour les moteurs de recherche",
      icon: <TrendingUp className="w-6 h-6" />,
      features: ["Audit technique", "Optimisation on-page", "Netlinking"]
    },
    {
      id: 5,
      title: "Publicité Digitale",
      description: "Campagnes ciblées et mesurables",
      icon: <BarChart3 className="w-6 h-6" />,
      features: ["Google Ads", "Social Ads", "Retargeting"]
    },
    {
      id: 6,
      title: "Marketing Mobile",
      description: "Stratégies adaptées aux mobiles",
      icon: <Smartphone className="w-6 h-6" />,
      features: ["Applications mobiles", "SMS marketing", "Notifications push"]
    }
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      client: "Luxe & Style",
      industry: "Mode & Accessoires",
      challenge: "Faible visibilité en ligne malgré produits premium",
      solution: "Refonte de l'identité digitale et stratégie content marketing",
      results: ["+150% trafic organique", "+80% engagement social", "ROI de 3.2x"]
    },
    {
      id: 2,
      client: "TechSolutions",
      industry: "Technologie B2B",
      challenge: "Génération de leads qualifiés",
      solution: "Campagnes ABM et content marketing spécialisé",
      results: ["+40% leads qualifiés", "Coût par lead -35%", "CAC réduit de 28%"]
    }
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Essentiel",
      price: 990,
      period: "par mois",
      features: [
        "Stratédie marketing de base",
        "3 publications sociales/semaine",
        "Rapport mensuel",
        "Support email",
        "Audit initial"
      ]
    },
    {
      name: "Professionnel",
      price: 2490,
      period: "par mois",
      features: [
        "Stratédie complète",
        "Content marketing",
        "Publicité digitale",
        "Rapports hebdomadaires",
        "Support prioritaire",
        "SEO basique",
        "2 réunions stratégiques/mois"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: 4990,
      period: "par mois",
      features: [
        "Stratédie sur mesure",
        "Team dédiée",
        "Campagnes multicanales",
        "Analytics avancés",
        "Support 24/7",
        "SEO complet",
        "Formations équipe",
        "Accès plateforme premium"
      ]
    }
  ];

  const metrics = [
    { label: "ROI moyen", value: "3.5x", description: "Retour sur investissement" },
    { label: "Clients accompagnés", value: "200+", description: "Depuis 2020" },
    { label: "Taux de satisfaction", value: "98%", description: "Clients satisfaits" },
    { label: "Growth annuel", value: "+45%", description: "Croissance moyenne" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'
      >
        <div
          className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
        />
        <img
          src="https://i.pinimg.com/736x/74/20/fd/7420fdfb89201284c9ba6c6e8fdd1575.jpg"
          className='h-full object-cover w-full'
          alt="Background"
        />
      </div>
      <div className="pt-16 border-b border-gray-200">
        <div className=" container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            
            
            <h1 className="text-xl lg:text-4xl font-light text-white mb-6 tracking-tight">
              Communication & Marketing
            </h1>
            
            <p className="text-md text-gray-200 mb-10 font-light leading-relaxed">
              Stratégies sur mesure pour développer votre activité et accélérer votre croissance
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-logo text-white font-medium rounded-lg hover:bg-logo/90 transition-colors duration-300 flex items-center space-x-2 group">
                <span>Démarrer un projet</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors duration-300">
                Voir nos réalisations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-100 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
              <div className="text-sm font-medium text-gray-600 mb-1">{metric.label}</div>
              <div className="text-xs text-gray-500">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Nos Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une gamme complète de services pour couvrir tous vos besoins en communication et marketing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`bg-white p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                selectedService === service.id 
                  ? 'border-gray-900 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-700 flex items-center">
                En savoir plus
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">Notre Processus en 4 Étapes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Audit & Analyse", desc: "Analyse complète de votre situation actuelle" },
              { step: "02", title: "Stratédie", desc: "Définition d'un plan d'action sur mesure" },
              { step: "03", title: "Implémentation", desc: "Mise en œuvre avec suivi rigoureux" },
              { step: "04", title: "Optimisation", desc: "Ajustements continus pour maximiser les résultats" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-light text-logo mb-4">{item.step}</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 -right-4 w-8 h-px bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className=" text-white py-16">
        <div className="bg-logo py-4 rounded-lg  container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Études de Cas</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Découvrez comment nous transformons les défis en succès
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <div key={study.id} className="bg-logo shadow-xl rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-medium mb-1">{study.client}</h3>
                    <span className="text-sm text-gray-300">{study.industry}</span>
                  </div>
                  <Award className="w-8 h-8 text-secondary-text" />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Défi</h4>
                    <p className="text-gray-100">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Solution</h4>
                    <p className="text-gray-100">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Résultats</h4>
                    <ul className="space-y-2">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-center text-gray-100">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     

      {/* CTA */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Prêt à transformer votre stratégie marketing ?
            </h2>
            <p className="text-gray-600 mb-10 text-lg">
              Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons vous aider à atteindre vos objectifs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300">
                Prendre rendez-vous
              </button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Consultation sous 48h
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Support dédié
                </span>
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Expertise internationale
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationMarketing;