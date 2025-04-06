import {useRef, useState} from "react";
import {ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import AvatarModal from "../../modals/AvatarModal";
import * as ImagePicker from "expo-image-picker";
import {router, useLocalSearchParams, useNavigation} from "expo-router";
import AvatarImagePicker from "../../components/AvatarImagePicker";
import Toast from "react-native-toast-message";
import oauthSignUp from "../../api/oauthSignUp";
import {usePreventRemove} from "@react-navigation/native";
import emailValidation from "../../utils/emailValidation";

interface OAuthRequest {
    oauthProvider: string;
    name?: string;
    picture?: string;
    email?: string;
    authorizationCode?: string;
    identityToken?: string;
}

const GetStarted = () => {
    const request = useLocalSearchParams();

    // ensure values are always strings
    const pictureVar = Array.isArray(request.picture) ? request.picture[0] : request.picture ?? "";
    const nameVar = Array.isArray(request.name) ? request.name[0] : request.name ?? "";
    const emailVar = Array.isArray(request.email) ? request.email[0] : request.email ?? "";
    const oauthProvider = Array.isArray(request.oauthProvider) ? request.oauthProvider[0] : request.oauthProvider ?? "";

    const signUpCompletedRef = useRef(false)
    const navigation = useNavigation()

    const [image, setImage] = useState<string | undefined>(pictureVar);
    const [displayAvatarModal, setDisplayAvatarModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(nameVar);
    const [email, setEmail] = useState(emailVar);

    const [err, setErr] = useState('')

    const handleDisplayAvatarModal = () => {
        setDisplayAvatarModal((prev) => !prev);
    };

    const imagePicker = async () => {
        handleDisplayAvatarModal();

        Alert.alert(
            "Grant Chat Sphere photo access?",
            "Chat Sphere would like to access your photo library to help you share pictures in your chats.",
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Ok",
                    style: "default",
                    onPress: async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });

                        if (!result.canceled) {
                            setImage(result.assets[0].uri);
                        }
                    },
                },
            ]
        );
    };

    const activeField = name.length > 0 || email.length > 0

    usePreventRemove(!signUpCompletedRef.current && Boolean(activeField), ({data}) => {
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

    const handleCreateAccount = async () => {
        if (!email || !name) {
            Toast.show({
                text1: "Please enter required fields",
                type: "error",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false),
            });
            return;
        }
        if (!emailValidation(email)) {
            setErr('Email is not valid')
            return;
        }

        setErr('')
        const signUpReq = {
            ...request,
            name,
            email,
            picture: image,
            oauthProvider,
        };
        try {
            setLoading(true)
            const response = await oauthSignUp(signUpReq, new AbortController());
            const message = await response.text()

            if (response.ok) {
                signUpCompletedRef.current = true
                router.replace('/home/HomeScreen')
            } else {
                setErr(message)
            }
        } catch (err) {
            console.error(err)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            <AvatarImagePicker oauthProvider={oauthProvider} image={image}
                               setDisplayAvatarModal={setDisplayAvatarModal}/>

            <View style={styles.inputContainer}>
                <Text>Name</Text>
                <TextInput
                    editable={!nameVar}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="none"
                    placeholder="Full Name"
                    style={styles.input}
                    placeholderTextColor="#2b2b2b"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text>Email</Text>
                <TextInput
                    editable={!emailVar}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Email Address"
                    style={styles.input}
                    placeholderTextColor="#2b2b2b"
                />
                {err && <Text style={styles.errorMessage}>{err}</Text>}

            </View>

            <TouchableOpacity
                disabled={disabled}
                style={styles.signInButton}
                activeOpacity={0.8}
                onPress={handleCreateAccount}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="white"/>
                ) : (
                    <Text style={styles.signInText}>Create Account</Text>
                )}
            </TouchableOpacity>

            {displayAvatarModal && (
                <AvatarModal handleModalDisplay={handleDisplayAvatarModal} choosePhoto={imagePicker}/>
            )}
            <Toast/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        padding: 24,
    },
    inputContainer: {
        alignSelf: "flex-start",
        width: "100%",
        marginTop: 20,
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: "#e5e8e8",
        fontWeight: "500",
    },
    signInButton: {
        marginVertical: 40,
        width: "100%",
        backgroundColor: "#085bd8",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    signInText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorMessage: {
        fontSize: 18,
        textAlign: "left",
        color: "red",
        alignSelf: "flex-start",
    },
});

export default GetStarted;
