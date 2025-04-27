import * as Google from "expo-auth-session/providers/google"
import * as AppleAuthentication from "expo-apple-authentication"

import {Dispatch, useEffect} from "react"
import {router} from "expo-router"
import oauthSignUp from "../api/oauthSignUp";
import Toast from "react-native-toast-message";
import {useDispatch} from "react-redux";
import {setUserInfo} from "../redux/userSlice";
import {UnknownAction} from "redux";
import sanitizeUser from "../utils/sanitizeUser";
import fetchUserInfo from "../api/fetchUserInfo";
import {OauthSignUp} from "../types/types";

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID
export const useGoogleOAuth = () => {
    const [request, response, googlePromptAsync] = Google.useAuthRequest({
        iosClientId: IOS_CLIENT_ID,
    })
    const dispatch = useDispatch();

    useEffect(() => {
        if (response?.type === "success") {
            const {authentication} = response;
            if (authentication) {
                getUserInfo(authentication.accessToken, dispatch);
            }
        }
    }, [response]);

    return {googlePromptAsync}
}

export const getUserInfo = async (token: string, dispatch: Dispatch<UnknownAction>) => {
    if (!token) return
    try {
        const response = await fetchUserInfo(token)
        const user = await response.json()

        const request: OauthSignUp = {
            email: user.email,
            oauthId: user.id,
            oauthProvider: 'Google',
            name: user.name,
            picture: user.picture,
            emailVerified: user.verified_email,
            accessToken: token
        }
        await handleResponse(request, dispatch)

    } catch (err) {
        console.error('Failed to fetch user data:', err)
    }
}

export const signInWithApple = async (dispatch: Dispatch<UnknownAction>) => {
    try {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ]
        })

        const name = (credential.fullName?.givenName || '') + " " + (credential.fullName?.familyName || '');
        console.log('Credential is ', credential)
        const request: OauthSignUp = {
            email: credential.email,
            oauthProvider: 'Apple',
            name: name ?? '',
            authorizationCode: credential.authorizationCode,
            identityToken: credential.identityToken,
            oauthId: credential.user
        }

        await handleResponse(request, dispatch)
    } catch (e: any) {
        if (e.code === 'ERR_REQUEST_CANCELED') {
            console.error('Request cancelled')
        }
    }
}

const handleResponse = async (request: OauthSignUp, dispatch: Dispatch<UnknownAction>) => {
    const oauthResponse = await oauthSignUp(request, new AbortController());

    if (!oauthResponse.ok) {
        const message = await oauthResponse.text()
        Toast.show({
            type: 'error',
            text1: message
        })
    } else {
        const OauthResponse = await oauthResponse.json()
        const user = OauthResponse.user
        const sanitizedUser = sanitizeUser(user)
        dispatch(setUserInfo(sanitizedUser))
        router.push('chat')
    }
}

