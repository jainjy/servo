// hooks/useEventsDiscoveries.ts
import { useState, useEffect, useCallback } from "react";
import { EventItem, DiscoveryItem, Stats, ActiveTab, FilterStatus } from "@/components/pro/Evenement&Decouverte/types";
import { filterItems } from "@/components/pro/Evenement&Decouverte/utils";
import api from "@/lib/api";

// Interface pour EventFormData
interface APIEventData {
  id?: number;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  address?: string;
  city?: string;
  postalCode?: string;
  category: string;
  subCategory?: string;
  capacity: number;
  price: number;
  discountPrice?: number;
  currency: string;
  image?: string;
  images?: string[];
  featured: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  tags?: string[];
  requirements?: string;
  highlights?: string[];
  duration?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  targetAudience?: string[];
  includes?: string[];
  notIncludes?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  registrationDeadline?: string;
  earlyBirdDeadline?: string;
  earlyBirdPrice?: number;
  participants?: number;
  revenue?: number;
  userId?: string;
}

// Interface pour DiscoveryFormData
interface APIDiscoveryData {
  id?: number;
  title: string;
  type: string;
  location: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'ACTIVE';
  description?: string;
  price?: number;
  currency?: string;
  duration?: string;
  rating?: number;
  sustainabilityRating?: number;
  featured?: boolean;
  images?: string[];
  tags?: string[];
  highlights?: string[];
  bestSeason?: string[];
  bestTime?: string[];
  equipment?: string[];
  includes?: string[];
  notIncludes?: string[];
  languages?: string[];
  includedServices?: string[];
  requirements?: string[];
  availableDates?: string[];
  coordinates?: { lat: number; lng: number };
  address?: string;
  city?: string;
  postalCode?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  recommendations?: string;
  accessibility?: string;
  safety?: string;
  carbonFootprint?: string;
  maxVisitors?: number;
  groupSizeMin?: number;
  groupSizeMax?: number;
  ageRestrictionMin?: number;
  ageRestrictionMax?: number;
  guideIncluded?: boolean;
  transportIncluded?: boolean;
  mealIncluded?: boolean;
  parkingAvailable?: boolean;
  wifiAvailable?: boolean;
  familyFriendly?: boolean;
  petFriendly?: boolean;
  wheelchairAccessible?: boolean;
  visits?: number;
  revenue?: number;
  userId?: string;
}

