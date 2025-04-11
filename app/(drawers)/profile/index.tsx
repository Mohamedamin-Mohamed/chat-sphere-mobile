import {Button, Text, View} from "react-native";
import {useNavigation} from "expo-router";

const Page = ()=> {
    const navigation = useNavigation()
    return(
        <View>
            <Text>Hey there</Text>
            <Button title="Go Back" onPress={()=> navigation.goBack()} />
        </View>
    )
}
export default Page