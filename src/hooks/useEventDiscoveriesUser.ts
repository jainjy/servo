// hooks/useEventsDiscoveriesUser.ts
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";

export interface UserEventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  city?: string;
  postalCode?: string;
  category: string;
  subCategory?: string;
  capacity: number;
  participants: number;
  price: number;
  discountPrice?: number;
  currency: string;
  image: string;
  images: string[];
  featured: boolean;
  status: 'draft' | 'active' | 'upcoming' | 'completed' | 'archived' | 'published';
  organizer: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  tags: string[];
  highlights: string[];
  duration?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  includes: string[];
  notIncludes: string[];
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface UserDiscoveryItem {
  id: number;
  title: string;
  description: string;
  type: string;
  location: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration?: string;
  rating: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived' | 'active';
  organizer?: string;
  image: string;
  tags: string[];
  highlights: string[];
  price?: number;
  currency: string;
  coordinates?: { lat: number; lng: number };
  visits: number;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface Stats {
  totalEvents: number;
  totalDiscoveries: number;
  activeEvents: number;
  upcomingEvents: number;
  avgRating: number;
  totalParticipants: number;
  totalVisits: number;
}

export const useEventsDiscoveriesUser = () => {
  const [events, setEvents] = useState<UserEventItem[]>([]);
  const [discoveries, setDiscoveries] = useState<UserDiscoveryItem[]>([]);
  const [loading, setLoading] = useState({
    events: false,
    discoveries: false,
    stats: false
  });
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalDiscoveries: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    avgRating: 4.5,
    totalParticipants: 0,
    totalVisits: 0
  });

  // Référence pour éviter les re-rendus inutiles
  const hasFetched = useRef(false);

  // Formater un événement pour l'interface utilisateur
  const formatEventForUI = useCallback((event: any): UserEventItem => {
    // Extraire le temps du champ time
    let timeDisplay = '';
    if (event.time) {
      timeDisplay = event.time;
    } else if (event.startTime && event.endTime) {
      timeDisplay = `${event.startTime} - ${event.endTime}`;
    }

    // Formater la date pour l'affichage
    let displayDate = event.date;
    try {
      if (event.date) {
        const date = new Date(event.date);
        if (!isNaN(date.getTime())) {
          displayDate = date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        }
      }
    } catch (e) {
      console.error('Erreur format date:', e);
    }

    // Déterminer le statut
    const status = (event.status || 'draft').toLowerCase();

    return {
      id: event.id,
      title: event.title || 'Événement sans titre',
      description: event.description || '',
      date: displayDate,
      time: timeDisplay,
      location: event.location || 'Non spécifié',
      address: event.address,
      city: event.city,
      postalCode: event.postalCode,
      category: event.category || 'Autre',
      subCategory: event.subCategory,
      capacity: event.capacity || 0,
      participants: event.participants || 0,
      price: event.price || 0,
      discountPrice: event.discountPrice,
      currency: event.currency || 'EUR',
      image: event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800',
      images: Array.isArray(event.images) ? event.images : [],
      featured: event.featured || false,
      status: status as any,
      organizer: event.organizer || event.user?.firstName + ' ' + event.user?.lastName || 'Organisateur',
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      website: event.website,
      tags: Array.isArray(event.tags) ? event.tags : [],
      highlights: Array.isArray(event.highlights) ? event.highlights : [],
      duration: event.duration,
      difficulty: (event.difficulty?.toLowerCase() || 'medium') as 'easy' | 'medium' | 'hard',
      includes: Array.isArray(event.includes) ? event.includes : [],
      notIncludes: Array.isArray(event.notIncludes) ? event.notIncludes : [],
      user: event.user
    };
  }, []);

  // Formater une découverte pour l'interface utilisateur
  const formatDiscoveryForUI = useCallback((discovery: any): UserDiscoveryItem => {
    const status = (discovery.status || 'draft').toLowerCase();

    return {
      id: discovery.id,
      title: discovery.title || 'Découverte sans titre',
      description: discovery.description || '',
      type: discovery.type || 'Lieu secret',
      location: discovery.location || 'Non spécifié',
      difficulty: (discovery.difficulty?.toLowerCase() || 'medium') as 'easy' | 'medium' | 'hard',
      duration: discovery.duration,
      rating: discovery.rating || 0,
      featured: discovery.featured || false,
      status: status as any,
      organizer: discovery.organizer || discovery.user?.firstName + ' ' + discovery.user?.lastName,
      image: discovery.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800',
      tags: Array.isArray(discovery.tags) ? discovery.tags : [],
      highlights: Array.isArray(discovery.highlights) ? discovery.highlights : [],
      price: discovery.price,
      currency: discovery.currency || 'EUR',
      coordinates: discovery.coordinates,
      visits: discovery.visits || 0,
      user: discovery.user
    };
  }, []);

  // Fonction pour calculer les stats
  const calculateStats = useCallback((eventsData: UserEventItem[], discoveriesData: UserDiscoveryItem[]) => {
    console.log("📊 Calcul des statistiques...");
    
    const totalEvents = eventsData.length;
    const totalDiscoveries = discoveriesData.length;
    const activeEvents = eventsData.filter(e => e.status === 'active').length;
    const upcomingEvents = eventsData.filter(e => e.status === 'upcoming').length;
    
    const avgRating = discoveriesData.length > 0 
      ? discoveriesData.reduce((sum, d) => sum + (d.rating || 0), 0) / discoveriesData.length 
      : 4.5;
    
    const totalParticipants = eventsData.reduce((sum, e) => sum + (e.participants || 0), 0);
    const totalVisits = discoveriesData.reduce((sum, d) => sum + (d.visits || 0), 0);
    
    const newStats: Stats = {
      totalEvents,
      totalDiscoveries,
      activeEvents,
      upcomingEvents,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalParticipants,
      totalVisits
    };
    
    console.log("📊 Stats calculées:", newStats);
    setStats(newStats);
  }, []);

  // Charger les événements
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      console.log("🔄 Chargement des événements...");
      
      const response = await api.get("/event");
      
      console.log("✅ Réponse événements:", response.data);
      
      if (response.data) {
        let eventsData = response.data.data || response.data;
        
        if (!Array.isArray(eventsData)) {
          eventsData = [];
        }
        
        // Filtrer seulement les événements actifs/published
        const activeEvents = eventsData.filter((event: any) => {
          const status = (event.status || '').toLowerCase();
          return ['active', 'published', 'upcoming'].includes(status);
        });
        
        const formattedEvents = activeEvents.map(formatEventForUI);
        setEvents(formattedEvents);
        console.log(`🎯 ${formattedEvents.length} événements chargés`);
        setError(null);
        return formattedEvents;
      }
      return [];
    } catch (error: any) {
      console.error("❌ Erreur chargement événements:", error.message);
      setError("Impossible de charger les événements pour le moment");
      setEvents([]);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  }, [formatEventForUI]);

  // Charger les découvertes
  const fetchDiscoveries = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, discoveries: true }));
      console.log("🔄 Chargement des découvertes...");
      
      const response = await api.get("/discoveries");
      
      console.log("✅ Réponse découvertes:", response.data);
      
      if (response.data) {
        let discoveriesData = response.data.data || response.data;
        
        if (!Array.isArray(discoveriesData)) {
          discoveriesData = [];
        }
        
        // Filtrer seulement les découvertes publiées/actives
        const activeDiscoveries = discoveriesData.filter((discovery: any) => {
          const status = (discovery.status || '').toLowerCase();
          return ['published', 'active'].includes(status);
        });
        
        const formattedDiscoveries = activeDiscoveries.map(formatDiscoveryForUI);
        setDiscoveries(formattedDiscoveries);
        console.log(`🎯 ${formattedDiscoveries.length} découvertes chargées`);
        setError(null);
        return formattedDiscoveries;
      }
      return [];
    } catch (error: any) {
      console.error("❌ Erreur chargement découvertes:", error.message);
      setError("Impossible de charger les découvertes pour le moment");
      setDiscoveries([]);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, discoveries: false }));
    }
  }, [formatDiscoveryForUI]);

  // Charger toutes les données
  const fetchAllData = useCallback(async () => {
    if (hasFetched.current) {
      console.log("⏭️ Données déjà chargées, skip...");
      return;
    }
    
    console.log("🚀 Début du chargement des données...");
    hasFetched.current = true;
    
    try {
      // Charger les deux en parallèle
      const [eventsData, discoveriesData] = await Promise.all([
        fetchEvents(),
        fetchDiscoveries()
      ]);
      
      // Calculer les stats après le chargement
      calculateStats(eventsData, discoveriesData);
      console.log("✅ Données chargées avec succès");
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error);
    }
  }, [fetchEvents, fetchDiscoveries, calculateStats]);

  // Charger les données au montage - UNE SEULE FOIS
  useEffect(() => {
    console.log("🏁 Mount: Début du chargement initial");
    fetchAllData();
    
    // Cleanup function
    return () => {
      console.log("🧹 Cleanup: Reset hasFetched");
      hasFetched.current = false;
    };
  }, [fetchAllData]);

  // Fonctions utilitaires - sans dépendances pour éviter les re-rendus
  const getEventSpotsInfo = useCallback((event: UserEventItem) => {
    const capacity = event.capacity || 0;
    const participants = event.participants || 0;
    const available = Math.max(0, capacity - participants);
    const percentage = capacity > 0 ? (participants / capacity) * 100 : 0;
    
    return {
      total: capacity,
      booked: participants,
      available,
      percentage: Math.round(percentage)
    };
  }, []);

  const getDifficultyLabel = useCallback((difficulty?: string): string => {
    const difficultyMap: Record<string, string> = {
      'easy': 'Facile',
      'medium': 'Moyen',
      'hard': 'Difficile'
    };
    return difficultyMap[difficulty || 'medium'] || 'Moyen';
  }, []);

  const getStatusLabel = useCallback((status: string): string => {
    const statusMap: Record<string, string> = {
      'draft': 'Brouillon',
      'active': 'Actif',
      'upcoming': 'À venir',
      'published': 'Publié',
      'completed': 'Terminé',
      'archived': 'Archivé'
    };
    return statusMap[status] || status;
  }, []);

  // Rafraîchir les données manuellement
  const refreshData = useCallback(() => {
    console.log("🔄 Rafraîchissement manuel des données");
    hasFetched.current = false;
    setEvents([]);
    setDiscoveries([]);
    setError(null);
    fetchAllData();
  }, [fetchAllData]);

  return {
    // Données
    events,
    discoveries,
    featuredEvents: events.filter(e => e.featured).slice(0, 4),
    featuredDiscoveries: discoveries.filter(d => d.featured).slice(0, 4),
    stats,
    loading,
    error,
    
    // Fonctions utilitaires
    getEventSpotsInfo,
    getDifficultyLabel,
    getStatusLabel,
    
    // Actions
    refreshData,
    
    // Formateurs (optionnel)
    formatEventForUI,
    formatDiscoveryForUI
  };
};