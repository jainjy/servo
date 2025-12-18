import React from 'react';
import {
  Building2,
  Handshake,
  TrendingUp,
  FileCheck,
  Users,
  Target,
  BarChart3,
  Shield,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Award,
  Briefcase,
  Calculator,
  ChartNoAxesCombined,
  FileText,
  Landmark,
  Lightbulb,
  PieChart,
  Search,
  Settings,
  UserCheck
} from 'lucide-react';

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
}

interface FAQ {
  question: string;
  answer: string;
}

const RachatServiceCard: React.FC = () => {
  // Features list
  const features: ServiceFeature[] = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Évaluation Financière",
      description: "Analyse détaillée de la valorisation et des flux financiers"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Due Diligence",
      description: "Audit complet juridique, fiscal et opérationnel"
    },
    {
      icon: <ChartNoAxesCombined className="w-6 h-6" />,
      title: "Stratégie d'Acquisition",
      description: "Plan d'intégration et de développement post-rachat"
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Structuring Financier",
      description: "Optimisation du financement et levée de fonds"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Négociation Contractuelle",
      description: "Rédaction et négociation des accords d'achat"
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Transition Managériale",
      description: "Accompagnement dans la prise de contrôle"
    }
  ];

  // Stats
  const stats = [
    { value: "95%", label: "Taux de réussite", icon: <Award className="w-5 h-5" /> },
    { value: "50+", label: "Rachats accompagnés", icon: <Briefcase className="w-5 h-5" /> },
    { value: "€15M", label: "Montant moyen", icon: <DollarSign className="w-5 h-5" /> },
    { value: "3-6 mois", label: "Durée moyenne", icon: <Clock className="w-5 h-5" /> }
  ];

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: "Diagnostic Initial",
      description: "Analyse de faisabilité et définition des objectifs",
      duration: "2 semaines"
    },
    {
      step: 2,
      title: "Due Diligence",
      description: "Audit approfondi de l'entreprise cible",
      duration: "4-6 semaines"
    },
    {
      step: 3,
      title: "Négociation",
      description: "Stratégie de négociation et structuration",
      duration: "3-4 semaines"
    },
    {
      step: 4,
      title: "Finalisation",
      description: "Clôture et transition opérationnelle",
      duration: "2-3 semaines"
    }
  ];

  // Testimonials
  const testimonials: Testimonial[] = [
    {
      name: "Sophie Martin",
      position: "Directrice Générale",
      company: "TechInnov SAS",
      content: "L'accompagnement a été exceptionnel. Le processus de rachat s'est déroulé sans accroc et la transition a été parfaitement managée.",
      rating: 5
    },
    {
      name: "Thomas Dubois",
      position: "Président",
      company: "Manufacture Française",
      content: "Une expertise rare dans le domaine du rachat. Leur analyse financière nous a permis d'optimiser notre investissement de 15%.",
      rating: 5
    }
  ];

  // FAQ
  const faqs: FAQ[] = [
    {
      question: "Combien coûte votre accompagnement ?",
      answer: "Notre rémunération est basée sur un forfait fixe combiné à une commission sur réussite, alignant ainsi nos intérêts avec les vôtres."
    },
    {
      question: "Quelle est la durée moyenne d'un accompagnement ?",
      answer: "Entre 3 et 6 mois selon la complexité de l'opération et la taille de l'entreprise."
    },
    {
      question: "Traitez-vous tous les secteurs d'activité ?",
      answer: "Oui, avec une expertise particulière dans les secteurs technologiques, industriels et de services."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
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
      <div className="mb-12 pt-10 text-center">
        <h1 className="text-xl md:text-4xl font-bold text-gray-100 mb-4">
          Accompagnement au <span className="text-transparent bg-clip-text bg-logo">Rachat d'Entreprise</span>
        </h1>
        <p className="text-sm text-gray-200 max-w-3xl mx-auto">
          Expertise complète pour réussir votre acquisition d'entreprise, de l'identification à l'intégration
        </p>
      </div>

      <div className="grid gap-8">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-secondary-text mb-6 flex justify-center items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-secondary-text" />
              Notre Impact en Chiffres
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3 group-hover:bg-blue-100 transition-colors">
                    <div className="text-logo">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-secondary-text" />
              Notre Méthodologie Complète
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-secondary-text rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Target className="w-6 h-6 mr-3 text-logo" />
              Processus en 4 Étapes
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-logo to-secondary-text hidden md:block"></div>

              {processSteps.map((step, index) => (
                <div key={index} className="relative flex items-start mb-8 last:mb-0">
                  {/* Step number */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-logo rounded-full flex items-center justify-center mr-6">
                    <div className="text-white text-xl font-bold">{step.step}</div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                      <span className="text-sm font-medium text-logo bg-blue-50 px-3 py-1 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600">{step.description}</p>

                    {/* Sub-steps */}
                    <div className="mt-4 space-y-2">
                      {[
                        "Analyse documentaire",
                        "Rencontres managériales",
                        "Reporting détaillé"
                      ].map((subStep, subIndex) => (
                        <div key={subIndex} className="flex items-center text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-700">{subStep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>


      </div>

      {/* Benefits Card */}
      <div className='lg:grid-cols-2 grid-cols-1 gap-2 grid my-10'>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-secondary-text mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-3 text-secondary-text" />
            Nos Garanties
          </h3>
          <div className="space-y-4">
            {[
              "Confidentialité absolue",
              "Expertise certifiée",
              "Suivi post-rachat inclus",
              "Alignement d'intérêts"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-secondary-text rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Forfait Premium</h3>
          <div className="text-3xl font-bold mb-4">
            À partir de <span className="text-4xl">15 000€</span>
          </div>
          <p className="text-gray-300 text-sm mb-6">
            Forfait complet incluant toutes les étapes du processus
          </p>

          <div className="space-y-3 mb-6">
            {[
              "Due diligence complète",
              "Stratégie de négociation",
              "Accompagnement juridique",
              "Support post-rachat 6 mois"
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

          <button className="w-full bg-white text-secondary-text font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Demander un devis personnalisé
          </button>
        </div>
      </div>

      <div className="space-y-8 py-10">
        {/* FAQ Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-logo mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-3 text-logo" />
            Questions Fréquentes
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Contact Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-logo to-logo p-6 sm:p-7 text-white shadow-2xl">
        {/* Légers halos décoratifs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-6 h-32 w-32 rounded-full bg-black/10 blur-3xl" />

        <div className="relative">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-inner">
              <Handshake className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Prêt à démarrer ?
            </h3>
            <p className="mt-1 text-sm text-blue-100 sm:text-base">
              Réservez une consultation gratuite
            </p>
          </div>

          {/* Infos */}
          <div className="space-y-4 grid grid-cols-1 gap-4 lg:grid-cols-3 rounded-2xl  px-4 py-4 backdrop-blur-md sm:px-5 sm:py-5">
            <div className="flex items-center bg-white/10 px-4 rounded-lg">
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">45 minutes</div>
                <div className="text-xs text-blue-100 sm:text-sm">Durée moyenne</div>
              </div>
            </div>

            <div className="flex items-center bg-white/10 px-4 py-4 rounded-lg">
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Expert dédié</div>
                <div className="text-xs text-blue-100 sm:text-sm">Consultant senior</div>
              </div>
            </div>

            <div className="flex items-center bg-white/10 px-4 rounded-lg">
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Stratégie personnalisée</div>
                <div className="text-xs text-blue-100 sm:text-sm">
                  Premières recommandations concrètes
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            className="mt-7 flex w-1/4 mx-auto items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-lg shadow-black/20 transition hover:bg-slate-50 hover:shadow-xl"
            type="button"
          >
            Prendre rendez-vous
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>


    </div>
  );
};

export default RachatServiceCard;