import {Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/types";
import {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import AvatarModal from "../../../modals/AvatarModal";
import ViewProfileModal from "../../../modals/ViewProfileModal";

const Page = () => {
    /* keep editing the TextInput, add save button next to Profile when TextInput changes, add preventRemove to prevent
    user from leaving screen if TextInput has been changed */
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const fullName = userInfo.name
    const splitFullName = userInfo.name.split(' ')
    const firstName = splitFullName[0].charAt(0).toUpperCase(), lastName = splitFullName[1].charAt(0).toUpperCase()
    const abbrevName = firstName + lastName
    const [displayAvatarModal, setDisplayAvatarModal] = useState(false)
    const [image, setImage] = useState('')
    const [viewProfileModal, setViewProfileModal] = useState(false)

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
        setDisplayAvatarModal((prev) => !prev);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.buttonView}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="white"/>
                </TouchableOpacity>
                <Text style={styles.backButtonText}>Profile</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <View style={styles.nameAbbrevView}>
                        <Text style={styles.abbrevText}>{abbrevName}</Text>
                        <TouchableOpacity
                            onPress={() => setDisplayAvatarModal(true)}
                            style={{
                                position: 'absolute',
                                left: '84%',
                                top: '90%',
                                backgroundColor: '#085bd8',
                                borderRadius: 20,
                                padding: 6,
                            }}>
                            <Icon name="edit" size={16} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.viewProfile} activeOpacity={1}
                                      onPress={() => setViewProfileModal(prevState => !prevState)}>
                        <Text style={styles.viewProfileText}>Preview profile</Text>
                    </TouchableOpacity>
                    <View style={styles.nameView}>
                        <View>
                            <Text>Name</Text>
                        </View>
                        <View>
                            <TextInput value={fullName}/>
                        </View>
                    </View>
                </View>
                {displayAvatarModal &&
                    <AvatarModal handleModalDisplay={handleDisplayAvatarModal} choosePhoto={imagePicker}/>}
                {viewProfileModal && <ViewProfileModal setViewProfileModal={setViewProfileModal} fullName={fullName}
                                                       abbrevName={abbrevName}/>}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginBottom: 16,
        gap: 10,
        marginTop: 20
    },
    backButton: {
        backgroundColor: "black",
        width: 50,
        height: 50,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: "600"
    },
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#f5f5f5',
    },
    childContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameAbbrevView: {
        marginVertical: 24,
        backgroundColor: 'white',
        height: 160,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 96,
        padding: 10
    },
    abbrevText: {
        fontSize: 56,
        fontWeight: '800'
    },
    viewProfile: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 48
    },
    viewProfileText: {
        color: 'white',
        fontSize: 16,
        marginHorizontal: 10
    },
    nameView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: '90%',
        padding: 12,
        borderRadius: 8,
        marginVertical: 20,
    }
})
export default Page