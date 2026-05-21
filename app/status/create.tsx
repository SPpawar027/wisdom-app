// app/(app)/story/create.tsx
import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CANVAS_WIDTH = Math.min(width - 48, 420);
const CANVAS_HEIGHT = (CANVAS_WIDTH * 16) / 9;

type Tool = "text" | "draw" | "stickers" | "media";

export default function CreateStoryScreen() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<Tool>("text");
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  ]);
  const [textOverlay, setTextOverlay] = useState("");
  const [isAddingText, setIsAddingText] = useState(false);
  const [location] = useState("Sanctuary Reach");

  // Animation values
  const hoverProgress = useSharedValue(0);
  const textX = useSharedValue(0);
  const textY = useSharedValue(0);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(hoverProgress.value, [0, 1], [0, -4]) },
      { translateY: interpolate(hoverProgress.value, [0, 1], [0, -4]) },
    ],
  }));

  const topRightAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(hoverProgress.value, [0, 1], [0, 4]) },
      { translateY: interpolate(hoverProgress.value, [0, 1], [0, -8]) },
    ],
  }));

  const bottomRightAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(hoverProgress.value, [0, 1], [0, 8]) },
      { translateY: interpolate(hoverProgress.value, [0, 1], [0, 4]) },
    ],
  }));

  const onHoverIn = () => {
    hoverProgress.value = withTiming(1, { duration: 500 });
  };

  const onHoverOut = () => {
    hoverProgress.value = withTiming(0, { duration: 500 });
  };

  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      textX.value = e.translationX;
      textY.value = e.translationY;
    })
    .onEnd(() => {
      textX.value = withSpring(0);
      textY.value = withSpring(0);
    });

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textX.value }, { translateY: textY.value }],
  }));

  const pickImage = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsMultipleSelection: true,
    //   selectionLimit: 3,
    // });
    // if (!result.canceled) {
    //   setImages(result.assets.map((a) => a.uri));
    // }
  };

  const handleNext = () => {
    // router.push("/story/preview");
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleClose} style={styles.topButton}>
          <Ionicons name="close" size={24} color="#595c5e" />
        </TouchableOpacity>

        <Text style={styles.title}>New Story</Text>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextButton}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Main Canvas */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.canvasContainer}
      >
        <View
          style={styles.canvasWrapper}
          onTouchStart={onHoverIn}
          onTouchEnd={onHoverOut}
        >
          {/* Asymmetric Collage Canvas */}
          <View style={[styles.canvas, styles.canvasGlow]}>
            {/* Large Left Image (58% width, 92% height) */}
            <Animated.View
              style={[styles.largeImageContainer, containerAnimatedStyle]}
            >
              <Image source={{ uri: images[0] }} style={styles.largeImage} />
              <View style={styles.imageOverlay} />

              {/* Location Tag */}
              <View style={styles.locationTag}>
                <Ionicons name="location" size={14} color="white" />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            </Animated.View>

            {/* Top Right Image (48% width, 40% height) */}
            <Animated.View
              style={[styles.topRightContainer, topRightAnimatedStyle]}
            >
              <Image source={{ uri: images[1] }} style={styles.topRightImage} />
              <View style={styles.subtleOverlay} />
            </Animated.View>

            {/* Bottom Right Image (55% width, 50% height) */}
            <Animated.View
              style={[styles.bottomRightContainer, bottomRightAnimatedStyle]}
            >
              <Image
                source={{ uri: images[2] }}
                style={styles.bottomRightImage}
              />
              <View style={styles.subtleOverlay} />
            </Animated.View>

            {/* Text Overlay */}
            {isAddingText ? (
              <GestureDetector gesture={dragGesture}>
                <Animated.View
                  style={[styles.textContainer, animatedTextStyle]}
                >
                  <TextInput
                    style={styles.textInput}
                    value={textOverlay}
                    onChangeText={setTextOverlay}
                    placeholder="Type something..."
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoFocus
                    multiline
                  />
                </Animated.View>
              </GestureDetector>
            ) : (
              <TouchableOpacity
                style={styles.addTextPrompt}
                onPress={() => setIsAddingText(true)}
              >
                <Ionicons name="text" size={32} color="white" />
                <Text style={styles.addTextLabel}>Add Text</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Premium Glass Dock */}
      <View style={styles.dockContainer}>
        <View style={styles.glassDock}>
          <DockButton
            icon="text"
            label="Text"
            isActive={activeTool === "text"}
            onPress={() => setActiveTool("text")}
          />
          <DockButton
            icon="brush"
            label="Draw"
            isActive={activeTool === "draw"}
            onPress={() => setActiveTool("draw")}
          />
          <DockButton
            icon="happy"
            label="Stick"
            isActive={activeTool === "stickers"}
            onPress={() => setActiveTool("stickers")}
          />
          <DockButton
            icon="images"
            label="Add"
            isActive={activeTool === "media"}
            onPress={pickImage}
          />
        </View>
      </View>

      {/* Background Atmosphere */}
      <View style={styles.ambientTop} />
      <View style={styles.ambientBottom} />
    </View>
  );
}

