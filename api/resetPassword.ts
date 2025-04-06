interface PasswordResetRequest {
    email: string,
    password: string
}

const resetPassword = async (request: PasswordResetRequest, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/auth/password_reset`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}

export default resetPassword