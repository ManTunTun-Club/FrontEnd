<<<<<<< HEAD
// src/App.js
import React from 'react';
import RootNavigator from './navigation';
export default function App() {
  return <RootNavigator />;
=======
import React, { createContext, useContext, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const auth = useMemo(() => ({
    isSignedIn,
    signIn: () => setIsSignedIn(true),
    signOut: () => setIsSignedIn(false),
  }), [isSignedIn]);

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer>
        {isSignedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
>>>>>>> feature/wang-Auth-workflow-done
}
