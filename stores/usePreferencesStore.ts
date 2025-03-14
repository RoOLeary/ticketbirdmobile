import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PreferencesState {
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  darkMode: false,
  setDarkMode: async (enabled) => {
    set({ darkMode: enabled });
    await AsyncStorage.setItem('darkMode', JSON.stringify(enabled));
  },
}));

// Initialize preferences from storage
AsyncStorage.getItem('darkMode').then((value) => {
  if (value !== null) {
    usePreferencesStore.setState({ darkMode: JSON.parse(value) });
  }
}); 