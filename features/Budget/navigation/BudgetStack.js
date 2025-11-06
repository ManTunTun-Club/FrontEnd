// src/features/Budget/navigation/BudgetStacks.js 

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BudgetScreen from '../screens/BudgetScreen';
import BudgetCategoryScreen from '../screens/BudgetCategoryScreen';

const Stack = createNativeStackNavigator();

export default function BudgetStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BudgetMain" component={BudgetScreen} />
      <Stack.Screen 
        name="CategoryCart" 
        component={BudgetCategoryScreen}
        options={{ gestureEnabled: true }} 
      />
    </Stack.Navigator>
  );
}