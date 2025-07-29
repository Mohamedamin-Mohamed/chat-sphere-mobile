import {router} from "expo-router"
import React, {useState} from "react";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons";
import emailValidation from "../../utils/emailValidation";
import Toast from "react-native-toast-message";
import VerificationCodeModal from "../../modals/VerificationCodeModal";
import api from "../../api/api";
import axios from "axios";

enum ResetFlow {
    EmailLookup,
    Verification,
}

const EmailLookup = () => {
    const [err, setErr] = useState<Partial<{ email: string }>>({email: ''})
    const [email, setEmail] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const [currentFlowStep, setCurrentFlowStep] = useState<ResetFlow>(ResetFlow.EmailLookup)

    const forgot = require('../../assets/images/forgot.png')

    const handleEmailLookup = async () => {
        if (!email) {
            setErr({email: "Email is required"});
            return;
        } else if (!emailValidation(email)) {
            setErr({email: "Email is not valid"});
            return;
        }

        setErr({});
        setLoading(true);

        try {
            const controller = new AbortController();
            const response = await api.get(
                `auth/signin/email_lookup/generate_code`,
                {
                    params: {email},
                    signal: controller.signal,
                }
            );

            const message = response.data || "Success";

            Toast.show({
                type: 'success',
                text1: message,
                onShow: () => setDisabled(true),
                onHide: () => {
                    setDisabled(false);
                    setCurrentFlowStep(ResetFlow.Verification);
                }
            });

        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                const status = err.response.status;
                const message = err.response.data || "Something went wrong";

                if (status === 404) {
                    setErr({email: message});
                } else {
                    Toast.show({
                        type: 'error',
                        text1: message,
                        onShow: () => setDisabled(true),
                        onHide: () => setDisabled(false)
                    });
                }
            } else {
                console.error("Unexpected error:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleModalCancel = () => {
        setCurrentFlowStep(ResetFlow.EmailLookup)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={{marginBottom: 16, gap: 10, marginTop: 20}}>
                    <TouchableOpacity
                        disabled={disabled}
                        activeOpacity={0.8}
                        onPress={() => router.back()}
                        style={styles.signUpButtonView}
                    >
                        <Icon name="arrow-back" size={30} color="#085bd8"/>
                    </TouchableOpacity>
                </View>
                <Image source={forgot} style={styles.image}/>
                <View style={{gap: 10}}>
                    <Text style={styles.headerText}>Forgot Password?</Text>
                    <Text style={styles.subHeaderText}>Enter your registered email address below to receive password
                        reset instructions.</Text>
                </View>
                <View style={styles.inputView}>
                    <Text style={[styles.subHeaderText, {fontWeight: "500", fontSize: 20, color: "black"}]}>Email
                        address</Text>
                    <TextInput autoCapitalize="none" style={styles.input} keyboardType="visible-password"
                               value={email} onChangeText={setEmail}
                               placeholder="e.g your@example.com" placeholderTextColor="#2b2b2b"/>
                    {err.email && <Text style={styles.errorMessage}>{err.email}</Text>}
                </View>
                <TouchableOpacity disabled={disabled} style={styles.resetPasswordButton} activeOpacity={0.8}
                                  onPress={handleEmailLookup}>
                    {loading ? <ActivityIndicator size="small" color="white"/> :
                        <Text style={styles.resetPasswordText}>Send Instructions</Text>}
                </TouchableOpacity>

                {currentFlowStep === ResetFlow.Verification && (
                    <VerificationCodeModal
                        email={email}
                        handleModalDisplay={handleModalCancel}
                        onCancel={handleModalCancel}
                    />
                )}

                <Toast position="top" topOffset={64}/>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        width: "100%",
        backgroundColor: "white"
    },
    signUpButtonView: {
        backgroundColor: "#d6e4ff",
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3
    },
    image: {
        width: "80%",
        height: "30%"
    },
    backButton: {
        backgroundColor: "#a6c0ed",
        width: 50,
        height: 50,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30
    },
    headerText: {
        color: "#073ea0",
        fontSize: 26,
        fontWeight: "500"
    },
    subHeaderText: {
        fontSize: 16,
        fontWeight: "400",
        color: "#6b7280",
    },
    inputView: {
        marginVertical: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        marginTop: 18
    },
    resetPasswordButton: {
        backgroundColor: "#085bd8",
        padding: 15,
        borderRadius: 8,
        alignItems: "center"
    },
    resetPasswordText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    errorText: {
        color: "red",
        marginTop: 8,
    },
    errorMessage: {
        fontSize: 18,
        color: "red",
    },
    footerText: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 16
    },
    linkText: {
        fontWeight: "bold",
        color: "#085bd8",
        fontSize: 16
    }
})
export default EmailLookup