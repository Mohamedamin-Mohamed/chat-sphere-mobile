import {Drawer} from "expo-router/drawer";
import CustomDrawerContent from "../../components/CustomDrawerContent";
import {useNavigation} from "expo-router";

const DrawerLayout = () => {
    const navigation = useNavigation()
    return (
        <Drawer
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={({route}) => ({
                headerShown: true,
                drawerStyle: {
                    backgroundColor: "#f5f5f5"
                }

            })}
        >
        </Drawer>
    );
};

export default DrawerLayout;