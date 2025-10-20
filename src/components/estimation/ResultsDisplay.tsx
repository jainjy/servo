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
  ArrowLeft
} from 'lucide-react';
import { EstimationData, EstimationResult } from '@/pages/EstimationImmobilierPage';

interface ResultsDisplayProps {
  data: EstimationData;
  result: EstimationResult;
  onBack: () => void;
  onViewInsights: () => void;
}

export default function ResultsDisplay({ data, result, onBack, onViewInsights }: ResultsDisplayProps) {
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
        return <TrendingUp className="w-4 h-4 ml-1" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 ml-1 transform rotate-180" />;
      default:
        return <BarChart3 className="w-4 h-4 ml-1" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* En-tête résultat */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Euro className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Estimation de votre bien
        </h2>
        <p className="text-gray-600">
          Basée sur l'analyse de {result.comparableProperties.length} biens similaires
        </p>
      </div>

      {/* Prix estimé */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center mb-8">
        <div className="text-sm opacity-90 mb-2">Valeur estimée</div>
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {formatPrice(result.priceRange.median)}
        </div>
        <div className="text-lg opacity-90">
          Fourchette : {formatPrice(result.priceRange.min)} - {formatPrice(result.priceRange.max)}
        </div>
        <div className="text-sm mt-2 opacity-80 flex items-center justify-center">
          <Euro className="w-4 h-4 mr-1" />
          Soit {formatPrice(result.pricePerSquareMeter)} / m²
        </div>
      </div>

      {/* Indicateur de confiance */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-600" />
            Fiabilité de l'estimation
          </span>
          <span className="text-sm font-bold text-blue-600">{result.confidence}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Biens comparables */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-gray-700" />
          Biens similaires vendus récemment
        </h3>
        <div className="space-y-3">
          {result.comparableProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900 flex items-center">
                  <Euro className="w-4 h-4 mr-1 text-green-600" />
                  {formatPrice(property.price)}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <span className="flex items-center mr-3">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {property.surface}m²
                  </span>
                  <span className="flex items-center mr-3">
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

      {/* Tendances du marché */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
        <div className="flex items-center mb-2">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
          <span className="font-semibold text-orange-800">Tendance du marché</span>
        </div>
        <p className="text-orange-700 text-sm flex items-center">
          {result.marketTrends.description} ({result.marketTrends.percentage}% 
          {getTrendIcon(result.marketTrends.trend)})
        </p>
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

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-xs text-gray-600 text-center flex items-center justify-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
          Cette estimation est fournie à titre indicatif. 
          Elle ne constitue pas une expertise immobilière et ne remplace pas 
          l'avis d'un professionnel certifié.
        </p>
      </div>
    </div>
  );
}