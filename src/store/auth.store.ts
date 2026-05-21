// src/store/auth.store.ts

import { Platform } from "react-native";
import { create } from "zustand";
import { api } from "../services/api";
import { storage } from "../services/storage";

type AuthState = {
  user: {
    id: string;
    accessToken: string;
    refreshToken: string;
    email: string;
    username: string;
  } | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
  login: (user: {
    accessToken: string;
    refreshToken: string;
    email: string;
    username: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
};

/**
 * Why Zustand?
 * - Simple
 * - No boilerplate
 */

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitializing: true,

  login: async (user: any) => {
    console.log("🚀 ~ user:============[", user)
    if (Platform.OS === "web") {
      localStorage.setItem("accessToken", user.accessToken);
      localStorage.setItem("refreshToken", user.refreshToken);
    } else {
      await storage.set("accessToken", user.accessToken);
      await storage.set("refreshToken", user.refreshToken);
    }
    const res: any = await api.get("/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    console.log("🚀 ~ loadSession ~ res:", res.data?.safeUser);

    if (res.data?.safeUser) {
      set({
        isLoggedIn: true,
        user: res.data.safeUser,
        isInitializing: false,
      });
    }
  },

  logout: async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } else {
      await storage.remove("accessToken");
      await storage.remove("refreshToken");
    }

    set({ user: null, isLoggedIn: false });
  },

  loadSession: async () => {
    try {
      if (Platform.OS === "web") {
        const token = localStorage.getItem("accessToken");
        console.log("🚀 ~ token:", token);
        if (!token) {
          set({ isInitializing: false });
          return;
        }
      } else {
        const token = await storage.get("accessToken");
        console.log("🚀 ~ token:", token);
        if (!token) {
          set({ isInitializing: false });
          return;
        }
      }
      const token = await storage.get("accessToken");
      console.log("🚀 ~ token:", token);
      if (!token) {
        set({ isInitializing: false });
        return;
      }

      const res: any = await api.get("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🚀 ~ loadSession ~ res:", res.data?.safeUser);

      if (res.data?.safeUser) {
        set({
          isLoggedIn: true,
          user: res.data.safeUser,
          isInitializing: false,
        });
      } else {
        set({ isInitializing: false });
      }
    } catch (error) {
      console.error("loadSession error:", error);
      set({ isInitializing: false });
    }
  },
}));
