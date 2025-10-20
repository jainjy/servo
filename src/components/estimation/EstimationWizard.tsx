// components/estimation/EstimationWizard.tsx


import { useState } from 'react';
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
  ArrowUpDown
} from 'lucide-react';
import { EstimationData } from '@/pages/EstimationImmobilierPage';

interface EstimationWizardProps {
  onSubmit: (data: EstimationData) => void;
  propertyTypes: Array<{ value: string; label: string; icon: any }>;
}

const conditions = [
  { value: 'excellent', label: 'Excellent état', description: 'Neuf ou rénové récemment' },
  { value: 'good', label: 'Bon état', description: 'Bien entretenu, quelques retouches' },
  { value: 'average', label: 'État moyen', description: 'Habitable mais besoin de travaux' },
  { value: 'needs_renovation', label: 'À rénover', description: 'Travaux importants nécessaires' }
];

const featuresConfig = [
  { key: 'balcony', label: 'Balcon', icon: Building2 },
  { key: 'terrace', label: 'Terrasse', icon: Home },
  { key: 'garden', label: 'Jardin', icon: TreePine },
  { key: 'parking', label: 'Parking', icon: Car },
  { key: 'elevator', label: 'Ascenseur', icon: ArrowUpDown },
  { key: 'pool', label: 'Piscine', icon: Waves },
  { key: 'basement', label: 'Cave', icon: Warehouse }
];

export default function EstimationWizard({ onSubmit, propertyTypes }: EstimationWizardProps) {
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

  const updateFormData = (updates: Partial<EstimationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const steps = [
    { number: 1, title: 'Type de bien' },
    { number: 2, title: 'Caractéristiques' },
    { number: 3, title: 'Localisation' },
    { number: 4, title: 'État et équipements' },
    { number: 5, title: 'Récapitulatif' }
  ];

  const renderStep = () => {
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
        return <Step5 data={formData} onSubmit={onSubmit} onBack={() => setStep(4)} propertyTypes={propertyTypes} conditions={conditions} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center flex-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${s.number === step ? 'bg-purple-500 text-white' : 
                  s.number < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {s.number}
              </div>
              <span className={`text-xs mt-2 hidden md:block ${s.number === step ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-purple-500 h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Contenu de l'étape */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Quel type de bien ?</h2>
      <p className="text-gray-600 mb-8">Sélectionnez le type de bien à estimer</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {propertyTypes.map((type: any) => {
          const IconComponent = type.icon;
          return (
            <motion.button
              key={type.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center
                ${data.propertyType === type.value 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300'}
              `}
              onClick={() => onUpdate({ propertyType: type.value })}
            >
              <IconComponent className="w-8 h-8 text-gray-700 mb-2" />
              <div className="font-semibold text-gray-900">{type.label}</div>
            </motion.button>
          );
        })}
      </div>
      
      <button
        onClick={onNext}
        disabled={!data.propertyType}
        className="w-full md:w-auto bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center mx-auto"
      >
        <span>Continuer</span>
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}

