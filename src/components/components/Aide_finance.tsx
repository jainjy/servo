import React from 'react';
import {
    DollarSign,
    Heart,
    Shield,
    TrendingUp,
    FileText,
    Calculator,
    BadgeCheck,
    Target
} from 'lucide-react';

interface AideFinancement {
    id: string;
    titre: string;
    description: string;
    type: 'subvention' | 'pret' | 'avantage' | 'accompagnement';
    montantMax?: number;
    tauxAvantage?: number;
    eligibilite: string[];
    delai: string;
    contact: string;
}

interface AidesFinancementProps {
    entrepriseId?: string;
    secteurActivite?: string;
    localisation?: string;
}

const AidesFinancement: React.FC<AidesFinancementProps> = ({
    entrepriseId,
    secteurActivite = 'Technologie',
    localisation = 'France'
}) => {
    const aides: AideFinancement[] = [
        {
            id: '1',
            titre: 'Subvention Innovation',
            description: 'Aide financière pour les projets innovants et R&D',
            type: 'subvention',
            montantMax: 50000,
            eligibilite: ['PME', 'Startup', 'Projet innovant'],
            delai: '3-4 mois',
            contact: 'Bpifrance'
        },
        {
            id: '2',
            titre: 'Prêt Bonus',
            description: 'Prêt à taux zéro pour la transformation numérique',
            type: 'pret',
            montantMax: 100000,
            eligibilite: ['TPE', 'PME', 'Transition digitale'],
            delai: '2-3 mois',
            contact: 'Banque Partenaire'
        },
        {
            id: '3',
            titre: 'Crédit Impôt Innovation',
            description: 'Récupération de 30% des dépenses de R&D',
            type: 'avantage',
            tauxAvantage: 30,
            eligibilite: ['Toutes entreprises', 'Dépenses R&D'],
            delai: 'Déclaration annuelle',
            contact: 'Service des impôts'
        },
        {
            id: '4',
            titre: 'Accompagnement Export',
            description: 'Soutien financier pour développement à l\'international',
            type: 'accompagnement',
            montantMax: 25000,
            eligibilite: ['PME', 'Projet export'],
            delai: '2 mois',
            contact: 'Business France'
        },
        {
            id: '5',
            titre: 'Aide à l\'Embauche',
            description: 'Subvention pour recrutement de profils qualifiés',
            type: 'subvention',
            montantMax: 15000,
            eligibilite: ['Création poste', 'CDI'],
            delai: '1-2 mois',
            contact: 'Pôle Emploi'
        },
        {
            id: '6',
            titre: 'Prêt Vert',
            description: 'Financement avantageux pour transition écologique',
            type: 'pret',
            montantMax: 75000,
            eligibilite: ['Investissement vert', 'Éco-innovation'],
            delai: '3 mois',
            contact: 'Banque Environnement'
        }
    ];

    const getIconByType = (type: string) => {
        switch (type) {
            case 'subvention':
                return <DollarSign className="h-6 w-6 text-green-600" />;
            case 'pret':
                return <TrendingUp className="h-6 w-6 text-blue-600" />;
            case 'avantage':
                return <Shield className="h-6 w-6 text-purple-600" />;
            case 'accompagnement':
                return <Heart className="h-6 w-6 text-red-600" />;
            default:
                return <FileText className="h-6 w-6 text-gray-600" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'subvention':
                return 'Subvention';
            case 'pret':
                return 'Prêt avantageux';
            case 'avantage':
                return 'Avantage fiscal';
            case 'accompagnement':
                return 'Accompagnement';
            default:
                return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'subvention':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pret':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'avantage':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'accompagnement':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen py-8 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/1200x/a4/27/cf/a427cf2bd4915d03ae201f4f85285282.jpg" alt="" />
                    <div className="absolute left-2 bottom-0 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-xs font-semibold mb-4">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Aides au financement pour les entreprises
                    </div>
                </div>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-100 mb-4">
                        Solutions d'Aides au Financement
                    </h1>
                    <p className="text-sm lg:text-sm text-gray-200 max-w-3xl mx-auto">
                        Découvrez les aides financières, subventions et dispositifs d'accompagnement
                        adaptés à votre entreprise et votre projet
                    </p>
                </div>

                <div className='pt-10'>

                {/* Filtres et informations */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <Target className="h-5 w-5 text-blue-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-900">Secteur d'activité</div>
                                <div className="text-sm text-gray-600">{secteurActivite}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <BadgeCheck className="h-5 w-5 text-green-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-900">Localisation</div>
                                <div className="text-sm text-gray-600">{localisation}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Calculator className="h-5 w-5 text-purple-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-900">Aides disponibles</div>
                                <div className="text-sm text-gray-600">{aides.length} solutions</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grille des aides */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {aides.map((aide) => (
                        <div key={aide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            {/* En-tête de la carte */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        {getIconByType(aide.type)}
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(aide.type)}`}>
                                            {getTypeLabel(aide.type)}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {aide.titre}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {aide.description}
                                </p>
                            </div>

                            {/* Détails de l'aide */}
                            <div className="p-6 space-y-4">
                                {/* Montant ou taux */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Avantage</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {aide.montantMax && `${aide.montantMax.toLocaleString('fr-FR')} € max`}
                                        {aide.tauxAvantage && `${aide.tauxAvantage}% de crédit`}
                                    </span>
                                </div>

                                {/* Éligibilité */}
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-2">Conditions d'éligibilité</div>
                                    <div className="flex flex-wrap gap-1">
                                        {aide.eligibilite.map((condition, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                                            >
                                                {condition}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Délai et contact */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="font-medium text-gray-700">Délai de traitement</div>
                                        <div className="text-gray-600">{aide.delai}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-700">Contact</div>
                                        <div className="text-gray-600">{aide.contact}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-3 pt-4">
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                                        En savoir plus
                                    </button>
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                                        <FileText className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section informations complémentaires */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Besoin d'un accompagnement personnalisé ?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Nos conseillers spécialisés peuvent vous aider à identifier les aides
                            les plus adaptées à votre situation et vous accompagner dans vos démarches.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Étude de faisabilité</h3>
                            <p className="text-gray-600 text-sm">
                                Analyse approfondie de votre éligibilité aux différents dispositifs
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calculator className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Simulation financière</h3>
                            <p className="text-gray-600 text-sm">
                                Estimation précise du montant des aides et de leur impact sur votre trésorerie
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BadgeCheck className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Accompagnement dossier</h3>
                            <p className="text-gray-600 text-sm">
                                Assistance complète dans le montage et le suivi de votre dossier
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200">
                            Prendre rendez-vous avec un conseiller
                        </button>
                    </div>
                </div>

                {/* FAQ rapide */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Questions fréquentes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Quels sont les délais moyens d'obtention d'une aide ?
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Les délais varient de 1 à 4 mois selon le type d'aide et l'organisme financeur.
                                Les subventions sont généralement plus rapides que les prêts.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Peut-on cumuler plusieurs aides ?
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Oui, dans la plupart des cas, il est possible de cumuler différentes aides
                                tant qu'elles ne financent pas la même dépense.
                            </p>
                        </div>
                    </div>
                </div>

                </div>
            </div>
        </div>
    );
};

export default AidesFinancement;