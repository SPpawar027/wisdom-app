import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_IMAGE_HEIGHT = 280;

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary: "#00647c",
  onPrimary: "#e2f6ff",
  primaryContainer: "#72d9fd",
  surface: "#f5f6f8",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eff1f3",
  onSurface: "#2c2f31",
  onSurfaceVariant: "#595c5e",
  onSecondaryContainer: "#005b62",
  secondaryContainer: "#a1eff8",
  tertiary: "#a02d70",
  outline: "#757779",
  outlineVariant: "#abadaf",
  cyan100: "#cffafe",
  cyan800: "#155e75",
  cyan900: "#164e63",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STORIES = [
  {
    id: "yours",
    name: "Your Story",
    isYours: true,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "1",
    name: "Arlo",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Sienna",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "3",
    name: "Finn",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: "4",
    name: "Luna",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

const FEED = [
  {
    id: "1",
    type: "post",
    user: "Julian Rivera",
    time: "1h ago",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    caption:
      "The mountains aren't just scenery; they're the quietest teachers we'll ever encounter. Listen to the wind. 🏔️",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    likes: "1.2k",
    comments: "84",
    liked: true,
  },
  {
    id: "quote",
    type: "quote",
    text: '"Adventure is not hanging off a rope on a side of a mountain. Adventure is an attitude that we must apply to the day-to-day obstacles of life."',
    author: "— John Amatt",
  },
  {
    id: "2",
    type: "post",
    user: "Elena Vance",
    time: "3h ago",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    caption:
      "Finding clarity in the vastness. Today's journey through the desert taught me that sometimes, the most beautiful things are the ones that endure the harshest conditions. 🌵✨",
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    likes: "2.5k",
    comments: "152",
    liked: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Top App Bar */
const TopBar = () => (
  <View style={styles.topBar}>
    <View style={styles.topBarLeft}>
      <TouchableOpacity
        onPress={() => router.push("/notification")}
        style={styles.iconBtn}
        activeOpacity={0.75}
      >
        <Text style={styles.iconText}>🔔</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </View>
    <Text style={styles.topBarTitle}>Wisdom</Text>
    <TouchableOpacity activeOpacity={0.8}>
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
        style={styles.topBarAvatar}
      />
    </TouchableOpacity>
  </View>
);

/** Story Ring */
const StoryItem = ({ item }: { item: (typeof STORIES)[0] }) => (
  <TouchableOpacity
    onPress={() => router.push("/status/123")}
    style={styles.storyItem}
    activeOpacity={0.8}
  >
    {item.isYours ? (
      <View style={styles.yourStoryRing}>
        <Image source={{ uri: item.image }} style={styles.storyAvatar} />
        <TouchableOpacity
          onPress={() => router.push("/status/create")}
          style={styles.addStoryBtn}
        >
          <Text style={styles.addStoryIcon}>+</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.storyRing}>
        <View style={styles.storyRingInner}>
          <Image source={{ uri: item.image }} style={styles.storyAvatar} />
        </View>
      </View>
    )}
    <Text style={styles.storyName}>{item.name}</Text>
  </TouchableOpacity>
);

/** Post Card */
const PostCard = ({ item }: any) => {
  const [liked, setLiked] = useState(item.liked);

  return (
    <TouchableOpacity
      onPress={() => router.push("/post/12")}
      style={styles.postCard}
    >
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.postUserRow}>
          <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
          <View>
            <Text style={styles.postUserName}>{item.user}</Text>
            <Text style={styles.postTime}>Posted in u8s • {item.time}</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.moreIcon}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <Text style={styles.postCaption}>{item.caption}</Text>

      {/* Images */}
      {item.images.length === 1 ? (
        <Image
          source={{ uri: item.images[0] }}
          style={styles.postSingleImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.postDualImageRow}>
          {item.images.map((uri: any, i: React.Key | null | undefined) => (
            <Image
              key={i}
              source={{ uri }}
              style={styles.postDualImage}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.75}
            onPress={() => setLiked((v: any) => !v)}
          >
            <Text style={{ fontSize: 20 }}>{liked ? "❤️" : "🤍"}</Text>
            <Text style={styles.actionCount}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
            <Text style={{ fontSize: 18 }}>💬</Text>
            <Text style={styles.actionCount}>{item.comments}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.75}>
          <Text style={{ fontSize: 20 }}>🔖</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/** Quote Card */
const QuoteCard = ({ item }: { item: { text: string; author: string } }) => (
  <View style={styles.quoteCard}>
    <View style={styles.quoteBlob} />
    <Text style={styles.quoteIcon}>-</Text>
    <Text style={styles.quoteText}>{item.text}</Text>
    <Text style={styles.quoteAuthor}>{item.author}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<"discover" | "following">(
    "discover",
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <TopBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sub-nav Tabs */}
        <View style={styles.subNav}>
          {(["discover", "following"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.subNavTab}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subNavText,
                  activeTab === tab
                    ? styles.subNavTextActive
                    : styles.subNavTextInactive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {activeTab === tab && <View style={styles.subNavUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Stories */}
        <FlatList
          data={STORIES}
          keyExtractor={(s) => s.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesRow}
          renderItem={({ item }) => <StoryItem item={item} />}
          style={styles.storiesList}
        />

        {/* Feed Header */}
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Latest Wisdom</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Feed */}
        <View style={styles.feed}>
          {FEED.map((item) =>
            item.type === "quote" ? (
              <QuoteCard key={item.id} item={item as any} />
            ) : (
              <PostCard key={item.id} item={item as any} />
            ),
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/post")}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[C.primary, C.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <MaterialIcons name="add" size={32} color={C.onPrimary} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.surface },
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#b2f0fb",
    shadowColor: C.cyan900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: C.cyan900,
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  topBarAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  iconBtn: { position: "relative", padding: 2 },
  iconText: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  // Sub nav
  subNav: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 20,
    gap: 28,
  },
  subNavTab: { position: "relative", paddingBottom: 8 },
  subNavText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  subNavTextActive: { color: C.cyan900 },
  subNavTextInactive: { color: "rgba(7,89,133,0.45)" },
  subNavUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.primary,
  },

  // Stories
  storiesList: { marginBottom: 24 },
  storiesRow: { paddingHorizontal: 20, gap: 16 },
  storyItem: { alignItems: "center", gap: 6 },
  yourStoryRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e0e3e5",
    position: "relative",
  },
  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    backgroundColor: C.primary,
  },
  storyRingInner: {
    flex: 1,
    borderRadius: 34,
    padding: 2,
    backgroundColor: C.surface,
  },
  storyAvatar: { width: "100%", height: "100%", borderRadius: 999 },
  addStoryBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.primary,
    borderWidth: 2,
    borderColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  addStoryIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  storyName: { fontSize: 11, color: C.onSurfaceVariant, fontWeight: "500" },

  // Feed
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.onSurface,
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  filterIcon: { fontSize: 20 },
  feed: { paddingHorizontal: 16, gap: 24 },

  // Post Card
  postCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  postUserRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20 },
  postUserName: { fontSize: 13, fontWeight: "700", color: C.onSurface },
  postTime: {
    fontSize: 11,
    color: C.tertiary,
    fontWeight: "500",
    marginTop: 1,
  },
  moreIcon: { fontSize: 16, color: C.outline, letterSpacing: 1 },
  postCaption: {
    fontSize: 13,
    color: C.onSurface,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postSingleImage: {
    width: "100%",
    height: CARD_IMAGE_HEIGHT,
    marginHorizontal: 0,
  },
  postDualImageRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    height: 200,
  },
  postDualImage: { flex: 1, borderRadius: 12 },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  postActionsLeft: { flexDirection: "row", gap: 20 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionCount: { fontSize: 12, fontWeight: "700", color: C.onSurface },

  // Quote Card
  quoteCard: {
    backgroundColor: C.secondaryContainer,
    borderRadius: 20,
    padding: 28,
    minHeight: 180,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  quoteBlob: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  quoteIcon: {
    fontSize: 44,
    color: C.onSecondaryContainer,
    lineHeight: 52,
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  quoteText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSecondaryContainer,
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  quoteAuthor: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "500",
    color: C.onSecondaryContainer,
    opacity: 0.7,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 112,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "rgba(0, 100, 124, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 6,
    zIndex: 40,
  },
  fabIcon: {
    color: "#e2f6ff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 36,
    marginTop: -2,
  },
});
