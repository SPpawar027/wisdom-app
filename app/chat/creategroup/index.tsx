// app/(app)/group/create.tsx
import { useChat } from "@/src/hooks/api_hooks/useChat";
import { followService } from "@/src/services/follow.service";
import { useAuthStore } from "@/src/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = [
  { id: "philosophy", label: "Philosophy", selected: true },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "leadership", label: "Leadership" },
  { id: "wellness", label: "Wellness" },
  { id: "history", label: "History" },
];

const FRIENDS = [
  {
    id: "1",
    name: "Elena Veda",
    handle: "@elenaveda",
    avatar: "https://your-image.com/elena.jpg",
    added: false,
  },
  {
    id: "2",
    name: "Julian Thorne",
    handle: "@jthorne",
    avatar: "https://your-image.com/julian.jpg",
    added: true,
  },
  {
    id: "3",
    name: "Soren Kierk",
    handle: "@the_soren",
    initials: "SK",
    color: "#ff8bc5",
    added: false,
  },
];

export default function CreateGroupScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("philosophy");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [groupPhoto, setGroupPhoto] = useState<string | null>(null);
  const [friends, setFriends] = useState(FRIENDS);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user }: any = useAuthStore();
  const { getUserList }: any = followService();
  const { handleCreateGroup } = useChat();
  const getUserFn = async () => {
    try {
      const data = await getUserList();
      setFriends(data.users);
    } catch (error) {
      console.log("🚀 ~ CreateGroupScreen ~ error:", error);
    }
  };
  useEffect(() => {
    getUserFn();
  }, []);
  const pickImage = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    // });
    // if (!result.canceled) {
    //   setGroupPhoto(result.assets[0].uri);
    // }
  };

  const toggleFriend = (id: string) => {
    setFriends((prev) =>
      prev.map((f: any) => (f._id === id ? { ...f, added: !f.added } : f)),
    );
  };

  const handleCreate = async () => {
    const addedFriends: any = friends.filter((f: any) => f.added);
    console.log(
      groupName,
      description,
      selectedCategory,
      isPublic,
      addedFriends,
    );
    try {
      const response = await handleCreateGroup(
        groupName,
        description,
        selectedCategory,
        isPublic,
        addedFriends,
      );
      if (response.status === 200) {
        router.back();
      }
    } catch (error) {
      console.log("🚀 ~ CreateGroupScreen ~ error:", error);
    }

    // Validate and create group
    return;
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>New Group</Text>

        <TouchableOpacity onPress={handleCreate}>
          <Text
            style={[
              styles.createButton,
              !groupName.trim() && styles.createButtonDisabled,
            ]}
          >
            Create
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Upload */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
            {groupPhoto ? (
              <Image source={{ uri: groupPhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={32} color="#757779" />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoLabel}>Add Group Photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g. Stoic Circles"
              placeholderTextColor="#abadaf"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="What is this group about?"
              placeholderTextColor="#abadaf"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat.id && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Privacy Toggle */}
        <View style={styles.privacyCard}>
          <PrivacyOption
            icon="globe"
            title="Public"
            description="Anyone can join this group"
            isSelected={isPublic}
            onPress={() => setIsPublic(true)}
            selectedColor="#a1eff8"
          />
          <View style={styles.privacyDivider} />
          <PrivacyOption
            icon="lock-closed"
            title="Private"
            description="Invite only access"
            isSelected={isPublic}
            onPress={() => setIsPublic(false)}
            selectedColor="#dadde0"
            disabled
          />
        </View>

        {/* Invite Friends */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Invite Friends</Text>
            <Text style={styles.optionalBadge}>Optional</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#757779"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search friends by name..."
              placeholderTextColor="#abadaf"
            />
          </View>

          <View style={styles.friendsList}>
            {friends?.map((friend: any) => (
              <View key={friend.id} style={styles.friendItem}>
                <View style={styles.friendInfo}>
                  <Image
                    source={{
                      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeAb-53XKyzLA_K30grZ0KcODhamFpjSn9dQ&s",
                    }}
                    style={styles.friendAvatar}
                  />
                  {/* {friend.avatar ? (
                   
                  ) : (
                    <View
                      style={[
                        styles.friendInitials,
                        { backgroundColor: friend.color },
                      ]}
                    >
                      <Text style={styles.initialsText}>{friend.initials}</Text>
                    </View>
                  )} */}
                  <View>
                    <Text style={styles.friendName}>{friend.username}</Text>
                    <Text style={styles.friendHandle}>@{friend.username}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.addButton, friend.added && styles.addedButton]}
                  onPress={() => toggleFriend(friend._id)}
                >
                  {friend.added ? (
                    <>
                      <Ionicons name="checkmark" size={14} color="white" />
                      <Text style={styles.addedButtonText}>Added</Text>
                    </>
                  ) : (
                    <Text style={styles.addButtonText}>Add</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Privacy Option Component
function PrivacyOption({
  icon,
  title,
  description,
  isSelected,
  onPress,
  selectedColor,
  disabled,
}: {
  icon: string;
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  selectedColor: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.privacyOption, disabled && styles.privacyDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.privacyLeft}>
        <View style={[styles.privacyIcon, { backgroundColor: selectedColor }]}>
          <Ionicons
            name={icon as any}
            size={20}
            color={isSelected ? "#005b62" : "#595c5e"}
          />
        </View>
        <View>
          <Text style={styles.privacyTitle}>{title}</Text>
          <Text style={styles.privacyDesc}>{description}</Text>
        </View>
      </View>
      <View
        style={[
          styles.toggleTrack,
          isSelected ? styles.toggleTrackActive : styles.toggleTrackInactive,
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            isSelected ? styles.toggleThumbActive : styles.toggleThumbInactive,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const COLORS = {
  surface: "#f5f6f8",
  surfaceContainerLow: "#eff1f3",
  surfaceContainerHigh: "#e0e3e5",
  surfaceContainerLowest: "#ffffff",
  primary: "#00647c",
  onPrimary: "#e2f6ff",
  primaryContainer: "#72d9fd",
  onPrimaryContainer: "#004a5d",
  secondaryContainer: "#a1eff8",
  onSecondaryContainer: "#005b62",
  tertiaryContainer: "#ff8bc5",
  onTertiaryContainer: "#630040",
  onSurface: "#2c2f31",
  onSurfaceVariant: "#595c5e",
  outline: "#757779",
  outlineVariant: "#abadaf",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(20px)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.onSurface,
    fontFamily: "PlusJakartaSans-Bold",
  },
  createButton: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    fontFamily: "PlusJakartaSans-Bold",
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 40,
  },
  photoSection: {
    alignItems: "center",
  },
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  photoPlaceholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.surfaceContainerLowest,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.surfaceContainerLowest,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  photoLabel: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.onSurfaceVariant,
    fontFamily: "Inter-Medium",
  },
  formSection: {
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
    paddingHorizontal: 4,
    fontFamily: "Inter-SemiBold",
  },
  input: {
    height: 56,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    color: COLORS.onSurface,
    fontFamily: "Inter-Regular",
  },
  textArea: {
    height: 120,
    paddingVertical: 16,
    textAlignVertical: "top",
  },
  categoryScroll: {
    marginHorizontal: -24,
  },
  categoryContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.onSurface,
    fontFamily: "Inter-Medium",
  },
  categoryTextActive: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  privacyCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    padding: 24,
    gap: 20,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  privacyDisabled: {
    opacity: 0.5,
  },
  privacyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  privacyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.onSurface,
    fontFamily: "PlusJakartaSans-Bold",
  },
  privacyDesc: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
    fontFamily: "Inter-Regular",
  },
  privacyDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: COLORS.primary,
  },
  toggleTrackInactive: {
    backgroundColor: COLORS.outlineVariant,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  toggleThumbInactive: {
    alignSelf: "flex-start",
  },
  optionalBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#a02d70",
    fontFamily: "Inter-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.onSurface,
    fontFamily: "Inter-Regular",
  },
  friendsList: {
    gap: 8,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  friendInitials: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: COLORS.onTertiaryContainer,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans-Bold",
  },
  friendName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.onSurface,
    fontFamily: "Inter-Bold",
  },
  friendHandle: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
    fontFamily: "Inter-Regular",
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.primaryContainer,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.onPrimaryContainer,
    fontFamily: "Inter-Bold",
  },
  addedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addedButtonText: {
    color: COLORS.onPrimary,
  },
  bottomSpacer: {
    height: 80,
  },
});
