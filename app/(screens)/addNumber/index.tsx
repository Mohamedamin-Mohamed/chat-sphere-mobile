import {ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/types";
import sendVerificationPin from "../../../api/sendVerificationPin";
import PinVerificationUI from "../../../components/PinVerificationUI";

const Page = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const email = userInfo.email
    const phoneNumber = userInfo.phoneNumber

    const [phoneInput, setPhoneInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPinVerificationModal, setShowPinVerificationModal] = useState(false)
    const [focused, setFocused] = useState(false)
    const [phoneError, setPhoneError] = useState('');

    const handleSubmit = async () => {
        const cleanedPhone = phoneInput.replace(/\D/g, '');
        if (cleanedPhone.length !== 10) {
            setPhoneError('Please enter a valid 10-digit phone number.');
            return;
        }
        if (cleanedPhone == phoneNumber) {
            setPhoneError('Please enter a new phone number')
            return
        }
        setPhoneError('');

        const request = {
            email: email,
            phoneNumber: "+1" + cleanedPhone
        };

        try {
            setLoading(true);
            const response = await sendVerificationPin(request, new AbortController());
            const responseJson = await response.json();
            const succeeded = responseJson.success;
            const message = responseJson.message;

            if (!succeeded) {
                setPhoneError(message);
                return;
            }
            setShowPinVerificationModal(true);
        } catch (err) {
            console.error(err);
            setPhoneError('Failed to send pin. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.headerContainer}>
                <View style={styles.buttonView}>
                    <TouchableOpacity
                        disabled={loading}
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

                <View style={[
                    styles.inputRow,
                    {borderColor: focused ? '#085bd8' : '#ccc'}
                ]}>
                    <TouchableOpacity style={styles.countryCode}>
                        <Text>+1</Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Phone number"
                        keyboardType="number-pad"
                        value={phoneInput}
                        onChangeText={setPhoneInput}
                        style={styles.input}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                    {phoneInput.length > 0 && (
                        <TouchableOpacity onPress={() => setPhoneInput('')}>
                            <Icon name="cancel" size={20}/>
                        </TouchableOpacity>
                    )}
                </View>

                {phoneError !== '' && (
                    <Text style={styles.errorText}>{phoneError}</Text>
                )}

                <TouchableOpacity onPress={handleSubmit} style={styles.sendPin} activeOpacity={0.9}>
                    {loading ? <ActivityIndicator size="small" color="white"/> :
                        <Text style={styles.sendPinText}>Send Pin</Text>}
                </TouchableOpacity>
            </View>
            {showPinVerificationModal && (
                <View style={styles.verificationView}>
                    <PinVerificationUI
                        email={email}
                        phoneNumber={phoneInput}
                        setShowPinVerificationModal={setShowPinVerificationModal}/>
                </View>
            )}
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
    verificationView: {
        position: 'absolute',
        top: '16%',
        left: 0,
        right: 0
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: -12,
        marginBottom: 16,
        marginLeft: 4,
    },

})

export default Page
