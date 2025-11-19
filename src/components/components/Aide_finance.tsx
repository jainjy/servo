import React, { useState } from 'react';
import {
    DollarSign,
    Heart,
    Shield,
    TrendingUp,
    FileText,
    Calculator,
    BadgeCheck,
    Target,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    Users,
    Lightbulb
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
    const [selectedAide, setSelectedAide] = useState<AideFinancement | null>(null);
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

    // Composant Modal détaillé
    const DetailModal = ({ aide, onClose }: { aide: AideFinancement; onClose: () => void }) => {
        const detailedInfos: Record<string, any> = {
            '1': {
                description: 'Cette subvention est destinée à soutenir les projets innovants nécessitant des dépenses en recherche et développement.',
                documents: ['Plan de financement', 'CV du responsable projet', 'Avis d\'imposition', 'Statuts de l\'entreprise'],
                etapes: [
                    'Préparation du dossier complet',
                    'Soumission auprès de Bpifrance',
                    'Évaluation du projet (2-3 semaines)',
                    'Instruction et validation',
                    'Versement de la subvention'
                ],
                conditions: 'PME ou Startup avec un projet innovant, localisation en France',
                taux: 'Jusqu\'à 30% des investissements',
                plusInfo: 'Compatible avec d\'autres aides. Peut inclure un volet formation.'
            },
            '2': {
                description: 'Prêt à taux zéro spécialement conçu pour accompagner les entreprises dans leur transformation numérique.',
                documents: ['Plan de développement numérique', 'Bilan prévisionnel', 'Justificatif d\'activité', 'Copie du KBIS'],
                etapes: [
                    'Montage du dossier avec la banque',
                    'Instruction du dossier (1-2 semaines)',
                    'Accord de principe',
                    'Signature des documents',
                    'Déblocage des fonds'
                ],
                conditions: 'TPE, PME engagées dans la transition digitale',
                taux: '0% d\'intérêt sur la durée du prêt',
                plusInfo: 'Délai de remboursement : 5 à 7 ans. Pas de garantie exigée.'
            },
            '3': {
                description: 'Crédit d\'impôt permettant de récupérer 30% des dépenses de recherche et développement.',
                documents: ['Déclaration fiscal complète', 'Compte-rendu des activités R&D', 'Détail des dépenses', 'Justificatifs de dépenses'],
                etapes: [
                    'Identification des dépenses R&D éligibles',
                    'Calcul du montant récupérable',
                    'Déclaration dans la liasse fiscale',
                    'Transmission à l\'administration',
                    'Remboursement ou crédit d\'impôt'
                ],
                conditions: 'Toutes les entreprises avec dépenses de R&D',
                taux: '30% des dépenses éligibles',
                plusInfo: 'Remboursement possible si crédit supérieur à l\'impôt dû.'
            },
            '4': {
                description: 'Programme d\'aide pour les entreprises souhaitant développer leurs activités à l\'international.',
                documents: ['Business plan export', 'Étude de marché', 'Plan marketing', 'Références clients'],
                etapes: [
                    'Candidature auprès de Business France',
                    'Sélection du dossier',
                    'Diagnostic export',
                    'Mise en œuvre du plan',
                    'Suivi et accompagnement'
                ],
                conditions: 'PME avec projet export crédible et structuré',
                taux: 'Financement partiel jusqu\'à 25 000€',
                plusInfo: 'Accès à un réseau international. Accompagnement de 12 mois.'
            },
            '5': {
                description: 'Aide financière pour encourager les entreprises à créer des emplois, particulièrement pour des profils qualifiés.',
                documents: ['Offre d\'emploi détaillée', 'CV du candidat retenu', 'Contrat de travail', 'Preuve de signature'],
                etapes: [
                    'Création de l\'offre d\'emploi',
                    'Recrutement et signature du CDI',
                    'Déclaration auprès de Pôle Emploi',
                    'Instruction du dossier (2-4 semaines)',
                    'Versement de la subvention'
                ],
                conditions: 'Création de nouveaux postes en CDI, secteurs prioritaires',
                taux: 'Jusqu\'à 15 000€ par emploi créé',
                plusInfo: 'Peut être complétée par des formations subventionnées.'
            },
            '6': {
                description: 'Financement avantageux pour les investissements visant la transition écologique et énergétique.',
                documents: ['Devis de travaux', 'Plan environnemental', 'Audit énergétique', 'Justificatifs écologiques'],
                etapes: [
                    'Évaluation des travaux verts',
                    'Montage du dossier',
                    'Présentation à la banque verte',
                    'Accord de financement',
                    'Déblocage du prêt'
                ],
                conditions: 'Investissements écologiques ou éco-innovations',
                taux: 'Taux réduit de 1-2% selon projet',
                plusInfo: 'Peut être combiné avec des subventions écologiques publiques.'
            }
        };

        const info = detailedInfos[aide.id] || {
            description: aide.description,
            documents: [],
            etapes: [],
            conditions: '',
            taux: '',
            plusInfo: ''
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* En-tête de la modale */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                {getIconByType(aide.type)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{aide.titre}</h2>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mt-2 bg-white/20 text-white border-white/30`}>
                                    {getTypeLabel(aide.type)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Contenu de la modale */}
                    <div className="p-8 space-y-8">
                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                <Lightbulb className="w-5 h-5 text-blue-600" />
                                <span>À propos de cette aide</span>
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {info.description}
                            </p>
                        </div>

                        {/* Détails clés */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="text-sm font-medium text-gray-600 mb-1">Montant maximum</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {aide.montantMax && `${aide.montantMax.toLocaleString('fr-FR')} €`}
                                    {aide.tauxAvantage && `${aide.tauxAvantage}%`}
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <div className="text-sm font-medium text-gray-600 mb-1">Délai de traitement</div>
                                <div className="text-lg font-bold text-green-600 flex items-center space-x-2">
                                    <Clock className="w-5 h-5" />
                                    <span>{aide.delai}</span>
                                </div>
                            </div>
                        </div>

                        {/* Conditions d'éligibilité */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <BadgeCheck className="w-5 h-5 text-green-600" />
                                <span>Conditions d'éligibilité</span>
                            </h3>
                            <div className="space-y-3">
                                {aide.eligibilite.map((condition, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{condition}</span>
                                    </div>
                                ))}
                            </div>
                            {info.conditions && (
                                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-amber-800">
                                        <strong>Conditions spécifiques :</strong> {info.conditions}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Étapes de la demande */}
                        {info.etapes.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                    <span>Étapes de la demande</span>
                                </h3>
                                <div className="space-y-3">
                                    {info.etapes.map((etape, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <span className="text-gray-700 pt-1">{etape}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents à préparer */}
                        {info.documents.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    <span>Documents à préparer</span>
                                </h3>
                                <div className="space-y-2">
                                    {info.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                                            <span className="text-gray-700">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Informations supplémentaires */}
                        {info.plusInfo && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                    <span>Informations utiles</span>
                                </h4>
                                <p className="text-gray-700 text-sm">{info.plusInfo}</p>
                            </div>
                        )}

                        {/* Contact */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Users className="w-5 h-5 text-gray-600" />
                                <span>Organisme responsable</span>
                            </h4>
                            <div className="text-lg font-bold text-gray-900">{aide.contact}</div>
                            <p className="text-sm text-gray-600 mt-2">
                                Contactez directement cet organisme pour plus d'informations ou pour initier votre demande.
                            </p>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex space-x-4 pt-4 border-t">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
                                Commencer une demande
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                                    <button 
                                        onClick={() => setSelectedAide(aide)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                                    >
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

            {/* Modale détaillée */}
            {selectedAide && (
                <DetailModal aide={selectedAide} onClose={() => setSelectedAide(null)} />
            )}
        </div>
    );
};

export default AidesFinancement;