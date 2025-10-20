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
  PenTool
} from 'lucide-react';
import { EstimationData, EstimationResult } from '@/pages/EstimationImmobilierPage';

interface MarketInsightsProps {
  data: EstimationData;
  result: EstimationResult;
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
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analyses de marché détaillées</h2>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommandations */}
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-purple-600" />
            Recommandations personnalisées
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
                <span className="text-purple-500 mr-2">•</span>
                <span className="text-purple-800 text-sm">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Détails techniques */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Détails techniques
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Prix médian au m² dans le secteur:</span>
              <span className="font-semibold text-blue-900">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0
                }).format(result.pricePerSquareMeter)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Demande moyenne:</span>
              <span className="font-semibold text-blue-900">Élevée</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Temps de vente moyen:</span>
              <span className="font-semibold text-blue-900">45 jours</span>
            </div>
          </div>
        </div>

        {/* Potentiel d'optimisation */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-semibold text-green-900 mb-4 flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-green-600" />
            Potentiel d'optimisation
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Rénovation énergétique</span>
                <span className="font-semibold text-green-900">+8-12%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700">Mise aux normes</span>
                <span className="font-semibold text-green-900">+5-8%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact professionnel */}
        <div className="bg-orange-50 rounded-xl p-6">
          <h3 className="font-semibold text-orange-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" />
            Contactez un expert
          </h3>
          <p className="text-orange-800 text-sm mb-4">
            Pour une estimation précise et personnalisée, consultez un de nos experts partenaires.
          </p>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
            <Users className="w-4 h-4 mr-2" />
            Être contacté par un expert
          </button>
        </div>
      </div>

      {/* Timeline de vente */}
      <div className="mt-6 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Timeline de vente estimée</h3>
        <div className="flex justify-between items-center">
          {timelineSteps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-white rounded-full border-2 border-purple-500 flex items-center justify-center text-sm mb-2">
                  <IconComponent className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-xs font-medium text-gray-900">{item.step}</div>
                <div className="text-xs text-gray-600">{item.duration}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}