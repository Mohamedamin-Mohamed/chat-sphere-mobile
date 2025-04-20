import {Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";

const Page = () => {
    const [disabled, setDisabled] = useState(false)
    return (
        <ScrollView contentContainerStyle={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{marginBottom: 16, gap: 10, marginTop: 20}}>
                        <TouchableOpacity disabled={disabled} activeOpacity={0.8} onPress={() => router.back()}
                                          style={styles.backButton}>
                            <Icon name="arrow-back" size={30} color="#085bd8"/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.title}> Sign in</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        width: "100%"
    },
    backButton: {
        backgroundColor: "#a6c0ed",
        width: 50,
        height: 50,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "500",
        color: "#073ea0",
        marginBottom: 20,
    },
})

export default Page