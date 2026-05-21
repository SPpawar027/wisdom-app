// app/(app)/(tabs)/chat/[groupId].tsx
import { socket } from "@/src/services/api";
import { getGroupMessages, joinChat } from "@/src/services/chat.service";
import { useAuthStore } from "@/src/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Types
type MessageType = "text" | "image" | "wisdom" | "system";

interface Message {
  id: string;
  type: MessageType;
  image?: string;
  name?: string;
  sender: string | number;
  avatar?: string;
  content?: string;
  imageUrl?: string;
  quote?: string;
  source?: string;
  timestamp: string;
  isMe: boolean;
  status?: "sent" | "delivered" | "read";
}

// const MESSAGES: Message[] = [
//   {
//     id: "3",
//     type: "image",
//     sender: "Aria",
//     avatar:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
//     content:
//       "Thank you for the warm welcome! Just shared a quick inspiration from my morning walk. 🌿",
//     imageUrl:
//       "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
//     timestamp: "10:02 AM",
//     isMe: false,
//   },
//   {
//     id: "4",
//     type: "text",
//     sender: "Me",
//     content: "That's stunning, Aria. The lighting is perfect.",
//     timestamp: "10:05 AM",
//     isMe: true,
//     status: "read",
//   },
//   {
//     id: "5",
//     type: "text",
//     sender: "Me",
//     content: "Exactly what we needed for the Zen mode palette.",
//     timestamp: "10:05 AM",
//     isMe: true,
//     status: "read",
//   },
//   {
//     id: "6",
//     type: "wisdom",
//     sender: "Seneca",
//     avatar:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
//     quote:
//       "True happiness is to enjoy the present, without anxious dependence upon the future, not to amuse ourselves with either hopes or fears but to rest satisfied with what we have.",
//     source: "Epistulae Morales",
//     timestamp: "10:12 AM",
//     isMe: false,
//   },
//   {
//     id: "7",
//     type: "text",
//     sender: "Marcus",
//     avatar:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
//     content: "The soul becomes dyed with the color of its thoughts.",
//     timestamp: "10:15 AM",
//     isMe: false,
//   },
//   {
//     id: "8",
//     type: "text",
//     sender: "Me",
//     content:
//       "Well said. I think we should incorporate this into our next design sprint.",
//     timestamp: "10:16 AM",
//     isMe: true,
//     status: "read",
//   },
//   {
//     id: "9",
//     type: "image",
//     sender: "Aria",
//     avatar:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
//     content: "Here are some more references I found.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
//     timestamp: "10:20 AM",
//     isMe: false,
//   },
//   {
//     id: "10",
//     type: "text",
//     sender: "Plato",
//     avatar:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
//     content: "Courage is knowing what not to fear.",
//     timestamp: "10:25 AM",
//     isMe: false,
//   },
// ];

