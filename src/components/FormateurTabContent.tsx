import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InterestSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  price?: string;
  items: string[];
}

// Données synchronisées avec les Cours & Formations existants du projet
const INTERESTS_SECTIONS: InterestSection[] = [
  {
    id: "cuisine",
    title: "Cours de Cuisine",
    icon: "/domicile/cuisine.gif",
    color: "bg-orange-100 border-orange-300",
    description: "Cours de cuisine à domicile - Apprenez les secrets culinaires",
    price: "129€/session",
    items: ["Cuisine française", "Pâtisserie", "Cuisine asiatique", "Cuisine végétale", "Gastronomie", "Boulangerie"]
  },
  {
    id: "decoration",
    title: "Cours de Décoration",
    icon: "/domicile/decoration.gif",
    color: "bg-pink-100 border-pink-300",
    description: "Formation à la décoration d'intérieur et stylisme",
    price: "99€/session",
    items: ["Design d'intérieur", "Couleurs & Harmonie", "Mobilier", "Accessoires", "Espaces extérieurs", "Home staging"]
  },
  {
    id: "bricolage",
    title: "Ateliers Bricolage",
    icon: "/domicile/atelier.gif",
    color: "bg-blue-100 border-blue-300",
    description: "Apprenez les bases du bricolage et petits travaux",
    price: "79€/session",
    items: ["Menuiserie", "Électricité basique", "Plomberie", "Assemblage meubles", "Réparations", "Outils & techniques"]
  },
  {
    id: "jardinage",
    title: "Formation Jardinage",
    icon: "/domicile/jardinnage.gif",
    color: "bg-green-100 border-green-300",
    description: "Maîtrisez l'art du jardinage et l'entretien des plantes",
    price: "89€/session",
    items: ["Plantes d'intérieur", "Jardinage potager", "Paysagisme", "Entretien gazon", "Arbustes & fleurs", "Compostage"]
  },
  {
    id: "feng-shui",
    title: "Feng Shui & Harmonie",
    icon: "/domicile/harmony.gif",
    color: "bg-purple-100 border-purple-300",
    description: "Créez l'harmonie dans votre maison avec le Feng Shui",
    price: "159€/session",
    items: ["Principes Feng Shui", "Aménagement d'espaces", "Énergie du foyer", "Balancing", "Harmonie couleurs", "Méditation"]
  },
  {
    id: "upcycling",
    title: "Recyclage Créatif",
    icon: "/domicile/recyclage.gif",
    color: "bg-cyan-100 border-cyan-300",
    description: "Transformez vos objets en créations uniques",
    price: "89€/session",
    items: ["Upcycling meubles", "DIY décoration", "Textiles récyclés", "Artisanat créatif", "Peinture customisation", "Création art"]
  },
  {
    id: "domotique",
    title: "Formation Domotique",
    icon: "/domicile/domotique.png",
    color: "bg-indigo-100 border-indigo-300",
    description: "Transformez votre maison en habitation intelligente",
    price: "199€/session",
    items: ["Smart Home basics", "Éclairage connecté", "Chauffage intelligent", "Sécurité domotique", "Contrôle vocal", "Applications mobiles"]
  },
  {
    id: "design-salon",
    title: "Design & Aménagement",
    icon: "/domicile/design.gif",
    color: "bg-yellow-100 border-yellow-300",
    description: "Services de design sur mesure pour tous vos espaces",
    price: "Sur devis",
    items: ["Design Salon", "Cuisine", "Chambres", "Salle de bain", "Bureau professionnel", "Espaces extérieurs"]
  },
  {
    id: "musique",
    title: "Cours de Musique",
    icon: "/domicile/music.gif",
    color: "bg-rose-100 border-rose-300",
    description: "Apprentissage d'instruments et technique musicale",
    price: "À partir de 60€",
    items: ["Guitare", "Piano", "Chant", "Violon", "Batterie", "Théorie musicale"]
  },
  {
    id: "fitness",
    title: "Sport & Fitness",
    icon: "/domicile/sport.gif",
    color: "bg-sky-100 border-sky-300",
    description: "Entraînement personnalisé à domicile",
    price: "À partir de 50€",
    items: ["Yoga", "Pilates", "Fitness", "Musculation", "Cardio", "Stretching"]
  }
];

interface InterestSectionProps {
  section: InterestSection;
  onSelectItem?: (sectionTitle: string, item: string, price?: string) => void;
}

const InterestCard: React.FC<InterestSectionProps> = ({ section, onSelectItem }) => {
  return (
    <Card className={`border-2 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 ${section.color}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="h-20 w-20 rounded-full ring-2 ring-black/50 grid place-items-center overflow-hidden">
          <img src={section.icon} alt="" className="w-16 h-16" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{section.title}</h3>
          <p className="text-sm text-gray-700">{section.description}</p>
          {section.price && (
            <p className="text-xs font-semibold text-gray-600 mt-2 bg-white/50 w-fit px-2 py-1 rounded">
              {section.price}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-white">
        {section.items.map((item, idx) => (
          <Badge
            key={idx}
            className="bg-white text-gray-900 hover:bg-gray-100 cursor-pointer border border-gray-300 transition-all duration-200"
            onClick={() => onSelectItem?.(section.title, item, section.price)}
          >
            {item}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

interface FormateurTabContentProps {
  onSelectCourse?: (category: string, course: string, price?: string) => void;
}

const FormateurTabContent: React.FC<FormateurTabContentProps> = ({ onSelectCourse }) => {
  return (
    <div className="mb-20">
      <div className="mb-12">
        <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 dark:text-foreground">
          Découvrez nos cours à domicile
        </h2>
        <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
          Des formations personnalisées dans le confort de votre maison. Nos experts se déplacent chez vous avec tout le matériel nécessaire pour des séances adaptées à vos objectifs et votre emploi du temps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {INTERESTS_SECTIONS.map((section, index) => (
          <div key={section.id} className="transform transition-all duration-300">
            <InterestCard
              section={section}
              onSelectItem={(category, item, price) => {
                console.log(`Formation sélectionnée: ${category} - ${item}${price ? ` (${price})` : ''}`);
                onSelectCourse?.(category, item, price);
              }}
            />
          </div>
        ))}
      </div>

      {/* Section de recommandation */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Formation sur Mesure</h3>
        <p className="text-gray-700 mb-6">
          Vous recherchez une formation spécifique qui n'est pas listée ? Nos formateurs certifiés peuvent créer des séances 100% personnalisées adaptées à vos besoins, votre niveau et vos objectifs. Contactez-nous pour discuter de votre projet de formation !
        </p>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
          Demander une formation personnalisée
        </button>
      </div>
    </div>
  );
};

export default FormateurTabContent;
