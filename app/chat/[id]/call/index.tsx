// app/(app)/call/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function VoiceCallScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Pulse animation for status dot
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.5, { duration: 1000 }),
      -1,
      true,
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 1000 }),
      -1,
      true,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleEndCall = () => {
    // End call logic here
    router.back(); // Or navigate to call summary
  };

  const handleMinimize = () => {
    // Minimize to picture-in-picture or background
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />

      {/* Gradient Background */}
      <LinearGradient
        colors={["#A5F3FC", "#00647C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.minimizeButton}
          onPress={handleMinimize}
        >
          <Ionicons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Center Content */}
      <View style={styles.centerContent}>
        {/* Avatar with Glow */}
        <View style={styles.avatarContainer}>
          <View style={styles.glowEffect} />
          <View style={styles.avatarRing}>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIJOUgqiNn0L2q6MedraXGs8un4vdfcftO8Q&s",
              }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Identity */}
        <View style={styles.identity}>
          <Text style={styles.name}>Marcus Aurelius</Text>
          <Text style={styles.time}>04:20</Text>

          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Animated.View style={[styles.pulseDot, pulseStyle]} />
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Wisdom Voice Call</Text>
          </View>
        </View>
      </View>

      {/* Glass Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.glassBar}>
          {/* Mute */}
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="mic-off-outline" size={24} color="white" />
            <Text style={styles.controlLabel}>Mute</Text>
          </TouchableOpacity>

          {/* Keypad */}
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="keypad-outline" size={24} color="white" />
            <Text style={styles.controlLabel}>Keypad</Text>
          </TouchableOpacity>

          {/* Speaker */}
          <TouchableOpacity
            style={[styles.controlButton, styles.activeControl]}
          >
            <Ionicons name="volume-high" size={24} color="white" />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>

          {/* End Call */}
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Ionicons
              name="call"
              size={32}
              color="white"
              style={{ transform: [{ rotate: "135deg" }] }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ambient Blurs */}
      <View style={[styles.ambientBlur, styles.topBlur]} />
      <View style={[styles.ambientBlur, styles.bottomBlur]} />
    </View>
  );
}

// Colors from your Stitch design
const COLORS = {
  primary: "#00647c",
  primaryContainer: "#72d9fd",
  secondaryFixed: "#a1eff8",
  error: "#b31b25",
  onPrimary: "#e2f6ff",
  surface: "#f5f6f8",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  minimizeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 40,
  },
  glowEffect: {
    position: "absolute",
    top: -16,
    left: -16,
    right: -16,
    bottom: -16,
    backgroundColor: "rgba(114, 217, 253, 0.3)",
    borderRadius: 200,
    // blurRadius: 40,
  },
  avatarRing: {
    width: 224,
    height: 224,
    borderRadius: 112,
    padding: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 110,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
  },
  identity: {
    alignItems: "center",
  },
  name: {
    fontSize: 40,
    fontWeight: "800",
    color: "white",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  time: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryContainer,
    marginRight: 8,
  },
  pulseDot: {
    position: "absolute",
    left: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryContainer,
  },
  statusText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  glassBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(24px)",
    borderRadius: 40,
    padding: 16,
    paddingLeft: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 50,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  activeControl: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  controlLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
  },
  ambientBlur: {
    position: "absolute",
    width: 256,
    height: 256,
    borderRadius: 128,
    pointerEvents: "none",
  },
  topBlur: {
    top: height * 0.25,
    left: -80,
    backgroundColor: "rgba(161, 239, 248, 0.1)",
    // blurRadius: 100,
  },
  bottomBlur: {
    bottom: height * 0.25,
    right: -80,
    backgroundColor: "rgba(114, 217, 253, 0.1)",
    // blurRadius: 120,
  },
});
