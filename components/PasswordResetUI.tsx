import React from "react";
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const RESET_IMAGE = require("../assets/images/reset.png");

interface PasswordResetUIProps {
    loading: boolean
    disabled: boolean
    passwordError: string
    handlePasswordChange: (key: string, val: string) => void
    handleResetPassword: () => Promise<void>
    onCancel: () => void
}

const PasswordResetUI: React.FC<PasswordResetUIProps> = ({
                                                             loading,
                                                             disabled,
                                                             passwordError,
                                                             handlePasswordChange,
                                                             handleResetPassword,
                                                             onCancel
                                                         }) => {
    return (
        <>
            <Icon name="close" size={26} style={styles.closeIcon} disabled={disabled} onPress={onCancel}/>
            <Image source={RESET_IMAGE} style={styles.passwordResetImage}/>
            <Text style={styles.passwordResetHeaderText}>Reset Password</Text>

            <View style={styles.passwordFormContainer}>
                <TextInput
                    keyboardType="default"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder="Password"
                    placeholderTextColor="#2b2b2b"
                    onChangeText={(text) => handlePasswordChange("password", text)}
                    style={styles.input}
                />

                <TextInput
                    keyboardType="default"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder="Confirm Password"
                    placeholderTextColor="#2b2b2b"
                    onChangeText={(text) => handlePasswordChange("confirmPassword", text)}
                    style={styles.input}
                />

                {passwordError ? <Text style={styles.passwordResetErrorText}>{passwordError}</Text> : null}

                <TouchableOpacity
                    disabled={disabled}
                    style={[styles.passwordResetButton, disabled && styles.disabledButton]}
                    activeOpacity={0.8}
                    onPress={handleResetPassword}
                >
                    {loading ?
                        <ActivityIndicator size="small" color="white"/> :
                        <Text style={styles.passwordResetText}>Reset Password</Text>
                    }
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    closeIcon: {
        marginLeft: "auto",
    },
    passwordResetImage: {
        width: "80%",
        height: 200,
        resizeMode: "contain",
        alignSelf: "center"
    },
    passwordFormContainer: {
        marginTop: 10,
        gap: 16
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        width: "100%",
        fontSize: 16,
    },
    passwordResetHeaderText: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "600",
    },
    passwordResetButton: {
        backgroundColor: "#085bd8",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
        marginTop: 10
    },
    disabledButton: {
        opacity: 0.5
    },
    passwordResetText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    passwordResetErrorText: {
        color: "red",
    },
});

export default PasswordResetUI;