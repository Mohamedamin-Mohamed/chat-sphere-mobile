import {Stack} from 'expo-router';

const RootLayout = () => {
    return (
        <Stack screenOptions={{headerShown: false, headerTitle: ''}}>
            <Stack.Screen name="index" options={{headerShown: false, headerTitle: ''}}/>
        </Stack>
    )
}

export default RootLayout