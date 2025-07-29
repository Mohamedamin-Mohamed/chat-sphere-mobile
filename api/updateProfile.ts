import {UpdateProfileType} from "../types/types";
import createUploadFormData from "../utils/createUploadFormData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const updateProfile = async (request: UpdateProfileType, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    const formData = createUploadFormData(request)
    const token = await AsyncStorage.getItem("token")

    if (!token) {
        throw new Error("No token available")
    }
    return await fetch(`${url}api/profile/update`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData,
        signal: controller.signal
    })
}
export default updateProfile