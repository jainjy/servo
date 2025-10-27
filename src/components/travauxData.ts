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
      images: ['https://i.pinimg.com/736x/af/61/6c/af616cdce916c42353407fd65d6064c2.jpg', 
        'https://i.pinimg.com/1200x/98/f3/ed/98f3ed8e017a3162823086c51642db78.jpg', 
        'https://i.pinimg.com/1200x/bb/dc/8d/bbdc8de36a73c6800b04fadbed6f3ed3.jpg', 
        'https://i.pinimg.com/1200x/17/c2/2f/17c22fa069c581035a043ffcdab2525f.jpg',
         'https://i.pinimg.com/736x/8b/03/98/8b0398ab087974722e1880d92acdee03.jpg'],
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
      images: ['https://i.pinimg.com/736x/55/45/a1/5545a1c91c0fdbe63c2151c5117c5172.jpg',
         'https://i.pinimg.com/736x/41/0e/39/410e39dd7a593e3fc8e670c97e47a340.jpg', 
         'https://i.pinimg.com/1200x/ab/c0/17/abc0173e2ab8c60071a45958d91ca057.jpg',
          'https://i.pinimg.com/736x/ef/2d/21/ef2d218516e1bc0586150815bbac8bc0.jpg'],
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
      images: ['https://i.pinimg.com/1200x/d4/3b/18/d43b18f29cd72788705b2c79a6d12e6e.jpg', 
        'https://i.pinimg.com/736x/5a/b3/60/5ab360278297d9371154dd570adb3090.jpg'],
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
      images: ['https://i.pinimg.com/736x/e8/5d/53/e85d537af37d5391433ca7de7fd2af81.jpg',
      'https://i.pinimg.com/1200x/64/7e/69/647e693b7d19e9d8ef970b5654b1a22a.jpg',
      'https://i.pinimg.com/736x/ea/dd/90/eadd903aa801ae7c84c4f994c3cbf658.jpg'   
      ],
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
      images: ['https://i.pinimg.com/1200x/b3/76/e5/b376e504f26effcecfb300991f18fdb4.jpg', 
        'https://i.pinimg.com/736x/89/8c/d1/898cd12ab9d1bfd22fb0d3beb85f16f6.jpg', 
        'https://i.pinimg.com/1200x/ee/17/71/ee1771cff42b2c2d0cfc5cc41f316de0.jpg'],
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
      images: ['https://i.pinimg.com/1200x/dc/d7/81/dcd7819abe212b54a9d2f218fd00ccf4.jpg', 
        'https://i.pinimg.com/736x/75/f8/0d/75f80d5d5828045828bd294c057e7f7a.jpg'],
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
      images: ['https://i.pinimg.com/1200x/20/b1/9f/20b19fc47269a819548610197a88809a.jpg', 
        'https://i.pinimg.com/1200x/ae/42/af/ae42afb19800b89047481039ac03e5a4.jpg', 
        'https://i.pinimg.com/1200x/b7/97/5a/b7975a023fc225fde501540d0441954f.jpg'],
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
      images: ['https://i.pinimg.com/1200x/30/8b/74/308b743191192f5238909d0a9b2d35a9.jpg', 
        'https://i.pinimg.com/736x/9c/00/ac/9c00acfba3ba629c32ec290f87e64dc6.jpg', 
        'https://i.pinimg.com/736x/31/c4/b9/31c4b99dcfd430891bd09da8ebf61c2a.jpg'],
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
      images: ['https://i.pinimg.com/736x/60/be/d4/60bed477dbb30bc1157b852fa74fb9d8.jpg',
         'https://i.pinimg.com/736x/16/cd/31/16cd31d2b0d244dc724f5dd90e1a88b0.jpg'],
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
      images: ['https://i.pinimg.com/1200x/80/dc/6c/80dc6c0351875df672551988f935a130.jpg',
         'https://i.pinimg.com/736x/c2/5a/17/c25a17aabfba274f33008516668cf9a4.jpg'],
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
      images: ['https://i.pinimg.com/736x/55/2e/ff/552eff3c6e234646844e1b22d2d70c68.jpg', 
        'https://i.pinimg.com/1200x/ea/4f/d5/ea4fd57a0579f426ffdc0d6b00b13d7e.jpg', 
        'https://i.pinimg.com/1200x/5c/18/df/5c18df327dd5c941b78c146ab278b92d.jpg'],
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
      images: ['https://i.pinimg.com/736x/f5/98/ac/f598ac0131ea0dfd87b6d622a060ba7c.jpg'],
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
