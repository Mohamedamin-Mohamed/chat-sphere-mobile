import React, {Dispatch, SetStateAction, useCallback, useRef, useState} from "react";
import {ActivityIndicator, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import {setUserInfo} from "../redux/userSlice";
import {useDispatch} from "react-redux";
import {router} from "expo-router";
import api from "../api/api";
import axios from "axios";

const OTP_IMAGE = require('../assets/images/otp.png');

interface PinVerificationUIProps {
    setShowPinVerificationModal: Dispatch<SetStateAction<boolean>>,
    phoneNumber: string,
    email: string
}

const PinVerificationUI = ({setShowPinVerificationModal, phoneNumber, email}: PinVerificationUIProps) => {
    const [verificationPin, setVerificationPin] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const dispatch = useDispatch()

    const handleChange = useCallback((val: string, index: number) => {
        if (!/^\d*$/.test(val)) return;

        setVerificationPin(prev => {
            const updated = {...prev, [index]: val};
            setDisabled(Object.values(updated).filter(Boolean).length !== 6);
            return updated;
        });

        if (val && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    }, []);

    const handleBackspace = (index: number, nativeEvent: { key: string }) => {
        if (nativeEvent.key === "Backspace" && !verificationPin[index]) {
            setVerificationPin(prev => {
                return {...prev, [index - 1]: ""};
            });

            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePinVerification = async () => {
        const pin = Object.values(verificationPin).join("");
        if (pin.length !== 6) {
            setVerificationError("Please enter all 6 digits");
            return;
        }

        Keyboard.dismiss();
        setVerificationError("");

        try {
            setLoading(true);
            const request = {
                email: email, phoneNumber: "+1" + phoneNumber, pin: pin
            }
            const response = await api.post('api/twilio/code/verify', request)
            const responseJson = await response.data
            const succeeded = responseJson.success
            const message = responseJson.message

            if (!succeeded) {
                setVerificationError(message);
            } else {
                showToastMessage(true, "Pin verified!")
            }
        } catch (exp: any) {
            if (axios.isAxiosError(exp) && exp.response) {
                const text = exp.response.statusText
                showToastMessage(false, text)
                return
            }
            console.error(exp);
            setVerificationError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const showToastMessage = (succeeded: boolean, message: string) => {
        Toast.show({
            type: succeeded ? 'success' : 'error',
            text1: message,
            onShow: () => {
                setDisabled(false)
                setShowPinVerificationModal(false)
                if (succeeded) {
                    dispatch(setUserInfo({phoneNumber: phoneNumber}))
                    router.back()
                }
            }
        })
    }
    const handlePinRegeneration = async () => {
        setVerificationPin({});
        setVerificationError("");
        inputRefs.current.forEach(ref => ref?.clear());
        inputRefs.current[0]?.focus();
        await resendVerificationPin()
    }

    const resendVerificationPin = async () => {
        try {
            setLoading(true)
            const request = {
                email: email, phoneNumber: "+1" + phoneNumber
            }
            const response = await api.post('api/twilio/code/send', request)

            const responseJson = await response.data
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
                        setShowPinVerificationModal(true)
                    }
                }
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setVerificationPin({});
        setVerificationError("");
        inputRefs.current.forEach(ref => ref?.clear());
        setShowPinVerificationModal(false)
    };

    return (
        <View style={styles.screen}>
            <View style={styles.formWrapper}>
                <Icon name="close" size={26} style={styles.closeIcon} disabled={disabled} onPress={handleCancel}/>

                <Image source={OTP_IMAGE} style={styles.image}/>
                <Text style={styles.headerText}>Enter Verification Code</Text>
                <Text style={styles.subHeaderText}>A 6-digit code was sent as an sms</Text>

                <View style={styles.codeInputContainer}>
                    {Array(6).fill('').map((_, index) => (
                        <TextInput
                            key={index}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={[
                                styles.verificationInput,
                                verificationPin[index] && styles.filledInput
                            ]}
                            value={verificationPin[index] || ""}
                            onChangeText={val => handleChange(val, index)}
                            onKeyPress={({nativeEvent}) => handleBackspace(index, nativeEvent)}
                            ref={el => inputRefs.current[index] = el}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                {verificationError ? (
                    <Text style={styles.errorText}>{verificationError}</Text>
                ) : null}

                <TouchableOpacity
                    disabled={disabled || loading}
                    style={[styles.verifyButton, (disabled || loading) && {opacity: 0.6}]}
                    activeOpacity={0.8}
                    onPress={handlePinVerification}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white"/>
                    ) : (
                        <Text style={styles.verifyText}>Verify</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Didn't receive the pin?</Text>
                    <TouchableOpacity onPress={handlePinRegeneration} disabled={disabled}>
                        <Text style={styles.linkText}>Request Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast/>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    formWrapper: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 16,
        backgroundColor: "#fefefe",
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    closeIcon: {
        marginLeft: 'auto',
    },
    image: {
        width: "80%",
        height: 200,
        alignSelf: "center",
        resizeMode: "contain",
        marginBottom: 10
    },
    headerText: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: '700',
        marginBottom: 8
    },
    subHeaderText: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
        marginBottom: 12
    },
    codeInputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 12,
        gap: 10
    },
    verificationInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        width: 42,
        height: 48,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: "#f9f9f9"
    },
    filledInput: {
        borderColor: "#085bd8",
        backgroundColor: "#e6efff"
    },
    verifyButton: {
        backgroundColor: "#085bd8",
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 16
    },
    verifyText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 8,
        fontSize: 20
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
        gap: 5
    },
    footerText: {
        fontSize: 15,
        color: "#333"
    },
    linkText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#085bd8",
        textDecorationLine: "underline"
    }
});

export default PinVerificationUI;
