import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {useRouter} from "expo-router";
import {StyleSheet, View} from "react-native";
import {DrawerNavigationHelpers} from "@react-navigation/drawer/lib/typescript/module/src/types";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";

interface DrawerItemType {
    icon: string,
    label: string,
    navigateTo: string
}

const DrawerList: DrawerItemType[] =
    [
        {icon: 'home', label: 'Home', navigateTo: 'home'},
        {icon: 'chat', label: 'Chat', navigateTo: 'chat'},
        {icon: 'settings', label: 'Settings', navigateTo: 'settings'}
    ]

interface DrawerLayoutProps {
    navigation: DrawerNavigationHelpers,
    element: DrawerItemType,
    index: number
}

const DrawerLayout = ({navigation, element, index}: DrawerLayoutProps) => {
    return (
        <DrawerItem activeBackgroundColor="#5363df" activeTintColor='#fff' label={element.label}
                    icon={() => <Icon name={element.icon} color="#085bd8" size={30}/>}
                    onPress={() => navigation.navigate(element.navigateTo)}/>
    )
}

const DrawerItems = ({navigation}: { navigation: DrawerNavigationHelpers }) => {
    return (
        <>
            {DrawerList.map((element, index) => (
                <DrawerLayout key={index} navigation={navigation} element={element} index={index}/>
            ))}
        </>
    )
}
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const {navigation} = props
    const router = useRouter()
    const {top, bottom} = useSafeAreaInsets()
    const [user, setUser] = useState('')

    const getUser = async () => {
        const user = await AsyncStorage.getItem('user') ?? ''
        setUser(user)
    }
    const handleSignOut = () => {

    }

    useEffect(() => {
        console.log('user is ', user)
    }, [user]);
    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <View>

                </View>
                <View style={styles.drawerItemsView}>
                    <DrawerItems navigation={navigation}/>
                </View>
            </DrawerContentScrollView>
            <View style={{
                borderTopColor: '#dde3fe',
                borderTopWidth: 1,
                padding: 20,
                paddingBottom: 20 + bottom
            }}>
                <DrawerItem label="Sign Out" icon={() => <Icon name="exit-to-app" size={30}/>}
                            onPress={handleSignOut}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    headerText: {
        color: "#1f2329",
        fontSize: 22,
    },
    drawerItemsView: {
        borderTopWidth: 0.4,
        width: "95%",
        marginLeft: 10,
        marginVertical: 24,
        paddingTop: 20
    },
    signOutButton: {
        marginLeft: 10,
        marginVertical: 24,
    },
    drawerItemLabel: {
        fontSize: 20,
    }
})
export default CustomDrawerContent