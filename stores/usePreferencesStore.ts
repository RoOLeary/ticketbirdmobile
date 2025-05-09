import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// State and actions for managing app-wide preferences
interface PreferencesState {
  darkMode: boolean;              // Toggle for dark/light theme
  setDarkMode: (enabled: boolean) => void;  // Action to update theme preference
}

// Create preferences store with persistence to AsyncStorage
export const usePreferencesStore = create<PreferencesState>((set) => ({
  darkMode: false,  // Default to light theme
  
  // Update dark mode setting and persist to storage
  setDarkMode: async (enabled) => {
    set({ darkMode: enabled });
    await AsyncStorage.setItem('darkMode', JSON.stringify(enabled));
  },
}));

// Load saved preferences from storage on app initialization
AsyncStorage.getItem('darkMode').then(darkMode => {
  if (darkMode !== null) {
    usePreferencesStore.setState({ darkMode: JSON.parse(darkMode) });
  }
}); 