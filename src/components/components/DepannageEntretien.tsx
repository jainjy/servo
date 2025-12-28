import React, { useState, useEffect, useRef } from 'react';

const DepannageEntretien = () => {
  const [activeService, setActiveService] = useState(0);
  const [progress, setProgress] = useState(0);
  const [urgentRequests, setUrgentRequests] = useState(3);
  const [availableTechs, setAvailableTechs] = useState(8);
  const [isHovered, setIsHovered] = useState(null);
  const [pulse, setPulse] = useState(false);
  const containerRef = useRef(null);

  // Données des services
  const services = [
    {
      id: 1,
      title: "Dépannage Urgence",
      category: "urgence",
      responseTime: "30 min",
      description: "Intervention rapide 24h/24 pour les situations critiques nécessitant une action immédiate.",
      features: ["Déplacement sous 30min", "Diagnostic gratuit", "Pièces garanties", "Rapport détaillé"],
      price: "À partir de 79€",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "red",
      urgency: "Haute",
      coverage: ["Maison", "Appartement", "Bureau"],
      status: "actif"
    },
    {
      id: 2,
      title: "Contrat Entretien",
      category: "prevention",
      responseTime: "48h",
      description: "Maintenance programmée pour anticiper les pannes et prolonger la durée de vie de vos équipements.",
      features: ["Visites trimestrielles", "Pièces d'usure incluses", "Priorité intervention", "Réduction 20%"],
      price: "À partir de 29€/mois",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "green",
      urgency: "Basse",
      coverage: ["Annuel", "Sans engagement"],
      status: "populaire"
    },
    {
      id: 3,
      title: "Diagnostic Expert",
      category: "diagnostic",
      responseTime: "24h",
      description: "Analyse complète de vos installations par des techniciens certifiés avec rapport d'expertise.",
      features: ["Test équipements", "Rapport détaillé", "Conseils optimisation", "Devis gratuit"],
      price: "À partir de 149€",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "blue",
      urgency: "Moyenne",
      coverage: ["Électrique", "Plomberie", "Climatisation"],
      status: "standard"
    },
    {
      id: 4,
      title: "Remplacement Pièces",
      category: "reparation",
      responseTime: "72h",
      description: "Remplacement de pièces défectueuses avec garantie constructeur et main d'œuvre incluse.",
      features: ["Pièces origine", "Garantie 2 ans", "Installation incluse", "Recyclage ancien"],
      price: "Devis personnalisé",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      color: "purple",
      urgency: "Moyenne",
      coverage: ["Toutes marques"],
      status: "standard"
    },
    {
      id: 5,
      title: "Nettoyage Professionnel",
      category: "maintenance",
      responseTime: "7 jours",
      description: "Nettoyage et désinfection complète de vos installations techniques et systèmes.",
      features: ["Produits professionnels", "Équipement spécialisé", "Certificat sanitaire", "Protection surfaces"],
      price: "À partir de 199€",
      icon: "M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z",
      color: "cyan",
      urgency: "Basse",
      coverage: ["Industriel", "Résidentiel"],
      status: "standard"
    },
    {
      id: 6,
      title: "Conseil Technique",
      category: "consulting",
      responseTime: "Immédiat",
      description: "Assistance téléphonique et conseils d'experts pour résoudre vos problèmes techniques.",
      features: ["Hotline 24/7", "Experts certifiés", "Support vidéo", "Guide pas-à-pas"],
      price: "19€/appel",
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
      color: "orange",
      urgency: "Variable",
      coverage: ["Tous domaines"],
      status: "actif"
    }
  ];

  // Données du dashboard
  const stats = [
    { label: "Interventions/jour", value: "47", change: "+12%" },
    { label: "Temps moyen", value: "42min", change: "-8%" },
    { label: "Satisfaction", value: "4.8", change: "+0.2" },
    { label: "Couverture", value: "98%", change: "stable" }
  ];

  // Animation de la jauge de progression
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Animation du pulse d'urgence
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Composant Jauge
  const Gauge = ({ value, max = 100, color = "blue", size = 120 }) => {
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / max) * circumference;

    return (
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`var(--color-${color})`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{value}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      </div>
    );
  };

  // Composant Service Card
  const ServiceCard = ({ service, index }) => {
    const isActive = index === activeService;

    return (
      <div
        className={`relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${isActive
          ? 'border-gray-800 bg-gray-800 text-white scale-105 shadow-2xl'
          : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-lg'
          }`}
        onClick={() => setActiveService(index)}
        onMouseEnter={() => setIsHovered(index)}
        onMouseLeave={() => setIsHovered(null)}
      >
        {/* Badge de statut */}
        {service.status === 'populaire' && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-light">
            POPULAIRE
          </div>
        )}

        {service.status === 'actif' && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-light">
            ACTIF
          </div>
        )}

        <div className='flex items-start gap-4'>
          {/* Icône */}
          <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${isActive
            ? 'bg-white/20'
            : `bg-${service.color}-50`
            }`}>
            <svg className={`w-5 h-5 ${isActive ? 'text-white' : `text-${service.color}-600`}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
            </svg>
          </div>
          <h3 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>
            {service.title}
          </h3>
        </div>

        {/* Titre et temps de réponse */}
        <div className="mb-3">

          <div className={`flex  items-center text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${service.urgency === 'Haute' ? 'bg-red-500' :
              service.urgency === 'Moyenne' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
            <span>Réponse: {service.responseTime}</span>
          </div>
        </div>

        {/* Description courte */}
        <p className={`text-xs mb-4 ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>
          {service.description.substring(0, 80)}...
        </p>

        {/* Prix */}
        <div className={`font-bold bg-white shadow-md w-44 text-xs py-1 rounded-full text-center ${isActive ? 'text-black' : 'text-gray-800'}`}>
          {service.price}
        </div>

        {/* Indicateur hover */}
        {isHovered === index && !isActive && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-800 rounded-full"></div>
        )}
      </div>
    );
  };

  const activeServiceData = services[activeService];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden" ref={containerRef}>
      {/* Header technique */}
      <div className="relative pt-16 pb-1 px-4">
        {/* Lignes techniques en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 79px, #e5e7eb 79px, #e5e7eb 80px, transparent 80px),
              linear-gradient(0deg, transparent 79px, #e5e7eb 79px, #e5e7eb 80px, transparent 80px)
            `,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl pt-10 mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Dépannage & entretien
            </h1>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              Protégez et entretenez vos biens en toute sérénité. Notre réseau d'experts intervient rapidement et efficacement.
            </p>
          </div>

          {/* Dashboard stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'bg-green-100 text-green-800' :
                    stat.change.startsWith('-') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Alertes urgentes */}
        <div className={`mb-12 bg-white rounded-2xl border-l-4 border-red-500 p-6 shadow-lg transition-all duration-400 animate-pulse
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <div>
                <h3 className="font-bold text-gray-900">{urgentRequests} interventions urgentes en attente</h3>
                <p className="text-gray-600 text-sm">Techniciens disponibles: {availableTechs}</p>
              </div>
            </div>
            <button className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors">
              Demander une urgence
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Colonne gauche - Services */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Colonne droite - Détails du service actif */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-md lg:text-lg font-bold text-gray-900">{activeServiceData.title}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeServiceData.urgency === 'Haute' ? 'bg-red-100 text-red-800' :
                  activeServiceData.urgency === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                  {activeServiceData.urgency} PRIORITÉ
                </span>
              </div>

              <div className="flex items-center justify-between space-x-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 text-xs">Réponse: {activeServiceData.responseTime}</span>
                </div>
                <div className="text-md font-bold text-gray-900">
                  {activeServiceData.price}
                </div>
              </div>
            </div>

            {/* Jauge de disponibilité */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Disponibilité immédiate</h3>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">{availableTechs} techniciens</span>
                </div>
              </div>
              <Gauge value={85} color="blue" size={120} />
            </div>

            {/* Caractéristiques */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm text-gray-900 mb-4">Ce qui est inclus</h3>
              <div className="space-y-3">
                {activeServiceData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-logo rounded-full mr-3"></div>
                    <span className="text-gray-700 text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Couverture */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Couverture</h3>
              <div className="flex flex-wrap gap-2">
                {activeServiceData.coverage.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button className="w-full bg-logo text-white font-semibold py-3.5 px-6 rounded-xl 
              hover:bg-logo/80 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
              Demander une intervention
            </button>
          </div>
        </div>

        {/* Section Process */}
        <div className="mb-20 bg-white p-5 rounded-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            Notre processus en 4 étapes
          </h2>
          <div className="relative">
            {/* Ligne de connexion */}
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300 -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Diagnostic",
                  description: "Analyse précise du problème par nos experts",
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                },
                {
                  step: "02",
                  title: "Devis",
                  description: "Proposition transparente sans surprise",
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                },
                {
                  step: "03",
                  title: "Intervention",
                  description: "Réparation par des techniciens certifiés",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z"
                },
                {
                  step: "04",
                  title: "Garantie",
                  description: "Suivi et garantie sur les interventions",
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                }
              ].map((process, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg text-center">
                    <div className="w-16 h-16 bg-logo text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                      {process.step}
                    </div>
                    <svg className="w-10 h-10 text-secondary-text mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={process.icon} />
                    </svg>
                    <h3 className="font-bold text-gray-900 mb-2">{process.title}</h3>
                    <p className="text-gray-600 text-xs">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assurance qualité */}
        <div className="text-center grid rounded-lg shadow-lg bg-white p-5">
          <div className="inline-flex justify-around items-center  space-x-8 mb-12">
            {[
              { label: "Garantie", value: "2 ans" },
              { label: "Techniciens", value: "Certifiés" },
              { label: "Pièces", value: "Origine" },
              { label: "Satisfaction", value: "98%" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{item.value}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>

          <button className="bg-gray-900 text-white font-semibold w-64 mx-auto text-base px-10 py-4 rounded-xl 
            hover:bg-black transition-all duration-300 transform hover:-translate-y-0.5">
            Obtenir un devis gratuit
          </button>
        </div>
      </div>

      <style >{`
        :root {
          --color-red: #ef4444;
          --color-green: #10b981;
          --color-blue: #3b82f6;
          --color-purple: #8b5cf6;
          --color-cyan: #06b6d4;
          --color-orange: #f97316;
        }
      `}</style>
    </div>
  );
};

export default DepannageEntretien;