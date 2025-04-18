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
    const {googlePromptAsync} = useGoogleOAuth()

    const signUpCompletedRef = useRef(false)
    const navigation = useNavigation()

    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [signUpDetails, setSignUpDetails] = useState<UserSignUp>({
        email: '', name: '', password: ''
    })

    const [confirmPass, setConfirmPass] = useState('')
    const handleChange = (value: string, index: string) => {
        setSignUpDetails((prevState) => ({
            ...prevState,
            [index]: value
        }));
    }

    const isEmailValid = (email: string) => emailValidation(email);

    const checkIfMissingFields = () => {
        if (!signUpDetails.email || !isEmailValid(signUpDetails.email)) {
            Toast.show({
                type: "error",
                text1: "Invalid or missing email.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        if (!signUpDetails.name) {
            Toast.show({
                type: "error",
                text1: "Name is required.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        if (signUpDetails.password !== confirmPass) {
            Toast.show({
                type: "error",
                text1: "Passwords do not match.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        return false
    }

    const handleSignUp = async () => {
        if (checkIfMissingFields()) return

        try {
            setLoading(true);

            const signUpResponse = await signUp(signUpDetails, new AbortController());
            const message = await signUpResponse.text()
            const isSuccess = signUpResponse.ok

            signUpCompletedRef.current = true;

            Toast.show({
                type: isSuccess ? "success" : "error",
                text1: message,
                ...isSuccess ? {text2: "Redirecting"} : {},
                onShow: () => setDisabled(true),
                onHide: () => {
                    setDisabled(false)
                    isSuccess && router.replace('SignIn')
                }
            })

        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Abort error')
            } else {
                console.error(err)
            }
        } finally {
            setLoading(false)
        }
    }

    usePreventRemove(!signUpCompletedRef.current && Boolean(Object.values(signUpDetails).some(val => val)), ({data}) => {
        Alert.alert('Discard Login?', 'Are you sure you want to leave this page? Any information you’ve entered will be lost.', [
            {
                text: 'Cancel',
                style: 'cancel'
            }, {
                text: 'Yes',
                style: 'destructive',
                onPress: () => navigation.dispatch(data.action)
            }
        ])
    })

    return (
        <ScrollView contentContainerStyle={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Toast/>
                    <View style={{marginBottom: 20, gap: 16}}>
                        <TouchableOpacity disabled={disabled} activeOpacity={0.8} onPress={() => router.back()}
                                          style={styles.signUpButtonView}>
                            <Icon name="arrow-back" size={30} color="#085bd8"/>
                        </TouchableOpacity>
                        <Text style={{color: "#073ea0", fontSize: 26, fontWeight: "500"}}>Create
                            Account</Text>
                        <Text style={{fontSize: 16}}>Connect with classmates, join study groups, and
                            collaborate on
                            projects – all in one place.</Text>
                    </View>
                    <View style={styles.childContainer}>

                        <TextInput
                            editable={!disabled}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="your@email.com" placeholderTextColor="#2b2b2b"
                            onChangeText={(text) => handleChange(text, "email")}
                            value={signUpDetails.email}/>

                        <TextInput editable={!disabled}
                                   onChangeText={text => handleChange(text, 'name')} value={signUpDetails.name}
                                   placeholder="first and last name"
                                   placeholderTextColor="#2b2b2b"
                                   style={styles.input} autoCapitalize="none"/>
                        <TextInput editable={!disabled}
                                   keyboardType="visible-password"
                                   secureTextEntry={true}
                                   placeholder="password"
                                   placeholderTextColor="#2b2b2b"
                                   autoCapitalize="none"
                                   style={styles.input}
                                   onChangeText={text => handleChange(text, 'password')} value={signUpDetails.password}
                                   textContentType="none" autoComplete="off" autoCorrect={false}/>
                        <TextInput editable={!disabled}
                                   keyboardType="visible-password"
                                   secureTextEntry={true}
                                   placeholder="confirm Password"
                                   placeholderTextColor="#2b2b2b"
                                   autoCapitalize="none"
                                   style={styles.input}
                                   onChangeText={setConfirmPass} value={confirmPass}
                                   textContentType="none" autoComplete="off" autoCorrect={false}/>
                        <TouchableOpacity disabled={disabled} style={styles.signUpButton} activeOpacity={0.8}
                                          onPress={handleSignUp}>
                            {loading ? <ActivityIndicator size="small" color="white"/> :
                                <Text style={styles.signUpText}>Sign up</Text>}
                        </TouchableOpacity>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5}}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => router.replace("/SignIn")} activeOpacity={0.8}>
                                <Text style={[styles.footerText, styles.linkText]}>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                        <SocialAccounts googlePromptAsync={googlePromptAsync} appleSignIn={signInWithApple}/>
                    </View>
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
        width: "100%"
    },
    signUpButtonView: {
        backgroundColor: "#a6c0ed",
        width: 50,
        height: 50,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        marginVertical: 20,
        gap: 8,
        backgroundColor: "white",
        padding: 24,
        borderRadius: 4,
        borderWidth: 0.4,
        borderColor: "white"
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16
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
        borderRadius: 8,
        alignItems: "center"
    },
    signUpText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    footerText: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 16
    },
    linkText: {
        fontWeight: "bold",
        color: "#085bd8",
        fontSize: 16
    }
})
export default SignUp