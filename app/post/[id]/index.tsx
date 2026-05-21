// DetailedPostScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Material Design 3 Color Tokens - Exact from HTML
const colors = {
    primary: '#00647c',
    onPrimary: '#e2f6ff',
    primaryContainer: '#72d9fd',
    onPrimaryContainer: '#004a5d',
    primaryFixedDim: '#63cbee',
    onPrimaryFixed: '#003543',
    onPrimaryFixedVariant: '#005469',
    primaryDim: '#00576c',

    secondary: '#00666e',
    onSecondary: '#d1faff',
    secondaryContainer: '#a1eff8',
    onSecondaryContainer: '#005b62',
    secondaryFixed: '#a1eff8',
    secondaryFixedDim: '#93e1ea',
    onSecondaryFixed: '#00474d',
    onSecondaryFixedVariant: '#00666e',
    secondaryDim: '#005960',

    tertiary: '#a02d70',
    onTertiary: '#ffeff3',
    tertiaryContainer: '#ff8bc5',
    onTertiaryContainer: '#630040',
    tertiaryFixed: '#ff8bc5',
    tertiaryFixedDim: '#f976ba',
    onTertiaryFixed: '#360021',
    onTertiaryFixedVariant: '#73004b',
    tertiaryDim: '#912063',

    surface: '#f5f6f8',
    onSurface: '#2c2f31',
    surfaceVariant: '#dadde0',
    onSurfaceVariant: '#595c5e',
    surfaceBright: '#f5f6f8',
    surfaceDim: '#d1d5d8',
    surfaceContainer: '#e6e8eb',
    surfaceContainerLow: '#eff1f3',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerHigh: '#e0e3e5',
    surfaceContainerHighest: '#dadde0',

    background: '#f5f6f8',
    onBackground: '#2c2f31',

    outline: '#757779',
    outlineVariant: '#abadaf',

    inverseSurface: '#0c0f10',
    inverseOnSurface: '#9b9d9f',
    inversePrimary: '#72d9fd',

    error: '#b31b25',
    onError: '#ffefee',
    errorContainer: '#fb5151',
    onErrorContainer: '#570008',
    errorDim: '#9f0519',

    slate100: '#f1f5f9',
    slate900: '#0f172a',
};

const comments = [
    {
        id: '1',
        name: 'Elena Grace',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeiz7OmxqXiCanV4dkmz5dn4CAAbTxDWNrhdvI33xAlfSdhoKXl7kGRwmfqKxOraRQs7lr2X2rT6AYMKKpXegwNWf0H6mCDU36dG51OAEMqMKvTSxUsx21bp4bPE1R0zUdYeAc3BphmAwraFi5QOJ3rNuNPoiIBLGAEIkRS8PSE_nt5pyg6StPZUlryUEZVzXj32w6b5F1FLU7u0JNnwR5BivewBHkELuEtyZS9Kecv_5K7DXTluc-OdNKNtGhvMeEayUtO126vFg',
        time: '2 hours ago',
        text: "This reminds me that growth isn't about the destination, but the courage to start. Thank you for this reminder today.",
    },
    {
        id: '2',
        name: 'Marcus Thorne',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvRDHu7hOVH15DxERTnSWbGXQH5YYDfnM6AZdb14sry7l7gXkyNJa2XoX6OIgPsBeTwkoHsN0qRpbrdvRrgF6Kfvr4Ltlea20M9wZ6TX3NXMoCCnOxOtI_zGmHpCiEeeNkpcHHX-JsnNKIg-4rUM783qmZsn5F-m-d8ynOHNK7_pCnRYDgT1K4ot40j08j3eW3didXGMQT3EW1OE3o6YVdcVWk1E0R83ahYx82PJolrw4QmAcgFUppJuNTw-g-7Hk_BPbUf9Quv2Q',
        time: '5 hours ago',
        text: 'The hardest step is often the first. Once you\'re moving, momentum takes over. Beautifully presented.',
    },
];

