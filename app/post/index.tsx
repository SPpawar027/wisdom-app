// NewPostScreen.jsx
import { api } from "@/src/services/api";
import { usePostStore } from "@/src/store/post.store";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Circle, Svg } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Premium Color Palette (Modified from HTML)
const colors = {
  // Surface
  surface: "#f8fafc",
  onSurface: "#1e293b",
  surfaceVariant: "#e2e8f0",
  surfaceContainer: "#f1f5f9",
  surfaceContainerLow: "#f8fafc",
  surfaceContainerHigh: "#e0e3e5",
  surfaceContainerHighest: "#e2e8f0",

  // Primary (Premium Dark)
  primary: "#0f172a",
  onPrimary: "#ffffff",
  primaryContainer: "#f1f5f9",
  onPrimaryContainer: "#004a5d",

  // Secondary
  secondary: "#00666e",
  onSecondary: "#d1faff",
  secondaryContainer: "#a1eff8",
  onSecondaryContainer: "#005b62",

  // Tertiary
  tertiary: "#a02d70",
  onTertiary: "#ffeff3",

  // Utility
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate900: "#0f172a",

  outline: "#94a3b8",
  outlineVariant: "#abadaf",
};

const categories = [
  { id: "quote", label: "Quote", icon: "format-quote", isActive: true },
  { id: "lesson", label: "Life Lesson", icon: "auto-awesome", isActive: false },
  { id: "video", label: "Video Insight", icon: "play-circle", isActive: false },
  { id: "book", label: "Book Summary", icon: "menu-book", isActive: false },
];

const mediaItems = [
  {
    id: "1",
    type: "image",
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWpHhEwqv82GHnrt5JMYekDkU69FQvTIclHGPla0ptHz3RTLe1w_Zpq0DKEA0TqRVYrbhw8g_3nNuDo1dTucYocS_bjGUrQbXbjnDdjLF_dkblhM42CD1rLPc1K-YgVwSqeEV9hL3YCQRBH1w7ZGeRAzVPlkqfy-GwxUEJD-AQ9hjvJTYOntcr6A9PvA2AT5FNOJyTQarkSbJZYmIlId3vXwx2WhH8KWRqol__0pTRGp3ITHjdzeFaJ_xwwphwznHrCbgk0pGV4S4",
  },
  {
    id: "2",
    type: "video",
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWUdScGajdgFL3exFd5xBLrnxdXs_NAQ0e1vpbFtIMwWdAAuwQYqEOnkd0KkKSGfSQLYVJlmKPkzG5q4EVpQTF16h55RaOIOba4Q1oxcfAMor3NuRty2l3NJ-NDkgyU5GwdNFJL5B41cdk_nxGNyFebRUa2e04qrIccczKIdTlPhZ-QTXI5zY2XCOtt9xuQUJfijDk6OTVf_rUwT7oJ_GmKZu-Nw9gyPIBtPP7WgWD5CeN4-IBgE-TNARRq3nsHrgB-a4DVN2BZfc",
  },
];

const CategoryChip = ({ item, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.categoryChip, item.isActive && styles.categoryChipActive]}
  >
    <MaterialIcons
      name={item.icon}
      size={16}
      color={item.isActive ? colors.onPrimary : colors.slate600}
    />
    <Text
      style={[styles.categoryText, item.isActive && styles.categoryTextActive]}
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

const ContextChip = ({ icon, label, hasDropdown = false }: any) => (
  <TouchableOpacity style={styles.contextChip}>
    <MaterialIcons name={icon} size={18} color={colors.slate600} />
    <Text style={styles.contextText}>{label}</Text>
    {hasDropdown && (
      <MaterialIcons name="expand-more" size={16} color={colors.slate600} />
    )}
  </TouchableOpacity>
);

const MediaThumbnail = ({ item, onRemove }: any) => (
  <View style={styles.mediaThumbnail}>
    <Image source={{ uri: item.uri }} style={styles.mediaImage} />
    {item.type === "video" && (
      <View style={styles.videoOverlay}>
        <MaterialIcons name="play-circle" size={32} color={colors.onPrimary} />
      </View>
    )}
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <MaterialIcons name="close" size={14} color={colors.onPrimary} />
    </TouchableOpacity>
  </View>
);

const AddMediaButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.addMediaButton}>
    <MaterialIcons name="add-a-photo" size={28} color={colors.slate400} />
    <Text style={styles.addMediaText}>Media</Text>
  </TouchableOpacity>
);

const ToolbarButton = ({ icon }: any) => (
  <TouchableOpacity style={styles.toolbarButton}>
    <MaterialIcons name={icon} size={24} color={colors.slate500} />
  </TouchableOpacity>
);

const CharacterCount = ({ count, max = 280 }: any) => {
  const percentage = (count / max) * 100;
  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.countContainer}>
      <Text style={styles.countText}>{max - count}</Text>
      <View style={styles.progressContainer}>
        <Svg width={40} height={40} style={styles.progressSvg}>
          <Circle
            cx={20}
            cy={20}
            r={16}
            stroke={colors.slate100}
            strokeWidth={2}
            fill="transparent"
          />
          <Circle
            cx={20}
            cy={20}
            r={16}
            stroke={colors.slate900}
            strokeWidth={2}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90, 20, 20)"
          />
        </Svg>
        <View style={styles.avatarIndicator} />
      </View>
    </View>
  );
};

