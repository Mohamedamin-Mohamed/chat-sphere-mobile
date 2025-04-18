import {User} from "../types/types";
import {createSlice} from "@reduxjs/toolkit";

const initialState: User = {
    email: '',
    name: '',
    oauthProvider: '',
    picture: '',
    signupDate: '',
    bio: '',
    phoneNumber: ''
}

export const userSlice = createSlice({
    name: 'userInfo',
    initialState: initialState,
    reducers: {
        setUserInfo: (state, action) => {
            return {...state, ...action.payload}
        },
        clearUserInfo: () => initialState
    }
})

export default userSlice.reducer
export const {setUserInfo, clearUserInfo} = userSlice.actions



