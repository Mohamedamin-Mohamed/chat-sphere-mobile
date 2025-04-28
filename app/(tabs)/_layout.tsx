import {Tabs, useNavigation} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const DrawerLayout = () => {
    const navigation = useNavigation()
    return (
        // <Drawer
        //     drawerContent={props => <CustomDrawerContent {...props} />}
        //     screenOptions={({route}) => ({
        //         headerShown: true,
        //         drawerStyle: {
        //             backgroundColor: "#f5f5f5"
        //         }
        //
        //     })}
        // >
        // </Drawer>
        <Tabs
            screenOptions={({route}) => ({
                tabBarActiveTintColor: "black",
                tabBarLabelStyle: {fontSize: 14},
                tabBarStyle: {paddingHorizontal: 30},
                tabBarShowLabel: false,
                headerShown: false,
                tabBarIcon: ({color, size}) => {
                    let iconName;

                    if (route.name === 'profile') {
                        iconName = 'person';
                    } else if (route.name === 'chat') {
                        iconName = 'forum';
                    }
                    else if(route.name === 'chatbot'){
                        iconName = 'assistant'
                    }
                    else {
                        iconName = 'explore';
                    }

                    return <Icon name={iconName} color={color} size={size}/>;
                },
            })}
        >
            <Tabs.Screen name="chat"/>
            <Tabs.Screen name="chatbot" />
            <Tabs.Screen name="discover"/>
            <Tabs.Screen name="profile"/>
        </Tabs>


    );
};

export default DrawerLayout;