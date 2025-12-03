import { BadgeDollarSign, Building2, CastleIcon, ChartArea, DollarSignIcon, FlagIcon, Globe2, HandshakeIcon, SparkleIcon, TreePalm } from 'lucide-react';
import React, { useState } from 'react';
import Api from "../../lib/api.js";
import DemandeAudit from '../../components/DemandeAudit.tsx'; // Import du composant de modale

// Interface pour les données du formulaire
interface InvestFormData {
    nom: string;
    email: string;
    telephone: string;
    paysInteret: string;
    typeInvestissement: string;
    budget: string;
    message: string;
}

interface PaysData {
    nom: string;
    avantages: string[];
    opportunites: string[];
    fiscalite: string;
    rendement: string;
    image: JSX.Element;
    couleur: string;
}

interface TypeBienData {
    titre: string;
    description: string;
    avantages: string[];
    couleur: string;
}

const InvestirEtranger = () => {
    const [paysActive, setPaysActive] = useState('maurice');
    const [typeBien, setTypeBien] = useState('vente');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    
    const [formData, setFormData] = useState<InvestFormData>({
        nom: '',
        email: '',
        telephone: '',
        paysInteret: 'maurice',
        typeInvestissement: 'residentiel',
        budget: '',
        message: ''
    });

    const paysData: Record<string, PaysData> = {
        maurice: {
            nom: 'Île Maurice',
            avantages: [
                'Fiscalité avantageuse (0-15% IR)',
                'Stabilité politique et économique',
                'Cadre de vie exceptionnel',
                'Double imposition évitée avec la France'
            ],
            opportunites: [
                'Résidences de tourisme',
                'Villas haut de gamme',
                'Programmes IRS/RES',
                'Investissement à partir de 500K USD'
            ],
            fiscalite: 'Imposition sur les sociétés: 15%',
            rendement: 'Rendement locatif: 4-7% net',
            image: <TreePalm />,
            couleur: 'from-emerald-500 to-teal-600'
        },
        madagascar: {
            nom: 'Madagascar',
            avantages: [
                'Prix d\'acquisition très attractifs',
                'Fort potentiel de valorisation',
                'Croissance économique soutenue',
                'Main d\'œuvre compétitive'
            ],
            opportunites: [
                'Immobilier commercial',
                'Résidences services',
                'Développement hôtelier',
                'Terrains à bâtir'
            ],
            fiscalite: 'Imposition sur les sociétés: 20%',
            rendement: 'Rendement locatif: 8-12% net',
            image: <FlagIcon />,
            couleur: 'from-red-500 to-orange-600'
        },
        dubai: {
            nom: 'Dubaï',
            avantages: [
                'Absence d\'impôt sur le revenu',
                'Sécurité et stabilité',
                'Croissance immobilière constante',
                'Régime de propriété freehold'
            ],
            opportunites: [
                'Appartements de luxe',
                'Villas sur Palm Jumeirah',
                'Commercial (DPI, DMC)',
                'Projets hors plan'
            ],
            fiscalite: '0% impôt sur le revenu',
            rendement: 'Rendement locatif: 5-8% net',
            image: <Building2 />,
            couleur: 'from-blue-500 to-purple-600'
        },
        portugal: {
            nom: 'Portugal',
            avantages: [
                'Golden Visa à partir de 500K€',
                'Croissance économique robuste',
                'Qualité de vie exceptionnelle',
                'Régime fiscal NHR avantageux'
            ],
            opportunites: [
                'Appartements Lisbonne/Porto',
                'Résidences de tourisme',
                'Rehabilitation urbaine',
                'Immobilier viticole'
            ],
            fiscalite: 'Régime NHR: 0-20% IR',
            rendement: 'Rendement locatif: 3-5% net',
            image: <CastleIcon />,
            couleur: 'from-green-500 to-lime-600'
        }
    };

    const typesBiens: Record<string, TypeBienData> = {
        vente: {
            titre: 'Mettre en vente',
            description: 'Vendez votre bien à l\'étranger avec notre réseau d\'acheteurs internationaux',
            avantages: [
                'Évaluation gratuite',
                'Visites virtuelles HD',
                'Réseau d\'acheteurs qualifiés',
                'Commission optimisée'
            ],
            couleur: 'from-purple-500 to-pink-600'
        },
        location: {
            titre: 'Mettre en location',
            description: 'Gestion locative complète avec garantie de loyers',
            avantages: [
                'Gestion 360° à distance',
                'Garantie loyer impayé',
                'Entretien et maintenance',
                'Reporting mensuel'
            ],
            couleur: 'from-blue-500 to-cyan-600'
        },
        gestion: {
            titre: 'Gestion de patrimoine',
            description: 'Optimisation fiscale et gestion de votre patrimoine international',
            avantages: [
                'Audit patrimonial gratuit',
                'Stratégie fiscale optimisée',
                'Suivi personnalisé',
                'Diversification géographique'
            ],
            couleur: 'from-orange-500 to-red-600'
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Effacer l'erreur quand l'utilisateur tape
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!formData.nom || !formData.email || !formData.telephone) {
            setError('Veuillez remplir tous les champs obligatoires');
            setLoading(false);
            return;
        }

        try {
            console.log('📤 Envoi des données au backend:', formData);
            
            // Utilisation de l'API configurée au lieu de fetch direct
            const response = await Api.post('/investissement/demande', {
                nom: formData.nom,
                email: formData.email,
                telephone: formData.telephone,
                paysInteret: paysActive,
                typeInvestissement: formData.typeInvestissement,
                budget: formData.budget,
                message: formData.message
            });

            console.log('📥 Réponse du backend:', response.data);

            if (response.data.success) {
                // Réinitialiser le formulaire
                setFormData({
                    nom: '',
                    email: '',
                    telephone: '',
                    paysInteret: 'maurice',
                    typeInvestissement: 'residentiel',
                    budget: '',
                    message: ''
                });
                
                alert('✅ ' + response.data.message);
                console.log('🎉 Demande créée avec succès:', response.data.data);
                
            } else {
                throw new Error(response.data.error || 'Erreur inconnue');
            }

        } catch (error: any) {
            console.error('❌ Erreur lors de l\'envoi:', error);
            
            // Gestion des erreurs spécifiques à axios
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               'Erreur lors de l\'envoi de la demande';
            
            setError(errorMessage);
            alert('❌ Erreur: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour ouvrir la modale d'audit
    const openAuditModal = () => {
        setIsAuditModalOpen(true);
    };

    // Fonction pour fermer la modale d'audit
    const closeAuditModal = () => {
        setIsAuditModalOpen(false);
    };

    // Fonction appelée après l'ajout d'un audit
    const handleAddAudit = (audit: any) => {
        console.log('✅ Audit ajouté avec succès:', audit);
        alert('Votre demande d\'audit a été enregistrée avec succès !');
        // Vous pouvez ajouter ici d'autres actions après l'ajout d'un audit
    };

    const paysActuel = paysData[paysActive];
    const bienActuel = typesBiens[typeBien];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="text-white py-16">
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" className='h-full object-cover w-full' alt="" />
                </div>
                <div className="container mx-auto px-4 mt-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl lg:text-3xl font-bold mb-4 tracking-widest">Investir à l'Étranger</h1>
                        <p className="text-sm lg:text-md opacity-90 mb-8 max-w-2xl mx-auto">
                            Diversifiez votre patrimoine avec nos solutions clés en main
                            dans les marchés porteurs à fort potentiel
                        </p>
                    </div>
                </div>
            </section>

            {/* Navigation Pays */}
            <section className="py-0 lg:py-4">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:flex justify-center gap-4">
                        {Object.entries(paysData).map(([key, pays]) => (
                            <button
                                key={key}
                                onClick={() => setPaysActive(key)}
                                className={`px-8 py-2 flex items-center gap-4 rounded-xl font-semibold transition-all duration-300 transform ${paysActive === key
                                        ? `bg-gradient-to-r ${pays.couleur} text-white shadow-lg`
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <div className="text-xl mb-2">{pays.image}</div>
                                {pays.nom}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Pays Active */}
            <section className=" p-4">
                <div className="container bg-white p-6 rounded-lg shadow-md mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Informations Pays */}
                        <div>
                            <div className={`inline-flex items-center text-xs lg:text-md px-2 py-1 rounded-full bg-gradient-to-r ${paysActuel.couleur} text-white text-lg font-semibold mb-6`}>
                                <span className="text-xs lg:text-2xl mr-3">{paysActuel.image}</span>
                                {paysActuel.nom}
                            </div>

                            <h2 className="text-xl lg:text-4xl font-bold text-gray-900 mb-8">
                                Opportunités d'investissement à {paysActuel.nom}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="font-bold flex gap-4 text-lg text-gray-900 mb-3"><ChartArea /> Fiscalité</h3>
                                    <p className="text-gray-700">{paysActuel.fiscalite}</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="font-bold flex gap-4 text-lg text-gray-900 mb-3"><BadgeDollarSign /> Rendement</h3>
                                    <p className="text-gray-700">{paysActuel.rendement}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Avantages clés</h3>
                                <div className="grid gap-3">
                                    {paysActuel.avantages.map((avantage, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                            <span className="text-gray-700">{avantage}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Opportunités</h3>
                                <div className="grid gap-3">
                                    {paysActuel.opportunites.map((opportunite, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                            <span className="text-gray-700">{opportunite}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Formulaire d'intérêt */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 lg:p-8 text-white">
                            <h3 className="text-2xl font-bold mb-6">Étude de projet à {paysActuel.nom}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Nom complet *</label>
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Téléphone *</label>
                                            <input
                                                type="tel"
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Type d'investissement</label>
                                        <select
                                            name="typeInvestissement"
                                            value={formData.typeInvestissement}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50"
                                        >
                                            <option value="residentiel">Résidentiel</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="touristique">Touristique</option>
                                            <option value="terrain">Terrain</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Budget estimé (€)</label>
                                        <select
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50"
                                        >
                                            <option value="">Sélectionnez...</option>
                                            <option value="100-300k">100 000 - 300 000 €</option>
                                            <option value="300-500k">300 000 - 500 000 €</option>
                                            <option value="500k-1M">500 000 - 1 M€</option>
                                            <option value="1M+">1 M€ et plus</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Message</label>
                                        <textarea
                                            name="message"
                                            rows={3}
                                            value={formData.message}
                                            onChange={handleChange}
                                            disabled={loading}
                                            placeholder="Décrivez votre projet..."
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50"
                                        ></textarea>
                                    </div>

                                    {/* Affichage des erreurs */}
                                    {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                            <strong>Erreur:</strong> {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-slate-950 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform ${
                                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                        }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Envoi en cours...
                                            </span>
                                        ) : (
                                            `Recevoir les opportunités ${paysActuel.nom}`
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Vente/Location/Gestion */}
            <section className="py-4 lg:py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
                        Vous avez déjà un bien à l'étranger ?
                    </h2>
                    <p className="text-md lg:text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Confiez-nous la gestion, la vente ou l'optimisation de votre patrimoine international
                    </p>

                    {/* Navigation Services */}
                    <div className=" lg:flex grid grid-cols-2 flex-wrap justify-center gap-2 lg:gap-4 mb-12">
                        {Object.entries(typesBiens).map(([key, service]) => (
                            <button
                                key={key}
                                onClick={() => setTypeBien(key)}
                                className={`px-1 lg:px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${typeBien === key
                                        ? `bg-gradient-to-r ${service.couleur} text-white shadow-lg`
                                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                                    }`}
                            >
                                {service.titre}
                            </button>
                        ))}
                    </div>

                    {/* Contenu Service Actif */}
                    <div className={`bg-gradient-to-r ${bienActuel.couleur} rounded-2xl p-8 text-white`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl font-bold mb-4">{bienActuel.titre}</h3>
                                <p className="text-xl opacity-90 mb-6">{bienActuel.description}</p>
                                <div className="space-y-3">
                                    {bienActuel.avantages.map((avantage, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-sm">✓</span>
                                            </div>
                                            <span>{avantage}</span>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={openAuditModal}
                                    className="mt-8 bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Demander un audit gratuit
                                </button>
                            </div>

                            <div className="bg-white bg-opacity-10 rounded-xl p-6">
                                <h4 className="text-xl font-bold mb-4">Processus simplifié</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">1</div>
                                        <span>Évaluation gratuite de votre bien</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">2</div>
                                        <span>Stratégie personnalisée</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">3</div>
                                        <span>Mise en œuvre et suivi</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">4</div>
                                        <span>Reporting régulier</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Réseau International */}
            <section className="py-4 lg:py-10 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
                        Notre réseau international
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6 flex flex-col items-center">
                            <div className="text-3xl mb-4"><Globe2 /></div>
                            <div className="text-2xl font-bold text-blue-600 mb-2">15+</div>
                            <div className="text-gray-600">Pays couverts</div>
                        </div>
                        <div className="p-6 flex flex-col items-center">
                            <div className="text-3xl mb-4"><HandshakeIcon /></div>
                            <div className="text-2xl font-bold text-blue-600 mb-2">50+</div>
                            <div className="text-gray-600">Partenaires locaux</div>
                        </div>
                        <div className="p-6 flex flex-col items-center">
                            <div className="text-3xl mb-4"><DollarSignIcon /></div>
                            <div className="text-2xl font-bold text-blue-600 mb-2">200M€</div>
                            <div className="text-gray-600">Volume transigé</div>
                        </div>
                        <div className="p-6 flex flex-col items-center">
                            <div className="text-3xl mb-4"><SparkleIcon /></div>
                            <div className="text-2xl font-bold text-blue-600 mb-2">98%</div>
                            <div className="text-gray-600">Clients satisfaits</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modale DemandeAudit */}
            <DemandeAudit 
                isOpen={isAuditModalOpen}
                onClose={closeAuditModal}
                onAddAudit={handleAddAudit}
            />
        </div>
    );
};

export default InvestirEtranger;