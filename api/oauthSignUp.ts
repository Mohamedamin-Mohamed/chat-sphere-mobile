import {OauthSignUp} from "../types/types";

const oauthSignUp = async (request: OauthSignUp, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/auth/signup/oauth`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}
export default oauthSignUp