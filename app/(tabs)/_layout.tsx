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
                tabBarActiveTintColor: "#4F46E5",
                tabBarInactiveTintColor: "#6B7280",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 4,
                },
                tabBarStyle: {
                    height: 100,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: -2},
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 5,
                },
                tabBarShowLabel: true,
                headerShown: false,
                tabBarItemStyle: {
                    borderRadius: 8,
                    marginHorizontal: 4,
                },
                tabBarInactiveBackgroundColor: "transparent",
                tabBarIcon: ({color, size, focused}) => {
                    let iconName;

                    if (route.name === 'profile') {
                        iconName = 'person';
                    } else if (route.name === 'chat') {
                        iconName = 'forum';
                    } else if (route.name === 'chatbot') {
                        iconName = 'assistant';
                    } else if (route.name === 'search') {
                        iconName = 'search';
                    } else {
                        iconName = 'explore';
                    }

                    const activeSize = focused ? size + 2 : size;

                    return <Icon name={iconName} color={color} size={activeSize}/>;
                },
            })}
        >
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                    tabBarLabel: "Chat"
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarLabel: "Search"
                }}
            />
            <Tabs.Screen
                name="chatbot"
                options={{
                    title: "Assistant",
                    tabBarLabel: "Assistant"
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: "Discover",
                    tabBarLabel: "Discover"
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarLabel: "Profile"
                }}
            />
        </Tabs>


    );
};

export default DrawerLayout;