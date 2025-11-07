import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen, LoginScreen, SignupAccountScreen, SignupPaymentScreen } from '../features/Auth'; 


const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignupAccount" component={SignupAccountScreen} />
        <Stack.Screen name="SignupPayment" component={SignupPaymentScreen} />
        </Stack.Navigator>
    );
}
