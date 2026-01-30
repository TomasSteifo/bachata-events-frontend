import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthMe, LoginRequest } from "@/types";
import { authApi, getToken, removeToken, setToken } from "@/lib/api";

interface AuthContextType {
  user: AuthMe | null;
  isLoading: boolean;
  isOrganizer: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    setToken(response.token);
    const userData = await authApi.getMe();
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const isOrganizer = user?.role === "Organizer";

  return (
    <AuthContext.Provider value={{ user, isLoading, isOrganizer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
