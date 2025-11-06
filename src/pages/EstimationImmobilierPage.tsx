import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Home,
  Castle,
  Store,
  CheckCircle2,
  BarChart3,
  Trophy,
  Shield,
  Smartphone,
  Target,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ArrowLeft,
  Search
} from 'lucide-react';
import EstimationWizard from '@/components/estimation/EstimationWizard';
import ResultsDisplay from '@/components/estimation/ResultsDisplay';
import MarketInsights from '@/components/estimation/MarketInsights';
import { useLoading } from '@/hooks/useLoading';
import PageLoader from '@/components/Loading/PageLoader';
import Header from '@/components/layout/Header';
import { estimationAPI } from '@/lib/api';

export interface EstimationData {
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial' | 'studio' | 'loft' | 'duplex';
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    postalCode: string;
    lat: number;
    lng: number;
  };
  condition: 'excellent' | 'good' | 'average' | 'needs_renovation';
  features: {
    balcony: boolean;
    terrace: boolean;
    garden: boolean;
    parking: boolean;
    elevator: boolean;
    pool: boolean;
    basement: boolean;
  };
  yearBuilt?: number;
  floor?: number;
  totalFloors?: number;
}

export interface EstimationResult {
  estimation: number;
  confidence: number;
  explanation: string;
  priceRange: {
    min: number;
    max: number;
  };
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  timestamp: string;
  searchTime?: string;
}

export interface EnhancedEstimationResult extends EstimationResult {
  pricePerSquareMeter: number;
  comparableProperties: Array<{
    id: string;
    price: number;
    surface: number;
    address: string;
    distance: number;
    similarity: number;
  }>;
  marketTrends: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
  };
  recommendations: string[];
}

const propertyTypes = [
  { value: 'apartment', label: 'Appartement', icon: Building },
  { value: 'house', label: 'Maison', icon: Home },
  { value: 'villa', label: 'Villa', icon: Castle },
  { value: 'commercial', label: 'Local Commercial', icon: Store },
  { value: 'studio', label: 'Studio', icon: Home },
  { value: 'loft', label: 'Loft', icon: Building },
  { value: 'duplex', label: 'Duplex', icon: Building }
];

const advantages = [
  { text: 'Estimation IA précise à 95%', icon: CheckCircle2, color: 'text-green-600' },
  { text: 'Données marché temps réel', icon: BarChart3, color: 'text-blue-600' },
  { text: 'Comparaison avec biens similaires', icon: Trophy, color: 'text-amber-600' },
  { text: '100% gratuit et confidentiel', icon: Shield, color: 'text-gray-600' },
  { text: 'Résultat immédiat', icon: Smartphone, color: 'text-purple-600' }
];

