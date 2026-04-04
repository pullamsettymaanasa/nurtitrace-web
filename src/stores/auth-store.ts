import { create } from "zustand";

interface UserInfo {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  has_health_profile: boolean;
}

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: UserInfo) => void;
  updateUser: (user: Partial<UserInfo>) => void;
  clearAuth: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_info", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  updateUser: (updates) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...updates };
      localStorage.setItem("user_info", JSON.stringify(updated));
      set({ user: updated });
    }
  },

  clearAuth: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user_info");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isAuthenticated: true });
      } catch {
        set({ token: null, user: null, isAuthenticated: false });
      }
    }
  },
}));
