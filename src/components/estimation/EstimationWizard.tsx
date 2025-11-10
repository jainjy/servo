// components/estimation/EstimationWizard.tsx
import { useState, useRef,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Home,
  Building,
  Ruler,
  DoorOpen,
  Bed,
  Bath,
  MapPin,
  Search,
  Wrench,
  Car,
  TreePine,
  Warehouse,
  Waves,
  Building2,
  ArrowUpDown,
  X,
  Loader2,
  Navigation,
  TrendingUp,
  AlertCircle,
  Euro,
  Sparkles,
  Globe,
  Landmark,
  Mountain,
  Palette,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Target,
  Download,
  FileText,
  Calculator
} from 'lucide-react';
import { estimationAPI } from '@/lib/api';

// Types
interface EstimationData {
  propertyType: string;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  condition: string;
  location: {
    address: string;
    city: string;
    postalCode: string;
    lat: number;
    lng: number;
  };
  features: {
    balcony: boolean;
    terrace: boolean;
    garden: boolean;
    parking: boolean;
    elevator: boolean;
    pool: boolean;
    basement: boolean;
  };
}

interface EstimationResult {
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
  pricePerSquareMeter?: number;
  comparableProperties?: Array<{
    id: string;
    price: number;
    surface: number;
    address: string;
    distance: number;
    similarity: number;
  }>;
  marketTrends?: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
  };
  recommendations?: string[];
  usedAI?: boolean;
  isFallback?: boolean;
}

interface EstimationWizardProps {
  onSubmit?: (data: EstimationData) => void;
  propertyTypes: Array<{ value: string; label: string; icon: any }>;
  onEstimationComplete?: (result: EstimationResult) => void;
}

