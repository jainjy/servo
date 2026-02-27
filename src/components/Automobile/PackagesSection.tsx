// components/automobile/PackagesSection.tsx

import { Package } from "./types";
import { CheckCircle } from "lucide-react";

interface Props {
  onBook: () => void;
}

const packages: Package[] = [
  {
    name: "Basique",
    price: "49€",
    description: "Entretien essentiel",
    features: ["Vidange", "Contrôle freins", "Diagnostic rapide"],
    color: "#6B8E23",
    popular: false,
  },
  {
    name: "Premium",
    price: "99€",
    description: "Révision complète",
    features: [
      "Tout du basique",
      "Filtre à air",
      "Vérification suspension",
      "Niveau de liquides",
      "Test batterie",
    ],
    color: "#6B8E23",
    popular: true,
  },
];

export default function PackagesSection({ onBook }: Props) {
  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Nos Forfaits</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Des formules adaptées à tous vos besoins d'entretien automobile
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {packages.map((pack, index) => (
          <div
            key={index}
            className={`rounded-2xl p-8 shadow-xl relative transition duration-300 hover:-translate-y-2 ${
              pack.popular ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{ 
              borderColor: pack.popular ? '#6B8E23' : '#e5e7eb',
              borderWidth: pack.popular ? '2px' : '1px',
              borderStyle: 'solid',
              backgroundColor: pack.popular ? '#f9fff9' : 'white'
            }}
          >
            {pack.popular && (
              <span 
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs px-4 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#6B8E23' }}
              >
                Plus populaire
              </span>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
              <div className="flex items-end justify-center gap-1">
                <span className="text-4xl font-bold" style={{ color: '#6B8E23' }}>
                  {pack.price}
                </span>
                <span className="text-gray-500 text-sm mb-1">/forfait</span>
              </div>
              <p className="text-gray-600 mt-2">{pack.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {pack.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#6B8E23' }} />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onBook}
              className="w-full py-3 rounded-xl font-medium transition duration-300 hover:opacity-90 text-white"
              style={{ backgroundColor: '#6B8E23' }}
            >
              Réserver ce forfait
            </button>

            {!pack.popular && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Sans engagement
              </p>
            )}
          </div>
        ))}
      </div>

   
    </section>
  );
}