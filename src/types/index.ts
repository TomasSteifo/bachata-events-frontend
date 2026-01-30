// Festival types
export interface FestivalListItem {
  id: string;
  title: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  isPublished?: boolean;
}

export interface FestivalDetails {
  id: string;
  title: string;
  description?: string;
  country: string;
  city: string;
  venueName?: string;
  startDate: string;
  endDate: string;
  websiteUrl?: string;
  ticketUrl?: string;
  organizer: {
    displayName: string;
    instagram?: string;
    website?: string;
  };
}

export interface FestivalUpsert {
  title: string;
  description?: string;
  country: string;
  city: string;
  venueName?: string;
  startDate: string;
  endDate: string;
  websiteUrl?: string;
  ticketUrl?: string;
}

// Auth types
export interface AuthMe {
  userId: string;
  email: string;
  role: "Organizer" | "User";
  organizerProfileId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: "Organizer" | "User";
  displayName?: string;
  website?: string;
  instagram?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface FestivalFilters {
  country?: string;
  startDate?: string;
  endDate?: string;
  q?: string;
  sortBy?: "startDateAsc" | "startDateDesc";
  page?: number;
  pageSize?: number;
}
