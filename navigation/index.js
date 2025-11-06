
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet } from 'react-native';

// 子域 Stacks
//import HomeStack from '../screens/Home/navigation/HomeStack';       // Home
import ProfileStack from '../features/Profile/navigation/ProfileStack';
import BudgetStack from '../features/Budget/navigation/BudgetStack'; // Budget
//import AIStack from '../screens/AI/navigation/AIStack';             // AI
import ShopStack from '../features/Shop/navigation/ShopStack'; // Shop (Cart & Category)

import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function HomePlaceholder() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>Home Placeholder</Text>
    </View>
  )
}

function AIPlaceholder() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>AI Placeholder</Text>
    </View>
  )
}

// function BudgetPlaceholder() {
//   return (
//     <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
//       <Text>Budget Placeholder</Text>
//     </View>
//   );
// }

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#49B0F8',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: { paddingVertical: 9 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomeTab: require('../assets/icons/footer_logo.png'),
            ShopTab: require('../assets/icons/footer_shopping.png'),
            AITab: require('../assets/icons/footer_ai.png'),
            BudgetTab: require('../assets/icons/footer_budget.png'),
            ProfileTab: require('../assets/icons/footer_profile.png'),
          };
          const iconSource = icons[route.name] || icons.HomeTab;
          return (
            <Image
              source={iconSource}
              style={{ tintColor: color, width: size, height: size }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      {/* 改component={}裡的內容 */}
      <Tab.Screen name="HomeTab" component={HomePlaceholder} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="ShopTab" component={ShopStack} options={{ tabBarLabel: 'Shop' }} />
      <Tab.Screen name="AITab" component={AIPlaceholder} options={{ tabBarLabel: 'AI' }} />
      <Tab.Screen name="BudgetTab" component={BudgetStack} options={{ tabBarLabel: 'Budget' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        {/* 若有全域 Modal/Sheet 畫面，在這裡掛（非屬於單一功能域的） */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    height: 84,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 5,
  },
});