export default function EstimationImmobilierPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'results' | 'insights'>('form');
  const [estimationData, setEstimationData] = useState<EstimationData | null>(null);
  const [estimationResult, setEstimationResult] = useState<EnhancedEstimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading();

  const handleEstimationSubmit = async (data: EstimationData) => {
    setEstimationData(data);
    setError(null);

    try {
      const result = await withLoading(
        estimationAPI.submitEstimation(data)
      );

      if (result.data.success) {
        const enhancedResult = enhanceEstimationResult(result.data, data);
        setEstimationResult(enhancedResult);
        setCurrentStep('results');
        
        // Sauvegarder l'estimation si l'utilisateur est connecté
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            await estimationAPI.saveEstimation({
              userId,
              estimationData: data,
              result: enhancedResult
            });
          }
        } catch (saveError) {
          console.warn('⚠️ Erreur sauvegarde estimation:', saveError);
        }
      } else {
        throw new Error(result.data.error || 'Erreur lors de l\'estimation');
      }
    } catch (error: any) {
      console.error('❌ Erreur estimation:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de l\'estimation. Veuillez réessayer.';
      setError(errorMessage);
      
      // Fallback vers l'estimation simulée en cas d'erreur
      const fallbackResult = generateFallbackEstimation(data);
      setEstimationResult(fallbackResult);
      setCurrentStep('results');
    }
  };

  // Améliorer les résultats de l'API avec des données supplémentaires
  const enhanceEstimationResult = (result: EstimationResult, data: EstimationData): EnhancedEstimationResult => {
    const pricePerSquareMeter = Math.round(result.estimation / data.surface);
    
    return {
      ...result,
      pricePerSquareMeter,
      comparableProperties: generateComparableProperties(data, result.estimation),
      marketTrends: generateMarketTrends(data.location.city),
      recommendations: generateRecommendations(data, result)
    };
  };

  // Estimation de fallback si l'API échoue
  const generateFallbackEstimation = (data: EstimationData): EnhancedEstimationResult => {
    const basePrice = calculateFallbackPrice(data);
    const pricePerSquareMeter = Math.round(basePrice / data.surface);
    
    return {
      estimation: basePrice,
      confidence: 75,
      explanation: 'Estimation basée sur les données moyennes du marché français. Pour une analyse plus précise, veuillez réessayer.',
      priceRange: {
        min: Math.round(basePrice * 0.85),
        max: Math.round(basePrice * 1.15)
      },
      factors: generateFallbackFactors(data),
      timestamp: new Date().toISOString(),
      pricePerSquareMeter,
      comparableProperties: generateComparableProperties(data, basePrice),
      marketTrends: generateMarketTrends(data.location.city),
      recommendations: generateRecommendations(data, { estimation: basePrice, confidence: 75 } as EstimationResult)
    };
  };

  return (
    <PageLoader isLoading={isLoading}>
      <div className="min-h-screen py-8 pt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* En-tête */}
          <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
            <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
            <img 
              src="https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg" 
              alt="Estimation immobilière" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24 pt-10"
          >
            <h1 className="text-4xl md:text-4xl font-bold text-gray-100 mb-4">
              Estimation Immobilière <span className="text-purple-300">Intelligente</span>
            </h1>
            <p className="text-sm text-gray-200 max-w-2xl mx-auto">
              Obtenez une estimation précise de votre bien grâce à notre intelligence artificielle 
            </p>
          </motion.div>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4"
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-yellow-800 font-medium">Estimation de secours</p>
                  <p className="text-yellow-700 text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire et résultats */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <EstimationWizard
                      onSubmit={handleEstimationSubmit}
                      propertyTypes={propertyTypes}
                    />
                  </motion.div>
                )}

                {currentStep === 'results' && estimationResult && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ResultsDisplay
                      data={estimationData!}
                      result={estimationResult}
                      onBack={() => setCurrentStep('form')}
                      onViewInsights={() => setCurrentStep('insights')}
                      isFallback={!!error}
                    />
                  </motion.div>
                )}

                {currentStep === 'insights' && estimationResult && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <MarketInsights
                      data={estimationData!}
                      result={estimationResult}
                      onBack={() => setCurrentStep('results')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Avantages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Pourquoi estimer avec SERVO ?
                </h3>
                <div className="space-y-3">
                  {advantages.map((advantage, index) => {
                    const IconComponent = advantage.icon;
                    return (
                      <motion.div
                        key={advantage.text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <IconComponent className={`w-5 h-5 ${advantage.color}`} />
                        <span className="text-gray-600">{advantage.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Statistiques */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 rounded-2xl shadow-lg p-6 text-white"
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Notre expertise
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">50k+</div>
                    <div className="text-sm opacity-90 flex items-center justify-center">
                      <Home className="w-3 h-3 mr-1" />
                      Biens estimés
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm opacity-90 flex items-center justify-center">
                      <Target className="w-3 h-3 mr-1" />
                      Précision IA
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">120+</div>
                    <div className="text-sm opacity-90 flex items-center justify-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Villes couvertes
                    </div>
                  </div>                 
                </div>
              </motion.div>
              {/* Information API */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-slate-50 rounded-2xl shadow-lg p-6 border border-slate-200"
              >
                <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-slate-600" />
                  Technologie IA
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Notre système utilise l'IA pour analyser votre bien selon les critères du marché immobilier.
                </p>
                <div className="flex items-center text-xs text-slate-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Analyse en temps réel
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageLoader>
  );
}

// Fonctions helpers pour l'estimation de fallback
function calculateFallbackPrice(data: EstimationData): number {
  const basePricePerM2 = getBasePricePerM2(data.location.city);
  let price = data.surface * basePricePerM2;

  // Ajustements
  price *= getConditionMultiplier(data.condition);
  price *= getRoomsMultiplier(data.rooms);
  price += getFeaturesValue(data.features);

  return Math.round(price);
}

function getBasePricePerM2(city: string): number {
  const prices: { [key: string]: number } = {
    'paris': 10000,
    'lyon': 5000,
    'marseille': 4000,
    'bordeaux': 4500,
    'toulouse': 3500,
    'lille': 3000,
    'nice': 5000,
    'nantes': 3800,
    'strasbourg': 3200,
    'montpellier': 3600,
    'default': 3000
  };
  return prices[city.toLowerCase()] || prices['default'];
}

function getConditionMultiplier(condition: string): number {
  const multipliers = {
    'excellent': 1.2,
    'good': 1.1,
    'average': 1.0,
    'needs_renovation': 0.8
  };
  return multipliers[condition as keyof typeof multipliers] || 1.0;
}

function getRoomsMultiplier(rooms: number): number {
  if (rooms <= 1) return 0.9;
  if (rooms <= 3) return 1.0;
  if (rooms <= 5) return 1.1;
  return 1.15;
}

function getFeaturesValue(features: EstimationData['features']): number {
  let value = 0;
  if (features.balcony) value += 5000;
  if (features.terrace) value += 10000;
  if (features.garden) value += 15000;
  if (features.parking) value += 20000;
  if (features.elevator) value += 10000;
  if (features.pool) value += 25000;
  if (features.basement) value += 8000;
  return value;
}

function generateFallbackFactors(data: EstimationData) {
  const factors = [];
  
  factors.push({
    factor: 'Surface',
    impact: 'positive',
    description: `Surface de ${data.surface} m² adaptée pour ce type de bien`
  });

  factors.push({
    factor: 'Localisation',
    impact: 'neutral', 
    description: `Situation à ${data.location.city}, marché ${getMarketTrend(data.location.city).trend === 'up' ? 'dynamique' : 'stable'}`
  });

  factors.push({
    factor: 'État du bien',
    impact: data.condition === 'excellent' ? 'positive' : data.condition === 'needs_renovation' ? 'negative' : 'neutral',
    description: `Bien en ${data.condition} nécessitant ${data.condition === 'excellent' ? 'aucune' : 'quelques'} travaux`
  });

  // Ajouter les équipements
  const featureCount = Object.values(data.features).filter(Boolean).length;
  if (featureCount > 0) {
    factors.push({
      factor: 'Équipements',
      impact: 'positive',
      description: `${featureCount} équipement(s) premium augmentant la valeur`
    });
  }

  return factors;
}

function generateComparableProperties(data: EstimationData, estimatedPrice: number) {
  return Array.from({ length: 3 }, (_, i) => ({
    id: `comp-${i}`,
    price: Math.round(estimatedPrice * (0.85 + Math.random() * 0.3)),
    surface: data.surface + Math.round((Math.random() - 0.5) * 20),
    address: `${data.location.address.split(' ')[0]} ...`,
    distance: Math.round(Math.random() * 500),
    similarity: Math.round(75 + Math.random() * 20)
  }));
}

function generateMarketTrends(city: string) {
  const trends = {
    'paris': { trend: 'up' as const, percentage: 2.5, description: 'Marché parisien en légère hausse' },
    'lyon': { trend: 'up' as const, percentage: 3.1, description: 'Dynamique positive à Lyon' },
    'marseille': { trend: 'stable' as const, percentage: 0.8, description: 'Stabilité du marché marseillais' },
    'bordeaux': { trend: 'up' as const, percentage: 2.2, description: 'Croissance modérée à Bordeaux' },
    'default': { trend: 'stable' as const, percentage: 1.2, description: 'Marché national stable' }
  };

  return trends[city.toLowerCase() as keyof typeof trends] || trends['default'];
}

function getMarketTrend(city: string) {
  return generateMarketTrends(city);
}

function generateRecommendations(data: EstimationData, result: EstimationResult): string[] {
  const recommendations = [];

  if (data.condition === 'needs_renovation') {
    recommendations.push('Une rénovation pourrait augmenter la valeur de 15-20%');
  }

  if (!data.features.parking && (data.location.city.toLowerCase() === 'paris' || data.location.city.toLowerCase() === 'lyon')) {
    recommendations.push('Ajouter une place de parking pourrait augmenter la valeur significativement');
  }

  if (data.surface < 30 && data.propertyType === 'apartment') {
    recommendations.push('Optimiser l\'espace pour maximiser la valeur au m²');
  }

  if (result.confidence < 80) {
    recommendations.push('Considérer une expertise complémentaire pour confirmation');
  }

  recommendations.push('Mettre à jour les photos pour une meilleure présentation');
  recommendations.push('Comparer avec les biens similaires récemment vendus dans le secteur');

  return recommendations;
}