import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SearchUser} from "../../../types/types";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useState} from "react";
import DisplayUsers from "../../(tabs)/search/DisplayUsers";

const Page = () => {
    const {users} = useLocalSearchParams()
    const parsedUsers: SearchUser[] = JSON.parse(users as string)

    const [disabled, setDisabled] = useState(false)
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    disabled={disabled}
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                    style={styles.backButton}>
                    <Icon name="arrow-back" size={28} color="white"/>
                </TouchableOpacity>
                <Text style={styles.backButtonText}>Mutual Friends</Text>
            </View>
            <View>
                <DisplayUsers users={parsedUsers} loading={disabled} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
})
export default Page