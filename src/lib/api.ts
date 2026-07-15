import { APIResponse, User, Workspace, Booking } from '../types.js';

/**
 * Centered Frontend API Client with absolute type-safety
 */
export const api = {
  // Base request helper
  async request<T>(url: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Use VITE_API_URL for production (Vercel), fallback to deployed URL, then relative for local Vite proxy
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const fullUrl = `${baseUrl}${url}`;

    const config: RequestInit = {
      ...options,
      credentials: options.credentials || 'include',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(fullUrl, config);
      const data = await response.json();
      return data as APIResponse<T>;
    } catch (error) {
      console.error(`API Client Error [${url}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'A network connection error occurred.'
      };
    }
  },

  // --- AUTH ENDPOINTS ---
  async getMe(): Promise<APIResponse<User | null>> {
    return api.request<User | null>('/api/auth/me');
  },

  async login(email: string, password: string): Promise<APIResponse<User>> {
    return api.request<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name: string, email: string, password: string): Promise<APIResponse<User>> {
    return api.request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async logout(): Promise<APIResponse<null>> {
    return api.request<null>('/api/auth/logout', {
      method: 'POST',
    });
  },

  // --- WORKSPACE ENDPOINTS ---
  async getWorkspaces(filters: {
    search?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<APIResponse<Workspace[]>> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    return api.request<Workspace[]>(`/api/workspaces?${params.toString()}`);
  },

  async getWorkspaceById(id: string): Promise<APIResponse<Workspace>> {
    return api.request<Workspace>(`/api/workspaces/${id}`);
  },

  async createWorkspace(data: Omit<Workspace, 'id' | 'rating' | 'reviewsCount' | 'ownerId' | 'createdAt'>): Promise<APIResponse<Workspace>> {
    return api.request<Workspace>('/api/workspaces/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteWorkspace(id: string): Promise<APIResponse<{ id: string }>> {
    return api.request<{ id: string }>(`/api/workspaces/delete/${id}`, {
      method: 'DELETE',
    });
  },

  // --- BOOKING ENDPOINTS ---
  async getBookings(): Promise<APIResponse<Booking[]>> {
    return api.request<Booking[]>('/api/bookings');
  },

  async createBooking(data: { workspaceId: string; date: string; startTime: string; durationHours: number }): Promise<APIResponse<Booking>> {
    return api.request<Booking>('/api/bookings/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async cancelBooking(id: string): Promise<APIResponse<{ id: string }>> {
    return api.request<{ id: string }>(`/api/bookings/cancel/${id}`, {
      method: 'POST',
    });
  },

  // --- UTILITY/CONTACT ENDPOINTS ---
  async submitContactForm(data: { name: string; email: string; subject: string; message: string }): Promise<APIResponse<{ message: string }>> {
    return api.request<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getBookingStats(): Promise<APIResponse<any[]>> {
    return api.request<any[]>('/api/stats/bookings');
  }
};
