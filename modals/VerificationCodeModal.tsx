import {useCallback, useRef, useState} from "react";
import {Modal, StyleSheet, TextInput, View} from "react-native";
import Toast from "react-native-toast-message";
import {router} from "expo-router";

import verifyCode from "../api/verifyCode";
import emailLookup from "../api/emailLookup";
import resetPassword from "../api/resetPassword";

import emailValidation from "../utils/emailValidation";

import CodeVerificationUI from "../components/CodeVerificationUI";
import PasswordResetUI from "../components/PasswordResetUI";

type VerificationCodeState = Record<number, string>;

interface Passwords {
    password: string;
    confirmPassword: string;
}

interface VerificationCodeModalProps {
    email: string;
    handleModalDisplay: () => void;
    onCancel: () => void;
}

const VerificationCodeModal = ({
                                   email,
                                   handleModalDisplay,
                                   onCancel
                               }: VerificationCodeModalProps) => {

    const [verificationCode, setVerificationCode] = useState<VerificationCodeState>({});
    const [passwordResetModal, setPasswordResetModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationError, setVerificationError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwords, setPasswords] = useState<Passwords>({
        password: "",
        confirmPassword: ""
    });
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const showToast = (message: string, type: string) => {
        Toast.show({
            type: type,
            text1: message,
            onShow: () => setDisabled(true),
            onHide: () => setDisabled(false)
        });
    };

    const handleChange = useCallback((val: string, index: number) => {
        if (!/^\d*$/.test(val)) return; // only allow digits

        setVerificationCode(prevState => {
            const newState = {
                ...prevState,
                [index]: val
            };

            // enable button when all 6 digits are filled
            setDisabled(Object.keys(newState).length !== 6 ||
                Object.values(newState).some(v => !v));

            return newState;
        });

        // Move focus to next/previous input
        if (val && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        } else if (!val && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    }, []);

    const handleBackspace = (index: number, nativeEvent: { key: string }) => {
        if (nativeEvent.key === "Backspace" && !verificationCode[index]) {
            handleChange("", index);
        }
    };

    const handleEmailLookup = async () => {
        if (!email) {
            showToast('Email is required', 'error');
            return;
        }

        if (!emailValidation(email)) {
            showToast('Email is not valid', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await emailLookup(email, new AbortController());
            const message = await response.text();

            if (!response.ok) {
                showToast(message, 'error');
            } else {
                showToast(message, 'success');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCodeVerification = async () => {
        const code = Object.values(verificationCode).join("");
        if (code.length !== 6) {
            setVerificationError('Please enter all 6 digits');
            return;
        }

        setVerificationError('');

        try {
            setLoading(true);
            const response = await verifyCode(email, code, new AbortController());

            if (!response.ok) {
                const message = await response.text();
                setVerificationError(message);
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Reset your password',
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        setPasswordResetModal(true); // Display the modal after toast is hidden
                    }
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpRegeneration = async () => {
        setVerificationCode({});
        setVerificationError("");
        inputRefs.current[0]?.focus();
        await handleEmailLookup();
    };

    // Password management
    const handlePasswordChange = (key: string, val: string) => {
        setPasswords((prevState) => ({
            ...prevState,
            [key]: val,
        }));
    };

    const validatePassword = (password: string): boolean => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        return password.length >= 16 || (password.length >= 8 && hasLetter && hasNumber);
    };

    const handleResetPassword = async () => {
        setPasswordError("");

        if (!passwords.password || !passwords.confirmPassword) {
            setPasswordError("Passwords are required");
            return;
        }

        if (passwords.password !== passwords.confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }

        if (!validatePassword(passwords.password)) {
            setPasswordError("Password must be at least 16 characters, or 8 characters with one number and one letter.");
            return;
        }

        try {
            setLoading(true);
            const request = {email: email, password: passwords.password};
            const response = await resetPassword(request, new AbortController());
            const succeeded = response.ok;
            const message = await response.text();

            Toast.show({
                type: succeeded ? "success" : "error",
                text1: message,
                ...(succeeded && {text2: 'Redirecting'}),
                onShow: () => setDisabled(true),
                onHide: () => {
                    handleModalDisplay();
                    setDisabled(false);
                    succeeded && router.replace("/SignIn")
                }
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent={true} visible={true} animationType="slide">
            <Toast position="top"/>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {!passwordResetModal ? (
                        <CodeVerificationUI
                            verificationCode={verificationCode}
                            loading={loading}
                            disabled={disabled}
                            verificationError={verificationError}
                            inputRefs={inputRefs}
                            onCancel={onCancel}
                            handleChange={handleChange}
                            handleBackspace={handleBackspace}
                            handleCodeVerification={handleCodeVerification}
                            handleOtpRegeneration={handleOtpRegeneration}
                        />
                    ) : (
                        <PasswordResetUI
                            loading={loading}
                            onCancel={onCancel}
                            disabled={disabled}
                            passwordError={passwordError}
                            handlePasswordChange={handlePasswordChange}
                            handleResetPassword={handleResetPassword}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 4,
        padding: 20
    }
});

export default VerificationCodeModal;