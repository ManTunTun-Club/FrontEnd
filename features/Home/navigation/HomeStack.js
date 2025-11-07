import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AiChatbotHome from '../screens/AiChatbotHome'; // ✅ 你一定要匯入
import CartDraftScreen from '../screens/CartDraftScreen';
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* 這裡一定要匯入正確 component 才不會報錯 */}
      <Stack.Screen
        name="AiChatbotHome"
        component={AiChatbotHome}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CartDraft"
        component={CartDraftScreen}
        options={{ headerShown: true, title: '加入搜尋車' }}
      />
    </Stack.Navigator>
  );
}
