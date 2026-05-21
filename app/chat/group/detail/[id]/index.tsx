// app/chat/group/detail/[id]/index.tsx
import { getGroupDetailByID } from "@/src/services/chat.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MEDIA = [
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
];

const renderMember = ({ item, index, totalMembers }: any) => (
  <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: `/chat/[id]`,
        params: {
          id: item._id,
          username: item.username,
        },
      })
    }
    key={item._id}
    style={[
      styles.memberItem,
      index !== totalMembers - 1 && styles.memberItemBorder,
    ]}
  >
    <View style={styles.memberLeft}>
      <Image
        source={{
          uri:
            item.avatar ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        }}
        style={styles.memberAvatar}
      />
      <View>
        <Text style={styles.memberName}>{item.username}</Text>
        <Text style={styles.memberHandle}>{item.handle || "@member"}</Text>
      </View>
    </View>
    {item.admin === true ? (
      <View style={styles.adminBadge}>
        <Text style={styles.adminText}>Admin</Text>
      </View>
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#abadaf" />
    )}
  </TouchableOpacity>
);

export default function GroupDetailsScreen() {
  const { id }: any = useLocalSearchParams();
  const [groupDetail, setGroupDetail] = useState<any>(null);
  const router: any = useRouter();

  useEffect(() => {
    const getGroupDetail = async () => {
      try {
        const res: any = await getGroupDetailByID(id);
        setGroupDetail(res);
      } catch (error: any) {
        console.log("🚀 ~ getGroupDetail ~ err:", error);
      }
    };
    if (id) {
      getGroupDetail();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/group/${id}/edit`);
  };

  const handleViewAllMembers = () => {
    router.push(`/group/${id}/members`);
  };

  const handleExitGroup = () => {
    router.back();
  };

  const renderHeader = () => (
    <View style={{ gap: 40, marginBottom: 24 }}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            }}
            style={styles.groupAvatar}
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={14} color="white" />
          </View>
        </View>

        <Text style={styles.groupName}>{groupDetail?.name || "Group Name"}</Text>
        <View style={styles.memberBadge}>
          <Ionicons name="people" size={14} color="#00647c" />
          <Text style={styles.memberCount}>
            {groupDetail?.members?.length || 0} members
          </Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.description}>
            A collective for exploring the intersection of nature, philosophy,
            and digital interface design.
          </Text>
        </View>
      </View>

      {/* Shared Media Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shared Media</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={MEDIA}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} style={styles.mediaItem}>
              <Image source={{ uri: item }} style={styles.mediaImage} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaScroll}
          contentContainerStyle={styles.mediaContainer}
        />
      </View>

      {/* Members Section Title */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members</Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={{ gap: 40, marginTop: 16 }}>
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={handleViewAllMembers}
      >
        <Text style={styles.viewAllButtonText}>
          View All {groupDetail?.members?.length || 0} Members
        </Text>
      </TouchableOpacity>

      {/* Settings Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsGrid}>
          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="notifications-off-outline"
                size={24}
                color="#005b62"
              />
            </View>
            <View>
              <Text style={styles.settingTitle}>Mute Notifications</Text>
              <Text style={styles.settingDesc}>
                Quiet the noise for a while
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingIcon}>
              <Ionicons name="timer-outline" size={24} color="#005b62" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Disappearing Messages</Text>
              <Text style={styles.settingDesc}>Ephemeral wisdom (24h)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingCard, styles.settingCardFull]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons name="shield-checkmark" size={24} color="#005b62" />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Group Encryption</Text>
                <Text style={styles.settingDesc}>
                  End-to-end security verified
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#00666e" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exit Group */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExitGroup}>
          <Ionicons name="exit-outline" size={20} color="#b31b25" />
          <Text style={styles.exitText}>Exit Group</Text>
        </TouchableOpacity>
        <Text style={styles.exitDisclaimer}>
          Leaving this group will remove your access to the chat history and
          shared wisdom logs.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#00647c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group Details</Text>
        </View>
        <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
          <Ionicons name="create-outline" size={24} color="#00647c" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupDetail?.members}
        renderItem={({ item, index }) =>
          renderMember({
            item,
            index,
            totalMembers: groupDetail?.members?.length,
          })
        }
        keyExtractor={(item) =>
          item._id?.toString() || Math.random().toString()
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const COLORS = {
  surface: "#f5f6f8",
  surfaceContainerLow: "#eff1f3",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerHigh: "#e0e3e5",
  primary: "#00647c",
  primaryContainer: "#72d9fd",
  secondaryContainer: "#a1eff8",
  onSecondaryContainer: "#005b62",
  onSurface: "#2c2f31",
  onSurfaceVariant: "#595c5e",
  outlineVariant: "#abadaf",
  error: "#b31b25",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 100, 124, 0.06)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    fontFamily: "PlusJakartaSans-Bold",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 24,
  },
  groupAvatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: COLORS.primaryContainer,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.onSurface,
    fontFamily: "PlusJakartaSans-ExtraBold",
    marginBottom: 8,
    textAlign: "center",
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  memberCount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  descriptionCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 32,
    borderRadius: 12,
    maxWidth: 400,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.onSurfaceVariant,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  section: {
    // Basic section styling if needed
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.onSurface,
    fontFamily: "PlusJakartaSans-Bold",
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  mediaScroll: {
    marginHorizontal: -24,
  },
  mediaContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  mediaItem: {
    width: 192,
    height: 256,
    borderRadius: 12,
    overflow: "hidden",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
    marginBottom: 8,
  },
  memberItemBorder: {
    // borderBottomWidth: 1,
    // borderBottomColor: "rgba(0,0,0,0.05)",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  memberHandle: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: "rgba(0, 100, 124, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  adminText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  viewAllButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  settingsGrid: {
    gap: 16,
  },
  settingCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  settingCardFull: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  footer: {
    alignItems: "center",
    gap: 16,
    marginTop: 20,
  },
  exitButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  exitText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.error,
  },
  exitDisclaimer: {
    fontSize: 12,
    color: COLORS.outlineVariant,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 18,
  },
});
