import {UpdateProfileType} from "../types/types";
import createUploadFormData from "../utils/createUploadFormData";


const updateProfile = async (request: UpdateProfileType, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    const formData = createUploadFormData(request)
    return await fetch(`${url}/api/profile/update`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
    })
}
export default updateProfile