// API utility for handling authenticated requests
const API_BASE_URL = "http://localhost:8080";

interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface AvatarUploadResponse {
  avatarUrl: string;
  message: string;
}

interface SuccessResponse {
  message: string;
  status: string;
}

export const api = {
  // Get auth token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!api.getToken();
  },

  // Base fetch with authentication
  fetch: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = api.getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete (config.headers as Record<string, string>)["Content-Type"];
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // Handle 401 responses
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    return response;
  },

  // GET request
  get: async (url: string): Promise<Response> => {
    return api.fetch(url, { method: "GET" });
  },

  // POST request
  post: async (
    url: string,
    data: FormData | Record<string, unknown>,
  ): Promise<Response> => {
    return api.fetch(url, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  // PUT request
  put: async (
    url: string,
    data: Record<string, unknown>,
  ): Promise<Response> => {
    return api.fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: async (url: string): Promise<Response> => {
    return api.fetch(url, { method: "DELETE" });
  },
};

// Profile API endpoints
export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get("/api/profile");
    if (!response.ok) {
      let errorMessage = "Failed to get profile";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<AvatarUploadResponse> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/api/profile/avatar", formData);
    if (!response.ok) {
      let errorMessage = "Failed to upload avatar";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Remove avatar
  removeAvatar: async (): Promise<SuccessResponse> => {
    const response = await api.delete("/api/profile/avatar");
    if (!response.ok) {
      let errorMessage = "Failed to remove avatar";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<SuccessResponse> => {
    const response = await api.post("/api/profile/change-password", {
      currentPassword,
      newPassword,
    });
    if (!response.ok) {
      let errorMessage = "Failed to change password";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },
};

// Auth API endpoints
export const authApi = {
  // Login
  login: async (
    username: string,
    password: string,
  ): Promise<{
    token: string;
    id: number;
    username: string;
    email: string;
    avatarUrl?: string;
  }> => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let errorMessage = "Login failed";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  // Register
  register: async (
    username: string,
    email: string,
    password: string,
  ): Promise<string> => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      let errorMessage = "Registration failed";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  // Get current user
  getCurrentUser: async (): Promise<{
    id: number;
    username: string;
    email: string;
    avatarUrl?: string;
  }> => {
    const response = await api.get("/api/auth/me");
    if (!response.ok) {
      let errorMessage = "Failed to get current user";
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem("token");
  },
};
