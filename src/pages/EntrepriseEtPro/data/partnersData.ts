export interface PartenaireLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Partenaire {
  id: number;
  nom: string;
  description: string;
  rating: number;
  projets: number;
  badge: string;
  badgeColor: string;
  location: PartenaireLocation;
}

export const partenaires: Partenaire[] = [
  {
    id: 1,
    nom: "ARCHITECTES",
    description: "Conception et plans de construction",
    rating: 4.8,
    projets: 127,
    badge: "Premium",
    badgeColor: "#D4AF37", // Gold
    location: { lat: 48.8566, lng: 2.3522, address: "Paris, France" },
  },
  {
    id: 2,
    nom: "CONSTRUCTEUR",
    description: "Construction de maisons neuves",
    rating: 4.6,
    projets: 89,
    badge: "Recommandé",
    badgeColor: "#6B8E23", // primaryDark (Sruvol)
    location: { lat: 45.764, lng: 4.8357, address: "Lyon, France" },
  },
  {
    id: 3,
    nom: "ÉLECTRICIEN",
    description: "Installation et dépannage électrique",
    rating: 4.9,
    projets: 203,
    badge: "Expert",
    badgeColor: "#8B4513", // secondaryText (Saddle brown)
    location: { lat: 43.7102, lng: 7.262, address: "Nice, France" },
  },
  {
    id: 4,
    nom: "ASSURANCE",
    description: "Assurance habitation et prêt",
    rating: 4.7,
    projets: 156,
    badge: "Partenaire Or",
    badgeColor: "#D4AF37", // Gold
    location: { lat: 44.8378, lng: -0.5792, address: "Bordeaux, France" },
  },
];