import {router} from "expo-router"
import {useState} from "react";
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
import emailLookup from "../../api/emailLookup";
import Toast from "react-native-toast-message";
import VerificationCodeModal from "../../modals/VerificationCodeModal";

enum ResetFlow {
    EmailLookup,
    Verification,
}

const EmailLookup = () => {
    const [err, setErr] = useState<Partial<{ email: string }>>({email: ''})
    const [email, setEmail] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    // Replace separate modal states with a single flow state
    const [currentFlowStep, setCurrentFlowStep] = useState<ResetFlow>(ResetFlow.EmailLookup)

    const forgot = require('../../assets/images/forgot.png')

    const handleEmailLookup = async () => {
        if (!email) {
            setErr({email: "Email is required"})
            return
        } else if (!emailValidation(email)) {
            setErr({email: "Email is not valid"})
            return
        }
        setErr({})
        try {
            setLoading(true)
            const response = await emailLookup(email, new AbortController());
            const message = await response.text()
            if (!response.ok) {
                if (response.status === 404) {
                    setErr({email: message})
                } else {
                    Toast.show({
                        type: 'error',
                        text1: message,
                        onShow: () => setDisabled(true),
                        onHide: () => setDisabled(false)
                    })
                }
            } else {
                Toast.show({
                    type: 'success',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        // Move to verification step
                        setCurrentFlowStep(ResetFlow.Verification)
                    }
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleModalCancel = () => {
        setCurrentFlowStep(ResetFlow.EmailLookup)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="#085bd8"/>
                </TouchableOpacity>
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

                {/* Render verification modal when in verification step */}
                {currentFlowStep === ResetFlow.Verification && (
                    <VerificationCodeModal
                        email={email}
                        handleModalDisplay={handleModalCancel}
                        onCancel={handleModalCancel}
                    />
                )}

                <Toast position="top"/>
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
        fontSize: 28,
        fontWeight: "500"
    },
    subHeaderText: {
        fontSize: 16,
        fontWeight: "400",
        color: "gray"
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