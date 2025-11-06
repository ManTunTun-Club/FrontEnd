// src/features/Budget/navigation/BudgetStacks.js //
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BudgetScreen from '../screens/BudgetScreen';


const Stack = createNativeStackNavigator();

export default function BudgetStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
    </Stack.Navigator>
  );
}
