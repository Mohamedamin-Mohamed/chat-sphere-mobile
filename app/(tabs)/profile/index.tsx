import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router, useNavigation} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {Buttons, RootState} from "../../../types/types";
import React, {useState} from "react";
import ViewProfileModal from "../../../modals/ViewProfileModal";
import Icon from "react-native-vector-icons/MaterialIcons";
import {CommonActions} from "@react-navigation/native";
import ConfirmSignOutModal from "../../../modals/ConfirmSignOutModal";
import {clearUserInfo} from "../../../redux/userSlice";


const Page = () => {
    const ButtonsList: Buttons[] = [
        {icon: 'edit', name: 'Edit profile', navigateTo: 'editProfile'},
        {icon: 'contacts', name: 'Contacts', navigateTo: 'contacts'},
        {icon: 'settings', name: 'Settings', navigateTo: 'settings'},
        {icon: 'live-help', name: 'Help Center', navigateTo: 'help'}
    ]
    const navigation = useNavigation()
    const userInfo = useSelector((state: RootState) => state.userInfo)
    console.log('User info is', userInfo)
    const dispatch = useDispatch()
    const image = userInfo.picture
    const fullName = userInfo.name;
    const splitFullName = fullName.split(' ');
    const abbrevName = splitFullName[0].charAt(0).toUpperCase() + (splitFullName[1]?.charAt(0).toUpperCase() || '');
    const [viewProfileModal, setViewProfileModal] = useState(false)
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const handleSignOut = () => {
        setShowSignOutModal(true);
    }

    const confirmSignOut = () => {
        dispatch(clearUserInfo())
        setShowSignOutModal(false);
        navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [
                {
                    name: '(auth)',
                    state: {
                        index: 0,
                        routes: [{name: 'Welcome'}],
                    },
                },
            ],
        }))
    }

    const handleProfileView = (el: Buttons) => {
        setViewProfileModal(false)
        router.push(el.navigateTo)
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: viewProfileModal ? '#f5f5f5' : '#fff'}]}>
            <ScrollView>
                <View style={styles.childContainer}>
                    <Text style={styles.fullNameText}>{fullName}</Text>
                    <View style={styles.nameAbbrevView}>
                        {image ? (
                            <Image source={{uri: image}} style={styles.avatarImage}/>
                        ) : (
                            <Text style={styles.abbrevText}>{abbrevName}</Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.viewProfile} activeOpacity={1}
                                      onPress={() => setViewProfileModal(prevState => !prevState)}>
                        <Text style={styles.viewProfileText}>View profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsView}>
                    {ButtonsList.map((ele, index) => (
                        <TouchableOpacity style={styles.buttonsChildView} key={index} activeOpacity={0.8}
                                          onPress={() => handleProfileView(ele)}>
                            <View style={styles.iconsView}>
                                <Icon name={ele.icon} size={20} color="black"/>
                            </View>
                            <Text style={{fontSize: 16}}>{ele.name}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.buttonsChildView} activeOpacity={0.8} onPress={handleSignOut}>
                        <View style={styles.iconsView}>
                            <Icon name="exit-to-app" size={20} color="black"/>
                        </View>
                        <Text style={{fontSize: 16}}>Sign out</Text>
                    </TouchableOpacity>
                </View>
                {viewProfileModal &&
                    <ViewProfileModal
                        image={image}
                        setViewProfileModal={setViewProfileModal}
                        fullName={fullName}
                        abbrevName={abbrevName}/>}
                {showSignOutModal &&
                    <ConfirmSignOutModal
                        visible={showSignOutModal}
                        onCancel={() => setShowSignOutModal(false)}
                        onConfirm={confirmSignOut}
                    />

                }
            </ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    childContainer: {
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullNameText: {
        fontWeight: '700',
        fontSize: 24
    },
    nameAbbrevView: {
        marginVertical: 24,
        backgroundColor: '#ebeaea',
        height: 124,
        width: 124,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 96,
        padding: 10
    },
    avatarImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: 96,
    },
    abbrevText: {
        fontSize: 40,
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
    buttonsView: {
        justifyContent: 'flex-start',
        marginTop: 20,
        marginLeft: 40,
        gap: 20
    },
    buttonsChildView: {
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconsView: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#e8e6e6',
        padding: 4
    }
})
export default Page