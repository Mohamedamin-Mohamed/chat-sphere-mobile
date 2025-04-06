import {AuthSessionResult} from "expo-auth-session"
import {StyleSheet, Text, View} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import React from "react";

interface SocialAccountsProps {
    googlePromptAsync: () => Promise<AuthSessionResult>,
    appleSignIn: () => Promise<void>,
}

const SocialAccounts: React.FC<SocialAccountsProps> = ({googlePromptAsync, appleSignIn}) => {
    return (
        <View style={{marginVertical: 20, gap: 20}}>
            <Text style={{textAlign: "center", fontSize: 16}}>Or continue with</Text>
            <View style={styles.container}>
                <Icon name="google" size={25} style={styles.iconWrapper} onPress={() => googlePromptAsync()}/>
                <Icon name="apple" size={25} style={styles.iconWrapper} onPress={() => appleSignIn()}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    iconWrapper: {
        backgroundColor: "#dfdfdf",
        borderRadius: 8,
        borderColor: "gray",
        borderWidth: 0.4,
        padding: 12
    }
})
export default SocialAccounts