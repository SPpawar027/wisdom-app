// src/services/auth.service.ts

import { AuthResponse } from "../types/auth.types";
import { api } from "./api";

export const loginApi = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await api.post("/api/v1/auth/login", { email, password });
  console.log("🚀 ~ loginApi ~ res:", res.data);
  return res.data;
};

export const registerApi = async (
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await api.post("/api/v1/auth/register", {
    username,
    email,
    password,
  });
  return res.data;
};

export const logoutApi = async (): Promise<AuthResponse> => {
  const res = await api.post("/api/v1/auth/logout");
  return res.data;
};

export const getCurrentUserApi = async () => {
  const res = await api.get("/api/v1/auth/me");
  return res.data;
};
