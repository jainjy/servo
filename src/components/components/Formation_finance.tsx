import React, { useState } from 'react';
import {
    BookOpen,
    Clock,
    Users,
    Award,
    PlayCircle,
    Calendar,
    MapPin,
    Star,
    CheckCircle,
    FileText,
    Download,
    Share2
} from 'lucide-react';

interface Formation {
    id: string;
    titre: string;
    description: string;
    categorie: 'financement' | 'credit' | 'fiscalite' | 'gestion';
    niveau: 'debutant' | 'intermediaire' | 'avance';
    duree: string;
    format: 'presentiel' | 'en-ligne' | 'hybride';
    prix: number;
    prochaineSession: Date;
    lieu?: string;
    formateur: string;
    notation: number;
    participantsMax?: number;
    objectifs: string[];
    programme: string[];
}

interface FormationsFinancementProps {
    entrepriseId?: string;
    secteurActivite?: string;
}

const FormationsFinancement: React.FC<FormationsFinancementProps> = ({
    entrepriseId,
    secteurActivite = 'Tous secteurs'
}) => {
    const [filtreCategorie, setFiltreCategorie] = useState<string>('tous');
    const [filtreNiveau, setFiltreNiveau] = useState<string>('tous');

    const formations: Formation[] = [
        {
            id: '1',
            titre: 'Maîtriser les Financements d\'Entreprise',
            description: 'Formation complète sur les différents dispositifs de financement disponibles pour les entreprises',
            categorie: 'financement',
            niveau: 'intermediaire',
            duree: '2 jours',
            format: 'presentiel',
            prix: 890,
            prochaineSession: new Date('2024-02-15'),
            lieu: 'Paris',
            formateur: 'Sophie Martin',
            notation: 4.8,
            participantsMax: 12,
            objectifs: [
                'Identifier les sources de financement adaptées',
                'Maîtriser les dossiers de demande',
                'Optimiser sa stratégie de financement'
            ],
            programme: [
                'Landscape des financements',
                'Subventions et aides publiques',
                'Prêts bancaires et privés'
            ]
        },
        {
            id: '2',
            titre: 'Crédit et Analyse Financière',
            description: 'Apprenez à analyser les demandes de crédit et à négocier avec les banques',
            categorie: 'credit',
            niveau: 'avance',
            duree: '3 jours',
            format: 'en-ligne',
            prix: 1200,
            prochaineSession: new Date('2024-02-20'),
            formateur: 'Pierre Dubois',
            notation: 4.9,
            objectifs: [
                'Analyser une demande de crédit',
                'Négocier les conditions bancaires',
                'Comprendre les ratios financiers'
            ],
            programme: [
                'Analyse financière approfondie',
                'Négociation bancaire',
                'Gestion du risque crédit'
            ]
        },
        {
            id: '3',
            titre: 'Fiscalité du Financement',
            description: 'Optimisez votre stratégie fiscale dans le cadre de vos opérations de financement',
            categorie: 'fiscalite',
            niveau: 'intermediaire',
            duree: '1 jour',
            format: 'hybride',
            prix: 450,
            prochaineSession: new Date('2024-02-25'),
            lieu: 'Lyon',
            formateur: 'Marie Laurent',
            notation: 4.7,
            participantsMax: 20,
            objectifs: [
                'Comprendre les impacts fiscaux',
                'Optimiser les dispositifs',
                'Respecter la réglementation'
            ],
            programme: [
                'Fiscalité des subventions',
                'Crédits d\'impôt',
                'Optimisation légale'
            ]
        },
        {
            id: '4',
            titre: 'Introduction au Financement',
            description: 'Les bases du financement d\'entreprise pour les entrepreneurs et porteurs de projet',
            categorie: 'financement',
            niveau: 'debutant',
            duree: '1 jour',
            format: 'en-ligne',
            prix: 290,
            prochaineSession: new Date('2024-03-01'),
            formateur: 'Jean Petit',
            notation: 4.6,
            objectifs: [
                'Comprendre les concepts de base',
                'Identifier les premiers financements',
                'Préparer son business plan'
            ],
            programme: [
                'Les fondamentaux du financement',
                'Business plan et prévisionnel',
                'Premières démarches'
            ]
        },
        {
            id: '5',
            titre: 'Gestion de la Trésorerie',
            description: 'Apprenez à gérer efficacement votre trésorerie et optimiser votre besoin en fonds de roulement',
            categorie: 'gestion',
            niveau: 'intermediaire',
            duree: '2 jours',
            format: 'presentiel',
            prix: 750,
            prochaineSession: new Date('2024-03-05'),
            lieu: 'Bordeaux',
            formateur: 'Alain Bernard',
            notation: 4.8,
            participantsMax: 15,
            objectifs: [
                'Maîtriser la gestion de trésorerie',
                'Optimiser le BFR',
                'Anticiper les difficultés'
            ],
            programme: [
                'Gestion du cash-flow',
                'Analyse du BFR',
                'Outils de prévision'
            ]
        },
        {
            id: '6',
            titre: 'Financement de l\'Innovation',
            description: 'Découvrez les financements spécifiques aux projets innovants et de R&D',
            categorie: 'financement',
            niveau: 'avance',
            duree: '2 jours',
            format: 'hybride',
            prix: 950,
            prochaineSession: new Date('2024-03-10'),
            lieu: 'Toulouse',
            formateur: 'Nathalie Roche',
            notation: 4.9,
            participantsMax: 18,
            objectifs: [
                'Identifier les aides à l\'innovation',
                'Monter un dossier CIR',
                'Financer la R&D'
            ],
            programme: [
                'Aides à l\'innovation',
                'Crédit Impôt Recherche',
                'Financements européens'
            ]
        }
    ];

    const categories = [
        { value: 'tous', label: 'Toutes les catégories' },
        { value: 'financement', label: 'Financement' },
        { value: 'credit', label: 'Crédit' },
        { value: 'fiscalite', label: 'Fiscalité' },
        { value: 'gestion', label: 'Gestion' }
    ];

    const niveaux = [
        { value: 'tous', label: 'Tous les niveaux' },
        { value: 'debutant', label: 'Débutant' },
        { value: 'intermediaire', label: 'Intermédiaire' },
        { value: 'avance', label: 'Avancé' }
    ];

    const formationsFiltrees = formations.filter(formation => {
        const matchCategorie = filtreCategorie === 'tous' || formation.categorie === filtreCategorie;
        const matchNiveau = filtreNiveau === 'tous' || formation.niveau === filtreNiveau;
        return matchCategorie && matchNiveau;
    });

    const getCategorieLabel = (categorie: string) => {
        switch (categorie) {
            case 'financement':
                return 'Financement';
            case 'credit':
                return 'Crédit';
            case 'fiscalite':
                return 'Fiscalité';
            case 'gestion':
                return 'Gestion';
            default:
                return categorie;
        }
    };

    const getNiveauLabel = (niveau: string) => {
        switch (niveau) {
            case 'debutant':
                return 'Débutant';
            case 'intermediaire':
                return 'Intermédiaire';
            case 'avance':
                return 'Avancé';
            default:
                return niveau;
        }
    };

    const getNiveauColor = (niveau: string) => {
        switch (niveau) {
            case 'debutant':
                return 'bg-green-100 text-green-800';
            case 'intermediaire':
                return 'bg-blue-100 text-blue-800';
            case 'avance':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'presentiel':
                return <MapPin className="h-4 w-4" />;
            case 'en-ligne':
                return <PlayCircle className="h-4 w-4" />;
            case 'hybride':
                return <Users className="h-4 w-4" />;
            default:
                return <BookOpen className="h-4 w-4" />;
        }
    };

    const renderStars = (note: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.floor(note)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">({note})</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/1200x/ff/71/1f/ff711ff866a562d1b9ee1c5ce68f8ecc.jpg" alt="" />
                </div>
                <div className="text-center mb-12">

                    <h1 className="text-4xl font-bold text-gray-100 mb-4">
                        Formations au Financement et Crédit
                    </h1>
                    <p className="text-sm text-gray-200 max-w-3xl mx-auto">
                        Développez vos compétences en financement d'entreprise avec nos formations
                        animées par des experts du secteur
                    </p>
                </div>
                <div className='pt-10'>
                    {/* Filtres */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie
                                </label>
                                <select
                                    value={filtreCategorie}
                                    onChange={(e) => setFiltreCategorie(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map((categorie) => (
                                        <option key={categorie.value} value={categorie.value}>
                                            {categorie.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Niveau
                                </label>
                                <select
                                    value={filtreNiveau}
                                    onChange={(e) => setFiltreNiveau(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.value} value={niveau.value}>
                                            {niveau.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <div className="text-sm text-gray-600">
                                    {formationsFiltrees.length} formation(s) trouvée(s)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grille des formations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {formationsFiltrees.map((formation) => (
                            <div key={formation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                <div className="p-6">
                                    {/* En-tête */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNiveauColor(formation.niveau)}`}>
                                                    {getNiveauLabel(formation.niveau)}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {getCategorieLabel(formation.categorie)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {formation.titre}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {formation.prix.toLocaleString('fr-FR')} €
                                            </div>
                                            <div className="text-sm text-gray-500">HT</div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-4">
                                        {formation.description}
                                    </p>

                                    {/* Métadonnées */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span>{formation.duree}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getFormatIcon(formation.format)}
                                            <span className="capitalize">{formation.format}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>{formation.prochaineSession.toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        {formation.lieu && (
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span>{formation.lieu}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Formateur et notation */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formation.formateur}
                                            </div>
                                            {renderStars(formation.notation)}
                                        </div>
                                        {formation.participantsMax && (
                                            <div className="text-sm text-gray-600">
                                                <Users className="h-4 w-4 inline mr-1" />
                                                {formation.participantsMax} places max
                                            </div>
                                        )}
                                    </div>

                                    {/* Objectifs */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Objectifs pédagogiques</h4>
                                        <ul className="space-y-1">
                                            {formation.objectifs.slice(0, 3).map((objectif, index) => (
                                                <li key={index} className="flex items-center text-sm text-gray-600">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    {objectif}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-3">
                                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                            S'inscrire
                                        </button>
                                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200">
                                            <FileText className="h-4 w-4" />
                                        </button>
                                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200">
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Section avantages */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Pourquoi choisir nos formations ?
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Experts certifiés</h3>
                                <p className="text-gray-600 text-sm">
                                    Formateurs experts avec minimum 10 ans d'expérience
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Download className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Support complet</h3>
                                <p className="text-gray-600 text-sm">
                                    Documentation et outils pratiques fournis
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Certification</h3>
                                <p className="text-gray-600 text-sm">
                                    Attestation de formation reconnue
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Groupes limités</h3>
                                <p className="text-gray-600 text-sm">
                                    Effectifs réduits pour un meilleur accompagnement
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formation sur mesure */}
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Formation sur mesure pour votre entreprise
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                                Nous adaptons nos formations à vos besoins spécifiques et pouvons intervenir
                                directement dans vos locaux pour former vos équipes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200">
                                    Demander un devis personnalisé
                                </button>
                                <button className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 py-3 px-8 rounded-lg font-medium transition-colors duration-200">
                                    Télécharger le catalogue complet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormationsFinancement;