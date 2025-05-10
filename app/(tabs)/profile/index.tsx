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
        <SafeAreaView style={[styles.container, {backgroundColor: viewProfileModal ? '#F3F4F6' : '#FFFFFF'}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.fullNameText}>{fullName}</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {image ? (
                            <Image source={{uri: image}} style={styles.avatarImage}/>
                        ) : (
                            <View style={styles.nameAbbrevView}>
                                <Text style={styles.abbrevText}>{abbrevName}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.viewProfileButton}
                        activeOpacity={0.8}
                        onPress={() => setViewProfileModal(prevState => !prevState)}
                    >
                        <Text style={styles.viewProfileText}>View profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonsContainer}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    {ButtonsList.map((item, index) => (
                        <TouchableOpacity
                            style={styles.menuItem}
                            key={index}
                            activeOpacity={0.7}
                            onPress={() => handleProfileView(item)}
                        >
                            <View style={styles.iconContainer}>
                                <Icon name={item.icon} size={22} color="#4F46E5" />
                            </View>
                            <Text style={styles.menuItemText}>{item.name}</Text>
                            <Icon name="chevron-right" size={22} color="#9CA3AF" style={styles.chevronIcon} />
                        </TouchableOpacity>
                    ))}

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.menuItem}
                        activeOpacity={0.7}
                        onPress={handleSignOut}
                    >
                        <View style={[styles.iconContainer, styles.signOutIconContainer]}>
                            <Icon name="exit-to-app" size={22} color="#EF4444" />
                        </View>
                        <Text style={styles.signOutText}>Sign out</Text>
                    </TouchableOpacity>
                </View>

                {viewProfileModal &&
                    <ViewProfileModal
                        image={image}
                        setViewProfileModal={setViewProfileModal}
                        fullName={fullName}
                        abbrevName={abbrevName}
                    />
                }

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
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    fullNameText: {
        fontWeight: '700',
        fontSize: 26,
        color: '#111827',
        marginTop: 60,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatarContainer: {
        marginBottom: 20,
    },
    nameAbbrevView: {
        height: 120,
        width: 120,
        borderRadius: 60,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarImage: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#EEF2FF',
    },
    abbrevText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#4F46E5',
    },
    viewProfileButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    viewProfileText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 16,
        marginLeft: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 12,
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    signOutIconContainer: {
        backgroundColor: '#FEE2E2',
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    signOutText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#EF4444',
    },
    chevronIcon: {
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 16,
    },
})

export default Page