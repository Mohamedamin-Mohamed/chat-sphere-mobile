import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const ChangePassword = () => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonView}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="white"/>
                </TouchableOpacity>
                <Text style={styles.backButtonText}>Change Password</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5'
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
})
export default ChangePassword
