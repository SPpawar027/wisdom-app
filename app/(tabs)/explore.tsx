// ExploreScreen.jsx
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Material Design 3 Color Tokens (Light Theme)
const colors: any = {
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
};

// Fonts
const fonts = {
  headline: "PlusJakartaSans-Bold",
  body: "Inter-Regular",
  label: "Inter-Medium",
};

// Data
const trendingTopics = [
  { id: "1", label: "Stoicism", type: "secondary" },
  { id: "2", label: "Mindfulness", type: "tertiary" },
  { id: "3", label: "Leadership", type: "default" },
  { id: "4", label: "Relationships", type: "default" },
  { id: "5", label: "Creativity", type: "default" },
  { id: "6", label: "Philosophy", type: "default" },
];

const trendingWisdom = [
  {
    id: "1",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    tag: "Daily Insight",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWbS2O69GmZc9YN2E6D9VMvj5xTIu2raCyF1ISKfN31WmdKXeN0lCnCIKMaOS38DFxpqVAg8f4yK0YZlR7dvW9DwYbh2pz0u3n6jALNN6DoTxYBKK4AmcFJXhr9GeGurBMTwb4OExbPMdCd_GC8azqepxNAR0m3a2djFaeBR0WgFcikrvKugXUE-La77k9oZ38kvs786h4dMvID-wzaVsFlsXeOyBmGhGtmM51IIROv9tJmQc1A6XOf6AQzmgKN59n4zv5fBdekeQ",
  },
  {
    id: "2",
    title: "Flow & Focus",
    author: "Mihaly Csikszentmihalyi",
    tag: "Creativity",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbVxs4CUT-Te03Co3OolSuiwJTW77NUUVfk3b4tpeavfK3Og0eZz8BNhP1qDe7YZUKRNNNvd5A5XAVQG7NUPIASu-UWHZb9_M4FRwLHaPxGu4FUBC4FrM-v84MNsMLjzpJsYkW4BriK3uaOkekcxMXjKAQkol9syFKQgQ24aMicy5ZSAjU-tmkfl51bi5klriXbtN2TOZ1vMqILBS634fqh_R19qUgN5elYAF5GIDhJtzVccs11qXmRhu3lHYnqfUv9jzCn_PMcAY",
  },
];

const forYouContent = [
  {
    id: "1",
    type: "quote",
    tag: "Wisdom of the Ages",
    tagColor: "tertiary",
    quote: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius",
  },
  {
    id: "2",
    type: "video",
    tag: "Mindfulness",
    tagColor: "secondary",
    title: "Morning Breathwork Routine",
    subtitle: "Sadhguru Wisdom",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7hPDO0zgQ78FfWQIBMtdZtB83JAUnH7O-DXyKqBeAoNbbCMYbHTsJNy7_E4pfFZFSo2LpgkncjPHDdAtP6JmAF5H0iclJXQ2KzSC5XnvZZq2ft0zVqzQBmkYa6sdc03eIg-q1cLLoD1Wu7zY-yTudAD5B-PJhNDlAAblqFRC1lV9o4WGCbphz-1FspYZmlSbLNTYRxxF1cr5aWJkA_1lvwhvAk5rELh_DQ63zBXRTPGytm05VcY2tbbNEZgdozkZSgM3U6EijeIU",
  },
  {
    id: "3",
    type: "article",
    tag: "Environment",
    tagColor: "primary",
    title: "Biophilia: Why We Need The Wild",
    description:
      "Discover how our biological connection to the natural world shapes our mental health and creative clarity.",
    author: "Dr. Julian Vance",
    authorImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAusE-OCjQjYuOHmAuw8mLntx4sTJIMzBn3QJ4l7YchJX9VPpf_Sr37AADG9HtT4u4uEgqvp-2NLvSMc-uPW3NI-nrAc8y5uGVAG1Z7idEzhp8CK3IXqZ-Q1PpbmGxMs-TgyAupyf8nqcexygEncdiAiCVjHdRL6JQwwNpdNxhE2qyddK2W-G6va_pebMCBfIgLxqmRlQ4pj_b4iYOBS4jcHs08ECVH14o_mLLX9OS37OMQRjVSVJzremOfaY4x3d2lYEizKf2oqlA",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCV8vyhDNefvstqQgnjiTJRFZTTI29JQZjAIWhZ8C9UxtrqYg-Bccq_y-PKbgig0MOyjz3_E6fTw38Ku2iQ1zXKbIqHciIV2YqWeLIhKFdYls1oz5ksG9tKYK3NOz_g9j3oPq8OR1F_NC3glyJ5RlW0Q7yXocnkFnFGcLDPs__dMGBZ0kKkGSmvZ1EIV-iwZAwbPK4dJtsXvJ24HR-qzySZi_oDpRPheoeUjv6sCt-LwYDywIut7dHJd-A0kinRnAVKgI52RbGhZfI",
  },
];