// Étape 2: Caractéristiques
function Step2({ data, onUpdate, onNext, onBack }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Caractéristiques principales</h2>
      <p className="text-gray-600 mb-8">Renseignez les informations de base de votre bien</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Ruler className="w-4 h-4 mr-2" />
            Surface (m²)
          </label>
          <input
            type="number"
            value={data.surface || ''}
            onChange={(e) => onUpdate({ surface: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: 75"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <DoorOpen className="w-4 h-4 mr-2" />
            Nombre de pièces
          </label>
          <input
            type="number"
            value={data.rooms || ''}
            onChange={(e) => onUpdate({ rooms: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: 4"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Bed className="w-4 h-4 mr-2" />
            Chambres
          </label>
          <input
            type="number"
            value={data.bedrooms || ''}
            onChange={(e) => onUpdate({ bedrooms: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: 3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Bath className="w-4 h-4 mr-2" />
            Salles de bain
          </label>
          <input
            type="number"
            value={data.bathrooms || ''}
            onChange={(e) => onUpdate({ bathrooms: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: 1"
          />
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={!data.surface || !data.rooms}
          className="flex-1 md:flex-none bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span>Continuer</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Étape 3: Localisation
function Step3({ data, onUpdate, onNext, onBack }: any) {
  const [address, setAddress] = useState('');
  
  const handleAddressSearch = () => {
    // Simulation de recherche d'adresse
    onUpdate({
      location: {
        address: address,
        city: 'Paris',
        postalCode: '75000'
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Localisation</h2>
      <p className="text-gray-600 mb-8">Où se situe votre bien ?</p>
      
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Adresse complète
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: 25 Rue de la Paix, Paris"
            />
            <button
              onClick={handleAddressSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </button>
          </div>
        </div>
        
        {data.location && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center text-green-800">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span>Adresse trouvée : {data.location.address}</span>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={!data.location}
          className="flex-1 md:flex-none bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span>Continuer</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Étape 4: État et équipements
function Step4({ data, onUpdate, onNext, onBack }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">État et équipements</h2>
      <p className="text-gray-600 mb-8">Décrivez l'état de votre bien et ses équipements</p>
      
      <div className="space-y-6 mb-8">
        {/* État du bien */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Wrench className="w-4 h-4 mr-2" />
            État général du bien
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conditions.map((condition) => (
              <motion.button
                key={condition.value}
                whileHover={{ scale: 1.02 }}
                className={`
                  p-4 text-left rounded-xl border-2 transition-all duration-200
                  ${data.condition === condition.value 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'}
                `}
                onClick={() => onUpdate({ condition: condition.value })}
              >
                <div className="font-semibold text-gray-900">{condition.label}</div>
                <div className="text-sm text-gray-600 mt-1">{condition.description}</div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Équipements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Équipements et extras
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featuresConfig.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.button
                  key={feature.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center
                    ${data.features[feature.key as keyof typeof data.features]
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'}
                  `}
                  onClick={() => onUpdate({
                    features: {
                      ...data.features,
                      [feature.key]: !data.features[feature.key as keyof typeof data.features]
                    }
                  })}
                >
                  <IconComponent className="w-6 h-6 text-gray-700 mb-2" />
                  <span className="text-sm font-medium text-gray-900 text-center">{feature.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={!data.condition}
          className="flex-1 md:flex-none bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span>Continuer</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Étape 5: Récapitulatif
function Step5({ data, onSubmit, onBack, propertyTypes, conditions }: any) {
  const handleSubmit = () => {
    onSubmit(data as EstimationData);
  };

  const getPropertyTypeLabel = (value: string) => {
    return propertyTypes.find((t: any) => t.value === value)?.label || value;
  };

  const getConditionLabel = (value: string) => {
    return conditions.find((c: any) => c.value === value)?.label || value;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Récapitulatif</h2>
      <p className="text-gray-600 mb-8">Vérifiez les informations de votre bien</p>
      
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Caractéristiques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{getPropertyTypeLabel(data.propertyType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Surface:</span>
                <span className="font-medium">{data.surface} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pièces:</span>
                <span className="font-medium">{data.rooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chambres:</span>
                <span className="font-medium">{data.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SDB:</span>
                <span className="font-medium">{data.bathrooms}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Localisation & État</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Adresse:</span>
                <span className="font-medium text-right">{data.location?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">État:</span>
                <span className="font-medium">{getConditionLabel(data.condition)}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mt-4 mb-2">Équipements</h3>
            <div className="flex flex-wrap gap-1">
              {Object.entries(data.features || {}).map(([key, value]) => 
                value && (
                  <span key={key} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    {key}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Modifier
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span>Obtenir mon estimation</span>
        </button>
      </div>
    </div>
  );
}