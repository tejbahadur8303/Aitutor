import { create } from "zustand";
import { api } from "../api/axios";

export type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  grade?: string;
  subjects?: string[];
  learningGoals?: string[];
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

const savedUser = localStorage.getItem("edumind-user");
const savedToken = localStorage.getItem("token");

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  isAuthenticated: Boolean(savedToken),
  loading: false,

  login: ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("edumind-user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("edumind-user");
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false, isAuthenticated: false, user: null });
      return;
    }
    set({ loading: true });
    try {
      const res = await api.get("/auth/me");
      const user = res.data.data;
      localStorage.setItem("edumind-user", JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("edumind-user");
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  }
}));