interface OauthSignUp {
    email?: string | null,
    name?: string,
    oauthId?: string,
    oauthProvider: string,
    picture?: string,
    emailVerified?: boolean,
    authorizationCode?: string | null,
    accessToken?: string,
    identityToken?: string | null
}

const oauthSignUp = async (request: OauthSignUp, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/http://localhost:8080/auth/signup/oauth`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}
export default oauthSignUp