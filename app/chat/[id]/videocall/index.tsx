import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const chatData = [
    { id: "1", name: "Elena Ray", message: "This is so profound!" },
    { id: "2", name: "Marcus Aurel", message: "Peace to you all." },
    { id: "3", name: "Sophie Chen", message: "So peaceful." },
];

const LiveScreen = () => {
    return (
        <View style={styles.container}>
            {/* Background */}
            <Image
                source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDomsyGi_rXleGjA3TQSP8NS6LC-lUAlgs_Q758qm2CxF0F8kgMtq_onFFEIUgX6mAy84Et2jTo1UzsOzojxE3uGvTP3hoi7ao7XyDopQpGoYaoAXgmq5HmKcpSmOBA_VnEaZXhcn5RCIS44YvYPnLn55z_FvIjvRydqp07aetSkFY8WtKl6jP4WGJvVmF0HX_MAZqivaqnw9Sl5plBnsY2lc9UZXTFIK9y1tJ0IGHx4ffo1w7jr-ox7TXOHE8eSyyHhrc5AEVoQGI",
                }}
                style={styles.background}
            />

            {/* Overlay Gradient */}
            <View style={styles.overlay} />

            {/* PIP Video */}
            <View style={styles.pipContainer}>
                <Image
                    source={{
                        uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR3G8eAYnWBR7Oho2K8Mpwr3fhLtMP8VvFwNMuowhAWz7mo5LDfU8K1YEK9cIzndagYSqoKNp-d-xQFvGYLWqJsg0lt750j5qOt0MUTphUBsqJWLdx9jhQbbgAJD79EjumbfRroj8kZVtbgh-kZc4Q54u6f22xJ7srPKXA_KLaCEkL8AW1wudFC_nN4QJdBm2f6NMQJljIa9jnv2HobiYptlZEihkxbLvFHAw_kOBBNhUvsGXE4Ucf6d2l816NhbiMYIm5ngdj8Mw",
                    }}
                    style={styles.pip}
                />
                <Text style={styles.micOff}>🔇</Text>
            </View>

            {/* Live Tag */}
            <View style={styles.liveTag}>
                <View style={styles.dot} />
                <Text style={styles.liveText}>LIVE</Text>
            </View>

            {/* Chat */}
            <View style={styles.chatContainer}>
                <FlatList
                    data={chatData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.chatBubble}>
                            <Text style={styles.chatName}>{item.name}</Text>
                            <Text style={styles.chatMsg}>{item.message}</Text>
                        </View>
                    )}
                />
            </View>

            {/* Reactions */}
            <View style={styles.reactions}>
                {["❤️", "🧘", "📖", "🎉"].map((emoji, index) => (
                    <TouchableOpacity key={index} style={styles.reactionBtn}>
                        <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bottom Controls */}
            <View style={styles.controls}>
                <ControlButton label="🎤" />
                <ControlButton label="📹" />

                <TouchableOpacity style={styles.endCall}>
                    <Text style={{ color: "#fff", fontSize: 18 }}>📞</Text>
                </TouchableOpacity>

                <ControlButton label="😊" />
                <ControlButton label="⋯" />
            </View>
        </View>
    );
};

const ControlButton = ({ label }: { label: string }) => (
    <TouchableOpacity style={styles.controlBtn}>
        <Text style={{ color: "#fff", fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
);

export default LiveScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    pipContainer: {
        position: "absolute",
        top: 40,
        right: 20,
        width: 100,
        height: 140,
        borderRadius: 12,
        overflow: "hidden",
    },
    pip: {
        width: "100%",
        height: "100%",
    },
    micOff: {
        position: "absolute",
        bottom: 5,
        right: 5,
        color: "#fff",
        fontSize: 12,
    },
    liveTag: {
        position: "absolute",
        top: 40,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#a1eff8",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: "red",
        borderRadius: 3,
        marginRight: 6,
    },
    liveText: {
        fontSize: 12,
        fontWeight: "700",
    },
    chatContainer: {
        position: "absolute",
        bottom: 160,
        left: 10,
        width: 220,
        maxHeight: 250,
    },
    chatBubble: {
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 8,
        borderRadius: 10,
        marginBottom: 6,
    },
    chatName: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "600",
    },
    chatMsg: {
        color: "#fff",
        fontSize: 12,
    },
    reactions: {
        position: "absolute",
        bottom: 110,
        alignSelf: "center",
        flexDirection: "row",
        gap: 10,
    },
    reactionBtn: {
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 10,
        borderRadius: 30,
    },
    emoji: {
        fontSize: 16,
    },
    controls: {
        position: "absolute",
        bottom: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    controlBtn: {
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 14,
        borderRadius: 30,
    },
    endCall: {
        backgroundColor: "red",
        padding: 18,
        borderRadius: 40,
    },
});