const verifyCode = async (email: string, code: string, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/auth/verify?email=${email}&code=${code}`, {
        method: 'GET',
        signal: controller.signal
    })
}
export default verifyCode