import { socket } from "@/src/services/api";
import {
  getChatId,
  getChatMessages,
  joinChat,
} from "@/src/services/chat.service";
import { useAuthStore } from "@/src/store/auth.store";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Material Design 3 Color Tokens
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

  receiverBg: "#F1F5F9",
  senderBg: "#FDE68A",
  slate100: "#f1f5f9",
  amber200: "#fde68a",
};

const ReceiverMessage = ({ message }: any) => (
  <View key={message.id} style={styles.receiverContainer}>
    <View style={styles.receiverBubble}>
      <Image source={{ uri: message.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ19zVrcwLDHBj_No598DJAy1ZX6ZTgZw2q1g&s" }} style={styles.messageImage} />
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
    <Text style={styles.receiverTime}>{message.time || "Just now"}</Text>
  </View>
);

const SenderMessage = ({ message }: any) => (
  <View key={message.id} style={styles.senderContainer}>
    <View style={styles.senderBubble}>
      <Image source={{ uri: message.image || "https://img.freepik.com/premium-photo/innocent-smile-child_948023-4846.jpg?semt=ais_incoming&w=740&q=80" }} style={styles.messageImage} />
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
    <View style={styles.senderMeta}>
      <Text style={styles.senderTime}>{message.time || "Just now"}</Text>
      {message.status === "read" && (
        <MaterialIcons name="done-all" size={12} color={colors.primary} />
      )}
    </View>
  </View>
);

const TypingIndicator = ({ username }: any) => {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.typingText}>{username} is writing...</Text>
    </View>
  );
};

const IndividualChatScreen = () => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState("");
  const { username, id }: any = useLocalSearchParams();
  const [chatId, setChatId] = useState("");
  const [currentChat, setCurrentChat] = useState<any[]>([]);
  const { user }: any = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState<any>({ isTyping: false, name: "" });

  const renderMessage = ({ item: message }: any) => {
    const isCurrentUser = message.sender === user?.id;
    if (isCurrentUser) {
      return <SenderMessage key={message.id || message._id} message={message} />;
    }
    return <ReceiverMessage key={message.id || message._id} message={message} />;
  };

  const getChat = async () => {
    setLoading(true);
    try {
      const chatId = await getChatId(id);
      setChatId(chatId);
      const messages = await getChatMessages(chatId);
      joinChat(user?.id);
      // For inverted list, newest should be first
      setCurrentChat([...messages].reverse());
    } catch (error) {
      console.log("🚀 ~ getChat ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChat();
  }, [id]);

  useEffect(() => {
    socket.on("receive_message", (message: any) => {
      if (chatId === message.chatId) {
        setCurrentChat((prev: any) => [message, ...prev]);
      }
    });

    socket.on("connect_error", (err: any) => {
      console.log("❌ Connection error:", err.message);
    });

    socket.on("typing_start", (data: any) => {
      if (chatId === data.chatId) {
        setIsTyping({ isTyping: true, name: data.name });
      }
    });

    socket.on("typing_stop", (data: any) => {
      if (chatId === data.chatId) {
        setIsTyping({ isTyping: false, name: "" });
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing_start");
      socket.off("typing_stop");
    };
  }, [chatId]);

  const isTypingRef = useRef<boolean>(false);
  const typingTimeoutRef: any = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!inputText) {
      if (isTypingRef.current) {
        socket.emit("typing_stop", {
          chatId,
          sender: user?.id,
          isTyping: false,
        });
        isTypingRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    if (!isTypingRef.current) {
      socket.emit("typing_start", {
        chatId,
        sender: user?.id,
        isTyping: true,
        name: user?.username,
      });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", {
        chatId,
        sender: user?.id,
        isTyping: false,
      });
      isTypingRef.current = false;
    }, 2000);
  }, [inputText]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      chatId: chatId,
      sender: user?.id,
      text: inputText,
      name: user?.username,
      image: user?.avatar || "https://img.freepik.com/premium-photo/innocent-smile-child_948023-4846.jpg?semt=ais_incoming&w=740&q=80",
      _id: Date.now().toString(),
    };

    socket.emit("send_message", newMessage);
    setCurrentChat((prev: any) => [newMessage, ...prev]);
    setInputText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header outside of scrollable area */}
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.onSurface}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcvF-rsLxYikce5PJtXXpo6epa4oAWuMpYXsYorthE5Gn0z0ivpUOnRZ9BDsyxTX0zKM5FllEz22jmh3AsPu9pru9Yc431bX4r4GijndkTEBcC2w719RsKVGjvCsXq3ok_m-1RIMq0w5meOaHjMFC5EmYt5Fl-kWT66YiQk__KHRS8OjojVmxyIOAftVVXfQNkLbvJst2MFSqy7ER3Hy2BfDLiXxMr5KliZ8pkGcF7XyKJ_UTT3_D-8v5AuJGshu2JFPBUWyzxLMc",
                }}
                style={styles.headerAvatar}
              />
              <View style={styles.onlineIndicator} />
            </View>

            <View>
              <Text style={styles.headerName}>{username ?? "NA"}</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push("/chat/[id]/videocall")}
            style={styles.actionButton}
          >
            <MaterialIcons
              name="videocam"
              size={24}
              color={colors.onSurfaceVariant}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/chat/[id]/call")}
            style={styles.actionButton}
          >
            <MaterialIcons
              name="call"
              size={24}
              color={colors.onSurfaceVariant}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons
              name="more-vert"
              size={24}
              color={colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={currentChat}
              renderItem={renderMessage}
              keyExtractor={(item) => item._id || item.id || Math.random().toString()}
              inverted
              contentContainerStyle={styles.flatListContent}
              ListHeaderComponent={() => (
                isTyping.isTyping ? <TypingIndicator username={isTyping.name} /> : null
              )}
            />
          )}

          {/* Bottom Input Bar */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
              <MaterialIcons name="add" size={24} color={colors.onSurface} />
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Share your wisdom..."
                placeholderTextColor={colors.outlineVariant}
                value={inputText}
                onChangeText={setInputText}
                multiline
                onKeyPress={(e: any) => {
                  if (
                    Platform.OS === "web" &&
                    e.nativeEvent.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.sendButton}
              activeOpacity={0.7}
              disabled={!inputText.trim()}
            >
              <MaterialIcons name="send" size={24} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  headerStatus: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  receiverContainer: {
    alignItems: "flex-start",
    maxWidth: "85%",
    marginBottom: 16,
  },
  receiverBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.receiverBg,
    padding: 12,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  senderContainer: {
    alignItems: "flex-end",
    maxWidth: "85%",
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  senderBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.senderBg,
    padding: 12,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  messageText: {
    fontSize: 16,
    color: colors.onSurface,
    lineHeight: 22,
    fontWeight: "400",
    flexShrink: 1,
  },
  receiverTime: {
    fontSize: 10,
    color: colors.outline,
    marginTop: 4,
    marginLeft: 4,
  },
  senderMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginRight: 4,
  },
  senderTime: {
    fontSize: 10,
    color: colors.outline,
  },
  messageImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: "cover",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
  },
  typingBubble: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outlineVariant,
  },
  typingText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 22,
    maxHeight: 120,
    paddingHorizontal: 16,
  },
  textInput: {
    paddingVertical: 10,
    fontSize: 16,
    color: colors.onSurface,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IndividualChatScreen;
