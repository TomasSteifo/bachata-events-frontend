import type {
  AuthMe,
  FestivalDetails,
  FestivalFilters,
  FestivalListItem,
  FestivalUpsert,
  LoginRequest,
  LoginResponse,
  PaginatedResponse,
  RegisterRequest,
} from "@/types";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const TOKEN_KEY = "be_token";

// Token management
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

// Build query string from object
const buildQueryString = (params: Record<string, string | number | undefined>): string => {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return filtered.length > 0 ? `?${filtered.join("&")}` : "";
};

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      response.status === 401
        ? "Unauthorized"
        : response.status === 404
        ? "Not found"
        : errorText || `Request failed with status ${response.status}`
    );
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  
  return JSON.parse(text) as T;
}

// Auth API
export const authApi = {
  register: (data: RegisterRequest): Promise<void> =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (): Promise<AuthMe> => apiFetch("/api/auth/me"),
};

// Public Festivals API
export const festivalsApi = {
  getAll: (filters: FestivalFilters = {}): Promise<PaginatedResponse<FestivalListItem>> => {
    const queryString = buildQueryString({
      country: filters.country,
      startDate: filters.startDate,
      endDate: filters.endDate,
      q: filters.q,
      sortBy: filters.sortBy,
      page: filters.page,
      pageSize: filters.pageSize,
    });
    return apiFetch(`/api/festivals${queryString}`);
  },

  getById: (id: string): Promise<FestivalDetails> =>
    apiFetch(`/api/festivals/${id}`),
};

// Organizer Festivals API
export const organizerApi = {
  getMyFestivals: (): Promise<FestivalListItem[]> =>
    apiFetch("/api/organizers/me/festivals"),

  createFestival: (data: FestivalUpsert): Promise<FestivalDetails> =>
    apiFetch("/api/festivals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateFestival: (id: string, data: FestivalUpsert): Promise<FestivalDetails> =>
    apiFetch(`/api/festivals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteFestival: (id: string): Promise<void> =>
    apiFetch(`/api/festivals/${id}`, {
      method: "DELETE",
    }),

  publishFestival: (id: string, isPublished: boolean): Promise<void> =>
    apiFetch(`/api/festivals/${id}/publish`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished }),
    }),
};
