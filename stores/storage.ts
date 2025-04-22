import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Web storage implementation using localStorage
const webStorage = {
  // Read data from localStorage
  getItem: async (key: string): Promise<string | null> => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  
  // Write data to localStorage
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },
  
  // Remove data from localStorage
  removeItem: async (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },
};

// Native storage implementation using Expo's SecureStore
const nativeStorage = {
  // Read data from SecureStore
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  
  // Write data to SecureStore
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },
  
  // Remove data from SecureStore
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },
};

// Export platform-specific storage implementation
export const storage = Platform.select({
  web: webStorage,      // Use localStorage for web platform
  default: nativeStorage, // Use SecureStore for native platforms
});