import React, { useState } from 'react';
import {
  Users,
  Target,
  TrendingUp,
  BarChart,
  Shield,
  Zap,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  Calendar,
  MessageSquare,
  FileText,
  Lightbulb,
  Globe,
  Building,
  HeartHandshake,
  Brain,
  Rocket,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Advisor {
  id: number;
  name: string;
  role: string;
  expertise: string[];
  experience: string;
  imageColor: string;
}

interface MethodologieStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
}

interface SuccessStory {
  id: number;
  entrepreneur: string;
  business: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
  }[];
}

const ConseilsAccompagnement: React.FC = () => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<number>(1);
  const [activeMethodologie, setActiveMethodologie] = useState<number>(1);

  const advisors: Advisor[] = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Conseillère Stratégique Senior",
      expertise: ["Scale-up", "Levée de fonds", "Transformation digitale"],
      experience: "15+ ans d'expérience",
      imageColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      name: "Thomas Bernard",
      role: "Expert Finance & Croissance",
      expertise: ["Business Plan", "ROI Optimization", "Financial Modeling"],
      experience: "12+ ans d'expérience",
      imageColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      name: "Camille Dubois",
      role: "Spécialiste Marketing B2B",
      expertise: ["Go-to-Market", "Brand Positioning", "Account Based Marketing"],
      experience: "10+ ans d'expérience",
      imageColor: "bg-purple-100 text-purple-800"
    },
    {
      id: 4,
      name: "Alexandre Moreau",
      role: "Coach Leadership",
      expertise: ["Team Building", "Executive Coaching", "Organizational Design"],
      experience: "18+ ans d'expérience",
      imageColor: "bg-amber-100 text-amber-800"
    }
  ];

  const services = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Business Strategy",
      description: "Définition de votre feuille de route stratégique",
      features: ["Analyse marché", "Positionnement", "Plan d'action 3 ans"]
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Financial Advisory",
      description: "Optimisation financière et préparation investissement",
      features: ["Business Plan", "Financial Modeling", "Pitch deck"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Scaling",
      description: "Recrutement et structuration d'équipe performante",
      features: ["Organizational Design", "Recruitment Strategy", "Culture d'entreprise"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Acceleration",
      description: "Accélération de la croissance commerciale",
      features: ["Go-to-Market", "Sales Process", "Partnerships"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management",
      description: "Identification et mitigation des risques",
      features: ["Risk Assessment", "Compliance", "Crisis Management"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Operational Excellence",
      description: "Optimisation des processus opérationnels",
      features: ["Process Mapping", "Efficiency Gains", "KPI Dashboard"]
    }
  ];

  const methodologie: MethodologieStep[] = [
    {
      step: 1,
      title: "Diagnostic Initial",
      description: "Analyse approfondie de votre situation actuelle",
      duration: "2-3 semaines",
      deliverables: ["Audit complet", "Rapport SWOT", "Gap analysis"]
    },
    {
      step: 2,
      title: "Définition Stratégique",
      description: "Cocréation de votre stratégie sur mesure",
      duration: "3-4 semaines",
      deliverables: ["Feuille de route", "Objectifs SMART", "Plan d'action"]
    },
    {
      step: 3,
      title: "Implémentation",
      description: "Accompagnement pas-à-pas dans la mise en œuvre",
      duration: "3-6 mois",
      deliverables: ["Sessions coaching", "Revues mensuelles", "Ajustements stratégiques"]
    },
    {
      step: 4,
      title: "Suivi & Optimisation",
      description: "Mesure des résultats et ajustements continus",
      duration: "Permanent",
      deliverables: ["Dashboard KPI", "Revues trimestrielles", "Optimisation continue"]
    }
  ];

  const successStories: SuccessStory[] = [
    {
      id: 1,
      entrepreneur: "Marie Laurent",
      business: "EcoTech Solutions",
      challenge: "Passer de 1M à 10M de CA en 2 ans",
      solution: "Stratégie de scale-up international et levée de fonds",
      results: [
        { metric: "Croissance CA", value: "450%" },
        { metric: "Levée de fonds", value: "5M€" },
        { metric: "Marchés internationaux", value: "6 pays" }
      ]
    },
    {
      id: 2,
      entrepreneur: "Julien Petit",
      business: "FoodTech Innov",
      challenge: "Optimisation rentabilité et préparation série A",
      solution: "Restructuration financière et préparation investissement",
      results: [
        { metric: "Marge opérationnelle", value: "+35%" },
        { metric: "Série A réussie", value: "8M€" },
        { metric: "Taux de rétention", value: "95%" }
      ]
    }
  ];

  const testimonials = [
    {
      quote: "L'accompagnement stratégique a transformé notre vision d'entreprise et accéléré notre croissance de manière spectaculaire.",
      author: "Sarah Chen",
      position: "CEO, TechVision",
      results: "3x croissance en 18 mois"
    },
    {
      quote: "Un partenaire indispensable pour tout entrepreneur ambitieux. Leur expertise nous a évité des erreurs coûteuses.",
      author: "Marc Dubois",
      position: "Fondateur, GreenImpact",
      results: "Levée de 2M€ réussie"
    }
  ];

  const packages = [
    {
      name: "Starter",
      idealFor: "Startups early-stage",
      price: "1 500",
      period: "par mois",
      includes: [
        "4h de conseil/mois",
        "Revue stratégique mensuelle",
        "Accès aux templates",
        "Support email prioritaire",
        "Dashboard de suivi"
      ],
      cta: "Commencer"
    },
    {
      name: "Growth",
      idealFor: "Scale-ups en croissance",
      price: "3 900",
      period: "par mois",
      includes: [
        "12h de conseil/mois",
        "Conseiller dédié",
        "Sessions coaching équipe",
        "Analyse financière avancée",
        "Préparation investissement",
        "Revues hebdomadaires"
      ],
      cta: "Choisir cette offre",
      recommended: true
    },
    {
      name: "Enterprise",
      idealFor: "PME/ETI en transformation",
      price: "Sur mesure",
      period: "devis personnalisé",
      includes: [
        "Team dédiée",
        "Accompagnement complet",
        "Transformation organisationnelle",
        "Internationalisation",
        "Fusions & acquisitions",
        "Conseil au comité de direction"
      ],
      cta: "Nous contacter"
    }
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
      <div className="relative  overflow-hidden">
        <div className="container mx-auto px-6 pt-20">
          <div className="flex flex-col pt-5 justify-center items-center mx-auto">
            
            <h1 className="text-xl md:text-4xl font-light text-gray-200 mb-6 leading-tight">
              Conseils & Accompagnement
            </h1>
            
            <p className="text-sm text-gray-200 mb-10 font-light max-w-3xl">
              Support stratégique sur mesure pour entrepreneurs visionnaires. De l'idée à la scale-up.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button className="px-8 py-4 bg-logo text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2 group">
                <Calendar className="w-5 h-5" />
                <span>Réserver une consultation gratuite</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Votre Partenaire de <span className="font-medium text-logo">Confiance</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Nous accompagnons les entrepreneurs ambitieux dans leur parcours de croissance. 
              De la définition de la stratégie à l'exécution opérationnelle, nous sommes à vos côtés 
              pour transformer vos visions en réalités tangibles.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <Brain className="w-6 h-6" />, text: "Expertise sectorielle approfondie" },
                { icon: <HeartHandshake className="w-6 h-6" />, text: "Relation partenariale à long terme" },
                { icon: <Rocket className="w-6 h-6" />, text: "Focus sur les résultats mesurables" },
                { icon: <Globe className="w-6 h-6" />, text: "Réseau international d'experts" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 text-logo rounded-lg">
                    {item.icon}
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-medium text-logo mb-6">Notre Engagement</h3>
            <div className="space-y-6">
              {[
                { value: "100%", label: "Dédié à votre succès" },
                { value: "24/7", label: "Support réactif" },
                { value: "1:1", label: "Accompagnement personnalisé" },
                { value: "Data-Driven", label: "Décisions basées sur les données" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-logo last:border-0">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-2xl font-bold text-logo">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Domaines d'Expertise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins stratégiques
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <div className="mb-6">
                  <div className="p-3 bg-gray-100 rounded-lg inline-block mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="text-sm font-medium text-gray-900 hover:text-gray-700 flex items-center">
                  Explorer ce service
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notre Équipe */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Rencontrez Nos Conseillers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une équipe d'experts aux parcours complémentaires, unis par une passion commune : votre réussite
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {advisors.map((advisor) => (
            <div 
              key={advisor.id}
              className={`bg-white rounded-xl border p-6 cursor-pointer transition-all duration-300 ${
                selectedAdvisor === advisor.id 
                  ? 'border-gray-900 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedAdvisor(advisor.id)}
            >
              <div className="mb-6">
                <div className={`w-20 h-20 rounded-full ${advisor.imageColor} flex items-center justify-center mb-4`}>
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">{advisor.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{advisor.role}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="w-4 h-4 mr-2" />
                  {advisor.experience}
                </div>
              </div>
              
              <div className="space-y-3">
                {advisor.expertise.map((skill, idx) => (
                  <span key={idx} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mr-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
              
              <button className="mt-6 w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors duration-300 text-sm font-medium">
                Voir le profil complet
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Méthodologie */}
      <div className=" text-white py-5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4 text-slate-900">Notre Méthodologie en 4 Étapes</h2>
            <p className="text-gray-900 max-w-2xl mx-auto">
              Une approche structurée et éprouvée pour garantir votre succès
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {methodologie.map((step) => (
                <div 
                  key={step.step}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeMethodologie === step.step 
                      ? 'bg-logo border-l-4 border-secondary-text' 
                      : 'bg-logo hover:bg-logo'
                  }`}
                  onClick={() => setActiveMethodologie(step.step)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-300">0{step.step}</div>
                      <div>
                        <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          {step.duration}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${
                      activeMethodologie === step.step ? 'rotate-90' : ''
                    }`} />
                  </div>
                  
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  
                  {activeMethodologie === step.step && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Livrables :</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.deliverables.map((item, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <Lightbulb className="w-12 h-12 text-logo mb-4" />
                <h3 className="text-2xl font-medium mb-4 text-logo">Pourquoi ça marche ?</h3>
                <p className="text-gray-900">
                  Notre méthodologie combine expertise théorique et expérience pratique. 
                  Chaque étape est conçue pour créer de la valeur tangible et mesurable.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: "Entrepreneurs accompagnés", value: "150+" },
                  { label: "Taux de satisfaction", value: "96%" },
                  { label: "Croissance moyenne clients", value: "3.2x" },
                  { label: "Levées de fonds réussies", value: "45M€" }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-700 last:border-0">
                    <span className="text-gray-800">{stat.label}</span>
                    <span className="text-xl font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* CTA Final */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 py-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 bg-gray-100 rounded-full ">
              <MessageSquare className="w-8 h-8 text-gray-700" />
            </div>
            
            <h2 className="text-xl font-light text-gray-900 mb-6">
              Prêt à Accélérer Votre Succès ?
            </h2>
            
            <p className="text-gray-600 mb-10 text-sm max-w-2xl mx-auto">
              Réservez une consultation stratégique gratuite de 45 minutes avec un de nos experts.
              Identifions ensemble les opportunités de croissance pour votre entreprise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="px-10 py-4 bg-secondary-text text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Planifier un appel découverte</span>
              </button>
              <button className="px-10 py-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors duration-300">
                Nous écrire un email
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-200">
              <div className="flex flex-col items-center">
                <Phone className="w-6 h-6 text-gray-500 mb-3" />
                <div className="font-medium text-gray-900">01 23 45 67 89</div>
                <div className="text-sm text-gray-500">Lun-Ven, 9h-18h</div>
              </div>
              
              <div className="flex flex-col items-center">
                <Mail className="w-6 h-6 text-gray-500 mb-3" />
                <div className="font-medium text-gray-900">contact@conseils-entrepreneurs.com</div>
                <div className="text-sm text-gray-500">Réponse sous 24h</div>
              </div>
              
              <div className="flex flex-col items-center">
                <MapPin className="w-6 h-6 text-gray-500 mb-3" />
                <div className="font-medium text-gray-900">Paris & Lyon</div>
                <div className="text-sm text-gray-500">Rencontres sur site possible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConseilsAccompagnement;