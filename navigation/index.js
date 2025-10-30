import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ProfileScreen, WalletScreen} from '../features/Profile';
import {View, Text} from 'react-native';

//暫時「首頁畫面」，測試導覽功能
function HomePlaceholder() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>Home</Text>
    </View>
  );
}

//footer導覽列
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomePlaceholder} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}