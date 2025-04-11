import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "expo-router";
import {useSelector} from "react-redux";
import {Buttons, RootState} from "../../../types/types";
import {useState} from "react";
import ViewProfileModal from "../../../modals/ViewProfileModal";
import Icon from "react-native-vector-icons/MaterialIcons";


const Page = () => {
    const ButtonsList: Buttons[] = [
        {icon: 'edit', name: 'Edit profile', navigateTo: 'editProfile'},
        {icon: 'contacts', name: 'Contacts', navigateTo: 'contacts'},
        {icon: 'settings', name: 'Settings', navigateTo: 'settings'},
    ]
    const navigation = useNavigation()
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const fullName = userInfo.name
    const splitFullName = userInfo.name.split(' ')
    const firstName = splitFullName[0].charAt(0).toUpperCase(), lastName = splitFullName[1].charAt(0).toUpperCase()
    const abbrevName = firstName + lastName
    const [viewProfileModal, setViewProfileModal] = useState(false)

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: viewProfileModal ? '#f5f5f5' : '#fff'}]}>
            <View style={styles.childContainer}>
                <Text style={styles.fullNameText}>{fullName}</Text>
                <View style={styles.nameAbbrevView}>
                    <Text style={styles.abbrevText}>{abbrevName}</Text>
                </View>
                <TouchableOpacity style={styles.viewProfile} activeOpacity={1}
                                  onPress={() => setViewProfileModal(prevState => !prevState)}>
                    <Text style={styles.viewProfileText}>View profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonsView}>
                {ButtonsList.map((ele, index) => (
                        <TouchableOpacity style={styles.buttonsChildView} key={index} activeOpacity={0.8}>
                        <View style={styles.iconsView}>
                            <Icon name={ele.icon} size={20} color="black"/>
                        </View>
                            <Text style={{fontSize: 16}}>{ele.name}</Text>
                        </TouchableOpacity>
                ))}
            </View>
            {viewProfileModal && <ViewProfileModal setViewProfileModal={setViewProfileModal} fullName={fullName}
                                                   abbrevName={abbrevName}/>}
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    childContainer: {
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullNameText: {
        fontWeight: '700',
        fontSize: 24
    },
    nameAbbrevView: {
        marginVertical: 24,
        backgroundColor: '#ebeaea',
        height: 100,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 48,
        padding: 10
    },
    abbrevText: {
        fontSize: 30,
        fontWeight: '800'
    },
    viewProfile: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 48
    },
    viewProfileText: {
        color: 'white',
        fontSize: 16,
        marginHorizontal: 10
    },
    buttonsView: {
        justifyContent: 'flex-start',
        marginTop: 20,
        marginLeft: 40,
        gap: 20
    },
    buttonsChildView: {
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconsView: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#cdcaca',
        padding: 4
    }
})
export default Page