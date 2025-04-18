import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {router, useNavigation} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useDispatch, useSelector} from "react-redux";
import {RootState, User} from "../../../types/types";
import React, {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import AvatarModal from "../../../modals/AvatarModal";
import ViewProfileModal from "../../../modals/ViewProfileModal";
import {NavigationAction, usePreventRemove} from "@react-navigation/native";
import DiscardModal from "../../../modals/DiscardModal";
import CampusConnect from "./CampusConnect";
import AccountInfo from "./AccountInfo";
import emailValidation from "../../../utils/emailValidation";
import EmailNotValidModal from "../../../modals/EmailNotValidModal";
import EmptyNameModal from "../../../modals/EmptyNameModal";
import updateProfile from "../../../api/updateProfile";
import Toast from "react-native-toast-message";
import {setUserInfo} from "../../../redux/userSlice";

const Page = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const picture = userInfo.picture
    const email = userInfo.email
    const dispatch = useDispatch()
    const fullName = userInfo.name;
    const userBio = userInfo.bio
    const splitFullName = fullName.split(' ');
    const abbrevName = splitFullName[0].charAt(0).toUpperCase() + (splitFullName[1]?.charAt(0).toUpperCase() || '');

    const [displayAvatarModal, setDisplayAvatarModal] = useState(false);
    const [image, setImage] = useState(picture);
    const [viewProfileModal, setViewProfileModal] = useState(false);
    const [nameInput, setNameInput] = useState<string>(fullName);
    const [emailInput, setEmailInput] = useState<string>(email)
    const [nameInputActive, setNameInputActive] = useState(false);
    const [emailInputActive, setEmailInputActive] = useState(false)
    const [bio, setBio] = useState(userBio)
    const [hasSaved, setHasSaved] = useState(false);

    const [showSaveButton, setShowSaveButton] = useState(false);
    const navigation = useNavigation();
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<NavigationAction | null>(null);
    const [showEmptyNameModal, setShowEmptyNameModal] = useState(false)
    const [showEmailNotFoundModal, setShowEmailNotFoundModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const imagePicker = async () => {
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

    const handleDisplayAvatarModal = () => {
        setDisplayAvatarModal(prev => !prev);
    };

    const handleNameChange = (text: string) => {
        setNameInput(text.trim());
    };

    const handleEmailChange = (text: string) => {
        setNameInput(fullName)
        setEmailInput(text.trim())
    }

    const saveEdits = async () => {
        // Implement save functionality
        if (!isEmailValid()) {
            setShowEmailNotFoundModal(true);
            return;
        }
        if (nameInput.trim() === '') {
            setShowEmptyNameModal(true);
            return;
        }
        console.log(`Image is ${image}, name is ${nameInput.trim()}, bio is ${bio.trim()}, email is ${emailInput.trim()}`)
        const emailUpdated = emailInput !== email;
        const nameUpdated = nameInput.trim() !== fullName;
        const imageUpdated = image !== picture;
        const bioUpdated = bio !== userBio

        const request = {
            email: email,
            ...(emailUpdated && {newEmail: emailInput}),
            ...(nameUpdated && {name: nameInput}),
            ...(imageUpdated && {profileImage: image}),
            ...(bioUpdated && {bio}),
            phoneNumber: "484884848"
        };

        try {
            setLoading(true)

            const response = await updateProfile(request, new AbortController())
            const succeeded = response.ok

            if (succeeded) {
                const data = await response.json()
                const message = data.message
                const user = data.user
                showToastMessage(succeeded, message, user);
            } else {
                const text = await response.text();
                showToastMessage(false, text);
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }

    }

    const showToastMessage = (succeeded: boolean, message: string, user?: User) => {
        Toast.show({
            type: succeeded ? 'success' : 'error',
            text1: message,
            onShow: () => {
                setDisabled(true);
            },
            onHide: () => {
                setDisabled(false);
                if (succeeded) {
                    dispatch(setUserInfo(user))
                    setHasSaved(true);
                    router.back();
                }
            }
        })
    }

    const preventScreenRemoval =
        !hasSaved && (
            image !== picture ||
            fullName.trim() !== nameInput ||
            emailInput.trim() !== email ||
            bio.trim() !== userBio
        )

    useEffect(() => {
        const somethingChanged = image !== picture || fullName !== nameInput || emailInput !== email || bio.trim() !== userBio

        if (somethingChanged) {
            setShowSaveButton(true);
        } else {
            setShowSaveButton(false);
        }
    }, [nameInput, emailInput, image, bio]);


    usePreventRemove(preventScreenRemoval, ({data}) => {
        if (nameInput.trim() === '') {
            setShowEmptyNameModal(true);
            return;
        } else if (emailInputActive && !isEmailValid()) {
            setShowEmailNotFoundModal(true);
            return;
        }
        setPendingAction(data.action);
        setShowDiscardModal(true);
    });

    const confirmDiscard = () => {
        if (pendingAction) {
            navigation.dispatch(pendingAction)
        } else {
            router.back()
        }
        setPendingAction(null)
        setShowDiscardModal(false)

    };

    const cancelDiscard = () => {
        setPendingAction(null);
        setShowDiscardModal(false);
    }

    const handleNameModalClose = () => {
        setShowEmptyNameModal(false);
        setNameInputActive(true);
        setEmailInputActive(false);
    };

    const handleEmailModalClose = () => {
        setShowEmailNotFoundModal(false);
        setEmailInputActive(true);
        setNameInputActive(false);
    };

    const reInitializeNameInput = () => {
        setNameInput(fullName)
    }

    const reInitializeEmailInput = () => {
        setEmailInput(email);
    }

    const handleNameInputPress = () => {
        if (emailInputActive && !isEmailValid()) {
            setShowEmailNotFoundModal(true);
            return;
        }
        setNameInputActive(true);
        setEmailInputActive(false);
        reInitializeEmailInput();
    };

    const isEmailValid = () => {
        if (emailInputActive) {
            return emailValidation(emailInput);
        }
        return true;
    }

    useEffect(() => {
        setNameInput(fullName)
    }, [emailInputActive])

    const handlePasswordChange = (route: string) => {
        setNameInput(fullName)
        setEmailInput(email)
        router.push(route)
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.headerContainer}>
                <View style={styles.buttonView}>
                    <TouchableOpacity
                        disabled={disabled}
                        activeOpacity={0.8}
                        onPress={() => router.back()}
                        style={styles.backButton}>
                        <Icon name="arrow-back" size={28} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.backButtonText}>Profile</Text>
                </View>
                {showSaveButton && (
                    <TouchableOpacity style={styles.saveButton} disabled={disabled}
                                      onPress={saveEdits} activeOpacity={0.9}>
                        {loading ? <ActivityIndicator size='small' color='white'/> :
                            <Text style={styles.saveButtonText}>Save</Text>
                        }
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.childContainer}>
                    <View style={styles.nameAbbrevView}>
                        {image ? (
                            <Image source={{uri: image}} style={styles.avatarImage}/>
                        ) : (
                            <Text style={styles.abbrevText}>{abbrevName}</Text>
                        )}
                        <TouchableOpacity onPress={handleDisplayAvatarModal} style={styles.iconView}
                                          activeOpacity={0.8}>
                            <Icon name="edit" size={18} color="white"/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.viewProfile} activeOpacity={1}
                                      onPress={() => setViewProfileModal(prev => !prev)}>
                        <Text style={styles.viewProfileText}>Preview profile</Text>
                    </TouchableOpacity>
                    <View style={styles.nameView}>
                        <View style={styles.nameLabel}>
                            <Text style={styles.nameText}>Name</Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.textInputView, emailInputActive && !isEmailValid() && {opacity: 0.5}
                            ]}
                            onPress={handleNameInputPress}
                            activeOpacity={1}
                        >
                            <TextInput
                                value={nameInput}
                                onChangeText={setNameInput}
                                onFocus={() => {
                                    if (emailInputActive && !isEmailValid()) {
                                        setShowEmailNotFoundModal(true);
                                        return;
                                    }
                                    setNameInputActive(true);
                                    setEmailInputActive(false);
                                    reInitializeEmailInput();
                                }}
                                editable={!(emailInputActive && !isEmailValid())}
                                multiline={false}
                                numberOfLines={1}
                                style={[
                                    styles.textInput,
                                    (emailInputActive && !isEmailValid()) && {color: '#999'}
                                ]}
                                autoCorrect={false}
                                autoCapitalize="none"
                            />

                            {nameInputActive && nameInput !== '' && (
                                <TouchableOpacity onPress={() => setNameInput('')}>
                                    <Icon name="cancel" size={20} color="gray"/>
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bioView}>
                        <Text style={styles.bioText}>Bio</Text>
                        <TextInput
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            style={styles.bioTextInput}
                            placeholder="Tell us about yourself..."
                            selectionColor="#2c2c2c"
                        />
                    </View>
                    <CampusConnect/>
                    <AccountInfo
                        emailInput={emailInput}
                        setEmailInput={setEmailInput}
                        setEmailInputActive={setEmailInputActive}
                        setNameInputActive={setNameInputActive}
                        reInitializeNameInput={reInitializeNameInput}
                        handlePasswordChange={handlePasswordChange}
                        emailInputActive={emailInputActive}
                        handleEmailChange={handleEmailChange}
                    />
                </View>

                {displayAvatarModal && (
                    <AvatarModal handleModalDisplay={handleDisplayAvatarModal} choosePhoto={imagePicker}/>
                )}
                {viewProfileModal && (
                    <ViewProfileModal
                        image={image}
                        setViewProfileModal={setViewProfileModal}
                        fullName={fullName}
                        abbrevName={abbrevName}
                    />
                )}
                {showDiscardModal && (
                    <DiscardModal
                        showDiscardModal={showDiscardModal}
                        cancelDiscard={cancelDiscard}
                        confirmDiscard={confirmDiscard}
                    />
                )}
                {showEmailNotFoundModal &&
                    <EmailNotValidModal showModal={showEmailNotFoundModal} discardModal={handleEmailModalClose}/>}
                {showEmptyNameModal &&
                    <EmptyNameModal showModal={showEmptyNameModal} discardModal={handleNameModalClose}/>}
                <Toast position='top'/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#f5f5f5',
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backButton: {
        backgroundColor: "black",
        width: 40,
        height: 40,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 22,
        fontWeight: "500"
    },
    saveButton: {
        backgroundColor: "#085bd8",
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15
    },
    childContainer: {
        width: '100%',
        alignItems: 'center',
    },
    nameAbbrevView: {
        marginVertical: 24,
        backgroundColor: 'white',
        height: 160,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 96,
        padding: 10,
    },
    avatarImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: 96,
    },
    abbrevText: {
        fontSize: 56,
        fontWeight: '700',
    },
    viewProfile: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 48,
        marginVertical: 10,
    },
    viewProfileText: {
        color: 'white',
        fontSize: 15,
        paddingVertical: 2,
        marginHorizontal: 10,
        fontWeight: '700'
    },
    nameView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: '90%',
        padding: 12,
        borderRadius: 8,
        marginVertical: 20,
    },
    nameLabel: {
        width: '20%',
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 16
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
    cancelIconView: {
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#a9a6a6',
        marginLeft: 6,
    },
    bioView: {
        gap: 10,
        width: '90%',
        borderRadius: 8,
        marginLeft: 10,
        marginBottom: 20,
    },
    bioText: {
        fontSize: 18,
        fontWeight: '500',
    },
    bioTextInput: {
        backgroundColor: 'white',
        minHeight: 100,
        padding: 16,
        borderRadius: 8,
        textAlignVertical: 'top',
        fontSize: 16
    },
    iconView: {
        position: 'absolute',
        left: '88%',
        top: '90%',
        backgroundColor: '#085bd8',
        borderRadius: 20,
        padding: 6,
    }
});

export default Page;
