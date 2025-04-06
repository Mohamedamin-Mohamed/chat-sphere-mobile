import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import SocialAccounts from "../../components/SocialAccounts";
import {signInWithApple, useGoogleOAuth} from "../../hooks/Oauth";

const Welcome = () => {
    const {googlePromptAsync} = useGoogleOAuth()

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <View style={styles.headerView}>
                    <Text style={styles.title}>Welcome</Text>
                    <View style={styles.subHeadView}>
                        <Text style={[styles.subtitle, {fontWeight: "400", fontSize: 15}]}>Connect, Chat,
                            Collaborate with</Text>
                        <Text style={styles.subtitle}>your Campus & your Community.</Text>
                    </View>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={styles.googleButton} onPress={() => router.push('/SignUp')}>
                        <Text style={styles.buttonText}>Create an account</Text>
                    </TouchableOpacity>

                </View>
                <View style={{gap: 10, flexDirection: "row", justifyContent: "center"}}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("/SignIn")} activeOpacity={0.8}>
                        <Text style={[styles.footerText, styles.linkText]}>Sign In</Text>
                    </TouchableOpacity>
                </View>
                <SocialAccounts googlePromptAsync={googlePromptAsync} appleSignIn={signInWithApple}  />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#125dc4",
        justifyContent: "center",
        padding: 20
    },
    childContainer: {
        flex: 0.2
    },
    headerView: {
        marginLeft: 40
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10
    },
    subHeadView: {
        marginVertical: 16,
    },
    subtitle: {
        fontSize: 16,
        color: "white",
        padding: 4,
        fontWeight: "600",
    },
    googleButton: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        marginBottom: 10
    },
    createAccountButton: {
        borderWidth: 1,
        borderColor: "white",
        padding: 12,
        borderRadius: 10,
        width: "80%",
        alignItems: "center"
    },
    createAccountButtonText: {
        color: "white"
    },
    buttonsView: {
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        color: "#0d49a8",
        fontWeight: "bold"
    },
    footerText: {
        textAlign: "center",
        marginTop: 20,
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    linkText: {
        fontWeight: "bold",
        color: "white"
    }
})

export default Welcome
