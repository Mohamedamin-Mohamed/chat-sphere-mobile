import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../redux/store";
import {RootState} from "../types/types";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))

api.interceptors.response.use(
    response => response,
    async error => {
        const status = error.response?.status;
        const body = error.response?.data;
        const originalRequest = error.config;
        if (status === 401 && body === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            originalRequest._retry = true;
            await AsyncStorage.removeItem("token")
            try {
                const state: RootState = store.getState();
                const user = state.userInfo;
                const email = user.email
                const refreshResponse = await api.get(`auth/refresh-token/${email}`);
                const newToken = refreshResponse.data?.token;

                if (newToken) {
                    await AsyncStorage.setItem("token", newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api.request(originalRequest);
                } else {
                    throw new Error('No token received from refresh');
                }
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                delete originalRequest._retry
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
);


export default api