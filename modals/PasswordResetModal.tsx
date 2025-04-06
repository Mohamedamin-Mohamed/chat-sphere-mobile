import {useState} from "react";
import {ActivityIndicator, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Toast from "react-native-toast-message";
import resetPassword from "../api/resetPassword";
import {router} from "expo-router";

interface Passwords {
    password: string;
    confirmPassword: string;
}

const PasswordResetModal = ({handleModalDisplay, email}: { handleModalDisplay: () => void, email: string }) => {
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [passwords, setPasswords] = useState<Passwords>({password: "", confirmPassword: ""});
    const reset = require("../assets/images/reset.png");

    const handleChange = (key: string, val: string) => {
        setPasswords((prevState) => ({
            ...prevState,
            [key]: val,
        }));
    };

    const handleResetPassword = async () => {
        setErr("");

        if (!passwords.password || !passwords.confirmPassword) {
            setErr("Passwords are required");
            return;
        }

        if (passwords.password !== passwords.confirmPassword) {
            setErr("Passwords don't match");
            return;
        }

        // validate password strength
        const hasLetter = /[a-zA-Z]/.test(passwords.password);
        const hasNumber = /[0-9]/.test(passwords.password);

        if (!(passwords.password.length >= 16 || (passwords.password.length >= 8 && hasLetter && hasNumber))) {
            setErr("Password must be at least 16 characters, or 8 characters with one number and one letter.");
            return;
        }

        try {
            setLoading(true)
            const request = {email: email, password: passwords.password}
            const response = await resetPassword(request, new AbortController());
            const succeeded = response.status
            const message = await response.text()

            Toast.show({
                type: succeeded ? "success" : "error",
                text1: message,
                ...succeeded && {text2: 'Redirecting'},
                onShow: () => setDisabled(true),
                onHide: () => {
                    handleModalDisplay()
                    setDisabled(false)
                    succeeded && router.back()
                }
            })

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Modal transparent={true} visible={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Image source={reset} style={styles.image}/>
                    <Text style={styles.headerText}>Reset Password</Text>
                    <View style={{marginVertical: 10, gap: 16}}>
                        <TextInput
                            keyboardType="default"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            placeholder="Password"
                            placeholderTextColor="#2b2b2b"
                            onChangeText={(text) => handleChange("password", text)}
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
                            onChangeText={(text) => handleChange("confirmPassword", text)}
                            style={styles.input}
                        />
                        {err ? <Text style={styles.errorText}>{err}</Text> : null}
                        <TouchableOpacity
                            disabled={disabled}
                            style={[styles.passwordResetButton, disabled && {opacity: 0.5}]}
                            activeOpacity={0.8}
                            onPress={handleResetPassword}
                        >
                            {loading ? <ActivityIndicator size="small" color="white"/> :
                                <Text style={styles.passwordResetText}>Reset Password</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast/>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 4,
        padding: 20,
    },
    image: {
        width: "80%",
        height: 200,
        resizeMode: "contain",
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        width: "100%",
        fontSize: 16,
    },
    headerText: {
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
    passwordResetText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginTop: 8,
    },
});

export default PasswordResetModal;
