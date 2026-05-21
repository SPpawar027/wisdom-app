// WisdomSettingsScreen.jsx
import LogoutConfirmationModal from "@/src/modal/logoutModal";
import { logoutApi } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/store/auth.store";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

  error: "#b31b25",
  onError: "#ffefee",
  errorContainer: "#fb5151",
  onErrorContainer: "#570008",
  errorDim: "#9f0519",

  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  cyan50: "#ecfeff",
  cyan500: "#06b6d4",
  cyan600: "#0891b2",
  cyan700: "#0e7490",
};

const themeOptions = [
  { id: "light", label: "Light", isActive: true },
  { id: "dark", label: "Dark", isActive: false },
  { id: "system", label: "System", isActive: false },
];

const SettingItem = ({
  icon,
  label,
  value,
  onPress,
  showBorder = true,
  isLast = false,
}: any) => (
  <TouchableOpacity
    style={[styles.settingItem, !showBorder && styles.noBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingItemLeft}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.settingItemText}>{label}</Text>
    </View>
    <View style={styles.settingItemRight}>
      {value && (
        <View style={styles.valueBadge}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      )}
      <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
    </View>
  </TouchableOpacity>
);

const SectionHeader = ({ title }: any) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const ThemeOption = ({ option, isSelected, onPress }: any) => (
  <TouchableOpacity
    style={[styles.themeOption, isSelected && styles.themeOptionActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View
      style={[
        styles.themePreview,
        option.id === "light" && styles.themePreviewLight,
        option.id === "dark" && styles.themePreviewDark,
        option.id === "system" && styles.themePreviewSystem,
      ]}
    >
      {option.id === "light" && (
        <>
          <View style={styles.previewLine} />
          <View style={[styles.previewLine, { width: "75%" }]} />
          <View style={styles.previewBar} />
        </>
      )}
      {option.id === "dark" && (
        <>
          <View
            style={[styles.previewLine, { backgroundColor: colors.slate800 }]}
          />
          <View
            style={[
              styles.previewLine,
              { width: "75%", backgroundColor: colors.slate800 },
            ]}
          />
          <View
            style={[styles.previewBar, { backgroundColor: colors.slate700 }]}
          />
        </>
      )}
      {option.id === "system" && (
        <MaterialIcons
          name="settings-brightness"
          size={20}
          color={colors.primary}
        />
      )}
    </View>
    <Text style={[styles.themeLabel, isSelected && styles.themeLabelActive]}>
      {option.label}
    </Text>
  </TouchableOpacity>
);

const WisdomSettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();
  const handleLogout = () => {
    // open the modal for logout
    // redirect to login page and replace the stack
    // Small delay to let modal close animation finish
    setTimeout(async () => {
      setShowLogoutModal(false);
      const res: any = await logoutApi();
      console.log("🚀 ~ handleLogout ~ res:", res);
      if (res.status === 200) {
        logout();
        // Clear stack and navigate to auth
        router.dismissAll();
        router.replace("/(auth)/login");
      }
    }, 300);
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
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.cyan600}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
          <View style={styles.spacer} />
        </View>
      </BlurView>

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Summary */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyzUM8X4vNgRpbMtnS2dtR586srV9_WfnzSZZ1DA_NjNn0b6iMFUb_STUKRzJkdvNK1gbxwgg71vf_Bop0WL6a9jkYmh39C2fXuNd2DHeHylA1np0FYUcyby4WhIbsxCb7Q44hm1cyL8DJZwckYo0bZ_oX6VuQ_0PlwJPhY71etpBjFPAlVyRIiPmcLlwCkeAtkH3Kjk8IViSF4INKL_bf7aYXDaKa5z_-nn1X0lFERVszlmVXJfivEsnKgroOg3FWFqnQmOCY39Y",
                }}
                style={styles.profileAvatar}
              />
              <View style={styles.verifiedBadge}>
                <MaterialIcons
                  name="verified"
                  size={14}
                  color={colors.onPrimary}
                />
              </View>
            </View>
            <View>
              <Text style={styles.profileName}>Dr. Julian Vance</Text>
              <Text style={styles.profileSubtitle}>
                Wisdom Seeker • Premium
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <SectionHeader title="Account" />
          <View style={styles.card}>
            <SettingItem
              icon="person"
              label="Edit Profile"
              onPress={() => {
                router.push("/editprofile");
              }}
            />
            <View style={styles.divider} />
            <SettingItem icon="lock" label="Privacy" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingItem
              icon="security"
              label="Security"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* Content Preferences */}
        <View style={styles.section}>
          <SectionHeader title="Content Preferences" />
          <View style={styles.card}>
            <SettingItem
              icon="category"
              label="Categories You Follow"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="alarm"
              label="Daily Reminders"
              value="8:00 AM"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" />
          <View style={styles.card}>
            <SettingItem
              icon="notifications"
              label="Notification Settings"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <SectionHeader title="Appearance" />
          <View style={styles.themeGrid}>
            {themeOptions.map((option) => (
              <ThemeOption
                key={option.id}
                option={option}
                isSelected={selectedTheme === option.id}
                onPress={() => setSelectedTheme(option.id)}
              />
            ))}
          </View>
        </View>

        {/* About & Support */}
        <View style={styles.section}>
          <SectionHeader title="About & Support" />
          <View style={styles.card}>
            <SettingItem
              icon="help-outline"
              label="Help Center"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="article"
              label="Terms of Service"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="policy"
              label="Privacy Policy"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <View style={styles.versionItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="info" size={24} color={colors.primary} />
                </View>
                <Text style={styles.settingItemText}>Version</Text>
              </View>
              <Text style={styles.versionText}>v2.4.1</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout modal  */}
      <LogoutConfirmationModal
        visible={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  spacer: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 80 : 60,
  },
  profileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 40,
    padding: 24,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    shadowColor: "rgba(0, 100, 124, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.surfaceContainerLow,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  profileSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.outline,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.onSurface,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.tertiary,
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 16,
    paddingLeft: 8,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "0D", // 5% opacity
    justifyContent: "center",
    alignItems: "center",
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.onSurface,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueBadge: {
    backgroundColor: colors.primary + "1A", // 10% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  valueText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerLow,
    marginHorizontal: 24,
  },
  versionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.outline,
  },
  themeGrid: {
    flexDirection: "row",
    gap: 12,
  },
  themeOption: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeOptionActive: {
    borderColor: colors.primary,
  },
  themePreview: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: 8,
    gap: 4,
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  themePreviewLight: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  themePreviewDark: {
    backgroundColor: colors.slate900,
    borderColor: colors.slate700,
  },
  themePreviewSystem: {
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: "center",
    alignItems: "center",
  },
  previewLine: {
    width: "100%",
    height: 8,
    backgroundColor: colors.slate100,
    borderRadius: 2,
  },
  previewBar: {
    width: "100%",
    height: 12,
    backgroundColor: colors.primary + "33", // 20% opacity
    borderRadius: 6,
    marginTop: "auto",
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.outline,
  },
  themeLabelActive: {
    color: colors.primary,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 20,
    backgroundColor: colors.error + "10", // 10% opacity
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.error,
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
    paddingTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "rgba(0, 100, 124, 0.06)",
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 20,
    elevation: 8,
    zIndex: 50,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navItemActive: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cyan50,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.slate400,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  navLabelActive: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.cyan700,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default WisdomSettingsScreen;
