import React, { useState } from "react";
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
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Sophia Henderson");
  const [username, setUsername] = useState("sophia.wise");
  const [bio, setBio] = useState(
    "Digital nomad, yogi, and aspiring philosopher.",
  );
  const [location, setLocation] = useState("Bali, Indonesia");
  const [website, setWebsite] = useState("https://wisdom.app/sophia");

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        {/* <BlurView
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
                  // color={colors.cyan600}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <View style={styles.spacer} />
          </View>
        </BlurView> */}
        {/* Header */}
        {/* <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <TouchableOpacity>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View> */}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Cover + Avatar */}
            <View style={styles.cover}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFmguXY2BIxxD1wB67WDDzA5_PIepJ2zj3OitIefggpp2Uw3k-xt0NzowdpO7G8g1P1LWX6kGVR90Il623MP9HbmWh-veabHnv6U33rT65SBp8GjTKJcswG4Oeud7iSacCb_GFjsAZfZ9kZ2hBtXe3_iI6X8yeNiefXlaUJidJAiG3jV_YFtIQHxI9A8Xradadkrd8oyn-hX9mxTOv1Qm6CyQuykUjRMBWPg4e2tWl7lYB2N7WMDX0hUrijZj7QFpeQdwTIIrPr1o",
                }}
                style={styles.coverImg}
              />

              <View style={styles.avatarWrapper}>
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8w-adsPTIkMrSI2u9A4AtCxYmBbmMWbyE8lQE9uWM7KlxBf5oZANypMNHqr3iTwTZq-Wsz3FSvjokrE8D-IQwQV1qXEPqQ-h6RmEbwAehbl3ldKbhq_aeqKapLq6vpjNUQHtbXLJM-_WQe5IY0qzXWZil_E_7z6kH225TQmNfzGlf-nnat6wWE1TSjjzqJmlvGu8LSg6KMhwAMpB3Duy5l9R8_djeTzhlAlQCRRkdyim8T39sx2NbmAthp3cHpA7Or2V8x5pV4q4",
                  }}
                  style={styles.avatar}
                />
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input label="Full Name" value={name} onChange={setName} />
              <Input label="Username" value={username} onChange={setUsername} />

              {/* Bio */}
              <View style={styles.field}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  style={[styles.input, { height: 100 }]}
                />
                <Text style={styles.counter}>{bio.length}/160</Text>
              </View>

              <Input label="Location" value={location} onChange={setLocation} />
              <Input label="Website" value={website} onChange={setWebsite} />

              {/* Private Section */}
              <View style={styles.privateBox}>
                <Text style={styles.privateTitle}>Private Info</Text>

                <Input label="Email" value="sophia.h@gmail.com" />
                <Input label="Phone" value="+1 555 012 3456" />
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.discard}>
                  <Text>Discard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn}>
                  <Text style={{ color: "#fff" }}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </View>
  );
};

const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange?: (text: string) => void;
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChange} style={styles.input} />
  </View>
);

export default EditProfileScreen;

const styles = StyleSheet.create({
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
    // color: colors.onSurface,
    letterSpacing: -0.5,
  },
  spacer: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 80 : 60,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  close: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  save: {
    color: "#00647c",
    fontWeight: "600",
  },
  cover: {
    height: 250,
  },
  coverImg: {
    width: "100%",
    height: "100%",
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -40,
    left: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  form: {
    marginTop: 60,
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
  },
  counter: {
    fontSize: 10,
    alignSelf: "flex-end",
    color: "#777",
  },
  privateBox: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  privateTitle: {
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  discard: {
    padding: 12,
  },
  saveBtn: {
    backgroundColor: "#00647c",
    padding: 12,
    borderRadius: 20,
  },
});
