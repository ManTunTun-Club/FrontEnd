import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from '../screens/CategoryScreen';
import CartScreen from '../../Cart/screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen name="CartDetail" component={CartScreen} />
      {/* 未來 Shop 區內的其它畫面也掛在這 */}
    </Stack.Navigator>
  );
}