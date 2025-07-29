import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/types";

const Page = () => {
    const {recipientEmail} = useLocalSearchParams()
    console.log(`Recipient email is ${recipientEmail}`)
    const [disabled, setDisabled] = useState(false)
    const image = require("../../../assets/images/campus-directory.png")
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const userEmail = userInfo.email
    const fullName = userInfo.name
    const splitFullName = fullName.split(" ")
    const abbrevName =
        splitFullName[0]?.charAt(0).toUpperCase() +
        (splitFullName[1]?.charAt(0).toUpperCase() || "")

    const loadUserChats = () => {
        //implement loading of user chats by using userEmail
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.buttonView}>
                    <TouchableOpacity
                        disabled={disabled}
                        activeOpacity={0.8}
                        onPress={() => router.back()}
                        style={styles.backButton}>
                        <Icon name="arrow-back" size={28} color="white"/>
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        {image ? (
                            <Image source={image} style={styles.profileImage}/>
                        ) : (
                            <View style={styles.defaultImageView}>
                                <Text style={styles.abbrevText}>{abbrevName}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.nameHeader}>
                        <Text>{fullName}</Text>
                        <Text>Online</Text>
                    </View>
                </View>
            </ScrollView>
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
    imageContainer: {
        marginRight: 12,
    },
    profileImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#EEF2FF",
    },
    defaultImageView: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
    },
    abbrevText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#4F46E5",
    },
    nameHeader: {
        flexDirection: "column",
    }
})
export default Page