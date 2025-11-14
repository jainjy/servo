import React, { useState } from 'react';
import {
  Calculator,
  FileText,
  TrendingUp,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Award,
  BarChart3,
  Receipt,
  Building,
  Download,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface ServiceComptable {
  id: string;
  titre: string;
  description: string;
  categorie: 'comptabilite' | 'fiscalite' | 'paie' | 'conseil' | 'audit';
  forfait: 'basique' | 'standard' | 'premium' | 'sur-mesure';
  prix?: number;
  prixSurMesure?: boolean;
  delai: string;
  inclus: string[];
  publicCible: string[];
  avantages: string[];
}

interface ComptabiliteServicesProps {
  entrepriseId?: string;
  typeEntreprise?: 'auto-entrepreneur' | 'sarl' | 'sas' | 'eurl' | 'autre';
  chiffreAffaire?: number;
}

const ComptabiliteServices: React.FC<ComptabiliteServicesProps> = ({
  entrepriseId,
  typeEntreprise = 'sarl',
  chiffreAffaire = 50000
}) => {
  const [filtreCategorie, setFiltreCategorie] = useState<string>('tous');
  const [forfaitSelectionne, setForfaitSelectionne] = useState<string>('tous');

  const services: ServiceComptable[] = [
    {
      id: '1',
      titre: 'Comptabilité Complète',
      description: 'Gestion complète de votre comptabilité avec établissement des états financiers',
      categorie: 'comptabilite',
      forfait: 'standard',
      prix: 299,
      delai: 'Mensuel',
      inclus: [
        'Saisie des écritures comptables',
        'Établissement des balances',
        'Bilan et compte de résultat',
        'Tableaux de bord financiers',
        'Conformité légale'
      ],
      publicCible: ['PME', 'SARL', 'SAS', 'EURL'],
      avantages: ['Gain de temps', 'Conformité assurée', 'Vision financière claire']
    },
    {
      id: '2',
      titre: 'Déclarations Fiscales',
      description: 'Préparation et dépôt de toutes vos déclarations fiscales',
      categorie: 'fiscalite',
      forfait: 'standard',
      prix: 199,
      delai: 'Trimestriel/Annuel',
      inclus: [
        'Déclaration de TVA',
        'Impôt sur les sociétés',
        'CFE et CVAE',
        'Déclarations annexes',
        'Optimisation fiscale'
      ],
      publicCible: ['Toutes entreprises', 'Auto-entrepreneurs'],
      avantages: ['Réduction d\'impôt', 'Conformité fiscale', 'Alertes échéances']
    },
    {
      id: '3',
      titre: 'Gestion de la Paie',
      description: 'Service complet de gestion de paie pour vos collaborateurs',
      categorie: 'paie',
      forfait: 'basique',
      prix: 45,
      prixSurMesure: true,
      delai: 'Mensuel',
      inclus: [
        'Bulletins de paie',
        'Déclarations sociales',
        'Gestion des congés',
        'DADS-U et DSN',
        'Convention collective'
      ],
      publicCible: ['Entreprises avec salariés', 'Associations'],
      avantages: ['Gain de temps', 'Conformité sociale', 'Relations employeurs']
    },
    {
      id: '4',
      titre: 'Audit Comptable',
      description: 'Vérification et certification de vos états financiers',
      categorie: 'audit',
      forfait: 'sur-mesure',
      prixSurMesure: true,
      delai: 'Selon mission',
      inclus: [
        'Vérification complète des comptes',
        'Certification des états financiers',
        'Rapport d\'audit détaillé',
        'Recommandations d\'amélioration',
        'Conformité aux normes'
      ],
      publicCible: ['Grandes entreprises', 'Sociétés cotées', 'Associations'],
      avantages: ['Confiance des partenaires', 'Détection des risques', 'Amélioration continue']
    },
    {
      id: '5',
      titre: 'Conseil Stratégique',
      description: 'Accompagnement personnalisé pour vos décisions financières',
      categorie: 'conseil',
      forfait: 'premium',
      prix: 450,
      delai: 'Selon besoins',
      inclus: [
        'Analyse financière approfondie',
        'Business plan et prévisionnel',
        'Stratégie de financement',
        'Optimisation de la trésorerie',
        'Tableaux de bord personnalisés'
      ],
      publicCible: ['Startups', 'PME en croissance', 'Entreprises en difficulté'],
      avantages: ['Décisions éclairées', 'Croissance maîtrisée', 'Risques anticipés']
    },
    {
      id: '6',
      titre: 'Comptabilité Auto-entrepreneur',
      description: 'Service adapté aux spécificités des auto-entrepreneurs',
      categorie: 'comptabilite',
      forfait: 'basique',
      prix: 79,
      delai: 'Trimestriel',
      inclus: [
        'Déclaration de chiffre d\'affaires',
        'Calcul des cotisations',
        'Suivi des recettes/dépenses',
        'Assistance déclarative',
        'Conseil régime fiscal'
      ],
      publicCible: ['Auto-entrepreneurs', 'Micro-entreprises'],
      avantages: ['Simplicité', 'Coût maîtrisé', 'Conformité assurée']
    }
  ];

  const categories = [
    { value: 'tous', label: 'Tous les services' },
    { value: 'comptabilite', label: 'Comptabilité' },
    { value: 'fiscalite', label: 'Fiscalité' },
    { value: 'paie', label: 'Paie' },
    { value: 'audit', label: 'Audit' },
    { value: 'conseil', label: 'Conseil' }
  ];

  const forfaits = [
    { value: 'tous', label: 'Tous les forfaits' },
    { value: 'basique', label: 'Basique' },
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'sur-mesure', label: 'Sur mesure' }
  ];

  const servicesFiltres = services.filter(service => {
    const matchCategorie = filtreCategorie === 'tous' || service.categorie === filtreCategorie;
    const matchForfait = forfaitSelectionne === 'tous' || service.forfait === forfaitSelectionne;
    return matchCategorie && matchForfait;
  });

  const getCategorieIcon = (categorie: string) => {
    switch (categorie) {
      case 'comptabilite':
        return <Calculator className="h-6 w-6 text-blue-600" />;
      case 'fiscalite':
        return <FileText className="h-6 w-6 text-green-600" />;
      case 'paie':
        return <Users className="h-6 w-6 text-purple-600" />;
      case 'audit':
        return <Shield className="h-6 w-6 text-red-600" />;
      case 'conseil':
        return <TrendingUp className="h-6 w-6 text-orange-600" />;
      default:
        return <BarChart3 className="h-6 w-6 text-gray-600" />;
    }
  };

  const getCategorieLabel = (categorie: string) => {
    switch (categorie) {
      case 'comptabilite':
        return 'Comptabilité';
      case 'fiscalite':
        return 'Fiscalité';
      case 'paie':
        return 'Paie';
      case 'audit':
        return 'Audit';
      case 'conseil':
        return 'Conseil';
      default:
        return categorie;
    }
  };

  const getForfaitColor = (forfait: string) => {
    switch (forfait) {
      case 'basique':
        return 'bg-green-100 text-green-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'sur-mesure':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getForfaitLabel = (forfait: string) => {
    switch (forfait) {
      case 'basique':
        return 'Basique';
      case 'standard':
        return 'Standard';
      case 'premium':
        return 'Premium';
      case 'sur-mesure':
        return 'Sur mesure';
      default:
        return forfait;
    }
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
            Services Comptables Professionnels
          </h1>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto">
            Des solutions comptables complètes et adaptées à votre entreprise,
            pour une gestion financière sereine et conforme
          </p>
        </div>

        {/* Filtres */}
        <div className='pt-16'>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de service
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
                  Type de forfait
                </label>
                <select
                  value={forfaitSelectionne}
                  onChange={(e) => setForfaitSelectionne(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {forfaits.map((forfait) => (
                    <option key={forfait.value} value={forfait.value}>
                      {forfait.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  {servicesFiltres.length} service(s) trouvé(s)
                </div>
              </div>
            </div>
          </div>

          {/* Grille des services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {servicesFiltres.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getCategorieIcon(service.categorie)}
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getForfaitColor(service.forfait)}`}>
                          {getForfaitLabel(service.forfait)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.titre}
                  </h3>

                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>

                  {/* Prix et délai */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {service.prixSurMesure ? (
                        <span className="text-lg">Sur devis</span>
                      ) : (
                        `${service.prix?.toLocaleString('fr-FR')} €`
                      )}
                      <span className="text-sm font-normal text-gray-500 block">
                        {service.prix && 'HT / mois'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.delai}
                      </div>
                    </div>
                  </div>

                  {/* Public cible */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Public cible</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.publicCible.map((publicItem, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {publicItem}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Services inclus */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Services inclus</h4>
                    <ul className="space-y-2">
                      {service.inclus.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                      {service.inclus.length > 3 && (
                        <li className="text-sm text-blue-600">
                          + {service.inclus.length - 3} autres services
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Avantages */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Avantages</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.avantages.map((avantage, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {avantage}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                      Demander un devis
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section pourquoi nous choisir */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pourquoi choisir nos services comptables ?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Experts certifiés</h3>
                <p className="text-gray-600 text-sm">
                  Comptables experts-comptables diplômés et expérimentés
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Conformité garantie</h3>
                <p className="text-gray-600 text-sm">
                  Respect strict des obligations légales et fiscales
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Outils modernes</h3>
                <p className="text-gray-600 text-sm">
                  Plateforme digitale pour un suivi en temps réel
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Réactivité</h3>
                <p className="text-gray-600 text-sm">
                  Réponse sous 24h et accompagnement personnalisé
                </p>
              </div>
            </div>
          </div>

          {/* Section contact */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Un projet spécifique ?
                </h2>
                <p className="text-gray-600 mb-6">
                  Notre équipe d'experts-comptables est à votre disposition pour
                  étudier votre situation et vous proposer une solution sur mesure.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-3 text-blue-600" />
                    <span>01 23 45 67 89</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 mr-3 text-blue-600" />
                    <span>contact@comptabilite-pro.fr</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                    <span>123 Avenue des Champs, 75008 Paris</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Demande d'information
                </h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nom de votre entreprise"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Type de service recherché</option>
                      <option>Comptabilité complète</option>
                      <option>Déclarations fiscales</option>
                      <option>Gestion de paie</option>
                      <option>Audit</option>
                      <option>Conseil</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Être contacté
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComptabiliteServices;