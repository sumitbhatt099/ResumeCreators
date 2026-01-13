import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PermissionsAndroid, Platform } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/components/Toast/ToastContext';

/* ================= PERMISSION HANDLER ================= */
const requestAllPermissions = async () => {
  if (Platform.OS !== 'android') return;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    console.log('Permissions Result:', granted);
  } catch (error) {
    console.warn('Permission error:', error);
  }
};

const App: React.FC = () => {

  /* 🔥 APP OPEN HOTE HI PERMISSION */
  useEffect(() => {
    requestAllPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;
