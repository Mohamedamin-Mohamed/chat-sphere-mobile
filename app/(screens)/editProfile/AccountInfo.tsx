import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {router} from "expo-router";
import {Dispatch, SetStateAction, useState} from "react";

interface AccountInfoProps {
    emailInput: string,
    setEmailInput: Dispatch<SetStateAction<string>>,
    setEmailInputActive: Dispatch<SetStateAction<boolean>>,
    setNameInputActive: Dispatch<SetStateAction<boolean>>,
    reInitializeNameInput: () => void,
    handlePasswordChange: (route: string)=> void,
    emailInputActive: boolean
    handleEmailChange: (text: string) => void
}

const AccountInfo = ({
                         emailInput,
                         setEmailInput,
                         setEmailInputActive,
                         setNameInputActive,
                         reInitializeNameInput,
                         handlePasswordChange,
                         handleEmailChange,
                         emailInputActive
                     }: AccountInfoProps) => {
    const [del, setDel] = useState(false);

    const handlePressing = () => {
        setEmailInput('')
        reInitializeNameInput()
    }

    const handlePressIn = () => {
        setDel(true)
        setEmailInputActive(true)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.accountInfoText}>Account info</Text>
            <View style={styles.infoView}>
                <Icon name='lock' size={20} color='#545454'/>
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
                <View style={styles.sameView}>
                    <Text style={styles.subHeader}>Phone Number</Text>
                    {/*{//this is just a place-holder}*/}
                    <Text>+1 612-261-7712</Text>
                </View>
                <View style={styles.sameView}>
                    <Text style={styles.subHeader}>Password</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => handlePasswordChange('passwordChange')}>
                        <Icon name='chevron-right' size={30} color='#a9a6a6'/>
                    </TouchableOpacity>
                </View>

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
    },
    subHeader: {
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