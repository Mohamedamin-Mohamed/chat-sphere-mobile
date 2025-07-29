import React, {useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FollowInteraction, RootState, SearchUser} from "../../../types/types";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useSelector} from "react-redux";
import Toast from "react-native-toast-message";
import api from "../../../api/api";
import axios from "axios";

const UserProfileScreen = () => {
    const {user} = useLocalSearchParams()
    const parsedUser: SearchUser = JSON.parse(user as string)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const followerEmail = userInfo.email
    const [disabled, setDisabled] = useState(false)

    const [requesterFollows, setRequesterFollows] = useState(parsedUser.isFollowedByRequester);
    const [followerCount, setFollowerCount] = useState(parsedUser.followerSize);

    const joinedDate = parsedUser.joinedDate
    const followings = parsedUser.followingSize
    const followingEmail = parsedUser.email
    const mutualFriendsSize = parsedUser.topThreeMutualFriends.length
    const topThreeMutualFriendsNames = parsedUser.topThreeMutualFriends.map(user => user.name.split(' ')[0]).join(', ' +
        '')
    const mutualFriends = parsedUser.topThreeMutualFriends
    const isOnline = parsedUser.isOnline
    const lastActive = "2 hours ago"
    //place-holder for now
    const mutualGroups = 0

    const followOperation = async () => {
        const followRequest: FollowInteraction = {
            followerEmail,
            followingEmail
        };

        try {
            const controller = new AbortController();
            await api.post(
                'api/follow/add',
                followRequest,
                {signal: controller.signal}
            );

            setRequesterFollows(true);
            setFollowerCount(prev => prev + 1);

        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                const message = err.response.data?.message || "Follow attempt failed. Please try again shortly.";
                showToastMessage(message, false);
            } else {
                console.error("Unexpected follow error:", err);
            }
        }
    };

    const unFollowOperation = async () => {
        const unfollowRequest: FollowInteraction = {
            followerEmail,
            followingEmail
        };

        try {
            const controller = new AbortController();
            await api.post(
                'api/follow/remove',
                unfollowRequest,
                {signal: controller.signal}
            );

            setRequesterFollows(false);
            setFollowerCount(prev => prev - 1);

        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                const message = err.response.data?.message || "Unfollow attempt failed. Please try again shortly.";
                showToastMessage(message, false);
            } else {
                console.error("Unexpected unfollow error:", err);
            }
        }
    };

    const showToastMessage = (message: string, successful: boolean) => {
        Toast.show({
            type: successful ? 'success' : 'error',
            text1: message,
            onShow: () => setDisabled(true),
            onHide: () => setDisabled(false)
        })
    }

    const handleMessageSending = () => {
        router.replace({
            pathname: 'chat',
            params: {recipientEmail: parsedUser.email}
        })
    }

    const renderUserStats = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider}/>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{followerCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider}/>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{followings}</Text>
                <Text style={styles.statLabel}>Following</Text>
            </View>
        </View>
    );

    const renderActionButtons = () => (
        <View style={styles.actionContainer}>
            <TouchableOpacity disabled={disabled}
                              onPress={() => requesterFollows ? unFollowOperation() : followOperation()}
                              style={[styles.actionButton, requesterFollows && styles.followingButton]}
            >
                <Text style={[styles.actionButtonText, requesterFollows && styles.followingButtonText]}>
                    {requesterFollows ? 'Unfollow' : 'Follow'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={disabled} style={styles.messageButton} onPress={handleMessageSending}>
                <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={disabled} style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#555"/>
            </TouchableOpacity>
        </View>
    )

    const renderAboutSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>
                {parsedUser.bio || "No bio available. This user hasn't added any information about themselves yet."}
            </Text>

            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color="#666"/>
                <Text style={styles.infoText}>Joined {joinedDate}</Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color="#666"/>
                <Text style={styles.infoText}>Last active {lastActive}</Text>
            </View>
        </View>
    );

    const handleMutualFriendsDisplay = () => {
        router.push({
            pathname: 'mutualFriends',
            params: {users: JSON.stringify(mutualFriends)}
        })
    }

    const renderMutualConnections = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connections</Text>

            <View style={styles.connectionItem}>
                <View style={styles.connectionIconContainer}>
                    <Ionicons name="people-outline" size={20} color="#6C63FF"/>
                </View>
                <View style={styles.connectionInfo}>
                    <Text style={styles.connectionTitle}>
                        {mutualFriendsSize} mutual {mutualFriendsSize === 1 ? "friend" : "friends"}
                    </Text>
                    {mutualFriendsSize > 0 ? (
                        <Text style={styles.connectionSubtitle}>Including {topThreeMutualFriendsNames}</Text>
                    ) : (
                        <Text style={styles.connectionSubtitle}>No mutual friends or connection depth reached</Text>
                    )}
                </View>
                {mutualFriendsSize > 0 && (
                    <TouchableOpacity onPress={handleMutualFriendsDisplay}>
                        <Ionicons name="chevron-forward" size={20} color="#777"/>
                    </TouchableOpacity>
                )}
            </View>


            <View style={styles.connectionItem}>
                <View style={styles.connectionIconContainer}>
                    <Ionicons name="grid-outline" size={20} color="#6C63FF"/>
                </View>
                <View style={styles.connectionInfo}>
                    <Text style={styles.connectionTitle}>0 mutual groups</Text>
                    <Text style={styles.connectionSubtitle}>Tech Enthusiasts, Photography Club</Text>
                </View>
                {mutualGroups > 0 &&
                    <TouchableOpacity>
                        <Ionicons name="chevron-forward" size={20} color="#777"/>
                    </TouchableOpacity>
                }
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content"/>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <View style={styles.coverPhotoContainer}>
                        <View style={styles.buttonView}>
                            <TouchableOpacity
                                disabled={disabled}
                                activeOpacity={0.8}
                                onPress={() => router.back()}
                                style={styles.backButton}>
                                <Icon name="arrow-back" size={28} color="white"/>
                            </TouchableOpacity>
                            <Text style={styles.backButtonText}>Account</Text>
                        </View>
                    </View>

                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{uri: parsedUser.picture}}
                            style={styles.profileImage}
                        />
                        <View style={isOnline && styles.onlineIndicator}/>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.name}>{parsedUser.name}</Text>
                    <Text
                        style={styles.username}>@{parsedUser.name || parsedUser.name.toLowerCase().replace(/\s/g, '')}</Text>
                    <Text style={styles.email}>{parsedUser.email}</Text>

                    {renderUserStats()}
                    {renderActionButtons()}
                    {renderAboutSection()}
                    {renderMutualConnections()}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <View style={styles.emptyStateContainer}>
                            <Ionicons name="albums-outline" size={36} color="#ccc"/>
                            <Text style={styles.emptyStateText}>No recent activity to show</Text>
                        </View>
                    </View>
                </View>
                <Toast topOffset={20}/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        position: 'relative',
        marginBottom: 60,
    },
    coverPhotoContainer: {
        position: 'relative',
        height: 180,
    },
    coverPhoto: {
        width: '100%',
        height: '100%',
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginLeft: 16,
        marginTop: 10
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
    profileImageContainer: {
        position: 'absolute',
        bottom: -50,
        left: '50%',
        marginLeft: -60,
        borderRadius: 60,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 72,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#fff',
    },
    contentContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    username: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#888',
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingVertical: 16,
        marginBottom: 20,
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
        backgroundColor: '#eee',
        height: '100%',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 30,
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 24,
        backgroundColor: '#6C63FF',
        marginRight: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    followingButton: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    followingButtonText: {
        color: '#333',
    },
    messageButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 24,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    messageButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 15,
    },
    moreButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        width: '100%',
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    bioText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    connectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    connectionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    connectionInfo: {
        flex: 1,
    },
    connectionTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    connectionSubtitle: {
        fontSize: 13,
        color: '#777',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    }
});

export default UserProfileScreen;