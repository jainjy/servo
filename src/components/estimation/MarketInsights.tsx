// components/estimation/MarketInsights.tsx
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Lightbulb, 
  BarChart3, 
  Rocket, 
  Users, 
  ClipboardList,
  Monitor,
  Eye,
  FileText,
  PenTool,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { EstimationData, EnhancedEstimationResult } from '../../pages/EstimationImmobilierPage';

interface MarketInsightsProps {
  data: EstimationData;
  result: EnhancedEstimationResult;
  onBack: () => void;
}

const timelineSteps = [
  { step: 'Préparation', duration: '7-10 jours', icon: ClipboardList },
  { step: 'Mise en ligne', duration: '1 jour', icon: Monitor },
  { step: 'Visites', duration: '15-30 jours', icon: Eye },
  { step: 'Compromis', duration: '7 jours', icon: FileText },
  { step: 'Signature', duration: '30-45 jours', icon: PenTool }
];

export default function MarketInsights({ data, result, onBack }: MarketInsightsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analyses de marché détaillées</h2>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux résultats
        </button>
      </div>

      {/* Facteurs d'influence de l'IA */}
      {result.factors && result.factors.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
            Analyse IA des facteurs d'influence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.factors.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  factor.impact === 'positive' 
                    ? 'bg-green-50 border-green-200' 
                    : factor.impact === 'negative'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${
                    factor.impact === 'positive' 
                      ? 'text-green-800' 
                      : factor.impact === 'negative'
                      ? 'text-red-800'
                      : 'text-gray-800'
                  }`}>
                    {factor.factor}
                  </span>
                  <span className={`text-sm ${
                    factor.impact === 'positive' 
                      ? 'text-green-600' 
                      : factor.impact === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {factor.impact === 'positive' ? '↗' : 
                     factor.impact === 'negative' ? '↘' : '→'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommandations */}
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-purple-600" />
            Recommandations stratégiques
          </h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <span className="text-purple-500 mr-2 mt-1">•</span>
                <span className="text-purple-800 text-sm">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Détails techniques */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Analyse technique
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Prix au m² estimé:</span>
              <span className="font-semibold text-blue-900">
                {formatPrice(result.pricePerSquareMeter)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Fourchette de prix:</span>
              <span className="font-semibold text-blue-900">
                {formatPrice(result.priceRange.min)} - {formatPrice(result.priceRange.max)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Niveau de confiance:</span>
              <span className="font-semibold text-blue-900">{result.confidence}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Tendance du marché:</span>
              <span className={`font-semibold flex items-center ${getTrendColor(result.marketTrends.trend)}`}>
                {result.marketTrends.percentage}%
                {getTrendIcon(result.marketTrends.trend)}
              </span>
            </div>
          </div>
        </div>

        {/* Potentiel d'optimisation */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-4 flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-green-600" />
            Potentiel de valorisation
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Rénovation énergétique</span>
                <span className="font-semibold text-green-900">+8-12%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <motion.div 
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Amélioration esthétique</span>
                <span className="font-semibold text-green-900">+5-8%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <motion.div 
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Optimisation espace</span>
                <span className="font-semibold text-green-900">+3-6%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <motion.div 
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact professionnel */}
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <h3 className="font-semibold text-orange-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            Expertise complémentaire
          </h3>
          <p className="text-orange-800 text-sm mb-4">
            Pour une estimation certifiée et un accompagnement personnalisé, 
            consultez un de nos experts partenaires agréés.
          </p>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
            <Users className="w-4 h-4 mr-2" />
            Être contacté par un expert
          </button>
        </div>
      </div>

      {/* Biens comparables */}
      {result.comparableProperties && result.comparableProperties.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-700" />
            Références de biens similaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.comparableProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg border border-gray-300"
              >
                <div className="text-lg font-bold text-green-600 mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Surface:</span>
                    <span className="font-medium">{property.surface} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">{property.distance} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Similarité:</span>
                    <span className="font-medium">{property.similarity}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline de vente */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-6 text-center">
          Processus de vente estimé
        </h3>
        <div className="flex flex-col md:flex-row justify-between items-center relative">
          {/* Ligne de connexion */}
          <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-purple-300 z-0"></div>
          
          {timelineSteps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center relative z-10 mb-4 md:mb-0"
              >
                <div className="w-12 h-12 bg-white rounded-full border-2 border-purple-500 flex items-center justify-center shadow-lg mb-3">
                  <IconComponent className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{item.step}</div>
                <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full border">
                  {item.duration}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Explication détaillée de l'IA */}
      {result.explanation && (
        <div className="mt-6 bg-indigo-50 rounded-xl p-6 border border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-indigo-600" />
            Analyse détaillée par notre IA
          </h3>
          <p className="text-indigo-800 leading-relaxed">
            {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
}