// Dock Button Component
function DockButton({
  icon,
  label,
  isActive,
  onPress,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.dockButton, isActive && styles.dockButtonActive]}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={26}
        color={isActive ? "#00647c" : "#595c5e"}
        style={styles.dockIcon}
      />
      <Text style={[styles.dockLabel, isActive && styles.dockLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const COLORS = {
  surface: "#f5f6f8",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerHigh: "#e0e3e5",
  primary: "#00647c",
  onPrimary: "#e2f6ff",
  onSurface: "#2c2f31",
  onSurfaceVariant: "#595c5e",
  secondaryContainer: "#a1eff8",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfe",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(20px)",
  },
  topButton: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.onSurface,
    fontFamily: "PlusJakartaSans-ExtraBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  nextButton: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    fontFamily: "PlusJakartaSans-Bold",
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  canvasWrapper: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  },
  canvas: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  canvasGlow: {
    shadowColor: "#00647c",
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.12,
    shadowRadius: 80,
    elevation: 20,
  },
  // Asymmetric Layout
  largeImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "58%",
    height: "92%",
    borderTopLeftRadius: 64,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  largeImage: {
    width: "100%",
    height: "100%",
    transform: [{ scale: 1.05 }],
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  locationTag: {
    position: "absolute",
    bottom: 24,
    left: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  locationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  topRightContainer: {
    position: "absolute",
    top: "4%",
    right: 0,
    width: "48%",
    height: "40%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  topRightImage: {
    width: "100%",
    height: "100%",
  },
  bottomRightContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "55%",
    height: "50%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 64,
    overflow: "hidden",
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  bottomRightImage: {
    width: "100%",
    height: "100%",
  },
  subtleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  // Text Overlay
  addTextPrompt: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -80 }, { translateY: -30 }],
    backgroundColor: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(16px)",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  addTextLabel: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans-Bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
  },
  textContainer: {
    position: "absolute",
    top: "40%",
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 40,
  },
  textInput: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    minWidth: 200,
  },
  // Glass Dock
  dockContainer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: "center",
  },
  glassDock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(24px)",
    // saturate: "180%",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    // elevation: 10,
    width: "100%",
    maxWidth: 400,
  },
  dockButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 32,
  },
  dockButtonActive: {
    backgroundColor: "rgba(0, 100, 124, 0.1)",
  },
  dockIcon: {
    marginBottom: 4,
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "PlusJakartaSans-Bold",
  },
  dockLabelActive: {
    color: COLORS.primary,
  },
  // Ambient Background
  ambientTop: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "50%",
    height: "50%",
    backgroundColor: "rgba(0, 100, 124, 0.05)",
    borderRadius: 300,
    // blurRadius: 140,
    pointerEvents: "none",
  },
  ambientBottom: {
    position: "absolute",
    bottom: "10%",
    right: "0%",
    width: "40%",
    height: "40%",
    backgroundColor: "rgba(165, 243, 252, 0.1)",
    borderRadius: 200,
    // blurRadius: 120,
    pointerEvents: "none",
  },
});
