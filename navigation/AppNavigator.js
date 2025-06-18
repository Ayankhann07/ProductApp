import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddProductScreen from '../screens/AddProductScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ isLoggedIn, onLogin, onLogout }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} onLogin={onLogin} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} onLogout={onLogout} />}
          </Stack.Screen>
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
