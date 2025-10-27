import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, Shield, Users, Target, Download, Mail } from 'lucide-react';

// Types et données (inchangés)
interface InvestmentType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  expectedReturn: string;
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
  minInvestment: string;
  liquidity: string;
  duration: string;
  advantages: string[];
  steps: string[];
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  color: string;
  gradient: string;
  image: string;
}

const INVESTMENT_TYPES: { [key: string]: InvestmentType } = {
  scpi: {
    id: 'scpi',
    title: 'Société Civile de Placement Immobilier',
    subtitle: 'L\'immobilier géré sans les contraintes locatives',
    description: 'Investissez dans un parc immobilier diversifié géré par des professionnels',
    longDescription: 'Les SCPI vous permettent d\'investir dans l\'immobilier sans les contraintes de gestion. Vous devenez propriétaire de parts dans une société qui détient et gère un parc immobilier professionnel. Les revenus locatifs sont redistribués aux investisseurs proportionnellement à leur nombre de parts.',
    expectedReturn: '4% - 6% annuel',
    riskLevel: 'Faible',
    minInvestment: '5 000 €',
    liquidity: 'Moyenne',
    duration: 'Long terme (5+ ans)',
    advantages: [
      'Diversification immobilière automatique',
      'Gestion déléguée par des professionnels',
      'Revenus locatifs réguliers',
      'Fiscalité avantageuse',
      'Accessibilité avec un capital réduit'
    ],
    steps: [
      'Ouverture d\'un compte chez un courtier',
      'Choix de la SCPI selon votre profil',
      'Investissement à partir de 5 000 €',
      'Perception trimestrielle des revenus',
      'Possibilité de revente sur le marché secondaire'
    ],
    features: [
      {
        title: 'Diversification',
        description: 'Répartition sur plusieurs types de biens et zones géographiques',
        icon: <Target className="w-6 h-6" />
      },
      {
        title: 'Gestion Professionnelle',
        description: 'Experts dédiés à la gestion locative et administrative',
        icon: <Users className="w-6 h-6" />
      },
      {
        title: 'Rendement Stable',
        description: 'Revenus réguliers issus des loyers commerciaux',
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        title: 'Sécurité',
        description: 'Actifs tangibles avec historique de performance',
        icon: <Shield className="w-6 h-6" />
      }
    ],
    color: 'purple',
    gradient: 'from-purple-600 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  },
  crowdfunding: {
    id: 'crowdfunding',
    title: 'Financement Participatif Immobilier',
    subtitle: 'Investissez directement dans des projets immobiliers',
    description: 'Devenez financeur de projets immobiliers sélectionnés',
    longDescription: 'Le crowdfunding immobilier vous permet d\'investir directement dans des projets de construction ou de rénovation. Vous participez au financement aux côtés d\'investisseurs institutionnels et bénéficiez de rendements attractifs en contrepartie du risque pris.',
    expectedReturn: '8% - 12% annuel',
    riskLevel: 'Élevé',
    minInvestment: '1 000 €',
    liquidity: 'Faible',
    duration: 'Moyen terme (2-4 ans)',
    advantages: [
      'Rendements potentiellement élevés',
      'Sélection rigoureuse des projets',
      'Transparence totale sur le projet',
      'Implication directe dans l\'économie réelle',
      'Diversification par petits montants'
    ],
    steps: [
      'Inscription sur une plateforme régulée',
      'Analyse des projets disponibles',
      'Investissement à partir de 1 000 €',
      'Suivi régulier de l\'avancement du projet',
      'Remboursement avec intérêts à l\'échéance'
    ],
    features: [
      {
        title: 'Rendement Élevé',
        description: 'Rémunération attractive pour participation au risque',
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        title: 'Projets Concrets',
        description: 'Investissement dans des opérations immobilières réelles',
        icon: <Target className="w-6 h-6" />
      },
      {
        title: 'Processus Simple',
        description: 'Plateforme digitale pour un investissement facilité',
        icon: <Users className="w-6 h-6" />
      },
      {
        title: 'Durée Définie',
        description: 'Horizon d\'investissement clair et limité dans le temps',
        icon: <Calendar className="w-6 h-6" />
      }
    ],
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  },
  crypto: {
    id: 'crypto',
    title: 'Gestion de Crypto-actifs',
    subtitle: 'Diversifiez avec les actifs numériques',
    description: 'Solutions d\'investissement en crypto-monnaies et blockchain',
    longDescription: 'Les crypto-actifs représentent une nouvelle classe d\'actifs offrant des opportunités de diversification et de rendement. Notre approche combine analyse fondamentale, gestion des risques et stratégies d\'investissement adaptées à votre profil.',
    expectedReturn: 'Variable',
    riskLevel: 'Élevé',
    minInvestment: '500 €',
    liquidity: 'Élevée',
    duration: 'Flexible',
    advantages: [
      'Potentiel de rendement élevé',
      'Marché ouvert 24h/24',
      'Diversification internationale',
      'Innovation technologique',
      'Accessibilité démocratique'
    ],
    steps: [
      'Ouverture d\'un compte sur une plateforme sécurisée',
      'Définition de votre stratégie d\'investissement',
      'Mise en place des outils de sécurité',
      'Diversification du portefeuille',
      'Suivi et rééquilibrage régulier'
    ],
    features: [
      {
        title: 'Analyse Avancée',
        description: 'Outils professionnels d\'analyse technique et fondamentale',
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        title: 'Sécurité Maximale',
        description: 'Protocoles de sécurité renforcés pour vos actifs',
        icon: <Shield className="w-6 h-6" />
      },
      {
        title: 'Diversification',
        description: 'Accès à une large gamme d\'actifs numériques',
        icon: <Target className="w-6 h-6" />
      },
      {
        title: 'Liquidité',
        description: 'Marchés actifs permettant des transactions rapides',
        icon: <Users className="w-6 h-6" />
      }
    ],
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1516245834210-8a6a0265f6b3?auto=format&fit=crop&w=800&q=80'
  },
  isr: {
    id: 'isr',
    title: 'Investissement Socialement Responsable',
    subtitle: 'Donnez du sens à votre épargne',
    description: 'Fonds d\'investissement intégrant des critères ESG',
    longDescription: 'L\'ISR (Investissement Socialement Responsable) combine performance financière et impact positif sur la société et l\'environnement. Nos fonds sélectionnent des entreprises exemplaires selon des critères environnementaux, sociaux et de gouvernance (ESG).',
    expectedReturn: '3% - 5% annuel',
    riskLevel: 'Moyen',
    minInvestment: '100 €',
    liquidity: 'Élevée',
    duration: 'Flexible',
    advantages: [
      'Impact social et environnemental positif',
      'Risque réduit grâce à une gouvernance renforcée',
      'Performance financière durable',
      'Transparence et reporting détaillé',
      'Alignement avec vos valeurs'
    ],
    steps: [
      'Définition de vos critères ESG prioritaires',
      'Sélection des fonds ISR adaptés',
      'Investissement via votre assurance vie ou CTO',
      'Suivi régulier de la performance et de l\'impact',
      'Reporting détaillé sur les impacts générés'
    ],
    features: [
      {
        title: 'Impact Mesurable',
        description: 'Suivi concret des impacts environnementaux et sociaux',
        icon: <Target className="w-6 h-6" />
      },
      {
        title: 'Risque Maîtrisé',
        description: 'Approche réduisant les risques extra-financiers',
        icon: <Shield className="w-6 h-6" />
      },
      {
        title: 'Transparence',
        description: 'Reporting détaillé sur les critères ESG',
        icon: <Users className="w-6 h-6" />
      },
      {
        title: 'Performance Durable',
        description: 'Rendements compétitifs sur le long terme',
        icon: <TrendingUp className="w-6 h-6" />
      }
    ],
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    image: 'https://images.unsplash.com/photo-1569163139394-de44cb54d536?auto=format&fit=crop&w=800&q=80'
  }
};


const RiskBadge = ({ level }: { level: string }) => {
  const styles = {
    Faible: 'bg-green-100 text-green-800 border-green-200',
    Moyen: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Élevé: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[level as keyof typeof styles]}`}>
      Risque {level}
    </span>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// Composant pour le modal de contact
const ContactModal = ({ isOpen, onClose, investmentType }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    investmentAmount: '',
    timeline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi de formulaire
    console.log('Formulaire soumis:', { ...formData, investmentType });
    alert('Votre demande a été envoyée ! Un conseiller vous contactera dans les 24h.');
    onClose();
    setFormData({ name: '', email: '', phone: '', message: '', investmentAmount: '', timeline: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Contacter un conseiller</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Votre nom"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Votre numéro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant d'investissement envisagé</label>
            <select
              value={formData.investmentAmount}
              onChange={(e) => setFormData({...formData, investmentAmount: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionnez un montant</option>
              <option value="5000-10000">5 000 € - 10 000 €</option>
              <option value="10000-50000">10 000 € - 50 000 €</option>
              <option value="50000-100000">50 000 € - 100 000 €</option>
              <option value="100000+">Plus de 100 000 €</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horizon d'investissement</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionnez une durée</option>
              <option value="court">Court terme (1-3 ans)</option>
              <option value="moyen">Moyen terme (3-7 ans)</option>
              <option value="long">Long terme (7+ ans)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Vos questions ou commentaires..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Envoyer ma demande
          </button>
        </form>
      </div>
    </div>
  );
};

const InvestissementDetail = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState<InvestmentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type && INVESTMENT_TYPES[type]) {
        setInvestment(INVESTMENT_TYPES[type]);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [type]);

  // Fonction pour télécharger la documentation
  const handleDownloadDocumentation = () => {
    // Simulation de téléchargement
    const documentContent = `
      DOCUMENTATION - ${investment?.title}
      
      ${investment?.longDescription}
      
      CARACTÉRISTIQUES :
      - Rendement attendu : ${investment?.expectedReturn}
      - Investissement minimum : ${investment?.minInvestment}
      - Niveau de risque : ${investment?.riskLevel}
      - Liquidité : ${investment?.liquidity}
      - Durée recommandée : ${investment?.duration}
      
      AVANTAGES :
      ${investment?.advantages.map(adv => `• ${adv}`).join('\n')}
      
      ÉTAPES D'INVESTISSEMENT :
      ${investment?.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
      
      Pour plus d'informations, contactez nos conseillers au 01 23 45 67 89
      ou par email : investissements@votre-domaine.com
    `;
    
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documentation-${type}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowDocumentationModal(false);
  };

  // Fonction pour afficher la documentation en ligne
  const handleViewDocumentation = () => {
    setShowDocumentationModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investissement non trouvé</h1>
          <p className="text-gray-600 mb-8">Le type d'investissement que vous recherchez n'existe pas.</p>
          <Link 
            to="/investissement" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux investissements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header avec image */}
      <div className="relative h-96 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${investment.gradient} opacity-90`}></div>
        <img
          src={investment.image}
          alt={investment.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-white mb-8 hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
              <h1 className="text-2xl lg:text-5xl font-bold text-white mb-4">
                {investment.title}
              </h1>
              <p className="text-sm lg:text-xl text-gray-200 mb-6">
                {investment.subtitle}
              </p>
              <RiskBadge level={investment.riskLevel} />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Présentation</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {investment.longDescription}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {investment.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-${investment.color}-100 rounded-xl flex items-center justify-center`}>
                      <div className={`text-${investment.color}-600`}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Avantages */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Avantages Clés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investment.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 bg-${investment.color}-100 rounded-full flex items-center justify-center`}>
                      <div className={`w-2 h-2 bg-${investment.color}-600 rounded-full`}></div>
                    </div>
                    <span className="text-gray-700">{advantage}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Étapes */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Comment Investir</h2>
              <div className="space-y-6">
                {investment.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 bg-${investment.color}-600 text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Caractéristiques</h3>
              <div className="space-y-4">
                <StatCard
                  label="Rendement attendu"
                  value={investment.expectedReturn}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <StatCard
                  label="Investissement minimum"
                  value={investment.minInvestment}
                  icon={<Shield className="w-5 h-5" />}
                />
                <StatCard
                  label="Liquidité"
                  value={investment.liquidity}
                  icon={<Users className="w-5 h-5" />}
                />
                <StatCard
                  label="Durée recommandée"
                  value={investment.duration}
                  icon={<Calendar className="w-5 h-5" />}
                />
              </div>
            </div>

            {/* CTA */}
            <div className={`bg-gradient-to-br ${investment.gradient} rounded-2xl shadow-lg p-8 text-white`}>
              <h3 className="text-2xl font-bold mb-4">Prêt à investir ?</h3>
              <p className="mb-6 opacity-90">
                Commencez votre projet d'investissement avec notre accompagnement personnalisé.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contacter un conseiller
                </button>
                <button 
                  onClick={handleViewDocumentation}
                  className="w-full border border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Documentation complète
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de contact */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
        investmentType={investment.title}
      />

      {/* Modal de documentation */}
      {showDocumentationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Documentation - {investment.title}</h3>
              <button onClick={() => setShowDocumentationModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="prose max-w-none">
              <h4>Résumé du produit</h4>
              <p>{investment.longDescription}</p>
              
              <h4>Caractéristiques détaillées</h4>
              <ul>
                <li><strong>Rendement attendu :</strong> {investment.expectedReturn}</li>
                <li><strong>Investissement minimum :</strong> {investment.minInvestment}</li>
                <li><strong>Niveau de risque :</strong> {investment.riskLevel}</li>
                <li><strong>Liquidité :</strong> {investment.liquidity}</li>
                <li><strong>Durée recommandée :</strong> {investment.duration}</li>
              </ul>
              
              <h4>Avantages</h4>
              <ul>
                {investment.advantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
              </ul>
              
              <h4>Processus d'investissement</h4>
              <ol>
                {investment.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
            
            <div className="grid lg:flex gap-4 mt-6">
              <button
                onClick={handleDownloadDocumentation}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger PDF
              </button>
              <button
                onClick={() => setShowDocumentationModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestissementDetail;