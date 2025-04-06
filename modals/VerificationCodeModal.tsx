import {Dispatch, SetStateAction, useCallback, useRef, useState} from "react";
import {ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import verifyCode from "../api/verifyCode";

type VerificationCodeState = Record<number, string>;

interface VerificationCodeModalProps {
    handleModalDisplay: () => void,
    email: string,
    setPasswordResetModalDisplay: Dispatch<SetStateAction<boolean>>
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
                                                                      handleModalDisplay,
                                                                      email, setPasswordResetModalDisplay
                                                                  }) => {
    const [verificationCode, setVerificationCode] = useState<VerificationCodeState>({});
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const otp = require('../assets/images/otp.png')

    const inputRefs = useRef<Array<TextInput | null>>([]);

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

        if (val && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        } else if (!val && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    }, []);

    const handleCodeVerification = async () => {
        const code = Object.values(verificationCode).join("")
        if (code.length !== 6) {
            setError('Please enter all 6 digits')
            return
        }
        setError('')
        try {
            setLoading(true)
            const response = await verifyCode(email, code, new AbortController());

            if (!response.ok) {
                const message = await response.text()
                setError(message)
            } else {
                handleModalDisplay()
                setPasswordResetModalDisplay(true)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    const handleBackspace = (index: number, nativeEvent: { key: string }) => {
        if (nativeEvent.key === "Backspace" && !verificationCode[index]) {
            handleChange("", index);
        }
    };
    return (
        <Modal transparent={true} visible={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleModalDisplay}/>
                <View style={styles.modalContent}>
                    <Icon name="close" size={26} style={{marginLeft: "auto"}} onPress={handleModalDisplay}/>
                    <>
                        <Image source={otp} style={styles.image} />
                        <Text style={styles.headerText}> Verify</Text>
                    <Text style={styles.subHeaderText}>Your code was sent you via email</Text>
                </>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 10,
                    gap: 10
                }}>
                    {Array(6).fill('').map((_, index) => (
                        <TextInput
                            key={index}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={[
                                styles.verificationInput,
                                verificationCode[index] && styles.filledInput
                            ]}
                            value={verificationCode[index]?.toString()}
                            onChangeText={val => handleChange(val, index)}
                            onKeyPress={({nativeEvent}) => handleBackspace(index, nativeEvent)}
                            ref={el => inputRefs.current[index] = el}
                        />
                    ))}
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <TouchableOpacity disabled={disabled} style={styles.verifyButton} activeOpacity={0.8}
                                  onPress={handleCodeVerification}>
                    {loading ? <ActivityIndicator size="small" color="white"/> :
                        <Text style={styles.verifyText}>Verify</Text>}
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't receive code?</Text>
                    <TouchableOpacity onPress={handleModalDisplay} activeOpacity={0.8}>
                        <Text style={[styles.footerText, styles.linkText]}>Request again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
</Modal>
)
    ;
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    filledInput: {
        borderColor: "#085bd8",
        borderWidth: 1
    },
    modalContent: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 4,
        padding: 20
    },
    image: {
        width: "80%",
        height: 200
    },
    verificationInput: {
        borderColor: "gray",
        borderRadius: 4,
        borderWidth: 0.4,
        padding: 10,
        width: 40,
        textAlign: 'center'
    },
    headerText: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: '600',
    },
    subHeaderText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "300"
    },
    verifyButton: {
        backgroundColor: "#085bd8",
        padding: 15,
        borderRadius: 8,
        marginVertical: 16,
        alignSelf: 'center'
    },
    verifyText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: 20
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 8
    },
    footerText: {
        textAlign: "center",
        fontSize: 16
    },
    linkText: {
        fontWeight: "bold",
        color: "#5d8edf",
        fontSize: 16,
        textDecorationLine: "underline"
    }
});

export default VerificationCodeModal;
