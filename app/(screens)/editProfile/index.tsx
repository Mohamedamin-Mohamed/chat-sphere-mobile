import {
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
import {useSelector} from "react-redux";
import {RootState} from "../../../types/types";
import {useEffect, useState} from "react";
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

const Page = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const email = userInfo.email

    const fullName = userInfo.name;
    const splitFullName = fullName.split(' ');
    const abbrevName = splitFullName[0].charAt(0).toUpperCase() + (splitFullName[1]?.charAt(0).toUpperCase() || '');

    const [displayAvatarModal, setDisplayAvatarModal] = useState(false);
    const [image, setImage] = useState('');
    const [viewProfileModal, setViewProfileModal] = useState(false);
    const [del, setDel] = useState(false);
    const [nameInput, setNameInput] = useState<string>(fullName);
    const [emailInput, setEmailInput] = useState<string>(email)
    const [bio, setBio] = useState('')

    const [showSaveButton, setShowSaveButton] = useState(false);
    const navigation = useNavigation();
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<NavigationAction | null>(null);
    const [showEmptyNameModal, setShowEmptyNameModal] = useState(false)
    const [showEmailNotFoundModal, setShowEmailNotFoundModal] = useState(false)

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

    const saveEdits = () => {
        // Implement save functionality
        if (!isEmailValid()) {
            setShowEmailNotFoundModal(true);
            return;
        }
        if (nameInput.trim() === '') {
            setShowEmptyNameModal(true);
            return;
        }

    };

    const preventScreenRemoval = image !== '' || fullName.trim() !== nameInput || emailInput.trim() !== email || bio.trim() !== ''

    useEffect(() => {
        const somethingChanged = image !== '' || fullName !== nameInput || emailInput !== email || bio.trim() !== ''

        if (somethingChanged) {
            setShowSaveButton(true);
        } else {
            setShowSaveButton(false);
        }
    }, [nameInput, emailInput, image, bio]);


    usePreventRemove(preventScreenRemoval, ({data}) => {
        setPendingAction(data.action);
        setShowDiscardModal(true);
    });

    const confirmDiscard = () => {
        if (pendingAction) {
            navigation.dispatch(pendingAction);
            setPendingAction(null);
        }
        setShowDiscardModal(false);
    };

    const cancelDiscard = () => {
        setPendingAction(null);
        setShowDiscardModal(false);
    };

    const discardModal = () => {
        setShowEmailNotFoundModal(false)
        setShowEmptyNameModal(false
        )
    }

    const reInitializeNameInput = () => {
        setNameInput(fullName)
    }

    const handleNameInputPress = () => {
        if (!isEmailValid) {
            setShowEmailNotFoundModal(true)
        }
    }

    const isEmailValid = () => {
        return emailValidation(emailInput)
    }
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.headerContainer}>
                <View style={styles.buttonView}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}
                                      style={styles.backButton}>
                        <Icon name="arrow-back" size={28} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.backButtonText}>Profile</Text>
                </View>
                {showSaveButton && (
                    <TouchableOpacity style={styles.saveButton}
                                      onPress={saveEdits} activeOpacity={0.9}>
                        <Text style={styles.saveButtonText}>Save</Text>
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
                            style={styles.textInputView}
                            onPress={handleNameInputPress}
                            activeOpacity={1}
                        >
                            <TextInput
                                value={nameInput}
                                onChangeText={(text) => {
                                    if (!isEmailValid()) {
                                        setShowEmailNotFoundModal(true);
                                        return;
                                    }
                                    handleNameChange(text);
                                }}
                                onPressIn={() => {
                                    if (!isEmailValid()) {
                                        setShowEmailNotFoundModal(true);
                                    } else {
                                        setDel(true);
                                    }
                                }}
                                editable={isEmailValid()}
                                multiline={false}
                                numberOfLines={1}
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize='none'
                            />
                            {del && isEmailValid() && nameInput !== '' && (
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
                            onChangeText={text => setBio(text.trim())}
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
                        reInitializeNameInput={reInitializeNameInput}
                        handleEmailChange={handleEmailChange}/>
                </View>

                {displayAvatarModal && (
                    <AvatarModal handleModalDisplay={handleDisplayAvatarModal} choosePhoto={imagePicker}/>
                )}
                {viewProfileModal && (
                    <ViewProfileModal
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
                    <EmailNotValidModal showModal={showEmailNotFoundModal} discardModal={discardModal}/>}
                {showEmptyNameModal && <EmptyNameModal showModal={showEmptyNameModal} discardModal={discardModal}/>}
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
