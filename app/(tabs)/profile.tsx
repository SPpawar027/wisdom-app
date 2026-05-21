// WisdomProfileScreen.jsx
import { deletePostById, getPostsByUserId } from "@/src/services/post.service";
import { useAuthStore } from "@/src/store/auth.store";
import { usePostStore } from "@/src/store/post.store";
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
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_IMAGE_HEIGHT = 280;
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

// Material Design 3 Color Tokens - Exact from HTML
const colors = {
  primary: "#00647c",
  onPrimary: "#e2f6ff",
  primaryContainer: "#72d9fd",
  onPrimaryContainer: "#004a5d",
  primaryFixedDim: "#63cbee",
  onPrimaryFixed: "#003543",
  onPrimaryFixedVariant: "#005469",
  primaryDim: "#00576c",

  secondary: "#00666e",
  onSecondary: "#d1faff",
  secondaryContainer: "#a1eff8",
  onSecondaryContainer: "#005b62",
  secondaryFixed: "#a1eff8",
  secondaryFixedDim: "#93e1ea",
  onSecondaryFixed: "#00474d",
  onSecondaryFixedVariant: "#00666e",
  secondaryDim: "#005960",

  tertiary: "#a02d70",
  onTertiary: "#ffeff3",
  tertiaryContainer: "#ff8bc5",
  onTertiaryContainer: "#630040",
  tertiaryFixed: "#ff8bc5",
  tertiaryFixedDim: "#f976ba",
  onTertiaryFixed: "#360021",
  onTertiaryFixedVariant: "#73004b",
  tertiaryDim: "#912063",

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

  background: "#f5f6f8",
  onBackground: "#2c2f31",

  outline: "#757779",
  outlineVariant: "#abadaf",

  inverseSurface: "#0c0f10",
  inverseOnSurface: "#9b9d9f",
  inversePrimary: "#72d9fd",

  error: "#b31b25",
  onError: "#ffefee",
  errorContainer: "#fb5151",
  onErrorContainer: "#570008",
  errorDim: "#9f0519",

  cyan50: "#ecfeff",
  cyan100: "#cffafe",
  cyan600: "#0891b2",
  cyan900: "#164e63",

  slate400: "#94a3b8",
  slate500: "#64748b",
  slate900: "#0f172a",
};

const tabs = ["Posts", "Saved", "Liked", "About"];

const wisdomData = [
  {
    id: "1",
    type: "text",
    tag: "Stoicism",
    tagColor: "secondary",
    content: "The soul becomes dyed with the color of its thoughts.",
    time: "2 hours ago",
    likes: 12,
  },
  {
    id: "2",
    type: "image",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUJzWbaxOSmGLFn2QP1KXOauaccXTlwrcmsOWhnROeYS9IJjncf19QCuzcDVYLFUUFse7rHS7X9IbMfm735oFSFqZ4Zpg4B-B8Ff9JctKgRl0pZfGq9DMYGzPjU2OnXvdo35I8Z_0haelDjkL8Wp1cb-LmDcf6-cQWBGyH6cdrywcyxxP8pfHBptTKU7lrTwUXR553a4U8j_HO8g6dJJOUpS-UR2KOGNuS7skhGE38A4aYZL4zmn-e_iJw2Uj9cLKgGGt6I1nsuzY",
    caption: "Finding stillness in the movement of the trees.",
    date: "June 14, 2024",
    likes: 245,
    comments: 18,
    isSaved: true,
  },
  {
    id: "3",
    type: "quote",
    label: "Daily Reflection",
    content:
      "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    author: "Marcus Aurelius",
  },
];

