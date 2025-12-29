import { useState, useEffect, useCallback } from "react";
import { EventItem, DiscoveryItem, Stats, ActiveTab, FilterStatus } from "@/components/pro/Evenement&Decouverte/types";
import { calculateStats, filterItems } from "@/components/pro/Evenement&Decouverte/utils";
import { SAMPLE_EVENTS, SAMPLE_DISCOVERIES } from "@/components/pro/Evenement&Decouverte/constants";

export const useEventsDiscoveries = () => {
  const [events, setEvents] = useState<EventItem[]>(SAMPLE_EVENTS);
  const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>(SAMPLE_DISCOVERIES);
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

  useEffect(() => {
    const newStats = calculateStats(events, discoveries);
    setStats(newStats);
  }, [events, discoveries]);

  const filteredItems = filterItems(
    activeTab === "events" ? events : discoveries,
    searchTerm,
    filterStatus,
    activeTab
  );

  const handleEdit = useCallback((item: EventItem | DiscoveryItem) => {
    return { item, type: activeTab };
  }, [activeTab]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      if (activeTab === "events") {
        setEvents(prev => prev.filter((item) => item.id !== id));
      } else {
        setDiscoveries(prev => prev.filter((item) => item.id !== id));
      }
    }
  }, [activeTab]);

  const handleToggleFeatured = useCallback((id: number) => {
    if (activeTab === "events") {
      setEvents(prev =>
        prev.map((item) =>
          item.id === id ? { ...item, featured: !item.featured } : item
        )
      );
    } else {
      setDiscoveries(prev =>
        prev.map((item) =>
          item.id === id ? { ...item, featured: !item.featured } : item
        )
      );
    }
  }, [activeTab]);

  const handleExport = useCallback(() => {
    const data = activeTab === "events" ? events : discoveries;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeTab, events, discoveries]);

  const handleAddEvent = useCallback((newEvent: EventItem) => {
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const handleUpdateEvent = useCallback((updatedEvent: EventItem) => {
    setEvents(prev =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  }, []);

  const handleAddDiscovery = useCallback((newDiscovery: DiscoveryItem) => {
    setDiscoveries(prev => [...prev, newDiscovery]);
  }, []);

  const handleUpdateDiscovery = useCallback((updatedDiscovery: DiscoveryItem) => {
    setDiscoveries(prev =>
      prev.map((discovery) =>
        discovery.id === updatedDiscovery.id ? updatedDiscovery : discovery
      )
    );
  }, []);

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
    
    // Setters
    setActiveTab,
    setViewMode,
    setSearchTerm,
    setFilterStatus,
    
    // Actions
    handleEdit,
    handleDelete,
    handleToggleFeatured,
    handleExport,
    handleAddEvent,
    handleUpdateEvent,
    handleAddDiscovery,
    handleUpdateDiscovery,
  };
};