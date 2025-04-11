import {Stack} from 'expo-router';
import store, {persistor} from "../redux/store";
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";

const RootLayout = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <Stack screenOptions={{headerShown: false, headerTitle: ''}}>
                    <Stack.Screen name="index" options={{headerShown: false, headerTitle: ''}}/>
                </Stack>
            </PersistGate>
        </Provider>

    )
}

export default RootLayout