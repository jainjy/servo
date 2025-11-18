import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Archive, ClipboardList, Shield, Download, Upload, CheckCircle, Clock } from 'lucide-react';

const PlanAdministratifServices = () => {
  const servicesAdministratifs = [
    {
      icon: FileText,
      title: "Gestion des Documents",
      description: "Centralisez et gérez tous vos documents administratifs en un seul endroit sécurisé",
      features: [
        "Stockage cloud sécurisé",
        "Classement par catégorie",
        "Recherche intelligente",
        "Alertes d'expiration"
      ],
      stat: "Types de documents supportés",
      statValue: "15+"
    },
    {
      icon: Archive,
      title: "Archivage Numérique",
      description: "Archivez vos documents signés avec un système de référencement et de traçabilité complet",
      features: [
        "Référence unique par document",
        "Historique des signatures",
        "Conservation légale",
        "Accès multi-parties"
      ],
      stat: "Durée de conservation",
      statValue: "10 ans"
    },
    {
      icon: ClipboardList,
      title: "Contrats Types",
      description: "Bibliothèque de modèles de contrats personnalisables pour tous vos besoins professionnels",
      features: [
        "Modèles pré-rédigés",
        "Variables personnalisables",
        "Mises à jour automatiques",
        "Conformité légale"
      ],
      stat: "Modèles disponibles",
      statValue: "50+"
    },
    {
      icon: Shield,
      title: "Conformité & Sécurité",
      description: "Respectez vos obligations légales avec un suivi rigoureux de la conformité documentaire",
      features: [
        "Alertes réglementaires",
        "Audit trail complet",
        "Chiffrement des données",
        "Backup automatique"
      ],
      stat: "Normes de sécurité",
      statValue: "RGPD"
    }
  ];

  const typesDocuments = [
    {
      name: "Documents Légaux",
      count: "8 types",
      items: ["Statuts", "KBIS", "Registres", "PV d'assemblée"]
    },
    {
      name: "Contrats Professionnels",
      count: "12 types",
      items: ["Devis", "Contrats de prestation", "Conventions", "Engagements"]
    },
    {
      name: "Documents Financiers",
      count: "6 types",
      items: ["Factures", "Relevés", "Attestations", "Bordereaux"]
    },
    {
      name: "Archives Signées",
      count: "Tous formats",
      items: ["Contrats signés", "Conventions", "Engagements", "Procès-verbaux"]
    }
  ];

  const avantages = [
    {
      icon: Download,
      title: "Import Simplifié",
      description: "Importez vos documents existants en quelques clics depuis tous vos appareils"
    },
    {
      icon: Upload,
      title: "Export Sécurisé",
      description: "Exportez vos documents dans les formats standards avec certificat d'intégrité"
    },
    {
      icon: CheckCircle,
      title: "Validation Automatique",
      description: "Vérification automatique de la complétude et de la validité des documents"
    },
    {
      icon: Clock,
      title: "Suivi en Temps Réel",
      description: "Surveillance active des dates d'expiration et des échéances importantes"
    }
  ];

  return (
    <div className="container mx-auto  px-4 mt-16 py-8">
      {/* En-tête */}
      <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
        <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
        <img src="https://i.pinimg.com/1200x/70/7c/5f/707c5f45a47547dc52b3e2f5b5fbb14f.jpg" className='h-full object-cover w-full' alt="" />
      </div>
      <div className="text-center mb-12">
        <h1 className="text-xl lg:text-4xl font-bold text-gray-100 mb-4">
          Documents Administratifs Simplifiés
        </h1>
        <p className="text-sm  text-gray-300 max-w-3xl mx-auto">
          Centralisez, gérez et archivez tous vos documents administratifs en toute sécurité.
          Gagnez du temps et de la sérénité dans la gestion de votre paperasse.
        </p>
      </div>

      {/* Services principaux */}
      <section className="mb-16 pt-10">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
          Nos Solutions Administratives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesAdministratifs.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">
                      {service.title}
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{service.statValue}</div>
                    <div className="text-xs text-gray-500">{service.stat}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Types de documents */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
          Types de Documents Gérés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {typesDocuments.map((type, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {type.name}
                </h3>
                <div className="text-blue-600 font-semibold mb-3">{type.count}</div>
                <ul className="space-y-1 text-sm text-gray-600">
                  {type.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Avantages */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
          Nos Avantages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {avantages.map((avantage, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <div className="bg-white rounded-full p-3 inline-flex mb-4 shadow-sm">
                  <avantage.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {avantage.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {avantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bénéfices */}
      <section>
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-0">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
              Les Bénéfices pour Votre Entreprise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full p-3 inline-flex mb-4 shadow-md">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Gain de Temps</h3>
                <p className="text-gray-600 text-sm">
                  Réduction de 70% du temps consacré à la recherche et au classement des documents
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-3 inline-flex mb-4 shadow-md">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sécurité Renforcée</h3>
                <p className="text-gray-600 text-sm">
                  Protection de vos données sensibles avec chiffrement de bout en bout
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-3 inline-flex mb-4 shadow-md">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Conformité Totale</h3>
                <p className="text-gray-600 text-sm">
                  Respect automatique des délais de conservation et obligations légales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default PlanAdministratifServices;