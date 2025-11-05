import React from 'react';
import { Shield, Scale, HeartHandshake, FileCheck, Users, Target, Phone } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

interface AuditMediationProps {
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
    <div className="flex items-start mb-4">
      <div className="p-3 bg-red-100 rounded-xl text-red-600 mr-4 flex-shrink-0">
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
          <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ProcessStep: React.FC<{ number: number; title: string; description: string }> = ({
  number,
  title,
  description
}) => (
  <div className="flex items-start">
    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0 mt-1">
      {number}
    </div>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const AuditMediation: React.FC<AuditMediationProps> = ({ className = '' }) => {
  const services = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Audit Organisationnel",
      description: "Analyse approfondie de votre structure et processus internes.",
      features: [
        "Diagnostic des dysfonctionnements",
        "Analyse des processus métier",
        "Recommandations d'optimisation",
        "Rapport détaillé avec plan d'action"
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Médiation Conflits",
      description: "Résolution des tensions et restauration du dialogue social.",
      features: [
        "Intervention neutre et impartiale",
        "Gestion des conflits interpersonnels",
        "Médiation d'équipe",
        "Accords formalisés et durables"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Audit Conformité",
      description: "Vérification de la conformité réglementaire et légale.",
      features: [
        "Contrôle des obligations légales",
        "Analyse des risques juridiques",
        "Conformité RGPD et données",
        "Prévention des contentieux"
      ]
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Accompagnement RH",
      description: "Support dans la gestion des ressources humaines et sociales.",
      features: [
        "Audit des pratiques RH",
        "Gestion des relations sociales",
        "Formation des managers",
        "Prévention des RPS"
      ]
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Diagnostic Initial",
      description: "Rencontre et analyse de la situation pour comprendre les enjeux"
    },
    {
      number: 2,
      title: "Élaboration du Plan",
      description: "Proposition d'un plan d'intervention sur mesure"
    },
    {
      number: 3,
      title: "Intervention",
      description: "Mise en œuvre des actions d'audit ou de médiation"
    },
    {
      number: 4,
      title: "Recommandations",
      description: "Présentation des conclusions et préconisations"
    },
    {
      number: 5,
      title: "Suivi & Évaluation",
      description: "Accompagnement dans la mise en œuvre et mesure des résultats"
    }
  ];

  const expertiseAreas = [
    "Conflits interpersonnels et d'équipe",
    "Audit des processus organisationnels",
    "Conformité réglementaire",
    "Risques psychosociaux (RPS)",
    "Relations sociales et syndicales",
    "Gestion de crise organisationnelle"
  ];

  return (
    <section className={`py-8 mt-12 rounded-lg ${className}`}>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête */}
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/5a/d7/d2/5ad7d27a5bdf37ce1826d5c9ac03b6f4.jpg" alt="" />
          <div className="absolute left-2 bottom-0 inline-flex items-center bg-red-100 text-red-700 px-3 py-2 rounded-full text-xs font-semibold mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Experts certifiés
          </div>
        </div>
        <div className="text-center mb-16">

          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Audit & Médiation
          </h2>
          <p className="text-md text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Experts en audit organisationnel et résolution de conflits. Notre approche neutre
            et professionnelle vous aide à identifier les dysfonctionnements et à restaurer
            un climat de travail sain et productif.
          </p>
        </div>

        {/* Services */}
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>

        {/* Processus et Expertise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Processus d'intervention */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-red-600" />
              Notre Processus d'Intervention
            </h3>
            <div className="space-y-6">
              {processSteps.map((step) => (
                <ProcessStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>

          {/* Domaines d'expertise */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-red-600" />
              Domaines d'Expertise
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {expertiseAreas.map((area, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">{area}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 text-center">
                <strong>Confidentialité absolue</strong> - Toutes nos interventions
                sont couvertes par le secret professionnel et la confidentialité
              </p>
            </div>
          </div>
        </div>

        {/* CTA Urgence */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <HeartHandshake className="w-8 h-8 mr-3" />
              <h3 className="text-xl md:text-3xl font-bold">
                Situation urgente ?
              </h3>
            </div>
            <p className="text-red-100 text-md mb-6 max-w-2xl mx-auto">
              Notre cellule d'urgence est disponible pour intervenir rapidement
              dans les situations de crise nécessitant une médiation immédiate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex gap-2 items-center bg-white text-red-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg text-sm">
                <Phone  /> Contact Urgence - 24h/24
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-red-600 transition-colors duration-300 text-sm">
                Demander un Audit
              </button>
            </div>
            <p className="text-red-200 text-sm mt-4">
              Réponse garantie sous 2 heures pour les situations critiques
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditMediation;