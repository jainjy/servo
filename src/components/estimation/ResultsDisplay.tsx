// components/estimation/ResultsDisplay.tsx
import { motion } from 'framer-motion';
import { 
  Euro, 
  Target, 
  TrendingUp, 
  Search,
  Home,
  MapPin,
  BarChart3,
  Lightbulb,
  ArrowLeft,
  TrendingDown,
  Minus,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { EstimationData, EnhancedEstimationResult }  from '../../pages/EstimationImmobilierPage';

interface ResultsDisplayProps {
  data: EstimationData;
  result: EnhancedEstimationResult;
  onBack: () => void;
  onViewInsights: () => void;
  isFallback?: boolean;
}

export default function ResultsDisplay({ 
  data, 
  result, 
  onBack, 
  onViewInsights,
  isFallback = false 
}: ResultsDisplayProps) {
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* En-tête résultat */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isFallback ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        >
          {isFallback ? (
            <AlertTriangle className="w-8 h-8 text-white" />
          ) : (
            <Euro className="w-8 h-8 text-white" />
          )}
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isFallback ? 'Estimation indicative' : 'Estimation de votre bien'}
        </h2>
        <p className="text-gray-600">
          {isFallback 
            ? 'Basée sur les données moyennes du marché'
            : `Analysé par notre IA Gemini • ${result.comparableProperties?.length || 0} références`
          }
        </p>
        
        {isFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 inline-block"
          >
            <p className="text-yellow-800 text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Estimation de secours - L'analyse IA n'est pas disponible
            </p>
          </motion.div>
        )}
      </div>

      {/* Prix estimé */}
      <div className={`rounded-2xl p-6 text-white text-center mb-8 ${
        isFallback 
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
          : 'bg-gradient-to-r from-purple-500 to-pink-500'
      }`}>
        <div className="text-sm opacity-90 mb-2">Valeur estimée</div>
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {formatPrice(result.estimation)}
        </div>
        <div className="text-lg opacity-90 mb-3">
          Fourchette : {formatPrice(result.priceRange.min)} - {formatPrice(result.priceRange.max)}
        </div>
        <div className="text-sm opacity-80 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 mr-1" />
          Soit {formatPrice(result.pricePerSquareMeter)} / m²
        </div>
      </div>

      {/* Indicateur de confiance */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-600" />
            Fiabilité de l'estimation
          </span>
          <span className={`text-sm font-bold ${getConfidenceColor(result.confidence)}`}>
            {result.confidence}%
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getConfidenceBarColor(result.confidence)}`}
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-2 flex justify-between">
          <span>Faible</span>
          <span>Moyenne</span>
          <span>Élevée</span>
        </div>
      </div>

      {/* Facteurs clés (si disponibles) */}
      {result.factors && result.factors.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            Facteurs clés identifiés par l'IA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.factors.slice(0, 4).map((factor, index) => (
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{factor.factor}</span>
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
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Biens comparables */}
      {result.comparableProperties && result.comparableProperties.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-gray-700" />
            Références du marché ({result.comparableProperties.length})
          </h3>
          <div className="space-y-3">
            {result.comparableProperties.slice(0, 3).map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center">
                    <Euro className="w-4 h-4 mr-1 text-green-600" />
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {property.surface}m²
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.distance}m
                    </span>
                    <span className="flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      {property.similarity}% similaire
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tendances du marché */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
            <span className="font-semibold text-orange-800">Tendance du marché local</span>
          </div>
          <span className={`font-semibold flex items-center ${getTrendColor(result.marketTrends.trend)}`}>
            {result.marketTrends.percentage}%
            {getTrendIcon(result.marketTrends.trend)}
          </span>
        </div>
        <p className="text-orange-700 text-sm">{result.marketTrends.description}</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nouvelle estimation
        </button>
        <button
          onClick={onViewInsights}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <Search className="w-4 h-4 mr-2" />
          Analyses détaillées
        </button>
      </div>

      {/* Informations techniques */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900">{data.surface} m²</div>
          <div className="text-gray-600">Surface</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900">{data.rooms} pièces</div>
          <div className="text-gray-600">Configuration</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center flex items-center justify-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
          {isFallback 
            ? 'Cette estimation indicative est basée sur des données moyennes. Consultez un expert pour une évaluation précise.'
            : 'Cette estimation IA est fournie à titre indicatif. Elle ne remplace pas l\'avis d\'un professionnel certifié.'
          }
        </p>
        {!isFallback && (
          <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Analyse réalisée avec Google Gemini AI
          </p>
        )}
      </div>
    </div>
  );
}