import {Tabs, useNavigation} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import Feather from "@expo/vector-icons/Feather"

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
            })}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, size, focused}) => {
                        const activeSize = focused ? size + 2 : size
                        return <Feather name="message-square" size={activeSize} color={color}/>
                    }
                }}
            />
            <Tabs.Screen
                name="userchat"
                options={{
                    title: "Message",
                    tabBarLabel: "Chats",
                    tabBarIcon: ({color, size, focused}) => {
                        const activeSize = focused ? size + 2 : size
                        return <MaterialIcons name='chat' color={color} size={activeSize}/>
                    }
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarLabel: "Search",
                    tabBarIcon: ({color, size, focused}) => {
                        const activeSize = focused ? size + 2 : size
                        return <MaterialIcons name='person-search' color={color} size={activeSize}/>;
                    }
                }}
            />
            <Tabs.Screen
                name="chatbot"
                options={{
                    title: "Assistant",
                    tabBarLabel: "AI Assistant",
                    tabBarIcon: ({color, size, focused}) => {
                        const activeSize = focused ? size + 2 : size
                        return <Ionicons name='chatbubbles-outline' color={color} size={activeSize}/>;
                    }
                }}
            />
            {/*<Tabs.Screen*/}
            {/*    name="discover"*/}
            {/*    options={{*/}
            {/*        title: "Discover",*/}
            {/*        tabBarLabel: "Discover",*/}
            {/*        tabBarIcon: ({color, size, focused}) => {*/}
            {/*            const activeSize = focused ? size + 2 : size*/}
            {/*            return <Ionicons name='compass-outline' color={color} size={activeSize}/>;*/}
            {/*        }*/}
            {/*    }}*/}
            {/*/>*/}
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarLabel: "Profile",
                    tabBarIcon: ({color, size, focused}) => {
                        const activeSize = focused ? size + 2 : size
                        return <Ionicons name='person-outline' color={color} size={activeSize}/>;
                    }
                }}
            />
        </Tabs>


    );
};

export default DrawerLayout;