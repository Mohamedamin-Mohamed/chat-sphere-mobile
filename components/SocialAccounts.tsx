import {AuthSessionResult} from "expo-auth-session";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, {Dispatch, useState} from "react";
import {useDispatch} from "react-redux";
import {UnknownAction} from "redux";

interface SocialAccountsProps {
    googlePromptAsync: () => Promise<AuthSessionResult>,
    appleSignIn: (dispatch: Dispatch<UnknownAction>) => Promise<void>,
    disabled: boolean
}

const SocialAccounts: React.FC<SocialAccountsProps> = ({googlePromptAsync, appleSignIn, disabled}) => {
    const dispatch = useDispatch()
    const [googlePressed, setGooglePressed] = useState(false);
    const [applePressed, setApplePressed] = useState(false);

    const handlePressIn = (type: 'google' | 'apple') => {
        if (type === 'google') setGooglePressed(true);
        else setApplePressed(true);
    };

    const handlePressOut = (type: 'google' | 'apple') => {
        if (type === 'google') setGooglePressed(false);
        else setApplePressed(false);
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine}/>
                <Text style={styles.separatorText}>Or continue with</Text>
                <View style={styles.separatorLine}/>
            </View>

            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={() => googlePromptAsync()}
                    onPressIn={() => handlePressIn('google')}
                    onPressOut={() => handlePressOut('google')}
                    style={[
                        styles.socialButton,
                        googlePressed && styles.socialButtonPressed,
                        {backgroundColor: "#ffffff"}
                    ]}
                    activeOpacity={0.8}
                >
                    <Icon name="google" size={22} color="#4285F4" style={styles.icon}/>
                    <Text style={[styles.socialText, {color: "#5f6368"}]}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={disabled}
                    onPress={() => appleSignIn(dispatch)}
                    onPressIn={() => handlePressIn('apple')}
                    onPressOut={() => handlePressOut('apple')}
                    style={[
                        styles.socialButton,
                        applePressed && styles.socialButtonPressed,
                        {backgroundColor: "#000000"}
                    ]}
                    activeOpacity={0.8}
                >
                    <Icon name="apple" size={24} color="#FFFFFF" style={styles.icon}/>
                    <Text style={[styles.socialText, {color: "#FFFFFF"}]}>Apple</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        alignItems: "center",
    },
    separatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        marginVertical: 15,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    separatorText: {
        textAlign: "center",
        fontSize: 16,
        color: "white",
        paddingHorizontal: 10,
        fontWeight: "500",
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        width: "90%",
        marginTop: 5,
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    socialButtonPressed: {
        opacity: 0.8,
        transform: [{scale: 0.98}],
    },
    icon: {
        marginRight: 10,
    },
    socialText: {
        fontSize: 16,
        fontWeight: "600",
    }
});

export default SocialAccounts;