const StatCard = ({ value, label }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TabButton = ({ label, isActive, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.tabButton}>
    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
      {label}
    </Text>
    {isActive && <View style={styles.tabIndicator} />}
  </TouchableOpacity>
);

const WisdomProfileCard = (items: any) => {
  const post = items?.items;
  const [liked, setLiked] = useState(post?.liked || false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setMenuVisible(!menuVisible);
    console.log("menu press");
  };
  const handleDeletePress = async (id: string) => {
    console.log("delete press", id);
    try {
      const res = await deletePostById(id);
      if (!res.error) {
        Toast.show({
          type: "success",
          text1: "Post deleted successfully",
        });
        usePostStore.getState().deletePost(id);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: error?.message || "Failed to delete post",
      });
    }
  };
  return (
    <View
      // onPress={() => router.push("/post/12")}
      style={styles.postCard}
    >
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.postUserRow}>
          {/* <Image source={{ uri: item.avatar }} style={styles.postAvatar} /> */}
          <View>
            <Text style={styles.postUserName}>{post?.user?.username}</Text>
            <Text style={styles.postTime}>
              {/* show like 3rd April 2026 */}
              {dayjs(post?.createdAt).format("DD MMMM YYYY")}
            </Text>
          </View>
        </View>
        <View style={styles.postMenuContainer}>
          <TouchableOpacity onPress={handleMenuPress} activeOpacity={0.7}>
            <Text style={styles.moreIcon}>•••</Text>
          </TouchableOpacity>
          {menuVisible && (
            <View style={styles.postMenu}>
              <Text style={styles.postMenuText}>Edit</Text>
              <Text
                onPress={() => handleDeletePress(post._id)}
                style={styles.postMenuText}
              >
                Delete
              </Text>
            </View>
          )}
          {post?.image?.length > 3 && (
            <View>
              <Text>({post?.image?.length})</Text>
            </View>
          )}
        </View>
      </View>

      {/* Caption */}
      <Text style={styles.postCaption}>{post?.caption}</Text>

      {/* Images */}
      {post?.image?.length === 0 ? (
        // make ui for not image
        <View
          style={{
            height: CARD_IMAGE_HEIGHT,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.postCaptionNoImage}>No Image</Text>
        </View>
      ) : post?.image?.length === 1 ? (
        <Image
          source={{
            uri: `https://res.cloudinary.com/dbwoillso/image/upload/${post?.image?.[0].url}`,
          }}
          style={styles.postSingleImage}
          resizeMode="cover"
        />
      ) : post?.image?.length <= 3 ? (
        <View style={styles.postDualImageRow}>
          {post?.image?.map((item: any, i: React.Key | null | undefined) => (
            <Image
              key={item._id}
              source={{
                uri: `https://res.cloudinary.com/dbwoillso/image/upload/${item.url || item} `,
              }}
              style={styles.postDualImage}
              resizeMode="cover"
            />
          ))}
        </View>
      ) : (
        <FlatList
          data={post?.image}
          contentContainerStyle={{ padding: 10 }}
          pagingEnabled={true}
          renderItem={({ item }) => (
            <View style={{ width: Dimensions.get("window").width - 50 }}>
              <Image
                source={{
                  uri: `https://res.cloudinary.com/dbwoillso/image/upload/${item.url} `,
                }}
                style={{
                  width: "100%",
                  height: CARD_IMAGE_HEIGHT,
                  marginRight: 10,
                }}
                resizeMode="cover"
              />
            </View>
          )}
          keyExtractor={(item: any) => item}
          horizontal={true}
        />
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
            <Text style={styles.actionCount}>{post?.likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
            <Text style={{ fontSize: 18 }}>💬</Text>
            <Text style={styles.actionCount}>{post?.commentsCount}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.75}>
          <Text style={{ fontSize: 20 }}>🔖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const WisdomImageCard = ({ item }: any) => (
  <View style={styles.wisdomImageCard}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={styles.wisdomImage} />
      <View style={styles.imageGradient} />
      <View style={styles.imageOverlay}>
        <Text style={styles.imageCaption}>{item.caption}</Text>
        <Text style={styles.imageDate}>{item.date}</Text>
      </View>
    </View>
    <View style={styles.imageCardFooter}>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons
            name="favorite"
            size={24}
            color={colors.onSurfaceVariant}
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons
            name="chat-bubble"
            size={24}
            color={colors.onSurfaceVariant}
          />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <MaterialIcons
          name="bookmark"
          size={24}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const WisdomQuoteCard = ({ item }: any) => (
  <View style={styles.wisdomQuoteCard}>
    <Text style={styles.quoteLabel}>{item.label}</Text>
    <Text style={styles.quoteContent}>{item.content}</Text>
    <Text style={styles.quoteAuthor}>— {item.author}</Text>
  </View>
);

const WisdomProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Posts");
  const { user }: any = useAuthStore();
  const postData = usePostStore((state) => {
    return state.postData;
  });
  const [refreshing, setRefreshing] = useState(false);
  const getPosts = async () => {
    if (!user?.id) return;
    const res = await getPostsByUserId(user.id);
    usePostStore.setState({ postData: res });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    getPosts();
  }, [user?.id]);
  const renderHeader = () => (
    <>
      {/* Hero Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      />

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNJUQwcR_gtXj6ImkcS90gFNnK_eXeC9jj9htXXB4Fex4BmfC5rG_rARzPJNQlJM86VjnczGi-865DS3rv3arm0uRimW5wEBO_P3e30FNvK-hDrpUs1efTYOycb4bU807ItHomzMV5YY48xXBhe9ZtJ4QGNekvKTmy5dtoRZPmagJfctfZSloOV86tgyKt52hi3wmr4YA5HB-3Hd283Omknxn8v-jRVictP3gm7dRDPn3HP4BTCEan_id_AIRWRZWMtMdFH7tWdKc",
            }}
            style={styles.profileAvatar}
          />
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={12} color={colors.onPrimary} />
          </View>
        </View>

        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.profileName}>{user?.username}</Text>
            <Text style={styles.profileHandle}>@{user?.username}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/editprofile")}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.profileBio}>
          Spreading mindfulness and stoic principles for a modern world. 🌿
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <StatCard value="1.2k" label="Followers" />
        <StatCard value="450" label="Following" />
        <StatCard value="84" label="Wisdom" />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Add a little space before the content starts */}
      <View style={{ height: 16 }} />
    </>
  );

  const renderContent = () => {
    let data;
    let renderItem;
    let keyExtractor;

    switch (activeTab) {
      case "Posts":
        data = postData;
        renderItem = ({ item }: any) => <WisdomProfileCard items={item} />;
        keyExtractor = (item: any) => item._id;
        break;
      case "Saved":
        data = wisdomData.filter((i) => i.type === "image");
        renderItem = ({ item }: any) => <WisdomImageCard item={item} />;
        keyExtractor = (item: any) => item.id;
        break;
      case "Liked":
        data = wisdomData.filter((i) => i.type === "quote");
        renderItem = ({ item }: any) => <WisdomQuoteCard item={item} />;
        keyExtractor = (item: any) => item.id;
        break;
      case "About":
        // For 'About', we can render it as part of the list or handle it differently.
        // Here, we'll render it as a single item in the list.
        data = [{ id: "about_section" }];
        renderItem = () => <Text style={{ padding: 24 }}>About section.</Text>;
        keyExtractor = (item: any) => item.id;
        break;
      default:
        return null;
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 140,
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Top App Bar */}
      <BlurView
        intensity={80}
        tint="light"
        style={[styles.topBar, { paddingTop: insets.top }]}
      >
        <View style={styles.topBarContent}>
          <View style={styles.topBarLeft}>
            <Text style={styles.headerTitle}>Wisdom Profile</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.navigate("/setting")}
            style={styles.iconButton}
          >
            <MaterialIcons name="settings" size={24} color={colors.cyan600} />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Main Content using FlatList */}
      <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 90 : 70 }}>
        {renderContent()}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/post")}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <MaterialIcons name="add" size={32} color={colors.onPrimary} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  postMenuText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.onSurface,
    letterSpacing: 1,
    textDecorationLine: "underline",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "rgba(0, 100, 124, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  topBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.cyan900,
    letterSpacing: -0.5,
  },
  mainContent: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 60 : 40,
  },
  heroGradient: {
    width: "100%",
    height: 192,
  },
  profileSection: {
    paddingHorizontal: 24,
    marginTop: -64,
  },
  avatarWrapper: {
    position: "relative",
    alignSelf: "flex-start",
  },
  profileAvatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.surfaceContainerHigh,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 4,
    right: 8,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 16,
    width: "100%",
  },
  profileName: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  profileHandle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
    letterSpacing: 1,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.onSurface,
  },
  profileBio: {
    fontSize: 18,
    color: colors.onSurfaceVariant,
    lineHeight: 28,
    marginTop: 16,
    fontStyle: "italic",
    maxWidth: 400,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.tertiary,
    textTransform: "uppercase",
    // letterSpacing: 2,
    marginTop: 4,
  },
  tabsContainer: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  tabsScroll: {
    gap: 32,
    paddingRight: 24,
  },
  tabButton: {
    position: "relative",
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.onSurfaceVariant,
    opacity: 0.6,
  },
  tabTextActive: {
    color: colors.primary,
    opacity: 1,
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  wisdomContainer: {
    marginTop: 16,
    gap: 32,
  },
  wisdomTextCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 28,
    overflow: "hidden",
    position: "relative",
    shadowColor: "rgba(0, 100, 124, 0.04)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 30,
    elevation: 2,
  },
  decorativeCircle: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.secondaryContainer + "1A", // 10% opacity
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  tagContainer: {
    backgroundColor: colors.secondaryContainer,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.onSecondaryContainer,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.outlineVariant,
  },
  wisdomQuote: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.onSurface,
    lineHeight: 32,
    marginBottom: 24,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  avatarStack: {
    flexDirection: "row",
  },
  stackAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surface,
    marginLeft: -8,
  },
  stackAvatarMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    marginLeft: -8,
    justifyContent: "center",
    alignItems: "center",
  },
  stackAvatarText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.onPrimary,
  },
  wisdomImageCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "rgba(0, 100, 124, 0.04)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 30,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    height: 256,
  },
  wisdomImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  imageCaption: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 28,
  },
  imageDate: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
  },
  imageCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.onSurfaceVariant,
  },
  wisdomQuoteCard: {
    backgroundColor: colors.tertiary + "0D", // 5% opacity
    borderLeftWidth: 4,
    borderLeftColor: colors.tertiary,
    borderRadius: 12,
    padding: 28,
  },
  quoteLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
  },
  quoteContent: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.onSurface,
    lineHeight: 32,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.tertiary,
    marginTop: 16,
  },
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
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "rgba(0, 100, 124, 0.06)",
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 40,
    elevation: 8,
    zIndex: 50,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cyan100,
    borderRadius: 9999,
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.slate400,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.cyan900,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
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
    marginHorizontal: 24,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  postUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  postAvatar: { width: 40, height: 40, borderRadius: 20 },
  postUserName: { fontSize: 13, fontWeight: "700", color: C.onSurface },
  postTime: {
    fontSize: 11,
    color: C.tertiary,
    fontWeight: "500",
    marginTop: 1,
  },
  postMenuContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
    position: "relative",
  },
  postMenu: {
    position: "absolute",
    top: 20,
    gap: 8,
    right: 0,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 36,
    elevation: 3,
    zIndex: 20,
  },
  moreIcon: {
    fontSize: 16,
    color: C.outline,
    letterSpacing: 1,
  },
  postCaption: {
    fontSize: 13,
    color: C.onSurface,
    lineHeight: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
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
  postCaptionNoImage: {
    fontSize: 12,
    fontWeight: "500",
    color: C.tertiary,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});

export default WisdomProfileScreen;
