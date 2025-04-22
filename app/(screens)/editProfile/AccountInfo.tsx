import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Dispatch, SetStateAction} from "react";
import {router} from "expo-router";
import {RootState} from "../../../types/types";
import {useSelector} from "react-redux";

interface AccountInfoProps {
    emailInput: string,
    setEmailInput: Dispatch<SetStateAction<string>>,
    setEmailInputActive: Dispatch<SetStateAction<boolean>>,
    setNameInputActive: Dispatch<SetStateAction<boolean>>,
    reInitializeNameInput: () => void,
    handlePasswordChange: (route: string) => void,
    emailInputActive: boolean
    handleEmailChange: (text: string) => void,
}

const AccountInfo = ({
                         emailInput,
                         setEmailInput,
                         setEmailInputActive,
                         setNameInputActive,
                         reInitializeNameInput,
                         handlePasswordChange,
                         handleEmailChange,
                         emailInputActive,
                     }: AccountInfoProps) => {

    const phoneNumber = useSelector((state: RootState) => state.userInfo).phoneNumber
    const handlePressing = () => {
        setEmailInput('')
        reInitializeNameInput()
    }

    const handlePressIn = () => {
        setEmailInputActive(true)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.accountInfoText}>Account info</Text>
            <View style={styles.infoView}>
                <Icon name='visibility-off' size={20} color='#545454'/>
                <Text style={styles.visibilityText}>Only visible to you</Text>
            </View>
            <View style={styles.childContainer}>
                <View style={styles.sameView}>
                    <Text style={styles.subHeader}>Email</Text>
                    <TouchableOpacity style={styles.textInputView}>
                        <TextInput
                            value={emailInput}
                            onChangeText={handleEmailChange}
                            onPressIn={handlePressIn}
                            multiline={false}
                            numberOfLines={1}
                            style={styles.textInput}
                            autoCorrect={false}
                            autoCapitalize='none'
                            onFocus={() => {
                                setEmailInputActive(true);
                                setNameInputActive(false);
                                reInitializeNameInput();
                            }}
                        />
                        {emailInputActive && emailInput !== '' && (
                            <TouchableOpacity onPress={handlePressing}>
                                <Icon name="cancel" size={20} color="gray"/>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sameView} activeOpacity={0.9} onPress={() => router.push('addNumber')}>
                    <Text style={styles.subHeader}>Phone Number</Text>
                    <View>
                        {
                            phoneNumber ? (
                                    <Text style={styles.phoneNumberText}>
                                        {phoneNumber.startsWith('+1') ?
                                            `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8, 12)}` :
                                            `+1 ${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
                                        }
                                    </Text>
                                ) :
                                <Icon name='chevron-right' size={36} color='gray'/>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sameView} activeOpacity={0.9}
                                  onPress={() => handlePasswordChange('passwordChange')}>
                    <Text style={styles.subHeader}>Password</Text>
                    <View>
                        <Icon name='chevron-right' size={36} color='gray'/>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginLeft: 10,
        gap: 10,
        borderRadius: 8,
        marginVertical: 30,
    },
    accountInfoText: {
        fontWeight: '500',
        fontSize: 18
    },
    infoView: {
        alignItems: 'center',
        flexDirection: 'row', gap: 10
    },
    visibilityText: {
        color: '#373737',
        fontSize: 13
    },
    childContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 16,
        gap: 20,
        borderRadius: 8,
    },
    sameView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    subHeader: {
        fontSize: 16,
    },
    phoneNumberText: {
        fontSize: 16,
    },
    textInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%'
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        paddingHorizontal: 6,
        textAlign: 'right',
        fontSize: 16,
        fontWeight: '400'
    },
})
export default AccountInfo