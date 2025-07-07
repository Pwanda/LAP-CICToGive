import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import type {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  User,
} from "../../types/Auth";
import { authService } from "../../services/AuthService.ts";
import { AuthContext } from "../../contexts/AuthContext.tsx";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  // Initialize as true to prevent premature redirects on refresh
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedToken =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (savedUser && savedToken && isLoggedIn) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        clearAuthData();
      } finally {
        // Always set loading to false after initialization
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const saveAuthData = (userData: {
    id: number;
    username: string;
    email: string;
    token?: string;
  }) => {
    const user: User = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    if (userData.token) {
      setToken(userData.token);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("authToken", userData.token); // Backward compatibility
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken"); // Clear both token keys
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      saveAuthData(response);

      // Redirect to the page user was trying to access, or home by default
      const origin = location.state?.from?.pathname || "/home";
      navigate(origin, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.register(data);
      // After successful registration, automatically log in
      await login({ username: data.username, password: data.password });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setIsLoading(false);
      navigate("/", { replace: true });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
