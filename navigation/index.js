import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ProfileScreen, WalletScreen} from '../features/Profile';
import {View, Text, Image, StyleSheet } from 'react-native';
import { BudgetScreen } from '../features/Budget';
import {CartScreen} from '../features/Cart';
import {CategoryScreen} from '../features/Category';

// Temporary "Home Screen" for testing navigation functionality
function HomePlaceholder() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>Home</Text>
    </View>
  );
}
function AIScreen() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>AI Screen</Text>
    </View>
  );
}

function ShoppingScreen() { 
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text>Budget Screen</Text>
    </View>
  );
}

// Cart Stack Navigator - handles cart-related pages
const CartStack = createNativeStackNavigator();
function CartStackNavigator() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CategoryList" component={CategoryScreen} />
      <CartStack.Screen name="CartDetail" component={CartScreen} />
    </CartStack.Navigator>
  );
}

// Footer navigation bar
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#49B0F8',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: { paddingVertical: 9 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: require('../assets/icons/footer_logo.png'),
            Shopping: require('../assets/icons/footer_shopping.png'),
            AI: require('../assets/icons/footer_ai.png'),
            Budget: require('../assets/icons/footer_budget.png'),
            Profile: require('../assets/icons/footer_profile.png'),
          };
          const iconSource = icons[route.name] || icons.Home;
          return (
            <Image
              source={iconSource}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePlaceholder} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Shopping" component={ShoppingScreen} options={{ tabBarLabel: 'Shop' }} />
      <Tab.Screen name="AI" component={AIScreen} options={{ tabBarLabel: 'AI' }} />
      <Tab.Screen name="Budget" component={BudgetScreen} options={{ tabBarLabel: 'Budget' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
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
       <Stack.Screen name="BudgetScreen" component={BudgetScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  icon: {
    width: 24,
    height: 24,
  },
});