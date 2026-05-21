import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * LogoutConfirmationModal
 *
 * A reusable modal component for Expo apps that displays a confirmation
 * dialog with primary and secondary actions.
 *
 * Props:
 * - visible: boolean - Controls modal visibility
 * - onConfirm: () => void - Called when user confirms (Log Out)
 * - onCancel: () => void - Called when user cancels (Stay)
 * - title: string - Modal title
 * - description: string - Modal description text
 */

interface LogoutConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export default function LogoutConfirmationModal({
  visible,
  onConfirm,
  onCancel,
  title = "Are you sure you want to log out?",
  description = "Your wisdom, reflections, and insights will be safely stored for your next visit.",
}: LogoutConfirmationModalProps) {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <StatusBar style="light" />

      {/* Backdrop with blur effect */}
      <View style={styles.backdrop}>
        {/* Glass blur overlay */}
        <View style={styles.glassOverlay} />

        {/* Modal Card */}
        <View style={styles.card}>
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <Ionicons name="log-out-outline" size={32} color="#00647c" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            {/* Primary Log Out Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onConfirm}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Log Out</Text>
            </TouchableOpacity>

            {/* Secondary Stay Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Stay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

// Color tokens from your Stitch design
const COLORS = {
  surface: "#f5f6f8",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerHigh: "#e0e3e5",
  surfaceVariant: "#dadde0",
  onSurface: "#2c2f31",
  onSurfaceVariant: "#595c5e",
  primary: "#00647c",
  onPrimary: "#e2f6ff",
  secondaryContainer: "#a1eff8",
  inverseSurface: "#0c0f10",
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(12, 15, 16, 0.15)", // inverse-surface/15
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  card: {
    width: "85%",
    maxWidth: 360,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 40, // 2.5rem equivalent
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: "center",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 10,
    // Subtle border like your design
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    // Inner shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.onSurface,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999, // Full rounded
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: COLORS.surfaceContainerHigh,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.onSurface,
    fontSize: 16,
    fontWeight: "600",
  },
});
