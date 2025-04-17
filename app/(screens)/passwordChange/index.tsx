import {Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";
import Toast from "react-native-toast-message";

type PasswordType = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

const Index = () => {
    const [passwordDetails, setPasswordDetails] = useState<PasswordType>({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [disabled, setDisabled] = useState(false);

    const handleChange = (key: keyof PasswordType, val: string) => {
        setPasswordDetails(prevState => ({
            ...prevState,
            [key]: val,
        }));
    };

    const validatePassword = (password: string): boolean => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return password.length >= 16 || (password.length >= 8 && hasLetter && hasNumber);
    };

    const passwordValidation = (): string | null => {
        if (!validatePassword(passwordDetails.currentPassword)) {
            return "Current: 16+ chars or 8+ with letter & number.";
        }

        if (!passwordDetails.newPassword || !passwordDetails.confirmNewPassword) {
            return "New password fields are required.";
        }

        if (!validatePassword(passwordDetails.newPassword)) {
            return "New: 16+ chars or 8+ with letter & number.";
        }

        if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
            return "Passwords don't match.";
        }

        return null;
    }

    const handleChangePassword = () => {
        setFocusedField(null);
        const validationError = passwordValidation();
        if (validationError) {
            showToastMessage(validationError);
            return;
        }

        //implement password change logic in the backend
    };

    const showToastMessage = (validationErr: string) => {
        Toast.show({
            type: 'error',
            text1: validationErr,
            onShow: () => setDisabled(true),
            onHide: () => setDisabled(false),
        });
    };

    const handleForgotPassword = () => {
        setFocusedField(null);
        // TODO: Implement forgot password flow
    };

    return (
        <SafeAreaView style={styles.wrapperContainer}>
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={disabled}
                    onPress={() => router.back()}
                    style={styles.backButton}>
                    <Icon name="arrow-back" size={28} color="white"/>
                </TouchableOpacity>
                <Text style={styles.backButtonText}>Change Password</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.formWrapper}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'currentPassword' && {borderColor: '#085bd8'},
                            ]}
                            onChangeText={text => handleChange('currentPassword', text)}
                            value={passwordDetails.currentPassword}
                            placeholder="Current Password"
                            secureTextEntry
                            editable={!disabled}
                            onFocus={() => setFocusedField('currentPassword')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'newPassword' && {borderColor: '#085bd8'},
                            ]}
                            onChangeText={text => handleChange('newPassword', text)}
                            value={passwordDetails.newPassword}
                            placeholder="New Password"
                            secureTextEntry
                            editable={!disabled}
                            onFocus={() => setFocusedField('newPassword')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Retype</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'confirmNewPassword' && {borderColor: '#085bd8'},
                            ]}
                            onChangeText={text => handleChange('confirmNewPassword', text)}
                            value={passwordDetails.confirmNewPassword}
                            placeholder="Confirm New Password"
                            secureTextEntry
                            editable={!disabled}
                            onFocus={() => setFocusedField('confirmNewPassword')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableOpacity
                            style={styles.changePassword}
                            activeOpacity={0.9}
                            onPress={handleChangePassword}>
                            <Text style={styles.changePasswordText}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.forgotPassword}
                            activeOpacity={0.9}
                            onPress={handleForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Toast position='top' topOffset={Platform.OS === 'android' ? 50 : 70}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapperContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    backButton: {
        backgroundColor: 'black',
        width: 40,
        height: 40,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: '600',
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
        gap: 8,
    },
    changePassword: {
        backgroundColor: '#085bd8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 8,
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
        fontSize: 16,
    },
    forgotPasswordText: {
        color: '#085bd8',
        fontSize: 16,
    },
});

export default Index;
