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
import {router} from "expo-router";
import React, {useRef, useState} from "react";
import SocialAccounts from "../../components/SocialAccounts";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Error} from "../../types/types";
import emailValidation from "../../utils/emailValidation";
import {useNavigation, usePreventRemove} from "@react-navigation/native";
import {signInWithApple, useGoogleOAuth} from "../../hooks/Oauth";
import {useDispatch} from "react-redux";
import {setUserInfo} from "../../redux/userSlice";
import sanitizeUser from "../../utils/sanitizeUser";
import storeToken from "../../utils/storeToken";
import api from "../../api/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface SignIn {
    email: string;
    password: string;
}

const SignIn = () => {
    const {googlePromptAsync} = useGoogleOAuth();
    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState(false)
    const signInCompletedRef = useRef<boolean>(false);
    const [loading, setLoading] = useState(false);
    const initialSignInDetails = {email: '', password: ''};
    const [signInDetails, setSignInDetails] = useState<SignIn>(initialSignInDetails);
    const [err, setErr] = useState<Partial<Error>>({});
    const navigation = useNavigation();
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleChange = (value: string, index: keyof SignIn) => {
        setSignInDetails(prev => ({...prev, [index]: value}));
    };

    const handleSiginIn = async () => {
        const errors: Partial<Error> = {};
        if (!signInDetails.email && !signInDetails.password) {
            errors.password = "Email and password are required";
        } else if (!signInDetails.email) {
            errors.email = 'Email is required';
        } else if (!emailValidation(signInDetails.email)) {
            errors.email = 'Email is not valid';
        } else if (!signInDetails.password) {
            errors.password = 'Password is required';
        }

        if (Object.keys(errors).length > 0) {
            setErr(errors);
            return;
        }

        try {
            setLoading(true);
            setErr({});
            const response = await api.post('auth/signin/email', signInDetails)
            const data = response.data;
            const user = data.user;
            const message = data.message
            const token = data.token;
            await storeToken(token)

            const sanitized = sanitizeUser(user);
            Toast.show({
                type: "success",
                text1: message,
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            signInCompletedRef.current = true;

            dispatch(setUserInfo(sanitized));
            router.replace('/home');


        } catch (exp: any) {
            if (axios.isAxiosError(exp) && exp.response) {
                const message = exp.response.data
                const status = exp.response.status
                console.log(message)
                setErr(status === 404 ? {email: message} : {password: message});
                return
            } else {
                console.log(err)
            }
        } finally {
            setLoading(false);
        }
    }

    const shouldPreventRemove = !signInCompletedRef.current && Object.values(signInDetails).some(val => val);

    usePreventRemove(shouldPreventRemove, ({data}) => {
        Alert.alert(
            'Discard Login?',
            'Are you sure you want to leave this page? Any information you’ve entered will be lost.',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', style: 'destructive', onPress: () => navigation.dispatch(data.action)}
            ]
        )
    })

    const handleEmailLookup = () => {
        setSignInDetails(initialSignInDetails);
        setErr({});
        router.push("/EmailLookup");
    }

    const handlePasswordVisibility = () => {
        if (signInDetails.password !== '') {
            setConfirmPasswordVisible(prev => !prev);
        }
    };
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{marginBottom: 16, gap: 10, marginTop: 20}}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.back()}
                            style={styles.signUpButtonView}
                        >
                            <Icon name="arrow-back" size={30} color="#085bd8"/>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Sign in</Text>

                    <View style={styles.childContainer}>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.subtitle}>Hello there, sign in to continue!</Text>

                        <TextInput
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="your@email.com"
                            placeholderTextColor="#2b2b2b"
                            value={signInDetails.email}
                            onChangeText={text => handleChange(text, 'email')}
                            style={[styles.input, {marginBottom: err.email ? 0 : 12}]}
                        />
                        {err.email && <Text style={styles.errorMessage}>{err.email}</Text>}
                        <View>
                            <TextInput
                                secureTextEntry={!confirmPasswordVisible}
                                keyboardType="default"
                                autoCapitalize="none"
                                placeholder="password"
                                placeholderTextColor="#2b2b2b"
                                value={signInDetails.password}
                                onChangeText={text => handleChange(text, 'password')}
                                style={[styles.input, {marginBottom: err.password ? 0 : 12}]}

                            />

                            {signInDetails.password !== '' && (
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={handlePasswordVisibility}
                                    disabled={loading}
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
                        {err.password && <Text style={styles.errorMessage}>{err.password}</Text>}

                        <TouchableOpacity disabled={disabled} onPress={handleEmailLookup}>
                            <Text style={styles.forgotPassword}>Forgot your password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={disabled} onPress={handleSiginIn} style={styles.signInButton}>
                            {loading
                                ? <ActivityIndicator size="small" color="#fff"/>
                                : <Text style={styles.signInText}>Sign in</Text>}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity disabled={disabled} onPress={() => router.replace("/SignUp")}>
                                <Text style={styles.linkText}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                        <SocialAccounts disabled={disabled} googlePromptAsync={googlePromptAsync} appleSignIn={signInWithApple}/>
                    </View>
                    <Toast topOffset={64}/>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

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
        borderRadius: 8,
        fontSize: 16,
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        top: 12,
    },
    title: {
        marginBottom: 12,
        color: "#073ea0",
        fontSize: 26,
        fontWeight: "500"
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: "500"
    },
    subtitle: {
        color: "#6b7280",
        fontSize: 16
    },
    forgotPassword: {
        color: "#085bd8",
        fontWeight: "500",
        fontSize: 14,
        marginLeft: "auto"
    },
    errorMessage: {
        color: "red",
        fontSize: 14,
        marginBottom: 12
    },
    signInButton: {
        backgroundColor: "#085bd8",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8
    },
    signInText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    footerText: {
        marginTop: 10,
        fontSize: 16
    },
    linkText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#085bd8"
    }
})

export default SignIn;
