import { EventItem, DiscoveryItem, Stats, ActiveTab, FilterStatus } from "./types";

export const calculateStats = (
  events: EventItem[],
  discoveries: DiscoveryItem[]
): Stats => {
  const now = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > now && event.status === "active"
  );
  const activeEvents = events.filter((event) => event.status === "active");
  const totalRevenue = [...events, ...discoveries].reduce(
    (sum, item) => sum + (item.revenue || 0),
    0
  );
  const totalParticipants = events.reduce(
    (sum, event) => sum + event.participants,
    0
  );
  const totalVisits = discoveries.reduce(
    (sum, disc) => sum + disc.visits,
    0
  );
  
  const avgRating =
    discoveries.filter(d => d.rating > 0).length > 0
      ? discoveries.filter(d => d.rating > 0).reduce((sum, disc) => sum + disc.rating, 0) /
        discoveries.filter(d => d.rating > 0).length
      : 0;

  const totalCapacity = events.reduce(
    (sum, event) => sum + event.capacity,
    0
  );
  const conversionRate =
    totalCapacity > 0 ? (totalParticipants / totalCapacity) * 100 : 0;

  const categoryCount: Record<string, number> = {};
  discoveries.forEach(disc => {
    disc.tags.forEach(tag => {
      categoryCount[tag] = (categoryCount[tag] || 0) + 1;
    });
  });
  
  const popularCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || "Nature";

  return {
    totalEvents: events.length,
    totalDiscoveries: discoveries.length,
    activeEvents: activeEvents.length,
    totalRevenue,
    upcomingEvents: upcomingEvents.length,
    avgRating: parseFloat(avgRating.toFixed(1)),
    conversionRate: parseFloat(conversionRate.toFixed(1)),
    totalParticipants,
    totalVisits,
    popularCategory,
  };
};

export const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "TrendingUp";
    case "medium":
      return "Activity";
    case "hard":
      return "Award";
    default:
      return "Activity";
  }
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

export const getFillPercentage = (participants: number, capacity: number): number => {
  return capacity > 0 ? (participants / capacity) * 100 : 0;
};

export const filterItems = (
  items: (EventItem | DiscoveryItem)[],
  searchTerm: string,
  filterStatus: FilterStatus,
  activeTab: ActiveTab
): (EventItem | DiscoveryItem)[] => {
  return items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activeTab === "discoveries" && 
        (item as DiscoveryItem).tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    const matchesStatus =
      filterStatus === "all" ? true : item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });
};