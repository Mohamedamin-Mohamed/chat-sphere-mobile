import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useCallback, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/types";
import sendVerificationPin from "../../../api/sendVerificationPin";
import Toast from "react-native-toast-message";
import VerificationUI from "../../../components/VerificationUI";
import emailValidation from "../../../utils/emailValidation";
import emailLookup from "../../../api/emailLookup";
import verifyCode from "../../../api/verifyCode";

type VerificationCodeState = Record<number, string>;

const Page = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const email = userInfo.email
    const phoneNumber = userInfo.phoneNumber

    const [disabled, setDisabled] = useState(false)
    const [phoneInput, setPhoneInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [showVerificationModal, setShowVerificationModal] = useState(false)
    const [verificationCode, setVerificationCode] = useState<VerificationCodeState>({})
    const [verificationError, setVerificationError] = useState("")
    const inputRefs = useRef<Array<TextInput | null>>([])

    const handleSubmit = async () => {
        const request = {
            email: email, phoneNumber:  "+1" + phoneInput
        }
        console.log(request)
        try {
            setLoading(true)
            const response = await sendVerificationPin(request, new AbortController())
            const responseJson = await response.json()
            const succeeded = responseJson.success
            const message = responseJson.message
            Toast.show({
                type: succeeded ? 'success' : 'error',
                text1: message,
                onShow: () => {
                    setDisabled(true)
                },
                onHide: () => {
                    setDisabled(false)
                    if (succeeded) {
                        setShowVerificationModal(true)
                    }
                }
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

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

    const onCancel = () => {

    }
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.headerContainer}>
                <View style={styles.buttonView}>
                    <TouchableOpacity
                        disabled={disabled}
                        activeOpacity={0.8}
                        onPress={() => router.back()}
                        style={styles.backButton}>
                        <Icon name="arrow-back" size={28} color="white"/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.backButtonText}>{phoneNumber === '' ? 'Add' : 'Change'} Phone Number</Text>
            </View>
            <View style={{padding: 20}}>
                <Text style={styles.title}>Enter your phone number</Text>
                <Text style={styles.subtitle}>We'll send you a code to verify it</Text>

                <View style={styles.inputRow}>
                    <TouchableOpacity style={styles.countryCode}>
                        <Text>+1</Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Phone number"
                        keyboardType="number-pad"
                        value={phoneInput}
                        onChangeText={setPhoneInput}
                        style={styles.input}
                    />
                    {phoneInput.length > 0 && (
                        <TouchableOpacity onPress={() => setPhoneInput('')}>
                            <Icon name="cancel" size={20}/>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.sendPin} activeOpacity={0.9}>
                    <Text style={styles.sendPinText}>Send Pin</Text>
                </TouchableOpacity>
                <Toast position='top'/>
            </View>
            {showVerificationModal &&
                <VerificationUI
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
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '76%',
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    buttonView: {
        flexDirection: 'row',
        gap: 10,
    },
    backButton: {
        backgroundColor: "black",
        width: 40,
        height: 40,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: 'center'
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        color: '#111',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        height: 50,
        marginBottom: 20,
    },
    countryCode: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111',
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    sendPin: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#085bd8',
        paddingVertical: 16
    },
    sendPinText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
})

export default Page