const ExploreScreen = () => {
  const renderTopicChip = ({ item }: any) => {
    const getChipStyle = () => {
      switch (item.type) {
        case "secondary":
          return {
            backgroundColor: colors.secondaryContainer,
            textColor: colors.onSecondaryContainer,
          };
        case "tertiary":
          return {
            backgroundColor: colors.tertiaryContainer + "33", // 20% opacity
            textColor: colors.tertiary,
          };
        default:
          return {
            backgroundColor: colors.surfaceContainerHigh,
            textColor: colors.onSurface,
          };
      }
    };

    const chipStyle = getChipStyle();

    return (
      <TouchableOpacity
        style={[styles.chip, { backgroundColor: chipStyle.backgroundColor }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.chipText, { color: chipStyle.textColor }]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTrendingCard = ({ item }: any) => (
    <View style={styles.trendingCard}>
      <Image source={{ uri: item.image }} style={styles.trendingImage} />
      <View style={styles.trendingGradient}>
        <View style={styles.trendingTag}>
          <Text style={styles.trendingTagText}>{item.tag}</Text>
        </View>
        <View style={styles.trendingContent}>
          <View>
            <Text style={styles.trendingTitle}>{item.title}</Text>
            <Text style={styles.trendingAuthor}>{item.author}</Text>
          </View>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Icon name="bookmark" size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderForYouItem = (item: any) => {
    if (item.type === "quote") {
      return (
        <View key={item.id} style={styles.quoteCard}>
          <Text style={[styles.tag, { color: colors[item.tagColor] }]}>
            {item.tag}
          </Text>
          <Text style={styles.quoteText}>{item.quote}</Text>
          <View style={styles.quoteFooter}>
            <Text style={styles.quoteAuthor}>— {item.author}</Text>
            <TouchableOpacity>
              <Icon name="bookmark-border" size={24} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (item.type === "video") {
      return (
        <View key={item.id} style={styles.videoCard}>
          <View style={styles.videoThumbnail}>
            <Image source={{ uri: item.image }} style={styles.videoImage} />
            <View style={styles.playOverlay}>
              <View style={styles.playButton}>
                <Icon name="play-arrow" size={32} color={colors.primary} />
              </View>
            </View>
          </View>
          <View style={styles.videoContent}>
            <View
              style={[
                styles.videoTag,
                { backgroundColor: colors.secondaryContainer },
              ]}
            >
              <Text
                style={[
                  styles.videoTagText,
                  { color: colors.onSecondaryContainer },
                ]}
              >
                {item.tag}
              </Text>
            </View>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <View style={styles.videoFooter}>
              <Text style={styles.videoSubtitle}>{item.subtitle}</Text>
              <TouchableOpacity>
                <Icon name="bookmark-border" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (item.type === "article") {
      return (
        <View key={item.id} style={styles.articleCard}>
          <Image source={{ uri: item.image }} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <Text style={[styles.tag, { color: colors[item.tagColor] }]}>
              {item.tag}
            </Text>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleDescription}>{item.description}</Text>
            <View style={styles.articleFooter}>
              <View style={styles.authorRow}>
                <Image
                  source={{ uri: item.authorImage }}
                  style={styles.authorAvatar}
                />
                <Text style={styles.authorName}>{item.author}</Text>
              </View>
              <TouchableOpacity>
                <Icon name="bookmark-border" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.surface + "CC"}
      />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsUiT8rUjUfVur7vuzGGrDv9ug9KwwrIhcEq0TMqdQU4zGBQk6slBCfAao-du_BzOg1_weNzastYqnDLqMSycWFmnHfULEbRgFOvMZr3dcE151C0Qz_jVGwNVBF5sU-pE0Q3MJf4bHq2hm_qpi8XnHH6NdReG4yWP8SS9tU1AyeKIfu85dXzdO_oDTqEqYNZpfm0QZ8OxAW4IP3nrjirVnYhzn2PQ2ccw-leA5GYmq1B1qQ85JLS5SVFdcERpwUNgZC3dMm1bJyqY",
              }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.topBarTitle}>Explore</Text>
        </View>
        <TouchableOpacity>
          <Icon name="search" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={24}
              color={colors.onSurfaceVariant}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="What wisdom are you seeking today?"
              placeholderTextColor={colors.onSurfaceVariant + "99"}
            />
          </View>
        </View>

        {/* Trending Topics */}
        <FlatList
          data={trendingTopics}
          renderItem={renderTopicChip}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsContainer}
        />

        {/* Trending Wisdom */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Wisdom</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trendingWisdom}
            renderItem={renderTrendingCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={340}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContainer}
          />
        </View>

        {/* For You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You</Text>
          <View style={styles.forYouGrid}>
            {forYouContent.map(renderForYouItem)}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Icon
          name="auto-awesome"
          size={24}
          color={colors.onPrimary}
          style={styles.fabIcon}
        />
        <Text style={styles.fabText}>Surprise Me</Text>
      </TouchableOpacity>
    </View>
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
    zIndex: 50,
    backgroundColor: colors.surface + "CC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainerHigh,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0891b2", // cyan-600
    letterSpacing: -0.5,
  },
  mainContent: {
    flex: 1,
    marginTop: 100,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.onSurface,
    fontFamily: fonts.body,
  },
  topicsContainer: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    marginRight: 12,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: fonts.label,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: fonts.headline,
    letterSpacing: -0.5,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    textDecorationLine: "underline",
  },
  carouselContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  trendingCard: {
    width: 320,
    height: 400,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  trendingGradient: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "space-between",
    padding: 24,
  },
  trendingTag: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondaryContainer + "E6", // 90% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  trendingTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.onSecondaryContainer,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  trendingContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  trendingTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: fonts.headline,
    lineHeight: 32,
    marginBottom: 4,
  },
  trendingAuthor: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: fonts.body,
  },
  bookmarkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  forYouGrid: {
    paddingHorizontal: 24,
    gap: 32,
  },
  quoteCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tag: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 24,
  },
  quoteText: {
    fontSize: 24,
    color: colors.onSurface,
    fontFamily: "serif",
    lineHeight: 36,
    fontStyle: "italic",
    marginBottom: 48,
  },
  quoteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    fontFamily: fonts.body,
  },
  videoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  videoThumbnail: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  videoImage: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  videoContent: {
    padding: 24,
  },
  videoTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 12,
  },
  videoTagText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: fonts.headline,
    marginBottom: 12,
  },
  videoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoSubtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontFamily: fonts.body,
  },
  articleCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  articleImage: {
    width: "100%",
    height: 250,
  },
  articleContent: {
    padding: 32,
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.onSurface,
    fontFamily: fonts.headline,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  articleDescription: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: fonts.body,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHigh,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: fonts.label,
  },
  fab: {
    position: "absolute",
    bottom: 112,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.primary,
    borderRadius: 9999,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fabIcon: {
    transform: [{ rotate: "0deg" }],
  },
  fabText: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: -0.5,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: colors.surface + "CC",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    transform: [{ scale: 0.96 }],
  },
  navItemActive: {
    alignItems: "center",
    backgroundColor: "#cffafe", // cyan-100
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
    transform: [{ scale: 0.96 }],
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.onSurfaceVariant,
    marginTop: 4,
    fontFamily: fonts.label,
  },
  navLabelActive: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0e7490", // cyan-700
    marginTop: 4,
    fontFamily: fonts.label,
  },
});

export default ExploreScreen;
