// hooks/useEventsDiscoveries.ts
import { useState, useEffect, useCallback } from "react";
import { EventItem, DiscoveryItem, Stats, ActiveTab, FilterStatus } from "@/components/pro/Evenement&Decouverte/types";
import { filterItems } from "@/components/pro/Evenement&Decouverte/utils";
import api from "@/lib/api"; // Assurez-vous d'avoir une instance axios configurée

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

  // Fonction pour formater un événement de l'API
  const formatEventFromApi = (event: any): EventItem => {
    return {
      id: event.id,
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      time: `${event.startTime || ''}${event.endTime ? ` - ${event.endTime}` : ''}`,
      location: event.location,
      category: event.category,
      description: event.description || '',
      image: event.image || 'https://via.placeholder.com/300x200',
      status: event.status.toLowerCase(),
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
      registrationDeadline: event.registrationDeadline || '',
      earlyBirdDeadline: event.earlyBirdDeadline || '',
      earlyBirdPrice: event.earlyBirdPrice || 0,
      tags: event.tags || [],
      requirements: event.requirements || '',
      highlights: event.highlights || [],
      includes: event.includes || [],
      notIncludes: event.notIncludes || [],
      cancellationPolicy: event.cancellationPolicy || '',
      refundPolicy: event.refundPolicy || '',
      visibility: event.visibility || 'public',
      user: event.user || null
    };
  };

  // Fonction pour formater une découverte de l'API
  const formatDiscoveryFromApi = (discovery: any): DiscoveryItem => {
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
      tags: discovery.tags || [],
      difficulty: discovery.difficulty?.toLowerCase() || 'medium',
      duration: discovery.duration || '',
      price: discovery.price || 0,
      organizer: discovery.organizer || '',
      coordinates: discovery.coordinates || { lat: 0, lng: 0 },
      includedServices: discovery.includedServices || [],
      requirements: discovery.requirements || [],
      maxVisitors: discovery.maxVisitors || 0,
      availableDates: discovery.availableDates || [],
      address: discovery.address || '',
      city: discovery.city || '',
      postalCode: discovery.postalCode || '',
      contactEmail: discovery.contactEmail || '',
      contactPhone: discovery.contactPhone || '',
      website: discovery.website || '',
      highlights: discovery.highlights || [],
      recommendations: discovery.recommendations || '',
      bestSeason: discovery.bestSeason || [],
      bestTime: discovery.bestTime || [],
      accessibility: discovery.accessibility || '',
      equipment: discovery.equipment || [],
      safety: discovery.safety || '',
      includes: discovery.includes || [],
      notIncludes: discovery.notIncludes || [],
      groupSizeMin: discovery.groupSizeMin || 1,
      groupSizeMax: discovery.groupSizeMax || 10,
      ageRestrictionMin: discovery.ageRestrictionMin || 0,
      ageRestrictionMax: discovery.ageRestrictionMax || 99,
      languages: discovery.languages || [],
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

  // Charger les événements
  const fetchEvents = useCallback(async (params?: any) => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await api.get("/events", { 
        params: {
          ...params,
          includeUser: "true"
        }
      });
      
      const formattedEvents: EventItem[] = response.data.data.map((event: any) => 
        formatEventFromApi(event)
      );
      
      setEvents(formattedEvents);
      setError(null);
      return formattedEvents;
    } catch (error: any) {
      console.error("Erreur lors du chargement des événements:", error);
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
      
      const formattedDiscoveries: DiscoveryItem[] = response.data.data.map((discovery: any) => 
        formatDiscoveryFromApi(discovery)
      );
      
      setDiscoveries(formattedDiscoveries);
      setError(null);
      return formattedDiscoveries;
    } catch (error: any) {
      console.error("Erreur lors du chargement des découvertes:", error);
      setError(error.response?.data?.message || "Erreur lors du chargement des découvertes");
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, discoveries: false }));
    }
  }, []);

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      // Récupérer les statistiques des événements
      const eventsResponse = await api.get("/events/stats");
      const discoveriesResponse = await api.get("/discoveries/stats");
      
      const eventsStats = eventsResponse.data.data || {};
      const discoveriesStats = discoveriesResponse.data.data || {};
      
      // Calculer les statistiques globales
      const totalRevenue = (eventsStats.financials?.totalRevenue || 0) + (discoveriesStats.financials?.totalRevenue || 0);
      const totalParticipants = eventsStats.totals?.participants || 0;
      const totalVisits = discoveriesStats.totals?.visits || 0;
      const avgRating = discoveriesStats.ratings?.averageRating || 0;
      
      // Trouver la catégorie la plus populaire
      const eventsByType = eventsStats.breakdown?.byCategory || {};
      const discoveriesByType = discoveriesStats.breakdown?.byType || {};
      
      // Fusionner et compter
      const allCategories = { ...eventsByType, ...discoveriesByType };
      let popularCategory = "";
      let maxCount = 0;
      
      Object.entries(allCategories).forEach(([category, data]: [string, any]) => {
        const count = data.count || 0;
        if (count > maxCount) {
          maxCount = count;
          popularCategory = category;
        }
      });
      
      setStats({
        totalEvents: eventsStats.totals?.total || 0,
        totalDiscoveries: discoveriesStats.totals?.total || 0,
        activeEvents: eventsStats.totals?.active || 0,
        totalRevenue,
        upcomingEvents: eventsStats.totals?.upcoming || 0,
        avgRating,
        conversionRate: totalParticipants > 0 ? Math.round((totalParticipants / (eventsStats.totals?.total || 1)) * 100) : 0,
        totalParticipants,
        totalVisits,
        popularCategory: popularCategory || "Aucune"
      });
      
      setError(null);
    } catch (error: any) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setError(error.response?.data?.message || "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

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

  // Gérer la suppression
  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        if (activeTab === "events") {
          await api.delete(`/events/${id}`);
          setEvents(prev => prev.filter((item) => item.id !== id));
        } else {
          await api.delete(`/discoveries/${id}`);
          setDiscoveries(prev => prev.filter((item) => item.id !== id));
        }
        
        // Recharger les statistiques
        await fetchStats();
        
        setError(null);
      } catch (error: any) {
        console.error("Erreur lors de la suppression:", error);
        setError(error.response?.data?.message || "Erreur lors de la suppression");
        throw error;
      }
    }
  }, [activeTab, fetchStats]);

  // Gérer le statut "featured"
  const handleToggleFeatured = useCallback(async (id: number) => {
    try {
      if (activeTab === "events") {
        const event = events.find(e => e.id === id);
        if (event) {
          const response = await api.patch(`/events/${id}/featured`, {
            featured: !event.featured
          });
          
          setEvents(prev =>
            prev.map((item) =>
              item.id === id ? formatEventFromApi(response.data.data) : item
            )
          );
        }
      } else {
        const discovery = discoveries.find(d => d.id === id);
        if (discovery) {
          const response = await api.patch(`/discoveries/${id}/featured`, {
            featured: !discovery.featured
          });
          
          setDiscoveries(prev =>
            prev.map((item) =>
              item.id === id ? formatDiscoveryFromApi(response.data.data) : item
            )
          );
        }
      }
      
      setError(null);
    } catch (error: any) {
      console.error("Erreur lors du changement du statut featured:", error);
      setError(error.response?.data?.message || "Erreur lors du changement du statut featured");
      throw error;
    }
  }, [activeTab, events, discoveries]);

  // Gérer l'export
  const handleExport = useCallback(async () => {
    try {
      const response = await api.get(`/${activeTab}/export`, {
        params: { format: "json" },
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${activeTab}-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setError(null);
    } catch (error: any) {
      console.error("Erreur lors de l'export:", error);
      setError(error.response?.data?.message || "Erreur lors de l'export");
    }
  }, [activeTab]);

  // Ajouter un événement
  const handleAddEvent = useCallback(async (newEvent: EventItem) => {
    try {
      // Préparer les données pour l'API
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        startTime: newEvent.time.split(" - ")[0],
        endTime: newEvent.time.split(" - ")[1] || undefined,
        location: newEvent.location,
        category: newEvent.category,
        capacity: newEvent.capacity,
        price: newEvent.price,
        currency: "EUR",
        image: newEvent.image,
        featured: newEvent.featured,
        status: newEvent.status.toUpperCase(),
        organizer: newEvent.organizer,
        address: newEvent.address,
        city: newEvent.city,
        postalCode: newEvent.postalCode,
        contactEmail: newEvent.contactEmail,
        contactPhone: newEvent.contactPhone,
        duration: newEvent.duration,
        visibility: "public"
      };
      
      const response = await api.post("/events", eventData);
      const formattedEvent = formatEventFromApi(response.data.data);
      
      setEvents(prev => [...prev, formattedEvent]);
      await fetchStats();
      setError(null);
      
      return formattedEvent;
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'événement:", error);
      setError(error.response?.data?.message || "Erreur lors de l'ajout de l'événement");
      throw error;
    }
  }, [fetchStats]);

  // Mettre à jour un événement
  const handleUpdateEvent = useCallback(async (updatedEvent: EventItem) => {
    try {
      // Préparer les données pour l'API
      const eventData = {
        title: updatedEvent.title,
        description: updatedEvent.description,
        date: updatedEvent.date,
        startTime: updatedEvent.time.split(" - ")[0],
        endTime: updatedEvent.time.split(" - ")[1] || undefined,
        location: updatedEvent.location,
        category: updatedEvent.category,
        capacity: updatedEvent.capacity,
        price: updatedEvent.price,
        currency: "EUR",
        image: updatedEvent.image,
        featured: updatedEvent.featured,
        status: updatedEvent.status.toUpperCase(),
        organizer: updatedEvent.organizer,
        address: updatedEvent.address,
        city: updatedEvent.city,
        postalCode: updatedEvent.postalCode,
        contactEmail: updatedEvent.contactEmail,
        contactPhone: updatedEvent.contactPhone,
        duration: updatedEvent.duration
      };
      
      const response = await api.put(`/events/${updatedEvent.id}`, eventData);
      const formattedEvent = formatEventFromApi(response.data.data);
      
      setEvents(prev =>
        prev.map((event) =>
          event.id === updatedEvent.id ? formattedEvent : event
        )
      );
      
      setError(null);
      return formattedEvent;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'événement:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour de l'événement");
      throw error;
    }
  }, []);

  // Ajouter une découverte
  const handleAddDiscovery = useCallback(async (newDiscovery: DiscoveryItem) => {
    try {
      // Préparer les données pour l'API
      const discoveryData = {
        title: newDiscovery.title,
        description: newDiscovery.description,
        type: newDiscovery.type,
        location: newDiscovery.location,
        difficulty: newDiscovery.difficulty.toUpperCase(),
        duration: newDiscovery.duration,
        price: newDiscovery.price,
        currency: "EUR",
        image: newDiscovery.image,
        featured: newDiscovery.featured,
        status: newDiscovery.status.toUpperCase(),
        organizer: newDiscovery.organizer,
        coordinates: newDiscovery.coordinates,
        includedServices: newDiscovery.includedServices,
        requirements: newDiscovery.requirements,
        maxVisitors: newDiscovery.maxVisitors,
        availableDates: newDiscovery.availableDates,
        tags: newDiscovery.tags,
        address: newDiscovery.address,
        city: newDiscovery.city,
        postalCode: newDiscovery.postalCode,
        contactEmail: newDiscovery.contactEmail,
        contactPhone: newDiscovery.contactPhone
      };
      
      const response = await api.post("/discoveries", discoveryData);
      const formattedDiscovery = formatDiscoveryFromApi(response.data.data);
      
      setDiscoveries(prev => [...prev, formattedDiscovery]);
      await fetchStats();
      setError(null);
      
      return formattedDiscovery;
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de la découverte:", error);
      setError(error.response?.data?.message || "Erreur lors de l'ajout de la découverte");
      throw error;
    }
  }, [fetchStats]);

  // Mettre à jour une découverte
  const handleUpdateDiscovery = useCallback(async (updatedDiscovery: DiscoveryItem) => {
    try {
      // Préparer les données pour l'API
      const discoveryData = {
        title: updatedDiscovery.title,
        description: updatedDiscovery.description,
        type: updatedDiscovery.type,
        location: updatedDiscovery.location,
        difficulty: updatedDiscovery.difficulty.toUpperCase(),
        duration: updatedDiscovery.duration,
        price: updatedDiscovery.price,
        currency: "EUR",
        image: updatedDiscovery.image,
        featured: updatedDiscovery.featured,
        status: updatedDiscovery.status.toUpperCase(),
        organizer: updatedDiscovery.organizer,
        coordinates: updatedDiscovery.coordinates,
        includedServices: updatedDiscovery.includedServices,
        requirements: updatedDiscovery.requirements,
        maxVisitors: updatedDiscovery.maxVisitors,
        availableDates: updatedDiscovery.availableDates,
        tags: updatedDiscovery.tags,
        address: updatedDiscovery.address,
        city: updatedDiscovery.city,
        postalCode: updatedDiscovery.postalCode,
        contactEmail: updatedDiscovery.contactEmail,
        contactPhone: updatedDiscovery.contactPhone
      };
      
      const response = await api.put(`/discoveries/${updatedDiscovery.id}`, discoveryData);
      const formattedDiscovery = formatDiscoveryFromApi(response.data.data);
      
      setDiscoveries(prev =>
        prev.map((discovery) =>
          discovery.id === updatedDiscovery.id ? formattedDiscovery : discovery
        )
      );
      
      setError(null);
      return formattedDiscovery;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la découverte:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour de la découverte");
      throw error;
    }
  }, []);

  // Gérer la recherche
  const handleSearch = useCallback(async () => {
    try {
      if (activeTab === "events") {
        await fetchEvents({ search: searchTerm, status: filterStatus !== "all" ? filterStatus : undefined });
      } else {
        await fetchDiscoveries({ search: searchTerm, status: filterStatus !== "all" ? filterStatus : undefined });
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
    }, 500); // Délai de 500ms pour éviter trop de requêtes

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, handleSearch]);

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
    
    // Actions
    handleDelete,
    handleToggleFeatured,
    handleExport,
    handleAddEvent,
    handleUpdateEvent,
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
    refreshStats: fetchStats
  };
};