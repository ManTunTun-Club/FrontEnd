// src/features/Budget/navigation/BudgetStacks.js 

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BudgetScreen from '../screens/BudgetScreen';
// 1. 引入新頁面
import BudgetCategoryScreen from '../screens/BudgetCategoryScreen';

const Stack = createNativeStackNavigator();

export default function BudgetStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 主畫面 */}
      <Stack.Screen name="BudgetMain" component={BudgetScreen} />
      
      {/* 2. 註冊購物車頁面 */}
      <Stack.Screen 
        name="CategoryCart" 
        component={BudgetCategoryScreen}
        // 可以選擇開啟原生滑動返回手勢
        options={{ gestureEnabled: true }} 
      />
    </Stack.Navigator>
  );
}