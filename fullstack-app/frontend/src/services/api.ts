// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Type definitions
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Item {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  location?: string;
  imageUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

// Helper function to get auth header
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Auth API service
export const authApi = {
  // Login
  login: async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginRequest),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      username: data.username,
      email: data.email,
    }));
    
    return data;
  },
  
  // Register
  register: async (registerRequest: RegisterRequest): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerRequest),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Registration failed');
    }
    
    return response.text();
  },
  
  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// File upload API service
export const uploadApi = {
  // Upload images
  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload images');
    }
    
    return response.json();
  },
};

// Items API service
export const itemsApi = {
  // Get all items with pagination and filtering
  getAll: async (
    page: number = 0,
    size: number = 10,
    category?: string,
    search?: string,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<PaginatedResponse<Item>> => {
    let url = `${API_BASE_URL}/items?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    
    return response.json();
  },

  // Get item by ID
  getById: async (id: number): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch item with ID ${id}`);
    }
    return response.json();
  },

  // Create a new item
  create: async (item: Item): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create item');
    }
    
    return response.json();
  },

  // Update an existing item
  update: async (id: number, item: Item): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update item with ID ${id}`);
    }
    
    return response.json();
  },

  // Delete an item
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete item with ID ${id}`);
    }
  },
  
  // Get current user's items
  getMyItems: async (): Promise<Item[]> => {
    const response = await fetch(`${API_BASE_URL}/items/my-items`, {
      headers: getAuthHeader(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch your items');
    }
    
    return response.json();
  },
};
