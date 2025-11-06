// components/estimation/EstimationWizard.tsx

import { useState, useRef, useEffect } from 'react';
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
  Navigation
} from 'lucide-react';
import { EstimationData } from '@/pages/EstimationImmobilierPage';

interface EstimationWizardProps {
  onSubmit: (data: EstimationData) => void;
  propertyTypes: Array<{ value: string; label: string; icon: any }>;
}

const conditions = [
  { value: 'excellent', label: 'Excellent état', description: 'Neuf ou rénové récemment', color: 'bg-green-100 border-green-500 text-green-800' },
  { value: 'good', label: 'Bon état', description: 'Bien entretenu, quelques retouches', color: 'bg-blue-100 border-blue-500 text-blue-800' },
  { value: 'average', label: 'État moyen', description: 'Habitable mais besoin de travaux', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
  { value: 'needs_renovation', label: 'À rénover', description: 'Travaux importants nécessaires', color: 'bg-orange-100 border-orange-500 text-orange-800' }
];

const featuresConfig = [
  { key: 'balcony', label: 'Balcon', icon: Building2, color: 'bg-blue-100 text-blue-800' },
  { key: 'terrace', label: 'Terrasse', icon: Home, color: 'bg-blue-100 text-blue-800' },
  { key: 'garden', label: 'Jardin', icon: TreePine, color: 'bg-blue-100 text-blue-800' },
  { key: 'parking', label: 'Parking', icon: Car, color: 'bg-blue-100 text-blue-800' },
  { key: 'elevator', label: 'Ascenseur', icon: ArrowUpDown, color: 'bg-blue-100 text-blue-800' },
  { key: 'pool', label: 'Piscine', icon: Waves, color: 'bg-blue-100 text-blue-800' },
  { key: 'basement', label: 'Cave', icon: Warehouse, color: 'bg-blue-100 text-blue-800' }
];

// Composant de carte interactive
function InteractiveMap({ 
  location, 
  onLocationSelect, 
  className = "" 
}: { 
  location: any; 
  onLocationSelect: (location: any) => void;
  className?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mapLocation, setMapLocation] = useState(location);

  const handleMapClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simuler des coordonnées GPS basées sur la position du clic
    const newLocation = {
      address: `Position sélectionnée`,
      city: 'Ville',
      postalCode: '00000',
      lat: 48.8566 + (y / rect.height - 0.5) * 0.1,
      lng: 2.3522 + (x / rect.width - 0.5) * 0.1
    };
    
    setMapLocation(newLocation);
    onLocationSelect(newLocation);
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);
    // Mettre à jour la localisation après le drag
    if (mapLocation) {
      onLocationSelect(mapLocation);
    }
  };

  return (
    <div className={`relative bg-slate-800 rounded-xl overflow-hidden ${className}`}>
      {/* En-tête de la carte */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <Navigation className="w-5 h-5 mr-2" />
            <span className="font-semibold">Carte interactive</span>
          </div>
          <div className="text-sm text-slate-300">
            Cliquez ou déplacez la carte pour sélectionner l'emplacement
          </div>
        </div>
      </div>

      {/* Carte */}
      <div
        ref={mapRef}
        className={`h-full cursor-pointer transition-all duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onClick={handleMapClick}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Fond de carte stylisé */}
        <div className="h-full bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 relative">
          {/* Routes */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-0 right-0 h-1 bg-white/30"></div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/30"></div>
            <div className="absolute top-3/4 left-0 right-0 h-1 bg-white/30"></div>
            <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-white/30"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/30"></div>
            <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-white/30"></div>
          </div>

          {/* Quartiers */}
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-green-400/20 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-yellow-400/20 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-red-400/20 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-purple-400/20 rounded-full"></div>

          {/* Marqueur de position */}
          {mapLocation && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                />
                <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-ping" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pied de carte */}
      {mapLocation && (
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm z-10 p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-sm font-medium">Position sélectionnée</span>
            </div>
            <div className="text-xs text-slate-300">
              Lat: {mapLocation.lat?.toFixed(4)}, Lng: {mapLocation.lng?.toFixed(4)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    { number: 1, title: 'Type de bien', icon: Home },
    { number: 2, title: 'Caractéristiques', icon: Ruler },
    { number: 3, title: 'Localisation', icon: MapPin },
    { number: 4, title: 'État et équipements', icon: Wrench },
    { number: 5, title: 'Récapitulatif', icon: CheckCircle2 }
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
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-slate-200">
      {/* En-tête amélioré */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Estimation Immobilière
        </h1>
        <p className="text-slate-600 mt-2">Obtenez une estimation précise de votre bien en 5 minutes</p>
      </div>

      {/* Barre de progression améliorée */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6 relative">
          {/* Ligne de fond */}
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
                
                {/* Ligne de progression entre les étapes */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${
                    s.number < step ? 'bg-blue-500' : 'bg-slate-200'
                  }`}></div>
                )}
                
                <span className={`text-xs mt-3 font-medium text-center px-2 ${
                  isCurrent ? 'text-blue-600 font-semibold' : 
                  isCompleted ? 'text-blue-600' : 'text-slate-500'
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenu de l'étape */}
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
              <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                <IconComponent className="w-4 h-4 mr-2 text-blue-500" />
                {input.label}
              </label>
              
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={input.value || ''}
                  onChange={(e) => input.onChange(parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg"
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

// Étape 3: Localisation avec carte interactive
function Step3({ data, onUpdate, onNext, onBack }: any) {
  const [address, setAddress] = useState(data.location?.address || '');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleAddressSearch = async () => {
    if (!address.trim()) return;
    
    setIsSearching(true);
    
    // Simulation de recherche d'adresse avec délai
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUpdate({
      location: {
        address: address,
        city: 'Paris',
        postalCode: '75000',
        lat: 48.8566,
        lng: 2.3522
      }
    });
    
    setIsSearching(false);
  };

  const handleMapLocationSelect = (location: any) => {
    onUpdate({
      location: {
        ...location,
        address: address || 'Position sélectionnée sur la carte'
      }
    });
  };

  const handleClearLocation = () => {
    setAddress('');
    onUpdate({ location: null });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Localisation du bien</h2>
        <p className="text-slate-600">Sélectionnez l'emplacement sur la carte ou recherchez une adresse</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Formulaire d'adresse */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Rechercher une adresse
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 25 Rue de la Paix, 75002 Paris"
                disabled={isSearching}
              />
              <motion.button
                onClick={handleAddressSearch}
                disabled={!address.trim() || isSearching}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center shadow-lg disabled:shadow-none"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </motion.button>
            </div>
            
            <p className="text-xs text-slate-500 mt-2">
              Ou cliquez directement sur la carte pour sélectionner l'emplacement
            </p>
          </div>
          
          {data.location && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-800">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <div>
                    <span className="font-semibold">Localisation sélectionnée</span>
                    <p className="text-sm">{data.location.address}</p>
                  </div>
                </div>
                <button
                  onClick={handleClearLocation}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              Comment sélectionner l'emplacement
            </h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• <strong>Cliquez</strong> sur la carte pour placer le marqueur</li>
              <li>• <strong>Glissez-déposez</strong> pour naviguer sur la carte</li>
              <li>• Ou <strong>recherchez</strong> une adresse précise</li>
            </ul>
          </div>
        </div>
        
        {/* Carte interactive */}
        <div className="h-96 lg:h-full min-h-[400px]">
          <InteractiveMap 
            location={data.location} 
            onLocationSelect={handleMapLocationSelect}
            className="h-full"
          />
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
        {/* État du bien */}
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
        
        {/* Équipements */}
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
        {/* Récapitulatif détaillé */}
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
                <p className="font-semibold">{data.surface} m²</p>
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
        
        {/* Équipements et état */}
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
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${feature!.color}`}
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
              Votre bien sera analysé selon les critères du marché immobilier local
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
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span>Obtenir mon estimation</span>
        </motion.button>
      </div>
    </div>
  );
}