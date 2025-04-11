import {combineReducers} from "redux";
import userSlice from "./userSlice";
import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from 'redux-persist'
import AsyncStorage from "@react-native-async-storage/async-storage";

const rootReducer = combineReducers({
    userInfo: userSlice
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),

})

export const persistor = persistStore(store)
export default store