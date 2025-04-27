import {
    ActivityIndicator,
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {router, useNavigation} from "expo-router";
import SocialAccounts from "../../components/SocialAccounts";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useRef, useState} from "react";
import {UserSignUp} from "../../types/types";
import Toast from "react-native-toast-message";
import emailValidation from "../../utils/emailValidation";
import signUp from "../../api/signUp";
import {signInWithApple, useGoogleOAuth} from "../../hooks/Oauth";
import {usePreventRemove} from "@react-navigation/native";

const SignUp = () => {
    const {googlePromptAsync} = useGoogleOAuth();
    const signUpCompletedRef = useRef(false);
    const navigation = useNavigation();

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [signUpDetails, setSignUpDetails] = useState<UserSignUp>({
        email: "",
        name: "",
        password: ""
    });

    const handleChange = (value: string, index: string) => {
        setSignUpDetails((prevState) => ({
            ...prevState,
            [index]: value
        }))
        if (signUpDetails.password === '') setConfirmPasswordVisible(false)
    }

    const isEmailValid = (email: string) => emailValidation(email);

    const checkIfMissingFields = () => {
        const errors: string[] = [];

        if (!signUpDetails.email || !isEmailValid(signUpDetails.email)) {
            errors.push("• Invalid or missing email");
        }

        if (!signUpDetails.name) {
            errors.push("• Name is required");
        }

        if (!signUpDetails.password) {
            errors.push("• Password is required");
        }

        if (errors.length > 0) {
            Toast.show({
                type: "error",
                text1: "Please fix the following:",
                text2: errors.join("\n"),
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
            return true;
        }

        return false;
    }

    const handleSignUp = async () => {
        if (checkIfMissingFields()) return;

        try {
            setLoading(true);
            const signUpResponse = await signUp(signUpDetails, new AbortController());
            const message = await signUpResponse.text();
            const isSuccess = signUpResponse.ok;

            signUpCompletedRef.current = true;

            Toast.show({
                type: isSuccess ? "success" : "error",
                text1: message,
                ...(isSuccess ? {text2: "Redirecting"} : {}),
                onShow: () => setDisabled(true),
                onHide: () => {
                    setDisabled(false);
                    isSuccess && router.replace("SignIn");
                }
            })
        } catch (err: any) {
            if (err.name === "AbortError") {
                console.log("Abort error");
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }

    usePreventRemove(
        !signUpCompletedRef.current &&
        Boolean(Object.values(signUpDetails).some((val) => val)),
        ({data}) => {
            Alert.alert(
                "Discard Signup?",
                "Are you sure you want to leave this page? Any information you’ve entered will be lost.",
                [
                    {text: "Cancel", style: "cancel"},
                    {
                        text: "Yes",
                        style: "destructive",
                        onPress: () => navigation.dispatch(data.action)
                    }
                ]
            )
        }
    )

    const handlePasswordVisibility = () => {
        if (signUpDetails.password !== '') {
            setConfirmPasswordVisible(prev => !prev);
        }
    };


    return (
        <ScrollView contentContainerStyle={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{marginBottom: 20, gap: 16}}>
                        <TouchableOpacity
                            disabled={disabled}
                            activeOpacity={0.8}
                            onPress={() => router.back()}
                            style={styles.signUpButtonView}
                        >
                            <Icon name="arrow-back" size={30} color="#085bd8"/>
                        </TouchableOpacity>
                        <Text style={styles.headerText}>
                            Create Account
                        </Text>
                        <Text style={styles.subTitleText}>
                            Connect with classmates, join study groups, and collaborate on
                            projects – all in one place.
                        </Text>
                    </View>
                    <View style={styles.childContainer}>
                        <TextInput
                            editable={!disabled}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="your@email.com"
                            placeholderTextColor="#2b2b2b"
                            onChangeText={(text) => handleChange(text, "email")}
                            value={signUpDetails.email}
                        />

                        <TextInput
                            editable={!disabled}
                            onChangeText={(text) => handleChange(text, "name")}
                            value={signUpDetails.name}
                            placeholder="first and last name"
                            placeholderTextColor="#2b2b2b"
                            style={styles.input}
                            autoCapitalize="none"
                        />
                        <View>
                            <TextInput
                                secureTextEntry={!confirmPasswordVisible}
                                editable={!disabled}
                                keyboardType="visible-password"
                                placeholder="password"
                                placeholderTextColor="#2b2b2b"
                                autoCapitalize="none"
                                style={styles.input}
                                onChangeText={(text) => handleChange(text, "password")}
                                value={signUpDetails.password}
                                textContentType="none"
                                autoComplete="off"
                                autoCorrect={false}
                            />

                            {signUpDetails.password !== '' && (
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={handlePasswordVisibility}
                                    disabled={disabled}
                                    activeOpacity={0.9}
                                >
                                    <Icon
                                        name={confirmPasswordVisible ? "visibility" : "visibility-off"}
                                        size={22}
                                        color="#085bd8"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            disabled={disabled}
                            style={styles.signUpButton}
                            activeOpacity={0.8}
                            onPress={handleSignUp}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white"/>
                            ) : (
                                <Text style={styles.signUpText}>Sign up</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.accountView}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity
                                onPress={() => router.replace("/SignIn")}
                                activeOpacity={0.8}>
                                <Text style={[styles.footerText, styles.linkText]}>
                                    Sign in
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <SocialAccounts
                            googlePromptAsync={googlePromptAsync}
                            appleSignIn={signInWithApple}
                        />
                    </View>
                    <Toast topOffset={64}/>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f5f8ff",
        width: "100%"
    },
    signUpButtonView: {
        backgroundColor: "#d6e4ff",
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3
    },
    headerText: {
        color: "#073ea0",
        fontSize: 26,
        fontWeight: "500"
    },
    subTitleText: {
        color: "#6b7280",
        fontSize: 16
    },
    childContainer: {
        marginVertical: 20,
        gap: 12,
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        elevation: 3
    },
    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: "#f9fafb"
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        top: 12,
    },
    errorMessage: {
        fontSize: 18,
        padding: 6,
        borderRadius: 4,
        backgroundColor: "#ffebe8",
        alignSelf: "flex-start",
    },
    signUpButton: {
        backgroundColor: "#085bd8",
        padding: 15,
        borderRadius: 10,
        alignItems: "center"
    },
    accountView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    signUpText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    footerText: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 16
    },
    linkText: {
        fontWeight: "bold",
        color: "#085bd8",
        fontSize: 16
    }
})

export default SignUp;
