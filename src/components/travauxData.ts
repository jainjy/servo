import img from "@/components/../assets/house.jpg";
import img1 from "@/components/../assets/property-2.jpg";

export const prestationsData = {
  interieurs: [
    {
      id: 1,
      title: "RÉNOVATION COMPLÈTE SALLE DE BAINS AVEC DOUCHE À L'ITALIENNE",
      type: "salle-de-bains",
      description: "Transformation complète avec matériaux haut de gamme",
      location: "Saint-Pierre",
      images: [img, img1, img, img1, img],
      favorite: false,
      rating: 4.7,
      views: 89,
      features: ["Carrelage grand format", "Meuble vasque", "Miroir éclairé"],
      price: "4 500 €"
    },
    {
      id: 2,
      title: "CUISINE ÉQUIPÉE SUR MESURE AVEC ÎLOT CENTRAL",
      type: "cuisine",
      description: "Cuisine moderne avec électroménagers intégrés",
      location: "Saint-Denis",
      images: [img1, img, img1, img],
      favorite: false,
      rating: 4.5,
      views: 124,
      features: ["Plan de travail quartz", "Éclairage LED", "Rangement optimisé"],
      price: "8 200 €"
    },
    {
      id: 3,
      title: "POSE DE PARQUET MASSIF CHÊNE 5 CÔTÉS",
      type: "revêtement-sol",
      description: "Pose artisanale de parquet authentique",
      location: "Saint-Gilles-les-Bains",
      images: [img, img1],
      favorite: false,
      rating: 4.9,
      views: 67,
      features: ["Traitement anti-humidité", "Finition naturelle", "Garantie 10 ans"],
      price: "3 800 €"
    },
    {
      id: 4,
      title: "DÉCORATION D'INTÉRIEUR STYLE CONTEMPORAIN",
      type: "decoration",
      description: "Harmonisation des espaces et choix du mobilier",
      location: "Saint-Leu",
      images: [img1, img],
      favorite: false,
      rating: 4.6,
      views: 156,
      features: ["Éclairage scénographique", "Textures naturelles", "Sur-mesure"],
      price: "2 900 €"
    }
  ],
  exterieurs: [
    {
      id: 5,
      title: "PORTAL EN BOIS MASSIF AVEC OUVRANT AUTOMATIQUE",
      type: "portal",
      description: "Portail sur mesure avec motorisation intégrée",
      location: "Saint-Paul",
      images: [img, img1, img],
      favorite: false,
      rating: 4.8,
      views: 203,
      features: ["Bois traité autoclave", "Motorisation silencieuse", "Télécommande"],
      price: "2 200 €"
    },
    {
      id: 6,
      title: "PERGOLA BIOCLIMATIQUE AVEC TOIT ORIENTABLE",
      type: "pergola",
      description: "Espace extérieur couvert et modulable",
      location: "Saint-André",
      images: [img1, img],
      favorite: false,
      rating: 4.4,
      views: 98,
      features: ["Lames orientables", "Éclairage LED", "Drainage intégré"],
      price: "6 500 €"
    },
    {
      id: 7,
      title: "PISCINE ENTRETIEN AVEC SYSTÈME DE FILTRATION",
      type: "piscine",
      description: "Maintenance et entretien de piscine professionnel",
      location: "Saint-Gilles-les-Bains",
      images: [img, img1, img1],
      favorite: false,
      rating: 4.7,
      views: 145,
      features: ["Nettoyage automatique", "Analyse eau", "Hivernage"],
      price: "1 200 €/an"
    },
    {
      id: 8,
      title: "AMÉNAGEMENT PAYSAGER ET DÉCORATION EXTÉRIEURE",
      type: "decoration",
      description: "Création d'espaces verts et décoration de jardin",
      location: "Saint-Pierre",
      images: [img1, img, img1],
      favorite: false,
      rating: 4.6,
      views: 112,
      features: ["Plantation", "Éclairage extérieur", "Mobilier jardin"],
      price: "3 500 €"
    }
  ],
  constructions: [
    {
      id: 9,
      title: "PLAN ET PERMIS DE CONSTRUIRE",
      type: "plan-permis",
      description: "Étude complète et démarches administratives",
      location: "Saint-Denis",
      images: [img, img1],
      favorite: false,
      rating: 4.9,
      views: 156,
      features: ["Plans architecte", "Dépôt en mairie", "Suivi administratif"],
      step: "1/3",
      price: "À partir de 3 000 €"
    },
    {
      id: 10,
      title: "VIABILISATION ET BORNAGE",
      type: "viabilisation",
      description: "Préparation du terrain et raccordements",
      location: "Saint-Pierre",
      images: [img1, img],
      favorite: false,
      rating: 4.7,
      views: 134,
      features: ["Raccordement eau/électricité", "Délimitation terrain", "Nivellement"],
      step: "1/3",
      price: "À partir de 5 000 €"
    },
    {
      id: 11,
      title: "CONSTRUCTION MAISON INDIVIDUELLE",
      type: "construction",
      description: "Réalisation clé en main de votre projet",
      location: "Saint-Leu",
      images: [img, img1, img],
      favorite: false,
      rating: 4.8,
      views: 278,
      features: ["Fondations", "Gros œuvre", "Second œuvre"],
      step: "1/3",
      price: "À partir de 120 000 €"
    },
    {
      id: 12,
      title: "SUIVI ET ACCOMPAGNEMENT",
      type: "suivi",
      description: "Accompagnement personnalisé jusqu'à la livraison",
      location: "Saint-Paul",
      images: [img1, img, img1],
      favorite: false,
      rating: 4.9,
      views: 189,
      features: ["Point régulier", "Respect délais", "Garantie décennale"],
      step: "1/3",
      price: "Sur devis"
    }
  ]
};

export const prestationTypesByCategory = {
  interieurs: [
    { value: "salle-de-bains", label: "SALLE DE BAINS" },
    { value: "cuisine", label: "CUISINE" },
    { value: "revêtement-sol", label: "REVÊTEMENT SOL" },
    { value: "decoration", label: "DÉCORATION" },
  ],
  exterieurs: [
    { value: "portal", label: "PORTAL" },
    { value: "pergola", label: "PERGOLA" },
    { value: "piscine", label: "PISCINE" },
    { value: "decoration", label: "DÉCORATION" },
  ],
  constructions: [
    { value: "plan-permis", label: "PLAN ET PERMIS" },
    { value: "viabilisation", label: "VIABILISATION" },
    { value: "construction", label: "CONSTRUCTION" },
    { value: "suivi", label: "SUIVI" },
  ]
};

export default null;