const NewPostScreen = ({ postData, setPostData }: any) => {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  console.log("🚀 ~ NewPostScreen ~ images:", images);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("quote");

  const pickImages = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 6, // max 6
    });

    if (!result.canceled) {
      const imagesWithId = result.assets.map((img: any) => ({
        ...img,
        id: Math.random().toString(),
      }));
      setImages(imagesWithId);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData: any = new FormData();
    images.forEach((img: any, index) => {
      formData.append("image", {
        uri: img.uri,
        name: img.fileName || `image_${index}.jpg`,
        type: "image/jpeg",
      });
    });
    console.log(
      "🚀 ~ formData parts:",
      JSON.stringify(formData._parts, null, 2),
    );
    formData.append("caption", caption);
    try {
      const res = await api.post("/api/v1/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("🚀 ~ handleUpload ~ res:", res);
      if (res.data.message === "Post created successfully") {
        usePostStore.setState({ postData: [...postData, res.data] });
        router.push("/profile");
      }
      console.log(res.data);
    } catch (err) {
      console.log("Upload Error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Top App Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={24} color={colors.slate400} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Wisdom</Text>
        <TouchableOpacity
          disabled={loading}
          onPress={handleUpload}
          style={styles.postButton}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Context Chips */}
          <View style={styles.contextRow}>
            <ContextChip icon="public" label="Public" hasDropdown />
            <ContextChip icon="location-on" label="Add Location" />
            <ContextChip icon="mood" label="Feeling..." />
          </View>

          {/* Category Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                item={{ ...cat, isActive: activeCategory === cat.id }}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>

          {/* Writing Area */}
          <View style={styles.writingArea}>
            <TextInput
              style={styles.textInput}
              placeholder="What wisdom will you share today?"
              placeholderTextColor={colors.slate300}
              multiline
              value={caption}
              onChangeText={setCaption}
              maxLength={280}
            />
          </View>

          {/* Media Section */}
          <View style={styles.mediaSection}>
            <View style={styles.mediaGrid}>
              <AddMediaButton onPress={pickImages} />
              {images.map((item: any) => (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  onRemove={() => {
                    setImages(images.filter((i: any) => i.id !== item.id));
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Rich Text Toolbar */}
      <BlurView
        intensity={80}
        tint="light"
        style={[styles.toolbar, { paddingBottom: insets.bottom + 8 }]}
      >
        <View style={styles.toolbarContent}>
          <View style={styles.toolbarLeft}>
            <ToolbarButton icon="format-bold" />
            <ToolbarButton icon="format-italic" />
            <ToolbarButton icon="format-list-bulleted" />
            <ToolbarButton icon="link" />
          </View>
          <CharacterCount count={text.length} />
        </View>
        <View style={styles.safeAreaSpacer} />
      </BlurView>

      {/* Background Gradients */}
      <View style={styles.topGradient} />
      <View style={styles.bottomGradient} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    zIndex: 50,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
    letterSpacing: -0.5,
  },
  postButton: {
    backgroundColor: colors.slate900,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  postButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 80 : 60,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 32,
    maxWidth: 672,
    alignSelf: "center",
    width: "100%",
  },
  contextRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  contextChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  contextText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate600,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 32,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryChipActive: {
    backgroundColor: colors.slate900,
    borderColor: colors.slate900,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.slate600,
  },
  categoryTextActive: {
    color: colors.onPrimary,
    fontWeight: "600",
  },
  writingArea: {
    marginTop: 48,
    minHeight: 350,
  },
  textInput: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.onSurface,
    lineHeight: 40,
    textAlignVertical: "top",
  },
  mediaSection: {
    marginTop: 32,
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  addMediaButton: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: colors.slate100,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.slate200,
    justifyContent: "center",
    alignItems: "center",
  },
  addMediaText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.slate400,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 6,
  },
  mediaThumbnail: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: colors.slate100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.05,
    elevation: 1,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  toolbarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    maxWidth: 672,
    alignSelf: "center",
    width: "100%",
  },
  toolbarLeft: {
    flexDirection: "row",
    gap: 32,
  },
  toolbarButton: {
    padding: 4,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate400,
  },
  progressContainer: {
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  progressSvg: {
    transform: [{ rotate: "-90deg" }],
  },
  avatarIndicator: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.slate900,
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
  safeAreaSpacer: {
    height: 32,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 128,
    backgroundColor: "transparent",
    // backgroundGradient: {
    //     colors: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
    //     start: { x: 0, y: 0 },
    //     end: { x: 0, y: 1 },
    // },
    pointerEvents: "none",
    zIndex: -10,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "transparent",
    // backgroundGradient: {
    //     colors: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
    //     start: { x: 0, y: 0 },
    //     end: { x: 0, y: 1 },
    // },
    pointerEvents: "none",
    zIndex: -10,
  },
});

export default NewPostScreen;
