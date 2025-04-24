import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { router } from "expo-router";
import SocialAccounts from "../../components/SocialAccounts";
import { signInWithApple, useGoogleOAuth } from "../../hooks/Oauth";
import Toast from "react-native-toast-message";

const Welcome = () => {
    
    const { googlePromptAsync } = useGoogleOAuth();

    const navigateToSignIn = () => router.push('/SignIn');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.gradient}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerView}>
                        <Text style={styles.title}>Welcome to Our Community!</Text>
                        <View style={styles.subHeadView}>
                            <Text style={styles.subtitle}>Connect, chat, and collaborate with</Text>
                            <Text style={styles.subtitle}>your campus and community.</Text>
                        </View>
                    </View>

                    <View style={styles.buttonsView}>
                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={() => router.push('/SignUp')}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.buttonText}>Create an Account</Text>
                        </TouchableOpacity>

                        <SocialAccounts googlePromptAsync={googlePromptAsync} appleSignIn={signInWithApple} />

                        <View style={styles.signInContainer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={navigateToSignIn} activeOpacity={0.8}>
                                <Text style={[styles.footerText, styles.linkText]}> Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.supportContainer}>
                        <Text style={styles.supportText}>Need help? Reach out to our support team!</Text>
                        <TouchableOpacity onPress={() => router.push('/Support')} activeOpacity={0.8}>
                            <Text style={styles.supportLink}>Contact Support</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Toast topOffset={64} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        backgroundColor: "#125dc4",
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 20,
        justifyContent: 'center', // This centers the content vertically
    },
    headerView: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    subHeadView: {
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 5,
        letterSpacing: 0.5,
    },
    buttonsView: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    signUpButton: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: 'center',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#125dc4',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    signInContainer: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
    },
    footerText: {
        color: 'white',
        fontSize: 16,
    },
    linkText: {
        fontWeight: 'bold',
        color: 'white',
        textDecorationLine: 'underline',
    },
    supportContainer: {
        alignItems: 'center',
    },
    supportText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        opacity: 0.9,
    },
    supportLink: {
        fontWeight: 'bold',
        color: 'white',
        textDecorationLine: 'underline',
        marginTop: 5,
        fontSize: 16,
    },
});

export default Welcome;