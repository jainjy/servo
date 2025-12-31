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
  const date = new Date(event.date);
  
  return {
    id: event.id,
    title: event.title,
    date: date.toISOString(), // Conserver ISO format
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
    visibility: event.visibility?.toLowerCase(),
    website: event.website || '',
    registrationDeadline: event.registrationDeadline || '',
    earlyBirdDeadline: event.earlyBirdDeadline || '',
    earlyBirdPrice: event.earlyBirdPrice || undefined,
    userId: event.userId
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
      const response = await api.get("/event", { 
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
      const eventsResponse = await api.get("/event/stats");
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
          await api.delete(`/event/${id}`);
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
          const response = await api.patch(`/event/${id}/featured`, {
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
    // Formater la date correctement (YYYY-MM-DD)
    let formattedDate: string;
    if (newEvent.date) {
      const date = new Date(newEvent.date);
      if (isNaN(date.getTime())) {
        throw new Error("Format de date invalide");
      }
      formattedDate = date.toISOString().split('T')[0]; // "2024-01-15"
    } else {
      formattedDate = new Date().toISOString().split('T')[0];
    }
    
    // Extraire les heures du champ time
    const timeParts = newEvent.time?.split(" - ") || [];
    const startTime = timeParts[0] || "10:00";
    const endTime = timeParts[1] || undefined;
    
    // Préparer les données pour l'API selon les validations
    const eventData = {
      // Champs requis
      title: newEvent.title,
      description: newEvent.description || "",
      date: formattedDate, // Format YYYY-MM-DD
      location: newEvent.location,
      category: newEvent.category || "cultural",
      
      // Champs optionnels avec validation
      startTime: startTime, // Format HH:MM
      endTime: endTime, // Format HH:MM
      address: newEvent.address || "",
      city: newEvent.city || "",
      postalCode: newEvent.postalCode || "",
      subCategory: newEvent.subCategory || undefined,
      capacity: parseInt(String(newEvent.capacity)) || 0,
      price: parseFloat(String(newEvent.price)) || 0,
      discountPrice: newEvent.discountPrice ? parseFloat(String(newEvent.discountPrice)) : undefined,
      currency: newEvent.currency || "EUR",
      image: newEvent.image || undefined,
      images: newEvent.images || undefined,
      featured: newEvent.featured || false,
      
      // CORRECTION : Status en MAJUSCULES selon les validations
      status: (newEvent.status || "DRAFT").toUpperCase(), // "DRAFT", "ACTIVE", etc.
      
      organizer: newEvent.organizer || "",
      contactEmail: newEvent.contactEmail || "",
      contactPhone: newEvent.contactPhone || "",
      website: newEvent.website || undefined,
      tags: newEvent.tags || [],
      requirements: newEvent.requirements || "",
      highlights: newEvent.highlights || [],
      duration: newEvent.duration || "",
      
      // CORRECTION : Difficulty en MAJUSCULES
      difficulty: newEvent.difficulty ? newEvent.difficulty.toUpperCase() : undefined, // "EASY", "MEDIUM", "HARD"
      
      targetAudience: newEvent.targetAudience || [],
      includes: newEvent.includes || [],
      notIncludes: newEvent.notIncludes || [],
      cancellationPolicy: newEvent.cancellationPolicy || "",
      refundPolicy: newEvent.refundPolicy || "",
      
      // CORRECTION : Visibility en MAJUSCULES
      visibility: (newEvent.visibility || "PUBLIC").toUpperCase(), // "PUBLIC", "PRIVATE", "INVITE_ONLY"
      
      registrationDeadline: newEvent.registrationDeadline 
        ? new Date(newEvent.registrationDeadline).toISOString().split('T')[0] // Format YYYY-MM-DD
        : undefined,
      earlyBirdDeadline: newEvent.earlyBirdDeadline 
        ? new Date(newEvent.earlyBirdDeadline).toISOString().split('T')[0] // Format YYYY-MM-DD
        : undefined,
      earlyBirdPrice: newEvent.earlyBirdPrice 
        ? parseFloat(String(newEvent.earlyBirdPrice)) 
        : undefined,
      
      // Ces champs sont probablement gérés côté serveur
      participants: undefined, // Laisser le serveur gérer
      revenue: undefined, // Laisser le serveur gérer
      userId: undefined, // Sera ajouté par l'authentification
    };
    
    // Nettoyer les champs undefined pour éviter d'envoyer "null"
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === undefined || eventData[key] === null) {
        delete eventData[key];
      }
    });
    
    console.log("✅ Données envoyées à /event:", JSON.stringify(eventData, null, 2));
    
    const response = await api.post("/event", eventData);
    console.log("✅ Réponse API:", response.data);
    
    const formattedEvent = formatEventFromApi(response.data.data);
    
    setEvents(prev => [...prev, formattedEvent]);
    await fetchStats();
    setError(null);
    
    return formattedEvent;
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

      const response = await api.put(`/event/${updatedEvent.id}`, eventData);
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