import React, {useEffect, useState} from "react";
import {
    Image,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import emailValidation from "../utils/emailValidation";

interface CampusConnectModalProps {
    campusConnectModal: boolean;
    handleCampusConnectModal: () => void;
}

//add regex checker for email
const CampusConnectModal = ({campusConnectModal, handleCampusConnectModal}: CampusConnectModalProps) => {
    const campusDirectory = require("../assets/images/campus-directory.png");

    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const [emailValid, setEmailValid] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    const handleFocus = () => {
        setIsFocused(true);
        setHasBeenFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const getBorderColor = () => {
        if (isFocused) return "#085bd8";
        if (!isFocused && hasBeenFocused && !emailValid) return "red";
        return "#f0f0f0";
    };

    const getBackgroundColor = () => {
        return isFocused ? "white" : "#f0f0f0";
    }

    const handleChange = (text: string) => {
        setEmailInput(text)
    }

    useEffect(() => {
        /*the moment emailValid is true we set Send Pin button to be active */
        setEmailValid(emailValidation(emailInput))
    }, [emailInput]);
    return (
        <Modal
            isVisible={campusConnectModal}
            onBackdropPress={handleCampusConnectModal}
            onSwipeComplete={handleCampusConnectModal}
            swipeDirection="down"
            style={styles.modal}
            backdropTransitionOutTiming={0}
            animationIn='slideInUp'
            animationInTiming={500} animationOut='slideInDown' animationOutTiming={1000}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleCampusConnectModal} style={styles.iconWrapper}>
                            <Icon name="close" size={24} color="black"/>
                        </TouchableOpacity>
                        <Text style={styles.title}>Join your campus</Text>
                    </View>
                    <Image source={campusDirectory} resizeMode="contain" style={styles.image}/>
                    <View style={styles.campusView}>
                        <Text style={styles.campusViewHeader}>Your campus awaits</Text>
                        <Text style={styles.campusViewSubHeader}>
                            ChatSphere uses your email to connect you to the right school campus
                        </Text>
                    </View>
                    <View style={styles.lastView}>
                        <View style={[styles.textInputView,
                            {
                                borderColor: getBorderColor(),
                                backgroundColor: getBackgroundColor(),
                            }]}>
                            <TextInput
                                value={emailInput} autoCapitalize='none'
                                // onChangeText={text => setEmailInput(text)}
                                onChangeText={text => handleChange(text)}
                                placeholder='Enter school email (.edu)'
                                style={styles.textInput}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            {emailInput !== '' && (
                                <TouchableOpacity onPress={() => setEmailInput('')}>
                                    <Icon name="cancel" size={20} color="gray"/>
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity style={[styles.sendPin,
                            emailValid ? {backgroundColor: '#085bd8'} : {backgroundColor: '#8baff4'}
                        ]} activeOpacity={0.9}>
                            <Text style={styles.sendPinText}>Send Pin</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoView}>
                        <Icon name='lock' size={20} color='#545454'/>
                        <Text style={styles.infoText}>ChatSphere isn't associated with
                            your school. Your information and chats will never be shared.</Text>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        marginTop: 60,
        marginHorizontal: 2,
        justifyContent: 'flex-start',
    },
    modalContent: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 10,
        marginLeft: 10,
    },
    iconWrapper: {
        padding: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 12,
    },
    campusView: {
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    campusViewHeader: {
        fontSize: 20,
        fontWeight: '800'
    },
    campusViewSubHeader: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '300',
        width: '76%'
    },
    lastView: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    textInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 30,
        fontSize: 14,
    },
    cancelIconView: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -10}],
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#a9a6a6',
    },
    sendPin: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8
    },
    sendPinText: {
        color: 'white',
        fontSize: 16
    },
    infoView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        marginTop: 16
    },
    infoText: {
        color: '#373737',
        fontSize: 11,
        width: '72%',
        fontWeight: '600'

    }
});

export default CampusConnectModal;
