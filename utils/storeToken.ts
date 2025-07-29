import AsyncStorage from "@react-native-async-storage/async-storage";

const storeToken = async (token: string) => {
    if (!token) {
        throw new Error('Token needs to be specified')
    }
    try {
        await AsyncStorage.setItem("token", token)
    } catch (exp) {
        console.error("An error occurred when setting up token: ", exp)
    }
}

export default storeToken