import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';

/* ================= AUTH CONTEXT ================= */
type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

/* ================= APP NAVIGATOR ================= */
const AppNavigator: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // ✅ HOOK ALWAYS AT TOP LEVEL
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('USER_TOKEN');
        setIsLoggedIn(!!token);
      } catch (e) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // ✅ RETURN AFTER HOOKS
  if (isLoggedIn === null) {
    return null; // yahan loader laga sakte ho
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {isLoggedIn ? <StackNavigator /> : <AuthNavigator />}
    </AuthContext.Provider>
  );
};

export default AppNavigator;
