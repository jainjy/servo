// app/estimation-immobilier/page.tsx
'use client';

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

export interface EstimationData {
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial';
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates?: { lat: number; lng: number };
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
  priceRange: {
    min: number;
    max: number;
    median: number;
  };
  pricePerSquareMeter: number;
  confidence: number;
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
  { value: 'commercial', label: 'Local Commercial', icon: Store }
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
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);
  const { isLoading, withLoading } = useLoading();

  const handleEstimationSubmit = async (data: EstimationData) => {
    setEstimationData(data);
    
    await withLoading(
      new Promise<EstimationResult>((resolve) => {
        // Simulation d'appel API
        setTimeout(() => {
          const result = generateEstimationResult(data);
          resolve(result);
        }, 2000);
      })
    ).then((result) => {
      setEstimationResult(result);
      setCurrentStep('results');
    });
  };

  const generateEstimationResult = (data: EstimationData): EstimationResult => {
    // Logique d'estimation simplifiée - À remplacer par un vrai algorithme
    const basePricePerM2 = getBasePricePerM2(data.location.city);
    let price = data.surface * basePricePerM2;
    
    // Ajustements
    price *= getConditionMultiplier(data.condition);
    price *= getRoomsMultiplier(data.rooms);
    price += getFeaturesValue(data.features);
    
    const variance = price * 0.1; // ±10%
    
    return {
      priceRange: {
        min: Math.round(price - variance),
        max: Math.round(price + variance),
        median: Math.round(price)
      },
      pricePerSquareMeter: Math.round(price / data.surface),
      confidence: 85,
      comparableProperties: generateComparableProperties(data),
      marketTrends: {
        trend: 'up',
        percentage: 3.2,
        description: 'Marché en légère hausse dans votre secteur'
      },
      recommendations: generateRecommendations(data)
    };
  };

  return (
    <PageLoader isLoading={isLoading}>
       
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 pt-20">
        
        <div className="container mx-auto px-4 max-w-6xl">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Estimation Immobilière <span className="text-purple-600">Gratuite</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Obtenez une estimation précise de votre bien en 2 minutes grâce à notre intelligence artificielle
            </p>
          </motion.div>

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
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white"
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
                      Précision
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">120+</div>
                    <div className="text-sm opacity-90 flex items-center justify-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Villes couvertes
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm opacity-90 flex items-center justify-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Disponible
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Professionnels */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200"
              >
                <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Vous êtes professionnel ?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Accédez à nos outils d'estimation avancés et à notre réseau d'acheteurs.
                </p>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Espace Pro
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageLoader>
  );
}

// Fonctions helpers pour l'estimation
function getBasePricePerM2(city: string): number {
  const prices: { [key: string]: number } = {
    'paris': 10000,
    'lyon': 5000,
    'marseille': 4000,
    'bordeaux': 4500,
    'toulouse': 3500,
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

function generateComparableProperties(data: EstimationData) {
  return Array.from({ length: 3 }, (_, i) => ({
    id: `comp-${i}`,
    price: Math.round((data.surface * getBasePricePerM2(data.location.city)) * (0.9 + Math.random() * 0.2)),
    surface: data.surface + Math.round((Math.random() - 0.5) * 20),
    address: `${data.location.address.split(' ')[0]} ...`,
    distance: Math.round(Math.random() * 500),
    similarity: Math.round(80 + Math.random() * 15)
  }));
}

function generateRecommendations(data: EstimationData): string[] {
  const recommendations = [];
  
  if (data.condition === 'needs_renovation') {
    recommendations.push('Une rénovation pourrait augmenter la valeur de 15-20%');
  }
  
  if (!data.features.parking && data.location.city.toLowerCase() === 'paris') {
    recommendations.push('Ajouter une place de parking pourrait augmenter la valeur');
  }
  
  if (data.surface < 30) {
    recommendations.push('Mettre en valeur les espaces de rangement');
  }
  
  recommendations.push('Mettre à jour les photos pour une meilleure présentation');
  recommendations.push('Considérer une expertise complémentaire pour confirmation');
  
  return recommendations;
}