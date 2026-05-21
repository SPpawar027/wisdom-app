import { InputField } from "@/src/components/input/Input";
import { useAuth } from "@/src/hooks/api_hooks/useAuth";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Tokens ────────────────────────────────────────────────────────────────
const C = {
  primary: "#00647c",
  primaryContainer: "#72d9fd",
  primaryDim: "#00576c",
  surface: "#f5f6f8",
  surfaceContainerLow: "#eff1f3",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerHighest: "#dadde0",
  onSurface: "#2c2f31",
  onSurfaceVariant: "#595c5e",
  outlineVariant: "#abadaf",
  outline: "#757779",
  secondary: "#00666e",
  secondaryContainer: "#a1eff8",
  error: "#b31b25",
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const SparkleIcon = ({
  size = 24,
  color = C.primary,
}: {
  size?: number;
  color?: string;
}) => <Text style={{ fontSize: size, color, lineHeight: size + 4 }}>✦</Text>;

const LightbulbIllustration = () => (
  <View style={styles.illustrationCircle}>
    <Text style={styles.illustrationEmoji}>💡</Text>
    <View style={styles.illustrationOverlay} />
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function WisdomSignIn() {
  const [activeTab, setActiveTab] = useState<"login" | "join">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleAuthSubmit: any = useAuth();

  const tabAnim = useRef(new Animated.Value(0)).current;
  const switchTab = (tab: "login" | "join") => {
    setActiveTab(tab);
    Animated.spring(tabAnim, {
      toValue: tab === "login" ? 0 : 1,
      useNativeDriver: false,
      speed: 20,
    }).start();
  };

  const pillLeft = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* Top App Bar */}
      {/* <View style={styles.topBar}>
                <SparkleIcon size={20} color={C.primary} />
                <Text style={styles.topBarTitle}>Wisdom</Text>
            </View> */}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Wisdom</Text>
            <Text style={styles.heroSubtitle}>
              Share wisdom. Grow together.
            </Text>
          </View>

          {/* Auth Tab Toggle */}
          <View style={styles.tabContainer}>
            <Animated.View style={[styles.tabPill, { left: pillLeft }]} />
            <TouchableOpacity
              style={styles.tabBtn}
              onPress={() => switchTab("login")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "login" && styles.tabTextActive,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabBtn}
              onPress={() => {
                switchTab("join");
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "join" && styles.tabTextActive,
                ]}
              >
                Join
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {activeTab === "join" && (
              <InputField
                label="USERNAME"
                placeholder="username"
                value={username}
                onChangeText={setUsername}
              />
            )}
            <InputField
              label="EMAIL ADDRESS"
              placeholder="name@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <InputField
              label="PASSWORD"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* CTA */}
            <TouchableOpacity
              onPress={() => handleAuthSubmit(activeTab, email, password, username)}
              style={styles.ctaBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or connect with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
                }}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Text style={styles.appleIcon}></Text>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationSection}>
            <LightbulbIllustration />
            <Text style={styles.quoteText}>
              The only true wisdom is in knowing you know nothing
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing you agree to our{" "}
              <Text style={styles.footerLink}>Terms of Service</Text> and{" "}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.surface,
  },

  // Top Bar
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderBottomWidth: 0,
    shadowColor: "#00647c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 28,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -2,
    color: C.primary,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  heroSubtitle: {
    fontSize: 17,
    color: C.onSurfaceVariant,
    fontWeight: "500",
    letterSpacing: -0.2,
    marginTop: 4,
  },

  // Tab
  tabContainer: {
    flexDirection: "row",
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 999,
    padding: 6,
    marginBottom: 28,
    position: "relative",
  },
  tabPill: {
    position: "absolute",
    top: 6,
    bottom: 6,
    width: "50%",
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 999,
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurfaceVariant,
  },
  tabTextActive: {
    color: C.primary,
    fontWeight: "700",
  },

  // Form
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: C.onSurfaceVariant,
    textTransform: "uppercase",
    marginLeft: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 20,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: C.onSurface,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    letterSpacing: -0.2,
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
  },

  // CTA
  ctaBtn: {
    backgroundColor: C.primary,
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
    marginTop: 4,
  },
  ctaBtnText: {
    color: "#e2f6ff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.surfaceContainerHighest,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: C.outlineVariant,
    textTransform: "uppercase",
  },

  // Social
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: "rgba(171,173,175,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  appleIcon: {
    fontSize: 20,
    color: C.onSurface,
    lineHeight: 24,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.onSurface,
  },

  // Illustration
  illustrationSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  illustrationCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(161,239,248,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  illustrationEmoji: {
    fontSize: 48,
  },
  illustrationOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  quoteText: {
    fontSize: 13,
    color: C.onSurfaceVariant,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },

  // Footer
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: C.outlineVariant,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 16,
  },
  footerLink: {
    textDecorationLine: "underline",
    color: C.outlineVariant,
  },
});
