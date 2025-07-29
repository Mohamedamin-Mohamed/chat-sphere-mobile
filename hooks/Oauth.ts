import * as Google from "expo-auth-session/providers/google"
import * as AppleAuthentication from "expo-apple-authentication"

import {Dispatch, useEffect} from "react"
import {router} from "expo-router"
import Toast from "react-native-toast-message";
import {useDispatch} from "react-redux";
import {setUserInfo} from "../redux/userSlice";
import {UnknownAction} from "redux";
import sanitizeUser from "../utils/sanitizeUser";
import fetchUserInfo from "../api/fetchUserInfo";
import {OauthSignUp} from "../types/types";
import storeToken from "../utils/storeToken";
import api from "../api/api";


export const useGoogleOAuth = () => {
    const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID
    const [request, response, googlePromptAsync] = Google.useAuthRequest({
        iosClientId: IOS_CLIENT_ID,
    })
    const dispatch = useDispatch();

    useEffect(() => {
        if (response?.type === "success") {
            const {authentication} = response;
            if (authentication?.accessToken) {
                getUserInfo(authentication.accessToken, dispatch)
                    .catch(err => console.error(err));
            } else {
                console.error("No access token from Google auth response")
            }
        }
    }, [response]);

    return {googlePromptAsync}
}

export const getUserInfo = async (token: string, dispatch: Dispatch<UnknownAction>) => {
    if (!token) throw new Error("Token needs to be provided")
    try {
        const response = await fetchUserInfo(token)
        const user = await response.json()

        const request: OauthSignUp = {
            email: user.email,
            oauthId: user.id,
            oauthProvider: 'Google',
            name: user.name,
            picture: user.picture,
            emailVerified: user.verified_email ?? false,
            accessToken: token
        }

        await handleResponse(request, dispatch)

    } catch (exp: any) {
        if (exp.response) {
            const message = exp.response?.data?.message || exp.response?.statusText || 'Something went wrong';
            Toast.show({
                type: 'error',
                text1: message
            })
        } else {
            console.error('Failed to fetch user data:', exp)
        }
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

        const request: OauthSignUp = {
            email: credential.email,
            oauthProvider: 'Apple',
            name: name ?? '',
            authorizationCode: credential.authorizationCode,
            identityToken: credential.identityToken,
            oauthId: credential.user
        }
        await handleResponse(request, dispatch)
    } catch (exp: any) {
        if (exp.response) {
            const message = exp.response?.data?.message || exp.response?.statusText || 'Something went wrong';
            Toast.show({
                type: 'error',
                text1: message
            })
        } else {
            console.error('Network error, request cancelled')
        }
    }
}

const handleResponse = async (request: OauthSignUp, dispatch: Dispatch<UnknownAction>) => {
    const oauthResponse = await api.post('auth/signup/oauth', request)
    const data = oauthResponse.data
    const user = data.user
    const token = data.token
    await storeToken(token)
    const sanitizedUser = sanitizeUser(user)
    dispatch(setUserInfo(sanitizedUser))
    router.push('home')
}

