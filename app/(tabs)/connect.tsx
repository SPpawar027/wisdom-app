// WisdomConnectScreen.jsx
import { useChat } from "@/src/hooks/api_hooks/useChat";
import { followService } from "@/src/services/follow.service";
import { useChatStore } from "@/src/store/chat.store";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Material Design 3 Color Tokens - Exact from HTML
const colors = {
  // Primary
  primary: "#00647c",
  onPrimary: "#e2f6ff",
  primaryContainer: "#72d9fd",
  onPrimaryContainer: "#004a5d",
  primaryFixedDim: "#63cbee",
  onPrimaryFixed: "#003543",
  onPrimaryFixedVariant: "#005469",

  // Secondary
  secondary: "#00666e",
  onSecondary: "#d1faff",
  secondaryContainer: "#a1eff8",
  onSecondaryContainer: "#005b62",
  secondaryFixed: "#a1eff8",
  secondaryFixedDim: "#93e1ea",
  onSecondaryFixed: "#00474d",
  onSecondaryFixedVariant: "#00666e",

  // Tertiary
  tertiary: "#a02d70",
  onTertiary: "#ffeff3",
  tertiaryContainer: "#ff8bc5",
  onTertiaryContainer: "#630040",
  tertiaryFixed: "#ff8bc5",
  tertiaryFixedDim: "#f976ba",
  onTertiaryFixed: "#360021",
  onTertiaryFixedVariant: "#73004b",

  // Surface
  surface: "#f5f6f8",
  onSurface: "#2c2f31",
  surfaceVariant: "#dadde0",
  onSurfaceVariant: "#595c5e",
  surfaceBright: "#f5f6f8",
  surfaceDim: "#d1d5d8",
  surfaceContainer: "#e6e8eb",
  surfaceContainerLow: "#eff1f3",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerHigh: "#e0e3e5",
  surfaceContainerHighest: "#dadde0",

  // Background
  background: "#f5f6f8",
  onBackground: "#2c2f31",

  // Outline
  outline: "#757779",
  outlineVariant: "#abadaf",

  // Inverse
  inverseSurface: "#0c0f10",
  inverseOnSurface: "#9b9d9f",
  inversePrimary: "#72d9fd",

  // Error
  error: "#b31b25",
  onError: "#ffefee",
  errorContainer: "#fb5151",
  onErrorContainer: "#570008",
  errorDim: "#9f0519",

  // Additional
  green500: "#22c55e",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  cyan600: "#0891b2",
  cyan700: "#0e7490",
  cyan800: "#155e75",
  cyan100: "#cffafe",
};

const ChatItem = ({ item, isActive }: any) => {
  return (
    <TouchableOpacity
      style={[styles.chatItem, isActive && styles.chatItemActive]}
      onPress={() =>
        router.push({
          pathname: "/chat/[id]",
          params: { id: item._id, username: item.username },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIJOUgqiNn0L2q6MedraXGs8un4vdfcftO8Q&s",
          }}
          style={styles.avatar}
        />
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: item.isOnline
                ? colors.green500
                : colors.slate300,
            },
          ]}
        />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.username}
          </Text>
          <Text
            style={[styles.chatTime, isActive && { color: colors.tertiary }]}
          >
            {dayjs(item.createdAt).format("MMM D, YYYY")}
          </Text>
        </View>
        <Text
          style={[styles.chatMessage, isActive && styles.chatMessageActive]}
          numberOfLines={isActive ? 2 : 1}
        >
          {item.message}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const GroupChatItem = ({ item, isActive }: any) => {
  console.log("🚀 ~ GroupChatItem ~ item:", item);
  return (
    <TouchableOpacity
      style={[styles.chatItem, isActive && styles.chatItemActive]}
      onPress={() =>
        router.push({
          pathname: "/chat/group/[id]",
          params: { id: item._id, username: item.name },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVXtNp-ahiG2m2IgaNvzfwl2rRLsUVlVrcdg&s",
          }}
          style={styles.avatar}
        />
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: item.isOnline
                ? colors.green500
                : colors.slate300,
            },
          ]}
        />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name}({item?.member?.length ?? 0})
          </Text>
          <Text
            style={[styles.chatMessage, isActive && styles.chatMessageActive]}
            numberOfLines={isActive ? 2 : 1}
          >
            {item.category}
          </Text>
          <Text
            style={[styles.chatTime, isActive && { color: colors.tertiary }]}
          >
            {dayjs(item.createdAt).format("MMM D, YYYY")}
          </Text>
        </View>
        <Text
          style={[styles.chatMessage, isActive && styles.chatMessageActive]}
          numberOfLines={isActive ? 2 : 1}
        >
          {item.description}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const SectionDivider = ({ title }: any) => (
  <View style={styles.sectionDivider}>
    <Text style={styles.sectionLabel}>{title}</Text>
    <View style={styles.dividerLine} />
  </View>
);

