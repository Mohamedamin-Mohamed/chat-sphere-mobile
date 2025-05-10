import {ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SearchUser} from "../../../types/types";
import {router} from "expo-router";

const DisplayUsers = ({users, loading}: { users: SearchUser[], loading: boolean }) => {
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF"/>
                    <Text style={styles.loadingText}>Searching users...</Text>
                </View>
            ) : users.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No users found</Text>
                </View>
            ) : (
                users.map((user, index) => (
                    <TouchableOpacity key={index} style={styles.userCard}
                                      onPress={() => router.push({
                                          pathname: 'user',
                                          params: {user: JSON.stringify(user)}
                                      })}>
                        <Image source={{uri: user.picture}} style={styles.avatar}/>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.email}>{user.email}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        top: 20
    },
    loadingContainer: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        height: 64,
        width: 64,
        borderRadius: 32,
        backgroundColor: '#e0e0e0',
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
});

export default DisplayUsers;
