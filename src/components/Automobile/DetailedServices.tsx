// components/automobile/DetailedServices.tsx

import { Car, Gauge, Wrench, Shield, Droplet, Thermometer } from "lucide-react";

const detailedServices = [
  {
    icon: Gauge,
    title: "Diagnostic Électronique",
    description: "Analyse complète via valise professionnelle pour détecter rapidement les anomalies du véhicule.",
    features: ["Lecture des codes défauts", "Analyse en temps réel", "Rapport détaillé"]
  },
  {
    icon: Droplet,
    title: "Révision Complète",
    description: "Vidange, filtres, contrôle sécurité et vérification globale de votre véhicule.",
    features: ["Vidange moteur", "Remplacement filtres", "Contrôle niveaux"]
  },
  {
    icon: Wrench,
    title: "Entretien Courant",
    description: "Maintenance régulière pour préserver les performances et la longévité de votre véhicule.",
    features: ["Pneus & freins", "Courroies", "Batterie"]
  },
  {
    icon: Shield,
    title: "Contrôle Technique",
    description: "Préparation et vérification avant contrôle technique obligatoire.",
    features: ["Pré-contrôle", "Mises aux normes", "Accompagnement"]
  },
  {
    icon: Car,
    title: "Carrosserie & Peinture",
    description: "Réparation des chocs, rayures et remise en état esthétique complète.",
    features: ["Débosselage", "Peinture sur mesure", "Polissage"]
  },
  {
    icon: Thermometer,
    title: "Climatisation",
    description: "Entretien et réparation du système de climatisation automobile.",
    features: ["Recharge gaz", "Détection fuites", "Désinfection"]
  }
];

export default function DetailedServices() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Services Détaillés</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des prestations complètes pour l'entretien et la réparation de tous les véhicules
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailedServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 group"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"
                  style={{ backgroundColor: '#6B8E23', opacity: 0.1 }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#6B8E23' }} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#6B8E23' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button 
                    className="text-sm font-medium hover:gap-2 transition-all flex items-center"
                    style={{ color: '#6B8E23' }}
                  >
                    Plus de détails
                    <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}