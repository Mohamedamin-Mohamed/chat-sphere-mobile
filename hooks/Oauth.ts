import * as Google from "expo-auth-session/providers/google"
import * as AppleAuthentication from "expo-apple-authentication"

import {useEffect} from "react"
import {router} from "expo-router"

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID

export const useGoogleOAuth = () => {
    const [request, response, googlePromptAsync] = Google.useAuthRequest({
        iosClientId: IOS_CLIENT_ID,
    })

    useEffect(() => {
        if (response?.type === "success") {
            const {authentication} = response;
            if (authentication) {
                getUserInfo(authentication.accessToken);
            }
        }
    }, [response]);

    return {googlePromptAsync}
}

export const getUserInfo = async (token: string) => {
    if (!token) return
    try {
        const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const user = await response.json()

        const request = {
            email: user.email,
            oauthId: user.id,
            oauthProvider: 'Google',
            name: user.name,
            picture: user.picture,
            emailVerified: user.verified_email,
            accessToken: token
        }

        router.push({
            pathname: 'GetStarted',
            params: request
        })
    } catch (err) {
        console.error('Failed to fecth user data:', err)
    }
}

export const signInWithApple = async () => {
    try {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ]
        })

        const name = credential.fullName?.givenName
        const request = {
            email: credential.email,
            oauthProvider: 'Apple',
            name: name,
            authorizationCode: credential.authorizationCode,
            identityToken: credential.identityToken
        }

        router.push({
            pathname: 'GetStarted',
            params: request
        })


    } catch (e: any) {
        if (e.code === 'ERR_REQUEST_CANCELED') {
            console.log('Request cancelled')
        } else {
        }
    }

}