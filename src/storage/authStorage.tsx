import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

const USER_KEY = 'USER_DATA';

export const saveUser = async (user: User) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};
