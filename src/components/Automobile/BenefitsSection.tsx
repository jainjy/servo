// components/automobile/BenefitsSection.tsx

import { Shield, Clock, ThumbsUp, Award, Wrench, Sparkles } from "lucide-react";

interface Props {
  onBook: () => void;
}

const benefits = [
  {
    icon: Shield,
    title: "Garantie 12 mois",
    description: "Toutes nos réparations sont garanties pièces et main d'œuvre"
  },
  {
    icon: Clock,
    title: "Intervention rapide",
    description: "Prise en charge sous 24h pour tous vos dépannages"
  },
  {
    icon: ThumbsUp,
    title: "Devis transparent",
    description: "Devis détaillé et gratuit avant toute intervention"
  },
  {
    icon: Award,
    title: "Experts certifiés",
    description: "Équipe de techniciens diplômés et expérimentés"
  },
  {
    icon: Wrench,
    title: "Équipement moderne",
    description: "Matériel de diagnostic dernière génération"
  },
  {
    icon: Sparkles,
    title: "Qualité garantie",
    description: "Pièces d'origine et respect des normes constructeur"
  }
];

export default function BenefitsSection({ onBook }: Props) {
  return (
    <section className="py-20" style={{ backgroundColor: '#6B8E23' }}>
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Expertise certifiée, équipement moderne et transparence totale sur les prix
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onBook}
            className="bg-white px-8 py-4 rounded-xl font-semibold text-lg transition duration-300 hover:shadow-xl hover:scale-105"
            style={{ color: '#6B8E23' }}
          >
            Prendre rendez-vous
          </button>
          <p className="text-white/80 text-sm mt-4">
            ✓ Sans engagement • ✓ Devis gratuit • ✓ Accès facilité
          </p>
        </div>
      </div>
    </section>
  );
}