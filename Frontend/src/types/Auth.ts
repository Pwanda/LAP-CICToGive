export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