const WisdomConnectScreen = () => {
  const insets = useSafeAreaInsets();
  const [chatData, setChatData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  console.log("🚀 ~ WisdomConnectScreen ~ groupData:", groupData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("Chats");
  const { getUserList } = followService();
  const { GetGroupsList } = useChat();
  const { groups, addGroup, removeGroup, setGroups, clearGroups }: any =
    useChatStore();
  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.pageTitle}>Connect</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Chats" && styles.tabActive]}
          onPress={() => setActiveTab("Chats")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "Chats" && styles.tabLabelActive,
            ]}
          >
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Groups" && styles.tabActive]}
          onPress={() => setActiveTab("Groups")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "Groups" && styles.tabLabelActive,
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Groups" && (
        <TouchableOpacity
          onPress={() => router.push("/chat/creategroup")}
          style={styles.createGroupBtn}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createGroupGradient}
          >
            <MaterialIcons
              name="group-add"
              size={24}
              color={colors.surfaceContainerLowest}
            />
            <Text style={styles.createGroupText}>Create Group</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={24}
          color={colors.outline}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab.toLowerCase()}`}
          placeholderTextColor={colors.outline}
        />
      </View>
    </View>
  );
  useEffect(() => {
    setLoading(true);
    if (activeTab === "Chats") {
      getUserList()
        .then((res) => {
          setChatData(res?.users);
        })
        .catch((err) => {
          console.log("🚀 ~ WisdomConnectScreen ~ err:", err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      clearGroups();
      GetGroupsList()
        .then((res) => {
          console.log("🚀 ~ WisdomConnectScreen ~ res:", res);
          // setGroupData(res?.groups);
          setGroups(res?.groups);
        })
        .catch((err) => {
          console.log("🚀 ~ WisdomConnectScreen ~ err:", err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Top App Bar with Blur */}
      <BlurView
        intensity={80}
        tint="light"
        style={[styles.topBar, { paddingTop: insets.top }]}
      >
        <View style={styles.topBarContent}>
          <View style={styles.topBarLeft}>
            <View style={styles.userAvatar}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR_2FTCo8vS75hsYT8U4250LJcI4kkkZSevlPAnQAaeXKinqT07CtGHYQPWTnYigk7R9U4LrgIV-vwkL2-bE3uOAYezlDcm6AkU5x3elMDZ8Nnpe-0ElCdsYfmg9uEskuF4WiuBZPsgGKr-kxLIxZKEEcFJ3RI5vPAq61Nm_waA5i5QqMpdz8M-acsIbsMNtHBWSx1qs3z2F72sZU46zItgtFXFoQr6MarfN8Y9rNOHwI8LttFM_4YeZxbTVdA2PWsj20_4zFgoOY",
                }}
                style={styles.userAvatarImage}
              />
            </View>
            <Text style={styles.logoText}>Wisdom</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
            <MaterialIcons name="settings" size={24} color={colors.cyan700} />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Main Content */}
      {activeTab === "Chats" ? (
        <View style={styles.chatList}>
          <FlatList
            data={chatData}
            keyExtractor={(item: any) => item._id}
            contentContainerStyle={{ paddingBottom: 100, gap: 12 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => <ChatItem item={item} isActive={true} />}
          />

          <SectionDivider title="Earlier this week" />
        </View>
      ) : (
        <View style={styles.chatList}>
          <FlatList
            data={groups}
            keyExtractor={(item: any) => item._id}
            contentContainerStyle={{ paddingBottom: 100, gap: 12 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
              <GroupChatItem item={item} isActive={true} />
            )}
          />

          <SectionDivider title="Earlier this week" />
        </View>
      )}
      {/* FAB for New Chat */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <MaterialIcons name="edit" size={28} color={colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "rgba(0, 100, 124, 0.06)",
    shadowOffset: { width: 0, height: 40 },
    shadowRadius: 60,
    shadowOpacity: 1,
    elevation: 4,
  },
  topBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: 768,
    alignSelf: "center",
    width: "100%",
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    overflow: "hidden",
  },
  userAvatarImage: {
    width: "100%",
    height: "100%",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.cyan800,
    fontStyle: "italic",
    letterSpacing: -0.5,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 9999,
  },
  headerSection: {
    paddingHorizontal: 12,
    marginBottom: 20,
    marginTop: 120,
    paddingTop: 20,
    maxWidth: 672,
    alignSelf: "center",
    width: "100%",
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 12,
    marginLeft: -2,
  },
  createGroupBtn: {
    marginBottom: 20,
    width: "100%",
    shadowColor: "rgba(0, 100, 124, 0.15)",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 4,
  },
  createGroupGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 9999,
    gap: 8,
  },
  createGroupText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.surfaceContainerLowest,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 9999,
    padding: 6,
    marginBottom: 24,
    alignSelf: "center",
    width: "100%",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 9999,
  },
  tabActive: {
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.onSurfaceVariant,
  },
  tabLabelActive: {
    color: colors.onSurface,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: "400",
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 10,
    maxWidth: 672,
    alignSelf: "center",
    width: "100%",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: "rgba(0, 100, 124, 0.06)",
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    shadowOpacity: 0,
    elevation: 1,
  },
  chatItemActive: {
    shadowOpacity: 1,
  },
  avatarContainer: {
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  chatContent: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
    flex: 1,
    paddingRight: 8,
  },
  chatTime: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.outline,
  },
  chatMessage: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    fontWeight: "400",
  },
  chatMessageActive: {
    lineHeight: 22,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    alignSelf: "center",
  },
  unreadText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: "700",
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.outline,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.surfaceContainer,
  },
  fab: {
    position: "absolute",
    bottom: 112,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 100, 124, 0.3)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 6,
    zIndex: 40,
  },
});

export default WisdomConnectScreen;
