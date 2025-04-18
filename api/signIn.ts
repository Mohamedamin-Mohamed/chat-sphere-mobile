interface SignIn {
    email: string,
    password: string,
}

const signIn = async (signInRequest: SignIn, controller: AbortController)=>{
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/auth/signin/email`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(signInRequest),
        signal: controller.signal
    })
}
export default signIn