// Configurations
const conditions = [
  { value: 'excellent', label: 'Excellent état', description: 'Neuf ou rénové récemment', color: 'bg-green-100 border-green-500 text-green-800' },
  { value: 'good', label: 'Bon état', description: 'Bien entretenu, quelques retouches', color: 'bg-blue-100 border-blue-500 text-blue-800' },
  { value: 'average', label: 'État moyen', description: 'Habitable mais besoin de travaux', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
  { value: 'needs_renovation', label: 'À rénover', description: 'Travaux importants nécessaires', color: 'bg-orange-100 border-orange-500 text-orange-800' }
];

const featuresConfig = [
  { key: 'balcony', label: 'Balcon', icon: Building2, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'terrace', label: 'Terrasse', icon: Home, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'garden', label: 'Jardin', icon: TreePine, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'parking', label: 'Parking', icon: Car, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'elevator', label: 'Ascenseur', icon: ArrowUpDown, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'pool', label: 'Piscine', icon: Waves, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'basement', label: 'Cave', icon: Warehouse, color: 'bg-blue-100 text-blue-800 border-blue-200' }
];

// Fonction pour générer le PDF
const generatePDF = (result: EstimationResult, data: any, propertyTypes: any, conditions: any) => {
  // Créer un élément HTML pour le PDF
  const pdfContent = document.createElement('div');
  pdfContent.style.padding = '20px';
  pdfContent.style.fontFamily = 'Arial, sans-serif';
  pdfContent.style.color = '#1f2937';
  
  // Header du PDF
  pdfContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
      <h1 style="color: #1f2937; margin: 0; font-size: 24px;">Estimation Immobilière</h1>
      <p style="color: #6b7280; margin: 5px 0 0 0;">Rapport d'estimation généré le ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
    
    <div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #93c5fd;">
      <div style="text-align: center;">
        <div style="font-size: 14px; color: #374151; margin-bottom: 5px;">Valeur estimée</div>
        <div style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.estimation)}</div>
        <div style="font-size: 16px; color: #374151;">
          Fourchette : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.priceRange.min)} - ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.priceRange.max)}
        </div>
        ${result.pricePerSquareMeter ? `
          <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">
            Soit ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.pricePerSquareMeter)} / m²
          </div>
        ` : ''}
      </div>
    </div>
    
    <div style="margin-bottom: 25px;">
      <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Caractéristiques du bien</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div>
          <strong>Type de bien:</strong> ${propertyTypes.find((t: any) => t.value === data.propertyType)?.label || data.propertyType}
        </div>
        <div>
          <strong>Surface:</strong> ${data.surface} m²
        </div>
        <div>
          <strong>Pièces:</strong> ${data.rooms}
        </div>
        <div>
          <strong>Chambres:</strong> ${data.bedrooms}
        </div>
        <div>
          <strong>Salles de bain:</strong> ${data.bathrooms}
        </div>
        <div>
          <strong>État:</strong> ${conditions.find((c: any) => c.value === data.condition)?.label || data.condition}
        </div>
      </div>
    </div>
    
    ${data.location ? `
      <div style="margin-bottom: 25px;">
        <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Localisation</h2>
        <div style="color: #374151;">
          <div><strong>Adresse:</strong> ${data.location.address}</div>
          <div><strong>Ville:</strong> ${data.location.city} ${data.location.postalCode}</div>
          <div><strong>Pays:</strong> ${data.location.country}</div>
        </div>
      </div>
    ` : ''}
    
    <div style="margin-bottom: 25px;">
      <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Analyse détaillée</h2>
      <div style="color: #374151; line-height: 1.6;">
        ${result.explanation}
      </div>
    </div>
    
    ${result.factors && result.factors.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Facteurs influençant le prix</h2>
        <div style="display: grid; gap: 12px;">
          ${result.factors.map((factor: any) => `
            <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; background: #f9fafb;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; 
                  ${factor.impact === 'positive' ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' : 
                    factor.impact === 'negative' ? 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;' : 
                    'background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;'}">
                  ${factor.impact === 'positive' ? '↑' : factor.impact === 'negative' ? '↓' : '→'} ${factor.factor}
                </span>
              </div>
              <div style="color: #6b7280; font-size: 14px;">
                ${factor.description}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
      <div style="text-align: center;">
        <p><strong>Informations techniques</strong></p>
        <p>Niveau de confiance: ${result.confidence}% • ${result.usedAI ? 'Analyse IA' : 'Estimation standard'} • ${result.isFallback ? 'Mode de secours' : 'Mode standard'}</p>
        <p>Ce rapport est fourni à titre informatif et ne constitue pas une expertise immobilière certifiée.</p>
      </div>
    </div>
  `;

  // Ouvrir une nouvelle fenêtre pour l'impression
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Estimation Immobilière - ${new Date().toLocaleDateString('fr-FR')}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { margin: 20mm; }
            }
            body {
              font-family: Arial, sans-serif;
              color: #1f2937;
              margin: 0;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${pdfContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

// Fonction utilitaire pour formater les coordonnées
function formatCoordinates(lat: any, lng: any): string {
  const latNum = typeof lat === 'number' ? lat : parseFloat(lat);
  const lngNum = typeof lng === 'number' ? lng : parseFloat(lng);
  
  if (isNaN(latNum) || isNaN(lngNum)) {
    return 'Coordonnées non disponibles';
  }
  
  return `${latNum.toFixed(2)}°, ${lngNum.toFixed(2)}°`;
}

// Base de données mondiale
function getAllCountries() {
  return [
    // Afrique
    { code: 'MG', name: 'Madagascar', nameFr: 'Madagascar', icon: Globe, lat: -18.8792, lng: 47.5079 },
    { code: 'MA', name: 'Morocco', nameFr: 'Maroc', icon: Globe, lat: 31.7917, lng: -7.0926 },
    { code: 'TN', name: 'Tunisia', nameFr: 'Tunisie', icon: Globe, lat: 33.8869, lng: 9.5375 },
    { code: 'SN', name: 'Senegal', nameFr: 'Sénégal', icon: Globe, lat: 14.4974, lng: -14.4524 },
    { code: 'CI', name: 'Ivory Coast', nameFr: 'Côte d\'Ivoire', icon: Globe, lat: 7.5400, lng: -5.5471 },
    
    // Europe
    { code: 'FR', name: 'France', nameFr: 'France', icon: Landmark, lat: 46.603354, lng: 1.888334 },
    { code: 'DE', name: 'Germany', nameFr: 'Allemagne', icon: Landmark, lat: 51.165691, lng: 10.451526 },
    { code: 'IT', name: 'Italy', nameFr: 'Italie', icon: Landmark, lat: 41.87194, lng: 12.56738 },
    { code: 'ES', name: 'Spain', nameFr: 'Espagne', icon: Landmark, lat: 40.463667, lng: -3.74922 },
    { code: 'GB', name: 'United Kingdom', nameFr: 'Royaume-Uni', icon: Landmark, lat: 55.378051, lng: -3.435973 },
    
    // Amériques
    { code: 'US', name: 'United States', nameFr: 'États-Unis', icon: Globe, lat: 37.09024, lng: -95.712891 },
    { code: 'CA', name: 'Canada', nameFr: 'Canada', icon: Globe, lat: 56.130366, lng: -106.346771 },
    { code: 'BR', name: 'Brazil', nameFr: 'Brésil', icon: Globe, lat: -14.235004, lng: -51.92528 },
    { code: 'MX', name: 'Mexico', nameFr: 'Mexique', icon: Globe, lat: 23.634501, lng: -102.552784 },
    
    // Asie
    { code: 'CN', name: 'China', nameFr: 'Chine', icon: Globe, lat: 35.86166, lng: 104.195397 },
    { code: 'JP', name: 'Japan', nameFr: 'Japon', icon: Globe, lat: 36.204824, lng: 138.252924 },
    { code: 'IN', name: 'India', nameFr: 'Inde', icon: Globe, lat: 20.593684, lng: 78.96288 },
    { code: 'KR', name: 'South Korea', nameFr: 'Corée du Sud', icon: Globe, lat: 35.907757, lng: 127.766922 },
    
    // Océanie
    { code: 'AU', name: 'Australia', nameFr: 'Australie', icon: Globe, lat: -25.274398, lng: 133.775136 },
    { code: 'NZ', name: 'New Zealand', nameFr: 'Nouvelle-Zélande', icon: Globe, lat: -40.900557, lng: 174.885971 }
  ];
}

function getAllCities() {
  return [
    // Madagascar
    { name: 'Antananarivo', country: 'Madagascar', icon: Building, lat: -18.8792, lng: 47.5079 },
    { name: 'Toamasina', country: 'Madagascar', icon: Building, lat: -18.1499, lng: 49.4023 },
    { name: 'Antsirabe', country: 'Madagascar', icon: Building, lat: -19.8660, lng: 47.0333 },
    
    // France
    { name: 'Paris', country: 'France', icon: Landmark, lat: 48.8566, lng: 2.3522 },
    { name: 'Lyon', country: 'France', icon: Building, lat: 45.7640, lng: 4.8357 },
    { name: 'Marseille', country: 'France', icon: Building, lat: 43.2965, lng: 5.3698 },
    { name: 'Bordeaux', country: 'France', icon: Building, lat: 44.8378, lng: -0.5792 },
    { name: 'Nice', country: 'France', icon: Building, lat: 43.7102, lng: 7.2620 },
    
    // Autres villes mondiales
    { name: 'Tokyo', country: 'Japan', icon: Landmark, lat: 35.6762, lng: 139.6503 },
    { name: 'New York', country: 'United States', icon: Landmark, lat: 40.7128, lng: -74.0060 },
    { name: 'London', country: 'United Kingdom', icon: Landmark, lat: 51.5074, lng: -0.1278 },
    { name: 'Sydney', country: 'Australia', icon: Landmark, lat: -33.8688, lng: 151.2093 },
    { name: 'Dubai', country: 'United Arab Emirates', icon: Landmark, lat: 25.2048, lng: 55.2708 }
  ];
}

function getAllRegions() {
  return [
    // Régions de Madagascar
    { name: 'Analamanga', country: 'Madagascar', icon: Mountain, lat: -18.8792, lng: 47.5079 },
    { name: 'Atsinanana', country: 'Madagascar', icon: Mountain, lat: -18.1499, lng: 49.4023 },
    { name: 'Vakinankaratra', country: 'Madagascar', icon: Mountain, lat: -19.8660, lng: 47.0333 },
    
    // Régions françaises
    { name: 'Île-de-France', country: 'France', icon: Landmark, lat: 48.8566, lng: 2.3522 },
    { name: 'Auvergne-Rhône-Alpes', country: 'France', icon: Mountain, lat: 45.7640, lng: 4.8357 },
    { name: 'Provence-Alpes-Côte d\'Azur', country: 'France', icon: Palette, lat: 43.2965, lng: 5.3698 },
    { name: 'Nouvelle-Aquitaine', country: 'France', icon: Mountain, lat: 44.8378, lng: -0.5792 },
    
    // Régions internationales
    { name: 'California', country: 'United States', icon: Palette, lat: 36.7783, lng: -119.4179 },
    { name: 'Texas', country: 'United States', icon: Mountain, lat: 31.9686, lng: -99.9018 },
    { name: 'Ontario', country: 'Canada', icon: Globe, lat: 51.2538, lng: -85.3232 }
  ];
}

// Composant de chargement IA stylé avec texte "IA"
function AILoading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <motion.div
              animate={{
                rotate: -360,
                scale: [1.1, 1, 1.1]
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute inset-0 w-24 h-24 border-4 border-blue-300 border-b-transparent rounded-full mx-auto mb-4 opacity-60"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                >
                  IA
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex justify-center space-x-1 mt-2"
                >
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                      className="w-1 h-1 bg-blue-500 rounded-full"
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-slate-900">
            Analyse en cours
          </h3>
          <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
            Notre intelligence artificielle analyse votre bien en temps réel selon les critères du marché immobilier mondial
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-2 pt-4"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-slate-500 pt-4"
          >
            Cette opération peut prendre quelques instants
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

// Composant principal
function EstimationWizard({
  onSubmit,
  propertyTypes,
  onEstimationComplete
}: EstimationWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EstimationData>>({
    propertyType: 'apartment',
    features: {
      balcony: false,
      terrace: false,
      garden: false,
      parking: false,
      elevator: false,
      pool: false,
      basement: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<EstimationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Fonction pour soumettre à l'API backend
  const handleApiSubmit = async (data: EstimationData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📤 Envoi des données d\'estimation...', data);
      const response = await estimationAPI.submitEstimation(data);

      if (response.data.success) {
        setEstimationResult(response.data);

        if (onEstimationComplete) {
          onEstimationComplete(response.data);
        }

        // Sauvegarder l'estimation
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            await estimationAPI.saveEstimation({
              userId,
              estimationData: data,
              result: response.data
            });
          }
        } catch (saveError) {
          console.warn('⚠️ Erreur sauvegarde estimation:', saveError);
        }
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'estimation');
      }

    } catch (error: any) {
      console.error('❌ Erreur estimation:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de l\'estimation. Veuillez réessayer.';
      setError(errorMessage);

      // Fallback côté client
      const fallbackResult = generateClientFallback(data);
      setEstimationResult(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback côté client
  const generateClientFallback = (data: EstimationData): EstimationResult => {
    const basePrice = data.surface * 3000;
    const estimation = Math.round(basePrice);

    return {
      estimation,
      confidence: 70,
      explanation: 'Estimation de secours - service temporairement limité. Cette estimation est basée sur des données moyennes du marché.',
      priceRange: {
        min: Math.round(estimation * 0.8),
        max: Math.round(estimation * 1.2)
      },
      factors: [
        {
          factor: 'Service temporaire',
          impact: 'neutral',
          description: 'Estimation basique due à une limitation temporaire du service'
        }
      ],
      timestamp: new Date().toISOString(),
      pricePerSquareMeter: Math.round(estimation / data.surface),
      comparableProperties: [],
      marketTrends: { trend: 'stable', percentage: 0, description: 'Données momentanément indisponibles' },
      recommendations: ['Service en cours de rétablissement', 'Réessayez ultérieurement pour une analyse complète'],
      usedAI: false,
      isFallback: true
    };
  };

  const steps = [
    { number: 1, title: 'Type de bien', icon: Home },
    { number: 2, title: 'Caractéristiques', icon: Ruler },
    { number: 3, title: 'Localisation', icon: MapPin },
    { number: 4, title: 'État et équipements', icon: Wrench },
    { number: 5, title: 'Récapitulatif', icon: CheckCircle2 }
  ];

  const renderStep = () => {
    if (isLoading) {
      return <AILoading />;
    }

    switch (step) {
      case 1:
        return <Step1 data={formData} onUpdate={updateFormData} onNext={() => setStep(2)} propertyTypes={propertyTypes} />;
      case 2:
        return <Step2 data={formData} onUpdate={updateFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3:
        return <Step3 data={formData} onUpdate={updateFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} />;
      case 4:
        return <Step4 data={formData} onUpdate={updateFormData} onNext={() => setStep(5)} onBack={() => setStep(3)} />;
      case 5:
        return (
          <Step5
            data={formData}
            onSubmit={handleApiSubmit}
            onBack={() => setStep(4)}
            propertyTypes={propertyTypes}
            conditions={conditions}
            isLoading={isLoading}
            error={error}
            estimationResult={estimationResult}
            onNewEstimation={() => {
              setEstimationResult(null);
              setError(null);
              setStep(1);
              setFormData({
                propertyType: 'apartment',
                features: {
                  balcony: false,
                  terrace: false,
                  garden: false,
                  parking: false,
                  elevator: false,
                  pool: false,
                  basement: false
                }
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-slate-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Estimation Immobilière
        </h1>
        <p className="text-slate-600 mt-2">Obtenez une estimation précise de votre bien en 5 minutes</p>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6 relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 -z-10 mx-8"></div>

          {steps.map((s, index) => {
            const IconComponent = s.icon;
            const isCompleted = s.number < step;
            const isCurrent = s.number === step;
            const isUpcoming = s.number > step;

            return (
              <div key={s.number} className="flex flex-col items-center flex-1 relative">
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    border-2 transition-all duration-300 relative z-10
                    ${isCompleted ? 'bg-blue-500 border-blue-500 text-white shadow-lg' :
                      isCurrent ? 'bg-white border-blue-500 text-blue-500 shadow-lg ring-2 ring-blue-200' :
                        'bg-white border-slate-300 text-slate-400'}
                  `}
                  whileHover={{ scale: isUpcoming ? 1.1 : 1 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                </motion.div>

                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${s.number < step ? 'bg-blue-500' : 'bg-slate-200'
                    }`}></div>
                )}

                <span className={`text-xs mt-3 font-medium text-center px-2 ${isCurrent ? 'text-blue-600 font-semibold' :
                    isCompleted ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Étape 1: Type de bien
function Step1({ data, onUpdate, onNext, propertyTypes }: any) {
  return (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Quel type de bien souhaitez-vous estimer ?</h2>
        <p className="text-slate-600">Sélectionnez le type de bien qui correspond à votre propriété</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {propertyTypes.map((type: any) => {
          const IconComponent = type.icon;
          const isSelected = data.propertyType === type.value;

          return (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center
                shadow-sm hover:shadow-md
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-blue-300 bg-white'}
              `}
              onClick={() => onUpdate({ propertyType: type.value })}
            >
              <div className={`
                p-3 rounded-lg mb-3 transition-colors
                ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}
              `}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="font-semibold text-slate-900">{type.label}</div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!data.propertyType}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-200 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        <span>Continuer</span>
        <ArrowRight className="w-5 h-5 ml-3" />
      </motion.button>
    </div>
  );
}

// Étape 2: Caractéristiques
function Step2({ data, onUpdate, onNext, onBack }: any) {
  const inputs = [
    {
      label: 'Surface habitable',
      icon: Ruler,
      value: data.surface,
      onChange: (value: number) => onUpdate({ surface: value }),
      placeholder: 'Ex: 75',
      unit: 'm²',
      description: 'Surface totale habitable'
    },
    {
      label: 'Nombre de pièces',
      icon: DoorOpen,
      value: data.rooms,
      onChange: (value: number) => onUpdate({ rooms: value }),
      placeholder: 'Ex: 4',
      unit: 'pièces',
      description: 'Pièces principales'
    },
    {
      label: 'Chambres',
      icon: Bed,
      value: data.bedrooms,
      onChange: (value: number) => onUpdate({ bedrooms: value }),
      placeholder: 'Ex: 3',
      unit: 'chambres',
      description: 'Chambres à coucher'
    },
    {
      label: 'Salles de bain',
      icon: Bath,
      value: data.bathrooms,
      onChange: (value: number) => onUpdate({ bathrooms: value }),
      placeholder: 'Ex: 1',
      unit: 'sdb',
      description: 'Salles de bain et douches'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Caractéristiques principales</h2>
        <p className="text-slate-600">Renseignez les informations de base de votre bien</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {inputs.map((input, index) => {
          const IconComponent = input.icon;

          return (
            <motion.div
              key={input.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-colors"
            >
              <label className="block text-sm font-semibold text-slate-700 mb-3  items-center">
                <IconComponent className="w-4 h-4 mr-2 text-blue-500" />
                {input.label}
              </label>

              <div className="grid grid-cols-3 justify-center items-center gap-3">
                <input
                  type="number"
                  value={input.value || ''}
                  onChange={(e) => input.onChange(parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 col-span-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg"
                  placeholder={input.placeholder}
                  min="0"
                />
                <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                  {input.unit}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2">{input.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </motion.button>
        <motion.button
          onClick={onNext}
          disabled={!data.surface || !data.rooms}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          <span>Continuer</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  );
}

// Étape 3: Localisation
function Step3({ data, onUpdate, onNext, onBack }: any) {
  const [searchQuery, setSearchQuery] = useState(data.location?.address || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus automatique sur le champ de recherche
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Recherche automatique avec debounce
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const timeoutId = setTimeout(() => {
        handleAddressSearch(searchQuery);
      }, 800); // Délai de 800ms pour la recherche automatique

      return () => clearTimeout(timeoutId);
    } else if (searchQuery.length === 0) {
      setShowResults(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Suggestions populaires mondiales
  const popularSuggestions = [
    { type: 'city', name: 'Paris, France', country: 'France', icon: Landmark },
    { type: 'city', name: 'Tokyo, Japon', country: 'Japon', icon: Landmark },
    { type: 'city', name: 'New York, États-Unis', country: 'États-Unis', icon: Landmark },
    { type: 'city', name: 'Londres, Royaume-Uni', country: 'Royaume-Uni', icon: Landmark },
    { type: 'city', name: 'Sydney, Australie', country: 'Australie', icon: Landmark },
    { type: 'city', name: 'Antananarivo, Madagascar', country: 'Madagascar', icon: Building },
    { type: 'city', name: 'Abidjan, Côte d\'Ivoire', country: 'Côte d\'Ivoire', icon: Building },
    { type: 'city', name: 'Dakar, Sénégal', country: 'Sénégal', icon: Building },
  ];

  // Recherche en temps réel avec suggestions
  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    // Suggestions locales basées sur la recherche
    const localSuggestions = generateLocalSuggestions(query);
    setSuggestions(localSuggestions);
    setShowSuggestions(true);
  };

  // Génération de suggestions locales
  const generateLocalSuggestions = (query: string) => {
    const queryLower = query.toLowerCase();
    const allCountries = getAllCountries();
    
    return [
      // Correspondances exactes de pays
      ...allCountries
        .filter(country => 
          country.name.toLowerCase().includes(queryLower) ||
          country.nameFr?.toLowerCase().includes(queryLower)
        )
        .slice(0, 3)
        .map(country => ({
          type: 'country' as const,
          name: country.name,
          country: country.name,
          icon: country.icon,
          exactMatch: true
        })),
      
      // Villes principales correspondantes
      ...getAllCities()
        .filter(city => 
          city.name.toLowerCase().includes(queryLower) ||
          city.country.toLowerCase().includes(queryLower)
        )
        .slice(0, 3)
        .map(city => ({
          type: 'city' as const,
          name: `${city.name}, ${city.country}`,
          country: city.country,
          icon: city.icon
        })),
    ];
  };

  // Recherche mondiale avancée
  const handleAddressSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim() || searchTerm.length < 3) return;
    
    setIsSearching(true);
    setShowResults(false);
    setShowSuggestions(false);
    
    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=10&addressdetails=1&accept-language=fr`;
      
      const response = await fetch(searchUrl);
      
      if (response.ok) {
        const results = await response.json();
        
        const enrichedResults = results.map((result: any) => ({
          ...result,
          type: determineResultType(result),
          importance: result.importance || 0,
          lat: parseFloat(result.lat) || 0,
          lon: parseFloat(result.lon) || 0
        })).sort((a: any, b: any) => b.importance - a.importance);
        
        setSearchResults(enrichedResults);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
      handleLocalSearch(searchTerm);
    } finally {
      setIsSearching(false);
    }
  };

  // Recherche manuelle avec le bouton
  const handleManualSearch = () => {
    if (searchQuery.length >= 2) {
      handleAddressSearch();
    }
  };

  // Déterminer le type de résultat
  const determineResultType = (result: any) => {
    const address = result.address;
    if (address?.city || address?.town || address?.village) return 'city';
    if (address?.state || address?.region) return 'region';
    if (address?.country) return 'country';
    return 'place';
  };

  // Recherche locale de fallback
  const handleLocalSearch = (query: string) => {
    const queryLower = query.toLowerCase();
    const allLocations = [
      ...getAllCountries().map(c => ({ ...c, type: 'country' })),
      ...getAllCities().map(c => ({ ...c, type: 'city' })),
      ...getAllRegions().map(r => ({ ...r, type: 'region' }))
    ];

    const localResults = allLocations
      .filter(location => 
        location.name.toLowerCase().includes(queryLower) ||
        location.country.toLowerCase().includes(queryLower) ||
        location.nameFr?.toLowerCase().includes(queryLower)
      )
      .slice(0, 10);

    setSearchResults(localResults);
    setShowResults(true);
  };

  const handleResultSelect = (result: any) => {
    let locationData;
    
    if (result.lat && result.lon) {
      locationData = createLocationFromOSM(result);
    } else {
      locationData = createLocationFromLocal(result);
    }
    
    onUpdate({ location: locationData });
    setSearchQuery(locationData.address);
    setShowResults(false);
    setShowSuggestions(false);
    setSearchResults([]);
    
    // Remettre le focus sur le champ après sélection
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    handleAddressSearch(suggestion.name);
  };

  // Création depuis OSM
  const createLocationFromOSM = (result: any) => {
    const address = result.address;
    
    const lat = typeof result.lat === 'number' ? result.lat : parseFloat(result.lat) || 0;
    const lng = typeof result.lon === 'number' ? result.lon : parseFloat(result.lon) || 0;
    
    return {
      address: result.display_name,
      city: extractCityFromOSM(result),
      country: address?.country || 'Unknown',
      region: address?.state || address?.region || address?.county || '',
      postalCode: address?.postcode || '',
      lat: lat,
      lng: lng,
      osm_id: result.osm_id,
      type: result.type
    };
  };

  // Création depuis données locales
  const createLocationFromLocal = (result: any) => {
    const isCity = result.type === 'city';
    const isRegion = result.type === 'region';
    
    return {
      address: isCity ? `${result.name}, ${result.country}` : 
               isRegion ? `${result.name}, ${result.country}` : 
               result.name,
      city: isCity ? result.name : '',
      country: result.country,
      region: isRegion ? result.name : '',
      postalCode: '',
      lat: result.lat || 0,
      lng: result.lng || 0,
      type: result.type
    };
  };

  const extractCityFromOSM = (result: any) => {
    const addr = result.address;
    return addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Unknown City';
  };

  const handleClearLocation = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
    setShowResults(false);
    setShowSuggestions(false);
    onUpdate({ location: null });
    
    // Remettre le focus après suppression
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  // Fonction pour obtenir l'icône du résultat
  const getIconForResult = (result: any) => {
    if (result.icon) {
      const IconComponent = result.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    
    switch (result.type) {
      case 'city': return <Building className="w-4 h-4" />;
      case 'region': return <Mountain className="w-4 h-4" />;
      case 'country': return <Globe className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  // Gérer la fermeture des dropdowns en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Localisation du bien</h2>
        <p className="text-slate-600">
          Commencez à taper pour rechercher automatiquement - recherche mondiale en temps réel
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        {/* Barre de recherche principale */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-500" />
            Recherche automatique mondiale
            {isSearching && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-2 flex items-center text-sm text-blue-500"
              >
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                recherche...
              </motion.span>
            )}
          </h3>
          
          <div className="relative" ref={searchInputRef}>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 transition-all duration-200"
                  placeholder="Tapez une ville, région ou pays (recherche automatique)..."
                  disabled={isSearching}
                  autoComplete="off"
                />
                {searchQuery && !isSearching && (
                  <button
                    onClick={handleClearLocation}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
              <motion.button
                onClick={handleManualSearch}
                disabled={!searchQuery.trim() || isSearching}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center shadow-lg disabled:shadow-none"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Indicateur de recherche automatique */}
            {searchQuery.length > 0 && searchQuery.length < 3 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="absolute top-full left-0 right-0 mt-1"
              >
                <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                  💡 Tapez encore {3 - searchQuery.length} caractère(s) pour la recherche automatique
                </div>
              </motion.div>
            )}
            
            {/* Suggestions en temps réel */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-xl z-20 max-h-80 overflow-y-auto"
              >
                <div className="p-2 border-b border-slate-100 bg-blue-50 rounded-t-xl">
                  <div className="text-sm font-semibold text-blue-700 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Suggestions correspondantes
                  </div>
                </div>
                {suggestions.map((suggestion, index) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full text-left p-3 hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition-colors group"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">
                            {suggestion.name}
                          </div>
                          <div className="text-xs text-slate-600 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {suggestion.type === 'city' ? 'Ville' : 
                             suggestion.type === 'region' ? 'Région' : 'Pays'}
                            {suggestion.exactMatch && (
                              <span className="ml-2 px-1 bg-green-100 text-green-800 text-xs rounded">Correspondance exacte</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
            
            {/* Résultats de recherche */}
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-xl z-20 max-h-80 overflow-y-auto"
              >
                <div className="p-2 border-b border-slate-100 bg-blue-50 rounded-t-xl">
                  <div className="text-sm font-semibold text-blue-700">
                    {searchResults.length} résultat(s) trouvé(s)
                  </div>
                </div>
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultSelect(result)}
                    className="w-full text-left p-3 hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition-colors group"
                  >
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 mt-1 group-hover:bg-blue-200 transition-colors">
                        {getIconForResult(result)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 text-sm">
                          {result.display_name || result.name}
                        </div>
                        <div className="text-xs text-slate-600 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {result.type || 'Lieu'}
                          {result.address?.country && ` • ${result.address.country}`}
                          {result.lat && ` • ${formatCoordinates(result.lat, result.lon)}`}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-slate-500">
              Recherche automatique activée • Monde entier • Villes, régions, pays
            </p>
            {searchQuery.length >= 3 && !isSearching && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-600 font-medium"
              >
                ✓ Recherche automatique en cours
              </motion.p>
            )}
          </div>
        </div>

        {/* Suggestions populaires */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
            Recherches populaires
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {popularSuggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, y: -1 }}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="p-3 text-left rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all bg-white shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{suggestion.name}</div>
                      <div className="text-xs text-slate-600">
                        {suggestion.type === 'city' ? 'Ville' : 'Pays'}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Localisation confirmée */}
        {data.location && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-800">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <div>
                  <span className="font-semibold">Localisation confirmée ✓</span>
                  <p className="text-sm">{data.location.address}</p>
                  <p className="text-xs opacity-75">
                    {data.location.type === 'city' ? 'Ville' : 
                     data.location.type === 'region' ? 'Région' : 
                     data.location.type === 'country' ? 'Pays' : 'Lieu'}
                    {data.location.country && ` • ${data.location.country}`}
                    {` • ${formatCoordinates(data.location.lat, data.location.lng)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearLocation}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="flex gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </motion.button>
        <motion.button
          onClick={onNext}
          disabled={!data.location}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          <span>Continuer</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  );
}

// Étape 4: État et équipements
function Step4({ data, onUpdate, onNext, onBack }: any) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">État et équipements</h2>
        <p className="text-slate-600">Décrivez l'état de votre bien et ses équipements</p>
      </div>

      <div className="space-y-8 mb-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-blue-500" />
            État général du bien
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conditions.map((condition, index) => (
              <motion.button
                key={condition.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`
                  p-4 text-left rounded-xl border-2 transition-all duration-200
                  shadow-sm hover:shadow-md
                  ${data.condition === condition.value
                    ? condition.color + ' ring-2 ring-opacity-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'}
                `}
                onClick={() => onUpdate({ condition: condition.value })}
              >
                <div className="font-semibold mb-1">{condition.label}</div>
                <div className="text-sm text-slate-600">{condition.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Équipements et extras
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuresConfig.map((feature, index) => {
              const IconComponent = feature.icon;
              const isSelected = data.features[feature.key as keyof typeof data.features];

              return (
                <motion.button
                  key={feature.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center
                    shadow-sm hover:shadow-md
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-blue-300 bg-white'}
                  `}
                  onClick={() => onUpdate({
                    features: {
                      ...data.features,
                      [feature.key]: !data.features[feature.key as keyof typeof data.features]
                    }
                  })}
                >
                  <div className={`
                    p-2 rounded-lg mb-2 transition-colors
                    ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}
                  `}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 text-center">{feature.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </motion.button>
        <motion.button
          onClick={onNext}
          disabled={!data.condition}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          <span>Continuer</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  );
}

// Étape 5: Récapitulatif et résultats
function Step5({
  data,
  onSubmit,
  onBack,
  propertyTypes,
  conditions,
  isLoading,
  error,
  estimationResult,
  onNewEstimation
}: any) {

  const handleSubmit = () => {
    onSubmit(data as EstimationData);
  };

  // Si chargement en cours (géré dans le composant principal maintenant)
  if (isLoading) {
    return <AILoading />;
  }

  // Si erreur
  if (error && !estimationResult) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Erreur lors de l'estimation
        </h3>
        <p className="text-slate-600 mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center border border-slate-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <button
            onClick={onNewEstimation}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Nouvelle estimation
          </button>
        </div>
      </div>
    );
  }

  // Si résultat disponible
  if (estimationResult) {
    return <EstimationResult
      result={estimationResult}
      data={data}
      propertyTypes={propertyTypes}
      conditions={conditions}
      onNewEstimation={onNewEstimation}
    />;
  }

  // Rendu normal du récapitulatif
  const getPropertyTypeLabel = (value: string) => {
    return propertyTypes.find((t: any) => t.value === value)?.label || value;
  };

  const getConditionLabel = (value: string) => {
    return conditions.find((c: any) => c.value === value)?.label || value;
  };

  const getConditionColor = (value: string) => {
    return conditions.find((c: any) => c.value === value)?.color || 'bg-slate-100';
  };

  const activeFeatures = Object.entries(data.features || {})
    .filter(([_, value]) => value)
    .map(([key]) => featuresConfig.find(f => f.key === key))
    .filter(Boolean);

  return (
    <div>
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Vérifiez votre estimation</h2>
        <p className="text-slate-600">Toutes les informations sont-elles correctes ?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-500" />
              Caractéristiques principales
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Type:</span>
                <p className="font-semibold">{getPropertyTypeLabel(data.propertyType)}</p>
              </div>
              <div>
                <span className="text-slate-600">Surface:</span>
                <p className="font-semibold">{data.surface}m²</p>
              </div>
              <div>
                <span className="text-slate-600">Pièces:</span>
                <p className="font-semibold">{data.rooms}</p>
              </div>
              <div>
                <span className="text-slate-600">Chambres:</span>
                <p className="font-semibold">{data.bedrooms}</p>
              </div>
              <div>
                <span className="text-slate-600">SDB:</span>
                <p className="font-semibold">{data.bathrooms}</p>
              </div>
              <div>
                <span className="text-slate-600">État:</span>
                <p className="font-semibold">{getConditionLabel(data.condition)}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Localisation
            </h3>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">{data.location?.address}</p>
                <p className="text-slate-600 text-sm">{data.location?.city} {data.location?.postalCode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">État du bien</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${getConditionColor(data.condition)} border`}>
              <span className="font-semibold">{getConditionLabel(data.condition)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Équipements sélectionnés</h3>
            <div className="flex flex-wrap gap-2">
              {activeFeatures.map((feature) => (
                <span
                  key={feature!.key}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${feature!.color} border`}
                >
                  <feature.icon className="w-3 h-3 mr-1" />
                  {feature!.label}
                </span>
              ))}
              {activeFeatures.length === 0 && (
                <p className="text-slate-500 text-sm">Aucun équipement sélectionné</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="font-semibold text-blue-900">Prêt pour l'estimation !</h4>
            <p className="text-blue-700 text-sm">
              Votre bien sera analysé selon les critères du marché immobilier actuel
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Modifier
        </motion.button>
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <Calculator className="w-5 h-5 mr-2" />
          <span>Obtenir mon estimation</span>
        </motion.button>
      </div>
    </div>
  );
}

// Composant pour afficher les résultats avec bouton PDF
function EstimationResult({ result, data, propertyTypes, conditions, onNewEstimation }: any) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-100 border-green-200';
      case 'negative': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <ArrowUp className="w-3 h-3" />;
      case 'negative': return <ArrowDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  const handleExportPDF = () => {
    generatePDF(result, data, propertyTypes, conditions);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${result.isFallback ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
          {result.isFallback ? (
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          ) : result.usedAI ? (
            <Brain className="w-8 h-8 text-green-500" />
          ) : (
            <TrendingUp className="w-8 h-8 text-green-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {result.isFallback ? 'Estimation indicative' : 'Estimation de votre bien'}
        </h2>
        <p className="text-slate-600">
          {result.isFallback
            ? 'Basée sur les données moyennes du marché'
            : result.usedAI
              ? 'Analysé par notre intelligence artificielle'
              : 'Basée sur notre algorithme d\'estimation'
          }
        </p>
        {result.searchTime && (
          <p className="text-sm text-slate-500 mt-1">
            Temps d'analyse: {result.searchTime}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-8 text-center ${result.isFallback
            ? 'bg-yellow-100 border border-yellow-200'
            : 'bg-blue-100 border border-blue-200'
          }`}
      >
        <div className="text-sm text-slate-700 mb-2">Valeur estimée</div>
        <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          {formatPrice(result.estimation)}
        </div>
        <div className="text-lg text-slate-700 mb-3">
          Fourchette : {formatPrice(result.priceRange.min)} - {formatPrice(result.priceRange.max)}
        </div>
        {result.pricePerSquareMeter && (
          <div className="text-sm text-slate-600 flex items-center justify-center">
            <Euro className="w-4 h-4 mr-1" />
            Soit {formatPrice(result.pricePerSquareMeter)} / m²
          </div>
        )}
      </motion.div>

      {result.isFallback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-yellow-800 font-medium">Mode estimation de base</p>
              <p className="text-yellow-700 text-sm">
                L'estimation avancée n'est pas disponible pour le moment. Cette estimation utilise nos algorithmes de base.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
      >
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500" />
          Analyse détaillée
        </h3>
        <p className="text-slate-700 leading-relaxed">
          {result.explanation}
        </p>
      </motion.div>

      {result.factors && result.factors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-slate-900 text-lg flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Facteurs influençant le prix
          </h3>
          <div className="grid gap-3">
            {result.factors.map((factor: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-medium border gap-2 ${getImpactColor(factor.impact)}`}>
                      {getImpactIcon(factor.impact)}
                      {factor.factor}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {factor.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 pt-6"
      >
        <button
          onClick={onNewEstimation}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-300"
        >
          <Home className="w-5 h-5 mr-2" />
          Nouvelle estimation
        </button>
        <button
          onClick={handleExportPDF}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <FileText className="w-5 h-5 mr-2" />
          Exporter en PDF
        </button>
      </motion.div>

      <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600 text-center flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-2 text-slate-500" />
          {result.isFallback
            ? 'Cette estimation indicative est fournie à titre informatif. Pour une expertise précise, consultez un professionnel.'
            : 'Cette estimation est fournie à titre indicatif et ne constitue pas une expertise immobilière certifiée.'
          }
        </p>
      </div>
    </div>
  );
}

export default EstimationWizard;