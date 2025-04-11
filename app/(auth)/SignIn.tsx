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
import {useRef, useState} from "react";
import SocialAccounts from "../../components/SocialAccounts";
import Icon from "react-native-vector-icons/MaterialIcons";
import signIn from "../../api/signIn";
import {Error} from "../../types/types";
import emailValidation from "../../utils/emailValidation";
import Toast from "react-native-toast-message";
import {useNavigation, usePreventRemove} from "@react-navigation/native";
import {signInWithApple, useGoogleOAuth} from "../../hooks/Oauth"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch} from "react-redux";
import {setUserInfo} from "../../redux/userSlice";

interface SignIn {
    email: string;
    password: string;
}

const SignIn = () => {
    const {googlePromptAsync} = useGoogleOAuth()
    const dispatch = useDispatch()

    const login = require('../../assets/images/login.png')
    const signInCompletedRef = useRef<boolean>(false);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const initialSignInDetails = {
        email: '', password: ''
    }
    const [signInDetails, setSignInDetails] = useState<SignIn>(initialSignInDetails);
    const [err, setErr] = useState<Partial<Error>>({email: '', password: ''});
    const navigation = useNavigation()

    const handleChange = (value: string, index: keyof SignIn) => {
        setSignInDetails(prevState => ({
            ...prevState, [index]: value
        }));
    };

    const handleSiginIn = async () => {
        const errors: Partial<Error> = {}
        if (!signInDetails.email && !signInDetails.password) {
            errors.password = "Email and password are required"
        } else if (!signInDetails.email) {
            errors.email = 'Email is required'
        } else if (!emailValidation(signInDetails.email)) {
            errors.email = 'Email is not valid'
        } else if (!signInDetails.password) {
            errors.password = 'Password is required'
        }

        if (Object.keys(errors).length > 0) {
            setErr(errors)
            return;
        }

        try {
            setLoading(true);
            setErr({});
            const response = await signIn(signInDetails, new AbortController());

            if (response.ok) {
                const data = await response.json()
                const message = data.message
                const user = await data.user

                console.log('User in sign in ', user)
                signInCompletedRef.current = true;

                await AsyncStorage.setItem('user', JSON.stringify(user))
                dispatch(setUserInfo(user))

                Toast.show({
                    type: 'success',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false);
                        router.replace('/chat')
                    }
                });
            } else {
                const message = await response.text();
                if (response.status === 404) {
                    setErr({email: message});
                } else {
                    setErr({password: message});
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    usePreventRemove(!signInCompletedRef.current && Boolean(Object.values(signInDetails).some(val => val)), ({data}) => {
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

    const handleEmailLookup = () => {
        setSignInDetails(initialSignInDetails)
        setErr({})
        router.push("/EmailLookup")
    }
    return (
        <ScrollView contentContainerStyle={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{marginBottom: 16, gap: 10, marginTop: 20}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
                            <Icon name="arrow-back" size={30} color="#085bd8"/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.title}> Sign in</Text>
                    </View>
                    <View style={styles.childContainer}>
                        <View style={{marginBottom: 24, gap: 6}}>
                            <Text style={styles.welcomeText}>Welcome back</Text>
                            <Text style={styles.subtitle}>Hello there, sign in to continue!</Text>
                        </View>
                        <TextInput
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="your@email.com"
                            placeholderTextColor="#2b2b2b"
                            value={signInDetails.email}
                            onChangeText={text => handleChange(text, 'email')}
                            style={[styles.input, {marginBottom: err.email ? 0 : 16}]}
                        />
                        {err.email && <Text style={styles.errorMessage}>{err.email}</Text>}
                        <TextInput
                            keyboardType="visible-password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect={false}
                            placeholder="password"
                            placeholderTextColor="#2b2b2b"
                            value={signInDetails.password}
                            onChangeText={text => handleChange(text, 'password')}
                            style={[styles.input, {marginBottom: err.password ? 0 : 16}]}
                        />
                        {err.password && <Text style={styles.errorMessage}>{err.password}</Text>}
                        <TouchableOpacity disabled={disabled} onPress={handleEmailLookup}
                                          activeOpacity={0.8}>
                            <Text style={styles.forgotPassword}>Forgot your password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={disabled} style={styles.signInButton} activeOpacity={0.8}
                                          onPress={handleSiginIn}>
                            {loading ? <ActivityIndicator size="small" color="white"/> :
                                <Text style={styles.signInText}>Sign in</Text>}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.replace("/SignUp")} activeOpacity={0.8}>
                                <Text style={[styles.footerText, styles.linkText]}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                        <SocialAccounts googlePromptAsync={googlePromptAsync} appleSignIn={signInWithApple}/>
                    </View>
                    <Toast/>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
        ;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        width: "100%"
    },
    childContainer: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 4,
        borderWidth: 0.4,
        borderColor: "white"
    },
    image: {
        width: "100%",
        height: "20%",
    },
    title: {
        fontSize: 28,
        fontWeight: "500",
        color: "#073ea0",
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: "500"
    },
    subtitle: {
        color: "gray",
        fontSize: 16,
        fontWeight: "400"
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        fontSize: 16
    },
    backButton: {
        backgroundColor: "#a6c0ed",
        width: 50,
        height: 50,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    forgotPassword: {
        color: "#085bd8",
        fontWeight: "500",
        marginBottom: 20,
        fontSize: 16,
        marginLeft: "auto"
    },
    errorText: {
        color: "red",
        marginTop: 8,
    },
    errorMessage: {
        fontSize: 18,
        textAlign: "left",
        color: "red",
        alignSelf: "flex-start",
        padding: 8,
    },
    signInButton: {
        backgroundColor: "#085bd8",
        padding: 15,
        borderRadius: 8,
        alignItems: "center"
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
        gap: 5,
        marginTop: 20
    },
    footerText: {
        textAlign: "center",
        fontSize: 16
    },
    linkText: {
        fontWeight: "bold",
        color: "#085bd8",
        fontSize: 16
    }
});

export default SignIn;