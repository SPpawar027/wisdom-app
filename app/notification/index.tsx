// NotificationsScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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

    cyan50: '#ecfeff',
    cyan700: '#0e7490',
};

const tabs = ['All', 'Mentions', 'Likes'];

const notifications = [
    {
        id: '1',
        type: 'like',
        user: {
            name: 'Julian Rivera',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWHPZ7sgUvrTF7MDmdK_P5p206zPRJ4F8KHrtSe9UkmPyQRzfgceT2NGr3rZJPNSqKAEuEyEUc0X3Hr4YOF363kVGxMO6-Hktz6_L84eoBDDgplptiIq_dsRY6owo8G7pp-rEL0edQHAZYjmPKlqM_tgYbeykaYe9VHeikTrIj8pOBQpk4orQbvZLhJ1Jgq6X7B6f71vR6IU6AkzMev2A0Q0lo8NUYxWxH1GqsCEfCef-3rcedhI5OwG9DOQFRwX0tjqgEWpm8dnE',
        },
        content: 'liked your quote',
        preview: '"Happiness depends upon ourselves."',
        time: '2m ago',
        isUnread: true,
    },
    {
        id: '2',
        type: 'comment',
        user: {
            name: 'Elena Vance',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFBaXuZIz3l_4uT3G89ujXUC5Uh2jpoPF43Pppm24ILODKzXHwGgNWxo61gIf-9vNp5np7qZiJTRDbpvoqf_QUjKrDP5u9RKI_fSndchL5ojTi1kzA9tue6CrhnulX8DY2CAgx5QPBWxnIc4AJ94W6WWHzs50FSP51icbLl2z8KRapSL7Thaun27gqGMiZfMT9CwZsvOgtrma0eX2ULG6DXlj89H9qugEK5jr3LetU4aJz9p5Iai0NU9-00quInWMqvQslDnlY7o0',
        },
        content: 'commented on your post',
        comment: 'This is so inspiring!',
        time: '15m ago',
        isUnread: false,
    },
    {
        id: '3',
        type: 'follow',
        user: {
            name: 'Marcus Aurelius',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeiys_-LElyaX6iWv1Kcki8A_NGvTcB4AiO6bw7TR4i3Jg3wqnzXnH88H7bN2k1DLqliwR9QOj71VZa6vsxHRcZXpy26Yyu_aQ6SvzcHnjhcfllukXFQoTtLSesrPd_WW4ySszC_F-adYiqQeKlahuomF8vvQ4y-puPXx4vwrpnnbM-Cdl8BURsyjON56p_hEjei63Nl_esrcglP8buKDXpUPIsNI3EfOsbFdTpRtHQRAEb1168ctgWgOO_Kh2_6YFdDHM0E_S6Rg',
        },
        content: 'started following you',
        time: '1h ago',
        isUnread: true,
    },
    {
        id: '4',
        type: 'system',
        title: 'Wisdom of the Day',
        content: '"The only true wisdom is in knowing you know nothing."',
    },
];