export default function GroupChatScreen() {
  const param: any = useLocalSearchParams();
  const id = param?.id;
  const username = param?.username;
  const { user }: any = useAuthStore();
  // console.log("🚀 ~ GroupChatScreen ~ user:", user)
  const router: any = useRouter();
  const [messages, setMessages] = useState<any>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState<any>({ isTyping: false, name: "" });
  const flatListRef = useRef<FlatList>(null);
  const [chatId, setChatId] = useState();
  console.log("🚀 ~ GroupChatScreen ~ chatId:", chatId)
  // Scroll to bottom logic removed as we are using inverted FlatList

  useEffect(() => {
    setChatId(id);
    socket.on("receive_message", (message: any) => {
      if (chatId === message.chatId) {
        setMessages((prev: any) => [message, ...prev]);
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

  const fetchGroupMessages = async () => {
    try {
      const res = await getGroupMessages(id);
      joinChat(user?.id);
      // Inverted list needs newest messages first
      setMessages([...res].reverse());
    } catch (err) {
      console.log("🚀 ~ fetchGroupMessages ~ err:", err)
    }
  }

  useEffect(() => {
    fetchGroupMessages();
  }, [id])

  const isTypingRef = useRef<boolean>(false);
  const typingTimeoutRef: any = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!inputText) {
      if (isTypingRef.current || chatId) {
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

    if (!isTypingRef.current || chatId) {
      socket.emit("typing_start", {
        chatId: chatId,
        sender: user?.id,
        isTyping: true,
        name: user?.username,
      })
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
      }, 1000);
    }
  }, [inputText, username, id])

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: any = {
      id: Date.now().toString(),
      image: user?.avatar || "https://img.freepik.com/premium-photo/innocent-smile-child_948023-4846.jpg?semt=ais_incoming&w=740&q=80",
      name: user?.username,
      text: inputText,
      sender: user.id,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      _id: Date.now().toString(),
    };

    socket.emit("send_message", {
      chatId,
      sender: user.id,
      text: inputText,
      name: user?.username,
      image: user?.avatar || "https://img.freepik.com/premium-photo/innocent-smile-child_948023-4846.jpg?semt=ais_incoming&w=740&q=80",
    });
    setMessages((prev: any) => [newMessage, ...prev]);
    setInputText("");
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === user.id || item.sender?._id === user.id;
    if (isMe) {
      return <SentMessage message={item} />;
    }
    return <ReceivedMessage message={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#2c2f31" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push(`/chat/group/detail/${chatId}`)} style={styles.groupInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200",
                }}
                style={styles.groupAvatar}
              />
              <View style={styles.statusIndicator} />
            </View>
            <View>
              <Text style={styles.groupName}>{username}</Text>
              <View style={styles.activeBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeText}>48 members active</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="videocam" size={22} color="#595c5e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="call" size={22} color="#595c5e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={22} color="#595c5e" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <StatusBar style="dark" />

        {/* Messages */}
        <View style={styles.messagesWrapper}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyboardShouldPersistTaps="handled"
            renderItem={renderMessage}
            keyExtractor={(item: any) => item._id || item.id || Math.random().toString()}
            inverted
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={isTyping.isTyping ? <TypingIndicator username={isTyping.name} /> : null}
          />
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color="#595c5e" />
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Share your wisdom..."
                placeholderTextColor="rgba(89, 92, 94, 0.4)"
                multiline
                onKeyPress={(e: any) => {
                  if (
                    Platform.OS === "web" &&
                    e.nativeEvent.key === "Enter" &&
                    !e.nativeEvent.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <TouchableOpacity style={styles.emojiButton}>
                <Ionicons name="happy-outline" size={22} color="#595c5e" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// Sub-components remain the same...
function DateSeparator({ label }: { label: string }) {
  return (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <Text style={styles.dateText}>{label}</Text>
      <View style={styles.dateLine} />
    </View>
  );
}

function SystemMessage({ content }: { content: string }) {
  return (
    <View style={styles.systemMessageContainer}>
      <Text style={styles.systemMessage}>{content}</Text>
    </View>
  );
}

function ReceivedMessage({ message }: { message: any }) {
  return (
    <View style={styles.receivedContainer}>
      <Image source={{ uri: message.image }} style={styles.messageAvatar} />
      <View style={styles.receivedContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{message.name}</Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>

        {message.type === "Wisdom" ? (
          <View style={styles.wisdomBubble}>
            <Ionicons name="chatbubble-ellipses" size={24} color="rgba(160, 45, 112, 0.3)" />
            {/* <Text style={styles.wisdomQuote}>{message.quote}</Text> */}
            {/* <Text style={styles.wisdomSource}>— {message.source}</Text> */}
          </View>
        ) : message.type === "image" ? (
          <>
            <View style={styles.receivedBubble}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
            <Image
              source={{ uri: message.image }}
              style={styles.messageImage}
            />
          </>
        ) : (
          <View style={styles.receivedBubble}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function SentMessage({ message }: { message: any }) {
  return (
    <View style={styles.sentContainer}>
      <View style={styles.sentBubble}>
        <Text style={styles.sentText}>{message.text}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.sentTimestamp}>{message.timestamp}</Text>
        {message.status === "read" && (
          <Ionicons name="checkmark-done" size={14} color={COLORS.primary} />
        )}
      </View>
    </View>
  );
}

function TypingIndicator({ username }: { username: string }) {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    dot2.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    dot3.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
  }, []);

  const dotStyle = (anim: any) =>
    useAnimatedStyle(() => ({
      opacity: 0.4 + anim.value * 0.6,
      transform: [{ translateY: -anim.value * 4 }],
    }));

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
          <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
          <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
        </View>
        <Text style={styles.typingText}>{username} is typing...</Text>
      </View>
    </View>
  );
}

const COLORS = {
  surface: "#f5f6f8",
  surfaceContainerLow: "#eff1f3",
  surfaceContainerHigh: "#e0e3e5",
  primary: "#00647c",
  primaryContainer: "#72d9fd",
  secondary: "#00666e",
  secondaryContainer: "#a1eff8",
  tertiary: "#a02d70",
  tertiaryContainer: "#ff8bc5",
  onSurface: "#2c2f31",
  onSurfaceVariant: "#595c5e",
  outlineVariant: "#abadaf",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "web" ? 12 : 50,
    paddingBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 100, 124, 0.05)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  groupName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.onSurface,
    fontFamily: "PlusJakartaSans-Bold",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  activeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  headerActions: {
    flexDirection: "row",
    gap: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  // Messages - CRITICAL FIX: flex: 1 to allow scrolling
  messagesWrapper: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 24,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(171, 173, 175, 0.3)",
  },
  dateText: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(89, 92, 94, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  systemMessage: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(89, 92, 94, 0.6)",
    backgroundColor: "rgba(239, 241, 243, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(171, 173, 175, 0.1)",
  },
  // Received
  receivedContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
    maxWidth: "85%",
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "white",
  },
  receivedContent: {
    flex: 1,
    gap: 6,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
    marginLeft: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.onSurface,
    fontFamily: "PlusJakartaSans-Bold",
  },
  receivedBubble: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.onSurface,
    fontFamily: "Inter-Medium",
  },
  messageImage: {
    width: 280,
    height: 160,
    borderRadius: 16,
    marginTop: 4,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  timestamp: {
    fontSize: 10,
    color: "rgba(89, 92, 94, 0.4)",
  },
  sentTimestamp: {
    fontSize: 10,
    color: "rgba(89, 92, 94, 0.4)",
    marginRight: 2,
  },
  // Wisdom
  wisdomBubble: {
    backgroundColor: "#fdfcfb",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.tertiary,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  wisdomQuote: {
    fontSize: 16,
    lineHeight: 26,
    fontStyle: "italic",
    color: "rgba(44, 47, 49, 0.9)",
    marginTop: 8,
    fontFamily: "Georgia-Italic",
  },
  wisdomSource: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(160, 45, 112, 0.7)",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 12,
    textAlign: "right",
  },
  // Sent
  sentContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginBottom: 8,
    maxWidth: "85%",
  },
  sentBubble: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  sentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#e2f6ff",
    fontFamily: "Inter-Medium",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginRight: 4,
  },
  // Typing
  typingContainer: {
    paddingLeft: 48,
    marginBottom: 25,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 100, 124, 0.6)",
  },
  typingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(0, 100, 124, 0.8)",
    fontStyle: "italic",
  },
  // Input - CRITICAL FIX: No absolute positioning, part of flex layout
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    paddingTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(20px)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(224, 227, 229, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 241, 243, 0.9)",
    borderRadius: 24,
    paddingLeft: 20,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  textInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    fontSize: 15,
    color: COLORS.onSurface,
    fontFamily: "Inter-Regular",
    paddingVertical: 12,
  },
  emojiButton: {
    padding: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
