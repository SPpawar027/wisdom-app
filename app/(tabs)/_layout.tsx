import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = "#00647c";
const PRIMARY_CONTAINER = "#c8f0fc"; // light cyan bubble
const INACTIVE = "#9399a0";
const BG = "#f5f6f8";

// ─── Custom Tab Bar Icon — active "bubble" style (used for Explore) ──────────
function ExploreTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.bubbleWrap, focused && styles.bubbleWrapActive]}>
      <Ionicons name="compass" size={28} color={focused ? PRIMARY : INACTIVE} />
    </View>
  );
}
// ─── Wisdom sparkle icon (✦✦) ─────────────────────────────────────────────
function WisdomTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.wisdomIconWrap}>
      {/* Big sparkle */}
      <Text style={[styles.sparkle, { color: focused ? PRIMARY : INACTIVE }]}>
        ✦
      </Text>
      {/* Small sparkle top-right */}
      <Text style={[styles.sparkleSm, { color: focused ? PRIMARY : INACTIVE }]}>
        ✦
      </Text>
    </View>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: PRIMARY,
          tabBarInactiveTintColor: INACTIVE,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={22} color={color} />
            ),
          }}
        />

        {/* Explore — active bubble state */}
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ focused }) => <ExploreTabIcon focused={focused} />,
          }}
        />

        {/* Wisdom — sparkle icon */}
        <Tabs.Screen
          name="connect"
          options={{
            title: "Connect",
            tabBarIcon: ({ focused }) => <WisdomTabIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="connection"
          options={{
            title: "Connection",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="list"
                size={22}
                color={focused ? PRIMARY : INACTIVE}
              />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BG,
    borderTopWidth: 0,
    height: Platform.OS === "ios" ? 84 : 68,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    paddingTop: 4,
    paddingHorizontal: 8,
    borderRadius: 24,
    // Floating card look
    left: 12,
    right: 12,
    marginBottom: Platform.OS === "ios" ? 6 : 2,
    position: "absolute",
    shadowColor: "#00647c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tabItem: {
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: -0.1,
    marginTop: 2,
  },
  tabLabelExplore: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: -0.1,
    marginTop: 2,
    color: PRIMARY,
  },

  // Explore bubble
  bubbleWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -6,
  },
  bubbleWrapActive: {
    // backgroundColor: PRIMARY_CONTAINER,
  },

  // Wisdom sparkle
  wisdomIconWrap: {
    width: 28,
    height: 28,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "300",
  },
  sparkleSm: {
    fontSize: 11,
    position: "absolute",
    top: -2,
    right: -6,
  },
});
