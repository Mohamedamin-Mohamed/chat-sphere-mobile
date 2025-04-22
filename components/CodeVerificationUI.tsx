import React from "react";
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const OTP_IMAGE = require('../assets/images/otp.png');

interface VerificationUIProps {
    verificationCode: Record<number, string>;
    loading: boolean;
    disabled: boolean;
    verificationError: string;
    inputRefs: React.MutableRefObject<Array<TextInput | null>>;
    onCancel: () => void;
    handleChange: (val: string, index: number) => void;
    handleBackspace: (index: number, nativeEvent: { key: string }) => void;
    handleCodeVerification: () => Promise<void>;
    handleOtpRegeneration: () => Promise<void>;
}

const CodeVerificationUI: React.FC<VerificationUIProps> = ({
                                                           verificationCode,
                                                           loading,
                                                           disabled,
                                                           verificationError,
                                                           inputRefs,
                                                           onCancel,
                                                           handleChange,
                                                           handleBackspace,
                                                           handleCodeVerification,
                                                           handleOtpRegeneration
                                                       }) => {
    return (
        <>
            <Icon name="close" size={26} style={styles.closeIcon} disabled={disabled} onPress={onCancel}/>
            <Image source={OTP_IMAGE} style={styles.image}/>
            <Text style={styles.headerText}>Verify</Text>
            <Text style={styles.subHeaderText}>Your code was sent you via email</Text>

            <View style={styles.codeInputContainer}>
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

            {verificationError && <Text style={styles.errorText}>{verificationError}</Text>}

            <TouchableOpacity
                disabled={disabled}
                style={styles.verifyButton}
                activeOpacity={0.8}
                onPress={handleCodeVerification}
            >
                {loading ?
                    <ActivityIndicator size="small" color="white"/> :
                    <Text style={styles.verifyText}>Verify</Text>
                }
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't receive code?</Text>
                <TouchableOpacity disabled={disabled} onPress={handleOtpRegeneration} activeOpacity={0.8}>
                    <Text style={[styles.footerText, styles.linkText]}>Request again</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    closeIcon: {
        marginLeft: "auto"
    },
    image: {
        width: "80%",
        height: 200,
        alignSelf: "center"
    },
    codeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        gap: 10
    },
    verificationInput: {
        borderColor: "gray",
        borderRadius: 4,
        borderWidth: 0.4,
        padding: 10,
        width: 40,
        textAlign: 'center'
    },
    filledInput: {
        borderColor: "#085bd8",
        borderWidth: 1
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

export default CodeVerificationUI;