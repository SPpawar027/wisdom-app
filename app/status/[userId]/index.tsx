// app/(app)/status/[userId].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
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
import { runOnJS, useSharedValue } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Mock data - replace with API
const STATUS_DATA = [
  {
    id: "1",
    user: {
      name: "Aria Storm",
      avatar: "https://your-image.com/aria.jpg",
      time: "12m ago",
    },
    image: "https://your-image.com/mountain-sunrise.jpg",
    quote: "The greatest adventure is the one that leads to the self.",
    type: "wisdom",
  },
  {
    id: "2",
    user: {
      name: "Aria Storm",
      avatar: "https://your-image.com/aria.jpg",
      time: "12m ago",
    },
    image: "https://your-image.com/ocean-waves.jpg",
    quote: "Calmness is the cradle of power.",
    type: "reflection",
  },
  {
    id: "3",
    user: {
      name: "Marcus Aurelius",
      avatar: "https://your-image.com/marcus.jpg",
      time: "2h ago",
    },
    image: "https://your-image.com/roman-statue.jpg",
    quote:
      "Waste no more time arguing about what a good man should be. Be one.",
    type: "wisdom",
  },
];

export default function StatusViewScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressAnim = useSharedValue(0);
  const currentStatus = STATUS_DATA[currentIndex];
  const isLastStatus = currentIndex === STATUS_DATA.length - 1;

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // 5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = useCallback(() => {
    if (isLastStatus) {
      router.back(); // Exit when done
    } else {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    }
  }, [isLastStatus, router]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Gestures
  const tapGesture = Gesture.Tap().onEnd((event) => {
    const x = event.x;
    if (x < width * 0.3) {
      runOnJS(handlePrevious)();
    } else if (x > width * 0.7) {
      runOnJS(handleNext)();
    }
  });

  const longPressGesture = Gesture.LongPress()
    .onStart(() => runOnJS(setIsPaused)(true))
    .onEnd(() => runOnJS(setIsPaused)(false));

  const composed = Gesture.Exclusive(longPressGesture, tapGesture);

  const handleClose = () => {
    router.back();
  };

  const handleReply = () => {
    // Open reply modal or navigate to chat
    router.push(`/chat/${userId}`);
  };

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.container}>
        <StatusBar style="light" hidden />

        {/* Background Image */}
        <Image
          source={{ uri: currentStatus.image }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Gradient Overlays */}
        <View style={styles.topGradient} />
        <View style={styles.bottomGradient} />

        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {STATUS_DATA.map((_, index) => (
            <View key={index} style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      index < currentIndex
                        ? "100%"
                        : index === currentIndex
                          ? `${progress}%`
                          : "0%",
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: currentStatus.user.avatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{currentStatus.user.name}</Text>
              <Text style={styles.timeText}>{currentStatus.user.time}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content - Quote */}
        <View style={styles.content}>
          <View style={styles.quoteContainer}>
            <Ionicons
              name="albums-sharp"
              size={28}
              color="rgba(255,255,255,0.4)"
            />
            <Text style={styles.quoteText}>{currentStatus.quote}</Text>

            <View style={styles.badge}>
              <Ionicons
                name="sparkles"
                size={12}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.badgeText}>Wisdom of the Day</Text>
            </View>
          </View>
        </View>

        {/* Floating Reaction */}
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="leaf-outline" size={24} color="white" />
        </TouchableOpacity>

        {/* Bottom Controls */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.bottomContainer}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Reply..."
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
              <Ionicons name="chatbubble-outline" size={24} color="white" />
              <Text style={styles.actionLabel}>Reply</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
              <Text style={styles.actionLabel}>Like</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Touch Areas (invisible) */}
        <View style={styles.touchLeft} pointerEvents="box-only" />
        <View style={styles.touchRight} pointerEvents="box-only" />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  progressContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 6,
    zIndex: 100,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
  },
  header: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  userName: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "500",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 32,
    paddingBottom: 200,
  },
  quoteContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    backdropFilter: "blur(2px)",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    lineHeight: 32,
    marginTop: 12,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  badgeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reactionButton: {
    position: "absolute",
    right: 24,
    bottom: 140,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
  inputContainer: {
    flex: 1,
    marginRight: 16,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: "white",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  actions: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
  touchLeft: {
    position: "absolute",
    left: 0,
    top: 100,
    bottom: 100,
    width: 64,
    zIndex: 50,
  },
  touchRight: {
    position: "absolute",
    right: 0,
    top: 100,
    bottom: 100,
    width: 64,
    zIndex: 50,
  },
});
