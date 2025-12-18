import React, { useState } from 'react';
import {
    Scale,
    FileText,
    Building,
    Shield,
    Users,
    Target,
    Clock,
    Award,
    CheckCircle2,
    ChevronRight,
    Calendar,
    MessageSquare,
    Globe,
    Lock,
    Briefcase,
    Gavel,
    Landmark,
    FileSearch,
    Handshake,
    Scale as BalanceScale,
    Phone,
    Mail,
    MapPin,
    ExternalLink,
    Download,
    BookOpen,
    Zap,
    AlertTriangle
} from 'lucide-react';

interface LegalService {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    specialties: string[];
    complexity: 'standard' | 'complex' | 'expert';
}

interface Lawyer {
    id: number;
    name: string;
    title: string;
    expertise: string[];
    barNumber: string;
    experience: string;
    languages: string[];
}

interface LegalDocument {
    id: number;
    name: string;
    category: string;
    description: string;
    format: string;
    price: string;
}

const Juridique: React.FC = () => {
    const [selectedService, setSelectedService] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('corporate');
    const [selectedDocument, setSelectedDocument] = useState<number | null>(null);

    const legalServices: LegalService[] = [
        {
            id: 1,
            title: "Droit des Sociétés",
            description: "Création, gouvernance et transformations d'entreprises",
            icon: <Building className="w-8 h-8" />,
            specialties: ["Création SAS/SASU", "Assemblées générales", "Fusions & Acquisitions", "Pactes d'actionnaires"],
            complexity: 'standard'
        },
        {
            id: 2,
            title: "Contrats & Négociations",
            description: "Rédaction et négociation de tous types de contrats",
            icon: <FileText className="w-8 h-8" />,
            specialties: ["Contrats commerciaux", "NDA & Confidentialité", "Licences & Partenariats", "Résolution de litiges"],
            complexity: 'standard'
        },
        {
            id: 3,
            title: "Propriété Intellectuelle",
            description: "Protection et valorisation de vos actifs immatériels",
            icon: <Lock className="w-8 h-8" />,
            specialties: ["Marques & Brevets", "Droit d'auteur", "Contrefaçon", "Licences de logiciels"],
            complexity: 'complex'
        },
        {
            id: 4,
            title: "Droit Social",
            description: "Accompagnement des relations employeur-employés",
            icon: <Users className="w-8 h-8" />,
            specialties: ["Contrats de travail", "Négociations sociales", "Licenciements", "Conformité RH"],
            complexity: 'standard'
        },
        {
            id: 5,
            title: "Conformité & RGPD",
            description: "Mise en conformité réglementaire et protection des données",
            icon: <Shield className="w-8 h-8" />,
            specialties: ["Audits de conformité", "Politiques RGPD", "Cookies & données", "Cybersécurité"],
            complexity: 'complex'
        },
        {
            id: 6,
            title: "Contentieux & Litiges",
            description: "Représentation et défense en justice",
            icon: <Gavel className="w-8 h-8" />,
            specialties: ["Tribunaux de commerce", "Arbitrage", "Médiation", "Exécution de décisions"],
            complexity: 'expert'
        },
        {
            id: 7,
            title: "Droit Fiscal",
            description: "Optimisation et conseil en matière fiscale",
            icon: <Landmark className="w-8 h-8" />,
            specialties: ["Optimisation fiscale", "Contrôles fiscaux", "TVAs internationales", "Planification successorale"],
            complexity: 'expert'
        },
        {
            id: 8,
            title: "Droit International",
            description: "Opérations et implantations à l'international",
            icon: <Globe className="w-8 h-8" />,
            specialties: ["Implantations étrangères", "Contrats internationaux", "Douanes & Import-Export", "Arbitrage international"],
            complexity: 'expert'
        }
    ];

    const lawyers: Lawyer[] = [
        {
            id: 1,
            name: "Maître Élodie Moreau",
            title: "Avocat Associé - Droit des Sociétés",
            expertise: ["Fusions-Acquisitions", "Corporate Governance", "Private Equity"],
            barNumber: "Barreau de Paris - 2008",
            experience: "15 ans d'expertise",
            languages: ["Français", "Anglais", "Allemand"]
        },
        {
            id: 2,
            name: "Maître Thomas Dubois",
            title: "Avocat Counsel - Propriété Intellectuelle",
            expertise: ["Brevet Européen", "Litiges Marques", "Tech & Startups"],
            barNumber: "Barreau de Lyon - 2012",
            experience: "11 ans d'expertise",
            languages: ["Français", "Anglais", "Espagnol"]
        },
        {
            id: 3,
            name: "Maître Camille Laurent",
            title: "Avocat - Droit Social & Conformité",
            expertise: ["Transformation RH", "Audits Conformité", "Négociations CSE"],
            barNumber: "Barreau de Paris - 2015",
            experience: "8 ans d'expertise",
            languages: ["Français", "Anglais"]
        },
        {
            id: 4,
            name: "Maître Sébastien Chen",
            title: "Avocat Associé - Droit Fiscal International",
            expertise: ["Optimisation fiscale", "Transfer Pricing", "Fiscalité digitale"],
            barNumber: "Barreau de Paris - 2005",
            experience: "18 ans d'expertise",
            languages: ["Français", "Anglais", "Chinois", "Japonais"]
        }
    ];

    const legalDocuments: LegalDocument[] = [
        {
            id: 1,
            name: "Contrat de prestation de services",
            category: "Contrats",
            description: "Modèle standardisé pour prestations de services",
            format: "Word (.docx)",
            price: "149€"
        },
        {
            id: 2,
            name: "Statuts SAS personnalisables",
            category: "Sociétés",
            description: "Statuts types avec clauses optionnelles",
            format: "Word (.docx)",
            price: "299€"
        },
        {
            id: 3,
            name: "Politique de confidentialité RGPD",
            category: "Conformité",
            description: "Document conforme aux dernières réglementations",
            format: "PDF + Word",
            price: "199€"
        },
        {
            id: 4,
            name: "Contrat de travail CDI",
            category: "Social",
            description: "Avec toutes les clauses légales obligatoires",
            format: "Word (.docx)",
            price: "129€"
        }
    ];

    const legalTools = [
        {
            icon: <FileSearch className="w-6 h-6" />,
            title: "Audit Juridique Express",
            description: "Évaluation rapide de votre conformité légale"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Checklist Création d'Entreprise",
            description: "Toutes les étapes légales à suivre"
        },
        {
            icon: <AlertTriangle className="w-6 h-6" />,
            title: "Diagnostic Risques Juridiques",
            description: "Identification des risques potentiels"
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Base Documentaire",
            description: "Bibliothèque de modèles et ressources"
        }
    ];

    const stats = [
        { label: "Dossiers traités", value: "850+", description: "Depuis 2020" },
        { label: "Taux de réussite", value: "94%", description: "Contentieux gagnés" },
        { label: "Réactivité moyenne", value: "<24h", description: "Réponse aux urgences" },
        { label: "Clients satisfaits", value: "98%", description: "Retours positifs" }
    ];

    const packages = [
        {
            name: "Forfait Start-up",
            description: "Pour les jeunes entreprises en phase de lancement",
            price: "490",
            period: "par mois",
            features: [
                "5h de conseil mensuel",
                "Accès aux modèles de contrats",
                "Revue de documents illimitée",
                "Support email prioritaire",
                "Veille réglementaire basique"
            ],
            bestFor: "Start-ups < 2 ans"
        },
        {
            name: "Forfait Growth",
            description: "Pour les PME en croissance et scale-ups",
            price: "1 290",
            period: "par mois",
            features: [
                "15h de conseil mensuel",
                "Avocat dédié",
                "Rédaction contrats standard",
                "Audit de conformité annuel",
                "Formation équipe dirigeante",
                "Accès plateforme juridique"
            ],
            bestFor: "PME 10-50 employés",
            recommended: true
        },
        {
            name: "Forfait Enterprise",
            description: "Solution complète pour les entreprises établies",
            price: "Sur mesure",
            period: "devis personnalisé",
            features: [
                "Équipe juridique dédiée",
                "Contentieux inclus",
                "Accompagnement international",
                "Directeur juridique externe",
                "Formations régulières",
                "Reporting mensuel conseil d'administration"
            ],
            bestFor: "ETI & Grands comptes"
        }
    ];

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <div
                className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'
            >
                <div
                    className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
                />
                <img
                    src="https://i.pinimg.com/736x/2c/78/5a/2c785a8044d325062d8b39b60eae18d8.jpg"
                    className='h-full object-cover w-full'
                    alt="Background"
                />
            </div>
            <div className="border-b relative border-gray-200">
                <div className="container mx-auto px-6 py-20">
                    <div className="flex flex-col items-center justify-center mx-auto">
                        <div className="absolute right-4 bottom-16 flex items-center space-x-4 mb-8">
                            <Scale className="w-10 h-10 text-gray-200" />
                            <div className="w-8 h-px bg-gray-200"></div>
                            <span className="text-xs font-medium text-gray-200 uppercase tracking-wider">
                                Expertise Légale
                            </span>
                        </div>

                        <h1 className="text-xl md:text-4xl font-light text-gray-100 mb-6 leading-tight">
                            Conseil Juridique pour Entreprises
                        </h1>

                        <p className="text-sm text-gray-200 mb-10 font-light max-w-3xl">
                            Sécurité juridique et conseils stratégiques pour protéger et développer votre activité
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <button className="px-8 py-4 bg-logo text-white font-medium rounded-lg hover:bg-logo/50 transition-colors duration-300 flex items-center space-x-2 group">
                                <MessageSquare className="w-5 h-5" />
                                <span>Demander une consultation</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 border border-gray-300 bg-white text-gray-900 font-medium rounded-lg hover:border-gray-400 transition-colors duration-300 flex items-center space-x-2">
                                <Download className="w-5 h-5" />
                                <span>Guide légal gratuit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                            <div className="text-xs text-gray-500">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Navigation */}
            <div className="border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="flex overflow-x-auto space-x-1 py-4">
                        {[
                            { id: 'corporate', label: 'Droit des Sociétés' },
                            { id: 'contracts', label: 'Contrats' },
                            { id: 'ip', label: 'Propriété Intellectuelle' },
                            { id: 'social', label: 'Droit Social' },
                            { id: 'compliance', label: 'Conformité' },
                            { id: 'litigation', label: 'Contentieux' },
                            { id: 'tax', label: 'Fiscal' },
                            { id: 'international', label: 'International' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? 'bg-logo text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light text-gray-900 mb-4">Nos Domaines d'Expertise</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Des services juridiques complets pour tous les aspects de votre entreprise
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {legalServices.map((service) => (
                        <div
                            key={service.id}
                            className={`bg-white rounded-xl border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedService === service.id
                                ? 'border-gray-900 ring-2 ring-gray-900 ring-opacity-10'
                                : 'border-gray-200'
                                }`}
                            onClick={() => setSelectedService(service.id)}
                        >
                            <div className="mb-6">
                                <div className="p-3 bg-gray-100 rounded-lg inline-block mb-4">
                                    {service.icon}
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${service.complexity === 'standard' ? 'bg-green-100 text-green-800' :
                                        service.complexity === 'complex' ? 'bg-amber-100 text-amber-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {service.complexity === 'standard' ? 'Standard' :
                                            service.complexity === 'complex' ? 'Complexe' : 'Expert'}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-6">{service.description}</p>
                            </div>

                            <div className="space-y-3">
                                {service.specialties.map((specialty, idx) => (
                                    <div key={idx} className="flex items-center text-sm text-gray-600">
                                        <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                                        {specialty}
                                    </div>
                                ))}
                            </div>

                            <button className="mt-6 w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors duration-300 text-sm font-medium flex items-center justify-center">
                                En savoir plus
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Team */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-gray-900 mb-4">Notre Équipe d'Avocats</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Des experts spécialisés pour répondre à vos enjeux juridiques les plus complexes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {lawyers.map((lawyer) => (
                            <div key={lawyer.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <Briefcase className="w-8 h-8 text-gray-600" />
                                    </div>

                                    <h3 className="text-xl font-medium text-gray-900 mb-1">{lawyer.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{lawyer.title}</p>

                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <Scale className="w-3 h-3 mr-2" />
                                        {lawyer.barNumber}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Award className="w-4 h-4 mr-2" />
                                        {lawyer.experience}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Expertises :</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {lawyer.expertise.map((exp, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Langues :</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {lawyer.languages.map((lang, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button className="mt-6 w-full py-3 bg-secondary-text text-white rounded-lg hover:bg-secondary-text/50 transition-colors duration-300 text-sm font-medium">
                                    Prendre RDV
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-light text-gray-900 mb-6">
                            Notre Méthode : <span className="font-medium">Sécurité & Efficacité</span>
                        </h2>

                        <div className="space-y-8">
                            {[
                                {
                                    step: "01",
                                    title: "Analyse Initiale",
                                    description: "Évaluation complète de votre situation et identification des enjeux"
                                },
                                {
                                    step: "02",
                                    title: "Stratégie Juridique",
                                    description: "Définition d'une approche sur mesure pour atteindre vos objectifs"
                                },
                                {
                                    step: "03",
                                    title: "Exécution Précise",
                                    description: "Mise en œuvre avec rigueur et suivi régulier des progrès"
                                },
                                {
                                    step: "04",
                                    title: "Prévention & Suivi",
                                    description: "Veille légale et ajustements pour anticiper les évolutions réglementaires"
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-6">
                                    <div className="text-3xl font-light text-secondary-text">{item.step}</div>
                                    <div>
                                        <h3 className="text-xl font-medium text-secondary-text mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-secondary-text text-white rounded-2xl p-8">
                        <div className="mb-8">
                            <Shield className="w-12 h-12 text-logo mb-4" />
                            <h3 className="text-2xl font-medium mb-4">Pourquoi nous choisir ?</h3>
                            <p className="text-gray-300">
                                Plus qu'un cabinet d'avocats, un partenaire stratégique pour la sécurité juridique de votre entreprise.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: "Honoraires transparents", value: "Devis détaillé" },
                                { label: "Réactivité garantie", value: "< 4h pour les urgences" },
                                { label: "Approche business-oriented", value: "Solutions pragmatiques" },
                                { label: "Technologie sécurisée", value: "Plateforme client cryptée" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between pb-4 border-b border-logo last:border-0">
                                    <span className="text-gray-300">{item.label}</span>
                                    <span className="font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Tools & Resources */}
            <div className="bg-gray-50 border-y border-gray-200 py-16">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-gray-900 mb-4">Outils & Ressources Juridiques</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Des outils pratiques pour vous accompagner au quotidien
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {legalTools.map((tool, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                <div className="p-3 bg-gray-100 rounded-lg inline-block mb-4">
                                    {tool.icon}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{tool.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                                <button className="text-sm font-medium text-gray-900 hover:text-gray-700 flex items-center">
                                    Accéder à l'outil
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Legal Documents */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-light text-gray-900">Modèles de Documents Juridiques</h3>
                                <p className="text-gray-600">Téléchargez et personnalisez vos documents légaux</p>
                            </div>
                            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors duration-300">
                                Voir tous les modèles
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {legalDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className={`border rounded-lg p-5 cursor-pointer transition-all duration-300 ${selectedDocument === doc.id
                                        ? 'border-gray-900 bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => setSelectedDocument(doc.id)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {doc.category}
                                            </span>
                                        </div>
                                        <FileText className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <h4 className="font-medium text-gray-900 mb-2">{doc.name}</h4>
                                    <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500">{doc.format}</div>
                                        <div className="text-lg font-bold text-gray-900">{doc.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* CTA Section */}
            <div className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 py-2">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-lg">
                            <div className="text-center mb-10">
                                <div className="inline-block p-4 bg-gray-100 rounded-full">
                                    <Handshake className="w-5 h-5 text-logo" />
                                </div>

                                <h2 className="text-xl font-light text-logo mb-2">
                                    Première Consultation Gratuite
                                </h2>

                                <p className="text-gray-600 text-sm mb-10 max-w-2xl mx-auto">
                                    Discutons de vos enjeux juridiques lors d'un premier entretien sans engagement.
                                    Nous vous offrons une analyse initiale et des recommandations concrètes.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className="text-center p-6 bg-gray-50 rounded-xl">
                                    <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                                    <h3 className="font-medium text-gray-900 mb-2">45 minutes</h3>
                                    <p className="text-sm text-gray-600">Consultation approfondie</p>
                                </div>

                                <div className="text-center p-6 bg-gray-50 rounded-xl">
                                    <Target className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                                    <h3 className="font-medium text-gray-900 mb-2">Analyse personnalisée</h3>
                                    <p className="text-sm text-gray-600">Recommandations spécifiques</p>
                                </div>

                                <div className="text-center p-6 bg-gray-50 rounded-xl">
                                    <BalanceScale className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                                    <h3 className="font-medium text-gray-900 mb-2">Sans engagement</h3>
                                    <p className="text-sm text-gray-600">Aucune obligation de suite</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-10 py-4 bg-logo text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2">
                                    <Phone className="w-5 h-5" />
                                    <span>Réserver ma consultation</span>
                                </button>
                                <button className="px-10 py-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors duration-300 flex items-center justify-center space-x-2">
                                    <Mail className="w-5 h-5" />
                                    <span>Nous décrire votre situation</span>
                                </button>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-16 pt-8 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <Phone className="w-6 h-6 text-gray-500 mx-auto mb-3" />
                                        <div className="font-medium text-gray-900">01 23 45 67 89</div>
                                        <div className="text-sm text-gray-500">Urgences juridiques 24/7</div>
                                    </div>

                                    <div className="text-center">
                                        <Mail className="w-6 h-6 text-gray-500 mx-auto mb-3" />
                                        <div className="font-medium text-gray-900">juridique@cabinet-expert.com</div>
                                        <div className="text-sm text-gray-500">Réponse sous 4h ouvrées</div>
                                    </div>

                                    <div className="text-center">
                                        <MapPin className="w-6 h-6 text-gray-500 mx-auto mb-3" />
                                        <div className="font-medium text-gray-900">Paris, Lyon, Bordeaux</div>
                                        <div className="text-sm text-gray-500">Consultations sur site possibles</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Juridique;