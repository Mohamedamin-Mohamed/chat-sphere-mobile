import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";

const Page = () => {
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = () => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View style={styles.buttonsView}>
                    <Text style={styles.chatText}>Chat</Text>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <TouchableOpacity style={styles.buttons} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="qrcode" size={30}/>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttons} activeOpacity={0.8}>
                            <Icon name="add" size={30} color="gray"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.headline}>Welcome to ChatSphere – Your Campus Chat App!</Text>
                    <Text style={styles.subheadline}>
                        Connect with classmates, join study groups, and collaborate on projects – all in one place.
                        ChatSphere is designed for students, by students.
                    </Text>

                    <Text style={styles.exploreHeader}>More to explore </Text>
                    <View style={{gap: 10, alignSelf: 'center'}}>
                        <TouchableOpacity activeOpacity={0.8}>
                            <View style={styles.viewLikes}>
                                <Text style={styles.exploreSubHeader}>Create a group</Text>
                                <Text style={styles.exploreText}>Start your own chat and invite members</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8}>
                            <View style={styles.viewLikes}>
                                <Text style={styles.exploreSubHeader}>Join groups</Text>
                                <Text style={styles.exploreText}>Discover trending and nearby groups</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8}>
                            <View style={styles.viewLikes}>
                                <Text style={styles.exploreSubHeader}>Join your campus</Text>
                                <Text style={styles.exploreText}>Find groups, classmates, etc at your school</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 10
    },
    chatText: {
        fontSize: 30,
        fontWeight: "600"
    },
    buttons: {
        backgroundColor: '#e8e6e6',
        alignSelf: 'flex-start',
        borderRadius: 8,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subheadline: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    features: {
        marginBottom: 20,
    },
    feature: {
        fontSize: 14,
        marginBottom: 5,
    },
    testimonial: {
        fontStyle: 'italic',
        textAlign: 'center',
    },
    exploreHeader: {
        fontWeight: "600",
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20,
    },
    exploreSubHeader: {
        fontWeight: "500",
        fontSize: 16,
    },
    exploreText: {},
    viewLikes: {
        backgroundColor: "#e8e6e6",
        borderRadius: 8,
        justifyContent: 'center',
        width: "100%",
        padding: 10,
    }
});

export default Page