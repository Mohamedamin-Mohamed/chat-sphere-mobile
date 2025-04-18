interface PasswordResetRequest {
    email: string,
    password: string
}

interface PasswordUpdateRequest {
    email: string,
    currentPassword: string,
    newPassword: string
}

type GenericPasswordRequest = PasswordResetRequest | PasswordUpdateRequest

const resetPassword = async (request: GenericPasswordRequest, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/auth/password/reset`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}

export default resetPassword