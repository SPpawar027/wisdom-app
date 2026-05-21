import { useColorScheme } from "@/hooks/use-color-scheme";
import { getSocket, joinChat } from "@/src/services/chat.service";
import { useAuthStore } from "@/src/store/auth.store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Stack, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadSession = useAuthStore((state) => state.loadSession);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const rootNavigationState = useRootNavigationState();
  // navigation is ready or not, if not ready, then return null
  const userId = useAuthStore((state) => state.user?.id);
  console.log("🚀 ~ RootLayout ~ userId:", userId);
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    const socket = getSocket();

    // Only connect if not already connected
    if (!socket.connected) {
      console.log("🔌 Attempting to connect socket...");
      socket.connect();
    }

    const onConnect = () => {
      console.log("✅ Connected to server with ID:", socket.id);
      if (userId) {
        console.log("👤 Joining chat for user:", userId);
        joinChat(userId);
      }
    };

    const onDisconnect = () => {
      console.log("❌ Disconnected from server");
    };

    const onMessage = (data: any) => {
      console.log("📩 Message from server:", data);
    };

    socket.on("connect", onConnect);
    socket.on("send_message", onMessage);
    socket.on("disconnect", onDisconnect);

    // If already connected when effect runs (e.g. userId changed)
    if (socket.connected && userId) {
      joinChat(userId);
    }

    return () => {
      console.log("🧹 Cleaning up socket listeners...");
      socket.off("connect", onConnect);
      socket.off("send_message", onMessage);
      socket.off("disconnect", onDisconnect);
      // We don't necessarily want to disconnect here if the layout is still mounted
      // but Expo Router might re-mount layout in some cases.
      // However, for typical web reloads, this is fine.
    };
  }, [userId]);

  useEffect(() => {
    if (!rootNavigationState?.key || isInitializing || !userId) return;

    if (isLoggedIn) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isLoggedIn, isInitializing, rootNavigationState?.key, userId]);
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView>
        {isLoggedIn ? (
          <Stack
            initialRouteName="(tabs)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
        ) : (
          <Stack
            initialRouteName="(auth)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        )}
        <Toast />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
