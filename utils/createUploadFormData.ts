import {UpdateProfileType} from "../types/types";

const createUploadFormData = (request: UpdateProfileType) => {
    console.log('Request is ', request)
    const formData = new FormData();
    formData.append("email", request.email)
    formData.append("phoneNumber", request.phoneNumber)
    if (request.name !== undefined) formData.append("name", request.name);
    if (request.bio !== undefined) formData.append("bio", request.bio);
    if (request.newEmail !== undefined) formData.append("newEmail", request.newEmail);


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