const emailLookup = async (email: string, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    console.log('Url is ', url)
    return await fetch(`${url}/auth/email_lookup/generate_code?email=${email}`, {
        method: 'GET',
        signal: controller.signal
    })
}
export default emailLookup