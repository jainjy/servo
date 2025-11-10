//src/types/suggestionTypes.ts
export interface UserActivity {
  userId: string;
  type: "view" | "click" | "purchase";
  itemId: string;
  timestamp?: string;
}

export interface UserEvent {
  userId: string;
  type: "search" | "filter" | "scroll";
  details?: string;
  timestamp?: string;
}

export interface UserPreference {
  userId: string;
  preferences: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  name: string;
  similarity?: number;
}