export const useEventsDiscoveries = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("events");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalDiscoveries: 0,
    activeEvents: 0,
    totalRevenue: 0,
    upcomingEvents: 0,
    avgRating: 0,
    conversionRate: 0,
    totalParticipants: 0,
    totalVisits: 0,
    popularCategory: "",
  });
  const [loading, setLoading] = useState({
    events: true,
    discoveries: true,
    stats: true
  });
  const [error, setError] = useState<string | null>(null);

  // Fonction pour formater un événement de l'API vers EventItem
  const formatEventFromApi = (event: any): EventItem => {
    const date = new Date(event.date);
    
    let startTime = '';
    let endTime = '';
    
    if (event.startTime && event.endTime) {
      startTime = event.startTime;
      endTime = event.endTime;
    } else if (event.time) {
      const timeParts = event.time.split(' - ');
      startTime = timeParts[0] || '';
      endTime = timeParts[1] || '';
    }
    
    return {
      id: event.id,
      title: event.title,
      date: date.toISOString(),
      time: startTime && endTime ? `${startTime} - ${endTime}` : (startTime || ''),
      location: event.location,
      category: event.category,
      description: event.description || '',
      image: event.image || 'https://via.placeholder.com/300x200',
      status: event.status.toLowerCase() as any,
      participants: event.participants || 0,
      capacity: event.capacity || 0,
      revenue: event.revenue || 0,
      featured: event.featured || false,
      organizer: event.organizer || '',
      price: event.price || 0,
      address: event.address || '',
      city: event.city || '',
      postalCode: event.postalCode || '',
      contactEmail: event.contactEmail || '',
      contactPhone: event.contactPhone || '',
      duration: event.duration || '',
      
      // Nouveaux champs
      currency: event.currency || 'EUR',
      subCategory: event.subCategory,
      discountPrice: event.discountPrice,
      images: event.images || [],
      tags: event.tags || [],
      requirements: event.requirements || '',
      highlights: event.highlights || [],
      difficulty: event.difficulty?.toLowerCase() as "easy" | "medium" | "hard" || undefined,
      targetAudience: event.targetAudience || [],
      includes: event.includes || [],
      notIncludes: event.notIncludes || [],
      cancellationPolicy: event.cancellationPolicy || '',
      refundPolicy: event.refundPolicy || '',
      visibility: event.visibility?.toLowerCase() as any,
      website: event.website || '',
      registrationDeadline: event.registrationDeadline || '',
      earlyBirdDeadline: event.earlyBirdDeadline || '',
      earlyBirdPrice: event.earlyBirdPrice || undefined,
      userId: event.userId
    };
  };

  // Fonction pour formater une découverte de l'API vers DiscoveryItem
  const formatDiscoveryFromApi = (discovery: any): DiscoveryItem => {
    let coordinates = { lat: 0, lng: 0 };
    
    try {
      if (discovery.coordinates) {
        if (typeof discovery.coordinates === 'string') {
          coordinates = JSON.parse(discovery.coordinates);
        } else if (typeof discovery.coordinates === 'object') {
          coordinates = discovery.coordinates;
        }
      }
    } catch (error) {
      console.error('Erreur parsing coordinates:', error);
    }

    // Convertir la difficulté en minuscules pour la compatibilité
    const difficulty = discovery.difficulty ? 
      discovery.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard' : 'medium';

    return {
      id: discovery.id,
      title: discovery.title,
      type: discovery.type,
      location: discovery.location,
      description: discovery.description || '',
      image: discovery.image || 'https://via.placeholder.com/300x200',
      status: discovery.status.toLowerCase(),
      visits: discovery.visits || 0,
      rating: discovery.rating || 0,
      revenue: discovery.revenue || 0,
      featured: discovery.featured || false,
      tags: Array.isArray(discovery.tags) ? discovery.tags : 
            (typeof discovery.tags === 'string' ? JSON.parse(discovery.tags || '[]') : []),
      difficulty,
      duration: discovery.duration || '',
      price: discovery.price || 0,
      organizer: discovery.organizer || '',
      coordinates,
      includedServices: Array.isArray(discovery.includedServices) ? discovery.includedServices : 
                       (typeof discovery.includedServices === 'string' ? JSON.parse(discovery.includedServices || '[]') : []),
      requirements: Array.isArray(discovery.requirements) ? discovery.requirements : 
                    (typeof discovery.requirements === 'string' ? JSON.parse(discovery.requirements || '[]') : []),
      maxVisitors: discovery.maxVisitors || 0,
      availableDates: Array.isArray(discovery.availableDates) ? discovery.availableDates : 
                      (typeof discovery.availableDates === 'string' ? JSON.parse(discovery.availableDates || '[]') : []),
      address: discovery.address || '',
      city: discovery.city || '',
      postalCode: discovery.postalCode || '',
      contactEmail: discovery.contactEmail || '',
      contactPhone: discovery.contactPhone || '',
      website: discovery.website || '',
      highlights: Array.isArray(discovery.highlights) ? discovery.highlights : 
                  (typeof discovery.highlights === 'string' ? JSON.parse(discovery.highlights || '[]') : []),
      recommendations: discovery.recommendations || '',
      bestSeason: Array.isArray(discovery.bestSeason) ? discovery.bestSeason : 
                  (typeof discovery.bestSeason === 'string' ? JSON.parse(discovery.bestSeason || '[]') : []),
      bestTime: Array.isArray(discovery.bestTime) ? discovery.bestTime : 
                (typeof discovery.bestTime === 'string' ? JSON.parse(discovery.bestTime || '[]') : []),
      accessibility: discovery.accessibility || '',
      equipment: Array.isArray(discovery.equipment) ? discovery.equipment : 
                 (typeof discovery.equipment === 'string' ? JSON.parse(discovery.equipment || '[]') : []),
      safety: discovery.safety || '',
      includes: Array.isArray(discovery.includes) ? discovery.includes : 
                (typeof discovery.includes === 'string' ? JSON.parse(discovery.includes || '[]') : []),
      notIncludes: Array.isArray(discovery.notIncludes) ? discovery.notIncludes : 
                   (typeof discovery.notIncludes === 'string' ? JSON.parse(discovery.notIncludes || '[]') : []),
      groupSizeMin: discovery.groupSizeMin || 1,
      groupSizeMax: discovery.groupSizeMax || 10,
      ageRestrictionMin: discovery.ageRestrictionMin || 0,
      ageRestrictionMax: discovery.ageRestrictionMax || 99,
      languages: Array.isArray(discovery.languages) ? discovery.languages : 
                 (typeof discovery.languages === 'string' ? JSON.parse(discovery.languages || '[]') : []),
      guideIncluded: discovery.guideIncluded || false,
      transportIncluded: discovery.transportIncluded || false,
      mealIncluded: discovery.mealIncluded || false,
      parkingAvailable: discovery.parkingAvailable || false,
      wifiAvailable: discovery.wifiAvailable || false,
      familyFriendly: discovery.familyFriendly || false,
      petFriendly: discovery.petFriendly || false,
      wheelchairAccessible: discovery.wheelchairAccessible || false,
      sustainabilityRating: discovery.sustainabilityRating || 0,
      carbonFootprint: discovery.carbonFootprint || '',
      currency: discovery.currency || 'EUR',
      user: discovery.user || null
    };
  };

  // Convertir EventItem en données pour l'API
  const formatEventToApi = (eventItem: EventItem): Partial<APIEventData> => {
    let formattedDate = '';
    try {
      const date = new Date(eventItem.date);
      if (isNaN(date.getTime())) {
        throw new Error("Date invalide");
      }
      formattedDate = date.toISOString().split('T')[0];
    } catch {
      formattedDate = new Date().toISOString().split('T')[0];
    }

    const timeParts = eventItem.time?.split(" - ") || [];
    const startTime = timeParts[0]?.trim() || '';
    const endTime = timeParts[1]?.trim() || undefined;

    const formatOptionalDate = (dateStr?: string): string | undefined => {
      if (!dateStr) return undefined;
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return undefined;
        return date.toISOString().split('T')[0];
      } catch {
        return undefined;
      }
    };

    const apiData: Partial<APIEventData> = {
      title: eventItem.title,
      date: formattedDate,
      location: eventItem.location,
      category: eventItem.category || 'Autre',
      capacity: parseInt(String(eventItem.capacity)) || 0,
      price: parseFloat(String(eventItem.price)) || 0,
      currency: eventItem.currency || 'EUR',
      featured: eventItem.featured || false,
      status: (eventItem.status || 'DRAFT').toUpperCase() as any,
      visibility: (eventItem.visibility || 'PUBLIC').toUpperCase() as any,

      description: eventItem.description || undefined,
      startTime: startTime || undefined,
      endTime: endTime,
      address: eventItem.address || undefined,
      city: eventItem.city || undefined,
      postalCode: eventItem.postalCode || undefined,
      subCategory: eventItem.subCategory || undefined,
      discountPrice: eventItem.discountPrice ? parseFloat(String(eventItem.discountPrice)) : undefined,
      image: eventItem.image || undefined,
      images: eventItem.images?.length ? eventItem.images : undefined,
      organizer: eventItem.organizer || undefined,
      contactEmail: eventItem.contactEmail || undefined,
      contactPhone: eventItem.contactPhone || undefined,
      website: eventItem.website || undefined,
      tags: eventItem.tags?.length ? eventItem.tags : undefined,
      requirements: eventItem.requirements || undefined,
      highlights: eventItem.highlights?.length ? eventItem.highlights : undefined,
      duration: eventItem.duration || undefined,
      difficulty: eventItem.difficulty ? eventItem.difficulty.toUpperCase() as any : undefined,
      targetAudience: eventItem.targetAudience?.length ? eventItem.targetAudience : undefined,
      includes: eventItem.includes?.length ? eventItem.includes : undefined,
      notIncludes: eventItem.notIncludes?.length ? eventItem.notIncludes : undefined,
      cancellationPolicy: eventItem.cancellationPolicy || undefined,
      refundPolicy: eventItem.refundPolicy || undefined,
      registrationDeadline: formatOptionalDate(eventItem.registrationDeadline),
      earlyBirdDeadline: formatOptionalDate(eventItem.earlyBirdDeadline),
      earlyBirdPrice: eventItem.earlyBirdPrice ? parseFloat(String(eventItem.earlyBirdPrice)) : undefined,
    };

    Object.keys(apiData).forEach(key => {
      if (apiData[key as keyof APIEventData] === undefined) {
        delete apiData[key as keyof APIEventData];
      }
    });

    return apiData;
  };

  // Convertir DiscoveryItem en données pour l'API
  const formatDiscoveryToApi = (discoveryItem: DiscoveryItem): Partial<APIDiscoveryData> => {
    const apiData: Partial<APIDiscoveryData> = {
      // Champs requis
      title: discoveryItem.title,
      type: discoveryItem.type,
      location: discoveryItem.location,
      difficulty: discoveryItem.difficulty?.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD' || 'MEDIUM',
      status: (discoveryItem.status || 'DRAFT').toUpperCase() as any,

      // Champs optionnels
      description: discoveryItem.description || undefined,
      price: discoveryItem.price ? parseFloat(String(discoveryItem.price)) : undefined,
      currency: discoveryItem.currency || 'EUR',
      duration: discoveryItem.duration || undefined,
      rating: discoveryItem.rating ? parseFloat(String(discoveryItem.rating)) : undefined,
      sustainabilityRating: discoveryItem.sustainabilityRating ? parseFloat(String(discoveryItem.sustainabilityRating)) : undefined,
      featured: discoveryItem.featured || false,
      images: discoveryItem.images?.length ? discoveryItem.images : undefined,
      tags: discoveryItem.tags?.length ? discoveryItem.tags : undefined,
      highlights: discoveryItem.highlights?.length ? discoveryItem.highlights : undefined,
      bestSeason: discoveryItem.bestSeason?.length ? discoveryItem.bestSeason : undefined,
      bestTime: discoveryItem.bestTime?.length ? discoveryItem.bestTime : undefined,
      equipment: discoveryItem.equipment?.length ? discoveryItem.equipment : undefined,
      includes: discoveryItem.includes?.length ? discoveryItem.includes : undefined,
      notIncludes: discoveryItem.notIncludes?.length ? discoveryItem.notIncludes : undefined,
      languages: discoveryItem.languages?.length ? discoveryItem.languages : undefined,
      includedServices: discoveryItem.includedServices?.length ? discoveryItem.includedServices : undefined,
      requirements: discoveryItem.requirements?.length ? discoveryItem.requirements : undefined,
      availableDates: discoveryItem.availableDates?.length ? discoveryItem.availableDates : undefined,
      coordinates: discoveryItem.coordinates || undefined,
      address: discoveryItem.address || undefined,
      city: discoveryItem.city || undefined,
      postalCode: discoveryItem.postalCode || undefined,
      organizer: discoveryItem.organizer || undefined,
      contactEmail: discoveryItem.contactEmail || undefined,
      contactPhone: discoveryItem.contactPhone || undefined,
      website: discoveryItem.website || undefined,
      recommendations: discoveryItem.recommendations || undefined,
      accessibility: discoveryItem.accessibility || undefined,
      safety: discoveryItem.safety || undefined,
      carbonFootprint: discoveryItem.carbonFootprint || undefined,
      maxVisitors: discoveryItem.maxVisitors ? parseInt(String(discoveryItem.maxVisitors)) : undefined,
      groupSizeMin: discoveryItem.groupSizeMin ? parseInt(String(discoveryItem.groupSizeMin)) : undefined,
      groupSizeMax: discoveryItem.groupSizeMax ? parseInt(String(discoveryItem.groupSizeMax)) : undefined,
      ageRestrictionMin: discoveryItem.ageRestrictionMin ? parseInt(String(discoveryItem.ageRestrictionMin)) : undefined,
      ageRestrictionMax: discoveryItem.ageRestrictionMax ? parseInt(String(discoveryItem.ageRestrictionMax)) : undefined,
      guideIncluded: discoveryItem.guideIncluded,
      transportIncluded: discoveryItem.transportIncluded,
      mealIncluded: discoveryItem.mealIncluded,
      parkingAvailable: discoveryItem.parkingAvailable,
      wifiAvailable: discoveryItem.wifiAvailable,
      familyFriendly: discoveryItem.familyFriendly,
      petFriendly: discoveryItem.petFriendly,
      wheelchairAccessible: discoveryItem.wheelchairAccessible,
      visits: discoveryItem.visits ? parseInt(String(discoveryItem.visits)) : undefined,
      revenue: discoveryItem.revenue ? parseFloat(String(discoveryItem.revenue)) : undefined,
    };

    // Nettoyer les champs undefined
    Object.keys(apiData).forEach(key => {
      if (apiData[key as keyof APIDiscoveryData] === undefined) {
        delete apiData[key as keyof APIDiscoveryData];
      }
    });

    return apiData;
  };

  // Charger les événements
  const fetchEvents = useCallback(async (params?: any) => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await api.get("/event", { 
        params: {
          ...params,
          includeUser: "true"
        }
      });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const formattedEvents: EventItem[] = response.data.data.map((event: any) => 
          formatEventFromApi(event)
        );
        
        setEvents(formattedEvents);
        setError(null);
        return formattedEvents;
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error: any) {
      console.error("❌ Erreur lors du chargement des événements:", error);
      setError(error.response?.data?.message || "Erreur lors du chargement des événements");
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  }, []);

  // Charger les découvertes
  const fetchDiscoveries = useCallback(async (params?: any) => {
    try {
      setLoading(prev => ({ ...prev, discoveries: true }));
      const response = await api.get("/discoveries", { 
        params: {
          ...params,
          includeUser: "true"
        }
      });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const formattedDiscoveries: DiscoveryItem[] = response.data.data.map((discovery: any) => 
          formatDiscoveryFromApi(discovery)
        );
        
        setDiscoveries(formattedDiscoveries);
        setError(null);
        return formattedDiscoveries;
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error: any) {
      console.error("❌ Erreur lors du chargement des découvertes:", error);
      setError(error.response?.data?.message || "Erreur lors du chargement des découvertes");
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, discoveries: false }));
    }
  }, []);

  // Charger les statistiques des événements
  const fetchEventStats = useCallback(async () => {
    try {
      const response = await api.get("/event/stats");
      
      if (response.data.success) {
        return response.data.data;
      }
      return {};
    } catch (error) {
      console.error("Erreur statistiques événements:", error);
      return {};
    }
  }, []);

  // Charger les statistiques des découvertes
  const fetchDiscoveryStats = useCallback(async () => {
    try {
      const response = await api.get("/discoveries/stats/global");
      
      if (response.data.success) {
        return response.data.data;
      }
      return {};
    } catch (error) {
      console.error("Erreur statistiques découvertes:", error);
      return {};
    }
  }, []);

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      const [eventsStats, discoveriesStats] = await Promise.all([
        fetchEventStats(),
        fetchDiscoveryStats()
      ]);
      
      // Statistiques événements
      const totalRevenueEvents = eventsStats.financials?.totalRevenue || 0;
      const totalParticipants = eventsStats.participants?.total || 0;
      const totalEvents = eventsStats.totals?.total || 0;
      const activeEvents = eventsStats.totals?.active || 0;
      const upcomingEvents = eventsStats.totals?.upcoming || 0;
      
      // Statistiques découvertes
      const totalRevenueDiscoveries = discoveriesStats.financials?.totalRevenue || 0;
      const totalDiscoveries = discoveriesStats.totals?.total || 0;
      const totalVisits = discoveriesStats.visits?.total || 0;
      
      // Catégorie populaire
      const eventsByCategory = eventsStats.breakdown?.byCategory || {};
      let popularCategory = "";
      let maxCount = 0;
      
      Object.entries(eventsByCategory).forEach(([category, data]: [string, any]) => {
        const count = data.count || 0;
        if (count > maxCount) {
          maxCount = count;
          popularCategory = category;
        }
      });
      
      // Taux de conversion
      const conversionRate = totalEvents > 0 
        ? Math.min(100, Math.round((totalParticipants / (totalEvents * 10)) * 100)) 
        : 0;
      
      // Note moyenne
      const avgEventsRating = eventsStats.financials?.averageRating || 0;
      const avgDiscoveriesRating = discoveriesStats.financials?.averageRating || 0;
      const avgRating = (avgEventsRating + avgDiscoveriesRating) / 2 || 0;
      
      const updatedStats: Stats = {
        totalEvents,
        totalDiscoveries,
        activeEvents,
        totalRevenue: totalRevenueEvents + totalRevenueDiscoveries,
        upcomingEvents,
        avgRating: parseFloat(avgRating.toFixed(1)),
        conversionRate,
        totalParticipants,
        totalVisits,
        popularCategory: popularCategory || "Aucune"
      };

      setStats(updatedStats);
      setError(null);
    } catch (error: any) {
      console.error("❌ Erreur lors du chargement des statistiques:", error);
      setError(error.response?.data?.message || "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, [fetchEventStats, fetchDiscoveryStats]);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        if (activeTab === "events") {
          await fetchEvents();
        } else {
          await fetchDiscoveries();
        }
        await fetchStats();
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadData();
  }, [activeTab, fetchEvents, fetchDiscoveries, fetchStats]);

  // Filtrer les items localement
  const filteredItems = filterItems(
    activeTab === "events" ? events : discoveries,
    searchTerm,
    filterStatus,
    activeTab
  );

  // Gérer la suppression d'un événement
  const handleDeleteEvent = useCallback(async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await api.delete(`/event/${id}`);
        setEvents(prev => prev.filter((item) => item.id !== id));
        await fetchStats();
        setError(null);
      } catch (error: any) {
        console.error("❌ Erreur lors de la suppression:", error);
        setError(error.response?.data?.message || "Erreur lors de la suppression");
        throw error;
      }
    }
  }, [fetchStats]);

  // Gérer la suppression d'une découverte
  const handleDeleteDiscovery = useCallback(async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette découverte ?")) {
      try {
        await api.delete(`/discoveries/${id}`);
        setDiscoveries(prev => prev.filter((item) => item.id !== id));
        await fetchStats();
        setError(null);
      } catch (error: any) {
        console.error("❌ Erreur lors de la suppression:", error);
        setError(error.response?.data?.message || "Erreur lors de la suppression");
        throw error;
      }
    }
  }, [fetchStats]);

  // Gérer le statut "featured" pour un événement
  const handleToggleEventFeatured = useCallback(async (id: number) => {
    try {
      const event = events.find(e => e.id === id);
      if (!event) {
        throw new Error("Événement non trouvé");
      }

      const response = await api.patch(`/event/${id}/featured`, {
        featured: !event.featured
      });
      
      if (response.data.success) {
        setEvents(prev =>
          prev.map((item) =>
            item.id === id ? formatEventFromApi(response.data.data) : item
          )
        );
      }
      
      setError(null);
    } catch (error: any) {
      console.error("❌ Erreur lors du changement du statut featured:", error);
      setError(error.response?.data?.message || "Erreur lors du changement du statut featured");
      throw error;
    }
  }, [events]);

  // Gérer le statut "featured" pour une découverte
  const handleToggleDiscoveryFeatured = useCallback(async (id: number) => {
    try {
      const discovery = discoveries.find(d => d.id === id);
      if (!discovery) {
        throw new Error("Découverte non trouvée");
      }

      const response = await api.patch(`/discoveries/${id}/featured`, {
        featured: !discovery.featured
      });
      
      if (response.data.success) {
        setDiscoveries(prev =>
          prev.map((item) =>
            item.id === id ? formatDiscoveryFromApi(response.data.data) : item
          )
        );
      }
      
      setError(null);
    } catch (error: any) {
      console.error("❌ Erreur lors du changement du statut featured:", error);
      setError(error.response?.data?.message || "Erreur lors du changement du statut featured");
      throw error;
    }
  }, [discoveries]);

  // Ajouter un événement
  const handleAddEvent = useCallback(async (newEvent: EventItem) => {
    try {
      
      const eventData = formatEventToApi(newEvent);
      
      const response = await api.post("/event", eventData);
      
      if (response.data.success) {
        const formattedEvent = formatEventFromApi(response.data.data);
        
        setEvents(prev => [...prev, formattedEvent]);
        await fetchStats();
        setError(null);
        
        return formattedEvent;
      } else {
        throw new Error(response.data.message || "Erreur lors de l'ajout");
      }
    } catch (error: any) {
      console.error("❌ Erreur détaillée:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        "Erreur lors de l'ajout de l'événement"
      );
      throw error;
    }
  }, [fetchStats]);

  // Ajouter une découverte
  const handleAddDiscovery = useCallback(async (newDiscovery: DiscoveryItem) => {
    try {
      
      const discoveryData = formatDiscoveryToApi(newDiscovery);
      
      const response = await api.post("/discoveries", discoveryData);
      
      if (response.data.success) {
        const formattedDiscovery = formatDiscoveryFromApi(response.data.data);
        
        setDiscoveries(prev => [...prev, formattedDiscovery]);
        await fetchStats();
        setError(null);
        
        return formattedDiscovery;
      } else {
        throw new Error(response.data.message || "Erreur lors de l'ajout");
      }
    } catch (error: any) {
      console.error("❌ Erreur détaillée:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        "Erreur lors de l'ajout de la découverte"
      );
      throw error;
    }
  }, [fetchStats]);

  // Mettre à jour un événement
  const handleUpdateEvent = useCallback(async (updatedEvent: EventItem) => {
    try {
      
      const eventData = formatEventToApi(updatedEvent);
      
      const response = await api.put(`/event/${updatedEvent.id}`, eventData);
      
      if (response.data.success) {
        const formattedEvent = formatEventFromApi(response.data.data);
        
        setEvents(prev =>
          prev.map((event) =>
            event.id === updatedEvent.id ? formattedEvent : event
          )
        );
        
        setError(null);
        return formattedEvent;
      } else {
        throw new Error(response.data.message || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de la mise à jour de l'événement:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour de l'événement");
      throw error;
    }
  }, []);

  // Mettre à jour une découverte
  const handleUpdateDiscovery = useCallback(async (updatedDiscovery: DiscoveryItem) => {
    try {
      
      const discoveryData = formatDiscoveryToApi(updatedDiscovery);
      
      const response = await api.put(`/discoveries/${updatedDiscovery.id}`, discoveryData);
      
      if (response.data.success) {
        const formattedDiscovery = formatDiscoveryFromApi(response.data.data);
        
        setDiscoveries(prev =>
          prev.map((discovery) =>
            discovery.id === updatedDiscovery.id ? formattedDiscovery : discovery
          )
        );
        
        setError(null);
        return formattedDiscovery;
      } else {
        throw new Error(response.data.message || "Erreur lors de la mise à jour");
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de la mise à jour de la découverte:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour de la découverte");
      throw error;
    }
  }, []);

  // Gérer l'export
  const handleExport = useCallback(async () => {
    try {
      const endpoint = activeTab === 'events' ? 'event/export/csv' : 'discoveries/export/csv';
      const response = await api.get(`/${endpoint}`, {
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${activeTab}-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setError(null);
    } catch (error: any) {
      console.error("Erreur lors de l'export:", error);
      setError(error.response?.data?.message || "Erreur lors de l'export");
    }
  }, [activeTab]);

  // Gérer la recherche
  const handleSearch = useCallback(async () => {
    try {
      if (activeTab === "events") {
        await fetchEvents({ 
          search: searchTerm || undefined, 
          status: filterStatus !== "all" ? filterStatus : undefined 
        });
      } else {
        await fetchDiscoveries({ 
          search: searchTerm || undefined, 
          status: filterStatus !== "all" ? filterStatus : undefined 
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    }
  }, [activeTab, searchTerm, filterStatus, fetchEvents, fetchDiscoveries]);

  // Exécuter la recherche quand les critères changent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || filterStatus !== "all") {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, handleSearch]);

  // Fonction générique pour la suppression
  const handleDelete = useCallback((id: number) => {
    if (activeTab === "events") {
      return handleDeleteEvent(id);
    } else {
      return handleDeleteDiscovery(id);
    }
  }, [activeTab, handleDeleteEvent, handleDeleteDiscovery]);

  // Fonction générique pour featured
  const handleToggleFeatured = useCallback((id: number) => {
    if (activeTab === "events") {
      return handleToggleEventFeatured(id);
    } else {
      return handleToggleDiscoveryFeatured(id);
    }
  }, [activeTab, handleToggleEventFeatured, handleToggleDiscoveryFeatured]);

  return {
    // State
    events,
    discoveries,
    activeTab,
    viewMode,
    searchTerm,
    filterStatus,
    stats,
    filteredItems,
    loading,
    error,
    
    // Setters
    setActiveTab,
    setViewMode,
    setSearchTerm,
    setFilterStatus,
    
    // Actions génériques
    handleDelete,
    handleToggleFeatured,
    handleExport,
    
    // Actions spécifiques événements
    handleDeleteEvent,
    handleToggleEventFeatured,
    handleAddEvent,
    handleUpdateEvent,
    
    // Actions spécifiques découvertes
    handleDeleteDiscovery,
    handleToggleDiscoveryFeatured,
    handleAddDiscovery,
    handleUpdateDiscovery,
    
    // Utilitaires
    refreshData: () => {
      if (activeTab === "events") {
        return fetchEvents();
      } else {
        return fetchDiscoveries();
      }
    },
    refreshStats: fetchStats,
    
    // Formatteurs
    formatEventToApi,
    formatEventFromApi,
    formatDiscoveryToApi,
    formatDiscoveryFromApi
  };
};