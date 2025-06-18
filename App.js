import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    await AsyncStorage.setItem('token', 'some_token');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) return null; // loading indicator can be added here

  return (
    <NavigationContainer>
      <AppNavigator isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
    </NavigationContainer>
  );
}
