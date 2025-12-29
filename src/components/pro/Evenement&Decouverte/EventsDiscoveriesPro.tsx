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
    if (eventModalMode === "create") {
      const newEvent: EventItem = {
        id: Date.now(),
        title: data.title,
        date: data.date,
        time: `${data.startTime}${data.endTime ? ` - ${data.endTime}` : ""}`,
        location: data.location,
        category: data.category,
        description: data.description,
        image: data.image,
        status: data.status as
          | "active"
          | "upcoming"
          | "draft"
          | "completed"
          | "archived",
        participants: 0,
        capacity: data.capacity,
        revenue: 0,
        featured: data.featured,
        organizer: data.organizer,
        price: data.price,
      };
      handleAddEvent(newEvent);
    } else if (selectedEvent) {
      const updatedEvent: EventItem = {
        ...selectedEvent,
        title: data.title,
        date: data.date,
        time: `${data.startTime}${data.endTime ? ` - ${data.endTime}` : ""}`,
        location: data.location,
        category: data.category,
        description: data.description,
        image: data.image,
        status: data.status as
          | "active"
          | "upcoming"
          | "draft"
          | "completed"
          | "archived",
        capacity: data.capacity,
        featured: data.featured,
        organizer: data.organizer,
        price: data.price,
      };
      handleUpdateEvent(updatedEvent);
    }

    handleCloseEventModal();
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

  const handleSubmitDiscovery = (data: DiscoveryFormData) => {
    if (discoveryModalMode === "create") {
      const newDiscovery: DiscoveryItem = {
        id: Date.now(),
        title: data.title,
        type: data.type,
        location: data.location,
        description: data.description,
        image: data.image,
        status: data.status as "published" | "draft" | "archived" | "active",
        visits: 0,
        rating: 0,
        revenue: 0,
        featured: data.featured,
        tags: data.tags,
        difficulty: data.difficulty as "easy" | "medium" | "hard",
        duration: data.duration,
        price: data.price,
        organizer: data.organizer,
        coordinates: data.coordinates,
        includedServices: data.includedServices || [],
        requirements: data.requirements || [],
        maxVisitors: data.maxVisitors,
        availableDates: data.availableDates || [],
      };
      handleAddDiscovery(newDiscovery);
    } else if (selectedDiscovery) {
      const updatedDiscovery: DiscoveryItem = {
        ...selectedDiscovery,
        title: data.title,
        type: data.type,
        location: data.location,
        description: data.description,
        image: data.image,
        status: data.status as "published" | "draft" | "archived" | "active",
        featured: data.featured,
        tags: data.tags,
        difficulty: data.difficulty as "easy" | "medium" | "hard",
        duration: data.duration,
        price: data.price,
        organizer: data.organizer,
        coordinates: data.coordinates,
        includedServices: data.includedServices || [],
        requirements: data.requirements || [],
        maxVisitors: data.maxVisitors,
        availableDates: data.availableDates || [],
      };
      handleUpdateDiscovery(updatedDiscovery);
    }

    handleCloseDiscoveryModal();
  };

  // Gestion de l'édition d'un item
  const handleEditItem = (item: EventItem | DiscoveryItem) => {
    if (activeTab === "events") {
      handleOpenEditEventModal(item as EventItem);
    } else {
      handleOpenEditDiscoveryModal(item as DiscoveryItem);
    }
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
          selectedEvent
            ? {
                title: selectedEvent.title,
                description: selectedEvent.description,
                date: selectedEvent.date,
                startTime: parseTimeString(selectedEvent.time).startTime,
                endTime: parseTimeString(selectedEvent.time).endTime,
                location: selectedEvent.location,
                address: "",
                city: "",
                postalCode: "",
                category: selectedEvent.category,
                capacity: selectedEvent.capacity,
                price: selectedEvent.price,
                currency: "EUR",
                image: selectedEvent.image,
                images: [],
                featured: selectedEvent.featured,
                // Convertir "archived" en "cancelled" ou autre valeur valide
                status:
                  selectedEvent.status === "archived"
                    ? "completed"
                    : (selectedEvent.status as
                        | "active"
                        | "upcoming"
                        | "draft"
                        | "completed"
                        | "cancelled"),
                organizer: selectedEvent.organizer,
                contactEmail: "",
                contactPhone: "",
                tags: [],
                duration: "3 heures",
                visibility: "public",
              }
            : undefined
        }
        mode={eventModalMode}
      />
      {/* Modal pour les découvertes */}
      <DiscoveryModal
        isOpen={isDiscoveryModalOpen}
        onClose={handleCloseDiscoveryModal}
        onSubmit={handleSubmitDiscovery}
        initialData={
          selectedDiscovery
            ? {
                title: selectedDiscovery.title,
                description: selectedDiscovery.description,
                type: selectedDiscovery.type,
                location: selectedDiscovery.location,
                address: "",
                city: "",
                postalCode: "",
                coordinates: selectedDiscovery.coordinates,
                difficulty: selectedDiscovery.difficulty,
                duration: selectedDiscovery.duration,
                includedServices: selectedDiscovery.includedServices || [],
                requirements: selectedDiscovery.requirements || [],
                maxVisitors: selectedDiscovery.maxVisitors,
                availableDates: selectedDiscovery.availableDates || [],
                price: selectedDiscovery.price || 0,
                currency: "EUR",
                image: selectedDiscovery.image,
                images: [],
                featured: selectedDiscovery.featured,
                status: selectedDiscovery.status,
                organizer: selectedDiscovery.organizer || "",
                contactEmail: "",
                contactPhone: "",
                tags: selectedDiscovery.tags,
                visibility: "public",
              }
            : undefined
        }
        mode={discoveryModalMode}
      />
    </div>
  );
};

export default EventsDiscoveriesPro;
