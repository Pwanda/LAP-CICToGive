import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/Auth";
import { authApi } from "../utils/api";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authApi.login(
        credentials.username,
        credentials.password,
      );
      return response as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Login failed");
      }
      throw new Error("Login failed");
    }
  },

  async register(data: RegisterRequest): Promise<string> {
    try {
      const response = await authApi.register(
        data.username,
        data.email,
        data.password,
      );
      return response as string;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Registration failed");
      }
      throw new Error("Registration failed");
    }
  },

  async logout(): Promise<void> {
    try {
      authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Don't throw error for logout - always proceed with clearing local state
    }
  },

  async getCurrentUser(): Promise<LoginResponse> {
    try {
      const response = await authApi.getCurrentUser();
      return response as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Failed to get user");
      }
      throw new Error("Failed to get user");
    }
  },
};
