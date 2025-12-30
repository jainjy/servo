import { EventItem, DiscoveryItem } from "./types";

export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Atelier Culinaire Premium",
    date: "2024-03-15",
    time: "14:00 - 17:00",
    location: "Saint-Denis, Réunion",
    category: "Cuisine",
    description: "Atelier exclusif avec chef étoilé",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800",
    status: "active",
    participants: 8,
    capacity: 12,
    revenue: 360,
    featured: true,
    organizer: "Votre Entreprise",
    price: 45,
  },
  
];

export const SAMPLE_DISCOVERIES: DiscoveryItem[] = [
  {
    id: 1,
    title: "Les Jardins de la Vanille",
    type: "Lieu secret",
    location: "Saint-Philippe, Réunion",
    description: "Visite exclusive d'un jardin privé de vanille",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800",
    status: "published",
    visits: 124,
    rating: 4.8,
    revenue: 620,
    featured: true,
    tags: ["nature", "jardin", "vanille", "biologique", "visite guidée"],
    difficulty: "easy",
    duration: "2 heures",
    price: 35,
    organizer: "Votre Entreprise",
    coordinates: { lat: -21.358, lng: 55.769 },
    includedServices: ["Guide local", "Dégustation", "Matériel"],
    requirements: ["Chaussures confortables", "Bouteille d'eau"],
    maxVisitors: 15,
    availableDates: ["2024-03-20", "2024-03-25", "2024-03-30"],
  },
  
];

export const STATUS_OPTIONS = {
  events: [
    { value: "all", label: "Tous les statuts" },
    { value: "active", label: "Actif" },
    { value: "upcoming", label: "À venir" },
    { value: "draft", label: "Brouillon" },
    { value: "completed", label: "Terminé" },
  ],
  discoveries: [
    { value: "all", label: "Tous les statuts" },
    { value: "published", label: "Publié" },
    { value: "draft", label: "Brouillon" },
    { value: "archived", label: "Archivé" },
  ],
};