const relatedWisdom = [
    {
        id: '1',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-w_hl7c4jDJIBdhCYXVsZqXRzafIu381R-5iV4uT42L_CqDimYnlx5oF4yHXkTqNrsdOnvAFBR8fMznIjbHcqJdHNlkJSUAkebYHS3TpLvoZYYEqJgUBPgBIJaHcrJfPOR-7bDTXqcpSeLsJHKjc1mi-fZuWqisRcTDFGfZA8iCZocRL4UHvDqnXw1y8JdL-xroCXyuXC66A7B7zk4UCTf6mOMAbrnHeFRCPJCvtx7CYtmRBG0luK8orR_LIlb7Hki5vp7qtxyk0',
        tag: 'Mindfulness',
        title: 'Finding Stillness in a World of Noise',
        readTime: '4 min read',
    },
    {
        id: '2',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqUE6AqdKwWmxjIlXKOIFxoFLOCC3C1_u9h9KqcVaIRs0VXPyz0V0ytF7IOYqIJ5WI45pUkTsSkGNG9GyyECAwEQgjYfTFFXj_xJcQIREnrsg6t3-VGBQZ6KvnFuLszjCy3TvL11bTuQDYmqiuJDSRXyvB6VkuBbYQttpvhdaWAmBmkooRYgTOP9M0ff1yXJEvgGZNHWS9LpZmibLiHOLmmorDVIKTVncDwKFQJlPx39vrDiF6f-FuoKa83JnmTeh2NwbUhRAJIiA',
        tag: 'Resilience',
        title: 'The Power of Flow and Persistence',
        readTime: '6 min read',
    },
    {
        id: '3',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4wfExzQlAkxcXY1a8-tExfj4Abz1T9q7TBd_st5gLYbWPmIXeVAVrFOxXoyTg4S1c4f6pF5bXWz7QmPorXsxaoFn3wfXoZ0c0nIsF5Rb7tA1Zk_ngc4BXeck2E8JRyIHwnJdQO2J7tMnpWnFpnPR8tmOIp0aqG_xvye78VWvEw9Onq2gNbkxINv6Aku4LxBMiwXGpdBP0ab-Be-9NO6kRoFO9CPb-Lg4dT7v4Ksy4fp_aZLhaCjfABMMmGqB2uzpQVVNVYiMzVEQ',
        tag: 'Growth',
        title: 'Rooting Deeply to Reach the Stars',
        readTime: '5 min read',
    },
];

const CommentItem = ({ comment }) => (
    <View style={styles.commentCard}>
        <View style={styles.commentHeader}>
            <View style={styles.commentAuthor}>
                <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                <View>
                    <Text style={styles.commentName}>{comment.name}</Text>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
            </View>
            <TouchableOpacity>
                <MaterialIcons name="more-horiz" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
    </View>
);

