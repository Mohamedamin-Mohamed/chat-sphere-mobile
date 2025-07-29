import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import {usePathname, useRouter} from "expo-router";
import {useSelector} from "react-redux";
import {RootState, UserStats} from "../types/types";
import {Ionicons} from "@expo/vector-icons";
import Modal from "react-native-modal"
import api from "../api/api";
import axios from "axios";

interface ViewProfileModalProps {
    image?: string | null,
    viewProfileModal: boolean,
    setViewProfileModal: Dispatch<SetStateAction<boolean>>,
    fullName: string,
    abbrevName: string
}

const ViewProfileModal = ({
                              image,
                              viewProfileModal,
                              setViewProfileModal,
                              fullName,
                              abbrevName
                          }: ViewProfileModalProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const showEditProfile = !pathname.includes('/editProfile')
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const joinedDate = userInfo.createdAt
    const email = userInfo.email

    const [userStats, setUserStats] = useState<UserStats>({followers: "-", followings: "-"})

    const handleProfileEdit = () => {
        setViewProfileModal(false)
        if (!pathname.includes('/editProfile')) {
            router.push('editProfile')
        }
    }

    useEffect(() => {
        const loadUserStats = async () => {
            try {
                const response = await api.get(`api/users/stats`, {
                    params: {email},
                })
                const userStats = await response.data
                console.log(userStats)
                setUserStats(userStats)
            } catch (exp: any) {
                if (axios.isAxiosError(exp) && exp.response) {
                    const message = exp.response.statusText
                    console.log('An error occurred while fetching user stats: ', message)

                }
            }
        }
        loadUserStats().catch(err => console.error(err))
    }, []);


    const renderUserStats = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider}/>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider}/>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.followings}</Text>
                <Text style={styles.statLabel}>Following</Text>
            </View>
        </View>
    );
    return (
        <Modal animationIn='slideInUp'
               animationOut='slideInDown'
               animationInTiming={600}
               animationOutTiming={1000}
               swipeDirection='down'
               onBackdropPress={() => setViewProfileModal(false)}
               onSwipeComplete={() => setViewProfileModal(false)}
               isVisible={viewProfileModal}
               style={{margin: 0}}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setViewProfileModal(false)}/>
                <View style={styles.modalContent}>
                    <View style={styles.nameAbbrevView}>
                        {image ? (
                            <Image source={{uri: image}} style={styles.avatarImage}/>
                        ) : (
                            <Text style={styles.abbrevText}>{abbrevName}</Text>
                        )}
                    </View>
                    <Text style={styles.fullNameText}>{fullName}</Text>
                    {renderUserStats()}
                    <View style={[styles.joinDate, !showEditProfile && {marginBottom: 60}]}>
                        <Ionicons name="calendar-outline" size={20} color="#4F46E5"/>
                        <Text style={styles.joinDateText}>Since {joinedDate}</Text>
                    </View>
                    {showEditProfile &&
                        <TouchableOpacity style={styles.editProfile} activeOpacity={0.4} onPress={handleProfileEdit}>
                            <Icon name="edit" size={25} color="#4F46E5"/>
                            <Text style={styles.editProfileText}>Edit profile</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        width: '100%'
    },
    modalContent: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 100,
        position: 'relative',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: '100%'
    },
    nameAbbrevView: {
        position: 'absolute',
        top: -18,
        backgroundColor: '#ebeaea',
        height: 120,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 64,
        padding: 10,
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
    fullNameText: {
        fontWeight: '700',
        fontSize: 24,
        marginTop: 20
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingVertical: 16,
        marginBottom: 30,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#777',
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#777',
        height: '100%',
    },
    joinDate: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 20
    },
    joinDateText: {
        fontSize: 16,
        color: '#898686FF',
    },
    editProfile: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        width: '86%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 40
    },
    editProfileText: {
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 16
    }
})

export default ViewProfileModal