import {Stack} from 'expo-router';

const AuthLayout = () => {
    return (
        <Stack screenOptions={{title: ''}}>
            <Stack.Screen name="Welcome" options={{headerTitle: ''}}/>
            <Stack.Screen name="SignIn" options={{headerTitle: '', headerShown: false}}/>
            <Stack.Screen name="SignUp" options={{headerTitle: '', headerShown: false}}/>
            <Stack.Screen name="EmailLookup" options={{headerTitle: '', headerShown: false}}/>
            <Stack.Screen name="GetStarted" options={{headerTitle: 'Get started', headerTitleAlign: "left"}}/>
        </Stack>
    )
}

export default AuthLayout