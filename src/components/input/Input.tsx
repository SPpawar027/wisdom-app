import { C } from "@/src/theme/theme";
import { useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface InputFieldProps {
    label: string;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: 'email-address' | 'default';
    value: string;
    onChangeText: (text: string) => void;
}


export const InputField = ({
    label,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    value,
    onChangeText,
}: InputFieldProps) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const animBorder = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setFocused(true);
        Animated.spring(animBorder, { toValue: 1, useNativeDriver: false, speed: 20 }).start();
    };
    const handleBlur = () => {
        setFocused(false);
        Animated.spring(animBorder, { toValue: 0, useNativeDriver: false, speed: 20 }).start();
    };

    const shadowOpacity = animBorder.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] });
    const bgColor = animBorder.interpolate({
        inputRange: [0, 1],
        outputRange: [C.surfaceContainerLow, C.surfaceContainerLowest],
    });

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <Animated.View
                style={[
                    styles.inputWrapper,
                    { backgroundColor: bgColor, shadowOpacity },
                ]}
            >
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={C.outlineVariant}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                        <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
        </View>
    );
};


const styles = StyleSheet.create({
    // Form
    form: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: C.onSurfaceVariant,
        textTransform: 'uppercase',
        marginLeft: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
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
        paddingVertical: Platform.OS === 'ios' ? 16 : 14,
        letterSpacing: -0.2,
    },
    eyeBtn: {
        padding: 4,
    },
    eyeIcon: {
        fontSize: 18,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '600',
        color: C.primary,
    },

})
