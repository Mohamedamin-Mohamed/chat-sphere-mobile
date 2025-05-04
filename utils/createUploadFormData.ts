import {UpdateProfileType} from "../types/types";

const createUploadFormData = (request: UpdateProfileType) => {
    const formData = new FormData();
    formData.append("email", request.email)
    formData.append("phoneNumber", request.phoneNumber)
    formData.append("name", request.name ?? '')
    formData.append("newEmail", request.newEmail ?? '')
    formData.append("bio", request.bio ?? '')

    if (request.profilePictureDetails !== null) {
        formData.append("profilePictureDetails", {
            name: request.profilePictureDetails?.fileName,
            uri: request.profilePictureDetails?.file.uri,
            type: request.profilePictureDetails?.file.mimeType,
        } as any)
    }
    return formData
}

export default createUploadFormData