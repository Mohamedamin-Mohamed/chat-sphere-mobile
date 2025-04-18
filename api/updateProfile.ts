interface UpdateProfileType {
    email: string,
    newEmail?: string,
    name?: string,
    bio?: string,
    profileImage?: string | null,
    phoneNumber: string
}

const updateProfile = async (request: UpdateProfileType, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/profile/update`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}
export default updateProfile