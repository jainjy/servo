import React, { useState, useEffect } from "react";
import { useEventsDiscoveries } from "@/hooks/useEventsDiscoveries";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import TabsAndFilters from "./components/TabsAndFilter";
import ListView from "./components/ListView";
import GridView from "./components/GridView";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import EventModal, { EventFormData } from "@/components/modals/EventModal";
import DiscoveryModal, {
  DiscoveryFormData,
} from "@/components/modals/DiscoveryModal";
import { EventItem, DiscoveryItem } from "./types";

const EventsDiscoveriesPro: React.FC = () => {
  const {
    events,
    discoveries,
    activeTab,
    viewMode,
    searchTerm,
    filterStatus,
    stats,
    filteredItems,
    setActiveTab,
    setViewMode,
    setSearchTerm,
    setFilterStatus,
    handleDelete,
    handleToggleFeatured,
    handleExport,
    handleAddEvent,
    handleUpdateEvent,
    handleAddDiscovery,
    handleUpdateDiscovery,
    formatDiscoveryFromApi,
    formatDiscoveryToApi,
  } = useEventsDiscoveries();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [discoveryModalMode, setDiscoveryModalMode] = useState<
    "create" | "edit"
  >("create");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] =
    useState<DiscoveryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, filterStatus]);

  // Calcul des items paginés
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Fonctions pour gérer la modal d'événement
  const handleOpenCreateEventModal = () => {
    setEventModalMode("create");
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEventModal = (event: EventItem) => {
    setEventModalMode("edit");
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmitEvent = (data: EventFormData) => {
    console.log("📥 Données reçues du modal Event:", data);
    
    // Formatter les données pour correspondre à votre structure EventItem
    const formattedData: EventItem = {
      id: eventModalMode === "edit" && selectedEvent ? selectedEvent.id : Date.now(),
      title: data.title,
      date: data.date.split("T")[0], // Extraire seulement la date YYYY-MM-DD
      time: `${data.startTime || ""}${data.endTime ? ` - ${data.endTime}` : ""}`,
      location: data.location,
      address: data.address || "",
      city: data.city || "",
      postalCode: data.postalCode || "",
      category: data.category,
      subCategory: data.subCategory || "",
      description: data.description,
      image: data.image || "https://via.placeholder.com/300x200?text=Event+Image",
      images: data.images || [],
      status: mapStatusToLegacy(data.status),
      participants: 0,
      capacity: data.capacity,
      revenue: 0,
      featured: data.featured,
      organizer: data.organizer || "",
      contactEmail: data.contactEmail || "",
      contactPhone: data.contactPhone || "",
      website: data.website || "",
      price: data.price,
      currency: data.currency,
      discountPrice: data.discountPrice,
      earlyBirdPrice: data.earlyBirdPrice,
      registrationDeadline: data.registrationDeadline?.split("T")[0] || "",
      earlyBirdDeadline: data.earlyBirdDeadline?.split("T")[0] || "",
      tags: data.tags || [],
      highlights: data.highlights || [],
      includes: data.includes || [],
      notIncludes: data.notIncludes || [],
      targetAudience: data.targetAudience || [],
      duration: data.duration || "",
      difficulty: mapDifficultyToLegacy(data.difficulty),
      requirements: data.requirements || "",
      cancellationPolicy: data.cancellationPolicy || "",
      refundPolicy: data.refundPolicy || "",
      visibility: data.visibility
    };

    if (eventModalMode === "create") {
      console.log("➕ Création d'un nouvel événement:", formattedData);
      handleAddEvent(formattedData);
    } else if (selectedEvent) {
      console.log("✏️ Mise à jour de l'événement:", formattedData);
      handleUpdateEvent(formattedData);
    }

    handleCloseEventModal();
  };

  // Fonction pour mapper les nouveaux statuts vers les anciens
  const mapStatusToLegacy = (status: EventFormData['status']): EventItem['status'] => {
    const statusMap: Record<string, EventItem['status']> = {
      'DRAFT': 'draft',
      'ACTIVE': 'active',
      'UPCOMING': 'upcoming',
      'COMPLETED': 'completed',
      'CANCELLED': 'archived', // Map CANCELLED to archived
      'ARCHIVED': 'archived'
    };
    return statusMap[status] || 'draft';
  };

  // Fonction pour mapper la difficulté
  const mapDifficultyToLegacy = (difficulty?: 'EASY' | 'MEDIUM' | 'HARD'): EventItem['difficulty'] => {
    if (!difficulty) return undefined;
    return difficulty.toLowerCase() as EventItem['difficulty'];
  };

  // Fonction pour formater les données initiales
  const prepareInitialEventData = (event: EventItem): EventFormData => {
    const { startTime, endTime } = parseTimeString(event.time);
    
    // Convertir le statut legacy vers le nouveau format
    const statusMap: Record<string, EventFormData['status']> = {
      'draft': 'DRAFT',
      'active': 'ACTIVE',
      'upcoming': 'UPCOMING',
      'completed': 'COMPLETED',
      'archived': 'ARCHIVED'
    };

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: startTime,
      endTime: endTime,
      location: event.location,
      address: event.address || undefined,
      city: event.city || undefined,
      postalCode: event.postalCode || undefined,
      category: event.category,
      subCategory: event.subCategory || undefined,
      capacity: event.capacity,
      price: event.price,
      discountPrice: event.discountPrice,
      currency: event.currency || 'EUR',
      image: event.image,
      images: event.images || [],
      featured: event.featured,
      status: statusMap[event.status] || 'DRAFT',
      organizer: event.organizer || undefined,
      contactEmail: event.contactEmail || undefined,
      contactPhone: event.contactPhone || undefined,
      website: event.website || undefined,
      tags: event.tags || [],
      requirements: event.requirements || undefined,
      highlights: event.highlights || [],
      duration: event.duration || undefined,
      difficulty: event.difficulty?.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD' | undefined,
      targetAudience: event.targetAudience || [],
      includes: event.includes || [],
      notIncludes: event.notIncludes || [],
      cancellationPolicy: event.cancellationPolicy || undefined,
      refundPolicy: event.refundPolicy || undefined,
      visibility: event.visibility || 'PUBLIC',
      registrationDeadline: event.registrationDeadline || undefined,
      earlyBirdDeadline: event.earlyBirdDeadline || undefined,
      earlyBirdPrice: event.earlyBirdPrice
    };
  };

  // Parse time string safely
  const parseTimeString = (timeString: string) => {
    if (!timeString) return { startTime: "", endTime: "" };

    const parts = timeString.split(" - ");
    return {
      startTime: parts[0] || "",
      endTime: parts[1] || "",
    };
  };

  // Fonctions pour gérer la modal de découverte
  const handleOpenCreateDiscoveryModal = () => {
    setDiscoveryModalMode("create");
    setSelectedDiscovery(null);
    setIsDiscoveryModalOpen(true);
  };

  const handleOpenEditDiscoveryModal = (discovery: DiscoveryItem) => {
    setDiscoveryModalMode("edit");
    setSelectedDiscovery(discovery);
    setIsDiscoveryModalOpen(true);
  };

  const handleCloseDiscoveryModal = () => {
    setIsDiscoveryModalOpen(false);
    setSelectedDiscovery(null);
  };

  const handleSubmitDiscovery = async (data: DiscoveryFormData) => {
    console.log("📥 Données reçues du modal Discovery:", data);
    
    try {
      // Convertir les données du modal vers DiscoveryItem
      const discoveryData: DiscoveryItem = {
        // ID généré temporairement (sera remplacé par le backend)
        id: discoveryModalMode === "edit" && selectedDiscovery ? selectedDiscovery.id : Date.now(),
        
        // Champs requis
        title: data.title,
        type: data.type,
        location: data.location,
        difficulty: data.difficulty,
        
        // Champs optionnels
        description: data.description || '',
        price: data.price || 0,
        currency: data.currency || 'EUR',
        duration: data.duration || '',
        rating: data.rating || 0,
        image: data.image || 'https://via.placeholder.com/300x200?text=Discovery+Image',
        images: data.images || [],
        featured: data.featured || false,
        status: data.status,
        organizer: data.organizer || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        website: data.website || '',
        address: data.address || '',
        city: data.city || '',
        postalCode: data.postalCode || '',
        
        // Tableaux
        tags: data.tags || [],
        highlights: data.highlights || [],
        bestSeason: data.bestSeason || [],
        bestTime: data.bestTime || [],
        equipment: data.equipment || [],
        includes: data.includes || [],
        notIncludes: data.notIncludes || [],
        languages: data.languages || [],
        includedServices: data.includedServices || [],
        requirements: data.requirements || [],
        availableDates: data.availableDates || [],
        
        // Groupe et visiteurs
        groupSizeMin: data.groupSizeMin,
        groupSizeMax: data.groupSizeMax,
        ageRestrictionMin: data.ageRestrictionMin,
        ageRestrictionMax: data.ageRestrictionMax,
        maxVisitors: data.maxVisitors,
        
        // Coordonnées
        coordinates: data.coordinates || { lat: 0, lng: 0 },
        
        // Services et accessibilité
        guideIncluded: data.guideIncluded || false,
        transportIncluded: data.transportIncluded || false,
        mealIncluded: data.mealIncluded || false,
        parkingAvailable: data.parkingAvailable || false,
        wifiAvailable: data.wifiAvailable || false,
        familyFriendly: data.familyFriendly || false,
        petFriendly: data.petFriendly || false,
        wheelchairAccessible: data.wheelchairAccessible || false,
        
        // Développement durable
        sustainabilityRating: data.sustainabilityRating,
        carbonFootprint: data.carbonFootprint || '',
        
        // Champs texte
        recommendations: data.recommendations || '',
        accessibility: data.accessibility || '',
        safety: data.safety || '',
        
        // Statistiques (initialisées à 0)
        visits: 0,
        revenue: 0,
        
        // User (sera ajouté par le backend)
        userId: ''
      };
      
      console.log("📤 Données formatées pour l'API:", discoveryData);

      if (discoveryModalMode === "create") {
        console.log("➕ Création d'une nouvelle découverte");
        await handleAddDiscovery(discoveryData);
      } else if (selectedDiscovery) {
        console.log("✏️ Mise à jour de la découverte");
        await handleUpdateDiscovery({
          ...discoveryData,
          id: selectedDiscovery.id,
          visits: selectedDiscovery.visits || 0,
          revenue: selectedDiscovery.revenue || 0,
          rating: selectedDiscovery.rating || 0
        });
      }

      handleCloseDiscoveryModal();
    } catch (error) {
      console.error("❌ Erreur lors de la soumission de la découverte:", error);
      // Vous pourriez ajouter une notification d'erreur ici
    }
  };

  // Fonction pour préparer les données initiales d'une découverte
  const prepareInitialDiscoveryData = (discovery: DiscoveryItem): DiscoveryFormData => {
    return {
      // Champs de base
      title: discovery.title,
      description: discovery.description,
      type: discovery.type,
      location: discovery.location,
      difficulty: discovery.difficulty,
      duration: discovery.duration || '',
      
      // Prix et devise
      price: discovery.price || 0,
      currency: discovery.currency || 'EUR',
      
      // Images
      image: discovery.image || '',
      images: discovery.images || [],
      
      // Statut et visibilité
      featured: discovery.featured || false,
      status: discovery.status,
      
      // Contact
      organizer: discovery.organizer || '',
      contactEmail: discovery.contactEmail || '',
      contactPhone: discovery.contactPhone || '',
      website: discovery.website || '',
      address: discovery.address || '',
      city: discovery.city || '',
      postalCode: discovery.postalCode || '',
      
      // Tableaux
      tags: discovery.tags || [],
      highlights: discovery.highlights || [],
      bestSeason: discovery.bestSeason || [],
      bestTime: discovery.bestTime || [],
      equipment: discovery.equipment || [],
      includes: discovery.includes || [],
      notIncludes: discovery.notIncludes || [],
      languages: discovery.languages || [],
      includedServices: discovery.includedServices || [],
      requirements: discovery.requirements || [],
      availableDates: discovery.availableDates || [],
      
      // Groupe
      groupSizeMin: discovery.groupSizeMin,
      groupSizeMax: discovery.groupSizeMax,
      ageRestrictionMin: discovery.ageRestrictionMin,
      ageRestrictionMax: discovery.ageRestrictionMax,
      maxVisitors: discovery.maxVisitors,
      
      // Coordonnées
      coordinates: discovery.coordinates || { lat: 0, lng: 0 },
      
      // Services
      guideIncluded: discovery.guideIncluded || false,
      transportIncluded: discovery.transportIncluded || false,
      mealIncluded: discovery.mealIncluded || false,
      parkingAvailable: discovery.parkingAvailable || false,
      wifiAvailable: discovery.wifiAvailable || false,
      familyFriendly: discovery.familyFriendly || false,
      petFriendly: discovery.petFriendly || false,
      wheelchairAccessible: discovery.wheelchairAccessible || false,
      
      // Développement durable
      sustainabilityRating: discovery.sustainabilityRating,
      carbonFootprint: discovery.carbonFootprint || '',
      
      // Champs texte optionnels
      recommendations: discovery.recommendations || '',
      accessibility: discovery.accessibility || '',
      safety: discovery.safety || '',
      
      // Note
      rating: discovery.rating || 0,
      
      // ID pour l'édition
      id: discovery.id
    };
  };

  // Gestion de l'édition d'un item
  const handleEditItem = (item: EventItem | DiscoveryItem) => {
    if (activeTab === "events") {
      handleOpenEditEventModal(item as EventItem);
    } else {
      handleOpenEditDiscoveryModal(item as DiscoveryItem);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        activeTab={activeTab}
        onCreateEvent={handleOpenCreateEventModal}
        onCreateDiscovery={handleOpenCreateDiscoveryModal}
        onExport={handleExport}
      />
      <StatsCards stats={stats} activeTab={activeTab} />
      <TabsAndFilters
        activeTab={activeTab}
        viewMode={viewMode}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        eventsCount={events.length}
        discoveriesCount={discoveries.length}
        onTabChange={setActiveTab}
        onViewModeChange={setViewMode}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilterStatus}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {filteredItems.length === 0 ? (
            <EmptyState
              activeTab={activeTab}
              searchTerm={searchTerm}
              onCreate={
                activeTab === "events"
                  ? handleOpenCreateEventModal
                  : handleOpenCreateDiscoveryModal
              }
            />
          ) : (
            <>
              {viewMode === "list" ? (
                <ListView
                  items={paginatedItems}
                  activeTab={activeTab}
                  onEdit={handleEditItem}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ) : (
                <GridView
                  items={paginatedItems}
                  activeTab={activeTab}
                  onEdit={handleEditItem}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              )}

              {filteredItems.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredItems.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Modal pour les événements */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        onSubmit={handleSubmitEvent}
        initialData={
          selectedEvent ? prepareInitialEventData(selectedEvent) : undefined
        }
        mode={eventModalMode}
      />
      
      {/* Modal pour les découvertes */}
      <DiscoveryModal
        isOpen={isDiscoveryModalOpen}
        onClose={handleCloseDiscoveryModal}
        onSubmit={handleSubmitDiscovery}
        initialData={
          selectedDiscovery ? prepareInitialDiscoveryData(selectedDiscovery) : undefined
        }
        mode={discoveryModalMode}
      />
    </div>
  );
};

export default EventsDiscoveriesPro;