const RelatedCard = ({ item }) => (
    <TouchableOpacity style={styles.relatedCard} activeOpacity={0.8}>
        <View style={styles.relatedImageContainer}>
            <Image source={{ uri: item.image }} style={styles.relatedImage} />
            <View style={styles.relatedTag}>
                <Text style={styles.relatedTagText}>{item.tag}</Text>
            </View>
        </View>
        <View style={styles.relatedContent}>
            <Text style={styles.relatedTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.relatedMeta}>
                <MaterialIcons name="schedule" size={12} color={colors.onSurfaceVariant} />
                <Text style={styles.relatedReadTime}>{item.readTime}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const DetailedPostScreen = () => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Top Navigation */}
            <BlurView intensity={80} tint="light" style={[styles.topNav, { paddingTop: insets.top }]}>
                <View style={styles.topNavContent}>
                    <TouchableOpacity style={styles.navButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.slate900} />
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Wisdom</Text>
                    <TouchableOpacity style={styles.navButton}>
                        <MaterialIcons name="share" size={24} color={colors.slate900} />
                    </TouchableOpacity>
                </View>
            </BlurView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', colors.surface]}
                        style={styles.heroGradient}
                    />
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5WHlH78Yr-7w8IPUKoeZZiBh3vjxUiDm2nXS9kvoaaCoaiq11j-PHvUKGPxUId83faODhfrDzs7kOGTOWuMUAuKpjhBnJzW02NJN8hItQ7X65Bpw0V5r8tNbTu1yemml9vMRcCl7EE13rpIhfkVJJqzKaEa7IPxXM_qGbm3w4ULb-zliUiUQWntCWDSvhxGrZHP35XwII-YoYiI4OxTH6YslfvwANYUJvhV0tjOUxgeX0cKNH6qJtTrUuA-LwDV-blYIjJ856U0w' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroQuote}>"The journey of a thousand miles begins with a single step."</Text>
                        <View style={styles.heroDivider} />
                    </View>
                </View>

                {/* Content Container */}
                <View style={styles.contentContainer}>
                    {/* Author Card */}
                    <View style={styles.authorCard}>
                        <View style={styles.authorInfo}>
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdkH9RQPNqbs1QbVPwsU8xkrV_RR20-Rd9T6fD9DifjOH2a6ifIxKiy3dZ1PdiJWhEzyEiF9w-HI-sDob0bInija4q3Au69yaKsdnj40-lHHo_wO_5o4k9svPu5v7b9BXwUk0AM-CZ9ETKCejJ2K9hvQaYE7dclJLPb1jwNMRq8RSE2KZpqA0y3JkxJzlICFj3vtJWeZmkDPpRf9D8hI8vMhuJkDMqz6scSdYhKYPp5Di1NkyPMcUwthYSTQWTQkKNmHo2_5nMiYc' }}
                                style={styles.authorAvatar}
                            />
                            <View>
                                <Text style={styles.authorName}>Dr. Julian Vance</Text>
                                <Text style={styles.authorTitle}>Philosophy & Mindfulness Expert</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.followButton}>
                            <LinearGradient
                                colors={[colors.primary, colors.primaryContainer]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.followGradient}
                            >
                                <Text style={styles.followText}>Follow</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Engagement Stats */}
                    <View style={styles.engagementBar}>
                        <View style={styles.engagementLeft}>
                            <TouchableOpacity style={styles.engagementItem}>
                                <MaterialIcons name="favorite" size={20} color={colors.tertiary} />
                                <Text style={styles.engagementCount}>1.2k</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.engagementItem}>
                                <MaterialIcons name="chat-bubble" size={20} color={colors.onSurfaceVariant} />
                                <Text style={styles.engagementCount}>450</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.engagementRight}>
                            <TouchableOpacity>
                                <MaterialIcons name="share" size={20} color={colors.onSurfaceVariant} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <MaterialIcons name="bookmark" size={20} color={colors.onSurfaceVariant} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Comments Section */}
                    <View style={styles.commentsSection}>
                        <Text style={styles.sectionTitle}>Thoughtful Conversations</Text>
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </View>

                    {/* Related Wisdom Carousel */}
                    <View style={styles.relatedSection}>
                        <View style={styles.relatedHeader}>
                            <Text style={styles.sectionTitle}>Related Wisdom</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.relatedScroll}
                        >
                            {relatedWisdom.map((item) => (
                                <RelatedCard key={item.id} item={item} />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Comment Input */}
            <BlurView intensity={80} tint="light" style={[styles.bottomInput, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.inputContainer}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEOPfserG1OjYpDhRxamf7bPEr4bMD93kpvvohklsYOmzViyPeBFhv8eUfQt0gLL-vsiUGkdhfwNGgJrWVMibHzVugG2eNLhQ_31Z75mU5szD5VsdL7FJ5CVZK4ptzrBwL7fBgBTWpv8q8tSy1vguiaCeLE3lkrFnnH5ORgcqRwfXvcv2XmnrSelVyhEs6uBaA05wkfP25rpQGJN8ZGwrLkOMI-1IKkNqCF8tnZCI6azXRArjG-Ke45XYkloqwfIaNG9wOV9QoKyI' }}
                        style={styles.inputAvatar}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write a thoughtful comment..."
                        placeholderTextColor={colors.onSurfaceVariant + '99'}
                    />
                    <TouchableOpacity style={styles.sendButton}>
                        <MaterialIcons name="send" size={20} color={colors.onPrimary} />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    topNav: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    topNavContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.slate900,
        letterSpacing: -0.5,
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        width: '100%',
        height: 618,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroContent: {
        position: 'relative',
        zIndex: 20,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    heroQuote: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroDivider: {
        width: 64,
        height: 4,
        backgroundColor: colors.primaryContainer,
        borderRadius: 2,
        marginTop: 32,
    },
    contentContainer: {
        maxWidth: 896,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 24,
        marginTop: -48,
        position: 'relative',
        zIndex: 30,
    },
    authorCard: {
        backgroundColor: colors.surfaceContainerLowest,
        borderRadius: 12,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        shadowColor: 'rgba(0, 100, 124, 0.06)',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 40,
        elevation: 2,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    authorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: colors.primaryContainer + '4D', // 30% opacity
    },
    authorName: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.onSurface,
    },
    authorTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.onSurfaceVariant,
        marginTop: 2,
    },
    followButton: {
        borderRadius: 9999,
        overflow: 'hidden',
    },
    followGradient: {
        paddingHorizontal: 32,
        paddingVertical: 12,
    },
    followText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.onPrimary,
    },
    engagementBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 8,
    },
    engagementLeft: {
        flexDirection: 'row',
        gap: 32,
    },
    engagementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    engagementCount: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
    },
    engagementRight: {
        flexDirection: 'row',
        gap: 24,
    },
    commentsSection: {
        marginTop: 48,
        gap: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    commentCard: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 12,
        padding: 24,
        gap: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    commentAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    commentName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.onSurface,
    },
    commentTime: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: 2,
    },
    commentText: {
        fontSize: 16,
        color: colors.onSurface,
        lineHeight: 24,
    },
    relatedSection: {
        marginTop: 80,
    },
    relatedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    relatedScroll: {
        gap: 24,
        paddingRight: 24,
    },
    relatedCard: {
        width: 256,
        backgroundColor: colors.surfaceContainerLowest,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.05,
        elevation: 1,
    },
    relatedImageContainer: {
        height: 128,
        position: 'relative',
    },
    relatedImage: {
        width: '100%',
        height: '100%',
    },
    relatedTag: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: colors.secondaryContainer,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    relatedTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.onSecondaryContainer,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    relatedContent: {
        padding: 16,
    },
    relatedTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.onSurface,
        lineHeight: 20,
    },
    relatedMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 12,
    },
    relatedReadTime: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.onSurfaceVariant,
    },
    bottomInput: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 9999,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxWidth: 896,
        alignSelf: 'center',
        width: '100%',
    },
    inputAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: colors.onSurface,
        paddingVertical: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DetailedPostScreen;