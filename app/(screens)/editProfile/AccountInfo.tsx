import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/types";
import {router} from "expo-router";

const AccountInfo = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const email = userInfo.email
    return (
        <View style={styles.container}>
            <Text style={styles.accountInfoText}>Account info</Text>
            <View style={styles.infoView}>
                <Icon name='lock' size={20} color='#545454'/>
                <Text style={styles.visibilityText}>Only visible to you</Text>
            </View>
            <View style={styles.childContainer}>
                <View style={styles.sameView}>
                    <Text>Email</Text>
                    <Text>{email}</Text>
                </View>
                <View style={styles.sameView}>
                    <Text>Phone Number</Text>
                    {/*{//this is just a place-holder}*/}
                    <Text>+1 612-261-7712</Text>
                </View>
                <View style={styles.sameView}>
                    <Text>Password</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('passwordChange')}>
                        <Icon name='chevron-right' size={30} color='#a9a6a6'/>
                    </TouchableOpacity>
                </View>

            </View>
            <View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginLeft: 10,
        gap: 10,
        borderRadius: 8,
        marginVertical: 30,
    },
    accountInfoText: {
        fontWeight: '500',
        fontSize: 18
    },
    infoView: {
        alignItems: 'center',
        flexDirection: 'row', gap: 10
    },
    visibilityText: {
        color: '#373737',
        fontSize: 13
    },
    childContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 16,
        gap: 20
    },
    sameView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})
export default AccountInfo