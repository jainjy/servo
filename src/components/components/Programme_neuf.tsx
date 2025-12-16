import React, { useState } from 'react';
import { Building2Icon, CircleDollarSignIcon, CloudLightning, HomeIcon, LeafyGreen, ShieldBanIcon, ShieldCheckIcon } from 'lucide-react'

const ProgrammeNeuf = () => {
    const [formData, setFormData] = useState({
        nom: '',
        entreprise: '',
        email: '',
        telephone: '',
        projet: '',
        budget: '',
        typeProjet: ''
    });

    const [showExampleModal, setShowExampleModal] = useState(false);
    const [selectedExample, setSelectedExample] = useState(null);

    const exemplesProjects = [
        {
            id: 1,
            titre: "Résidence Les Jardins de la Baie",
            type: "Résidentiel Haut de Gamme",
            image: "https://i.pinimg.com/1200x/93/24/4b/93244b8d4e4de8b00d9313633b97c205.jpg",
            location: "Côte d'Azur",
            description: "Programme résidentiel haut de gamme avec vue sur mer, composé de 45 appartements et 8 villas.",
            stats: {
                surface: "12 500 m²",
                montant: "45 M€",
                duration: "36 mois",
                results: "Vendu à 92% avant livraison, marge +18%"
            },
            details: [
                "Études de marché approfondies des clients premium",
                "Architecture prestigieuse signée par architecte renommé",
                "Services exclusifs (spa, conciergerie, parking privé)",
                "Commercialisation précoce avec partenaires haut de gamme"
            ]
        },
        {
            id: 2,
            titre: "Éco-Quartier Sustainable Living",
            type: "Éco-Quartier Durable",
            image: "https://i.pinimg.com/736x/8b/d5/2a/8bd52a637b1ea96778d5cb45e5875214.jpg",
            location: "Île-de-France",
            description: "Éco-quartier mixte certifié HQE Excellent avec logements, bureaux et commerces.",
            stats: {
                surface: "8 700 m²",
                montant: "28 M€",
                duration: "42 mois",
                results: "Aides publiques obtenues: 2,1 M€, Économies énergétiques 50%"
            },
            details: [
                "Certification HQE Excellent obtenue",
                "Panneaux solaires et récupération d'eau",
                "Transports en commun intégrés",
                "50% d'espaces verts et jardins partagés"
            ]
        },
        {
            id: 3,
            titre: "Pôle Mixte Urbain Center",
            type: "Programme Mixte",
            image: "https://i.pinimg.com/736x/9d/ce/57/9dce57cb8b38b3e30407a1b35cd85957.jpg",
            location: "Lyon",
            description: "Programme mixte avec 65 logements, 2 500 m² de bureaux et 1 200 m² de commerces.",
            stats: {
                surface: "18 200 m²",
                montant: "52 M€",
                duration: "48 mois",
                results: "Rentabilité optimisée, diversification de revenus +25%"
            },
            details: [
                "Diversification des revenus (résidentiel, tertaire, commercial)",
                "Occupation mixte 24h/24 pour animation continue",
                "Parking et services partagés optimisés",
                "Accès direct transports en commun"
            ]
        }
    ];

    const projetsTypes = [
        {
            id: 1,
            titre: "Résidentiel Haut de Gamme",
            description: "Appartements et villas premium avec services exclusifs",
            avantages: ["Valorisation maximale", "Clientèle premium", "Marge élevée"],
            icon: <Building2Icon />
        },
        {
            id: 2,
            titre: "Éco-Quartier Durable",
            description: "Programmes certifiés HQE et BBC",
            avantages: ["Aides publiques", "Image verte", "Économies énergétiques"],
            icon: <LeafyGreen />
        },
        {
            id: 3,
            titre: "Programme Mixte",
            description: "Commerces + bureaux + logements intégrés",
            avantages: ["Diversification", "Rentabilité optimisée", "Animation continue"],
            icon: <HomeIcon />
        }
    ];

    const stats = [
        { number: "42%", label: "de temps gagné en moyenne" },
        { number: "127M€", label: "de programmes livrés" },
        { number: "98%", label: "de taux de vente pré-commercialisation" },
        { number: "24", label: "promoteurs accompagnés" }
    ];

    const avantages = [
        {
            icon: <CircleDollarSignIcon />,
            titre: "Rentabilité optimisée",
            description: "Marge brute augmentée de 15% en moyenne grâce à notre expertise marché"
        },
        {
            icon: <CloudLightning />,
            titre: "Délais raccourcis",
            description: "Commercialisation 30% plus rapide avec notre réseau de partenaires"
        },
        {
            icon: <ShieldCheckIcon />,
            titre: "Risques maîtrisés",
            description: "Études de marché approfondies et accompagnement juridique inclus"
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
        // Ici, vous intégreriez l'envoi vers votre CRM/email
        // console.log('Données du formulaire:', formData);
        alert('Merci ! Nous vous recontactons sous 24h.');
    };

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <section className=" text-white">
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" className='h-full object-cover w-full' alt="" />
                </div>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center pt-20">
                        <h1 className="text-xl lg:text-4xl font-bold mb-5">Programme Neuf</h1>
                        <p className="text-sm lg:text-md pt-4 opacity-90 mb-8 max-w-2xl mx-auto">
                            Développez vos projets avec notre expertise complète :
                            études de faisabilité, commercialisation, gestion et livraison
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform shadow-lg"
                            >
                                Étude gratuite de mon projet
                            </button>

                        </div>
                    </div>
                </div>
            </section>

            {/* Avantages Section */}
            <section className="lg:py-10 py-0 bg-white">
                <div className="container mt-10 mx-auto px-4">
                    <h2 className="text-xl lg:text-4xl font-bold text-center text-gray-900 mb-2 lg:mb-16">
                        Pourquoi choisir notre programme neuf ?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {avantages.map((avantage, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                            >
                                <div className='flex gap-5'>
                                    <div className="text-4xl mb-4">{avantage.icon}</div>
                                    <h3 className="text-xl font-bold text-blue-900 mb-4">{avantage.titre}</h3>
                                </div>
                                <p className="text-gray-600">{avantage.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projets Types */}
            <section className="py-10 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
                        Nos programmes spécialisés
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {projetsTypes.map((projet) => (
                            <div
                                key={projet.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-blue-600 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="p-8">
                                    <div className='flex gap-4'>
                                        <div className="text-3xl mb-4">{projet.icon}</div>
                                        <h3 className="text-xl lg:text-2xl font-bold text-blue-900 mb-4">{projet.titre}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-6">{projet.description}</p>
                                    <ul className="space-y-2 mb-6">
                                        {projet.avantages.map((avantage, index) => (
                                            <li key={index} className="flex items-center text-green-600">
                                                <span className="mr-2">✓</span>
                                                {avantage}
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setShowExampleModal(true);
                                            setSelectedExample(projet.id);
                                        }}
                                        className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 rounded-lg transition-all duration-300">
                                        Voir un exemple
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chiffres Clés */}
            <section className=" text-white">
                <div className="bg-blue-900 shadow-lg rounded-lg  container mx-auto p-4">
                    <h2 className="text-xl lg:text-2xl tracking-widest font-bold text-center mb-16">
                        Notre impact chez les promoteurs
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-orange-400 mb-2">{stat.number}</div>
                                <div className="text-sm lg:text-lg opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Témoignages */}
            <section className="lg:py-10 py-5 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
                        Ils nous font confiance
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="bg-gray-50 p-8 rounded-xl relative border-l-4 border-blue-600">
                            <div className="text-6xl text-blue-200 absolute -top-4 -left-2">"</div>
                            <p className="text-lg text-gray-700 mb-6 relative z-10">
                                "Grâce à leur expertise, nous avons augmenté notre marge de 18% sur notre dernier programme résidentiel.
                                Un accompagnement professionnel de A à Z."
                            </p>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="font-bold text-blue-900">Pierre Martin</div>
                                <div className="text-gray-600">Directeur, PromoFrance</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl relative border-l-4 border-blue-600">
                            <div className="text-6xl text-blue-200 absolute -top-4 -left-2">"</div>
                            <p className="text-lg text-gray-700 mb-6 relative z-10">
                                "Un accompagnement sur-mesure qui nous a permis de développer notre premier éco-quartier en toute sérénité.
                                Leur réseau de partenaires a fait la différence."
                            </p>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="font-bold text-blue-900">Sophie Dubois</div>
                                <div className="text-gray-600">CEO, GreenPromotion</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Formulaire de Contact */}
            <section id="contact" className=" text-white py-5">
                <div className="container mx-auto rounded-lg bg-blue-900 shadow-lg p-4 px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Texte de présentation */}
                        <div>
                            <h2 className="lg:text-4xl text-xl font-bold mb-6">Étude gratuite de votre projet</h2>
                            <p className="text-sm lg:text-xl opacity-90 mb-8">
                                Nos experts analysent votre projet sous 48h et vous proposent une stratégie sur-mesure.
                            </p>
                            <ul className="space-y-4 text-sm lg:text-lg">
                                <li className="flex items-center">
                                    <span className="text-green-400 mr-3">✓</span>
                                    Analyse de faisabilité détaillée
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-400 mr-3">✓</span>
                                    Étude de marché personnalisée
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-400 mr-3">✓</span>
                                    Prévisionnel financier
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-400 mr-3">✓</span>
                                    Planning de commercialisation
                                </li>
                            </ul>
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nom et Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        id="nom"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="entreprise" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Société *
                                    </label>
                                    <input
                                        type="text"
                                        id="entreprise"
                                        name="entreprise"
                                        value={formData.entreprise}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email professionnel *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="telephone"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="typeProjet" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Type de projet *
                                    </label>
                                    <select
                                        id="typeProjet"
                                        name="typeProjet"
                                        value={formData.typeProjet}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="residentiel">Résidentiel</option>
                                        <option value="tertiaire">Tertiaire</option>
                                        <option value="mixte">Mixte</option>
                                        <option value="eco-quartier">Éco-quartier</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Budget estimé *
                                    </label>
                                    <select
                                        id="budget"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="1-5M">1-5 M€</option>
                                        <option value="5-10M">5-10 M€</option>
                                        <option value="10-20M">10-20 M€</option>
                                        <option value="20M+">20 M€ et plus</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="projet" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description du projet
                                </label>
                                <textarea
                                    id="projet"
                                    name="projet"
                                    rows={4}
                                    value={formData.projet}
                                    onChange={handleChange}
                                    placeholder="Terrain localisé, contraintes, objectifs..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Obtenir mon étude gratuite
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Modal Exemples */}
            {showExampleModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-gray-900">Exemples de Projets</h2>
                            <button
                                onClick={() => {
                                    setShowExampleModal(false);
                                    setSelectedExample(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {exemplesProjects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedExample(project.id)}
                                        className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                                            selectedExample === project.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-400'
                                        }`}
                                    >
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{project.titre}</h3>
                                        <p className="text-sm text-blue-600 font-semibold mb-2">{project.location}</p>
                                        <p className="text-sm text-gray-600">{project.description.substring(0, 80)}...</p>
                                    </button>
                                ))}
                            </div>

                            {selectedExample && (
                                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                                    {exemplesProjects
                                        .filter((p) => p.id === selectedExample)
                                        .map((project) => (
                                            <div key={project.id}>
                                                <div className="mb-8">
                                                    <img
                                                        src={project.image}
                                                        alt={project.titre}
                                                        className="w-full h-64 object-cover rounded-xl mb-6"
                                                    />
                                                </div>

                                                <h3 className="text-3xl font-bold text-gray-900 mb-2">{project.titre}</h3>
                                                <p className="text-blue-600 font-semibold mb-4">{project.type} - {project.location}</p>
                                                <p className="text-gray-700 text-lg mb-6 leading-relaxed">{project.description}</p>

                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="text-sm text-gray-600 mb-1">Surface</div>
                                                        <div className="text-2xl font-bold text-blue-600">{project.stats.surface}</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="text-sm text-gray-600 mb-1">Montant</div>
                                                        <div className="text-2xl font-bold text-blue-600">{project.stats.montant}</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="text-sm text-gray-600 mb-1">Durée</div>
                                                        <div className="text-2xl font-bold text-blue-600">{project.stats.duration}</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="text-sm text-gray-600 mb-1">Résultats</div>
                                                        <div className="text-lg font-bold text-green-600">{project.stats.results}</div>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                    <h4 className="text-xl font-bold text-gray-900 mb-4">Points clés du projet</h4>
                                                    <ul className="space-y-3">
                                                        {project.details.map((detail, idx) => (
                                                            <li key={idx} className="flex items-start">
                                                                <span className="text-green-600 font-bold mr-3 text-lg">✓</span>
                                                                <span className="text-gray-700">{detail}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="mt-8">
                                                    <button
                                                        onClick={() => {
                                                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                                            setShowExampleModal(false);
                                                        }}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg"
                                                    >
                                                        Lancer mon projet similaire
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgrammeNeuf;