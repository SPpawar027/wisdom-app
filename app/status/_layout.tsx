// app/(app)/status/_layout.tsx
import { Stack } from "expo-router";

export default function StatusLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom", // iOS style slide up
        presentation: "fullScreenModal", // Covers everything including tabs
        gestureEnabled: true, // Allow swipe down to close
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="[userId]"
        options={{
          animation: "fade", // Smooth fade between statuses
        }}
      />
      <Stack.Screen name="create" />
    </Stack>
  );
}
