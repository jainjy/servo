import React, { useState } from 'react';
import {
    Home,
    Shield,
    TrendingUp,
    Calculator,
    Users,
    BadgeCheck,
    MapPin,
    Bed,
    Bath,
    Square,
    Car,
    Heart,
    Eye,
    Calendar,
    Euro,
    Target,
    FileText,
    Clock,
    CheckCircle2,
    Building,
    Landmark
} from 'lucide-react';

const LogementsIntermediaires = () => {
    const [activeTab, setActiveTab] = useState('avantages');
    const [favoris, setFavoris] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        situation: '',
        revenus: '',
        composition: '',
        localisation: '',
        budget: ''
    });

    const logementsExemples = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            type: "PLUS",
            categorie: "appartement",
            prix: "1 200 €",
            titre: "Appartement T3 Neuf - Éco-quartier",
            lieu: "Lyon, 69007",
            description: "Appartement BBC avec terrasse, proche transports et commodités. Éligible Prêt Social Locatif Accessible.",
            caracteristiques: {
                chambres: 2,
                sdb: 1,
                surface: "65 m²",
                parking: 1,
                annee: 2024,
                etage: 3,
                balcon: true,
                cave: true
            },
            promoteur: "Nexity",
            dateDispo: "2024-09-01",
            vues: 89,
            favori: false
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
            type: "PLAI",
            categorie: "appartement",
            prix: "850 €",
            titre: "Résidence sociale - T4 Familial",
            lieu: "Marseille, 13015",
            description: "Logement social familial avec jardin partagé. Accessible aux ménages modestes.",
            caracteristiques: {
                chambres: 3,
                sdb: 2,
                surface: "78 m²",
                parking: 0,
                annee: 2023,
                etage: 1,
                balcon: true,
                cave: false
            },
            promoteur: "Action Logement",
            dateDispo: "2024-08-15",
            vues: 124,
            favori: true
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400",
            type: "PLS",
            categorie: "appartement",
            prix: "1 450 €",
            titre: "Appartement standing - Quartier durable",
            lieu: "Bordeaux, 33000",
            description: "Appartement intermédiaire avec services. Proche du centre-ville et des écoles.",
            caracteristiques: {
                chambres: 3,
                sdb: 2,
                surface: "75 m²",
                parking: 1,
                annee: 2024,
                etage: 2,
                balcon: true,
                cave: true
            },
            promoteur: "Bouygues Immobilier",
            dateDispo: "2024-10-01",
            vues: 67,
            favori: false
        }
    ];

    const dispositifs = [
        {
            nom: "PLUS",
            description: "Prêt Locatif à Usage Social",
            loyerMax: "Variable selon zone",
            public: "Ménages modestes",
            financement: "Action Logement",
            icon: <Home className="w-6 h-6" />
        },
        {
            nom: "PLAI",
            description: "Prêt Locatif Aidé d'Intégration",
            loyerMax: "Très encadré",
            public: "Ménages très modestes",
            financement: "État + Collectivités",
            icon: <Shield className="w-6 h-6" />
        },
        {
            nom: "PLS",
            description: "Prêt Locatif Social",
            loyerMax: "Intermédiaire",
            public: "Ménages intermédiaires",
            financement: "Action Logement",
            icon: <TrendingUp className="w-6 h-6" />
        },
        {
            nom: "PSLA",
            description: "Prêt Social Locatif Accessible",
            loyerMax: "Accessible",
            public: "Salariés en parcours résidentiel",
            financement: "Action Logement",
            icon: <Building className="w-6 h-6" />
        }
    ];

    const avantages = [
        {
            icon: <Euro className="w-8 h-8" />,
            titre: "Loyers encadrés",
            description: "Des loyers inférieurs de 15 à 40% au marché libre, selon le dispositif"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            titre: "Sécurité locative",
            description: "Contrats stables avec des garanties pour locataires et bailleurs"
        },
        {
            icon: <Target className="w-8 h-8" />,
            titre: "Public ciblé",
            description: "Accès réservé aux ménages éligibles selon des plafonds de ressources"
        },
        {
            icon: <Landmark className="w-8 h-8" />,
            titre: "Aides financières",
            description: "Éligibilité aux APL et autres aides au logement"
        }
    ];

    const conditionsEligibilite = [
        {
            critere: "Ressources mensuelles",
            details: "Plafonds variables selon composition familiale et zone géographique"
        },
        {
            critere: "Situation professionnelle",
            details: "CDI, CDD, fonctionnaire, indépendant, retraité, étudiant..."
        },
        {
            critere: "Résidence principale",
            details: "Destiné exclusivement à la résidence principale"
        },
        {
            critere: "Ancienneté dans la région",
            details: "Variable selon les dispositifs et collectivités"
        }
    ];

    const etapes = [
        {
            etape: "1",
            titre: "Simulation éligibilité",
            description: "Vérification des plafonds de ressources et situation",
            duree: "24h"
        },
        {
            etape: "2",
            titre: "Dépôt du dossier",
            description: "Composition du dossier avec pièces justificatives",
            duree: "1-2 semaines"
        },
        {
            etape: "3",
            titre: "Instruction",
            description: "Examen par le service social et la commission",
            duree: "2-4 semaines"
        },
        {
            etape: "4",
            titre: "Attribution",
            description: "Notification et signature du bail",
            duree: "1 semaine"
        }
    ];

    const stats = [
        {
            valeur: "-30%",
            label: "Économie moyenne de loyer",
            description: "Par rapport au marché libre"
        },
        {
            valeur: "12-24 mois",
            label: "Durée moyenne d'attente",
            description: "Selon la zone géographique"
        },
        {
            valeur: "85%",
            label: "Taux de satisfaction",
            description: "Des locataires en logement intermédiaire"
        },
        {
            valeur: "50K+",
            label: "Logements livrés/an",
            description: "En France"
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulaire soumis:', formData);
        alert('Merci ! Notre conseiller vous contacte sous 48h pour une étude personnalisée.');
    };

    const toggleFavori = (id) => {
        setFavoris(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <section className=" text-white pb-8 pt-20">
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/736x/e1/71/1e/e1711e4da6287dedb35a90a6523b4380.jpg" className='h-full object-cover w-full' alt="" />
                </div>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-xl lg:text-4xl font-bold mb-6">Logements Intermédiaires</h1>
                        <p className="lg:text-md text-sm opacity-90 mb-8 max-w-2xl mx-auto">
                            Découvrez les dispositifs PLUS, PLAI, PLS et PSLA pour un parcours résidentiel
                            sécurisé avec des loyers encadrés et des aides adaptées
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => document.getElementById('simulation').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform flex items-center justify-center"
                            >
                                <Calculator className="w-5 h-5 mr-2" />
                                Simuler mon éligibilité
                            </button>
                            <button
                                onClick={() => setActiveTab('logements')}
                                className="border-2 bg-white hover:bg-white hover:text-blue-900 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Voir les logements
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation par onglets */}
            <section className="py-8 bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { id: 'avantages', label: 'Avantages', icon: <BadgeCheck className="w-4 h-4" /> },
                            { id: 'dispositifs', label: 'Dispositifs', icon: <FileText className="w-4 h-4" /> },
                            { id: 'logements', label: 'Logements', icon: <Home className="w-4 h-4" /> },
                            { id: 'simulation', label: 'Simulation', icon: <Calculator className="w-4 h-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Avantages */}
            {activeTab === 'avantages' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Les avantages du logement intermédiaire
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {avantages.map((avantage, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center"
                                >
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg inline-flex mb-4">
                                        {avantage.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {avantage.titre}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {avantage.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Statistiques */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
                            <h3 className="text-3xl font-bold text-center mb-12">
                                Chiffres clés du logement intermédiaire
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-4xl font-bold text-orange-300 mb-2">
                                            {stat.valeur}
                                        </div>
                                        <div className="text-lg font-semibold mb-2">
                                            {stat.label}
                                        </div>
                                        <div className="text-sm opacity-90">
                                            {stat.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Dispositifs */}
            {activeTab === 'dispositifs' && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Les différents dispositifs
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                            {dispositifs.map((dispositif, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                            {dispositif.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {dispositif.nom}
                                            </h3>
                                            <p className="text-gray-600">{dispositif.description}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-700">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Loyer max:</span>
                                            <span>{dispositif.loyerMax}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Public:</span>
                                            <span>{dispositif.public}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Financement:</span>
                                            <span>{dispositif.financement}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Conditions d'éligibilité */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                                Conditions d'éligibilité principales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {conditionsEligibilite.map((condition, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                                        <div className="bg-blue-600 text-white p-2 rounded-full mt-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {condition.critere}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {condition.details}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Logements */}
            {activeTab === 'logements' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Logements disponibles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {logementsExemples.map((logement) => (
                                <div
                                    key={logement.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Image avec badges */}
                                    <div className="relative">
                                        <img
                                            src={logement.image}
                                            alt={logement.titre}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {/* Badges superposés */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${logement.type === 'PLUS'
                                                ? 'bg-green-500 text-white'
                                                : logement.type === 'PLAI'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-purple-500 text-white'
                                                }`}>
                                                {logement.type}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-500 text-white">
                                                {logement.categorie}
                                            </span>
                                        </div>

                                        {/* Badge prix */}
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-gray-900 shadow-lg">
                                                {logement.prix}
                                            </span>
                                        </div>

                                        {/* Bouton favori */}
                                        <button
                                            onClick={() => toggleFavori(logement.id)}
                                            className={`absolute bottom-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${favoris.includes(logement.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white bg-opacity-90 text-gray-700 hover:bg-red-500 hover:text-white'
                                                }`}
                                        >
                                            <Heart className="w-4 h-4" fill={favoris.includes(logement.id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>

                                    {/* Contenu de la carte */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                            {logement.titre}
                                        </h3>

                                        <div className="flex items-center text-gray-600 mb-3">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span className="text-sm">{logement.lieu}</span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {logement.description}
                                        </p>

                                        {/* Caractéristiques */}
                                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <Bed className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-700">
                                                    {logement.caracteristiques.chambres} chambre{logement.caracteristiques.chambres > 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Bath className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-700">
                                                    {logement.caracteristiques.sdb} salle{logement.caracteristiques.sdb > 1 ? 's' : ''} de bain
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Square className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-700">
                                                    {logement.caracteristiques.surface}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Car className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-700">
                                                    {logement.caracteristiques.parking} place{logement.caracteristiques.parking > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Informations supplémentaires */}
                                        <div className="flex justify-between items-center pt-4">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Dispo: {new Date(logement.dateDispo).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>{logement.vues} vues</span>
                                                </div>
                                            </div>

                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300">
                                                Postuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Processus de candidature */}
                        <div className="mt-20 bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl p-8 text-white">
                            <h3 className="text-3xl font-bold text-center mb-8">
                                Processus de candidature
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {etapes.map((etape, index) => (
                                    <div key={index} className="text-center">
                                        <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                            {etape.etape}
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">{etape.titre}</h4>
                                        <p className="text-sm opacity-90 mb-2">{etape.description}</p>
                                        <div className="text-xs opacity-75">{etape.duree}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Simulation */}
            {activeTab === 'simulation' && (
                <section id="simulation" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Simulation d'éligibilité
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Vérifiez votre éligibilité aux logements intermédiaires
                                    et recevez une étude personnalisée
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Formulaire */}
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                        <Calculator className="w-6 h-6 text-blue-600 mr-3" />
                                        Votre situation
                                    </h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Nom et prénom *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nom"
                                                    value={formData.nom}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Email *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Téléphone *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="telephone"
                                                        value={formData.telephone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Situation professionnelle *
                                                </label>
                                                <select
                                                    name="situation"
                                                    value={formData.situation}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                >
                                                    <option value="">Sélectionnez...</option>
                                                    <option value="cdi">CDI</option>
                                                    <option value="cdd">CDD</option>
                                                    <option value="fonctionnaire">Fonctionnaire</option>
                                                    <option value="independant">Indépendant</option>
                                                    <option value="retraite">Retraité</option>
                                                    <option value="etudiant">Étudiant</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Revenus mensuels nets *
                                                    </label>
                                                    <select
                                                        name="revenus"
                                                        value={formData.revenus}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    >
                                                        <option value="">Sélectionnez...</option>
                                                        <option value="0-1500">0 - 1 500 €</option>
                                                        <option value="1500-2500">1 500 - 2 500 €</option>
                                                        <option value="2500-3500">2 500 - 3 500 €</option>
                                                        <option value="3500+">3 500 € et plus</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Composition familiale *
                                                    </label>
                                                    <select
                                                        name="composition"
                                                        value={formData.composition}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    >
                                                        <option value="">Sélectionnez...</option>
                                                        <option value="celibataire">Célibataire</option>
                                                        <option value="couple">Couple</option>
                                                        <option value="couple_1enfant">Couple + 1 enfant</option>
                                                        <option value="couple_2enfants">Couple + 2 enfants</option>
                                                        <option value="famille_nombreuse">Famille nombreuse</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Zone géographique recherchée *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="localisation"
                                                    value={formData.localisation}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Ville, département..."
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                                            >
                                                <FileText className="w-5 h-5 mr-2" />
                                                Obtenir mon étude personnalisée
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Informations complémentaires */}
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
                                            Ce que vous recevez
                                        </h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Analyse d'éligibilité détaillée
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Simulation des dispositifs accessibles
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Liste des logements correspondants
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Accompagnement personnalisé
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <Clock className="w-5 h-5 text-green-600 mr-2" />
                                            Délais d'instruction
                                        </h4>
                                        <p className="text-gray-700 mb-3">
                                            Temps moyen de traitement des dossiers :
                                        </p>
                                        <div className="text-2xl font-bold text-green-600">
                                            2 à 6 semaines
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Selon la complétude du dossier
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <Users className="w-5 h-5 text-purple-600 mr-2" />
                                            Notre expertise
                                        </h4>
                                        <p className="text-gray-700">
                                            <strong>500+ dossiers</strong> accompagnés avec succès pour un
                                            taux d'obtention de <strong>92%</strong> en logement intermédiaire
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default LogementsIntermediaires;