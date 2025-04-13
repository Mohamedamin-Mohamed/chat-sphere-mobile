import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";

type PasswordType = {
    currentPassword: string, newPassword: string, confirmNewPassword: string
}
const Index = () => {
    const [passwordDetails, setPasswordDetails] = useState<Partial<PasswordType>>({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const handleChange = (key: string, val: string) => {
        setPasswordDetails(prevState => ({
            ...prevState, [key]: val
        }))
    }

    return (
        <SafeAreaView style={styles.wrapperContainer}>
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="white"/>
                </TouchableOpacity>
                <Text style={styles.backButtonText}>Change Password</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.formWrapper}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput style={styles.input}
                                   onChangeText={text => handleChange('currentPassword', text)}
                                   value={passwordDetails.currentPassword}
                                   placeholder="Current Password" secureTextEntry/>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput style={styles.input}
                                   onChangeText={text => handleChange('newPassword', text)}
                                   value={passwordDetails.newPassword}
                                   placeholder="New Password" secureTextEntry/>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Retype</Text>
                        <TextInput style={styles.input}
                                   onChangeText={text => handleChange('confirmNewPassword', text)}
                                   value={passwordDetails.confirmNewPassword}
                                   placeholder="New Password" secureTextEntry/>
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableOpacity style={styles.changePassword} activeOpacity={0.9}>
                            <Text style={styles.changePasswordText}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.9}>
                            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapperContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginLeft: 20,
        marginTop: 10
    },
    backButton: {
        backgroundColor: "black",
        width: 50,
        height: 50,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        alignItems: 'center',
        paddingVertical: 40
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: "600"
    },
    formWrapper: {
        width: '90%',
        gap: 20,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    buttonsView: {
        marginTop: 10,
        gap: 8
    },
    changePassword: {
        backgroundColor: '#085bd8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 8
    },
    forgotPassword: {
        borderColor: '#085bd8',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 8,
    },
    changePasswordText: {
        color: 'white',
        fontSize: 16
    },
    forgotPasswordText: {
        color: '#085bd8',
        fontSize: 16
    }
});

export default Index