const TabButton = ({ label, isActive, onPress }) => (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
        <Text style={[
            styles.tabText,
            isActive && styles.tabTextActive
        ]}>
            {label}
        </Text>
        {isActive && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
);

const NotificationIcon = ({ type }) => {
    const getIconConfig = () => {
        switch (type) {
            case 'like':
                return { name: 'favorite', color: colors.onTertiaryContainer, bg: colors.tertiaryContainer };
            case 'comment':
                return { name: 'chat-bubble', color: colors.onSecondaryContainer, bg: colors.secondaryContainer };
            case 'follow':
                return { name: 'person-add', color: colors.onPrimaryContainer, bg: colors.primaryContainer };
            case 'system':
                return { name: 'lightbulb', color: colors.onSecondaryContainer, bg: colors.secondaryContainer, fill: true };
            default:
                return { name: 'notifications', color: colors.onSurfaceVariant, bg: colors.surfaceContainerHigh };
        }
    };

    const config = getIconConfig();

    if (type === 'system') {
        return (
            <View style={[styles.systemIconContainer, { backgroundColor: config.bg }]}>
                <MaterialIcons name={config.name} size={24} color={config.color} />
            </View>
        );
    }

    return null;
};

const UserAvatar = ({ uri, notificationType }) => (
    <View style={styles.avatarWrapper}>
        <Image source={{ uri }} style={styles.avatar} />
        <View style={[
            styles.notificationBadge,
            {
                backgroundColor: notificationType === 'like' ? colors.tertiaryContainer :
                    notificationType === 'comment' ? colors.secondaryContainer :
                        colors.primaryContainer
            }
        ]}>
            <MaterialIcons
                name={notificationType === 'like' ? 'favorite' :
                    notificationType === 'comment' ? 'chat-bubble' : 'person-add'}
                size={14}
                color={notificationType === 'like' ? colors.onTertiaryContainer :
                    notificationType === 'comment' ? colors.onSecondaryContainer :
                        colors.onPrimaryContainer}
            />
        </View>
    </View>
);

const NotificationCard = ({ item }) => {
    if (item.type === 'system') {
        return (
            <View style={[styles.card, styles.systemCard]}>
                <NotificationIcon type="system" />
                <View style={styles.systemContent}>
                    <Text style={styles.systemTitle}>{item.title}</Text>
                    <Text style={styles.systemQuote}>{item.content}</Text>
                </View>
            </View>
        );
    }

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <UserAvatar uri={item.user.avatar} notificationType={item.type} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.notificationText}>
                        <Text style={styles.userName}>{item.user.name}</Text> {item.content}
                    </Text>
                    <View style={styles.metaContainer}>
                        <Text style={styles.timeText}>{item.time}</Text>
                        {item.isUnread && <View style={styles.unreadDot} />}
                    </View>
                </View>
                {item.preview && (
                    <Text style={styles.previewText}>{item.preview}</Text>
                )}
                {item.comment && (
                    <View style={styles.commentBox}>
                        <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                )}
                {item.type === 'follow' && (
                    <TouchableOpacity style={styles.followButton}>
                        <LinearGradient
                            colors={[colors.primary, colors.primaryContainer]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.followGradient}
                        >
                            <Text style={styles.followText}>Follow Back</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const EmptyState = () => (
    <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
            <MaterialIcons name="auto-awesome" size={80} color={colors.primary} style={{ opacity: 0.4 }} />
        </View>
        <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyTitle}>No new wisdom yet</Text>
            <Text style={styles.emptySubtitle}>When you get mentioned or someone likes your thoughts, they'll appear here.</Text>
        </View>
    </View>
);

const NotificationsScreen = () => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('All');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

            {/* Top App Bar */}
            <BlurView intensity={80} tint="light" style={[styles.topBar, { paddingTop: insets.top }]}>
                <View style={styles.topBarContent}>
                    <View style={styles.topBarLeft}>
                        <View style={styles.userAvatarContainer}>
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdEifHKy8t_LlOhiH33g9dTIHDWvB-Aco9lDcGB-Goy64Sj90q6TnoLGwqephplMrHiP2szRSeZJLN8vb_NGglIpCOye3R7DVjMEe0T3FaeWbqOlm3uGrh3GioJ99a-ckeC63kPPL_JrdC0psC_Sh_6WzSQWeUCxxF8ZUco_7d_1tk8I525h8WirTZ50kKYPCvzrwcGX_u10W0uSbSI-Lz8igd_h-LH9pd1gFiaoL-_CqVwvPrKFarXCTQMQdmY5DxHHkOUx398t4' }}
                                style={styles.topAvatar}
                            />
                        </View>
                        <Text style={styles.headerTitle}>Notifications</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsButton}>
                        <MaterialIcons name="settings" size={24} color={colors.cyan700} />
                    </TouchableOpacity>
                </View>
            </BlurView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab}
                            label={tab}
                            isActive={activeTab === tab}
                            onPress={() => setActiveTab(tab)}
                        />
                    ))}
                </View>

                {/* Notification List */}
                <View style={styles.notificationsList}>
                    {notifications.map((item) => (
                        <NotificationCard key={item.id} item={item} />
                    ))}
                </View>

                {/* Empty State (Hidden by default) */}
                {false && <EmptyState />}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: 'rgba(0, 100, 124, 0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    topBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    userAvatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.secondaryContainer,
        overflow: 'hidden',
        shadowColor: colors.secondaryContainer,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 15,
        shadowOpacity: 0.5,
        elevation: 4,
    },
    topAvatar: {
        width: '100%',
        height: '100%',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.cyan700,
        letterSpacing: -0.5,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 100 : 80,
        paddingHorizontal: 24,
    },
    tabsContainer: {
        flexDirection: 'row',
        gap: 32,
        marginBottom: 40,
    },
    tabButton: {
        position: 'relative',
        paddingBottom: 8,
    },
    tabText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.onSurfaceVariant,
    },
    tabTextActive: {
        fontWeight: '700',
        color: colors.primary,
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: '25%',
        right: '25%',
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    notificationsList: {
        gap: 24,
    },
    card: {
        backgroundColor: colors.surfaceContainerLowest,
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.05,
        elevation: 1,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: colors.secondaryContainer,
        shadowColor: colors.secondaryContainer,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity: 0.3,
        elevation: 2,
    },
    notificationBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.surfaceContainerLowest,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        gap: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    notificationText: {
        flex: 1,
        fontSize: 16,
        color: colors.onSurface,
        lineHeight: 22,
    },
    userName: {
        fontWeight: '700',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.outlineVariant,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error,
    },
    previewText: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
        fontStyle: 'italic',
    },
    commentBox: {
        backgroundColor: colors.surfaceContainerLow,
        borderRadius: 8,
        padding: 12,
    },
    commentText: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
    },
    followButton: {
        alignSelf: 'flex-start',
        borderRadius: 9999,
        overflow: 'hidden',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    followGradient: {
        paddingHorizontal: 24,
        paddingVertical: 10,
    },
    followText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onPrimary,
    },
    systemCard: {
        borderLeftWidth: 4,
        borderLeftColor: colors.secondary,
    },
    systemIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    systemContent: {
        flex: 1,
        gap: 4,
    },
    systemTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.secondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    systemQuote: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.onSurface,
        fontStyle: 'italic',
        lineHeight: 24,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        gap: 24,
    },
    emptyIconContainer: {
        width: 192,
        height: 192,
        borderRadius: 96,
        backgroundColor: colors.surfaceContainerLow,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTextContainer: {
        alignItems: 'center',
        gap: 8,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.onSurface,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        maxWidth: 320,
        lineHeight: 20,
    },
});

export default NotificationsScreen;