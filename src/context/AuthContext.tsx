import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../api/types";
import { login as apiLogin, logout as apiLogout } from "../api/auth";
import { updateProfile, type UpdateProfilePayload } from "../api/user";

export type { User } from "../api/types";

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const userData = await apiLogin(email, password);
    setUser(userData);
  };

  const logout = () => {
    void apiLogout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    const { phone, email, nationality, penName } = updates;
    const profilePayload: UpdateProfilePayload = {};
    if (phone !== undefined) profilePayload.phone = phone;
    if (email !== undefined) profilePayload.email = email;
    if (nationality !== undefined) profilePayload.nationality = nationality;
    if (penName !== undefined) profilePayload.penName = penName;
    if (Object.keys(profilePayload).length > 0) {
      await updateProfile(profilePayload);
    }
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
