import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useState} from "react";
import Toast from "react-native-toast-message";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/types";
import resetPassword from "../../../api/resetPassword";
import PasswordResetScreen from "../../../components/PasswordResetScreen";

type PasswordType = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

type PasswordValidationType = {
    currentPassword: string,
    newPassword: string
}

type Passwords = {
    password: string;
    confirmPassword: string;
}
const Index = () => {
    const email = useSelector((state: RootState) => state.userInfo).email
    const initialPasswordDetails = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    }
    const [passwordDetails, setPasswordDetails] = useState<PasswordType>(initialPasswordDetails)
    const [validationErr, setValidationErr] = useState<Partial<PasswordValidationType | null>>(null)
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false)
    const [loading, setLoading] = useState(false)
    const [passwords, setPasswords] = useState<Passwords>({
        password: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");

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

    const passwordValidation = (): Record<string, string> | null => {
        const returnType: Record<string, string> = {}
        if (!validatePassword(passwordDetails.currentPassword)) {
            returnType['currentPassword'] = 'Current password must be 16+ chars or 8+ with letter & number.'
        } else if (!passwordDetails.newPassword || !passwordDetails.confirmNewPassword) {
            returnType['newPassword'] = 'New password fields are required.'
        } else if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
            returnType['newPassword'] = "Passwords don't match."
        } else if (!validatePassword(passwordDetails.newPassword)) {
            returnType['newPassword'] = 'New password must be 16+ chars or 8+ with letter & number.'
        }

        return Object.keys(returnType).length > 0 ? returnType : null;
    }

    const handleChangePassword = async () => {
        setFocusedField(null);
        const validationError = passwordValidation();
        if (validationError) {
            setValidationErr(validationError)
            return;
        }

        //implement password change logic in the backend
        setValidationErr({})
        setLoading(true)
        const request = {
            email: email,
            currentPassword: passwordDetails.currentPassword,
            newPassword: passwordDetails.newPassword
        }
        try {
            const response = await resetPassword(request, new AbortController());
            const succeeded = response.ok;
            const message = await response.text();
            showToastMessage(message, succeeded)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }

    }

    const handlePasswordChange = (key: string, val: string) => {
        setPasswords((prevState) => ({
            ...prevState,
            [key]: val,
        }));
    };

    const showToastMessage = (message: string, succeeded: boolean) => {
        console.log(succeeded)
        Toast.show({
            type: succeeded ? 'success' : 'error',
            text1: message,
            onShow: () => setDisabled(true),
            onHide: () => {
                setDisabled(false)
                if (succeeded) {
                    router.back()
                }
            },
        });
    };

    const handleForgotPassword = () => {
        setFocusedField(null)
        setValidationErr(null)
        setPasswordDetails(initialPasswordDetails)
        setPasswordReset(true)
    }

    const handleModalDisplay = () => {
        setPasswordReset(false)
    }

    const handleResetPassword = async () => {
        setPasswordError("");

        if (!passwords.password || !passwords.confirmPassword) {
            setPasswordError("Passwords are required");
            return;
        }

        if (passwords.password !== passwords.confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }

        if (!validatePassword(passwords.password)) {
            setPasswordError("Password must be at least 16 characters, or 8 characters with one number and one letter.");
            return;
        }

        try {
            setLoading(true);
            const request = {email: email, password: passwords.password};
            const response = await resetPassword(request, new AbortController());
            const succeeded = response.ok;
            const message = await response.text();

            Toast.show({
                type: succeeded ? "success" : "error",
                text1: message,
                ...(succeeded && {text2: 'Redirecting'}),
                onShow: () => setDisabled(true),
                onHide: () => {
                    handleModalDisplay();
                    setDisabled(false);
                    router.back()
                }
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

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
                        {validationErr?.currentPassword &&
                            <Text style={styles.passwordResetErrorText}>{validationErr.currentPassword}</Text>}
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
                        {validationErr?.newPassword &&
                            <Text style={styles.passwordResetErrorText}>{validationErr.newPassword}</Text>}
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableOpacity
                            disabled={loading}
                            style={styles.changePassword}
                            activeOpacity={0.9}
                            onPress={handleChangePassword}>
                            {loading ? <ActivityIndicator size='small' color='white'/> :
                                <Text style={styles.changePasswordText}>Change Password</Text>
                            }

                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.forgotPassword}
                            activeOpacity={0.9}
                            onPress={handleForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {passwordReset && (
                    <View style={styles.modalContainer}>
                        <PasswordResetScreen
                            loading={loading}
                            onCancel={handleModalDisplay}
                            disabled={disabled}
                            passwordError={passwordError}
                            handlePasswordChange={handlePasswordChange}
                            handleResetPassword={handleResetPassword}
                        />
                    </View>
                )}
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
    passwordResetErrorText: {
        color: "red",
        fontSize: 16
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: 10, // Make sure it's above everything else
    },

});

export default Index;
