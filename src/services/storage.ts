
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storage = {
  set: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore?.setItemAsync(key, value);
    }
  },

  get: async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore?.getItemAsync(key);
    }
  },

  remove: async (key: string) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore?.deleteItemAsync(key);
    }
  },
};
