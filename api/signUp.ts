interface Signup {
    email: string,
    name: string
    password: string,

}

const signUp = async (signupRequest: Signup, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/auth/signup/email`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(signupRequest),
        signal: controller.signal
    })
}
export default signUp