import axios from "axios";
import { Platform } from "react-native";
import { io } from "socket.io-client";
import { storage } from "./storage";
export const baseUrl = "http://10.25.254.27:5000";
// export const baseUrl = "http://192.168.1.196:5000";

console.log("🚀 ~ baseUrl:", baseUrl);
export const api = axios.create({
  baseURL: baseUrl,
});

export const socket = io(baseUrl, { autoConnect: false });

// attach accesstoken atomatically

api.interceptors.request.use(async (config) => {
  const token = await storage.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await storage.get("refreshToken");
      if (refreshToken) {
        const response = await api.post("/api/v1/auth/refresh", {
          refreshToken,
        });
        if (Platform.OS === "web") {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
        } else {
          await storage.set("accessToken", response.data.accessToken);
          await storage.set("refreshToken", response.data.refreshToken);
        }
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);
