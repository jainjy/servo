// data/automobileData.ts

import { 
  Wrench, 
  ClipboardCheck, 
  Paintbrush,
  Car 
} from "lucide-react";

export const mainServices = [
  {
    id: 1,
    title: "Réparation Mécanique",
    icon: Wrench,
    description: "Diagnostic et réparation de tous types de pannes",
    color: "from-blue-500 to-blue-600",
    features: [
      "Moteur et transmission",
      "Freinage et suspension",
      "Direction et embrayage"
    ],
    image: "https://i.pinimg.com/736x/2b/bb/6c/2bbb6cc83b6282bb973fdcf4549fa4a2.jpg"
  },

  {
    id: 2,
    title: "Contrôle Technique",
    icon: ClipboardCheck,
    description: "Préparation et vérification complète avant contrôle",
    color: "from-green-500 to-green-600",
    features: [
      "Vérification des freins",
      "Contrôle des émissions",
      "Inspection sécurité complète",
      "Pré-contrôle technique"
    ],
    image: "https://i.pinimg.com/1200x/57/cf/45/57cf4552aa06872ea57c2394badf427a.jpg"
  },

  {
    id: 3,
    title: "Peinture Automobile",
    icon: Paintbrush,
    description: "Rénovation et peinture complète ou partielle",
    color: "from-purple-500 to-purple-600",
    features: [
      "Retouche carrosserie",
      "Peinture complète",
      "Polissage professionnel",
      "Protection vernis"
    ],
    image: "https://i.pinimg.com/736x/7b/97/f1/7b97f1a701559036275799affa544dc6.jpg"
  }
];